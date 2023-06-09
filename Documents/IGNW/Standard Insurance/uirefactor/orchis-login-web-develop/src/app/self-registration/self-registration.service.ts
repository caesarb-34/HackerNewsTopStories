import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {Subject} from 'rxjs';
import {fromPromise} from 'rxjs/internal-compatibility';
import {timeout} from 'rxjs/operators';
import { CloudentityJs } from 'cloudentityjs';

import { UserRegistrationModel } from '../shared/models/user.registration.model';
import { GlobalConstants } from '../shared/global-constants';


@Injectable()
export class SelfRegistrationService {
  private cjs: CloudentityJs;
  public newUserObject: UserRegistrationModel = new UserRegistrationModel();
  private isMobile: boolean;

  // Observable string sources
  private pageStepSource = new Subject<number>();
  private errorMessageSource = new Subject<string>();

  // Observable string streams
  pageStepObservable = this.pageStepSource.asObservable();
  errorMessageObservable = this.errorMessageSource.asObservable();

  constructor(
    private router: Router
  ) {
    this.cjs = new CloudentityJs({
      devicePrint: true,
      policy: '1FA_AUTHENTICATED',
      apiPrefix: '/ui'
    });
  }

  // Observable management
  public syncPageStep(pageStep: number) {
    this.pageStepSource.next(pageStep);
  }

  public syncErrorMessage(errorMessage: string) {
    this.errorMessageSource.next(errorMessage);
  }

  // information added to object from step 1
  public setNewUserInformation(updatedUserModel: UserRegistrationModel) {
    this.newUserObject.firstName = updatedUserModel.firstName;
    this.newUserObject.lastName = updatedUserModel.lastName;
    this.newUserObject.email = updatedUserModel.email;
    this.newUserObject.isMobile = updatedUserModel.isMobile;
    if (this.newUserObject.isMobile) {
      this.newUserObject.mobile = updatedUserModel.mobile;
      this.newUserObject.phone = undefined;
    } else {
      this.newUserObject.phone = updatedUserModel.mobile;
      this.newUserObject.mobile = undefined;
    }
  }

  // information added to object from step 2
  public setNewUserIdAndPassword(updatedUserModel: UserRegistrationModel) {
    this.newUserObject.uid = updatedUserModel.uid;
    this.newUserObject.password = updatedUserModel.password;
  }

  public getUserInformation(): UserRegistrationModel {
    return this.newUserObject;
  }

  public registerUser(routeForNextPage: string) {
    // save the isMobile Data just in case
    this.isMobile = this.newUserObject.isMobile;

    // remove the isMobile Key so that the cjs call can be made
    delete this.newUserObject['isMobile'];

    // make the call
    this.registerCall(this.newUserObject).subscribe(
      (successfullyRegister) => {
        this.router.navigate([routeForNextPage]);
      },
      (registerError) => {
        this.syncErrorMessage(registerError.status);
        // replace the isMobile Key just in case they want to go back a page
        this.newUserObject['isMobile'] = this.isMobile;
      }
    );
  }

  public registerCall(userObject: UserRegistrationModel) {
    return fromPromise(
      this.cjs.register({
        newUser: userObject
      })
    ).pipe(
        timeout(GlobalConstants.DEFAULT_TIMEOUT)
    );
  }


}

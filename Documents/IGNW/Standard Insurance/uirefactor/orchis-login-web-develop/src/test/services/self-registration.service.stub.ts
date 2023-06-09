import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {UserRegistrationModel} from '../../app/shared/models/user.registration.model';

export class Utils {
  authErrorHandler() { }
}

export class CloudentityJs {
  utils: Utils = new Utils();
  getSession = () => of({});
  validatePolicy = () => of({});
}

@Injectable()
export class SelfRegistrationServiceStub {
  public newUser: UserRegistrationModel = new UserRegistrationModel();
  private _register: Observable<any> = of({});

  public setNewUserInformation(value: UserRegistrationModel) {
    this.newUser = value;
  }

  public getUserInformation(): UserRegistrationModel {
    return this.newUser;
  }

  public syncPageStep(pageStep: number) { }

  public syncErrorMessage(errorMessage: string) { }

  public setNewUserIdAndPassword(updatedUserModel: UserRegistrationModel) {
    this.newUser.uid = updatedUserModel.uid;
    this.newUser.password = updatedUserModel.password;
  }

  public register() {
    return this._register;
  }

  set setRegister(value: Observable<any>) { this._register = value; }
}

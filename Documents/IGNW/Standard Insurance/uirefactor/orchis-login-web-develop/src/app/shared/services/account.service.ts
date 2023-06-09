import {Injectable} from '@angular/core';
import {CloudentityJs} from 'cloudentityjs';
import {Observable} from 'rxjs';
import {fromPromise} from 'rxjs/internal-compatibility';
import {map, timeout} from 'rxjs/operators';
import {IResponse} from 'cloudentityjs/dist/typings/core/Request';

import {GlobalConstants} from '../global-constants';
import User from '../models/user.model';


@Injectable()
export class AccountService {

  public cjs: CloudentityJs;

  constructor() {

    this.cjs = new CloudentityJs({
      devicePrint: true,
      policy: '1FA_AUTHENTICATED',
      apiPrefix: '/ui'
    });
  }

  public getUser(): Observable<User> {
    return fromPromise(this.cjs.getUser()).pipe(
      map( response => {
        return response.data as User;
      }),
      timeout(GlobalConstants.DEFAULT_TIMEOUT)
    );
  }

  public activateUser(code: string, password?: string): Observable<any> {
    const data = { body: { code: code } };

    if (password) {
      data.body['password'] = password;
    }

    return fromPromise(this.cjs.activateByEmail(data)).pipe(
      timeout(GlobalConstants.DEFAULT_TIMEOUT)
    );
  }

  public resendActivationEmail(code?: string, identifier?: string, destination?: string): Observable<any> {
    let data = null;
    if (code) {
      data = { body: { code: code } };
    } else {
      data = { body: { identifier: identifier, destination: destination, destinationType: 'E' } };
    }
    return fromPromise(this.cjs.resendActivationEmail(data)).pipe(
      timeout(GlobalConstants.DEFAULT_TIMEOUT)
    );
  }

  public updateAndGenerateVerification(user: User): Observable<IResponse[]> {
    return fromPromise( this.cjs.updateAndGenerateVerification({ user: user }) ).pipe(
      timeout(GlobalConstants.DEFAULT_TIMEOUT)
    );
  }

  public updateUser(user: User): Observable<IResponse> {
    return fromPromise(
      this.cjs.updateUser({ user: user })
    ).pipe(
      timeout(GlobalConstants.DEFAULT_TIMEOUT)
    );
  }

  public listDevices(): Observable<IResponse> {
    return fromPromise( this.cjs.listDevices() ).pipe(
      timeout((GlobalConstants.DEFAULT_TIMEOUT))
    );
  }
}

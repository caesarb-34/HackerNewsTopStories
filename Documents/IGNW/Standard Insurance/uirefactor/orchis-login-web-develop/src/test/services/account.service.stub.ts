import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import User from '../../app/shared/models/user.model';
import {IResponse} from 'cloudentityjs/dist/typings/core/Request';

class Utils {
  authErrorHandler() { }
}

class CloudentityJs {
  utils: Utils = new Utils();
  getSession = () => of({});
  validatePolicy = () => of({});
}

@Injectable()
export class AccountServiceStub {

  // Private Vars
  private _user: User;
  private _getUserObs: Observable<any> = of({ status: 200 });
  private _updateUserObs: Observable<any> = of({ status: 200 });
  private _removeIdObs: Observable<any> = of({ status: 200 });
  private _listDevicesObs: Observable<any> = of({status: 200});
  private _updateAndGenObs: Observable<any> = of({status: 200});
  private _reSendActivationEmail: Observable<any> = of({status: 200});
  private _activateUser: Observable<any> = of({status: 200});

  public cjs: CloudentityJs;

  constructor() {

    this.cjs = new CloudentityJs();
  }

  public getUser(): Observable<User> {
    return this._getUserObs;
  }


  public updateUser(user: User): Observable<IResponse> {
    return this._updateUserObs;
  }

  public updateAndGenerateVerification(user: User): Observable<IResponse[]> {
    return this._updateAndGenObs;
  }

  public removeIdentifiers(identifierToRemove: any): Observable<IResponse> {
    return this._removeIdObs;
  }

  public listDevices(): Observable<IResponse> {
    return this._listDevicesObs;
  }

  public activateUser(code: string, password?: string): Observable<any> {
    return this._activateUser;
  }

  public reSendActivationEmail(code: string): Observable<any> {
    return this._reSendActivationEmail;
  }

  set setUserObs(value: Observable<User>)  { this._getUserObs = value; }
  set setUpdateReturnObs(value: Observable<any>)  { this._updateUserObs = value; }
  set setRemoveIdObs(value: Observable<any>)  { this._removeIdObs = value; }
  set setListDevicesObs(value: Observable<any>) { this._listDevicesObs = value; }
  set setUpdateAndGenObs(value: Observable<any>) { this._updateAndGenObs = value; }
  set setActivateUser(value: Observable<any>) { this._activateUser = value; }
  set setResendActivationEmail(value: Observable<any>) { this._reSendActivationEmail = value; }

}

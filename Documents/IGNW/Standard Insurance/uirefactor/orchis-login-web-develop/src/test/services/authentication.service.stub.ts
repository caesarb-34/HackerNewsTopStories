import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';

export class Utils {
  authErrorHandler() { }
}

export class CloudentityJs {
  utils: Utils = new Utils();
  getSession = () => of({});
  validatePolicy = () => of({});
}

/**
 * This class stubs out the Angular Authentication Service, which is a wrapper around the
 * cloudentityjs api.
 *
 * To use this class set the observable return values in your 'it' statement:
 *   it('should...', () => {
 *    // Set the Observable success value to be returned by the authentication service method
 *    authService.setCheckIfAuthObs = of({code: 200});
 *
 *    // Set the Observable error value to be returned by the authentication service method
 *    authService.setCheckIfAuthObs = throwError(new Error());
 *   })
 */
@Injectable()
export class AuthenticationServiceStub {
  private static myHomeUrl: string = '';

  public cloudentity = new CloudentityJs();
  private customerSupportUrl: string = '';
  public errorStatusCode: string;
  private recoveryHandler;
  private errorHandler;
  public HOME_PAGE: string = 'https://www.standard.com';
  public GOTO_POLICY: string = 'CAN_REDIRECT_TO_GOTO';
  public FORCED_DATA_COLLECTION_AUTHZ_POLICY = 'USER_PROFILE_COMPLETE';

  // test setup values
  private _checkIfAuthObs: Observable<any> = of({status: 202});
  private _validatePolicyObs: Observable<any> = of({status: 202});
  private _loginObs: Observable<any> = of({status: 200});
  private _requestResetPassObs: Observable<any> = of({status: 202});
  private _confirmResetPassObs: Observable<any> = of({status: 204});
  private _checkUriPolicyObs: Observable<any> = of({status: 200});
  private _sendAuthenticationOtp: Observable<any> = of({status: 200});
  private _authenticateWithOtp: Observable<any> = of({status: 200});
  private _confirmOtpMfaSetup: Observable<any> = of({status: 200});

  // for getUser
  private _getUserObs: Observable<any> = of({status: 200});
  private _updateUserObs: Observable<any> = of({status: 200});
  private _removeIdentifiersObs: Observable<any> = of({status: 200});
  private _verifySessionObs: Observable<any> = of({status: 200});
  private _logoutObs: Observable<any> = of({status: 200});
  private _setupOtpMfa: Observable<any> = of({status: 200});
  private _verifyEmailObs: Observable<any> = of({status: 200});
  private _setMaskedUserIdentifiers: Observable<any> = of({status: 200});
  private _recoverUsername: Observable<any> = of({status: 200});
  private _acceptEula: Observable<any> = of({status: 200});
  private _confirmVerifyIdentifier: Observable<any> = of({status: 200});

  public checkIfAuthenticated() {
    return this._checkIfAuthObs;
  }

  public checkUriPolicy(value) {
    return this._checkUriPolicyObs;
  }

  public login(userName: string, userPassword: string): Observable<any> {
    return this._loginObs;
  }

  public requestResetPassword(identifier: string, email: string): Observable<any> {
    return this._requestResetPassObs;
  }

  public confirmResetPassword(otpCode: string, password: string): Observable<any> {
    return this._confirmResetPassObs;
  }

  public validateAuthzPolicy(policyName: string): Observable<any> {
    return this._validatePolicyObs;
  }

  public getUser(): Observable<any> {
    return this._getUserObs;
  }

  public verifyEmail(email: string): Observable<any> {
    return this._verifyEmailObs;
  }

  public updateUser(): Observable<any> {
    return this._updateUserObs;
  }

  public removeIdentifiers(value: any): Observable<any> {
    return this._removeIdentifiersObs;
  }

  public verifySession(): Observable<any> {
    return this._verifySessionObs;
  }

  public logout(): Observable<any> {
    return this._logoutObs;
  }

  public setupOtpMfa(mfaPreferenceObject: any): Observable<any> {
    return this._setupOtpMfa;
  }

  public confirmOtpMfaSetup(): Observable<any> {
    return this._confirmOtpMfaSetup;
  }

  public sendAuthenticationOtp(): Observable<any> {
    return this._sendAuthenticationOtp;
  }

  public authenticateWithOtp(): Observable<any> {
    return this._authenticateWithOtp;
  }

  public getMaskedUserIdentifiers(): Observable<any> {
    return this._setMaskedUserIdentifiers;
  }

  public recoverUserName(identifier: string): Observable<any> {
    return this._recoverUsername;
  }

  public acceptEula(): Observable<any> {
    return this._acceptEula;
  }

  public confirmVerifyIdentifier(): Observable<any> {
    return this._confirmVerifyIdentifier;
  }


  // ======= Setters ========
  set verifyEmailObs(value: Observable<any>) {
    this._verifyEmailObs = value;
  }

  set setCheckIfAuthObs(value: Observable<any>) {
    this._checkIfAuthObs = value;
  }

  set setValidatePolicyObs(value: Observable<any>) {
    this._validatePolicyObs = value;
  }

  set setLogin(value) {
    this._loginObs = value;
  }

  set setRequestResetPassObs(value: Observable<any>) {
    this._requestResetPassObs = value;
  }

  set setConfirmResetPassObs(value: Observable<any>) {
    this._confirmResetPassObs = value;
  }

  set setCheckUriPolicyObs(value: Observable<any>) {
    this._checkUriPolicyObs = value;
  }

  set setGetUserObs(value: Observable<any>) {
    this._getUserObs = value;
  }

  set setUpdateUserObs(value: Observable<any>) {
    this._updateUserObs = value;
  }

  set setremoveIdentifiersObs(value: Observable<any>) {
    this._removeIdentifiersObs = value;
  }

  set setVerifySessionObs(value: Observable<any>) {
    this._verifySessionObs = value;
  }

  set setLogoutUserObs(value: Observable<any>) {
    this._logoutObs = value;
  }

  set setSetupOtpMfa(value: Observable<any>) {
    this._setupOtpMfa = value;
  }

  set setGetMaskedUserIdentifiers(value: Observable<any>) {
    this._setMaskedUserIdentifiers = value;
  }

  set setConfirmOtpMfaSetup(value: Observable<any>) {
    this._setupOtpMfa = value;
  }

  set setSendAuthenticationOtp(value: Observable<any>) {
    this._sendAuthenticationOtp = value;
  }

  set setAuthenticateWithOtp(value: Observable<any>) {
    this._authenticateWithOtp = value;
  }

  set setRecoverUserName(value: Observable<any>) {
    this._recoverUsername = value;
  }

  set setAcceptEula(value: Observable<any>) {
    this._acceptEula = value;
  }

  set setConfirmVerifyIdentifier(value: Observable<any>) {
    this._confirmVerifyIdentifier = value;
  }
}

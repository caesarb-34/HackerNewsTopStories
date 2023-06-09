import {waitForAsync, ComponentFixture, TestBed} from '@angular/core/testing';
import {By, Title} from '@angular/platform-browser';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { NgIdleModule } from '@ng-idle/core';
import { TextMaskModule } from 'angular2-text-mask';
import {ModalModule} from 'ngx-bootstrap/modal';
import {of, throwError} from 'rxjs';
import {MockIdleTimeoutComponent} from '../../../test/mock-idle-timeout.component';
import {createSpyObjFromClass} from '../../../test/test.helper';

import { MfaCodeComponent } from './mfa-code.component';

import { MessagePopupComponent } from '../../shared-components/message-popup/message-popup.component';
import { AuthenticationService } from 'sfg-ng-brand-library';
import { ActivatedRouteStub } from '../../../test/router-stubs';


describe('MfaCodeComponent', () => {
  let component: MfaCodeComponent;
  let fixture: ComponentFixture<MfaCodeComponent>;
  let titleService: Title;
  let authService: jasmine.SpyObj<AuthenticationService>;
  let activatedRoute;
  let spyVerifySession: jasmine.Spy;

  const testGetUserData = {
    data: { uid: 'venkata_int', }
  };

  const router = {
    navigate: jasmine.createSpy('navigate')
  };
  const resultFromGetMaskedUser = {
    data: {
      emails: [{
        key: 'f4dc3deb-0f52-4df6-9097-e16ec339cc92',
        masked: 'd*********e@s*******.com',
        isDefault: true,
        isVerified: true
      }, {
        key: '1ff79c5b-77c2-470a-84e5-86c3d0dde9a0',
        masked: 'i**********s@g****.com',
        isDefault: false,
        isVerified: false
      }],
      otpMethod: 'E',
      mobiles: [{
        key: 'b4af38e5-2678-4e47-8b6c-67b593d32944',
        masked: '******7890',
        isDefault: false,
        isVerified: false
      }, {
        key: '1521cd47-377d-4f52-9594-bc7270e41dde',
        masked: '******7891',
        isDefault: false,
        isVerified: false
      }],
      phones: [{
        key: '43be4b2c-2281-420f-9936-759da03afad7',
        masked: '******3211',
        isDefault: false,
        isVerified: false
      }, {
        key: '7ffc6e9b-6705-48e7-8fa7-413de9225a46',
        masked: '******3210',
        isDefault: false,
        isVerified: false
      }],
      otpMfaDestination: 'f4dc3deb-0f52-4df6-9097-e16ec339cc92'
    }
  };


  beforeEach(waitForAsync(() => {
    activatedRoute = new ActivatedRouteStub();
    activatedRoute.testQueryParams = {mfaOrigin: '', otpChanel: '', key: ''};
    authService = createSpyObjFromClass(AuthenticationService);

    TestBed.configureTestingModule({
      declarations: [
        MfaCodeComponent,
        MessagePopupComponent,
        MockIdleTimeoutComponent
      ],
      imports: [
        RouterModule,
        FormsModule,
        TextMaskModule,
        NgIdleModule.forRoot(),
        ModalModule.forRoot()
      ],
      providers: [
        { provide: AuthenticationService, useValue: authService },
        { provide: Router, useValue: router },
        { provide: ActivatedRoute, useValue: activatedRoute },
        { provide: Title, useClass: Title}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MfaCodeComponent);
    component = fixture.componentInstance;

    authService = TestBed.inject(AuthenticationService) as jasmine.SpyObj<AuthenticationService>;
    authService.verifySession.and.returnValue(of({status: 200, headers: null, data: undefined}));
    authService.getMaskedUserIdentifiers.and.returnValue(of({status: 200, headers: null, data: resultFromGetMaskedUser}));
    spyVerifySession = authService.verifySession
    .and.returnValue(of({ status: 200, headers: undefined, data: undefined }));
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should set the title to \"Enter code \| The Standard\"', () => {
    titleService = TestBed.inject(Title);
    fixture.detectChanges();

    expect(titleService.getTitle()).toBe('Enter code | The Standard');
  });

  it('should call getUserInformationSetDisplay if validSession returns a success', () => {
    authService.verifySession.and.returnValue(of({ status: 200, headers: null, data: undefined }));
    const spyGetUserInformationSetDisplay = spyOn(component, 'getUserInformationSetDisplay');

    component.verifySession();
    fixture.detectChanges();

    expect(spyGetUserInformationSetDisplay).toHaveBeenCalled();
  });

  it('should redirect to login if validSession returns an error', () => {
    authService.verifySession.and.returnValue(throwError(new Error()));

    component.verifySession();
    fixture.detectChanges();

    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should set the initial parameters of the display for enrollment workflow', () => {
    activatedRoute.testQueryParams = {mfaOrigin: 'enrollment'};

    component.initializeSettings();
    fixture.detectChanges();

    expect(component.mfaOriginParam).toBe('enrollment');
    expect(component.otpMethodParam).toBe(undefined);
    expect(component.otpMfaDestinationKeyParam).toBe(undefined);
    expect(component.mfaEnrollmentStatus).toBeTruthy();
  });

  it('should set the initial parameters of the display for untrustedDevice/challenge workflow', () => {
    activatedRoute.testQueryParams = {mfaOrigin: 'untrustedDevice', otpChannel: 'M', key: 'LongKey'};

    component.initializeSettings();
    fixture.detectChanges();

    expect(component.mfaOriginParam).toBe('untrustedDevice');
    expect(component.otpMethodParam).toBe('M');
    expect(component.otpMfaDestinationKeyParam).toBe('LongKey');
    expect(component.mfaAuthenticated).toBeTruthy();
  });

  it('should set the initial parameters of the display no enrollment', () => {
    activatedRoute.testQueryParams = {mfaOrigin: ''};

    component.initializeSettings();
    fixture.detectChanges();

    expect(component.activeError).toBe(400);
  });

  it('should call setMaskedUserPreferences and setDisplay if getMaskedUserIdentifiers returns a success', () => {
    authService.getMaskedUserIdentifiers.and.returnValue(of({status: 200, headers: null, data: resultFromGetMaskedUser}));
    const spySetMaskedUserPreferences = spyOn(component, 'setMaskedUserPreferences');
    const spySetDisplay = spyOn(component, 'setDisplay');

    component.getUserInformationSetDisplay();
    fixture.detectChanges();

    expect(spySetMaskedUserPreferences).toHaveBeenCalled();
    expect(spySetDisplay).toHaveBeenCalled();
    expect(component.isWaiting).toBeFalsy();
  });

  it('should set activeError on getMaskedUserIdentifiers error', () => {
    authService.getMaskedUserIdentifiers.and.returnValue(throwError({status: 400}));
    const spySetMaskedUserPreferences = spyOn(component, 'setMaskedUserPreferences');

    component.getUserInformationSetDisplay();
    fixture.detectChanges();

    expect(spySetMaskedUserPreferences).not.toHaveBeenCalled();
    expect(component.activeError).toBe(400);
  });

  it('should setMaskedUserPreferences with resultFromGetMaskedUser', () => {
    component.otpMethodParam = undefined;
    component.otpMfaDestinationKeyParam = undefined;

    component.setMaskedUserPreferences(resultFromGetMaskedUser);
    fixture.detectChanges();

    expect(component.otpMethod).toBe('E');
    expect(component.otpMfaDestinationKey).toBe('f4dc3deb-0f52-4df6-9097-e16ec339cc92');
  });

  it('should setMaskedUserPreferences with result from URL Params', () => {
    component.otpMethodParam = 'O';
    component.otpMfaDestinationKeyParam = 'Long Key';

    component.setMaskedUserPreferences(resultFromGetMaskedUser);
    fixture.detectChanges();

    expect(component.otpMethod).toBe('O');
    expect(component.otpMfaDestinationKey).toBe('Long Key');
  });

  it('should focus on sixDigitOtpCode input when page loads successfully', () =>  {
    authService.getMaskedUserIdentifiers.and.returnValue(of({status: 200, headers: null, data: {}}));
    component.getUserInformationSetDisplay();
    fixture.detectChanges();
    const sixDigitInput = fixture.debugElement.queryAll(By.css('#sixDigitOtpCode'));

    expect(sixDigitInput[0].nativeElement).toEqual(document.activeElement);
  });

  describe('===> setDisplay()', () => {
    let getMaskedUserObject;

    beforeEach(() => {
      getMaskedUserObject = {
        data: {
          emails: [{
            key: 'f4dc3deb-0f52-4df6-9097-e16ec339cc92',
            masked: 'd*********e@s*******.com',
            isDefault: true,
            isVerified: true
          }, {
            key: '1ff79c5b-77c2-470a-84e5-86c3d0dde9a0',
            masked: 'i**********s@g****.com',
            isDefault: false,
            isVerified: false
          }],
          otpMethod: 'E',
          mobiles: [{
            key: 'b4af38e5-2678-4e47-8b6c-67b593d32944',
            masked: '******7890',
            isDefault: false,
            isVerified: false
          }, {
            key: '1521cd47-377d-4f52-9594-bc7270e41dde',
            masked: '******7891',
            isDefault: false,
            isVerified: false
          }],
          phones: [{
            key: '43be4b2c-2281-420f-9936-759da03afad7',
            masked: '******3211',
            isDefault: false,
            isVerified: false
          }, {
            key: '7ffc6e9b-6705-48e7-8fa7-413de9225a46',
            masked: '******3210',
            isDefault: false,
            isVerified: false
          }],
          otpMfaDestination: 'f4dc3deb-0f52-4df6-9097-e16ec339cc92'
        }
      };
    });

    it('should setDisplay with resultFromGetMaskedUser', () => {
      component.otpMfaDestinationKey = 'f4dc3deb-0f52-4df6-9097-e16ec339cc92';
      component.otpMethod = 'E';

      component.setDisplay(getMaskedUserObject);
      fixture.detectChanges();

      expect(component.otpMfaDestinationMaskedResult).toBe('d*********e@s*******.com');
      expect(component.displayPageContent.informationText).toContain('We just sent you an email');
    });

    it('should set the displayPageContent to mobile when the OPT method is Mobile', () => {
      activatedRoute.testQueryParams = {mfaOrigin: '', otpChannel: 'M', key: ''};
      component.initializeSettings();
      fixture.detectChanges();

      component.setMaskedUserPreferences(getMaskedUserObject);
      component.setDisplay(getMaskedUserObject);

      expect(component.otpMethod).toBe('M');
      expect(component.displayPageContent).toBe(component.pageContent.mobile);
    });

    it('should set the displayPageContent to voice when the OPT method is Phone', () => {
      activatedRoute.testQueryParams = {mfaOrigin: '', otpChannel: 'V', key: ''};
      component.initializeSettings();
      fixture.detectChanges();

      component.setMaskedUserPreferences(getMaskedUserObject);
      component.setDisplay(getMaskedUserObject);

      expect(component.otpMethod).toBe('V');
      expect(component.displayPageContent).toBe(component.pageContent.voice);
    });

    it('should not set OTP Mfa masked values if there are no Email, Mobile, or phone arrays', () => {
      component.otpMfaDestinationMaskedResult = undefined;
      const testData = Object.assign({}, getMaskedUserObject);
      testData.data.emails = undefined;
      testData.data.mobiles = undefined;
      testData.data.phones = undefined;

      component.setDisplay(testData);

      expect(component.otpMfaDestinationMaskedResult).toBeUndefined();
    });
  });

  it('should navigate to mfa-confirmation on success - confirmOtpMfaSetup', () => {
    component.mfaOriginParam = 'enrollment';
    component.mfaEnrollmentStatus = true;

    authService.confirmOtpMfaSetup.and.returnValue(of({status: 200, headers: null, data: undefined }));

    component.checkCode();
    fixture.detectChanges();

    expect(router.navigate).toHaveBeenCalledWith(
      [component.MFA_CONFIRMATION_ROUTE], {queryParams: {mfaEnrollmentStatus: true} });
  });

  describe('===> checkCode()', () => {

    it('should navigate to mfa-confirmation on success - authenticateWithOtp', () => {
      component.mfaOriginParam = 'untrustedDevice';
      component.mfaAuthenticated = true;
      authService.authenticateWithOtp.and.returnValue(of({status: 200, headers: null, data: undefined}));

      component.checkCode();
      fixture.detectChanges();

      expect(router.navigate).toHaveBeenCalledWith(
        [component.MFA_CONFIRMATION_ROUTE], {queryParams: {mfaAuthenticated: true} });
    });

    it('should not make the authentication call for \'authenticateWithOtp\' if the MFA authenticated flag set', () => {
      authService.authenticateWithOtp.and.returnValue(of({status: 200, headers: null, data: undefined}));
      component.mfaEnrollmentStatus = false;
      component.mfaAuthenticated = true;

      component.checkCode();
      expect(authService.authenticateWithOtp).toHaveBeenCalled();
    });

    it('should set an error and not call the function if the MFA Enrollment is false and MFA Authenticated is false', () => {
      component.mfaEnrollmentStatus = false;
      component.mfaAuthenticated = false;

      component.checkCode();

      expect(component.activeError).toBe(499);
    });

    it('should set the \'mfaAltChannel\' to true when authService returns valid and the mfaAltChannelParam is set', () => {
      authService.confirmOtpMfaSetup.and.returnValue(of({status: 200, headers: null, data: undefined}));
      component.mfaEnrollmentStatus = true;
      component.mfaAuthenticated = false;
      component.mfaAltChannelParam = true;
      const expectedParams = {queryParams: {mfaEnrollmentStatus: true, mfaAltChannel : true}};

      component.checkCode();

      expect(router.navigate).toHaveBeenCalledWith([component.MFA_CONFIRMATION_ROUTE], expectedParams);
    });

    it('should set the active error when authentication service \> authenticateWithOtp is called', () => {
      component.activeError = null;
      component.submitDisabled = true;
      component.mfaOriginParam = 'untrustedDevice';
      component.mfaAuthenticated = true;
      authService.authenticateWithOtp.and.returnValue(throwError(new Error()));

      component.checkCode();
      fixture.detectChanges();

      expect(component.activeError).toBe(499);
      expect(component.submitDisabled).toBeFalsy();
    });

    it('should be redirect to my home page after getting the cookie value as true', () => {
      authService.verifySession.and.returnValue(of({ status: 200, headers: undefined, data: undefined }));
      const spyCookieVal = spyOn(component.cookieUtils, 'getCookie').and.returnValue('true');
      component.getDoNotAskUserCookie();
      expect(spyCookieVal).toBeTruthy();
    });

    it('should be redirect to /mfa-confirmation page after getting the cookie value as false', () => {
      authService.verifySession.and.returnValue(of({ status: 200, headers: undefined, data: undefined }));
      authService.confirmOtpMfaSetup.and.returnValue(of({status: 200, headers: null, data: undefined}));
      spyOn(component.cookieUtils, 'getCookie').and.returnValue('false');
      router.navigate.calls.reset();
      component.mfaEnrollmentStatus = true;
      component.mfaAuthenticated = false;
      component.mfaAltChannelParam = true;
      const expectedParams = {queryParams: {mfaEnrollmentStatus: true, mfaAltChannel : true}};

      component.checkCode();

      expect(router.navigate).toHaveBeenCalledWith([component.MFA_CONFIRMATION_ROUTE], expectedParams);

    });

  });

  describe('===> resendOtpRequest()', () => {

    it('should log success on sendAuthenticationOtp for resendOtpRequest when from an untrusted device', () => {
      component.mfaOriginParam = 'untrustedDevice';
      authService.sendAuthenticationOtp.and.returnValue(of({status: 200, headers: null, data: undefined}));
      authService.setupOtpMfa.and.returnValue(of({status: 200, headers: null, data: undefined}));
      const spyConsoleLog = spyOn(window.console, 'log').and.callFake(() => {});

      component.resendOtpRequest();
      fixture.detectChanges();

      expect(authService.sendAuthenticationOtp).toHaveBeenCalled();
      expect(spyConsoleLog).toHaveBeenCalledWith('sendAuthenticationOtp code resent.');
    });

    it('should set activeError on sendAuthenticationOtp error for resendOtpRequest', () => {
      component.mfaOriginParam = 'untrustedDevice';
      authService.sendAuthenticationOtp.and.returnValue(throwError({status: 400}));
      authService.setupOtpMfa.and.returnValue(of({status: 200, headers: null, data: undefined}));

      component.resendOtpRequest();
      fixture.detectChanges();

      expect(authService.sendAuthenticationOtp).toHaveBeenCalled();
      expect(component.activeError).toBe(400);
    });

    it('should log success on setupOtpMfa for resendOtpRequest when from enrollment', () => {
      component.mfaOriginParam = 'enrollment';
      authService.setupOtpMfa.and.returnValue(of({status: 200, headers: null, data: undefined}));
      const spyConsoleLog = spyOn(window.console, 'log').and.callFake(() => {});

      component.resendOtpRequest();
      fixture.detectChanges();

      expect(authService.setupOtpMfa).toHaveBeenCalled();
      expect(spyConsoleLog).toHaveBeenCalledWith('setupOtpMfa code resent.');
    });

    it('should set activeError on setupOtpMfa error for resendOtpRequest', () => {
      component.mfaOriginParam = 'enrollment';
      authService.setupOtpMfa.and.returnValue(throwError({status: 400}));

      component.resendOtpRequest();
      fixture.detectChanges();

      expect(authService.setupOtpMfa).toHaveBeenCalled();
      expect(component.activeError).toBe(400);
    });

    it('should not call sendAuthenticationOtp nor setupOtpMfa when origin param not set', () => {
      component.mfaOriginParam = null;
      authService.setupOtpMfa.and.callThrough();
      authService.sendAuthenticationOtp.and.callThrough();

      component.resendOtpRequest();
      fixture.detectChanges();

      expect(authService.setupOtpMfa).not.toHaveBeenCalled();
      expect(authService.sendAuthenticationOtp).not.toHaveBeenCalled();
    });

  });

  describe('===> onSubmit()', () => {

    it('should call checkCode() when form is submitted and is valid', waitForAsync(() => {
      const spyCheckCode = spyOn(component, 'checkCode').and.callThrough();

      fixture.whenStable().then(() => {
        component.otpInput = '123456';
        component.mfaForm.controls.sixDigitOtpCode.setValue('123456');
        fixture.detectChanges();

        component.onSubmit();

        expect(component.mfaForm.valid).toBeTruthy();
        expect(spyCheckCode).toHaveBeenCalled();
      });
    }));

    it('should not call checkCode(), but should set active error when form is submitted and is invalid',
      waitForAsync(() => {
      const spyCheckCode = spyOn(component, 'checkCode').and.callThrough();

      fixture.whenStable().then(() => {
        component.otpInput = null;
        fixture.detectChanges();

        component.onSubmit();
        fixture.detectChanges();

        expect(component.activeError).toBe(499);
        expect(spyCheckCode).not.toHaveBeenCalled();
      });
    }));

  });

});

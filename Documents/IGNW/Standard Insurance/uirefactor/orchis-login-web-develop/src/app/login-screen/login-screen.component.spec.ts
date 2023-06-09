import {HttpClientModule} from '@angular/common/http';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {Component} from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { BrowserModule, By, Title } from '@angular/platform-browser';
import {CollapseModule} from 'ngx-bootstrap/collapse';
import {ModalModule} from 'ngx-bootstrap/modal';
import {of, throwError} from 'rxjs';
import {createSpyObjFromClass} from '../../test/test.helper';
import {ContentType, RequestState} from '../shared/constants/managed-content.constants';
import {GlobalConstants} from '../shared/global-constants';
import {ManagedContentService} from '../shared/services/managed-content.service';
// Components
import {LoginScreenComponent} from './login-screen.component';
import {MessagePopupComponent} from '../shared-components/message-popup/message-popup.component';
import {CapslockTooltipComponent} from '../shared-components/capslock-tooltip/capslock-tooltip.component';
// Services
import {AnalyticsService} from '../shared/services/analytics.service';
import {DrupalContentService} from '../shared/services/drupal-content.service';
import {AuthenticationService} from 'sfg-ng-brand-library';
// Third-Party
import {DialogContent} from '../shared/models/dialog-content.model';
/** routing-related stubs */
import {ActivatedRouteStub, RouterStub} from '../../test/router-stubs';
import {Notification} from '../shared/models/notification.model';
// Mocked Services used for URI testing
import { AnalyticsServiceStub } from '../../test/services/analytics.service.stub';
import { ForcedDataCollectionService } from '../forced-data-collection/forced-data-collection.service';
import { StepIndicatorService } from '../shared/services/step-indicator.service';
import { ResendActivationComponent } from '../shared-components/resend-activation/resend-activation.component';
import {ValidationHelpers} from '../shared/errors/validation-helpers';


@Component({
  selector: 'lgn-resend-activation',
  template: '<div></div>'
})
export class MockComponent { }

describe('LoginScreenComponent', () => {
  let component: LoginScreenComponent;
  let fixture: ComponentFixture<LoginScreenComponent>;
  let compiledElem: HTMLElement;
  let activatedRoute: ActivatedRouteStub;
  let titleService: Title;

  let navigateSpy: jasmine.Spy;

  // Service Related
  let analyticsService: AnalyticsService;

  let spyGetModalContent: jasmine.Spy;
  let spyCustomerSupportRedirect: jasmine.Spy;
  let spyWindowOpen: jasmine.Spy;
  let spyCallLogin: jasmine.Spy;
  let spyCallPasswordKeyPress: jasmine.Spy;
  let spyGotoCheck: jasmine.Spy;

  // drupal content service
  let drupalService: jasmine.SpyObj<DrupalContentService>;
  let cmService: jasmine.SpyObj<ManagedContentService>;
  let authService: jasmine.SpyObj<AuthenticationService>;

  // Mocks
  const testOutageDrupalContent = [
    {
      targetId: 'login-outage',
      notificationType: 'error',
      messageTitle: 'Unexpected Outage',
      message: 'We are currently experiencing technical difficulties, please try again later.'
    }
  ];

  const mockDialogContent: Array<DialogContent> = [
    {
      id: 'testModal',
      title: 'test modal',
      size: 'large',
      body: 'test'
    }
  ];


  /* ================================== ngOnInit ============================================ */


  describe('LoginScreenComponent.ngOnOnit', () => {
    let spyConsoleLog: jasmine.Spy;

    drupalService = createSpyObjFromClass(DrupalContentService);
    cmService = createSpyObjFromClass(ManagedContentService);
    authService = createSpyObjFromClass(AuthenticationService);
    activatedRoute = new ActivatedRouteStub();
    activatedRoute.testQueryParams = {passwordreset: true, logout: true};

    beforeEach( () => {
      TestBed.configureTestingModule({
        imports: [
          BrowserModule,
          HttpClientTestingModule,
          FormsModule,
          CollapseModule,
          ModalModule.forRoot(),
          RouterModule
        ],
        declarations: [
          LoginScreenComponent,
          MessagePopupComponent,
          CapslockTooltipComponent,
          ResendActivationComponent
        ],
        providers: [
          ForcedDataCollectionService,
          StepIndicatorService,
          {provide: ActivatedRoute, useValue: activatedRoute},
          {provide: Router, useClass: RouterStub},
          {provide: DrupalContentService, useValue: drupalService},
          {provide: ManagedContentService, useValue: cmService},
          {provide: AuthenticationService, useValue: authService}
        ]
      }).compileComponents();
    });

    beforeEach( () => {
      fixture = TestBed.createComponent(LoginScreenComponent);
      component = fixture.componentInstance;
      compiledElem = fixture.debugElement.nativeElement;

      drupalService = TestBed.inject(DrupalContentService) as jasmine.SpyObj<DrupalContentService>;
      drupalService.getContent.and.returnValue(of([]));
      drupalService.getContent.withArgs(component.loginContentEndpoint)
        .and.returnValue(of([{userRegistrationUrl: ''}]));

      cmService = TestBed.inject(ManagedContentService) as jasmine.SpyObj<ManagedContentService>;
      cmService.contentHttpGetStatus.and.returnValue(of(RequestState.SUCCESS));
      cmService.getContentById.and.returnValue(of({}));

      authService = TestBed.inject(AuthenticationService) as jasmine.SpyObj<AuthenticationService>;
      authService.checkIfAuthenticated.and.returnValue(of({ status: 200, headers: null, data: undefined }));
      authService.validateAuthzPolicy.and.returnValue(of({ status: 200, headers: null, data: undefined }));

      spyGotoCheck = spyOn(component, 'gotoRedirectCheck');
      spyOn(AnalyticsService, 'sendPageHit').and.callFake(() => {});
      spyOn(window.console, 'error').and.callFake(() => {});
      spyOn(window.console, 'warn').and.callFake(() => {});
      spyConsoleLog = spyOn(window.console, 'log').and.callFake(() => {});
    });

    describe('when user not authenticated and no total outage', () => {

      it('should NOT redirect to destination (MyHome)', () => {
        authService.checkIfAuthenticated.and.returnValue(throwError({status: 400, headers: null, data: undefined}));
        component.ngOnInit();

        expect(component.isAuthenticated).toBeFalsy('User is Authenticated');
        expect(component.isTotalOutage).toBeFalsy('Is a total outage');
      });

      describe('===> ngOnInit()', () => {

        const notifyTestData = [
          {
            targetId: 'login-message',
            targetType: 'none',
            notificationType: 'clear',
            messageTitle: 'Example Message',
            message: 'test here'
          }
        ];
        const outageTestData = [
          {
            targetId: 'login-message',
            targetType: 'none',
            notificationType: 'total-outage',
            messageTitle: 'none',
            message: 'This is a total outage message that might come from Drupal.'
          }
        ];

        // Outage notification tests
        it('should set the outage content and message when drupal call is successful', () => {
          drupalService.getContent.and.returnValue(of(outageTestData));
          component.isTotalOutage = false;
          component.ngOnInit();
          fixture.detectChanges();
          const messagePopups = fixture.debugElement.queryAll(By.css('.lgn-msg-container'));

          expect(messagePopups[0].nativeElement.innerHTML).toContain(outageTestData[0].message);
          expect(component.outageContent).toEqual(outageTestData[0]);
          expect(component.isTotalOutage).toBeTruthy();
        });

        it('should not set the outage content and message when drupal call is successful but no content', () => {
          drupalService.getContent.and.returnValue(of([]));
          component.ngOnInit();
          fixture.detectChanges();

          expect(component.outageContent).toBeUndefined();
          expect(component.isTotalOutage).toBeFalsy();
        });

        it('should throw an error when outage content call fails', () => {
          drupalService.getContent.and.returnValue(throwError(new Error()));
          component.ngOnInit();
          fixture.detectChanges();

          expect(component.outageContent).toBeUndefined();
          expect(component.isTotalOutage).toBeFalsy();
        });

        // Notification call tests
        it('should set the notification content and message when drupal call is successful', () => {
          drupalService.getContent.and.returnValue(of(notifyTestData));
          component.ngOnInit();
          fixture.detectChanges();
          const messagePopups = fixture.debugElement.queryAll(By.css('lgn-message-popup'));

          expect(messagePopups[0].nativeElement.innerHTML).toContain(notifyTestData[0].message);
          expect(component.notificationContent).toEqual(notifyTestData[0]);
        });

        it('should throw an error when notification content call fails', () => {
          drupalService.getContent.and.returnValue(throwError(new Error()));
          component.ngOnInit();
          expect(component.notificationContent).toBeUndefined();
        });

        it('should set the login content and set the registration url value', () => {
          const testData = [{userRegistrationUrl: 'test'}];
          drupalService.getContent.withArgs(component.loginContentEndpoint).and.returnValue(of(testData));
          component.ngOnInit();
          expect(component.userRegistrationUrl).toEqual('test');
        });

        it('should set the registration url to empty string and return empty object', () => {
          drupalService.getContent.and.returnValue(throwError(new Error()));
          component.userRegistrationUrl = 'test';
          component.ngOnInit();
          expect(component.userRegistrationUrl).toEqual('');
        });
      });
    });


    describe('when user is authenticated', () => {

      describe('.. and no total outage', () => {

        it('should redirect to destination (MyHome)', () => {
          authService.checkIfAuthenticated.and.returnValue(of({status: 200, headers: null, data: undefined}));
          authService.validateAuthzPolicy.and.returnValue(of({status: 200, headers: null, data: undefined}));
          activatedRoute.testQueryParams = {goto: 'https://localhost:9999'};
          spyGotoCheck.and.returnValue(of({status: 200}));
          component.ngOnInit();
          fixture.detectChanges();

          expect(authService.validateAuthzPolicy).toHaveBeenCalledWith(GlobalConstants.MASTER_CONTROL_POLICY);
          expect(component.isAuthenticated).toBeTruthy('Is not authenticated');
          expect(component.isForcedDataCollectionPolicyMet).toBeTruthy('FDCP not met');
          expect(component.isTotalOutage).toBeFalsy('is total outage');
          expect(component.gotoRedirectCheck).toHaveBeenCalled();
        });

      });


      describe(' .. and TOTAL outage', () => {

        const totalOutageDrupalContent: Array<Notification> = [
          {
            targetId: 'login-outage',
            targetType: 'T',
            notificationType: 'total-outage',
            messageTitle: 'Outage',
            message: 'Our applications are currently unavailable due to scheduled maintenance.'
          }
        ];

        it('should not redirect to destination (MyHome)', () => {
          drupalService.getContent.and.returnValue(of(totalOutageDrupalContent));
          component.ngOnInit();
          fixture.detectChanges();

          expect(component.isAuthenticated).toBeTruthy();
          expect(component.isForcedDataCollectionPolicyMet).toBeTruthy();
          expect(component.isTotalOutage).toBeTruthy();
        });
      });

    });

    /* ====================== URI Validation Unit Tests=========================== */
    describe('===> Check URI Policy Unit Tests', () => {
      let spyNavTo: jasmine.Spy;
      const testUrl: string = '#';

      beforeEach(() => {
        spyGotoCheck.and.callThrough();
        drupalService.getContent.and.returnValue(of(testOutageDrupalContent));
        spyNavTo = spyOn(component, 'navigateTo').and.callFake(() => {});
      });

      it('should redirect to goto url when given a whitelisted goto param', () => {

        component.gotoUrl = testUrl;
        activatedRoute.testQueryParams = {goto: testUrl};
        authService.checkUriPolicy.and.returnValue(of({ status: 200, headers: null, data: undefined }));
        component.gotoRedirectCheck();

        expect(component.gotoUrl).toEqual(testUrl);
        expect(authService.checkUriPolicy).toHaveBeenCalledWith(testUrl);
        expect(spyNavTo).toHaveBeenCalledWith(testUrl);
      });

      it('should redirect to default home page when given a non-whitelisted goto param', () => {
        const spyLogError = spyOn(component, 'logError');
        const myHomeUrl = component.myHomeUrl;
        component.gotoUrl = testUrl;
        activatedRoute.testQueryParams = {goto: testUrl};
        authService.checkUriPolicy.and.returnValue(throwError(new Error()));

        authService.validateAuthzPolicy.and.returnValue(of({status: 200, headers: null, data: {code: 200}}));

        component.gotoRedirectCheck();

        expect(component.gotoUrl).toEqual(testUrl);
        expect(spyLogError).toHaveBeenCalled();
        expect(spyNavTo).toHaveBeenCalledWith(myHomeUrl);
      });

      it('should not call the URI policy validation when goto not valid string', () => {
        authService.checkUriPolicy.calls.reset();
        component.gotoUrl = null;
        activatedRoute.testQueryParams = {goto: null};
        component.gotoRedirectCheck();
        expect(component.gotoUrl).toEqual(null);
        expect(authService.checkUriPolicy).not.toHaveBeenCalled();
      });

      it('should use router.navigate to go to SPA user registration', () => {
        const spyRouter = spyOn(component.router, 'navigate').and.callFake(() => Promise.resolve(true));
        component.userRegistrationUrl = '';
        component.goToUserRegistration();
        expect(spyRouter).toHaveBeenCalledWith(['register']);
      });

      it('should use navigateTo() to go to external user registration', () => {
        spyNavTo.and.callFake(() => {});
        component.userRegistrationUrl = 'something';
        component.goToUserRegistration();
        expect(spyNavTo).toHaveBeenCalledWith(component.userRegistrationUrl);
      });
    });


  });  // LoginScreenComponent.ngOnOnit


  /* ====================== Component test - when user is unauthenticated=========================== */

  describe('when user is unauthenticated', () => {
    let spyConsoleLog: jasmine.Spy;

    beforeEach(() => {
      activatedRoute = new ActivatedRouteStub();
      activatedRoute.testQueryParams = {passwordreset: true, logout: true};

      authService = createSpyObjFromClass(AuthenticationService);
      analyticsService = new AnalyticsServiceStub();
    });

    beforeEach(waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [
          LoginScreenComponent,
          MessagePopupComponent,
          CapslockTooltipComponent,
          ResendActivationComponent
        ],
        imports: [
          BrowserModule,
          HttpClientModule,
          FormsModule,
          CollapseModule,
          ModalModule.forRoot()
        ],
        providers: [
          ForcedDataCollectionService,
          StepIndicatorService,
          {provide: ActivatedRoute, useValue: activatedRoute},
          {provide: Title, useClass: Title},
          {provide: Router, useClass: RouterStub},
          {provide: AnalyticsService, useValue: analyticsService},
          {provide: DrupalContentService, useValue: drupalService},
          {provide: AuthenticationService, useValue: authService}
        ]
      }).compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(LoginScreenComponent);
      component = fixture.componentInstance;
      compiledElem = fixture.debugElement.nativeElement;

      analyticsService = fixture.debugElement.injector.get(AnalyticsService);
      authService = TestBed.inject(AuthenticationService) as jasmine.SpyObj<AuthenticationService>;

      drupalService = TestBed.inject(DrupalContentService) as jasmine.SpyObj<DrupalContentService>;
      drupalService.getContent.and.returnValue(of([]));
      drupalService.getContent.withArgs(component.loginContentEndpoint)
        .and.returnValue(of([{userRegistrationUrl: ''}]));

      spyGetModalContent = spyOn(component, 'getModalContent').and.callThrough();
      spyWindowOpen = spyOn(window, 'open');
      spyCallLogin = spyOn(component, 'pressEnterCallLogin').and.callThrough();
      spyCallPasswordKeyPress = spyOn(component, 'showPasswordKeyPress').and.callThrough();
      authService.login.and.returnValue(of({status: 200, headers: null, data: undefined}));
      spyCustomerSupportRedirect = spyOn(component, 'customerSupport')
        .and.callFake(() => console.log('fake redirect to customer support'));
      navigateSpy = spyOn(component.router, 'navigate');
      spyOn(AnalyticsService, 'sendPageHit').and.callFake(() => {});
      spyConsoleLog = spyOn(window.console, 'log').and.callFake(() => {});

      authService.checkIfAuthenticated.and.returnValue(throwError( {status: 401 }));
      authService.validateAuthzPolicy
        .and.returnValue(throwError({
          data: {
            code: 'Authentication.Unauthenticated',
            message: 'Unauthenticated',
            details: {
              recovery: [
                { id: 'User.emailNotVerified', type: 'StaticErrorMessage' },
                { id: 'User.mobileNotVerified', type: 'StaticErrorMessage' },
                { id: 'User.passwordExpired', type: 'StaticErrorMessage' }
              ]
            }
          }
        }));

      fixture.detectChanges();
    });


    it('should be created', () => {
      expect(component).toBeTruthy();
    });

    it('should set the title to \"Log In \| The Standard\"', () => {
      titleService = TestBed.inject(Title);
      expect(titleService.getTitle()).toBe('Log In | The Standard');
    });

    it('should set the password reset variable when param value ?passwordreset=true is set', () => {
      authService.errorStatusCode = undefined;
      fixture.detectChanges();
      const messagePopups = fixture.debugElement.queryAll(By.css('lgn-message-popup'));
      expect(messagePopups[0].nativeElement.innerHTML)
        .toContain('Your password has been changed. You may now log into your account.');
      expect(component.passwordReset).toBeTruthy();
    });

    it('should set the password reset variable when param value ?logout=true is set', () => {
      fixture.detectChanges();
      const messagePopups = fixture.debugElement.queryAll(By.css('lgn-message-popup'));
      expect(messagePopups[1].nativeElement.innerHTML)
        .toContain('You are now logged out of standard.com');
      expect(component.loggedout).toBeTruthy();
    });

    it('should popup an additional message if there is an authentication error', () => {
      authService.errorStatusCode = '401';
      fixture.detectChanges();
      const messagePopups = fixture.debugElement.queryAll(By.css('lgn-message-popup'));
      expect(messagePopups[0].nativeElement.innerHTML).toContain('couldn\'t find an account with that user name and password');
    });

    it('should popup the 502 message if there is a 502 response', () => {
      authService.errorStatusCode = '502';
      fixture.detectChanges();
      const messagePopups = fixture.debugElement.queryAll(By.css('lgn-message-popup'));
      expect(messagePopups[0].nativeElement.innerHTML).toContain('Something went wrong. There was an internal'
        + ' server error. If you continue to experience this problem, please '
        + '\<a href=\"' + component.customerSupportUrl + '\"\>contact us\<\/a\> for help.');
    });


    describe('===> login()', () => {
      it('should call the authenticationService when login is submitted with username and pw', () => {
        component.userName = 'user';
        component.userPw = 'password';
        fixture.detectChanges();
        component.login();
        expect(authService.login).toHaveBeenCalled();
        expect(authService.login).toHaveBeenCalledWith('user', 'password');
      });

      it('should set submitDisabled to false on error', () => {
        authService.login.and.returnValue(throwError({data: {}}));
        authService.authErrorHandler.and.callFake(() => {});
        component.userName = 'user';
        component.userPw = 'password';
        fixture.detectChanges();
        component.login();

        expect(component.submitDisabled).toBeFalsy();
        expect(authService.authErrorHandler).toHaveBeenCalled();
      });

      it('should set needsTermsAndConsent to true on error', () => {
        authService.login.and.returnValue(throwError(
          {data: { details: { recovery: [{id: 'User.EulaNotAccepted', type: 'StaticErrorMessage'}]}}}
        ));
        const showModal: jasmine.Spy = spyOn(component, 'showModal');
        component.userName = 'user';
        component.userPw = 'password';
        fixture.detectChanges();
        component.login();

        expect(component.needsTermsAndConsent).toBeTruthy();
        expect(showModal).toHaveBeenCalled();
      });

      it('should set notEnteredUsername to true when username and password not set', () => {
        component.login();
        expect(component.notEnteredUsername).toBeTruthy();
        expect(component.notEnteredPassword).toBeTruthy();
      });

      it('should set notEnteredUsername to false when username and password are set', () => {
        authService.getUser.and.returnValue(of({status: 200, headers: null, data: undefined}));
        component.userName = 'user';
        component.userPw = 'password';
        component.login();
        expect(component.notEnteredUsername).toBeFalsy();
        expect(component.notEnteredPassword).toBeFalsy();
      });

      describe('---> login successful', () => {
        beforeEach(() => {
          authService.login.and.returnValue(of({status: 200, headers: null, data: undefined}));
          component.userName = 'user';
          component.userPw = 'password';
        });

        it('should execute validateAuthzPolicy (successfully) data call', () => {
          const authzPolicySpy = authService.validateAuthzPolicy.and.returnValue(
            of({status: 200, headers: null, data: undefined})
          );
          const spyGoToRedirect = spyOn(component, 'gotoRedirectCheck').and.callFake(() => {});

          component.login();

          expect(authzPolicySpy).toHaveBeenCalled();
          expect(component.isLoading).toBeTruthy();
          expect(spyGoToRedirect).toHaveBeenCalled();
        });

        it('should execute validateAuthzPolicy (fails) data call', () => {
          const authzPolicySpy = authService.validateAuthzPolicy.and.returnValue(
            throwError({status: 401, headers: null, data: { test: 'test' }})
          );
          const returnedRoute = 'hello-there-test';
          spyOn(component.forcedDataCollectionService, 'setStepIndicatorReturnNavigation')
            .and.callFake(() => returnedRoute);

          component.login();

          expect(authzPolicySpy).toHaveBeenCalled();
          expect(component.navigateVariable).toEqual(returnedRoute);
          expect(navigateSpy).toHaveBeenCalledWith([ returnedRoute ],
            { queryParams: { step: 1, goto: component.gotoUrl } });
        });

      });

      describe('---> Login Failed', () => {
        it('should not execute getUser nor validateAuthzPolicy data call ', () => {
          authService.login.and.returnValue(
            throwError({status: 402, headers: null, data: undefined})
          );
          const getUserSpy = authService.getUser;
          const authzPolicySpy = authService.validateAuthzPolicy;

          component.login();

          expect(getUserSpy).not.toHaveBeenCalled();
          expect(authzPolicySpy).not.toHaveBeenCalled();
        });
      });

    });


    it('should set notEnteredUsername to true when no username is provided', () => {
      component.userName = null;
      component.checkIfValidUsername();
      expect(component.notEnteredUsername).toBeTruthy();
    });

    it('should set notEnteredUsername to false when username is provided', () => {
      component.userName = 'user';
      component.checkIfValidUsername();
      expect(component.notEnteredUsername).toBeFalsy();
    });

    it('should change the password field type to \'password\' if isShowPassword is set', () => {

      const passwordInput = fixture.debugElement.query(By.css('#lgn-password-input')).nativeElement;
      component.isShowPassword = true;
      component.showPassword();

      expect(component.isShowPassword).toBeFalsy();
      expect(passwordInput.getAttribute('type')).toBe('password');
    });

    it('should change the password field type to \'text\' if isShowPassword is not set', () => {
      const passwordInput = fixture.debugElement.query(By.css('#lgn-password-input')).nativeElement;
      component.isShowPassword = false;
      component.showPassword();

      expect(component.isShowPassword).toBeTruthy();
      expect(passwordInput.getAttribute('type')).toBe('text');
    });

    it('should execute termsAndConsentNavModal.show() with valid url', () => {
      drupalService.getContent.and.returnValue(of(mockDialogContent));

      component.showModal('termsAndConsent');
      expect(component.getModalContent).toHaveBeenCalled();
    });

    it('should not execute getModalContent() with same url for passed and current url', () => {
      drupalService.getContent.and.returnValue(of(mockDialogContent));

      component.currentUrl = 'test';
      component.showModal('test');
      fixture.detectChanges();
      expect(component.getModalContent).not.toHaveBeenCalled();
    });

    describe('===> getModalContent()', () => {
      const testDialog: Array<DialogContent> = [{
        id: 'testId',
        title: 'testTitle',
        size: 'largeTest',
        body: 'test body'
      }];

      it('should set terms and consent error when terms and consent content call fails', () => {
        drupalService.getContent.and.returnValue(throwError(new Error()));
        component.getModalContent(component.urlTermsAndConsent, true);
        expect(component.termsAndConsentError).toBeTruthy();
        expect(component.errorMessage).toEqual('Error Getting Content');
      });

      it('should load terms and consent default content when modalcontent call fails', () => {
        drupalService.getContent.and.returnValue(throwError(new Error()));
        component.getModalContent(component.urlTermsAndConsentDefaultContent, false);
        component.currentUrl = './assets/default/pages.default.terms-consent.json';
        fixture.detectChanges();
        expect(component.getModalContent).toHaveBeenCalled();
        expect(component.currentUrl).toEqual('./assets/default/pages.default.terms-consent.json');
      });

      it('should set identity/security error when identity security content call fails', () => {
        drupalService.getContent.and.returnValue(throwError(new Error()));
        component.getModalContent(component.identitySecurityUrl, true);
        expect(component.protectYourIdentityError).toBeTruthy();
        expect(component.errorMessage).toEqual('Error Getting Content');
      });
    });

    it('should redirect when customerSupport() is called', () => {
      component.customerSupport();
      fixture.detectChanges();
      expect(component.customerSupport).toHaveBeenCalled();
    });

    it('should show the session expired message when sessionValid is true', () => {
      activatedRoute.testQueryParams = {sessionValid: true};
      fixture.detectChanges();
      component.getUrlParams();
      expect(component.sessionValid).toBeTruthy();
    });

    it('should open a new window and navigate to', () => {
      const url = 'http://localhost:4200/#testme';
      component.externalLinkClick(url);
      fixture.detectChanges();
      expect(spyWindowOpen).toHaveBeenCalledWith(url, '_blank');
    });

    it('should be call Login when press enter', () => {
      ValidationHelpers.touchAllFormFields(component.loginForm);
      component.pressEnterCallLogin();
      expect(spyCallLogin).toHaveBeenCalledWith();
    });

    it('should be call showPasswordKeyPress', () => {
      component.showPasswordKeyPress();
      expect(spyCallPasswordKeyPress).toHaveBeenCalledWith();
    });

    it('should log an error when logError is called', () => {
      component.logError('something');
      expect(spyConsoleLog).toHaveBeenCalledWith('something');
    });

    describe('===> setEulaAndNavigate()', () => {

      it('should call accept EULA and continue to login if call successful', () => {
        component.agreeToTerms = true;
        authService.acceptEula.and.returnValue(of({ status: 200, headers: null, data: undefined }));
        const spyTermsModal = spyOn(component.termsAndConsentNavModal, 'hide');
        const spyLogin = spyOn(component, 'login');
        component.setEulaAndNavigate();

        expect(spyTermsModal).toHaveBeenCalled();
        expect(spyLogin).toHaveBeenCalled();
      });

      it('should call accept EULA and console log if call unsuccessful', () => {
        component.agreeToTerms = true;
        authService.acceptEula.and.returnValue(throwError(new Error()));
        component.setEulaAndNavigate();

        expect(spyConsoleLog).toHaveBeenCalled();
      });

      it('should set terms and consent error message if user is not agreeing to terms', () => {
        component.agreeToTerms = false;
        component.errorMessageTermsAndConsent = undefined;

        component.setEulaAndNavigate();

        expect(component.errorMessageTermsAndConsent).toEqual('You must agree to the Terms and Consent to continue.');
      });
    });

    describe('===> managed content', () => {
      // TODO: Fix this unit test
      xit('should make the call to get content for sections when managed content state is SUCCESS', () => {
        const testContent1 = { id: 'ciw1', title: 'title1', body: 'body1', helpId: 'helpId1', tags: '' };
        const testContent2 = { id: 'ciw2', title: 'title2', body: 'body2', helpId: 'helpId2', tags: '' };

        cmService.getContentById
          .withArgs(ContentType.SECTION, component.CM_OPENING_CONTENT_ID)
          .and.returnValue(testContent1);
        cmService.getContentById
          .withArgs(ContentType.SECTION, component.CM_CLOSING_CONTENT_ID)
          .and.returnValue(testContent2);
        cmService.contentHttpGetStatus.and.returnValue(of(RequestState.SUCCESS));
        authService.checkIfAuthenticated.and.returnValue(of({ status: 200, headers: null, data: undefined }));
        authService.validateAuthzPolicy.and.returnValue(of({ status: 200, headers: null, data: undefined }));

        component.ngOnInit();

        expect(component.openingCmContent).toEqual(testContent1);
        expect(component.closingCmContent).toEqual(testContent2);
      });
    });

  });


  /* ====================== Component test - when user is authenticated=========================== */

  describe('when user is authenticated', () => {

    // TODO: finish when user is authenticated unit tests

  });
});

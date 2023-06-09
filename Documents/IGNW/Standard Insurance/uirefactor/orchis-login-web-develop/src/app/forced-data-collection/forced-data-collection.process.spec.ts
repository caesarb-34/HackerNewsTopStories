import {ComponentFixture, TestBed} from '@angular/core/testing';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute, Router} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {FormsModule} from '@angular/forms';
import {MockIdleTimeoutComponent} from '../../test/idle-timeout-mock/mock-idle-timeout.component';

import {TextMaskModule} from 'angular2-text-mask';
import {ModalModule} from 'ngx-bootstrap/modal';
import {of, throwError} from 'rxjs';
import {NgIdleModule} from '@ng-idle/core';

import {ForcedDataCollectionComponent} from './forced-data-collection.component';
import {ForcedDataCollectionService} from './forced-data-collection.service';
import {ContactInfoCollectionComponent} from './contact-info-collection/contact-info-collection.component';
import {EmailVerificationComponent} from '../email-verification/email-verification.component';
import {ForcedDataCheckEmailComponent} from './forced-data-check-email/forced-data-check-email.component';
import {ForcedResetPasswordComponent} from './forced-reset-password/forced-reset-password.component';
import {MessagePopupComponent} from '../shared-components/message-popup/message-popup.component';
import {NewPasswordComponent} from '../shared-components/new-password/new-password.component';
import {AuthenticationService} from 'sfg-ng-brand-library';
import {StepIndicatorService} from '../shared/services/step-indicator.service';
import {ActivatedRouteStub, RouterStub} from '../../test/router-stubs';
import {CapslockTooltipComponent} from '../shared-components/capslock-tooltip/capslock-tooltip.component';
import {createSpyObjFromClass} from '../../test/test.helper';

/**
 * These tests cover the dynamic process flow of the Forced Data Collection components.
 * The forced-data-collection.component ==> generateStepIndicatorSteps() generates
 * a process flow that gets put into the Step Indicator Service. The individual components then
 * call on the service to get those steps so that the step indicator is properly rendered.
 *
 * These tests validate the generateStepIndicatorSteps() logic.
 */
describe('ForcedDataCollectionProcess', () => {
  let component: ForcedDataCollectionComponent;
  let componentService: ForcedDataCollectionService;
  let fixture: ComponentFixture<ForcedDataCollectionComponent>;
  // Service Stubs
  let activatedRoute: ActivatedRouteStub;
  let mockAuthenticationService: jasmine.SpyObj<AuthenticationService>;
  let stepService: StepIndicatorService;
  // initialize services to grab the steps below
  stepService = new StepIndicatorService();
  componentService = new ForcedDataCollectionService(stepService);

  // if (this.needsPasswordReset && this.needsContactInfoResetPhone && this.needsOtpSetup)
  const stepsAllPhoneTitle = 'show all steps when only the phone is changed';
  const stepsAllPhoneOnly = [
    {
      index: 1,
      label: 'Reset your password',
      route: '/data-collection/password-expired'
    },
    {
      index: 2,
      label: 'Update Contact Information',
      route: '/data-collection/collect-contact-info'
    },
    {
      index: 3,
      label: 'Profile Update',
      route: '/data-collection/email-verification'
    },
    {
      index: 4,
      label: 'Mfa Preferences',
      route: '/data-collection/mfa-preference'
    }
  ];
  // if (this.needsPasswordReset && this.needsContactInfoResetEmail && this.needsOtpSetup)
  const stepsAllEmailTitle = 'show all steps when email changed';
  const stepsAllEmailChange = [
    {
      index: 1,
      label: 'Reset your password',
      route: '/data-collection/password-expired'
    },
    {
      index: 2,
      label: 'Update Contact Information',
      route: '/data-collection/collect-contact-info'
    },
    {
      index: 3,
      label: 'Check Email',
      route: '/data-collection/data-collection-email'
    },
    {
      index: 4,
      label: 'Mfa Preferences',
      route: '/data-collection/mfa-preference'
    }
  ];
  // if (this.needsPasswordReset && !this.needsContactInfoReset && this.needsOtpSetup)
  const stepsPasswordResetMFATitle = 'show the reset password and MFA preference steps';
  const stepsPasswordResetMFA = [
    {
      index: 1,
      label: 'Reset your password',
      route: '/data-collection/password-expired'
    },
    {
      index: 2,
      label: 'Mfa Preferences',
      route: '/data-collection/mfa-preference'
    }
  ];
  // if (!this.needsPasswordReset && this.needsContactInfoResetEmail && this.needsOtpSetup)
  const stepsContactInfoEmailMFATitle = 'show the update email contact info and MFA preference steps';
  const stepsContactEmailMFAInfo = [
    {
      index: 1,
      label: 'Update Contact Information',
      route: '/data-collection/collect-contact-info'
    },
    {
      index: 2,
      label: 'Check Email',
      route: '/data-collection/data-collection-email'
    },
    {
      index: 3,
      label: 'Mfa Preferences',
      route: '/data-collection/mfa-preference'
    }
  ];
  // if (!this.needsPasswordReset && this.needsContactInfoResetPhone && this.needsOtpSetup)
  const stepsContactInfoPhoneMFATitle = 'show the update phone contact and MFA preference info steps';
  const stepsContactInfoPhoneMFA = [
    {
      index: 1,
      label: 'Update Contact Information',
      route: '/data-collection/collect-contact-info'
    },
    {
      index: 2,
      label: 'Profile Update',
      route: '/data-collection/email-verification'
    },
    {
      index: 3,
      label: 'Mfa Preferences',
      route: '/data-collection/mfa-preference'
    }
  ];
  // if (!this.needsPasswordReset && !this.needsContactInfoReset && this.needsOtpSetup)
  const stepsMFATitle = 'show the MFA preference info steps';
  const stepsMFA = [
    {
      index: 1,
      label: 'Mfa Preferences',
      route: '/data-collection/mfa-preference'
    }
  ];
  // if (this.needsPasswordReset && !this.needsContactInfoReset && !this.needsOtpSetup)
  const stepsPasswordResetTitle = 'show just the reset password steps';
  const stepsPasswordReset = [
    {
      index: 1,
      label: 'Reset your password',
      route: '/data-collection/password-expired'
    },
    {
      index: 2,
      label: 'Continue to Password Confirmation',
      route: '/data-collection/password-confirmation'
    }
  ];
  // if (!this.needsPasswordReset && this.needsContactInfoEmailReset && !this.needsOtpSetup)
  const stepsContactInfoEmailTitle = 'show just the update contact info email steps';
  const stepsContactInfoEmail = [
    {
      index: 1,
      label: 'Update Contact Information',
      route: '/data-collection/collect-contact-info'
    },
    {
      index: 2,
      label: 'Check Email',
      route: '/data-collection/data-collection-email'
    }
  ];
  // if (!this.needsPasswordReset && this.needsContactInfoPhoneReset && !this.needsOtpSetup)
  const stepsContactInfoPhoneTitle = 'show just the update contact info phone steps';
  const stepsContactInfoPhone = [
    {
      index: 1,
      label: 'Update Contact Information',
      route: '/data-collection/collect-contact-info'
    },
    {
      index: 2,
      label: 'Profile Update',
      route: '/data-collection/email-verification'
    }
  ];

  /**
   * This is the array being looped thru in the tests below.
   *   expected:  this is the set of steps defined above that are expected to be returned for this case
   *   expectedTitle:  this is the title used in the 'it' description
   */
  const recoverySetArray: Array<object> = [
    { recoverySet: [
        {id: 'User.mobileNotVerified', type: 'StaticErrorMessage'},
        {id: 'User.passwordExpired', type: 'StaticErrorMessage'},
        {id: 'OtpSetup', type: 'StaticErrorMessage'}
      ],
      expected: stepsAllPhoneOnly,
      expectedTitle: stepsAllPhoneTitle
    },
    { recoverySet: [
        {id: 'User.emailNotVerified', type: 'StaticErrorMessage'},
        {id: 'User.passwordExpired', type: 'StaticErrorMessage'},
        {id: 'OtpSetup', type: 'StaticErrorMessage'}
      ],
      expected: stepsAllEmailChange,
      expectedTitle: stepsAllEmailTitle
    },
    { recoverySet: [
        {id: 'User.emailNotVerified', type: 'StaticErrorMessage'},
        {id: 'User.mobileNotVerified', type: 'StaticErrorMessage'},
        {id: 'User.passwordExpired', type: 'StaticErrorMessage'},
        {id: 'OtpSetup', type: 'StaticErrorMessage'}
      ],
      expected: stepsAllEmailChange,
      expectedTitle: stepsAllEmailTitle
    },
    {
      recoverySet: [
        {id: 'User.passwordExpired', type: 'StaticErrorMessage'},
        {id: 'OtpSetup', type: 'StaticErrorMessage'}
      ],
      expected: stepsPasswordResetMFA,
      expectedTitle: stepsPasswordResetMFATitle
    },
    {
      recoverySet: [
        {id: 'User.emailNotVerified', type: 'StaticErrorMessage'},
        {id: 'OtpSetup', type: 'StaticErrorMessage'}
      ],
      expected: stepsContactEmailMFAInfo,
      expectedTitle: stepsContactInfoEmailMFATitle
    },
    {
      recoverySet: [
        {id: 'User.mobileNotVerified', type: 'StaticErrorMessage'},
        {id: 'OtpSetup', type: 'StaticErrorMessage'}
      ],
      expected: stepsContactInfoPhoneMFA,
      expectedTitle: stepsContactInfoPhoneMFATitle
    },
    {
      recoverySet: [
        {id: 'User.emailNotVerified', type: 'StaticErrorMessage'},
        {id: 'User.mobileNotVerified', type: 'StaticErrorMessage'},
        {id: 'OtpSetup', type: 'StaticErrorMessage'}
      ],
      expected: stepsContactEmailMFAInfo,
      expectedTitle: stepsContactInfoEmailMFATitle
    },
    {
      recoverySet: [{id: 'OtpSetup', type: 'StaticErrorMessage'}],
      expected: stepsMFA,
      expectedTitle: stepsMFATitle
    },
    {
      recoverySet: [{id: 'User.passwordExpired', type: 'StaticErrorMessage'}],
      expected: stepsPasswordReset,
      expectedTitle: stepsPasswordResetTitle
    },
    {
      recoverySet: [{id: 'User.mobileNotVerified', type: 'StaticErrorMessage'}],
      expected: stepsContactInfoPhone,
      expectedTitle: stepsContactInfoPhoneTitle
    },
    {
      recoverySet: [{id: 'User.emailNotVerified', type: 'StaticErrorMessage'}],
      expected: stepsContactInfoEmail,
      expectedTitle: stepsContactInfoEmailTitle
    },
    { recoverySet: [
        {id: 'User.emailNotVerified', type: 'StaticErrorMessage'},
        {id: 'User.mobileNotVerified', type: 'StaticErrorMessage'}
      ],
      expected: stepsContactInfoEmail,
      expectedTitle: stepsContactInfoEmailTitle
    }
  ];

  beforeEach(() => {
    activatedRoute = new ActivatedRouteStub();
    mockAuthenticationService = createSpyObjFromClass(AuthenticationService);
    stepService = new StepIndicatorService();
    componentService = new ForcedDataCollectionService(stepService);
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        ForcedDataCollectionComponent,
        ContactInfoCollectionComponent,
        EmailVerificationComponent,
        ForcedDataCheckEmailComponent,
        ForcedResetPasswordComponent,
        MessagePopupComponent,
        NewPasswordComponent,
        CapslockTooltipComponent,
        MockIdleTimeoutComponent
      ],
      imports: [
        RouterTestingModule,
        FormsModule,
        TextMaskModule,
        NgIdleModule.forRoot(),
        ModalModule.forRoot()
      ],
      providers: [
        {provide: StepIndicatorService, useValue: stepService},
        {provide: ForcedDataCollectionService, useValue: componentService},
        {provide: AuthenticationService, useValue: mockAuthenticationService},
        {provide: Title, useClass: Title},
        {provide: Router, useValue: RouterStub},
        {provide: ActivatedRoute, useValue: activatedRoute},
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed
      .overrideComponent(ContactInfoCollectionComponent,
        {set: {template: '<div id=\"ContactInfoCollection\"></div>'}})
      .overrideComponent(EmailVerificationComponent,
        {set: {template: '<div id=\"EmailVerification\"></div>'}})
      .overrideComponent(ForcedDataCheckEmailComponent,
        {set: {template: '<div id=\"ForcedDataCheckEmail\"></div>'}})
      .overrideComponent(ForcedResetPasswordComponent,
        {set: {template: '<div id=\"ForcedResetPassword\"></div>'}})
      .overrideComponent(NewPasswordComponent,
        {set: {template: '<div id=\"NewPassword\"></div>'}})
      .overrideComponent(CapslockTooltipComponent,
        {set: {template: '<div id=\"CapslockTooltip\"></div>'}})
      .createComponent(ForcedDataCollectionComponent);
    component = fixture.componentInstance;

    // To suppress the console.log messages
    spyOn(window.console, 'log').and.callFake(() => {});
    mockAuthenticationService.validateAuthzPolicy.and.returnValue(of());

    fixture.detectChanges();
  });

  /**
   * The recoverSetArray has all of the possible test cases being returned from the authentication service, validate
   * validate policy check. This forEach loops through each one of the cases returned.
   * NOTE - The _item_ variable is the current element in the _recoverySetArray_ being referenced in the loop.
   */
  recoverySetArray.forEach(item => {
    // Gets the list of the typeset for the case and puts into a comma-delimited string for the 'it' test statement
    const idList = item['recoverySet'].map(x => x.id).join(', ');
    let setupResult;

    // This is called before the following 'it' method to setup the mock data
    beforeEach(() => {
      // Set up the test case return value to be returned from the authentication service
      setupResult = {
        data: {
          code: 'Authentication.Unauthenticated',
          message: 'Unauthenticated',
          details: {
            recovery: item['recoverySet']
          }
        }
      };
    });

    it('should ' + item['expectedTitle'] + ' when \[' + idList + '\]', () => {
      // Set the mock authentication service to return the set up result
      mockAuthenticationService.validateAuthzPolicy.and.returnValue(throwError(setupResult));
      componentService.setStepIndicatorReturnNavigation(setupResult);

      expect(stepService.getSteps()).toEqual(item['expected']);
    });
  });

});


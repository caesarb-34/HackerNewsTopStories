import {waitForAsync, ComponentFixture, TestBed} from '@angular/core/testing';
import {FormsModule} from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { Title } from '@angular/platform-browser';
import {NgIdleModule} from '@ng-idle/core';

import { TextMaskModule } from 'angular2-text-mask';
import {ModalModule} from 'ngx-bootstrap/modal';
import {of} from 'rxjs';
import {MockIdleTimeoutComponent} from '../../../test/idle-timeout-mock/mock-idle-timeout.component';
import {createSpyObjFromClass} from '../../../test/test.helper';

import { ContactInfoCollectionComponent } from './contact-info-collection.component';
import { StepIndicatorService } from '../../shared/services/step-indicator.service';
import { AuthenticationService } from 'sfg-ng-brand-library';
import { MessagePopupComponent } from '../../shared-components/message-popup/message-popup.component';
import {ActivatedRouteStub} from '../../../test/router-stubs';


describe('ContactInfoCollectionComponent', () => {
  let component: ContactInfoCollectionComponent;
  let compiledElem: HTMLElement;
  let fixture: ComponentFixture<ContactInfoCollectionComponent>;
  let stepService;
  let spyVerifySession: jasmine.Spy;
  let titleService: Title;
  let mockAuthService: jasmine.SpyObj<AuthenticationService>;

  const router = {
    navigate: jasmine.createSpy('navigate')
  };
  const activatedRoute = new ActivatedRouteStub();

  const userData = {
    defaultEmail: 'test@test.com',
    unknownPhone: '1234567890',
    verifiedEmails: ['test@test.com'],
    unverifiedEmails: ['unverifiedtest@test.com'],
    unverifiedMobiles: ['0987654321', '1111111111'],
    unverifiedPhones: ['2222222222', '3333333333'],
    verifiedMobiles: ['4444444444', '5555555555'],
    verifiedPhones: ['6666666666', '7777777777'],
    customer: ''
  };

  beforeEach(waitForAsync(() => {
    mockAuthService = createSpyObjFromClass(AuthenticationService);

    TestBed.configureTestingModule({
      declarations: [
        ContactInfoCollectionComponent,
        MessagePopupComponent,
        MockIdleTimeoutComponent
      ],
      imports: [
        FormsModule,
        RouterModule,
        TextMaskModule,
        NgIdleModule.forRoot(),
        ModalModule.forRoot()
      ],
      providers: [
        StepIndicatorService,
        { provide: AuthenticationService, useValue: mockAuthService },
        { provide: Router, useValue: router },
        { provide: ActivatedRoute, useValue: activatedRoute },
        { provide: Title, useValue: createSpyObjFromClass(Title) }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactInfoCollectionComponent);
    component = fixture.componentInstance;
    compiledElem = fixture.debugElement.nativeElement;

    stepService = TestBed.inject(StepIndicatorService);
    mockAuthService = TestBed.inject(AuthenticationService) as jasmine.SpyObj<AuthenticationService>;

    spyVerifySession = mockAuthService.verifySession
      .and.returnValue(of({ status: 200, headers: undefined, data: undefined }));

    mockAuthService.getUser.and.returnValue(of({
      status: 200,
      headers: undefined,
      data: {
        uid: 'test',
        firstName: 'test',
        lastName: 'test',
        defaultEmail: 'unverifiedtest@test.com',
        defaultPhone: '4444444444'
      }
    }));

  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should set the title to \"Contact Information \| The Standard\"', waitForAsync(() => {
    titleService = TestBed.inject(Title);
    component.ngOnInit();
    expect(titleService.setTitle).toHaveBeenCalledWith('Contact Information | The Standard');
  }));

  it('should toggle the editEmailDisplay from false to true', () => {
    // the editEmailDisplay is initialised to false in the component
    expect(component.editEmailDisplay).toBe(false);

    // the onClickEditEmailDisplay() function changes the variable to true
    component.onClickEditEmailDisplay();
    expect(component.editEmailDisplay).toBe(true);
  });

  it('should toggle the editPhoneDisplay from false to true', () => {
    // the editEmailDisplay is initialised to false in the component
    expect(component.editPhoneDisplay).toBe(false);

    // the onClickEditEmailDisplay() function changes the variable to true
    component.onClickEditPhoneDisplay();
    expect(component.editPhoneDisplay).toBe(true);
  });

  it('should redirect to login if StepIndicatorService is empty', () => {
    stepService.setSteps([]);
    fixture.detectChanges();
    expect(stepService.getSteps().length).toBe(0);
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should fill in the variables if StepIndicatorService is full', () => {
    stepService.setH1Title('testing');
    stepService.setSteps([{
      index: 1,
      label: 'Reset your password',
      route: '/password-expired'
    }]);

    expect(stepService.getSteps().length).toBeGreaterThan(0);
    expect(stepService.getH1Title()).toBe('testing');
    expect(stepService.getSteps()).toEqual([{
      index: 1,
      label: 'Reset your password',
      route: '/password-expired'
    }]);
  });

  it('should popup a second box if there is a 4xx error', () => {
    component.activeError = '409';
    fixture.detectChanges();
    const messagePopups = compiledElem.querySelectorAll('lgn-message-popup');
    expect(messagePopups.length).toBe(1);
    expect(messagePopups[0].textContent).toContain('Something went wrong');
  });

  xit('should watch to make sure assignUserDataForContactInfo() is called', () => {
    const spyAssignUserData = spyOn(component, 'assignUserDataForContactInfo').and.callThrough();
    const expectedValue = userData;
    component.selectedStep = 0;
    component.steps = [{ index: 1, label: 'Reset your password', route: '/password-expired' }];
    component.ngOnInit();

    expect(spyAssignUserData).toHaveBeenCalledWith(expectedValue);
  });

  it('should format a numerical string into a phone format', () => {
    const testPhone = '1234567890';

    expect(component.formatPhoneNumber(testPhone)).toBe('(123) 456-7890');
  });

  it('should keep the format of existing formatted phone number strings', () => {
    const testPhoneLong = '(123)456-7890';
    const testPhoneShort = '123-4567';

    expect(component.formatPhoneNumber(testPhoneLong)).toBe('(123) 456-7890');
    expect(component.formatPhoneNumber(testPhoneShort)).toBe('123-4567');
  });

  it('should make the form editable when orchis returns a badly formatted phone number', waitForAsync(() => {
    fixture.detectChanges();
    const userPhoneData = {
      defaultEmail: 'test@test.com',
      unknownPhone: '11sxD1a',
      unverifiedMobiles: [],
      unverifiedPhones: [],
      verifiedMobiles: [],
      verifiedPhones: []
    };

    component.assignUserDataForContactInfo(userPhoneData);
    fixture.whenStable().then(() => {
      fixture.detectChanges();

      expect(component.contactInfo.phone).toBe('11sxD1a');
      expect(component.editPhoneDisplay).toBeTruthy();
    });
  }));

  xit('should not make the form editable when orchis returns a well formatted phone number', waitForAsync(() => {
    fixture.detectChanges();
    const userPhoneData = {
      defaultEmail: 'test@test.com',
      unknownPhone: '5417778989',
      unverifiedMobiles: [],
      unverifiedPhones: [],
      verifiedMobiles: [],
      verifiedPhones: []
    };

    component.assignUserDataForContactInfo(userPhoneData);
    fixture.whenStable().then(() => {
      fixture.detectChanges();

      expect(component.contactInfo.phone).toBe('(541) 777-8989');
      expect(component.editPhoneDisplay).toBeFalsy();
    });
  }));

  it('should update contactInfo.phone with verifiedMobiles', waitForAsync(() => {
    const userPhoneData = {
      defaultEmail: 'test@test.com',
      unknownPhone: '',
      unverifiedMobiles: [],
      unverifiedPhones: [],
      verifiedMobiles: ['9876543210'],
      verifiedPhones: [],
      verifiedEmails: [],
      unverifiedEmails: ['unverifiedtest@test.com'],
      customer: ''
    };

    fixture.whenStable().then(() => {
      component.assignUserDataForContactInfo(userPhoneData);

      expect(component.contactInfo.email).toBe('unverifiedtest@test.com');
      expect(component.contactInfo.phone).toBe('(987) 654-3210');
    });
  }));

  it('should prioritize unverified phones over verified phones for setting displayed user info', waitForAsync(() => {
    const userPhoneData = {
      defaultEmail: 'test@test.com',
      unknownPhone: '',
      unverifiedMobiles: ['1234567890'],
      unverifiedPhones: ['9999999999'],
      verifiedMobiles: ['9876543210'],
      verifiedPhones: ['1111111111'],
      customer: ''
    };

    fixture.whenStable().then(() => {
      component.assignUserDataForContactInfo(userPhoneData);

      expect(component.contactInfo.email).toBe('');
      expect(component.contactInfo.phone).toBe('(123) 456-7890');
    });
  }));

  it('should prioritize unverified emails over verified emails for setting displayed user info', waitForAsync(() => {
    fixture.detectChanges();
    const user = {
      defaultEmail: 'test@test.com',
      unknownPhone: '',
      unverifiedEmails: ['myunverifiedemail@email.com'],
      verifiedEmails: ['myverifiedemail@email.com'],
      unverifiedMobiles: ['1234567890'],
      unverifiedPhones: ['9999999999'],
      verifiedMobiles: ['9876543210'],
      verifiedPhones: ['1111111111']
    };

    component.assignUserDataForContactInfo(user);
    fixture.whenStable().then(() => {
      fixture.detectChanges();

      expect(component.contactInfo.email).toBe('myunverifiedemail@email.com');
      expect(component.contactInfo.phone).toBe('(123) 456-7890');
    });
  }));

  it('should update contactInfo.phone with unknownPhone', waitForAsync(() => {
    const userPhoneData = {
      defaultEmail: 'test@test.com',
      unknownPhone: '7777777777',
      unverifiedMobiles: [],
      unverifiedPhones: [],
      verifiedMobiles: [],
      verifiedPhones: [],
      customer: ''
    };

    fixture.whenStable().then(() => {
      component.assignUserDataForContactInfo(userPhoneData);

      expect(component.contactInfo.email).toBe('');
      expect(component.contactInfo.phone).toBe('(777) 777-7777');
    });
  }));

  it('should update contactInfo.phone with unverifiedMobiles', waitForAsync(() => {
    const userPhoneData = {
      defaultEmail: 'test@test.com',
      unknownPhone: '',
      unverifiedMobiles: ['0987654321', '7777777777'],
      unverifiedPhones: [],
      verifiedMobiles: [],
      verifiedPhones: [],
      customer: ''
    };

    fixture.whenStable().then(() => {
      component.assignUserDataForContactInfo(userPhoneData);

      expect(component.contactInfo.email).toBe('');
      expect(component.contactInfo.phone).toBe('(777) 777-7777');
    });
  }));

  it('should update contactInfo.phone with unverifiedPhones', waitForAsync(() => {
    fixture.detectChanges();
    const userPhoneData = {
      defaultEmail: 'test@test.com',
      unknownPhone: '',
      unverifiedMobiles: [],
      unverifiedPhones: ['0987654321', '7777777777'],
      verifiedMobiles: [],
      verifiedPhones: [],
      customer: ''
    };

    fixture.whenStable().then(() => {
      component.assignUserDataForContactInfo(userPhoneData);

      expect(component.contactInfo.email).toBe('');
      expect(component.contactInfo.phone).toBe('(777) 777-7777');
    });
  }));


  it('should update contactInfo.phone with defaultLandline', () => {
    fixture.detectChanges();
    const userLandlineData = {
      defaultEmail: 'test@test.com',
      unknownPhone: '',
      unverifiedMobiles: [],
      unverifiedPhones: [],
      verifiedMobiles: [],
      verifiedPhones: ['6666666666', '7777777777'],
      customer: ''
    };

    component.assignUserDataForContactInfo(userLandlineData);
    fixture.detectChanges();
    expect(component.contactInfo.email).toBe('');
    expect(component.contactInfo.phone).toBe('(777) 777-7777');
  });

  it('should redirect to login if validSession returns an error', waitForAsync(() => {
    // authenticationService.verifySession();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });
  }));


  it('should redirect customer when email or phone is successfully updated', waitForAsync(() => {
    component.selectedStep = 0;
    component.steps = [{ index: 1, label: 'Reset your password', route: '/password-expired' }];
    spyOn(component, 'userUpdateContactInfo').and.returnValue(of([{status: 200, headers: null, data: undefined}]));
    component.onSubmit();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(router.navigate).toHaveBeenCalled();
    });
  }));


  xit('should call updateAndGenerateVerification w/ mobile if email is updated and mobile phone was selected', waitForAsync(() => {
    mockAuthService.updateAndGenerateVerification.and.returnValue(
        of([{status: 200, headers: null, data: undefined}])
    );
    mockAuthService.removeIdentifiers.and.returnValue(of({status: 200, headers: null, data: undefined}));


    const expectedValue = {
      user: {
        unverifiedEmails: ['newtest@test.com'],
        unverifiedPhones: ['9998881212'],
        unverifiedMobiles: []
      }
    };

    const formValue = {
      email: 'newtest@test.com',
      phone: '9998881212',
      isMobile: true
    };

    fixture.whenStable().then(() => {
      component.selectedStep = 0;
      component.steps = [{ index: 1, label: 'Reset your password', route: '/password-expired' }];
      activatedRoute.testQueryParams = {step: 1};
      component.collectInfoForm.setValue(formValue);
      component.assignUserDataForContactInfo({ data: userData});

      component.contactInfo.email = 'newtest@test.com';
      component.contactInfo.phone = '9998881212';
      component.contactInfo.isMobile = true;
      component.onSubmit();
      fixture.detectChanges();
      expect(mockAuthService.updateAndGenerateVerification).toHaveBeenCalledWith(expectedValue);
    });

  }));

  xit('should call updateAndGenerateVerification w/ land line if email is updated and mobile phone was not selected',
  waitForAsync(() => {
    const testUserData = {
      defaultEmail: 'working@test.com',
      unknownPhone: '1234567890',
      verifiedEmails: [],
      unverifiedEmails: ['newtest@test.com'],
      unverifiedPhones: ['9998881212'],
      unverifiedMobiles: [],
      customer: ''
    };
    mockAuthService.updateAndGenerateVerification
      .and.returnValue(of([{status: 200, headers: null, data: undefined}]));
    mockAuthService.removeIdentifiers.and.returnValue(of({status: 200, headers: null, data: undefined}));

    const expectedValue = {
      user: {
        unverifiedEmails: ['newtest@test.com'],
        unverifiedPhones: ['9998881212'],
        unverifiedMobiles: [],
        customer: ''
      }
    };

    fixture.whenStable().then(() => {
      component.selectedStep = 0;
      component.steps = [{ index: 1, label: 'Reset your password', route: '/password-expired' }];
      activatedRoute.testQueryParams = {step: 1};
      component.assignUserDataForContactInfo(testUserData);

      component.userData = testUserData;
      component.contactInfo.email = 'newtest@test.com';
      component.contactInfo.phone = '9998881212';
      component.contactInfo.isMobile = false;

      component.onSubmit(true);
      fixture.detectChanges();

      expect(mockAuthService.updateAndGenerateVerification).toHaveBeenCalledWith(expectedValue);
    });
  }));

  xit('should add email as unverified if the user doesn\'t have a default email', waitForAsync(() => {
    const testUserData = {
      defaultEmail: 'customtest@test.com',
      unknownPhone: '1234567890',
      verifiedEmails: ['test@test.com'],
      unverifiedEmails: ['unverifiedtest@test.com'],
      unverifiedMobiles: ['0987654321', '1111111111'],
      unverifiedPhones: ['2222222222', '3333333333'],
      verifiedMobiles: ['4444444444', '5555555555'],
      verifiedPhones: ['6666666666', '7777777777'],
      customer: ''
    };
    const expectedValue = {
      user: {
        unverifiedEmails: ['mynewemail@email.com'],
        unverifiedMobiles: ['1112223333'],
        unverifiedPhones: []
      }
    };
    const formValue = {
      email: 'mynewemail@email.com',
      phone: '1112223333',
      isMobile: true
    };
    mockAuthService.getUser.and.returnValue(of({status: 200, headers: null, data: userData }));
    mockAuthService.updateAndGenerateVerification.and.returnValue(
        of([{status: 200, headers: null, data: undefined}])
    );
    component.selectedStep = 0;
    component.steps = [{ index: 1, label: 'Reset your password', route: '/password-expired' }];

    const userDataNoEmail = JSON.parse(JSON.stringify(testUserData));
    delete userDataNoEmail.defaultEmail;
    activatedRoute.testQueryParams = {step: 1};
    component.assignUserDataForContactInfo({ data: userDataNoEmail });


    fixture.whenStable().then(() => {
      component.collectInfoForm.setValue(formValue);
      fixture.detectChanges();
      component.onSubmit();
      expect(mockAuthService.updateAndGenerateVerification).toHaveBeenCalledWith(expectedValue);
    });
  }));

  xit('should call updateAndGenerateVerification with an email if user only updates phone number but email is unverified',
  waitForAsync(() => {
    const spyUpdateUser = mockAuthService.updateAndGenerateVerification.and.returnValue(
        of([{status: 200, headers: null, data: undefined}])
    );
    const expectedValue = {
      user: {
        unverifiedEmails: ['unverifiedtest@test.com'],
        unverifiedMobiles: ['9998881212'],
        unverifiedPhones: []
      }
    };

    component.selectedStep = 0;
    component.steps = [{ index: 1, label: 'Reset your password', route: '/password-expired' }];
    activatedRoute.testQueryParams = {step: 1};
    component.contactInfo.email = 'unverifiedtest@test.com';
    component.contactInfo.phone = '9998881212';
    component.contactInfo.isMobile = true;

    fixture.whenStable().then(() => {
      component.assignUserDataForContactInfo(userData);
      component.onSubmit();
      expect(spyUpdateUser).toHaveBeenCalledWith(expectedValue);
    });

  }));

  xit('should update default email if a user has two verified emails and changes to the other', waitForAsync(() => {
    const spyUpdateUser = mockAuthService.updateAndGenerateVerification
      .and.returnValue(of([{status: 200, headers: null, data: undefined}]));
    const verifiedData = {
      defaultEmail: 'test@test.com',
      unknownPhone: '',
      unverifiedMobiles: [],
      unverifiedPhones: [],
      verifiedEmails: ['test@test.com', 'othertest@test.com'],
      verifiedMobiles: [],
      verifiedPhones: ['6666666666', '7777777777']
    };
    const expectedValue = {
      user: {
        defaultEmail: 'othertest@test.com',
        unverifiedMobiles: ['9998881212'],
        unverifiedPhones: []
      }
    };
    component.selectedStep = 0;
    component.steps = [{ index: 1, label: 'Reset your password', route: '/password-expired' }];
    activatedRoute.testQueryParams = {step: 1};

    fixture.whenStable().then(() => {
      component.assignUserDataForContactInfo(verifiedData);

      component.contactInfo.email = 'othertest@test.com';
      component.contactInfo.phone = '9998881212';
      component.contactInfo.isMobile = true;
      component.onSubmit();
      expect(spyUpdateUser).toHaveBeenCalledWith(expectedValue);
    });
  }));

  describe('====> isThisEmailVerified() && isEmailInUnverifiedList()', () => {
    const testEmail = 'emailTest@domain.com';
    const testCases = [
      {verifiedEmails: [testEmail], unverifiedEmails: [testEmail], expected: true},
      {verifiedEmails: [testEmail], unverifiedEmails: [], expected: true},
      {verifiedEmails: [], unverifiedEmails: [testEmail], expected: false},
      {verifiedEmails: [], unverifiedEmails: [], expected: undefined},
      {verifiedEmails: [testEmail], unverifiedEmails: [testEmail], expected: true},
      {verifiedEmails: [testEmail], unverifiedEmails: undefined, expected: true},
      {verifiedEmails: undefined, unverifiedEmails: [testEmail], expected: false},
      {verifiedEmails: undefined, unverifiedEmails: undefined, expected: undefined}
    ];

    testCases.forEach(item => {
      const strExpected = item.expected ? item.expected.toString() : 'undefined';
      const strVerEmail = item.verifiedEmails ? item.verifiedEmails.toString() : 'undefined';
      const strUnVerEmail = item.unverifiedEmails ? item.unverifiedEmails.toString() : 'undefined';
      const itDesc = 'output [' + strExpected + '] '
        + 'when verified=[' + strVerEmail + '] and '
        + 'unverified=[' + strUnVerEmail + ']';

      it('should ' + itDesc, () => {
        component.userData = {
          defaultEmail: 'test@test.com',
          unknownPhone: '1234567890',
          verifiedEmails: item.verifiedEmails,
          unverifiedEmails: item.unverifiedEmails
        };

        const result = component.isThisEmailVerified(testEmail);
        // expect(component.userData).toBe({});
        expect(result).toBe(item.expected);
      });
    });

    it('should return [true] when email is IN unverified array', () => {
      component.userData = {
        defaultEmail: 'test@test.com',
        unknownPhone: '1234567890',
        unverifiedEmails: [testEmail]
      };
      const result = component.isEmailInUnverifiedList(testEmail);
      expect(result).toBeTruthy();
    });

    it('should return [false] when email is NOT IN unverified array', () => {
      component.userData = {
        defaultEmail: 'test@test.com',
        unknownPhone: '1234567890',
        unverifiedEmails: []
      };
      const result = component.isEmailInUnverifiedList(testEmail);
      expect(result).toBeFalsy();
    });

    it('should return [false] when unverified array is undefined', () => {
      component.userData = {
        defaultEmail: 'test@test.com',
        unknownPhone: '1234567890',
        unverifiedEmails: undefined
      };
      const result = component.isEmailInUnverifiedList(testEmail);
      expect(result).toBeFalsy();
    });
  });


});

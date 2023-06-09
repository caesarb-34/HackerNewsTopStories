import {waitForAsync, ComponentFixture, TestBed, tick} from '@angular/core/testing';
import {Router} from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TextMaskModule } from 'angular2-text-mask';
import {ModalModule} from 'ngx-bootstrap/modal';
import {createSpyObjFromClass} from '../../../test/test.helper';

import { PhonePipe } from '../../shared/pipes/phone.pipe';
import { CreateAccountComponent } from './create-account.component';
import {UserRegistrationModel} from '../../shared/models/user.registration.model';
import {SelfRegistrationService} from '../self-registration.service';
import {RouterStub} from '../../../test/router-stubs';

describe('CreateAccountComponent', () => {
  let component: CreateAccountComponent;
  let fixture: ComponentFixture<CreateAccountComponent>;
  const routerStub = new RouterStub();
  let spyGetUserInfo: jasmine.Spy;
  let stubSelfRegService: jasmine.SpyObj<SelfRegistrationService>;

  const testViewModel: UserRegistrationModel = {
    uid: 'goodusername',
    password: 'Standard123',
    firstName: 'user',
    lastName: 'test',
    email: 'test@standard.com',
    mobile: '9711234576',
    phone: '',
    isMobile: true,
    mfaMethod: 'NONE'
  };

  beforeEach(waitForAsync(() => {
    stubSelfRegService = createSpyObjFromClass(SelfRegistrationService);
    TestBed.configureTestingModule({
      declarations: [
        CreateAccountComponent,
        PhonePipe
      ],
      imports: [
        FormsModule,
        TextMaskModule,
        ModalModule.forRoot()
      ],
      providers: [
        {provide: SelfRegistrationService, useValue: stubSelfRegService},
        {provide: Router, useValue: routerStub}
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateAccountComponent);
    component = fixture.componentInstance;

    stubSelfRegService = TestBed.inject(SelfRegistrationService) as jasmine.SpyObj<SelfRegistrationService>;
    spyGetUserInfo = stubSelfRegService.getUserInformation.and.returnValue(testViewModel);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set the modal message and show the modal', () => {
    const spyHelpModal = spyOn(component.helpModal, 'show');
    component.modalMessage = null;
    component.helpIndicatorClick('email');

    expect(component.modalMessage).toBe(component.HELP_MODAL_MESSAGES['email']);
    expect(spyHelpModal).toHaveBeenCalled();
  });

  it('should not set the modal message and not show the modal when value passed in is unavailable', () => {
    const spyHelpModal = spyOn(component.helpModal, 'show');
    component.modalMessage = component.HELP_MODAL_MESSAGES['email'];
    component.helpIndicatorClick('');

    expect(component.modalMessage).toBeUndefined();
    expect(spyHelpModal).not.toHaveBeenCalled();
  });

  it('should call the Self Registration Service when form is valid and submitted', waitForAsync(() => {
    spyOn(component, 'verifyDataModel').and.returnValue(true);

    fixture.whenStable().then(() => {
      component.userViewModel = testViewModel;
      const testFormValue = {
        firstName: 'user',
        lastName: 'test',
        email: 'test@standard.com',
        phone: '1234567890',
        isMobile: true
      };
      component.createAccountForm.setValue(testFormValue);
      fixture.detectChanges();
      component.onSubmit();

      expect(stubSelfRegService.setNewUserInformation).toHaveBeenCalledWith(testViewModel);
    });
  }));

  it('should not call the Self Registration Service when form is invalid and submitted', waitForAsync(() => {
    const spySelfRegSetNewUser = stubSelfRegService.setNewUserInformation;
    spyOn(component, 'verifyDataModel').and.returnValue(false);

    fixture.whenStable().then(() => {
      const inValidViewModel = testViewModel;
      inValidViewModel.firstName = null;
      inValidViewModel.lastName = null;
      component.userViewModel = inValidViewModel;
      component.createAccountForm.form.reset();
      fixture.detectChanges();
      component.onSubmit();

      expect(component.createAccountForm.valid).toBeFalsy();
      expect(spySelfRegSetNewUser).not.toHaveBeenCalled();
    });
  }));

  describe('====> verifyDataModel()', () => {
    it('should return true when all necessary fields have values for UserRegistrationModel', () => {
      const testUser: UserRegistrationModel = {
        uid: '',
        firstName: 'first name',
        lastName: 'last name',
        email: 'email@email.com',
        mobile: '1234567890',
        password: '',
        isMobile: true
      };

      expect(component.verifyDataModel(testUser)).toBeTruthy();
    });

    it('should return false if missing necessary values for UserRegistrationModel', () => {
      const testUser: UserRegistrationModel = {
        uid: '',
        firstName: '',
        lastName: 'last name',
        email: 'email@email.com',
        mobile: '1234567890',
        password: '',
        isMobile: true
      };

      expect(component.verifyDataModel(testUser)).toBeFalsy();
    });
  });

  describe('===> ', () => {
    it('should return true when string has value', () => {
      expect(component.isValidStringValue('hello')).toBeTruthy();
    });

    it('should return false when string has no value or empty string', () => {
      expect(component.isValidStringValue('')).toBeFalsy();
    });
  });

  it('should show error when email is not valid ', () => {
    fixture.whenStable().then(() => {
      const emailInput = component.createAccountForm.controls['email'];
      emailInput.setValue('test@');
      expect(emailInput.valid).toBeFalsy('Not valid email');
    });
  });

  it('should NOT show error when email valid ', () => {
    fixture.whenStable().then(() => {
      const emailInput = component.createAccountForm.controls['email'];
      emailInput.setValue('test@test.com');
      expect(emailInput.valid).toBeTruthy('Valid email');
    });
  });

});

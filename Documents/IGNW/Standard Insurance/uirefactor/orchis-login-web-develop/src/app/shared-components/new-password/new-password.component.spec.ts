import {waitForAsync, ComponentFixture, TestBed} from '@angular/core/testing';
import {FormsModule} from '@angular/forms';
import {Component} from '@angular/core';
import {RouterTestingModule} from '@angular/router/testing';
import {Title} from '@angular/platform-browser';
import {of} from 'rxjs';

import {NewPasswordComponent} from './new-password.component';
import {StepIndicatorComponent} from '../step-indicator/step-indicator.component';
import {CapslockTooltipComponent} from '../capslock-tooltip/capslock-tooltip.component';
import {AuthenticationService} from 'sfg-ng-brand-library';
/** mock authentication service */
import {StepIndicatorService} from '../../shared/services/step-indicator.service';
import {createSpyObjFromClass} from '../../../test/test.helper';

@Component({
  template: `
    <router-outlet></router-outlet>
  `
})
class MockRoutingComponent {
}

/**
 * this mock component is a mock routing destination
 */
@Component({
  template: ``
})
class MockComponent {
}

describe('NewPasswordComponent', () => {
  let component: NewPasswordComponent;
  let fixture: ComponentFixture<NewPasswordComponent>;

  let spyInitReq: jasmine.Spy;
  let spyInBlackList: jasmine.Spy;
  let spyCheckPasswordCond: jasmine.Spy;
  let spyToForgotPassword: jasmine.Spy;

  let mockAuthenticationService: jasmine.SpyObj<AuthenticationService>;
  const blackListMock = ['Your', 'password', 'is', 'blacklisted'];
  const specialCharacters = [
    '!', '\'', '#', '$', '%', '&', '\'', '(', ')', '*', '+', ',',
    '-', '.', '/', ':', ';', '=', '?', '@', '[', ']', '^', '_',
    '`', '{', '|', '}', '~', '\\'
  ];

  const ruleCombination: {
    length: boolean,
    lowercase: boolean,
    uppercase: boolean,
    special: boolean,
    specialbracket: boolean,
    blacklisted: boolean,
    expected: boolean
  }[] = [
    {length: true, lowercase: true, uppercase: true, special: true, specialbracket: true, blacklisted: true, expected: false},
    {length: true, lowercase: true, uppercase: true, special: true, specialbracket: true, blacklisted: false, expected: true},
    {length: true, lowercase: true, uppercase: true, special: false, specialbracket: false, blacklisted: true, expected: false},
    {length: true, lowercase: true, uppercase: true, special: false, specialbracket: false, blacklisted: false, expected: false},
    {length: true, lowercase: true, uppercase: false, special: true, specialbracket: true, blacklisted: true, expected: false},
    {length: true, lowercase: true, uppercase: false, special: true, specialbracket: true, blacklisted: false, expected: false},
    {length: true, lowercase: true, uppercase: false, special: false, specialbracket: false, blacklisted: true, expected: false},
    {length: true, lowercase: false, uppercase: false, special: false, specialbracket: false, blacklisted: false, expected: false},
    {length: true, lowercase: false, uppercase: true, special: true, specialbracket: true, blacklisted: true, expected: false},
    {length: true, lowercase: false, uppercase: true, special: true, specialbracket: true, blacklisted: false, expected: false},
    {length: true, lowercase: false, uppercase: true, special: false, specialbracket: false, blacklisted: true, expected: false},
    {length: true, lowercase: false, uppercase: true, special: false, specialbracket: false, blacklisted: false, expected: false},
    {length: true, lowercase: false, uppercase: false, special: true, specialbracket: true, blacklisted: true, expected: false},
    {length: true, lowercase: false, uppercase: false, special: true, specialbracket: true, blacklisted: false, expected: false},
    {length: true, lowercase: false, uppercase: false, special: false, specialbracket: false, blacklisted: true, expected: false},
    {length: true, lowercase: false, uppercase: false, special: false, specialbracket: false, blacklisted: false, expected: false},
    {length: false, lowercase: true, uppercase: true, special: true, specialbracket: true, blacklisted: true, expected: false},
    {length: false, lowercase: true, uppercase: true, special: true, specialbracket: true, blacklisted: false, expected: false},
    {length: false, lowercase: true, uppercase: true, special: false, specialbracket: false, blacklisted: true, expected: false},
    {length: false, lowercase: true, uppercase: true, special: false, specialbracket: false, blacklisted: false, expected: false},
    {length: false, lowercase: true, uppercase: false, special: true, specialbracket: true, blacklisted: true, expected: false},
    {length: false, lowercase: true, uppercase: false, special: true, specialbracket: true, blacklisted: false, expected: false},
    {length: false, lowercase: true, uppercase: false, special: false, specialbracket: false, blacklisted: true, expected: false},
    {length: false, lowercase: false, uppercase: false, special: false, specialbracket: false, blacklisted: false, expected: false},
    {length: false, lowercase: false, uppercase: true, special: true, specialbracket: true, blacklisted: true, expected: false},
    {length: false, lowercase: false, uppercase: true, special: true, specialbracket: true, blacklisted: false, expected: false},
    {length: false, lowercase: false, uppercase: true, special: false, specialbracket: false, blacklisted: true, expected: false},
    {length: false, lowercase: false, uppercase: true, special: false, specialbracket: false, blacklisted: false, expected: false},
    {length: false, lowercase: false, uppercase: false, special: true, specialbracket: true, blacklisted: true, expected: false},
    {length: false, lowercase: false, uppercase: false, special: true, specialbracket: true, blacklisted: false, expected: false},
    {length: false, lowercase: false, uppercase: false, special: false, specialbracket: false, blacklisted: true, expected: false},
    {length: false, lowercase: false, uppercase: false, special: false, specialbracket: false,  blacklisted: false, expected: false}
  ];

  const strengthBarCases: { req: boolean, score: number, prefix: string, class: string }[] = [
    {req: true, score: 0, prefix: 'Good', class: 'password-strength-good'},
    {req: true, score: 1, prefix: 'Good', class: 'password-strength-good'},
    {req: true, score: 2, prefix: 'Good', class: 'password-strength-good'},
    {req: true, score: 3, prefix: 'Good', class: 'password-strength-good'},
    {req: true, score: 4, prefix: 'Strong', class: 'password-strength-strong'},
    {req: false, score: 0, prefix: 'Password Strength', class: 'password-strength-default'},
    {req: false, score: 1, prefix: 'Weak', class: 'password-strength-weak'},
    {req: false, score: 2, prefix: 'Weak', class: 'password-strength-weak-2'},
    {req: false, score: 4, prefix: 'Better', class: 'password-strength-better'},
  ];

  beforeEach(waitForAsync(() => {
    mockAuthenticationService = createSpyObjFromClass(AuthenticationService);

    TestBed.configureTestingModule({
      declarations: [
        NewPasswordComponent,
        StepIndicatorComponent,
        MockRoutingComponent,
        MockComponent,
        CapslockTooltipComponent
      ],
      imports: [
        FormsModule,
        RouterTestingModule.withRoutes([
          {path: '', component: MockComponent},
          {path: 'password-changed', component: MockComponent},
          {path: 'set-password-fail/400', component: MockComponent},
          {path: 'set-password-fail/422', component: MockComponent}
        ])
      ],
      providers: [
        {provide: Title, useClass: Title},
        {provide: AuthenticationService, useValue: mockAuthenticationService },
        StepIndicatorService
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.overrideComponent(StepIndicatorComponent,
      {set: {template: 'step component'}})
      .createComponent(NewPasswordComponent);
    component = fixture.componentInstance;
    mockAuthenticationService.activateByEmail.and.returnValue(of());
    mockAuthenticationService.confirmResetPassword.and.returnValue(of());
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  // Test the showPassword() function
  it('should toggle the passwordInputType and isShowPasswords values', () => {
    expect(component.passwordInputType).toEqual('password');
    expect(component.isShowPasswords).toBeFalsy();
    component.showPasswords();
    expect(component.passwordInputType).toEqual('text');
    expect(component.isShowPasswords).toBeTruthy();
    component.showPasswords();
    expect(component.passwordInputType).toEqual('password');
    expect(component.isShowPasswords).toBeFalsy();
  });

  // Test the Set() function

  // Test the evalPassword() function
  it('should reset all the rule flags', () => {
    expect(component.lengthRequirementMet).toBeFalsy();
    expect(component.lowercaseRequirementMet).toBeFalsy();
    expect(component.uppercaseRequirementMet).toBeFalsy();
    expect(component.specialCharacterRequirementMet).toBeFalsy();
    expect(component.specialBracketsCharacterRequirementMet).toBeFalsy();
    expect(component.disallowedFound).toBeFalsy();
  });

  it('should set rule 1 to true when correct length and false otherwise ', () => {
    component.newPassword = 'abcdefghij';
    fixture.detectChanges();
    component.checkPasswordConditions();
    expect(component.lengthRequirementMet).toBeTruthy();

    component.newPassword = 'abcdefgh';
    fixture.detectChanges();
    component.checkPasswordConditions();
    expect(component.lengthRequirementMet).toBeFalsy();
  });

  it('should set lowercaseRequirementMet to true when it contains lowercase letters and false otherwise', () => {
    component.newPassword = 'abcdefghij';
    fixture.detectChanges();
    component.checkPasswordConditions();
    expect(component.lowercaseRequirementMet).toBeTruthy();

    component.newPassword = '1234567890';
    fixture.detectChanges();
    component.checkPasswordConditions();
    expect(component.lowercaseRequirementMet).toBeFalsy();
  });

  it('should set uppercaseRequirementMet to true when it contains uppercase letters and false otherwise', () => {
    component.newPassword = 'abcDEFghij';
    fixture.detectChanges();
    component.checkPasswordConditions();
    expect(component.uppercaseRequirementMet).toBeTruthy();

    component.newPassword = 'abcdefghij';
    fixture.detectChanges();
    component.checkPasswordConditions();
    expect(component.uppercaseRequirementMet).toBeFalsy();
  });

  specialCharacters.forEach(item => {
    it('should set specialCharacterRequirementMet to true when it contains \'' + item + '\'', () => {
      spyInBlackList = spyOn(component, 'inBlackList').and.callFake(() => true);
      component.newPassword = 'abcdefghij' + item;
      fixture.detectChanges();
      component.checkPasswordConditions();
      expect(component.specialCharacterRequirementMet).toBeTruthy();
    });
  });

  it('should set specialCharacterRequirementMet to false when no special characters are in the password', () => {
    component.newPassword = 'abcdefghij';
    fixture.detectChanges();
    component.checkPasswordConditions();
    expect(component.specialCharacterRequirementMet).toBeFalsy();
  });

  it('should set specialBracketsCharacterRequirementMet to true when no brackets are in the password', () => {
    component.newPassword = 'abcdefghij';
    fixture.detectChanges();
    component.checkPasswordConditions();
    expect(component.specialBracketsCharacterRequirementMet).toBeTruthy();
  });

  it('should set specialBracketsCharacterRequirementMet to false when brackets are in the password', () => {
    component.newPassword = 'abcdefghij<>';
    fixture.detectChanges();
    component.checkPasswordConditions();
    expect(component.specialBracketsCharacterRequirementMet).toBeFalsy();
  });

  ruleCombination.forEach(item => {
    const strCondition = item.length + ','
      + item.lowercase + ','
      + item.uppercase + ','
      + item.special + ','
      + item.specialbracket + ','
      + item.blacklisted;
    it('should set passwordMeetsSICRequirements=[' + item.expected + '] when [' + strCondition + ']', () => {
      spyInitReq = spyOn(component, 'initializeRequirements')
        .and.callFake(() => {
        });
      spyInBlackList = spyOn(component, 'inBlackList')
        .and.returnValue(item.blacklisted);
      spyCheckPasswordCond = spyOn(component, 'checkPasswordConditions')
        .and.callFake(() => {
        });

      component.lengthRequirementMet = item.length;
      component.lowercaseRequirementMet = item.lowercase;
      component.uppercaseRequirementMet = item.uppercase;
      component.specialCharacterRequirementMet = item.special;
      component.specialBracketsCharacterRequirementMet = item.specialbracket;
      component.isBlacklisted = item.blacklisted;
      component.passwordMeetsSICRequirements = false;
      fixture.detectChanges();
      component.evalPassword();

      expect(component.passwordMeetsSICRequirements).toBe(item.expected);
    });
  });

  // Test the setStrengthBar() function
  strengthBarCases.forEach(item => {
    const strCase = 'prefix=[' + item.prefix + '], '
      + 'class=[' + item.class + ']'
      + ' when req=[' + item.req + '] and '
      + 'score=[' + item.score + ']';
    it('should set ' + strCase, () => {
      const spyZxcvbn = spyOn(component, 'getZxcvbnScore')
        .and.returnValue({score: item.score, feedback: {warning: 'Warning'}});
      component.passwordMeetsSICRequirements = item.req;
      component.setStrengthBar();
      fixture.detectChanges();
      expect(component.strengthMsgPrefix).toEqual(item.prefix);
      expect(component.strengthBarClass).toEqual(item.class);
    });
  });

  // Test the inBlackList() function
  it('should return true when password is in blacklist', () => {
    component.blackListedPasswords = blackListMock;
    fixture.detectChanges();
    expect(component.inBlackList('password')).toBeTruthy();
  });

  it('should return false when password is not in blacklist', () => {
    component.blackListedPasswords = blackListMock;
    fixture.detectChanges();
    expect(component.inBlackList('pickles')).toBeFalsy();
  });

  // Test the initializeRequirements() function
  it('should set all the requirements to false', () => {
    component.initializeRequirements();
    fixture.detectChanges();
    expect(component.lengthRequirementMet).toBeFalsy();
    expect(component.lowercaseRequirementMet).toBeFalsy();
    expect(component.uppercaseRequirementMet).toBeFalsy();
    expect(component.specialCharacterRequirementMet).toBeFalsy();
    expect(component.specialBracketsCharacterRequirementMet).toBeFalsy();
    expect(component.disallowedFound).toBeFalsy();
    expect(component.passwordMeetsSICRequirements).toBeFalsy();
  });

  // Test the submitPassword() function
  it('should set submitted to true when submitPassword() is called', () => {
    const spyCheckPassMatch: jasmine.Spy = spyOn(component, 'checkIfPasswordsMatch');
    component.passwordMeetsSICRequirements = true;
    component.confirmPasswordMatch = true;
    mockAuthenticationService.confirmResetPassword
      .and.returnValue(of({status: 204, headers: null, data: undefined}));
    component.submitPassword();
    fixture.detectChanges();
    expect(component.submitted).toBeTruthy();
  });

  it('should set confirmPasswordMatch to true when both newPassword and confirmPassword match', () => {
    component.newPassword = 'string';
    component.confirmPassword = 'string';
    component.checkIfPasswordsMatch();
    fixture.detectChanges();
    expect(component.confirmPasswordMatch).toBeTruthy();

    component.newPassword = 'string';
    component.confirmPassword = 'BAD';
    component.checkIfPasswordsMatch();
    fixture.detectChanges();
    expect(component.confirmPasswordMatch).toBeFalsy();

    component.newPassword = 'BAD';
    component.confirmPassword = 'string';
    component.checkIfPasswordsMatch();
    fixture.detectChanges();
    expect(component.confirmPasswordMatch).toBeFalsy();
  });

  it('should set submitSuccess to true when both confirmPasswordMatch and passwordMeetsSICRequirement are true', () => {
    const spyCheckPassMatch: jasmine.Spy = spyOn(component, 'checkIfPasswordsMatch');
    component.confirmPasswordMatch = true;
    component.passwordMeetsSICRequirements = true;
    component.submitPassword();
    fixture.detectChanges();
    expect(component.submitSuccess).toBeTruthy();
  });

  it('should set submitSuccess to false when either or both confirmPasswordMatch and passwordMeetsSICRequirement are false', () => {
    const spyCheckPassMatch: jasmine.Spy = spyOn(component, 'checkIfPasswordsMatch');
    component.confirmPasswordMatch = true;
    component.passwordMeetsSICRequirements = false;
    component.submitPassword();
    fixture.detectChanges();
    expect(component.submitSuccess).toBeFalsy();

    component.confirmPasswordMatch = false;
    component.passwordMeetsSICRequirements = true;
    component.submitPassword();
    fixture.detectChanges();
    expect(component.submitSuccess).toBeFalsy();

    component.confirmPasswordMatch = false;
    component.passwordMeetsSICRequirements = false;
    component.submitPassword();
    fixture.detectChanges();
    expect(component.submitSuccess).toBeFalsy();
  });

  it('should submit if all fields are filled', () => {
    component.selectedStep = '0';
    mockAuthenticationService.updatePassword.and.returnValue(of({status: 200, headers: null, data: undefined}));
    spyOn(component.router, 'navigate').and.returnValue(Promise.resolve(true));
    spyOn(component.stepIndicatorService, 'getSteps').and.returnValue(
      [{ index: 0, label: 'hello', route: '' }]
    );
    component.needsCurrentPassword = true;
    component.currentPassword = 'standard1';
    component.newPassword = 'standard1A';
    component.confirmPassword = 'standard1A';
    component.evalPassword();
    component.submitPassword();

    expect(component.authenticationService.updatePassword).toHaveBeenCalled();
  });

  it('should submit through activateByEmail if it was an admin provisioned user', () => {
    component.selectedStep = '0';
    mockAuthenticationService.activateByEmail.and.returnValue(of({status: 200, headers: null, data: undefined}));
    spyOn(component.router, 'navigate').and.returnValue(Promise.resolve(true));
    spyOn(component.stepIndicatorService, 'getSteps').and.returnValue(
        [{ index: 0, label: 'hello', route: '' }]
    );
    component.provisioned = true;
    component.otpCode = '123456a';
    component.needsCurrentPassword = false;
    component.newPassword = 'standard1A!';
    component.confirmPassword = 'standard1A!';
    component.evalPassword();
    component.submitPassword();

    expect(component.submitted).toBeTruthy();
    expect(component.authenticationService.activateByEmail).toHaveBeenCalledWith('123456a', 'standard1A!');
  });
  it('should redirect to Forgot Password page', () => {
    spyToForgotPassword = spyOn(component, 'navigateToForgotPassword').and.callFake(() => {});
    component.navigateToForgotPassword();
    fixture.detectChanges();
    expect(spyToForgotPassword).toHaveBeenCalled();
  });
});

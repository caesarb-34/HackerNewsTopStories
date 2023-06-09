import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import {ControlContainer, FormsModule, NgForm} from '@angular/forms';
import * as zxcvbn from 'zxcvbn';
import {SelfRegSetPasswordComponent} from './self-reg-set-password.component';
import {CapslockTooltipComponent} from '../../shared-components/capslock-tooltip/capslock-tooltip.component';
import {SetLoginCredentialsComponent} from '../set-login-credentials/set-login-credentials.component';
import {PasswordValidation} from '../../shared/models/password-validation';
import {ValidatePasswordDirective} from '../../shared-components/directives/validate-password.directive';

describe('SelfRegSetPasswordComponent', () => {
  let component: SelfRegSetPasswordComponent;
  let fixture: ComponentFixture<SelfRegSetPasswordComponent>;


  const parent = SetLoginCredentialsComponent;
  const blackListMock = ['Your', 'password', 'is', 'blacklisted'];
  const testPasswordValidation = new PasswordValidation();
  const specialCharacters = [
    '!', '\'', '#', '$', '%', '&', '\'', '(', ')', '*', '+', ',',
    '-', '.', '/', ':', ';', '=', '?', '@', '[', ']', '^', '_',
    '`', '{', '|', '}', '~', '\\'
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
    TestBed.configureTestingModule({
      imports: [
        FormsModule
      ],
      declarations: [
        SelfRegSetPasswordComponent,
        CapslockTooltipComponent,
        ValidatePasswordDirective
      ],
      providers: [
        { provide: NgForm },
        { provide: ControlContainer, useExisting: NgForm  },
        { provide: SetLoginCredentialsComponent, useExisting: NgForm  }
      ]

    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelfRegSetPasswordComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set ConfirmPasswordMatch when calling onChangeConfirmPassword()', () => {
    component.newPassword = 'Standard123';
    component.confirmPassword = 'Standard123';
    component.confirmPasswordMatch = false;
    component.onChangeConfirmPassword();

    expect(component.confirmPasswordMatch).toBeTruthy();
  });

  it('should set focusNewPassword to true and set ConfirmPasswordMatch when calling onFocusNewPassword()', () => {
    component.newPassword = 'Standard123';
    component.confirmPassword = 'Standard123';
    component.confirmPasswordMatch = false;
    component.focusNewPassword = false;
    const spyOnChangePassword = spyOn(component, 'onChangeNewPassword').and.callFake(() => {});
    fixture.detectChanges();
    component.onFocusNewPassword();

    expect(component.focusNewPassword).toBeTruthy();
    expect(spyOnChangePassword).toHaveBeenCalled();
    expect(component.confirmPasswordMatch).toBeTruthy();
  });

  it('should set focusConfirmPassword to true and set ConfirmPasswordMatch when calling onFocusConfirmPassword()', () => {
    component.newPassword = 'Standard123';
    component.confirmPassword = 'Standard123';
    component.confirmPasswordMatch = false;
    component.focusConfirmPassword = false;
    const spyOnChangePassword = spyOn(component, 'onChangeNewPassword').and.callFake(() => {});
    fixture.detectChanges();
    component.onFocusConfirmPassword();

    expect(component.focusConfirmPassword).toBeTruthy();
    expect(spyOnChangePassword).toHaveBeenCalled();
    expect(component.confirmPasswordMatch).toBeTruthy();
  });

  describe('===> setStrengthBar()', () => {
    strengthBarCases.forEach(item => {
      const strCase = 'prefix=[' + item.prefix + '], '
        + 'class=[' + item.class + ']'
        + ' when req=[' + item.req + '] and '
        + 'score=[' + item.score + ']';

      it('should set ' + strCase, () => {
        spyOn(component, 'getZxcvbnScore').and.returnValue({
          score: item.score, feedback: {warning: 'Warning'}
        });
        component.passwordMeetsSICRequirements = item.req;

        component.setStrengthBar('password');
        fixture.detectChanges();
        expect(component.strengthMsgPrefix).toEqual(item.prefix);
        expect(component.strengthBarClass).toEqual(item.class);
      });
    });
  });


  describe('===> helper functions', () => {

    describe('===> checkIfPasswordsMatch()', () => {
      it('should return true if the passwords match', () => {
        component.newPassword = 'hello';
        component.confirmPassword = 'hello';

        expect(component.checkIfPasswordsMatch()).toBeTruthy();
      });

      it('should return false if the passwords do not match', () => {
        component.newPassword = 'hello-there';
        component.confirmPassword = 'hello';

        expect(component.checkIfPasswordsMatch()).toBeFalsy();
      });
    });

    it('should call all of the functions inside onChangeNewPassword() when called and set confirmPasswordMatch',
      () => {
        const spySetStrengthBar = spyOn(component, 'setStrengthBar').and.callFake(() => {
        });
        component.newPassword = 'hello-there';
        component.confirmPassword = 'hello';
        component.confirmPasswordMatch = true;
        component.onChangeNewPassword();

        expect(spySetStrengthBar).toHaveBeenCalled();
        expect(component.confirmPasswordMatch).toBeFalsy();
    });

    it('should not call setStrengthBar() when password is not available in onChangeNewPassword()',
      () => {
        const spySetStrengthBar = spyOn(component, 'setStrengthBar').and.callFake(() => {
        });
        component.newPassword = undefined;
        component.confirmPassword = 'hello';
        component.confirmPasswordMatch = true;
        component.onChangeNewPassword();

        expect(spySetStrengthBar).not.toHaveBeenCalled();
      });

    describe('===> showPasswords()', () => {
      it('should set password input type to \'password\' when type is \'text\' and toggle isShowPasswords', () => {
        component.passwordInputType = 'text';
        component.isShowPasswords = true;
        component.showPasswords();

        expect(component.passwordInputType).toEqual('password');
        expect(component.isShowPasswords).toBeFalsy();
      });

      it('should set password input type to \'text\' when type is \'password\' and toggle isShowPasswords', () => {
        component.passwordInputType = 'password';
        component.isShowPasswords = false;
        component.showPasswords();

        expect(component.passwordInputType).toEqual('text');
        expect(component.isShowPasswords).toBeTruthy();
      });
    });
  });
});

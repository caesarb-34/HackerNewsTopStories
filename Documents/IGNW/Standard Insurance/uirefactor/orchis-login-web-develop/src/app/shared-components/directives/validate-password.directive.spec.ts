import {Component} from '@angular/core';
import {ComponentFixture, waitForAsync, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import { ValidatePasswordDirective } from './validate-password.directive';
import {PasswordValidation} from '../../shared/models/password-validation';
import * as zxcvbn from 'zxcvbn';

@Component({
  template: `
    <form name="testForm">
      <input name="newPassword" type="password" [(ngModel)]="inputUnderTestModel" #newPassword="ngModel" validatePassword [email]="email" />
    </form>
  `
})

class TestComponent {
  inputUnderTestModel: string = '';
  email: string = 'test@standard.com';
}


describe('ValidatePasswordDirective', () => {
  it('should create an instance', () => {
    const directive = new ValidatePasswordDirective();
    expect(directive).toBeTruthy();
  });
});

describe('Directive \"ValidatePasswordDirective\" with template-driven form', () => {

  let componentInstance: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let debug;
  let inputElement: HTMLInputElement;


  // lengthRequirementMet
  // lowercaseRequirementMet
  // uppercaseRequirementMet
  // specialCharacterRequirementMet
  // noSpecialBracketsCharacterRequirementMet
  // isBlacklisted

  const badPasswords = [
    'standard',         // too short
    'standardstandard', // no caps or special
    'STANDARD12',       // no lowercase
    'standard<',        // has bracket
    'Standard1',        // meets but not long enough
    '12345asdf$$$',     // no cap
    'Standardhjkh',     // no special char/number
    'standard1$',       // no cap
    '12345asdf$$$',     // no cap
    'Password12'        // has blacklist word
  ];
  const goodPasswords = [
    'Standard12',
    'Standard$$',
    'somethingReallyLong123'
  ];

  const inValidValue = { validatePassword: false };
  const passwordValidator: PasswordValidation = new PasswordValidation();

  beforeEach( () => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [
        TestComponent,
        ValidatePasswordDirective
      ]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    componentInstance = fixture.componentInstance;
    debug = fixture.debugElement;
    // element under test
    fixture.detectChanges();

  });


  describe('===> Test password validator directive in form', () => {

    it('password field in a form containing a good password should validate', waitForAsync(() => {
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        inputElement = debug.query(By.css('[name=newPassword]')).nativeElement;
        inputElement.value = 'Standard123';
        inputElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        const testFieldNewPassword = fixture.debugElement.query(By.css('input[name=newPassword]'))
          .references['newPassword'];
        expect(testFieldNewPassword.valid).toBe(true);
      });
    }));

    it('password field in a form containing a bad password should not validate', waitForAsync(() => {
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        inputElement = debug.query(By.css('[name=newPassword]')).nativeElement;
        inputElement.value = 'badpassword';
        inputElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        const testFieldNewPassword = fixture.debugElement.query(By.css('input[name=newPassword]'))
          .references['newPassword'];
        expect(testFieldNewPassword.invalid).toBe(true);
      });
    }));

  });

});

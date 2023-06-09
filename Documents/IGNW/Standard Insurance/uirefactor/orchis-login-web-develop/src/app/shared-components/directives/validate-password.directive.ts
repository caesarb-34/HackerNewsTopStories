import { Directive, forwardRef, Input} from '@angular/core';
import {Validator, AbstractControl, NG_VALIDATORS } from '@angular/forms';
import {PasswordValidation} from '../../shared/models/password-validation';

/**
 * Custom directive to validate a password field
 * This directive can be used in template-driven forms
 *
 * The actual validation logic can be found in password-validation.ts
 * Note: A validator must be used to set read-only passwordField.valid
 *
 *  Sample use on new password input
 *  <input
 *    name="fieldNewPassword"
 *    id="fieldNewPassword"
 *    title="New Password Input"
 *    required
 *    class="form-control lgn-new-password"
 *    [(ngModel)]="newPassword"
 *    autocomplete="off"
 *    #fieldNewPassword="ngModel"
 *    [type]="passwordInputType"
 *    validatePassword [username]='username'
 *  />
 */

@Directive({
     // tslint:disable-next-line
  selector: '[validatePassword]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => ValidatePasswordDirective), multi: true }
  ]
})

export class ValidatePasswordDirective implements Validator {

  public passwordValidator: PasswordValidation = new PasswordValidation();

  @Input() username: string;
  @Input() email: string;

  constructor() { }

  validate(control: AbstractControl): { [key: string]: any } {
    const newPassword: string = control.value;
    if (!this.passwordValidator.hasMet(newPassword, this.username, this.email).SICRequirement) {
      return { validatePassword: true };
    }
    return null;
  }
}

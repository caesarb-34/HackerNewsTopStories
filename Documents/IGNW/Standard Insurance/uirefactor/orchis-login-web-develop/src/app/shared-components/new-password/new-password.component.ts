/* This is a generic component which abstracts away the forms needed to set a new password.
 * Used in the forced password reset flow, as well as the anonymously initiated password reset from
 * the home screen.
 *
 * It will conditionally render a "Current Password" field depending on the value passed in for
 * 'needsCurrentPassword'. This is a field needed in the authenticated password reset flow, but not
 * in the anonymously initiated flow.
 *
 * Additionally, it will use a different CloudEntity method depending
 * on this value. These methods are `updatePassword` (authenticated) and `confirmResetPassword` (unauthenticated).
 * The unauthenticated method requires an OTP code, which is also an input of this component, and is sourced
 * from the email link that will direct the user through the unauthenticated flow.
 *
 * Finally, this component uses an EventEmitter to output error states. An example of an error state is
 * that currentPassword does not match what OrchIS has on file.
 *
 * Reference the 'activePasswordError' Object for the emitted error.
 *
 * Example Usages:
 *
 * 1.) Unauthenticated with OTP code, no error handling needed
 *  <lgn-new-password [needsCurrentPassword]="false" [otpCode]="<OTP_CODE_FROM_EMAIL>">
 *  </lgn-new-password>
 *
 * 2.) Authenticated without OTP, need error handling
 *  <lgn-new-password [needsCurrentPassword]="true" (activePasswordErrorChanged)="handlePasswordError($event)">
 *  </lgn-new-password>
 *
 */

import {Component, OnInit, EventEmitter, Input, Output} from '@angular/core';
import * as zxcvbn from 'zxcvbn';
import frequency_lists from 'zxcvbn/lib/frequency_lists';
import {AuthenticationService} from 'sfg-ng-brand-library';
import {IResponse} from 'cloudentityjs/dist/typings/core/Request';
import {Router} from '@angular/router';
import {StepIndicatorService} from '../../shared/services/step-indicator.service';

@Component({
  selector: 'lgn-new-password',
  templateUrl: './new-password.component.html',
  styleUrls: ['./new-password.component.scss']
})

export class NewPasswordComponent implements OnInit {
  @Input() public needsCurrentPassword: boolean;
  @Input() public otpCode: string;
  @Input() public provisioned: boolean;

  /* Selected Step is an available input only for the forced password reset flow,
     that component needs to route dynamically based on forced data collection steps,
     and so this generic component will need to know about it
   */
  @Input() public selectedStep: string;

  @Output() public activePasswordErrorChanged = new EventEmitter();
  @Output() public passwordHasBeenUpdated = new EventEmitter();

  public activePasswordError = {
    hasActiveError: false,
    activeErrorMessage: ''
  };

  public isShowPasswords: boolean = false;
  public passwordInputType: string = 'password';
  public confirmPassword: string = '';
  public confirmPasswordMatch: boolean = false;
  public focusPassword = false;
  public newPassword: string;
  public focusNewPassword = false;
  public focusConfirmPassword = false;
  public enteredCurrentPassword = false;
  public enteredConfirmPassword = false;
  public currentPassword: string;
  public showErrors: boolean = false;
  public showErrorsFocusNewPassword = false;
  public showErrorsConfirmPassword = false;

  public disallowedFound: boolean = false;
  public passwordMeetsSICRequirements: boolean = false;
  public lengthRequirementMet: boolean = false;
  public lowercaseRequirementMet: boolean = false;
  public uppercaseRequirementMet: boolean = false;
  public specialCharacterRequirementMet: boolean = false;
  public specialBracketsCharacterRequirementMet: boolean = false;
  public passwordContainsUsername: boolean = false;
  public isBlacklisted: boolean = false;
  public blackListedPasswords: Array<string> = frequency_lists ? frequency_lists['passwords'] : [];
  public strengthBarClass: string = 'strength-bar-default';
  public strengthMsg: string = '';
  public strengthMsgPrefix: string = 'Password Strength';
  public submitted: boolean = false;
  public submitSuccess: boolean = false; // TODO: Temporary until wired
  public isNewPasswordValid: boolean;
  public isCurrentPasswordValid: boolean;

  public setPasswordFailUrl: string = 'set-password-fail'; // for routing on failed submitPassword()
  public navigateToForgotPwd: string = 'forgot-password';
  public activeError: string = '';

  // tslint:disable-next-line:max-line-length
  public errorMessages = {
    422: `Your current password does not match what we have on file. ` +
         `Try again or you can <a href="/forgot-password">reset your password.</a>`
  };


  constructor(public router: Router,
              public authenticationService: AuthenticationService,
              public stepIndicatorService: StepIndicatorService) {
  }

  ngOnInit() {
  }

  public showPasswords() {
    this.passwordInputType = this.passwordInputType === 'text' ? 'password' : 'text';
    this.isShowPasswords = !this.isShowPasswords;
  }

  /**
   * Executes the new Password Requirement check
   */
  public evalPassword(): void {
    this.initializeRequirements();
    this.isBlacklisted = this.inBlackList(this.newPassword);
    this.checkPasswordConditions();

    if (this.lengthRequirementMet &&
      this.lowercaseRequirementMet &&
      this.uppercaseRequirementMet &&
      this.specialCharacterRequirementMet &&
      this.specialBracketsCharacterRequirementMet &&
      !this.isBlacklisted) {
      this.passwordMeetsSICRequirements = true;
    }
  }

  public submitPassword() {

    this.errorMessages[0] = '';
    this.checkIfNewPasswordIsValid();
    this.checkIfPasswordsMatch();
    this.showErrors = true;
    this.showErrorsFocusNewPassword = true;
    this.showErrorsConfirmPassword = true;
    if (this.needsCurrentPassword) {
      /* This is the case where a user enters their current password, new password, and
      confirm new password. It is the reset password case we use when the user is authenticated with a session

      IE: Forced Password Reset, and Self Service Change Password
       */
      this.handleAuthenticatedResetPasswordCase();
    } else {
      /* This is the case where a user enters just a new password and confirm new password.
      It will go through this path when the user is anonymous with an OTP code.
       */
      this.handleUnauthenticatedResetPasswordCase();
    }
  }

  /**
   * This method will be ran when the user attempts to update their password
   * while having an active authenticated session
   */
  public handleAuthenticatedResetPasswordCase() {
    this.checkIfCurrentPasswordIsValid();
    if (this.currentPassword) {
      this.enteredCurrentPassword = this.currentPassword.length > 0;
    }
    this.enteredConfirmPassword = this.confirmPassword.length > 0;

    if (this.passwordMeetsSICRequirements &&
      this.confirmPasswordMatch &&
      this.enteredCurrentPassword &&
      this.enteredConfirmPassword) {

      this.showErrors = false;
      this.showErrorsFocusNewPassword = false;
      this.showErrorsConfirmPassword = false;
      this.submitted = true;
      this.authenticationService.updatePassword(this.currentPassword, this.newPassword).subscribe(
        (successData) => {

          /* emit success so client components can proceed */
          this.passwordHasBeenUpdated.emit(successData);
          this.submitted = false;
        },
        (error: IResponse) => {
          this.submitted = false;
          if (error.data.code === 'User.InvalidNewPassword') {
            this.activePasswordError.hasActiveError = true;
            if (error.data.details) {
              this.activePasswordError.activeErrorMessage = error.data.details[0].message;
            }
            if (!this.activePasswordError.activeErrorMessage) {
              this.activePasswordError.activeErrorMessage = 'Your password did not meet requirements.';
            }
            this.activePasswordErrorChanged.emit(this.activePasswordError);
          } else {
            this.activePasswordError.activeErrorMessage = this.errorMessages[error.status];
            this.activePasswordError.hasActiveError = true;
            this.activePasswordErrorChanged.emit(this.activePasswordError);
          }
        }
      );
    }
  }

  /**
   * This method will be ran when the user attempts to update their password
   * while being anonymous with an OTP code provided by OrchIS through an email
   */
  public handleUnauthenticatedResetPasswordCase() {
    if (this.passwordMeetsSICRequirements &&
      this.confirmPasswordMatch) {

      this.submitSuccess = true;
      this.enteredConfirmPassword = this.confirmPassword.length > 0;
      this.submitted = true;
      this.showErrors = false;
      this.showErrorsFocusNewPassword = false;
      this.showErrorsConfirmPassword = false;

      if (this.provisioned) {
        /* This is the case where a user's account has been provisioned by an SIC admin,
        and they need to create a new password and activate the account.
         */
        this.authenticationService.activateByEmail(this.otpCode, this.newPassword).subscribe(
          (successData) => {
            this.passwordHasBeenUpdated.emit(successData);
          },
          (error: IResponse) => {
            this.handleUnauthenticatedPasswordResetError(error);
          }
        );
      } else {
        /* This is the more common "Forgot your password?" flow. */
        this.authenticationService.confirmResetPassword(this.otpCode, this.newPassword).subscribe(
          (successData) => {
            this.passwordHasBeenUpdated.emit(successData);
          },
          (error: IResponse) => {
            this.handleUnauthenticatedPasswordResetError(error);
          }
        );
      }
    }
  }

  public handleUnauthenticatedPasswordResetError(error: IResponse) {
    this.submitted = false;
    switch (error.status) {
      case 400: {
        console.log('confirmResetPassword error code %s: ', error.status, ' Request.Invalid');
        this.router.navigate([`${this.setPasswordFailUrl}/${error.status}`],
          {queryParams: {provisioned: this.provisioned, otpCode: this.otpCode}});
        break;
      }
      case 422: {
        console.log('confirmResetPassword error code %s: ', error.status, 'Verification Code Invalid');
        if (error.data.code === 'User.InvalidNewPassword') {
          this.activePasswordError.hasActiveError = true;
          this.activePasswordError.activeErrorMessage = error.data.details[0].message;
          if (!this.activePasswordError.activeErrorMessage) {
            this.activePasswordError.activeErrorMessage = 'Your password did not meet requirements.';
          }
          this.activePasswordErrorChanged.emit(this.activePasswordError);
        } else {
          this.router.navigate([`${this.setPasswordFailUrl}/${error.status}`],
            {queryParams: {provisioned: this.provisioned, otpCode: this.otpCode}});
        }
        break;
      }
      default: {
        console.log('confirmResetPassword error code %s', error.status);
        if (error.data.code === 'User.InvalidNewPassword') {
          this.activePasswordError.hasActiveError = true;
          this.activePasswordError.activeErrorMessage = error.data.details[0].message;
          if (!this.activePasswordError.activeErrorMessage) {
            this.activePasswordError.activeErrorMessage = 'Your password did not meet requirements.';
          }
          this.activePasswordErrorChanged.emit(this.activePasswordError);
        } else {
          this.router.navigate([`${this.setPasswordFailUrl}/${error.status}`],
            {queryParams: {provisioned: this.provisioned, otpCode: this.otpCode}});
        }
        break;
      }
    }

  }

  /**
   * Initializes the requirement flags
   */
  public initializeRequirements() {
    this.lengthRequirementMet = false;
    this.lowercaseRequirementMet = false;
    this.uppercaseRequirementMet = false;
    this.specialCharacterRequirementMet = false;
    this.disallowedFound = false;
    this.passwordMeetsSICRequirements = false;
    this.specialBracketsCharacterRequirementMet = false;
  }

  /**
   * Checks the newPassword against requirements and sets flags
   */
  public checkPasswordConditions() {
    if (this.newPassword) {
      this.lengthRequirementMet = (this.newPassword.length > 9 && this.newPassword.length < 160);
      this.lowercaseRequirementMet = (this.newPassword.match(/[a-z]/) !== null);
      this.uppercaseRequirementMet = (this.newPassword.match(/[A-Z]/) !== null);
      this.specialCharacterRequirementMet = (this.newPassword
        .match(/[0-9!'#$%&'()*+,-.\/:;=?@[\]^_`{|}~\\]/) !== null);
      this.specialBracketsCharacterRequirementMet = (this.newPassword
        .match(/[<>]/) === null);
    }
  }

  /**
   * Tests the password and sets the prefix and classes for the indicator
   * Based on a 0-4 scale, where 0 is worst and 4 is best
   * We set them to a minimum 4 if they meet our requirements.
   */
  public setStrengthBar(): void {
    const result = this.getZxcvbnScore();
    const score: number = result.score;
    this.strengthMsg = result.feedback.warning;

    if (this.passwordMeetsSICRequirements) {
      if (score < 4) {
        this.strengthMsgPrefix = 'Good';
        this.strengthBarClass = 'password-strength-good';
      } else {
        this.strengthMsgPrefix = 'Strong';
        this.strengthBarClass = 'password-strength-strong';
      }
    } else {
      if (score <= 0) {
        this.strengthMsgPrefix = 'Password Strength';
        this.strengthBarClass = 'password-strength-default';
      } else if (score === 1) {
        this.strengthMsgPrefix = 'Weak';
        this.strengthBarClass = 'password-strength-weak';
      } else if (score === 2) {
        this.strengthMsgPrefix = 'Weak';
        this.strengthBarClass = 'password-strength-weak-2';
      } else {
        // Cannot get above better when requirements not met
        this.strengthMsgPrefix = 'Better';
        this.strengthBarClass = 'password-strength-better';
      }
    }
  }

  public getZxcvbnScore(): any {
    return zxcvbn(this.newPassword);
  }

  public checkIfPasswordsMatch(): void {
    this.confirmPasswordMatch = (this.newPassword === this.confirmPassword);
  }

  public inBlackList(newPassword: string): boolean {
    return (this.blackListedPasswords.indexOf(newPassword.toLowerCase()) !== -1);
  }

  public checkIfNewPasswordIsValid(): void {
    this.isNewPasswordValid = this.isValidValue(this.newPassword);
  }

  public checkIfCurrentPasswordIsValid(): void {
    this.isCurrentPasswordValid = this.isValidValue(this.currentPassword);
  }

  public isValidValue(value): boolean {
    if (typeof value !== 'undefined' && value) {
      return true;
    } else {
      return false;
    }
  }
  public navigateToForgotPassword() {
    this.router.navigate([this.navigateToForgotPwd]);
  }
  public onFocusNewPassword(): void {
       this.focusNewPassword = true;
       this.showErrorsFocusNewPassword = true;
       this.checkPasswordConditions();
     }
   public onFocusConfirmPassword(): void {
        this.focusConfirmPassword = true;
        this.showErrorsConfirmPassword = true;
        this.checkIfPasswordsMatch();
     }
}

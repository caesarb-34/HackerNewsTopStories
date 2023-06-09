/**
 * NOTE - This component will eventually be replacing the new-password.component in the
 * SharedComponents module because its current implementation has high coupling with
 * services.
 */
import {AfterViewInit, ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import * as zxcvbn from 'zxcvbn';
import {ControlContainer, NgForm } from '@angular/forms';
import {PasswordValidation} from '../../shared/models/password-validation';

@Component({
  selector: 'lgn-self-reg-set-password',
  templateUrl: './self-reg-set-password.component.html',
  styleUrls: ['./self-reg-set-password.component.scss'],
  viewProviders: [ { provide: ControlContainer, useExisting: NgForm  } ]
})
export class SelfRegSetPasswordComponent implements OnInit, AfterViewInit {
  @Input() public username: string;
  @Input() public email: string;

  public passwordValidator: PasswordValidation = new PasswordValidation();
  public passwordMeetsSICRequirements: boolean = false;
  public newPassword: string;
  public confirmPassword: string;
  public isShowPasswords: boolean = false;
  public passwordInputType: string = 'password';
  public confirmPasswordMatch: boolean = false;
  public focusNewPassword = false;
  public focusConfirmPassword = false;

// for StrengthBar
  public strengthBarClass: string = 'strength-bar-default';
  public strengthMsg: string = '';
  public strengthMsgPrefix: string = 'Password Strength';

// for Password Tooltip updates by password directive
  public lengthRequirementMet = false;
  public lowercaseRequirementMet = false;
  public uppercaseRequirementMet = false;
  public specialCharacterRequirementMet = false;
  public noSpecialBracketsCharacterRequirementMet = false;
  public isBlacklisted = false;
  public usernameNotSameAsPasswordRequirementMet = false;
  public emailNotSameAsPasswordRequirementMet = false;

  constructor(private cd: ChangeDetectorRef) { }

  ngOnInit() { }

  ngAfterViewInit() {
    this.cd.detectChanges();
  }

  public showPasswords() {
    this.passwordInputType = this.passwordInputType === 'text' ? 'password' : 'text';
    this.isShowPasswords = !this.isShowPasswords;
  }

  /**
   * Shows the strength of the password visually
   * Tests the password and sets the prefix and classes for the indicator
   * Based on a 0-4 scale, where 0 is worst and 4 is best
   * We set them to a minimum 4 if they meet our requirements.
   */
  public setStrengthBar(password: string): void {
    const result: any = this.getZxcvbnScore();
    const score: number = result.score;
    this.strengthMsg = result.feedback.warning;

    if (this.passwordMeetsSICRequirements) {
      this.hasMetPasswordRequirements(score);
    } else {
      this.hasNotMetPasswordRequirements(score);
    }
  }

  private hasMetPasswordRequirements(score: number): void {
    if (score < 4) {
      this.strengthMsgPrefix = 'Good';
      this.strengthBarClass = 'password-strength-good';
    } else {
      this.strengthMsgPrefix = 'Strong';
      this.strengthBarClass = 'password-strength-strong';
    }
  }

  private hasNotMetPasswordRequirements(score: number): void {
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

  public getZxcvbnScore(): any {
    return zxcvbn(this.newPassword);
  }

  /**
   * Put a check mark on the confirmPassword field if there is a match AND the requirements are met.
   */
  public checkIfPasswordsMatch(): boolean {
    return (this.newPassword === this.confirmPassword);
  }

  public onChangeNewPassword(): void {
    const requirements = this.passwordValidator.hasMet(this.newPassword, this.username, this.email);
    // Set the local variables
    this.lengthRequirementMet = requirements.lengthRequirement;
    this.lowercaseRequirementMet = requirements.lowercaseRequirement;
    this.uppercaseRequirementMet = requirements.uppercaseRequirement;
    this.specialCharacterRequirementMet = requirements.specialRequirement;
    this.noSpecialBracketsCharacterRequirementMet = requirements.specialbracketRequirement;
    this.usernameNotSameAsPasswordRequirementMet = requirements.usernameNotSameAsPasswordRequirement;
    this.emailNotSameAsPasswordRequirementMet = requirements.emailNotSameAsPasswordRequirement;
    this.isBlacklisted = requirements.blacklistedRequirement;
    this.passwordMeetsSICRequirements = requirements.SICRequirement;

    if (this.newPassword) {
     this.setStrengthBar(this.newPassword);
    }

    this.confirmPasswordMatch = this.checkIfPasswordsMatch();
  }

  public onChangeConfirmPassword(): void {
    this.confirmPasswordMatch = this.checkIfPasswordsMatch();
  }

  public onFocusNewPassword(): void {
    this.focusNewPassword = true;
    this.onChangeNewPassword();
    this.confirmPasswordMatch = this.checkIfPasswordsMatch();
  }

  public onFocusConfirmPassword(): void {
    this.focusConfirmPassword = true;
    this.onChangeNewPassword();
    this.confirmPasswordMatch = this.checkIfPasswordsMatch();
  }

}

import {Injectable} from '@angular/core';
import frequency_lists from 'zxcvbn/lib/frequency_lists';

@Injectable()
/**
 * Password validation logic to be used by directives and component code.
 * The individual parts can be used as prompts and the full requirements
 * check passwordMeetsSICRequirements for field validation.
 */
export class PasswordValidation {

  public blackListedPasswords: Array<string> = frequency_lists ? frequency_lists['passwords'] : [];

  public lengthRequirementMet: boolean = false;
  public lowercaseRequirementMet: boolean = false;
  public uppercaseRequirementMet: boolean = false;
  public specialCharacterRequirementMet: boolean = false;
  public noSpecialBracketsCharacterRequirementMet: boolean = false;
  public isBlacklisted: boolean = true;
  public usernameNotSameAsPasswordRequirementMet: boolean = false;
  public emailNotSameAsPasswordRequirementMet: boolean = false;


  public initRequirements(password, username, email): void {
    this.lengthRequirementMet = this.getLengthRequirementMet(password);
    this.lowercaseRequirementMet = this.getLowercaseRequirementMet(password);
    this.uppercaseRequirementMet = this.getUppercaseRequirementMet(password);
    this.specialCharacterRequirementMet = this.getSpecialCharacterRequirementMet(password);
    this.noSpecialBracketsCharacterRequirementMet = this.getNoSpecialBracketsCharacterRequirementMet(password);
    this.isBlacklisted = this.getIsBlacklisted(password);
    this.usernameNotSameAsPasswordRequirementMet = this.getUsernameNotSameAsPasswordRequirementMet(password, username);
    this.emailNotSameAsPasswordRequirementMet = this.getEmailNotSameAsPasswordRequirementMet(password, email);
  }

  public hasMet(password: string, username: string, email: string): any {
    const result = {
      lengthRequirement: false,
      lowercaseRequirement: false,
      uppercaseRequirement: false,
      specialRequirement: false,
      specialbracketRequirement: false,
      blacklistedRequirement: false,
      SICRequirement: false,
      usernameNotSameAsPasswordRequirement: false,
      emailNotSameAsPasswordRequirement: false,
    };
    if (!!password) {
      this.initRequirements(password, username, email);
      result.lengthRequirement = this.lengthRequirementMet;
      result.lowercaseRequirement = this.lowercaseRequirementMet;
      result.uppercaseRequirement = this.uppercaseRequirementMet;
      result.specialRequirement = this.specialCharacterRequirementMet;
      result.specialbracketRequirement = this.noSpecialBracketsCharacterRequirementMet;
      result.blacklistedRequirement = this.isBlacklisted;
      result.usernameNotSameAsPasswordRequirement = this.usernameNotSameAsPasswordRequirementMet;
      result.emailNotSameAsPasswordRequirement = this.emailNotSameAsPasswordRequirementMet;
      result.SICRequirement = this.getPasswordMeetsSICRequirements();
    }
    return result;
  }

  public getLengthRequirementMet(password: string): boolean {
    return  password.length > 9 && password.length < 160;
  }

  public getLowercaseRequirementMet(password: string): boolean {
    return  password.match(/[a-z]/) !== null;
  }

  public getUppercaseRequirementMet(password: string): boolean {
    return password.match(/[A-Z]/) !== null;
  }

  public getSpecialCharacterRequirementMet(password: string): boolean {
    return password.match(/[0-9!'#$%&'()*+,-.\/:;=?@[\]^_`{|}~\\]/) !== null;
  }

  public getNoSpecialBracketsCharacterRequirementMet(password: string): boolean {
    return password.match(/[<>]/) === null;
  }

  public getIsBlacklisted(password: string): boolean {
    return this.blackListedPasswords.indexOf(password.toLowerCase()) !== -1;
  }

  public getUsernameNotSameAsPasswordRequirementMet(password: string, username: string): boolean {
    if (password) {
      return (password !== username);
    }
  }

  public getEmailNotSameAsPasswordRequirementMet(password: string, email: string): boolean {
    if (password && email) {
      password = password.toLocaleLowerCase();
      email = email.toLocaleLowerCase();
      return (password !== email);
    }
  }

  /**
   * Executes the full new Password Requirements check
   */
  public getPasswordMeetsSICRequirements(): boolean {
    return (this.lengthRequirementMet &&
      this.lowercaseRequirementMet &&
      this.uppercaseRequirementMet &&
      this.specialCharacterRequirementMet &&
      this.noSpecialBracketsCharacterRequirementMet &&
      this.usernameNotSameAsPasswordRequirementMet &&
        this.emailNotSameAsPasswordRequirementMet &&
        !this.isBlacklisted);
  }
}

import {PasswordValidation} from './password-validation';
import frequency_lists from 'zxcvbn/lib/frequency_lists';

// Create test passwords for these rules:
//     lengthRequirementMet
//     lowercaseRequirementMet
//     uppercaseRequirementMet
//     specialCharacterRequirementMet
//     noSpecialBracketsCharacterRequirementMet
//     isBlacklisted

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
  'badpassword'       // only lowercase but long enough
];
//  'Standard123'     // GOOD PASSWORD TO TEST
// 'Password12'        // has blacklist word

const goodPasswords = [
  'Standard12',
  'Standard$$',
  'somethingReallyLong123'
];
//   'standard',         // bad password
//   'Password12'        // has blacklist word


describe('PasswordValidation', () => {
  it('should create an instance', () => {
    const passwordValidator = new PasswordValidation();
    expect(passwordValidator).toBeTruthy();
  });
});

describe('===> Test All Requirements being met', () => {

  goodPasswords.forEach((item) => {
    it('should return true when valid password \'' + item + '\' is used', () => {
      const username = 'usernameTest';
      const email = 'emailTest';
      const passwordValidator = new PasswordValidation();
      const requirements: any = passwordValidator.hasMet(item, username, email);
      expect(requirements.SICRequirement).toBeTruthy();
    });
  });

  badPasswords.forEach((item) => {
    it('should return null when inValid password \'' + item + '\' is used', () => {
      const username = 'usernameTest';
      const email = 'emailTest';
      const passwordValidator = new PasswordValidation();
      const requirements: any = passwordValidator.hasMet(item, username, email);
      expect(requirements.SICRequirement).toBeFalsy();
    });
  });

});


describe('===> test the individual requirements validations.', () => {

  it('getLengthRequirementMet should return true when it has an acceptable length and false otherwise', () => {
    const goodPassword: string = 'jkiduasdfasdf';
    const badPassword: string = 'abcda';
    let result: boolean = null;
    const passwordValidator = new PasswordValidation();

    result = passwordValidator.getLengthRequirementMet(goodPassword);
    expect(result).toBeTruthy();

    result = passwordValidator.getLengthRequirementMet(badPassword);
    expect(result).toBeFalsy();
  });

  it('getLowercaseRequirementMet should return true when contains a lowercase char and false otherwise', () => {
    const goodPassword: string = 'FHIDasd';
    const badPassword: string = 'STANDARD6$$';
    let result: boolean = null;
    const passwordValidator = new PasswordValidation();

    result = passwordValidator.getLowercaseRequirementMet(goodPassword);
    expect(result).toBeTruthy();

    result = passwordValidator.getLowercaseRequirementMet(badPassword);
    expect(result).toBeFalsy();
  });

  it('getUppercaseRequirementMet should return true when contains a uppercase char and false otherwise', () => {
    const goodPassword: string = 'jkidFHIDasd';
    const badPassword: string = 'asdflkj6$$';
    let result: boolean = null;
    const passwordValidator = new PasswordValidation();

    result = passwordValidator.getUppercaseRequirementMet(goodPassword);
    expect(result).toBeTruthy();

    result = passwordValidator.getUppercaseRequirementMet(badPassword);
    expect(result).toBeFalsy();
  });

  it('getSpecialCharacterRequirementMet should return true when contains a listed special character and false otherwise', () => {
    const goodPassword: string = 'jki$asdf';
    const badPassword: string = 'asdfjkllkj';
    let result: boolean = null;
    const passwordValidator = new PasswordValidation();

    result = passwordValidator.getSpecialCharacterRequirementMet(goodPassword);
    expect(result).toBeTruthy();

    result = passwordValidator.getSpecialCharacterRequirementMet(badPassword);
    expect(result).toBeFalsy();
  });

  it('getNoSpecialBracketsCharacterRequirementMet should return true when not < > are not found and false otherwise', () => {
    const goodPassword: string = 'jki$asdf';
    const badPassword: string = 'asd>fjkllkj';
    let result: boolean = null;
    const passwordValidator = new PasswordValidation();

    result = passwordValidator.getNoSpecialBracketsCharacterRequirementMet(goodPassword);
    expect(result).toBeTruthy();

    result = passwordValidator.getNoSpecialBracketsCharacterRequirementMet(badPassword);
    expect(result).toBeFalsy();
  });

//   xit('getIsBlacklisted should return true when contains a listed blacklist item and false otherwise', () => {
//     let blacklistTestPassword: string = 'password';
//     let goodPassword: string = 'Tehklkjd12';
//     let result: boolean = null;
//     const passwordValidator = new PasswordValidation();
//     // const blackListedPasswords: Array<string> = frequency_lists ? frequency_lists['passwords'] : [];
//
//     // spyOn(PasswordValidation, 'getIsBlacklisted').and.returnValue({
//       //   result
//       // });
//
//     // let spyGetIsBlacklisted = spyOn(PasswordValidation, 'getIsBlacklisted').and.callFake(() => {
//     //  });
//     expect(result).toBeTruthy();
//
//     // result = passwordValidator.getIsBlacklisted(goodPassword);
//     // expect(result).toBeFalsy();
//   });

});



// describe('===> inBlackList()', () => {
//   it('should return true when password is in blacklist', () => {
//     component.newPassword = 'password';
//     component.onChangeNewPassword();
//     fixture.detectChanges();
//     expect(component.isBlacklisted).toBeTruthy();
//   });
//
//   it('should return false when password is not in blacklist', () => {
//     component.newPassword = 'pickles';
//     component.onChangeNewPassword();
//     fixture.detectChanges();
//     expect(component.isBlacklisted).toBeFalsy();
//   });
// });

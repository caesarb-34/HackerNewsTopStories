/**
 * user info view model
 */

export default class UserInfoViewModel {
  uid: string = undefined;
  email: string = '';
  isEmailVerified: boolean = undefined;
  phone: string = '';
  isMobile: boolean = undefined;
  isPhoneVerified: boolean = undefined;
  isSfgEmployee: boolean = undefined;
  otpMethod: string = '';
  otpMfaDestination: string = '';
  defaultEmail: string = '';
  defaultMobile: string = undefined;
  defaultIsMobile: boolean = undefined;
  phoneValid: boolean = undefined;

  public static clone(aModel: UserInfoViewModel): UserInfoViewModel {
    const userInfo: UserInfoViewModel = new UserInfoViewModel();
    userInfo.uid = aModel.uid;
    userInfo.email = aModel.email;
    userInfo.isEmailVerified = aModel.isEmailVerified;
    userInfo.phone = aModel.phone;
    userInfo.isMobile = aModel.isMobile;
    userInfo.isPhoneVerified = aModel.isPhoneVerified;
    userInfo.isSfgEmployee = aModel.isSfgEmployee;
    userInfo.otpMethod = aModel.otpMethod;
    userInfo.otpMfaDestination = aModel.otpMfaDestination;
    userInfo.defaultEmail = aModel.defaultEmail;
    userInfo.defaultMobile = aModel.defaultMobile;
    userInfo.defaultIsMobile = aModel.defaultIsMobile;
    userInfo.phoneValid = aModel.phoneValid;
    return userInfo;
  }

  constructor() { }

  public isEmailChanged(original: UserInfoViewModel): boolean {
    return this.email !== original.email;
  }

  public isPhoneAttributesChanged(original: UserInfoViewModel): boolean {
    return (this.isPhoneNumberChanged(original) || this.isPhoneTypeChanged(original));
  }

  public isPhoneNumberChanged(original: UserInfoViewModel): boolean {
    let currentPhone = '';
    let originalPhone = '';
    if (this.phone) {
      currentPhone = this.phone.replace(/\D+/g, ''); // Remove all characters except digits
    }
    if (original.phone) {
      originalPhone = original.phone.replace(/\D+/g, ''); // Remove all characters except digits
    }
    return (currentPhone !== originalPhone);
  }

  public isPhoneTypeChanged(original: UserInfoViewModel): boolean {
    return (this.isMobile !== original.isMobile);
  }

  public isContactInfoChanged(original: UserInfoViewModel): boolean {
    return (this.isPhoneAttributesChanged(original) || this.isEmailChanged(original));
  }

  public isMfaPreferenceChanged(original: UserInfoViewModel): boolean {
    return this.otpMethod !== original.otpMethod;
  }

  public isMfaDestinationChanged(original: UserInfoViewModel): boolean {
    if (original.otpMethod === 'M' || original.otpMethod === 'V') {
      return this.phone !== original.defaultMobile;
    }
    if (original.otpMethod === 'E') {
      return this.email !== original.defaultEmail;
    }
  }

  public isPhoneDefault(): boolean {
    return this.phone === this.defaultMobile;
  }

  public isMfaPreferencePhone(): boolean {
    return this.otpMethod === 'V' || this.otpMethod === 'M';
  }

  public isMfaPreferenceEmail(): boolean {
    return this.otpMethod === 'E';
  }

  public equals(other: UserInfoViewModel): boolean {
    // self check
    if (this === other) {
      return true;
    }
    // null check
    if (!other) {
      return false;
    }
    // type check
    if ( ! (other instanceof UserInfoViewModel)) {
      return false;
    }
    // field comparison
    return this.uid === other.uid
      && this.email === other.email
      && this.isEmailVerified === other.isEmailVerified
      && this.phone === other.phone
      && this.isMobile === other.isMobile
      && this.isPhoneVerified === other.isPhoneVerified
      && this.isSfgEmployee === other.isSfgEmployee
      && this.otpMethod === other.otpMethod
      && this.otpMfaDestination === other.otpMfaDestination
      && this.defaultEmail === other.defaultEmail
      && this.defaultIsMobile === other.defaultIsMobile
      && this.phoneValid === other.phoneValid;
  }

  public toString(): string {
    return `UserInfoViewModel (
      uid: ${this.uid},
      email: ${this.email},
      isEmailVerified: ${this.isEmailVerified},
      phone: ${this.phone},
      isMobile: ${this.isMobile},
      isPhoneVerified: ${this.isPhoneVerified},
      isSfgEmployee: ${this.isSfgEmployee}
    )`;
  }

}

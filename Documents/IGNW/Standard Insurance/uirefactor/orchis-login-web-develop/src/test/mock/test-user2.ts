/**
 * The following objects can be used to mock out the responses in order to view the Forced Data collection component routes:
 *   'collect-contact-info',
 *   'password-expired',
 *   'data-collection',
 *   'data-collection-email',
 *   'password-confirmation',
 *   'email-verification',
 *   'mfa-preference',
 *   'mfa-code',
 *   'mfa-confirmation'
 */


import User from '../../app/shared/models/user.model';

/**
 * Use as a mock in Authentication.service.ts > getUser() set
 * return of(testUser2);
 */
export const userTestData: User = {
  otpMethod: 'M',
  unverifiedMobiles: [
    '5038064074'
  ],
  verifiedPhones: [
    '5035551234',
    '5035555678'
  ],
  verifiedMobiles: [
    '5038064074',
    '9713216261'
  ],
  lastName: 'LyfordMock',
  googleAuthSecretAccepted: 'false',
  pwdLastChangedWithin: '4',
  verifiedEmails: [
    'jlyford@standard.com'
  ],
  forcePwdReset: false,
  mfaMethod: 'OTP',
  eulaApproval: 'true',
  uuid: '5644a0c0-51fd-1037-8d01-a0825f4357ac',
  otpSetupComplete: true,
  firstName: 'Jeff',
  uid: 'jefftest400',
  eulaRevision: '1.0',
  unverifiedPhones: [
    '5032880311'
  ],
  defaultEmail: 'jlyford@standard.com',
  otpMfaDestination: 'jlyford@standard.com',
  entitlementGroups: [
    'SIC_USER'
  ],
  entitlements: [
    'SELF_ADD_EMAIL_OR_MOBILE',
    'SELF_ACCEPT_USER_EULA',
    'SELF_CONFIRM_AUTH_SECRET',
    'SELF_INVALIDATE_DEVICE_SESSIONS',
    'SELF_FORGET_DEVICE',
    'SELF_REMOVE_IDENTIFIERS',
    'SELF_GET_AUTH_SECRET',
    'SELF_UPDATE_USER',
    'SELF_LIST_DEVICES',
    'SELF_LIST_USER_CUSTOMERS',
    'SELF_GET_USER',
    'SELF_SEND_VERIFICATION_CODE',
    'SELF_GET_CUSTOMER',
    'SELF_CHANGE_PASSWORD',
    'SELF_RESET_AUTH_SECRET'
  ],
  status: 'active',
  customer: 'Standard',
  newUserStatus: false
};

export let testUser2 =  {
  status: 200,
  headers: null,
  data: userTestData
};

/**
 * Use as a mock in Authentication.service.ts > validateAuthzPolicy() set
 * return throwError(authErrorMock);
 */
export const authErrorMock = {
  code: 'Authentication.Unauthenticated',
  message: 'Unauthenticated',
  data: {
    details: {
      recovery: [
        {id: 'User.passwordExpired', type: 'StaticErrorMessage'},
        {id: 'User.emailNotVerified', type: 'StaticErrorMessage'},
        {id: 'User.mobileNotVerified', type: 'StaticErrorMessage'},
        {id: 'User.phoneNotVerified', type: 'StaticErrorMessage'},
        {id: 'OtpSetup', type: 'StaticErrorMessage'},
        {id: 'OtpAuthentication', type: 'StaticErrorMessage'},
      ]
    }
  }
};

/**
 * Use as a mock in Authentication.service.ts > getMaskedUserIdentifiers() set
 * return of(mockMaskedIds)
 */
export const mockMaskedIds = {
  status: 200, headers: null,
  data: {
    otpMethod: 'E',
    otpMfaDestination: 'f4dc3deb-0f52-4df6-9097-e16ec339cc92',
    emails: [{
      key: 'f4dc3deb-0f52-4df6-9097-e16ec339cc92',
      masked: 'd*********e@s*******.com',
      isDefault: true,
      isVerified: true
    }, {
      key: '1ff79c5b-77c2-470a-84e5-86c3d0dde9a0',
      masked: 'i**********s@g****.com',
      isDefault: false,
      isVerified: false
    }],
    mobiles: [{
      key: 'b4af38e5-2678-4e47-8b6c-67b593d32944',
      masked: '******7890',
      isDefault: false,
      isVerified: false
    }, {
      key: '1521cd47-377d-4f52-9594-bc7270e41dde',
      masked: '******7891',
      isDefault: false,
      isVerified: false
    }],
    phones: [{
      key: '43be4b2c-2281-420f-9936-759da03afad7',
      masked: '******3211',
      isDefault: false,
      isVerified: false
    }, {
      key: '7ffc6e9b-6705-48e7-8fa7-413de9225a46',
      masked: '******3210',
      isDefault: false,
      isVerified: false
    }]
  }
};

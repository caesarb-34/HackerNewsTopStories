
export enum APP_ROUTES {
  // Email Verification Module Route
  EMAIL_VERIFICATION = 'email-verification',

  // MFA Module Routes
  MFA = 'mfa',
  MFA_CODE = 'code',
  MFA_CONFIRMATION = 'confirmation',
  UNTRUSTED_DEVICE = 'untrusted-device',

  // Forced Data Collection Module Routes
  DATA_COLLECTION = 'data-collection',
  PASSWORD_EXPIRED = 'password-expired',
  PASSWORD_CONFIRMATION = 'password-confirmation',
  COLLECT_CONTACT_INFO = 'collect-contact-info',
  DATA_COLLECTION_EMAIL = 'data-collection-email',
  MFA_PREFERENCE = 'mfa-preference',
}

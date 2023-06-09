export const environment = {
  production: true,
  buildInfo: undefined,
  env: 'prod',
  appCode: 'login',

  // Acquia/Drupal
  drupalEnv: 'prod',
  drupalEndpoint: 'https://cm.standard.com',
  drupalHost: 'cm.standard.com',

  // Timeout time for authenticated pages -- differs per environment for functional testing purposes
  // 28 minutes in PROD
  timeoutTimeInSeconds: 1680,
  timeoutWarningTimeInSeconds: 120,

  // Environment Urls
  headerLogoUrl: 'https://www.standard.com',
  loginCancelUrl: 'https://www.standard.com',
  // EndPoint
  customerSupportUrl: 'https://www.standard.com/individual/contact-us',
  drupalOutageEndpoint: 'https://cm.standard.com/notify-outage/sfg/login?_format=json',
  drupalNotificationEndpoint: 'https://cm.standard.com/notify/sfg/login?_format=json',
  identitySecurityUrl: 'https://cm.standard.com/ng-page/sfg/protect-identity?_format=json',
  myHomeUrl: 'https://portal.standard.com/my-home/',
  drupalLoginEndpoint: 'https://cm.standard.com/login-content/sfg?_format=json',
  selfRegUrl: 'https://www.standard.com/create-account',
  termsAndConsentUrl: 'https://cm.standard.com/ng-page/sfg/termsconsent?_format=json',
  termsAndConsentEndpointDefaultContent: './assets/default/pages.default.terms-consent.json',
  drupalModalMfaInfoEndpoint: 'https://cm.standard.com/ng-page/sfg/mfa-info?_format=json',
  drupalModalMfaDoIHaveToEndpoint: 'https://cm.standard.com/ng-page/sfg/mfa-why-now?_format=json',
  contactUs: 'https://portal.standard.com/my-home/pages/contact-us',
  accountAccessUrl:  'https://account.standard.com/account-access',
  myInformationUrl: 'https://account.standard.com/my-information',
  changePasswordUrl: 'https://account.standard.com/change-password',
  loginActivityUrl: 'https://account.standard.com/login-activity',
  loginUrl: 'https://login.standard.com',
  cmSectionsEndpoint: 'https://cm.standard.com/form-sections/sfg/login?_format=json',
  acpUrl: 'https://login.standard.com/ui/sla/authn/authorization/accept',
  pageEndpoint: 'https://cm.standard.com/ng-page/sfg/[[pageId]]?_format=json',
};

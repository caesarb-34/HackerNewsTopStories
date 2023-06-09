// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
// import {buildInfo} from '../../.deploy/build-info';

export const environment = {
  production: false,
  buildInfo: undefined,
  env: 'acc',
  appCode: 'login',

  // Acquia/Drupal
  drupalEnv: 'acc',
  drupalEndpoint: 'https://cm.standard.com',
  drupalHost: 'cm.standard.com',

  // Timeout time for authenticated pages -- differs per environment for functional testing purposes
  // 28 minutes in ACC
  timeoutTimeInSeconds: 1680,
  timeoutWarningTimeInSeconds: 120,

  // Environment Urls
  headerLogoUrl: '/',
  loginCancelUrl: '/',
  // Endpoints
  customerSupportUrl: 'https://www.standard.com/individual/contact-us',
  drupalOutageEndpoint: 'https://cm.standard.com/notify-outage/acc/login?_format=json',
  drupalNotificationEndpoint: 'https://cm.standard.com/notify/acc/login?_format=json',
  identitySecurityUrl: 'https://cm.standard.com/ng-page/acc/protect-identity?_format=json',
  myHomeUrl: 'https://portalacc.standard.com/my-home/',
  drupalLoginEndpoint: 'https://cm.standard.com/login-content/acc?_format=json',
  selfRegUrl: '',
  // termsAndConsentUrl purposely set in non-prod as sfg (prod) to assure its availability.
  termsAndConsentUrl: 'https://cm.standard.com/ng-page/sfg/termsconsent?_format=json',
  termsAndConsentEndpointDefaultContent: './assets/default/pages.default.terms-consent.json',
  drupalModalMfaInfoEndpoint: 'https://cm.standard.com/ng-page/acc/mfa-info?_format=json',
  drupalModalMfaDoIHaveToEndpoint: 'https://cm.standard.com/ng-page/acc/mfa-why-now?_format=json',
  contactUs: 'https://portalacc.standard.com/my-home/pages/contact-us',
  accountAccessUrl:  'https://accountacc.standard.com/account-access',
  myInformationUrl: 'https://accountacc.standard.com/my-information',
  changePasswordUrl: 'https://accountacc.standard.com/change-password',
  loginActivityUrl: 'https://accountacc.standard.com/login-activity',
  loginUrl: 'https://loginacc.standard.com',
  cmSectionsEndpoint: 'https://cm.standard.com/form-sections/acc/login?_format=json',
  acpUrl: 'https://loginacc.standard.com/ui/sla/authn/authorization/accept',
  pageEndpoint: 'https://cm.standard.com/ng-page/acc/[[pageId]]?_format=json',
};

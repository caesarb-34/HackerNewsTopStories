// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
import {buildInfo} from '@deploy/build-info';

export const environment = {
  production: false,
  buildInfo: buildInfo,
  env: 'int',
  appCode: 'login',

  // Acquia/Drupal
  drupalEnv: 'int',
  drupalHost: 'cm.standard.com',
  drupalEndpoint: 'https://cm.standard.com',

  // Timeout time for authenticated pages -- differs per environment for functional testing purposes
  // 5 minutes in INT
  timeoutTimeInSeconds: 300,
  timeoutWarningTimeInSeconds: 120,

  // Environment Urls
  headerLogoUrl: '/',
  loginCancelUrl: '/',
  // Endpoints
  customerSupportUrl: 'https://www.standard.com/individual/contact-us',
  drupalOutageEndpoint: 'https://cm.standard.com/notify-outage/int/login?_format=json',
  drupalNotificationEndpoint: 'https://cm.standard.com/notify/int/login?_format=json',
  identitySecurityUrl: 'https://cm.standard.com/ng-page/int/protect-identity?_format=json',
  myHomeUrl: 'https://portalint.standard.com/my-home/',
  drupalLoginEndpoint: 'https://cm.standard.com/login-content/int?_format=json',
  selfRegUrl: '',
  // termsAndConsentUrl purposely set in non-prod as sfg (prod) to assure its availability.
  termsAndConsentUrl: 'https://cm.standard.com/ng-page/sfg/termsconsent?_format=json',
  termsAndConsentEndpointDefaultContent: './assets/default/pages.default.terms-consent.json',
  drupalModalMfaInfoEndpoint: 'https://cm.standard.com/ng-page/int/mfa-info?_format=json',
  drupalModalMfaDoIHaveToEndpoint: 'https://cm.standard.com/ng-page/int/mfa-why-now?_format=json',
  contactUs: 'https://portalint.standard.com/my-home/pages/contact-us',
  accountAccessUrl:  'https://accountint.standard.com/account-access',
  myInformationUrl: 'https://accountint.standard.com/my-information',
  changePasswordUrl: 'https://accountint.standard.com/change-password',
  loginActivityUrl: 'https://accountint.standard.com/login-activity',
  loginUrl: 'https://loginint.standard.com',
  cmSectionsEndpoint: 'https://cm.standard.com/form-sections/int/login?_format=json',
  acpUrl: 'https://loginint.standard.com/ui/sla/authn/authorization/accept',
  pageEndpoint: 'https://cm.standard.com/ng-page/int/[[pageId]]?_format=json',
};

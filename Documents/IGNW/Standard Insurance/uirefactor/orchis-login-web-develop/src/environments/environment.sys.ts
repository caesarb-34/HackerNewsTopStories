// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

import {buildInfo} from '@deploy/build-info';

export const environment = {
  production: false,
  buildInfo: buildInfo,
  env: 'sys',
  appCode: 'login',

  // Acquia/Drupal
  drupalEnv: 'sys',
  drupalEndpoint: 'https://cm.standard.com',
  drupalHost: 'cm.standard.com',

  // Timeout time for authenticated pages -- differs per environment for functional testing purposes
  // 28 minutes in SYS
  timeoutTimeInSeconds: 1680,
  timeoutWarningTimeInSeconds: 120,

  // Environment Urls
  headerLogoUrl: '/',
  loginCancelUrl: '/',
  // Endpoints
  customerSupportUrl: 'https://www.standard.com/individual/contact-us',
  drupalOutageEndpoint: 'https://cm.standard.com/notify-outage/sys/login?_format=json',
  drupalNotificationEndpoint: 'https://cm.standard.com/notify/sys/login?_format=json',
  identitySecurityUrl: 'https://cm.standard.com/ng-page/sys/protect-identity?_format=json',
  myHomeUrl: 'https://portalsys.standard.com/my-home/',
  drupalLoginEndpoint: 'https://cm.standard.com/login-content/sys?_format=json',
  selfRegUrl: '',
  // termsAndConsentUrl purposely set in non-prod as sfg (prod) to assure its availability.
  termsAndConsentUrl: 'https://cm.standard.com/ng-page/sfg/termsconsent?_format=json',
  termsAndConsentEndpointDefaultContent: './assets/default/pages.default.terms-consent.json',
  drupalModalMfaInfoEndpoint: 'https://cm.standard.com/ng-page/sys/mfa-info?_format=json',
  drupalModalMfaDoIHaveToEndpoint: 'https://cm.standard.com/ng-page/sys/mfa-why-now?_format=json',
  contactUs: 'https://portalsys.standard.com/my-home/pages/contact-us',
  accountAccessUrl:  'https://accountsys.standard.com/account-access',
  myInformationUrl: 'https://accountsys.standard.com/my-information',
  changePasswordUrl: 'https://accountsys.standard.com/change-password',
  loginActivityUrl: 'https://accountsys.standard.com/login-activity',
  loginUrl: 'https://loginsys.standard.com',
  cmSectionsEndpoint: 'https://cm.standard.com/form-sections/sys/login?_format=json',
  acpUrl: 'https://loginsys.standard.com/ui/sla/authn/authorization/accept',
  pageEndpoint: 'https://cm.standard.com/ng-page/sys/[[pageId]]?_format=json',
};

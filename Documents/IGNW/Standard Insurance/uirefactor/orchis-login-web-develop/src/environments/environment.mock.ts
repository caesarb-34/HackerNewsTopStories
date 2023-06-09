// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import {buildInfo} from '@deploy/build-info';

export const environment = {
  production: false,
  buildInfo: buildInfo,
  env: 'dev',
  appCode: 'login',

  // Acquia/Drupal
  drupalEnv: 'dev',
  drupalEndpoint: 'https://cm.standard.com',
  drupalHost: 'dev.standard.com',

  // Timeout time for authenticated pages -- differs per environment for functional testing purposes
  // 5 minutes locally
  timeoutTimeInSeconds: 300,
  timeoutWarningTimeInSeconds: 120,

  // Environment Urls
  headerLogoUrl: '/',
  loginCancelUrl: '/',
  // Endpoints
  customerSupportUrl: 'https://www.standard.com/individual/contact-us',
  drupalOutageEndpoint: '',
  drupalNotificationEndpoint: './assets/mock/cm-notify-login.mock.json',
  drupalModalMfaInfoEndpoint: './assets/mock/cm-ng-page-mfa-info.mock.json',
  drupalModalMfaDoIHaveToEndpoint: './assets/mock/cm-ng-page-mfa-why-now.mock.json',
  identitySecurityUrl: './assets/mock/cm.ng-page-protect-identity.mock.json',
  myHomeUrl: 'https://portalint.standard.com/my-home/',
  drupalLoginEndpoint: './assets/mock/cm.login.mock.json',
  termsAndConsentUrl: './assets/mock/cm.ng-page-termsconsent.mock.json',
  termsAndConsentEndpointDefaultContent: './assets/default/pages.default.terms-consent.json',
  contactUs: 'https://portalint.standard.com/my-home/pages/contact-us',
  accountAccessUrl:  'https://accountint.standard.com/account-access',
  myInformationUrl: 'https://accountint.standard.com/my-information',
  changePasswordUrl: 'https://accountint.standard.com/change-password',
  loginActivityUrl: 'https://accountint.standard.com/login-activity',
  loginUrl: 'https://loginint.standard.com',
  cmSectionsEndpoint: './assets/mock/cm.sections.mock.json',
  acpUrl: 'https://loginint.standard.com/ui/sla/authn/authorization/accept',
};

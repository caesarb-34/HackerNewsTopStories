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
  drupalEnv: 'sfg',
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
  drupalNotificationEndpoint: 'https://dev.standard.com:4200/notify/sfg/login?_format=json',
  drupalModalMfaInfoEndpoint: 'https://dev.standard.com:4200/ng-page/sfg/mfa-info?_format=json',
  drupalModalMfaDoIHaveToEndpoint: 'https://dev.standard.com:4200/ng-page/sfg/mfa-why-now?_format=json',
  identitySecurityUrl: 'https://dev.standard.com:4200/ng-page/sfg/protect-identity?_format=json',
  myHomeUrl: 'https://portalint.standard.com/my-home/',
  drupalLoginEndpoint: 'https://dev.standard.com:4200/login-content/sfg?_format=json',
  termsAndConsentUrl: 'https://dev.standard.com:4200/ng-page/sfg/termsconsent?_format=json',
  termsAndConsentEndpointDefaultContent: './assets/default/pages.default.terms-consent.json',
  contactUs: 'https://portalint.standard.com/my-home/pages/contact-us',
  accountAccessUrl:  'https://accountint.standard.com/account-access',
  myInformationUrl: 'https://accountint.standard.com/my-information',
  changePasswordUrl: 'https://accountint.standard.com/change-password',
  loginActivityUrl: 'https://accountint.standard.com/login-activity',
  loginUrl: 'https://loginint.standard.com',
  cmSectionsEndpoint: 'https://dev.standard.com:4200/form-sections/sfg/login?_format=json',
  acpUrl: 'https://loginint.standard.com/ui/sla/authn/authorization/accept',
  pageEndpoint: 'https://dev.standard.com:4200/ng-page/int/[[pageId]]?_format=json',
};

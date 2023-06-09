import {BrowserModule, Title} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ModalModule} from 'ngx-bootstrap/modal';
import {AccordionModule} from 'ngx-bootstrap/accordion';
import {SelfRegistrationModule} from './self-registration/self-registration.module';
import {TextMaskModule} from 'angular2-text-mask';
import {AppRoutingModule} from './app-routing.module';
import {SharedComponentsModule} from './shared-components/shared-components.module';
import {
  AuthenticationService, BrowserDetectionModule,
  HeaderMenuFactory,
  IdleTimeoutModule,
  LinkTarget,
  LinkType,
  NavigationService,
  NgIdleModule, SfgModalDialogModule,
  SfgNgNoAuthBrandLibraryModule
} from 'sfg-ng-brand-library';
import {SfgNgBrandLibraryConfig} from 'sfg-ng-brand-library/lib/shared/model/sfg-ng-brand-library.config';

import {AccountService} from './shared/services/account.service';
import {AnalyticsService} from './shared/services/analytics.service';
import {DrupalContentService} from './shared/services/drupal-content.service';
import {ManagedContentService} from './shared/services/managed-content.service';
import {StepIndicatorService} from './shared/services/step-indicator.service';
import {ForcedDataCollectionService} from './forced-data-collection/forced-data-collection.service';

import {AppComponent} from './app.component';
import {LoginScreenComponent} from './login-screen/login-screen.component';
import {PasswordRecoveryComponent} from './password-recovery/password-recovery.component';
import {CheckEmailNotificationComponent} from './check-email-notification/check-email-notification.component';
import {SetPasswordComponent} from './set-password/set-password.component';
import {SetPasswordFailComponent} from './set-password/set-password-fail/set-password-fail.component';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import {UsernameCheckEmailComponent} from './username-recovery/username-check-email/username-check-email.component';
import {ActivateComponent} from './activate/activate.component';
import {UsernameRecoveryComponent} from './username-recovery/username-recovery.component';
import {environment} from '@environment';
import { LogoSpinnerComponent } from './logo-spinner/logo-spinner.component';
import {BrowserConfigModel} from 'sfg-ng-brand-library/lib/shared/model/browser-config.model';


const helpLink = HeaderMenuFactory.createMenuItem(
    'help-link',
    'Help',
    LinkType.EXTERNAL,
    'https://www.standard.com/individual/contact-us',
    LinkTarget.SELF,
    'fas fa-question-circle',
    undefined
);

declare module '@angular/core' {
  interface ModuleWithProviders<T = any> {
    ngModule: Type<T>;
    providers?: Provider[];
  }
}

const browserConfig: BrowserConfigModel = {
  unsupportedBrowsers: ['ie']
};

const sfgNgBrandLibraryConfig: SfgNgBrandLibraryConfig = {
  buildInfo: environment.buildInfo,
  env: environment.env,
  appCode: environment.appCode,
  cmEnv: environment.drupalEnv,
  cmEndpoint: environment.drupalEndpoint,
  enterpriseMenu: [helpLink],
  mobileMenu: [helpLink],
  // Idle Time Out Values
  // Note that these two variables together have the sum of 30 minutes together
  // timeoutWarningTimeInSeconds: 120,  // Timer in the Idle Timeout Modal => 2 min. (120 sec.)
  // timeoutTimeInSeconds: 1680,        // Idle timeout for modal to appear => 28 min. (1680 sec.)
};

@NgModule({
  declarations: [
    AppComponent,
    LoginScreenComponent,
    PasswordRecoveryComponent,
    CheckEmailNotificationComponent,
    SetPasswordComponent,
    SetPasswordFailComponent,
    PageNotFoundComponent,
    ActivateComponent,
    UsernameRecoveryComponent,
    UsernameCheckEmailComponent,
    LogoSpinnerComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ModalModule.forRoot(),
    AccordionModule.forRoot(),
    SelfRegistrationModule.forRoot(),
    SharedComponentsModule,
    TextMaskModule,
    BrowserAnimationsModule,
    SfgNgNoAuthBrandLibraryModule.forRoot(sfgNgBrandLibraryConfig),
    BrowserDetectionModule.forRoot(browserConfig),
    NgIdleModule.forRoot(),
    IdleTimeoutModule,
    AppRoutingModule,
    BrowserDetectionModule.forRoot(browserConfig),
    SfgModalDialogModule.forRoot(environment.pageEndpoint)
  ],
  providers: [
    AccountService,
    AnalyticsService,
    AuthenticationService,
    ManagedContentService,
    DrupalContentService,
    StepIndicatorService,
    ForcedDataCollectionService,
    Title,
    NavigationService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}

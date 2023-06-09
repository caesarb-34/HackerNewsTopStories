import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ModalModule} from 'ngx-bootstrap/modal';
import { FormsModule } from '@angular/forms';
import { TextMaskModule } from 'angular2-text-mask';
import {SharedComponentsModule} from '../shared-components/shared-components.module';

/* Components */
import { SelfRegistrationComponent } from './self-registration.component';
import { CreateAccountComponent } from './create-account/create-account.component';
import { SelfRegSetPasswordComponent } from './self-reg-set-password/self-reg-set-password.component';
import { ActivateAccountComponent } from './activate-account/activate-account.component';

/* Modules */
import { SelfRegistrationRoutingModule } from './self-registration-routing.module';
import { SelfRegistrationService } from './self-registration.service';
import { SetLoginCredentialsComponent } from './set-login-credentials/set-login-credentials.component';

@NgModule({
  imports: [
    SelfRegistrationRoutingModule,
    CommonModule,
    FormsModule,
    ModalModule.forRoot(),
    SharedComponentsModule,
    TextMaskModule
  ],
  declarations: [
    SelfRegistrationComponent,
    CreateAccountComponent,
    ActivateAccountComponent,
    SelfRegSetPasswordComponent,
    SetLoginCredentialsComponent
  ],
  providers: [
    SelfRegistrationService
  ]
})
export class SelfRegistrationModule {

  /**
   * forRoot() ensures that this module's providers that need to be available to
   * other modules/components in this application are added to the root injector
   */
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SelfRegistrationModule,
      providers: []
    };
  }
}

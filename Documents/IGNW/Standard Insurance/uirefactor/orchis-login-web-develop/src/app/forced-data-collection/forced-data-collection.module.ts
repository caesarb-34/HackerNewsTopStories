import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {TextMaskModule} from 'angular2-text-mask';
import {ModalModule} from 'ngx-bootstrap/modal';
import {IdleTimeoutModule} from 'sfg-ng-brand-library';
import {SharedComponentsModule} from '../shared-components/shared-components.module';
import {ContactInfoCollectionComponent} from './contact-info-collection/contact-info-collection.component';
import {ForcedDataCheckEmailComponent} from './forced-data-check-email/forced-data-check-email.component';

import {ForcedDataCollectionRoutingModule} from './forced-data-collection-routing.module';
import {ForcedDataCollectionComponent} from './forced-data-collection.component';
import {ForcedMfaComponent} from './forced-mfa/forced-mfa.component';
import {ForcedPasswordConfirmationComponent} from './forced-password-confirmation/forced-password-confirmation.component';
import {ForcedResetPasswordComponent} from './forced-reset-password/forced-reset-password.component';


@NgModule({
  declarations: [
    ContactInfoCollectionComponent,
    ForcedDataCheckEmailComponent,
    ForcedDataCollectionComponent,
    ForcedMfaComponent,
    ForcedPasswordConfirmationComponent,
    ForcedResetPasswordComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ModalModule.forRoot(),
    SharedComponentsModule,
    IdleTimeoutModule,
    TextMaskModule,
    ForcedDataCollectionRoutingModule
  ]
})
export class ForcedDataCollectionModule { }

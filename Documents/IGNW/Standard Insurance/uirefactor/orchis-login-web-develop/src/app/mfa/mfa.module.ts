import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {TextMaskModule} from 'angular2-text-mask';
import {ModalModule} from 'ngx-bootstrap/modal';
import {IdleTimeoutModule} from 'sfg-ng-brand-library';
import {SharedComponentsModule} from '../shared-components/shared-components.module';
import {MfaCodeComponent} from './mfa-code/mfa-code.component';
import {MfaEnrollmentConfirmationComponent} from './mfa-enrollment-confirmation/mfa-enrollment-confirmation.component';

import {MfaRoutingModule} from './mfa-routing.module';
import {MfaUntrustedDeviceComponent} from './mfa-untrusted-device/mfa-untrusted-device.component';


@NgModule({
  declarations: [
    MfaCodeComponent,
    MfaEnrollmentConfirmationComponent,
    MfaUntrustedDeviceComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ModalModule.forRoot(),
    SharedComponentsModule,
    IdleTimeoutModule,
    TextMaskModule,
    MfaRoutingModule
  ]
})
export class MfaModule { }

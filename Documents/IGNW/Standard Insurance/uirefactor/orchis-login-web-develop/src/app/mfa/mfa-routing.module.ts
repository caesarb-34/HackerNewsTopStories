import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {APP_ROUTES} from '../shared/constants/router.constants';
import {MfaCodeComponent} from './mfa-code/mfa-code.component';
import {MfaEnrollmentConfirmationComponent} from './mfa-enrollment-confirmation/mfa-enrollment-confirmation.component';
import {MfaUntrustedDeviceComponent} from './mfa-untrusted-device/mfa-untrusted-device.component';


const routes: Routes = [
  { path: APP_ROUTES.MFA_CODE, component: MfaCodeComponent },
  { path: APP_ROUTES.MFA_CONFIRMATION, component: MfaEnrollmentConfirmationComponent },
  { path: APP_ROUTES.UNTRUSTED_DEVICE, component: MfaUntrustedDeviceComponent },
  { path: '', pathMatch: 'full', redirectTo: APP_ROUTES.MFA_CODE }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MfaRoutingModule { }

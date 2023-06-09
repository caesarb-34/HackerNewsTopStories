import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {APP_ROUTES} from '../shared/constants/router.constants';
import {ContactInfoCollectionComponent} from './contact-info-collection/contact-info-collection.component';
import {ForcedDataCheckEmailComponent} from './forced-data-check-email/forced-data-check-email.component';
import {ForcedDataCollectionComponent} from './forced-data-collection.component';
import {ForcedMfaComponent} from './forced-mfa/forced-mfa.component';
import {ForcedPasswordConfirmationComponent} from './forced-password-confirmation/forced-password-confirmation.component';
import {ForcedResetPasswordComponent} from './forced-reset-password/forced-reset-password.component';


const routes: Routes = [
  { path: APP_ROUTES.COLLECT_CONTACT_INFO, component: ContactInfoCollectionComponent },
  { path: APP_ROUTES.DATA_COLLECTION_EMAIL, component: ForcedDataCheckEmailComponent },
  { path: APP_ROUTES.EMAIL_VERIFICATION,
    loadChildren: () => import('../email-verification/email-verification.module')
                        .then(m => m.EmailVerificationModule)},
  { path: APP_ROUTES.PASSWORD_CONFIRMATION, component: ForcedPasswordConfirmationComponent },
  { path: APP_ROUTES.PASSWORD_EXPIRED, component: ForcedResetPasswordComponent },
  { path: APP_ROUTES.MFA_PREFERENCE, component: ForcedMfaComponent },
  { path: APP_ROUTES.DATA_COLLECTION, redirectTo: '' },
  { path: '', pathMatch: 'full', component: ForcedDataCollectionComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ForcedDataCollectionRoutingModule { }

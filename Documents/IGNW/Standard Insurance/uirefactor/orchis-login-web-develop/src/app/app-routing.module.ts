import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginScreenComponent} from './login-screen/login-screen.component';
import {PasswordRecoveryComponent} from './password-recovery/password-recovery.component';
import {CheckEmailNotificationComponent} from './check-email-notification/check-email-notification.component';
import {APP_ROUTES} from './shared/constants/router.constants';
import {UsernameRecoveryComponent} from './username-recovery/username-recovery.component';
import {UsernameCheckEmailComponent} from './username-recovery/username-check-email/username-check-email.component';
import {SetPasswordComponent} from './set-password/set-password.component';
import {SetPasswordFailComponent} from './set-password/set-password-fail/set-password-fail.component';
import {ActivateComponent} from './activate/activate.component';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';


const routes: Routes = [
  { path: 'login', redirectTo: '' },
  { path: 'forgot-password', component: PasswordRecoveryComponent },
  { path: 'check-email', component: CheckEmailNotificationComponent },
  { path: 'forgot-username', component: UsernameRecoveryComponent },
  { path: 'forgot-username/check-email', component: UsernameCheckEmailComponent },
  { path: 'set-password', component: SetPasswordComponent },
  { path: 'set-password-fail/:code', component: SetPasswordFailComponent },
  { path: 'activate', component: ActivateComponent },
  { path: APP_ROUTES.EMAIL_VERIFICATION,
    loadChildren: () => import('./email-verification/email-verification.module')
                          .then(m => m.EmailVerificationModule)
  },
  { path: APP_ROUTES.MFA,
    loadChildren: () => import('./mfa/mfa.module').then(m => m.MfaModule) },
  { path: APP_ROUTES.DATA_COLLECTION,
    loadChildren: () => import('./forced-data-collection/forced-data-collection.module')
                          .then(m => m.ForcedDataCollectionModule) },
  { path: '', pathMatch: 'full', component: LoginScreenComponent },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

/* Components */
import { SelfRegistrationComponent } from './self-registration.component';
import { CreateAccountComponent } from './create-account/create-account.component';
import { ActivateAccountComponent } from './activate-account/activate-account.component';
import {SetLoginCredentialsComponent} from './set-login-credentials/set-login-credentials.component';

const selfRegistrationModuleRoutes: Routes = [
  {
    path: 'register',
    component: SelfRegistrationComponent,
    children: [
      { path: 'step1', component: CreateAccountComponent},
      { path: 'step2', component: SetLoginCredentialsComponent},
      { path: 'step3', component: ActivateAccountComponent},
      { path: '', component: CreateAccountComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(selfRegistrationModuleRoutes)],
  exports: [RouterModule]
})

export class SelfRegistrationRoutingModule {}

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {TextMaskModule} from 'angular2-text-mask';
import {NgIdleModule} from '@ng-idle/core';
import {BsDropdownModule} from 'ngx-bootstrap/dropdown';
import {ModalModule} from 'ngx-bootstrap/modal';
// Components
import {MessagePopupComponent} from './message-popup/message-popup.component';
import {CapslockTooltipComponent} from './capslock-tooltip/capslock-tooltip.component';
import {NewPasswordComponent} from './new-password/new-password.component';
import {StepIndicatorComponent} from './step-indicator/step-indicator.component';
import {InputTextTrimDirective} from '../shared/directives/input-text-trim.directive';
import {PhonePipe} from '../shared/pipes/phone.pipe';
import {InputTooltipComponent} from './input-tooltip/input-tooltip.component';
import {ValidatePasswordDirective } from './directives/validate-password.directive';
import { ResendActivationComponent } from './resend-activation/resend-activation.component';

/**
 * Shared Components module encapsulates shared components supporting other application components.
 *
 * NOTE: it is important to keep providers out of the SharedModule.
 * When the app starts, Angular eagerly loads the AppModule and potentially other early-loaded modules
 * that use the SharedModule. No problem so far..
 * But when a lazy-loaded module using SharedModule is loaded, it creates a child injector and registers all
 * the providers available which would include any providers in the SharedModule if we had any.
 */
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ModalModule.forRoot(),
    BsDropdownModule.forRoot(),
    TextMaskModule,
    NgIdleModule.forRoot()
  ],
  declarations: [
    MessagePopupComponent,
    CapslockTooltipComponent,
    NewPasswordComponent,
    StepIndicatorComponent,
    InputTextTrimDirective,
    PhonePipe,
    InputTooltipComponent,
    ValidatePasswordDirective,
    ResendActivationComponent
  ],
  // providers: [] // we declare NO PROVIDERS in Shared Module!!! see comment
  exports: [
    MessagePopupComponent,
    CapslockTooltipComponent,
    NewPasswordComponent,
    StepIndicatorComponent,
    InputTooltipComponent,
    InputTextTrimDirective,
    PhonePipe,
    ValidatePasswordDirective,
    ResendActivationComponent
  ]
})

export class SharedComponentsModule {}

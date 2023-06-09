import {Component, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {Router} from '@angular/router';

import {environment} from '@environment';
import {UserRegistrationModel} from '../../shared/models/user.registration.model';
import {SelfRegistrationService} from '../self-registration.service';
import {ValidationHelpers} from '../../shared/errors/validation-helpers';

@Component({
  selector: 'lgn-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.scss']
})
export class CreateAccountComponent implements OnInit {

  @ViewChild('helpModal') public helpModal;
  @ViewChild('createAccountForm') public createAccountForm: NgForm;
  public PHONE_MASK: any[] = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  public readonly EMAIL_VALIDATION_PATTERN = '^(([^<>()\\[\\]\\\\.,;:\\s@"]+(\\.[^<>()\\[\\]\\\\.,;:\\s@"]+)*)|(".+"))@((\\[[0-9]{1,3}\\.' +
      '[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$';
  public HELP_MODAL_MESSAGES = {
    email: 'Please provide an email address we can contact if we detect unusual activity in your account or if you get locked out.',
    phone: 'Please provide a phone number we can contact if we detect unusual activity in your account or if you get locked out.'
  };

  public userViewModel: UserRegistrationModel = new UserRegistrationModel();
  public focusFirstName: boolean;
  public focusLastName: boolean;
  public focusEmail: boolean;
  public focusPhone: boolean;
  public modalMessage: string;

  constructor(public selfRegService: SelfRegistrationService,
              public router: Router) { }

  ngOnInit() {
    // Just in case the user hits the back button, we want to update the form
    this.userViewModel = this.selfRegService.getUserInformation();
  }

  /**
   * Form on submit event
   */
  public onSubmit(): void {
    // turn on validation messages if needed on all fields
    ValidationHelpers.touchAllFormFields(this.createAccountForm);
    if (this.userViewModel.email) {
      this.userViewModel.email = this.userViewModel.email.trim();
    }
    const modelValid = this.verifyDataModel(this.userViewModel);

    if (this.createAccountForm.valid && modelValid) {
      this.userViewModel.mobile = this.userViewModel.mobile.replace(/\D+/g, ''); // Remove all characters except digits
      this.selfRegService.setNewUserInformation(this.userViewModel);
      this.router.navigate(['/register/step2']);
    }
  }

  /**
   * Checks to make sure the model fields have values before submitting
   */
  public verifyDataModel(userModel: UserRegistrationModel): boolean {
    return (this.isValidStringValue(userModel.firstName) &&
            this.isValidStringValue(userModel.lastName) &&
            this.isValidStringValue(userModel.email) &&
            this.isValidStringValue(userModel.mobile) &&
            (userModel.isMobile !== undefined));
  }

  public isValidStringValue(value: string): boolean {
    return (value !== undefined && value.length > 0);
  }

  /**
   * Show the help modal with a particular message
   * @param type type can only be 'email', 'phone'
   */
  public helpIndicatorClick(type: string): void {
    this.modalMessage = this.HELP_MODAL_MESSAGES[type];

    if (this.modalMessage) {
      this.helpModal.show();
    }
  }

  /**
   * Mark all fields in the given form as touched.  This will turn on validation messages, since
   * validation messages only appear after a field is touched.
   * Call this during onSubmit().  It doesn't effect actual validation which must be handled
   * by each control's validators.
   * This might not handle nested sub forms.
   */
  public touchAllFormFields(form) {
   Object.keys(form.controls).forEach((name) => {
     const currentControl = this.createAccountForm.controls[name].markAsTouched({ onlySelf: true });
   });
  }

}

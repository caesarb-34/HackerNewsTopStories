import {Component, OnInit, ViewChild} from '@angular/core';
import {ControlContainer, NgControl, NgForm} from '@angular/forms';
import {UserRegistrationModel} from '../../shared/models/user.registration.model';
import {SelfRegistrationService} from '../self-registration.service';
import {ValidationHelpers} from '../../shared/errors/validation-helpers';


@Component({
  selector: 'lgn-set-login-credentials',
  templateUrl: './set-login-credentials.component.html',
  styleUrls: ['./set-login-credentials.component.scss'],
  viewProviders: [ { provide: ControlContainer, useExisting: NgForm } ],
})

export class SetLoginCredentialsComponent implements OnInit {
  @ViewChild('helpModal') public helpModal;
  @ViewChild('setLoginCredentials') public setLoginCredentials: NgForm;
  @ViewChild('txtUserName') public userNameControl: NgControl;

  public userRegistrationViewModel: UserRegistrationModel = new UserRegistrationModel();
  public focusUserName: boolean;
  public userName: string;
  public newPassword: string;
  public usernameRegx = new RegExp('^[^0@$;|&\\\\/\\s](?=.*[a-zA-Z])((?![@$;|&\\\\/\\s]).)*$');
  // For the username tooltip
  public intro: string = 'Your user name must have:';
  public requirementsList: Array<string> = ['7 - 20 characters', 'At least one letter', 'No spaces', 'No @ $ ; | & / \\ symbols',
    'Cannot start with 0'];
  public confirmPasswordMatch: boolean = false;
  public email: string = '';
  public userInfoForEmail: UserRegistrationModel = new UserRegistrationModel();

  constructor(
    public selfRegistrationService: SelfRegistrationService
  ) { }

  ngOnInit() {
    this.selfRegistrationService.syncPageStep(2);
    this.userInfoForEmail = this.selfRegistrationService.getUserInformation();
    this.email = this.userInfoForEmail.email;
  }

  onSubmit() {
    // turn on validation messages if needed on all fields
    ValidationHelpers.touchAllFormFields(this.setLoginCredentials);

    // Update the value(s) from the sub form into the model.
    this.userRegistrationViewModel.password = this.setLoginCredentials.value['fieldNewPassword'];
    this.confirmPasswordMatch = this.setLoginCredentials.value['_matchValid'];

    if (this.setLoginCredentials.valid && this.confirmPasswordMatch) {
      this.sendUserRegistrationDataToSelfRegistrationService();
    }
  }

  public sendUserRegistrationDataToSelfRegistrationService(): void {
      this.selfRegistrationService.setNewUserIdAndPassword(this.userRegistrationViewModel);
      this.selfRegistrationService.registerUser('/register/step3');
  }

}

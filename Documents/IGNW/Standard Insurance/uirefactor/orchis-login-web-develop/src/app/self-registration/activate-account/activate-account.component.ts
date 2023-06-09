import {Component, OnInit} from '@angular/core';
import {environment} from '@environment';
import { SelfRegistrationService } from '../self-registration.service';
import { UserRegistrationModel } from '../../shared/models/user.registration.model';


@Component({
  selector: 'lgn-activate-account',
  templateUrl: './activate-account.component.html',
  styleUrls: ['./activate-account.component.scss']
})
export class ActivateAccountComponent implements OnInit {
  public identifier: string;
  public destination: string;
  public customerSupportUrl: string = environment.customerSupportUrl;
  public loginUrl: string = environment.loginUrl;
  public userRegistrationModel: UserRegistrationModel = new UserRegistrationModel();

  constructor(public selfRegistrationService: SelfRegistrationService) {
  }

  ngOnInit() {
    this.selfRegistrationService.syncPageStep(3);
    this.userRegistrationModel = this.selfRegistrationService.getUserInformation();
    this.identifier = this.userRegistrationModel.uid;
    this.destination = this.userRegistrationModel.email;
    // clear the error message
    this.selfRegistrationService.syncErrorMessage('');
  }

}

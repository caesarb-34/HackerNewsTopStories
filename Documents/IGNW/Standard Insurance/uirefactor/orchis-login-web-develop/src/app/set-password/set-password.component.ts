import {Component, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {Step} from '../shared/models/step.model';
import {AuthenticationService} from 'sfg-ng-brand-library';


@Component({
  selector: 'lgn-set-password',
  templateUrl: './set-password.component.html',
  styleUrls: ['./set-password.component.scss']
})
export class SetPasswordComponent implements OnInit {

  public hasPasswordError: boolean = false;
  public activeErrorMessage: string = '';
  public adminInitiated: boolean;
  public provisioned: boolean;

  public selectedStep: number = 3;
  public steps: Array<Step> = [
    {index: 1, label: ''},
    {index: 2, label: ''},
    {index: 3, label: ''}
  ];
  public otpCode: string;
  public setPasswordConfirmationUrl: string = '/'; // for routing on successful submitPassword()

  constructor(private route: ActivatedRoute,
              private router: Router,
              private titleService: Title,
              public authenticationService: AuthenticationService) {
  }

  ngOnInit() {
    // Query Parameter for reset Password
    this.adminInitiated = (this.route.snapshot.queryParams['adminInitiated'] === 'true');
    // Query Parameter for account creation
    this.provisioned = (this.route.snapshot.queryParams['provisioned'] === 'true');
    this.route.queryParamMap
      .subscribe((queryParams: ParamMap) => {
        this.otpCode = queryParams.get('code');
      });

    this.provisioned ?
      this.titleService.setTitle('Create Password | The Standard') :
      this.titleService.setTitle('Set New Password | The Standard');

  }

  public handlePasswordError(activePasswordError) {
    this.hasPasswordError = activePasswordError.hasActiveError;
    this.activeErrorMessage = activePasswordError.activeErrorMessage;
  }

  public handleNavigationToLogin() {
   if (this.provisioned) {
    this.router.navigate([this.setPasswordConfirmationUrl], {queryParams: {accountactivated: true}});
   } else {
    this.router.navigate([this.setPasswordConfirmationUrl], {queryParams: {passwordreset: true}});
   }
  }
}

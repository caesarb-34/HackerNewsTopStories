import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import { Title } from '@angular/platform-browser';

import {AuthenticationService} from 'sfg-ng-brand-library';
import {Step} from '../shared/models/step.model';
import {IResponse} from 'cloudentityjs/dist/typings/core/Request';
import {environment} from '@environment';


@Component({
  selector: 'lgn-password-recovery',
  templateUrl: './password-recovery.component.html',
  styleUrls: ['./password-recovery.component.scss'],
})
export class PasswordRecoveryComponent implements OnInit {

  @ViewChild('forgotPasswordForm') form: NgForm;
  public selectedStep: number = 1;
  public steps: Array<Step> = [
    {index: 1, label: 'Establish Identity'},
    {index: 2, label: 'Check Email'},
    {index: 3, label: 'Set Password'}
  ];

  public userName: string;
  public userEmail: string;
  public checkEmailUrl: string = 'check-email'; // For routing the form onSubmit function
  public focusUserName: boolean = false;
  public focusEmail: boolean = false;
  public userNameErrors: boolean = false;
  public userEmailErrors: boolean = false;
  public customerSupportUrl: string = environment.customerSupportUrl;

  constructor(private router: Router,
              private titleService: Title,
              public authenticationService: AuthenticationService) {
  }

  ngOnInit() {
    this.titleService.setTitle('Forgot Password | The Standard');
  }

  /**
   * The forgot password form on submit event
   */
  onSubmit(): void {
      this.userNameErrors = true;
      this.userEmailErrors = true;

    // Send to check email screen
      if (this.userName && this.userEmail && this.form.valid) {
      this.userEmail = this.userEmail.trim();
      this.authenticationService.requestResetPassword(this.userName, this.userEmail).subscribe(
        () => {
          this.router.navigate([this.checkEmailUrl]);
        },
        (error: IResponse) => {
          this.router.navigate([this.checkEmailUrl]);
        }
      );
    }

  }

  public customerSupport(): void {
    window.location.href = this.customerSupportUrl;
  }

 public OnFocusUserName(): void {
    this.focusUserName = true;
    this.userNameErrors = true;
  }

  public OnFocusUserEmail(): void {
     this.focusEmail = true;
     this.userEmailErrors = true;
   }
}

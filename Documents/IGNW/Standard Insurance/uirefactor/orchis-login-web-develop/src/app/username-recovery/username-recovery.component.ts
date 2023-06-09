import {Component, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {Title} from '@angular/platform-browser';
import {Router} from '@angular/router';


import {environment} from '@environment';
import {AuthenticationService} from 'sfg-ng-brand-library';
import {IResponse} from 'cloudentityjs/dist/typings/core/Request';

@Component({
  selector: 'lgn-username-recovery',
  templateUrl: './username-recovery.component.html',
  styleUrls: ['./username-recovery.component.scss']
})
export class UsernameRecoveryComponent implements OnInit {

  @ViewChild('forgotUserNameForm') form: NgForm;

  public readonly EMAIL_VALIDATION_PATTERN = '^(([^<>()\\[\\]\\\\.,;:\\s@"]+(\\.[^<>()\\[\\]\\\\.,;:\\s@"]+)*)|(".+"))@((\\[[0-9]{1,3}\\.' +
      '[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$';
  public title: string = 'Recover User Name | The Standard';
  public userEmail: string;  // Model value
  public focusEmail: boolean = false;
  public checkEmailUrl: string = '/forgot-username/check-email'; // For routing the form onSubmit function
  public customerSupportUrl: string = environment.customerSupportUrl;
  public introParagraph: string = 'We can send your user name if you have a verified email address on file. If you do '
      + 'not receive an email, please <a href="' + this.customerSupportUrl + '" target="_blank">contact us</a> for help.';
  public activeError: string = '';
  public hasActiveError: boolean = false;
  public errorMessages = {
    422: 'Please enter a valid email address.'
  };

  constructor(private router: Router,
              private titleService: Title,
              public authService: AuthenticationService) { }

  ngOnInit() {
    this.titleService.setTitle(this.title);
  }

  public onSubmit(): void {
    if (this.userEmail) {
      this.userEmail = this.userEmail.trim();
    }
    if (this.form.valid) {
      this.authService.recoverUserName(this.userEmail).subscribe(
          next => this.router.navigate([this.checkEmailUrl]),
          error => {
            this.activeError = error.status;
            this.hasActiveError = true;
            const errMsg = 'Unprocessable Entity';
            console.warn(errMsg);
          });
    }
  }

}

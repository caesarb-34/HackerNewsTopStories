import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { environment } from '@environment';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthenticationService} from 'sfg-ng-brand-library';


@Component({
  selector: 'lgn-email-verification',
  templateUrl: './email-verification.component.html',
  styleUrls: ['./email-verification.component.scss']
})
export class EmailVerificationComponent implements OnInit {

  public myHomeUrl: string = environment.myHomeUrl;
  public customerSupportUrl: string = environment.customerSupportUrl;
  public responseSuccess = true;
  public errorTitle: string;
  public errorMessage: string;

  public errorMessages = {
    'user.verificationcodeinvalid': {
      title: 'Your activation link has expired.',
      message: 'You can request a new link or <a href=\"' + this.customerSupportUrl + '\" target="_blank">contact us</a> for assistance.'
    },
    'request.gone': {
      title: 'Your activation link has expired.',
      message: 'You can request a new link or <a href=\"' + this.customerSupportUrl + '\" target="_blank">contact us</a> for assistance.'
    },
    'default': {
      title: 'Something went wrong.',
      message: 'The server did not understand this request. Please try the link again. If you continue to experience ' +
      'this problem, please <a href=\"' + this.customerSupportUrl + '\" target="_blank">contact us</a> for help.'
    }
  };

  constructor(private titleService: Title,
              public authenticationService: AuthenticationService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
    this.titleService.setTitle('Thank You | The Standard');
    const otpCode = this.route.snapshot.queryParams['code'];

    this.verifyUserEmail(otpCode);
  }

  public verifyUserEmail(otpCode: string): void {
    if (otpCode) {
      this.authenticationService.confirmVerifyIdentifier(otpCode).subscribe(
        next => { this.responseSuccess = true; },
        error => { this.handleError(error); }
      );
    } else {
      this.responseSuccess = true;
    }
  }

  public navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  public handleError(error: any): void {
    let errorMsg = this.errorMessages['default'];

    if (error.data && !!error.data.code) {
      const statusCode = error.data.code.toLowerCase();
      errorMsg = this.errorMessages[statusCode] ? this.errorMessages[statusCode] : this.errorMessages['default'];
    }

    this.errorTitle = errorMsg.title;
    this.errorMessage = errorMsg.message;
    this.responseSuccess = false;
  }
}

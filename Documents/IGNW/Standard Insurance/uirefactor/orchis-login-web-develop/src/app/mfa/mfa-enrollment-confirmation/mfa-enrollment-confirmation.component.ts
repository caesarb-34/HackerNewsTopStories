import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router} from '@angular/router';
import {environment} from '@environment';
import {IResponse} from 'cloudentityjs/dist/typings/core/Request';
import {AuthenticationService} from 'sfg-ng-brand-library';
import { CookieUtils } from '../../shared/utils/cookie';
import { GlobalConstants } from '../../shared/global-constants';


@Component({
  selector: 'lgn-mfa-enrollment-confirmation',
  templateUrl: './mfa-enrollment-confirmation.component.html',
  styleUrls: ['./mfa-enrollment-confirmation.component.scss']
})
export class MfaEnrollmentConfirmationComponent implements OnInit {
  public readonly MY_INFO_URL = environment.myInformationUrl;
  public askForBrowser: boolean = false;
  public doNotAskThisBrowserAgain: boolean = false;
  public mfaEnrollmentStatus: boolean = false;
  public mfaAuthenticated: boolean = false;
  public isMfaAltChannel: boolean = false;

  constructor(private titleService: Title,
              public route: ActivatedRoute,
              public router: Router,
              private authenticationService: AuthenticationService) { }

  ngOnInit() {
    this.mfaEnrollmentStatus = (this.route.snapshot.queryParams['mfaEnrollmentStatus'] === 'true');
    this.isMfaAltChannel = this.route.snapshot.queryParams['mfaAltChannel'] === 'true';

    this.mfaAuthenticated = (this.route.snapshot.queryParams['mfaAuthenticated'] === 'true');
    if (this.mfaEnrollmentStatus) {
      this.titleService.setTitle('Two-Step Verification Complete | The Standard');
    }
    if (this.mfaAuthenticated) {
      this.titleService.setTitle('Verification Successful | The Standard');
    }
    this.authenticationService.verifySession().subscribe(
    () => {/* User's session is valid */
    },
    (error: IResponse) => {
      console.error(error.status);
      this.router.navigate(['']);
    }
    );
  }

 public persistAsTrustedBrowser() {
  if (this.askForBrowser) {
    this.authenticationService.persistAsTrustedBrowser()
    .subscribe(
      () => {
        console.log('Trusted Browser Persist process Success');
        this.router.navigate(['/login']);
      },
      (error: IResponse) => {
        console.log('Error in Browser Persist process');
      }
    );
  } else {
     if (this.doNotAskThisBrowserAgain && !(this.askForBrowser)) {
       this.setDoNotAskUserCookie();
     }
     // navigating to the next page once setting the cookie value.
     this.router.navigate(['/login']);
  }
 }

 // this method set the cookieval as true for those who doNotAskThisBrowserAgain.
 public setDoNotAskUserCookie(): void {
    const setCookieVal = GlobalConstants.DEVICE_NO_ASK_BROWSER;
    CookieUtils.setCookie(setCookieVal, 'true', 365);
  }
}

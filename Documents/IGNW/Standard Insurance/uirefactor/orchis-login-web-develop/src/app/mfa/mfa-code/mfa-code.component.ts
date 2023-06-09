import {ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';

import { environment } from '@environment';
import {ModalDirective} from 'ngx-bootstrap/modal';
import { AuthenticationService } from 'sfg-ng-brand-library';
import {APP_ROUTES} from '../../shared/constants/router.constants';
import { CookieUtils } from '../../shared/utils/cookie';
import { GlobalConstants } from '../../shared/global-constants';


@Component({
  selector: 'lgn-mfa-code',
  templateUrl: './mfa-code.component.html',
  styleUrls: ['./mfa-code.component.scss']
})
export class MfaCodeComponent implements OnInit {
  @ViewChild('codeResetModal') public codeResetModal: ModalDirective;
  @ViewChild(NgForm) mfaForm: NgForm;
  @ViewChild('sixDigitOtpCode') public sixDigitOtpCode: ElementRef<HTMLInputElement>;

  public myHomeUrl: string = environment.myHomeUrl;
  public customerSupportUrl = environment.customerSupportUrl;
  public errorMessages = {
    400: 'Something went wrong. The server did not understand this request. If you continue to ' +
         'experience this problem, please <a href="' + this.customerSupportUrl + '">contact us</a> for help',
    401: 'You must <a href="/login">Log in</a> with a valid user name and password to see this page. ',
    404: 'We\'re sorry. We can\'t find that page. Please double check the web address or ' +
         '<a href="/">return to the login page</a> to access your account and secure services.',
    409: 'Something went wrong. The server could not process this request. If you continue to ' +
         'experience this problem, please <a href="' + this.customerSupportUrl + '">contact us</a> for help',
    422: 'Something went wrong. The server could not process this request. If you continue to ' +
         'experience this problem, please <a href="' + this.customerSupportUrl + '">contact us</a> for help',
    // This error is a general validation error that needs to be in the error box.
    // Its one I will control rather than getting it from the server
    499: 'The code you entered is incorrect or has expired.'
  };
  public activeError: number = 0;
  public mask: any[] = [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/];
  public focusSixDigitOtpCode: boolean = false;
  public isWaiting: boolean = true;
  public submitDisabled: boolean = false;
  public otpInput: string;
  public formLabel: string;
  public cookieUtils = CookieUtils;
  public displayPageContent = {
    h1Title: '',
    informationText: ''
  };
  public mfaAltChannelParam: boolean = false;
  public mfaOriginParam: string;
  public otpMethodParam: string;
  public otpMfaDestinationKeyParam: string;
  public mfaEnrollmentStatus: boolean;
  public mfaAuthenticated: boolean;
  public otpMethod: string;
  public otpMfaDestinationKey: string;
  public otpMfaDestinationMaskedResult: string;
  public queryParamsList: any;
  public pageContent = {
    email: {
      h1Title: 'Check your email.',
      informationText: ''
    },
    mobile: {
      h1Title: 'Check your phone.',
      informationText: ''
    },
    voice: {
      h1Title: 'Answer your phone.',
      informationText: ''
    }
  };
  public readonly MFA_CONFIRMATION_ROUTE = `/${APP_ROUTES.MFA}/${APP_ROUTES.MFA_CONFIRMATION}`;

  constructor(
    public authenticationService: AuthenticationService,
    private titleService: Title,
    private router: Router,
    private route: ActivatedRoute,
    private changeDetector: ChangeDetectorRef,
  ) {  }

  ngOnInit() {
    this.verifySession();
    this.initializeSettings();
  }

  public verifySession(): void {
    this.authenticationService.verifySession().subscribe(
      () => {
        this.getUserInformationSetDisplay();
      },
      () => {
        this.router.navigate(['/login']);
      }
    );
  }

  public initializeSettings(): void {
    // Setup the display elements
    this.titleService.setTitle('Enter code | The Standard');
    this.formLabel = '&#xf0c1;  Six-Digit Code';

    // Retrieve the parameters from the URL
    this.mfaOriginParam = this.route.snapshot.queryParams['mfaOrigin'];
    this.otpMethodParam = this.route.snapshot.queryParams['otpChannel'];
    this.otpMfaDestinationKeyParam = this.route.snapshot.queryParams['key'];
    this.mfaAltChannelParam = this.route.snapshot.queryParams['mfaAltChannel'];
    // Determine workflow
    if (this.mfaOriginParam === 'enrollment') {
      this.mfaEnrollmentStatus = true;
    } else if (this.mfaOriginParam === 'untrustedDevice') {
      this.mfaAuthenticated = true;
    } else {
      this.activeError = 400;
    }
  }

  public getUserInformationSetDisplay(): void {
    this.authenticationService.getMaskedUserIdentifiers().subscribe(
      (resultFromGetMaskedUser) => {
        this.setMaskedUserPreferences(resultFromGetMaskedUser);
        this.setDisplay(resultFromGetMaskedUser);
        // turn off spinner
        this.isWaiting = false;
        this.changeDetector.detectChanges();
        this.sixDigitOtpCode.nativeElement.focus();
      },
      (error) => {
        this.activeError = error.status;
      }
    );
  }

  public setMaskedUserPreferences(resultFromGetMaskedUser): void {
    if (this.otpMethodParam) {
      this.otpMethod = this.otpMethodParam;
    } else {
      this.otpMethod = resultFromGetMaskedUser.data.otpMethod;
    }

    if (this.otpMfaDestinationKeyParam) {
      this.otpMfaDestinationKey = this.otpMfaDestinationKeyParam;
    } else {
      this.otpMfaDestinationKey = resultFromGetMaskedUser.data.otpMfaDestination;
    }
  }

  public setDisplay(resultFromGetMaskedUser): void {
    const otpMethodArrayEmail = resultFromGetMaskedUser.data.emails;
    const otpMethodArrayMobile = resultFromGetMaskedUser.data.mobiles;
    const otpMethodArrayPhones = resultFromGetMaskedUser.data.phones;

    if (otpMethodArrayEmail) {
      this.setOtpMfaDestinationMaskedResult(otpMethodArrayEmail);
    }

    if (otpMethodArrayMobile) {
      this.setOtpMfaDestinationMaskedResult(otpMethodArrayMobile);
    }

    if (otpMethodArrayPhones) {
      this.setOtpMfaDestinationMaskedResult(otpMethodArrayPhones);
    }

    // Angular seems to only build the string once. Once built the variable isn't updated.
    this.pageContent.email.informationText = 'We just sent you an email to ' + this.otpMfaDestinationMaskedResult +
      ' with your verification code. Enter the six-digit code to verify this email account is yours.';
    this.pageContent.mobile.informationText = 'We just sent a text message to ' + this.otpMfaDestinationMaskedResult +
      ' with your verification code. Enter the six-digit code to verify this device is yours.';
    this.pageContent.voice.informationText = 'We’ll be calling you at ' + this.otpMfaDestinationMaskedResult +
      ' with your verification code. Enter the six-digit code to verify this phone number is yours.';

    switch (this.otpMethod) {
      case 'E':
        this.displayPageContent = this.pageContent.email;
        break;
      case 'M':
        this.displayPageContent = this.pageContent.mobile;
        break;
      case 'V':
        this.displayPageContent = this.pageContent.voice;
        break;
      default:
    }
  }

  public setOtpMfaDestinationMaskedResult(otpMethodArray) {
    let otpIndex;

    otpIndex = otpMethodArray.findIndex(
      item => item['key'] === this.otpMfaDestinationKey
    );

    if (otpIndex > -1) {
      this.otpMfaDestinationMaskedResult = otpMethodArray[otpIndex].masked;
    }
  }

  public checkCode(): void {
    let authenticateCode: string;
    let originVariable: string;
    let otpVariable: string;

    // determine which API to call and which peram to set
    if (this.mfaEnrollmentStatus) {
      authenticateCode = 'confirmOtpMfaSetup';
      originVariable = 'mfaEnrollmentStatus';
      otpVariable = 'code';
    } else if (this.mfaAuthenticated) {
      authenticateCode = 'authenticateWithOtp';
      originVariable = 'mfaAuthenticated';
      otpVariable = 'otp';
    } else {
      this.activeError = 499;
    }

    // start the spinner
    this.submitDisabled = true;

    // make the call - [] are to specify which function to use.
    if (this.mfaEnrollmentStatus || this.mfaAuthenticated) {
      this.authenticationService[authenticateCode]({
        body: {
          [otpVariable]: this.otpInput
        }
      }).subscribe(
        (next) => {

          this.queryParamsList = {
            [originVariable]: true
          };
          if (this.mfaAltChannelParam) {
            this.queryParamsList['mfaAltChannel'] = true;
          }
          const cookieVal = this.getDoNotAskUserCookie();
          if (cookieVal) {
            this.navigateTo(this.myHomeUrl);
          } else {
            this.router.navigate([this.MFA_CONFIRMATION_ROUTE],
              {queryParams: this.queryParamsList});
          }
        },
        (error) => {
          // let the user know
          this.activeError = 499;
          // stop the spinner
          this.submitDisabled = false;
        }
      );
    }
  }

  // used by the input label in DOM
  public displayInputLabel(): boolean {
    return (this.focusSixDigitOtpCode || !!this.otpInput);
  }

  public resendOtpRequest(): void {
    if (this.mfaOriginParam === 'untrustedDevice') {
      this.authenticationService.sendAuthenticationOtp({
        body: {
          maskIdentifierKey: this.otpMfaDestinationKey,
          deliveryMode: this.otpMethod
        }
      }).subscribe(
        () => {
          console.log('sendAuthenticationOtp code resent.');
        }, (error) => {
          this.activeError = error.status;
          console.log('sendAuthenticationOtp error');
        }
      );
    } else if (this.mfaOriginParam === 'enrollment') {
      this.authenticationService.setupOtpMfa({
        body: {
          maskIdentifierKey: this.otpMfaDestinationKey,
          otpMethod: this.otpMethod
        }
      }).subscribe(
        () => {
          console.log('setupOtpMfa code resent.');
        }, (error) => {
          this.activeError = error.status;
          console.log('setupOtpMfa error');
        }
      );
    }
  }

  // this method get the cookie value and return the boolean value
  public getDoNotAskUserCookie(): boolean {
     const setCookieVal = GlobalConstants.DEVICE_NO_ASK_BROWSER;
     const cookieVal = this.cookieUtils.getCookie(setCookieVal);
     return (cookieVal === 'true');
  }

  /**
   * navigate to url
   * @param {string} toUrl
   */
  public navigateTo(toUrl: string) {
    window.location.href = toUrl;
  }

  public onSubmit(): void {
    // validate form
    if (this.mfaForm.valid) {
      // check the code
      this.checkCode();

    } else {
      // show error in form
      this.activeError = 499;
    }
  }

 }




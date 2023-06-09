import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Title} from '@angular/platform-browser';
import {ModalDirective} from 'ngx-bootstrap/modal';

import {IResponse} from 'cloudentityjs/dist/typings/core/Request';
import {APP_ROUTES} from '../../shared/constants/router.constants';
import {StepIndicatorService} from '../../shared/services/step-indicator.service';
import {Step} from '../../shared/models/step.model';
import {DialogContent} from '../../shared/models/dialog-content.model';
import {DrupalContentService} from '../../shared/services/drupal-content.service';
import {environment} from '@environment';
import {AuthenticationService} from 'sfg-ng-brand-library';
import {MaskedUserIdentifier, default as MaskedUserIdentifiers} from '../../mfa/masked-user-identifiers.model';


@Component({
  selector: 'lgn-forced-mfa',
  templateUrl: './forced-mfa.component.html',
  styleUrls: ['./forced-mfa.component.scss']
})
export class ForcedMfaComponent implements OnInit {
  @ViewChild('mfaInfoModal') public mfaInfoModal: ModalDirective;
  @ViewChild('mfaDoIHaveToModal') public mfaDoIHaveToModal: ModalDirective;
  public steps: Array<Step>;
  public selectedStep: number;
  public urlModalInfo: string = environment.drupalModalMfaInfoEndpoint;
  public urlModalDoIHaveTo: string = environment.drupalModalMfaDoIHaveToEndpoint;
  public mfaInfoModalContent: DialogContent = {id: null, title: null, body: null, size: null};
  public mfaInfoModalError: boolean = false;
  public mfaDoIHaveToModalContent: DialogContent;
  public mfaDoIHaveToModalError: boolean = false;
  public userData: MaskedUserIdentifiers ;
  public customerSupportUrl: string = environment.customerSupportUrl;
  public activeError: string = '';
  public defaultEmail: MaskedUserIdentifier;
  public defaultMobile: MaskedUserIdentifier;
  public defaultPhone: MaskedUserIdentifier;
  public identifiers: MaskedUserIdentifiers;
  public NO_INFO: string = 'No information (You may add this later.)';
  public inputNotSelectedError: string;
  public isMfaRadioInputEnabled: any = {
    emails: false,
    phones: false,
    mobiles: false
  };
  public keyToBeSent: string;
  public otpMethod: string;
  public collectedInputValue: string;

  /* Error messages */
  public errorMessages = {
    400: 'Something went wrong. The server did not understand this request. If you continue to ' +
    'experience this problem, please <a href="' + this.customerSupportUrl + '">contact us</a> for help',
    401: 'You must <a href="/login">Log in</a> with a valid user name and password to see this page. ',
    404: 'We\'re sorry. We can\'t find that page. Please double check the web address or ' +
    '<a href="/">return to the login page</a> to access your account and secure services.',
    408: 'Something went wrong. The requested action has timed out. If you continue to experience this problem, ' +
    'please <a href="' + this.customerSupportUrl + '">contact us</a> for help.',
    409: 'Something went wrong. The server could not process this request. If you continue to ' +
    'experience this problem, please <a href="' + this.customerSupportUrl + '">contact us</a> for help',
    422: 'Something went wrong. The server could not process this request. If you continue to ' +
    'experience this problem, please <a href="' + this.customerSupportUrl + '">contact us</a> for help',
    500: 'Something went wrong. The server could not process this request. If you continue to ' +
    'experience this problem, please <a href="' + this.customerSupportUrl + '">contact us</a> for help'
  };

  constructor(
    public stepIndicatorService: StepIndicatorService,
    private router: Router,
    private titleService: Title,
    public route: ActivatedRoute,
    public drupalContentService: DrupalContentService,
    public authenticationService: AuthenticationService,
  ) {}

  ngOnInit() {
    this.titleService.setTitle('MFA Preference | The Standard');
    this.getMaskedUserData();
    this.validateSession();
  }

  /**
   * Validates the user session
   */
  public validateSession() {
    // check to see if the user is authenticated
    this.authenticationService.verifySession().subscribe(
      () => {},
      // if the user is not authenticated, send the user to the login page
      (error: IResponse) => {
        this.router.navigate(['/login']);
      }
    );
  }

  /*
   * First call setMfaMethod("OTP")
   * Second setupOtpMfa(masked key, otpMethod)
   * getMaskedIdentifiers -> setMfaMethod -> setupOtpMfa
   */
  public getMaskedUserData(): void {
    this.authenticationService.getMaskedUserIdentifiers()
      .subscribe(
        (userMaskedData) => {
          this.identifiers = userMaskedData.data;
          this.defaultMobile = this.extractMaskedContactPreference('mobiles');
          this.defaultEmail = this.extractMaskedContactPreference('emails');
          this.defaultPhone = this.extractMaskedContactPreference('phones');
          this.renderMobileForSmsAndVoice(this.defaultPhone, this.defaultMobile);
        }, (error) => {
          this.activeError = error.status;
        });
  }

  public extractMaskedContactPreference(contactPreference: string): MaskedUserIdentifier {
    let result = new MaskedUserIdentifier(this.NO_INFO);

    if (this.identifiers && this.identifiers.hasOwnProperty(contactPreference)) {
      result = this.identifiers[contactPreference].find((item) => {
        return (item.isDefault);
      });
      result = result ? result : new MaskedUserIdentifier(this.NO_INFO);
    }

    this.isMfaRadioInputEnabled[contactPreference] = (result.isDefault);

    return result;
  }

  /**
   *
   * If the Phone contact preference returned is undefined, set the masked phone
   * to equal the masked mobile. This allows for the mobile phone to render in both the
   * sms and voice input fields.
   *
   */
  public renderMobileForSmsAndVoice(phone, mobile) {

    if (mobile.isDefault && !phone.isDefault) {
      phone.masked = mobile.masked;
      phone.key = mobile.key;
      this.isMfaRadioInputEnabled.phones = true;
      this.isMfaRadioInputEnabled.mobiles = true;
    }
  }

  /**
   * This function is to show the modal window
   *
   */
  public showModal(type: string): void {

    const decideModalContent = (type === 'mfaInfoModal') ? this.urlModalInfo : this.urlModalDoIHaveTo;

    this.drupalContentService.getContent(decideModalContent)
      .subscribe(
        data => {
          const selModal = type === 'mfaInfoModal' ? this.mfaInfoModal : this.mfaDoIHaveToModal;
          if (selModal) {
            if (type === 'mfaInfoModal' ) {
              this.mfaInfoModalError = false;
              this.mfaInfoModalContent = data[0] as DialogContent;
            } else {
              this.mfaDoIHaveToModalError = false;
              this.mfaDoIHaveToModalContent = data[0] as DialogContent;
            }
          }
          selModal.show();
        },
        error => {
          if (type === 'mfaInfoModal') {
            this.mfaInfoModalError = true;
          } else {
            this.mfaDoIHaveToModalError = true;
          }
          const errMsg = 'getDrupalContentError';
        }
      );
  }

  onSubmit(): void {
    if (this.collectedInputValue === undefined) {
      this.inputNotSelectedError = 'Please make a selection.';
    } else {
      /* Setup MFA Method */
      this.authenticationService.setupMfaMethod({
        body: {
          mfaMethod: 'OTP'
        }
      }).subscribe(
        () => {
          this.sendOtpMethod();
        },
        error => {
          console.log('post error');
        });
    }
  }

  /* Step Indicator */
  public goToNextStep(): void {
    this.router.navigate([APP_ROUTES.MFA],
      {
        queryParams: {
            mfaOrigin: 'enrollment',
            otpChannel: this.collectedInputValue,
            key: this.keyToBeSent
        }
      });
  }

  /*
   * Send back to the key and otpMethod
   */
  public sendOtpMethod(): void {
    switch (this.collectedInputValue) {
      case 'E':
        this.keyToBeSent = this.defaultEmail.key;
        break;
      case 'V':
        this.keyToBeSent = this.defaultPhone.key;
        break;
      case 'M':
        this.keyToBeSent = this.defaultMobile.key;
        break;
    }

    this.authenticationService.setupOtpMfa({
      body: {
        maskIdentifierKey: this.keyToBeSent,
        otpMethod: this.collectedInputValue
      }
    }).subscribe(
      () => {
        this.goToNextStep();
      },
      error => {
        this.activeError = error.status;
        const errMsg = 'setupOtpMfaError';
        console.log(errMsg);
      });
  }
}

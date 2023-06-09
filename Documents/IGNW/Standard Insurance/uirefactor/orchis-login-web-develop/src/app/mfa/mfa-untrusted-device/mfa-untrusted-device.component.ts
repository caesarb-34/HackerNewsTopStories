import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {Title} from '@angular/platform-browser';
import {NgForm} from '@angular/forms';
import {IResponse} from 'cloudentityjs/dist/typings/core/Request';
import {AuthenticationService} from 'sfg-ng-brand-library';
import {APP_ROUTES} from '../../shared/constants/router.constants';
import MaskedUserIdentifiers from '../masked-user-identifiers.model';
import {environment} from '@environment';
import OtpDeliveryChannelsViewModel, {OtpDeliveryChannel} from '../otp-delivery-channels.view.model';
import {ExpectationFailedError} from '../../shared/errors/custom-errors';


@Component({
  selector: 'lgn-mfa-untrusted-device',
  templateUrl: './mfa-untrusted-device.component.html',
  styleUrls: ['./mfa-untrusted-device.component.scss']
})
export class MfaUntrustedDeviceComponent implements OnInit {

  @ViewChild('otpDeliveryChannelForm') public form: NgForm;
  @ViewChild('altOtpDeliveryChannel') public radioOtpDeliveryChannel;

  public activeError: number = 0;
  public customerSupportUrl = environment.customerSupportUrl;
  public errorMessages = {
    400: 'Something went wrong. The server did not understand this request. If you continue to ' +
    'experience this problem, please <a href="' + this.customerSupportUrl + '">contact us</a> for help',
    401: 'You must <a href="/login">Log in</a> with a valid user name and password to see this page. ',
    404: 'We\'re sorry. We can\'t find that page. Please double check the web address or ' +
    '<a href="/">return to the login page</a> to access your account and secure services.',
    409: 'Something went wrong. The server could not process this request. If you continue to ' +
    'experience this problem, please <a href="' + this.customerSupportUrl + '">contact us</a> for help',
    417: 'You have not been enrolled into Multi-Factor Authentication (MFA). ' +
    'Please <a href="' + this.customerSupportUrl + '">contact us</a> for help',
    422: 'Something went wrong. The server could not process this request. If you continue to ' +
    'experience this problem, please <a href="' + this.customerSupportUrl + '">contact us</a> for help'
  };


  public maskedUserIdentifiers: MaskedUserIdentifiers;
  public viewModel: OtpDeliveryChannelsViewModel;
  public showChannelList: boolean = false;

  public displayLabels = {
    E: 'Email to ',
    M: 'Text message to ',
    V: 'Automated voice call to '
  };

  public routeToAuthenticateWithOtp: string = APP_ROUTES.MFA;

  constructor(private titleService: Title,
              public authenticationService: AuthenticationService,
              private router: Router) {
  }

  ngOnInit() {
    this.titleService.setTitle('Send Code | The Standard');
    this.authenticationService.verifySession().subscribe(
      () => {
        this.getUserOtpDeliveryChannelOptions();
      },
      (error: IResponse) => {
        console.error(`no valid session: ${error.status}`);
        this.router.navigate(['/login']);
      }
    );
  }

  /**
   * makes server call to retrieve masked user identifiers
   * @VisibleForTesting
   */
  getUserOtpDeliveryChannelOptions(): void {

    this.authenticationService.getMaskedUserIdentifiers().subscribe(
      (response) => {
        this.maskedUserIdentifiers = response.data;
        this.createViewModel(this.maskedUserIdentifiers);
      },
      (error) => {
        console.error(`error getting masked user identifiers: ${error.status}`);
        this.activeError = error.status;
      }
    );

  }

  /**
   * create view model from data model
   */
  public createViewModel(identifiers: MaskedUserIdentifiers): void {

    this.viewModel = new OtpDeliveryChannelsViewModel();

    try {
      // map default otp delivery channel
      this.viewModel.preferredChannel = OtpDeliveryChannelsViewModel.getPreferredOtpDeliveryChannel(identifiers);

    } catch (e) {
      console.log('Error: ', e.message);
      if (e instanceof ExpectationFailedError) {
        this.activeError = (!!e.code) ? Number.parseInt(e.code, 10) : 404;
      }
    }

    // map alternate delivery channel
    this.viewModel.altChannels = OtpDeliveryChannelsViewModel.getAlternateOtpDeliveryChannels(identifiers);
  }


  /**
   * Process 'otpDeliveryChannelForm' form submission
   */
  onSubmit(): void {
    // update our selected channel object with the preferred attribute
    this.viewModel.altChannels.forEach(item => {
      if (this.viewModel.preferredChannel.type === item.type) {
        item.preferred = true;
      }
    });

    // Use the already preferred channel if the user has not selected an alternate, or if the alternate selected
    // is the the same as the preferred (because all channels are listed in the list)
    if (this.viewModel.selectedChannel) {
      // use user selected
      this.requestSendAuthenticationOtp(this.viewModel.selectedChannel);
    } else {
      // use preferred
      this.requestSendAuthenticationOtp(this.viewModel.preferredChannel);
    }
  }

  /**
   * generate send authenticate OTP request to backend.
   *
   */
  public requestSendAuthenticationOtp(otpDeliveryChannel: OtpDeliveryChannel) {

    this.authenticationService.sendAuthenticationOtp({
      body: {
        maskIdentifierKey: otpDeliveryChannel.key,
        deliveryMode: otpDeliveryChannel.type
      }
    }).subscribe(
      next => {
        const queryParamsList = {
          mfaOrigin: 'untrustedDevice',
          otpChannel: otpDeliveryChannel.type,
          key: otpDeliveryChannel.key,
        };

        if (!otpDeliveryChannel.preferred) {
          queryParamsList['mfaAltChannel'] = true;
        }

        this.router.navigate([this.routeToAuthenticateWithOtp],
          {queryParams: queryParamsList});
      },
      error => {
        this.activeError = error.status;
        console.log('request send OTP error: ', error.status);
      }
    );
  }


}

import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute, Router} from '@angular/router';
// Components and Models
import {environment} from '@environment';
// Third-Party
import {IResponse} from 'cloudentityjs/dist/typings/core/Request';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {forkJoin, of, Subscription} from 'rxjs';
import {catchError, concatMap, map} from 'rxjs/operators';
import {AuthenticationService} from 'sfg-ng-brand-library';
import {ForcedDataCollectionService} from '../forced-data-collection/forced-data-collection.service';
import {ContentType, RequestState} from '../shared/constants/managed-content.constants';
import {GlobalConstants} from '../shared/global-constants';
import {DialogContent} from '../shared/models/dialog-content.model';
import {CloudACP, LoginContent} from '../shared/models/login-content.model';
import {CmSection} from '../shared/models/managed-content.models';
import {Notification} from '../shared/models/notification.model';
// Services
import {AnalyticsService} from '../shared/services/analytics.service';
import {DrupalContentService} from '../shared/services/drupal-content.service';
import {ManagedContentService} from '../shared/services/managed-content.service';
import {RxJsHelper} from '../shared/utils/RxJsHelper';


@Component({
  selector: 'lgn-login-screen',
  templateUrl: './login-screen.component.html',
  styleUrls: ['./login-screen.component.scss']
})
export class LoginScreenComponent implements OnInit, OnDestroy {

  @ViewChild('identityProtectionNavModal') public identityProtectionNavModal: ModalDirective;
  @ViewChild('termsAndConsentNavModal') public termsAndConsentNavModal: ModalDirective;
  @ViewChild('loginForm') public loginForm: NgForm;

  public isShowPassword: boolean = false;
  // Query Param Variables
  public passwordReset: string;
  public passwordResetLogout: string;
  public loggedout: string;
  public sessionValid: boolean;
  public accountActivated: boolean;
  public gotoUrl: string;
  public activationExpired: boolean;
  public userActivationCode: string;

  public userRegistrationUrl: string;
  public loginContentEndpoint: string = environment.drupalLoginEndpoint;
  public userRegistrationLinkReady: boolean = false;
  public userName: string;
  public userPw: string;
  public notEnteredUsername = false;
  public notEnteredPassword = false;
  public focusUsername = false;
  public focusPassword = false;
  private notificationEndpoint: string = environment.drupalNotificationEndpoint;
  private totalOutageEndpoint: string = environment.drupalOutageEndpoint;
  public outageContent: Notification;
  public notificationContent: Notification;
  public modalContent: DialogContent;
  public currentUrl: string;
  public errorMessage: string;
  public errorMessageTermsAndConsent: string;
  public protectYourIdentityError: boolean = false;
  public termsAndConsentError: boolean = false;
  public needsTermsAndConsent: boolean = false;
  public isInactive: boolean = false;
  public identitySecurityUrl: string = environment.identitySecurityUrl;
  public urlTermsAndConsent: string = environment.termsAndConsentUrl;
  public urlTermsAndConsentDefaultContent: string = environment.termsAndConsentEndpointDefaultContent;
  public agreeToTerms: boolean = false;
  public customerSupportUrl: string = environment.customerSupportUrl;
  public cancelButtonUrl: string = environment.loginCancelUrl;
  public submitDisabled: boolean = false;
  public myHomeUrl: string = environment.myHomeUrl;
  public navigateVariable: string;

  public isAuthenticated: boolean = false;
  public isForcedDataCollectionPolicyMet: boolean = false;
  public isLoading: boolean = false;
  public isTotalOutage: boolean = false;

  public userSelfRegistrationCompleted: string;

  public subscriptions: Subscription;
  public readonly REQUEST_STATE = RequestState;
  public manageContentState: RequestState = RequestState.PRISTINE;
  public openingCmContent: CmSection;
  public closingCmContent: CmSection;
  public readonly CM_OPENING_CONTENT_ID = 'lgn-login-opening-content';
  public readonly CM_CLOSING_CONTENT_ID = 'lgn-login-closing-content';

  /* Error messages specific to the login page */
  public errorMessages = {
    400: 'Something went wrong. The server did not understand this request. If you continue to ' +
        'experience this problem, please <a href="' + this.customerSupportUrl + '">contact us</a> for help',
    401: 'We\'re sorry. We couldn\'t find an account with that user name and password. Please try again or ' +
        '<a href="/forgot-password">set a new password</a>.<br><br>Remember that your password has at least 10 ' +
        'characters and contains a mixture of upper case, lower case and numbers or special characters.',
    403: 'The page you\'re trying to access is not available to you.',
    404: 'We\'re sorry. We can\'t find that page. Please double check the web address or ' +
        '<a href="/">return to the login page</a> to access your account and secure services.',
    408: 'Something went wrong. The requested action has timed out. If you continue to experience this problem, ' +
        'please <a href="' + this.customerSupportUrl + '">contact us</a> for help.',
    422: 'Something went wrong. The server could not process this request. If you continue to experience this ' +
        'problem, please <a href="' + this.customerSupportUrl + '">contact us</a> for help.',
    423: 'You\'ve exceeded the number of attempts to provide a valid password. For security, we temporarily locked ' +
        'your account. Please try again later or <a href="' + this.customerSupportUrl + '">contact us</a> for further assistance.',
    500: 'Something went wrong. There was an internal server error. If you continue to experience this problem, ' +
        'please <a href="' + this.customerSupportUrl + '">contact us</a> for help.',
    502: 'Something went wrong. There was an internal server error. If you continue to experience this problem, ' +
        'please <a href="' + this.customerSupportUrl + '">contact us</a> for help.',
    needsToActivate: 'Your account has not been activated. Check your email for the activation link. If it\'s not ' +
        'there, please <a href="' + this.customerSupportUrl + '">contact us</a> for help.'
  };
  public sessionExpiredMsg: string = 'Your session has expired. Please log in again to access your account.';

  constructor(public router: Router,
              public route: ActivatedRoute,
              private titleService: Title,
              public drupalContentService: DrupalContentService,
              private cmService: ManagedContentService,
              public authenticationService: AuthenticationService,
              public forcedDataCollectionService: ForcedDataCollectionService
  ) { }

  public pressEnterCallLogin(): void {
    if (this.loginForm.untouched) {
      this.login();
    }
  }

  ngOnInit() {
    this.titleService.setTitle('Log In | The Standard');
    this.isLoading = true;

    this.getUrlParams();

    this.subscriptions = this.cmService.contentHttpGetStatus().subscribe(
        contentState => this.updateStateAndManagedContent(contentState)
    );

    /**
     * 1. get outage notice
     * 2. check if user is authenticated, and if so
     *    -> 2.1. enforce FORCED DATA COLLECTION policy
     */
    forkJoin([

      // 1a. Get outage notifications
      this.drupalContentService.getContent(this.totalOutageEndpoint).pipe(
          map(data => {
            this.outageContent = data[0] as Notification;
            this.isTotalOutage = (this.outageContent !== undefined);
          }),
          catchError( (error: any) => {
            console.log('Unable to retrieve outage content', error);
            return of({});
          })
      ),

      // 1b. Get other notifications
      this.drupalContentService.getContent(this.notificationEndpoint).pipe(
          map(data => {
            this.notificationContent = data[0] as Notification;
          }),
          catchError( (error: any) => {
            console.error('Unable to retrieve notification content', error);
            return of({});
          })
      ),

      // 1.c Get login managed content
      this.drupalContentService.getContent(this.loginContentEndpoint).pipe(
          map(data => {
            const loginContent = data[0] as LoginContent;
            this.userRegistrationUrl = loginContent.userRegistrationUrl;
            this.userRegistrationLinkReady = true;
          }),
          catchError( error => {
            console.warn('Unable to retrieve login content', error);
            this.userRegistrationUrl = '';
            this.userRegistrationLinkReady = true;
            return of({});
          })
      ),

      // 2. check isAuthenticated and validate policy

      this.authenticationService.checkIfAuthenticated().pipe(
          concatMap( (response: IResponse) => {
            this.isAuthenticated = true;
            return this.authenticationService.validateAuthzPolicy(GlobalConstants.MASTER_CONTROL_POLICY)
                .pipe(
                    map( () => {
                      // Forced Data Collection policy met;
                      this.isForcedDataCollectionPolicyMet = true;
                    }),
                    catchError( (error: IResponse) => {
                      // USER_PROFILE_COMPLETE policy validation failed
                      this.navigateVariable = this.forcedDataCollectionService.setStepIndicatorReturnNavigation(error);
                      return of({});
                    })
                );
          }),
          catchError( (error: IResponse) => {
            // User not authenticated
            return of({});
          })
      )

    ]).subscribe(
        () => {
          /**
           *  use cases:
           *  1. total outage - display total outage modal, no login form or redirect to my-home
           *  2. user not athenticated - display login form
           *  3. user is authenticated && policy met -> redirect to my-home
           *  4. user is authenticated && policy not met -> forced data collection
           */
          if (this.isTotalOutage) {
            this.isLoading = false;
          } else if (this.isAuthenticated && this.isForcedDataCollectionPolicyMet) {
            this.isLoading = true;
            this.gotoRedirectCheck();  // Checks if the goto param exists and is white-listed
          } else if (this.isAuthenticated && !this.isForcedDataCollectionPolicyMet) {
            this.router.navigate([this.navigateVariable], {queryParams: {step: 1, goto: this.gotoUrl}});
          } else {
            /* No special cases to take care of -- load screen as normal */
            this.isLoading = false;
          }

        });
  } // complete ngOnInit()

  ngOnDestroy(): void {
    RxJsHelper.unSubscribeSafely(this.subscriptions);
  }

  /**
   * Validates the goto param and redirects the page if valid url
   */
  public gotoRedirectCheck() {
    // Goto Url Validation section is used for deep links within the application
    if (this.gotoUrl) {
      this.authenticationService.checkUriPolicy(this.gotoUrl)
          .subscribe(
              data => {
                this.navigateTo(this.gotoUrl);
              },
              error => {
                this.logError(error);
                // This is the default home page to redirect to
                this.navigateTo(this.myHomeUrl);
              }
          );
    } else {
      const cloudAcp: CloudACP = new CloudACP();
      this.route.queryParams.subscribe(params => {
        cloudAcp.loginId = params['login_id'];
        cloudAcp.idpClientId = params['idp_client_id'];
        cloudAcp.loginState  = params['login_state'];
      });
      // cloud entity acp work
      if (cloudAcp.idpClientId && cloudAcp.loginState) {
        this.drupalContentService.getAcpCall(cloudAcp).subscribe((response) => {
          this.navigateTo(response['redirectTo']);
        }, (error) => {
          console.error('Unable to redirect to ACP ', error);
          this.navigateTo(this.myHomeUrl);
        });
      } else {
        this.navigateTo(this.myHomeUrl);
      }
    }
  }

  /**
   * This function is for grouping all parameter variable assignments
   */
  public getUrlParams(): void {
    /* Password reset is a query parameter that will be seen if the user
    routed to the login page from the PasswordChangedNotificationComponent
     */
    this.passwordReset = this.route.snapshot.queryParams['passwordreset'];

    /* Logged Out is a query parameter that will be seen if the user
    routed to the login application through a logout from an authenticated
    application.
      */
    this.loggedout = this.route.snapshot.queryParams['logout'];

    /* Query parameter that appears when the user session is expired. It is used to
    toggle a message to the user. */
    this.sessionValid = this.route.snapshot.queryParams['sessionValid'];

    this.gotoUrl = this.route.snapshot.queryParams['goto'];

    /* Query parameter that appears when a user gets to the login page after the first time
    registering an account
     */
    this.accountActivated = this.route.snapshot.queryParams['accountactivated'];

    /* Query Parameter for the User Registration Self Service */
    this.userSelfRegistrationCompleted = this.route.snapshot.queryParams['userSelfRegistrationCompleted'];

    /* This query parmeter is set if the user goes through a forced password reset scenario. That scenario forces the user
    to a logged out state, after which they must reauthenticate.
     */
    this.passwordResetLogout = this.route.snapshot.queryParams['passwordresetlogout'];

    // Get the activation expired query param
    this.activationExpired = this.route.snapshot.queryParams['activationExpired'];
    this.userActivationCode = this.route.snapshot.queryParams['code']; // Code from email link
  }

  /**
   * Toggles the password control show/hide password feature
   */
  public showPassword() {
    const passwordInput = document.getElementById('lgn-password-input');
    if (this.isShowPassword) {
      this.isShowPassword = !this.isShowPassword;
      passwordInput.setAttribute('type', 'password');
    } else {
      this.isShowPassword = !this.isShowPassword;
      passwordInput.setAttribute('type', 'text');
    }
  }

  /**
   * Toggles the password control password view when the show/hide control
   * has focus and the Enter or space buttons are pressed. All other key
   * presses are ignored.
   */
  public showPasswordKeyPress() {
    this.showPassword();
  }

  /**
   *  This function uses the authentication service to login through OrchIS.
   */
  public login() {
    this.passwordReset = '';

    if (!this.userName) {
      this.notEnteredUsername = true;
    }

    if (!this.userPw) {
      this.notEnteredPassword = true;
    }

    if (this.userName && this.userPw) {
      this.submitDisabled =  true;

      this.authenticationService.login(this.userName, this.userPw)
          .subscribe(
              () => {
                /* Hide reset password message on login */
                this.passwordReset = undefined;
                this.authenticationService.validateAuthzPolicy(GlobalConstants.MASTER_CONTROL_POLICY)
                    .subscribe(
                        () => {
                          /* No Data Collection/ForcedPassword/MFA Setup Needed -- proceed to destination */
                          this.isLoading = true;
                          this.gotoRedirectCheck(); // Check for the goto param and redirect
                        },
                        (error: IResponse) => {
                          /* Either Forced Data Collection, Password Reset, or MFA setup is needed */
                          this.navigateVariable = this.forcedDataCollectionService
                              .setStepIndicatorReturnNavigation(error);
                          this.router.navigate([ this.navigateVariable ],
                              { queryParams: { step: 1, goto: this.gotoUrl } });
                        }
                    );
              },
              error => {
                // determine if details is in the object
                if (error.hasOwnProperty('data')) {
                  if (error.data.hasOwnProperty('details') && error.data.details !== null) {
                    const recovery = error.data.details.recovery;

                    // determine if recovery is in the object
                    if (Array.isArray(recovery) && recovery.length) {
                      this.needsTermsAndConsent = recovery.findIndex(
                          item => item['id'] === 'User.EulaNotAccepted'
                      ) > -1;
                      this.isInactive = recovery.findIndex(
                          item => item['id'] === 'User.Inactive'
                      ) > -1;
                    }
                  }
                }

                if (this.needsTermsAndConsent && !this.isInactive) {
                  this.showModal('termsAndConsent');
                } else {
                  this.submitDisabled = false;
                  this.authenticationService.authErrorHandler(
                      error,
                      this.authenticationService.recoveryHandler,
                      this.authenticationService.errorHandler
                  );
                }

              });
    }
  }

  public checkIfValidUsername() {
    if (!this.userName) {
      this.notEnteredUsername = true;
    }
  }

  public externalLinkClick(url: string): void {
    AnalyticsService.sendPageHit(url);
    /* Using following line is to open a tab for the Dental and Vision Link on the Login Page */
    window.open(url, '_blank');
  }

  /**
   * This function is to show the modal window
   */
  public showModal(type: string): void {
    if (type === 'termsAndConsent') {
      if (this.currentUrl !== this.urlTermsAndConsent) {
        this.getModalContent(this.urlTermsAndConsent, true);
        this.currentUrl = this.urlTermsAndConsent;
      }
      this.termsAndConsentNavModal.show();
    }
  }

  public getModalContent(url: string, makeDefaultCall: boolean = false): void {
    this.drupalContentService.getContent(url)
        .subscribe(
            data => {
              if (url === this.urlTermsAndConsent) {
                this.termsAndConsentError = false;
              }
              if (url === this.identitySecurityUrl) {
                this.protectYourIdentityError = false;
              }
              this.termsAndConsentError = false;
              this.modalContent = data[0] as DialogContent;
            },
            error => {
              if (url === this.urlTermsAndConsent) {
                this.termsAndConsentError = true;
              }
              if (url === this.identitySecurityUrl) {
                this.protectYourIdentityError = true;
              }
              this.errorMessage = 'Error Getting Content';
              console.log(this.errorMessage);
              if (makeDefaultCall) {
                return this.getModalContent(this.urlTermsAndConsentDefaultContent, false);
              }
            }
        );
  }

  public customerSupport(): void {
    window.location.href = this.customerSupportUrl;
  }

  /**
   * This function is intended for logging all errors
   */
  public logError(error: string): void {
    console.log(error);
  }

  /**
   * Here for the sake of sanity and ease of testing.
   */
  public navigateTo(toUrl: string) {
    window.location.href = toUrl;
  }

  /**
   * This function is to set EULA settings
   */
  public setEulaAndNavigate() {
    if (this.agreeToTerms === true) {
      // Update the terms and condition flag when accepted by user.
      this.authenticationService.acceptEula().subscribe(
          () => {
            this.termsAndConsentNavModal.hide();
            this.login();
          },
          (error) => {
            console.log('Error Accepting Eula: ', error);
          }
      );
    } else {
      this.errorMessageTermsAndConsent = 'You must agree to the Terms and Consent to continue.';
    }
  }

  public goToUserRegistration(): void {
    if (this.userRegistrationUrl === '') {
      this.router.navigate(['register']);
    } else {
      this.navigateTo(this.userRegistrationUrl);
    }
  }

  private updateStateAndManagedContent(contentState: RequestState) {
    this.manageContentState = contentState;

    if (this.manageContentState === RequestState.SUCCESS) {
      this.openingCmContent = this.cmService.getContentById(ContentType.SECTION, this.CM_OPENING_CONTENT_ID);
      this.closingCmContent = this.cmService.getContentById(ContentType.SECTION, this.CM_CLOSING_CONTENT_ID);
    }
  }
}

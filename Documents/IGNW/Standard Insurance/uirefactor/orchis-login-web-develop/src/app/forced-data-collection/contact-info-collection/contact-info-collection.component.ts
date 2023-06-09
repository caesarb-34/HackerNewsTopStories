/*
  This file controls updating email address and phone number in the forced data collection workflow.
  The rules are specified here:

  EMAIL ADDRESS RULES:
  --------------------
    1) on page load:
        * If there is only an unverified email address returned from getUser(), display that
          in the email field on the form
        * If there is only a verified email address, display that
        * If both are returned by getUser() then display the unverified email address on the form

    2) on form submit:
        * If the displayed email address is unverified and the user changes it, REPLACE the previous unverified address
          (so account has only one unverified after save)
        * If the displayed email address is verified and the user changes it, add new unverified (do not remove the
          existing verified address)

  PHONE NUMBER RULES:
  -------------------
    Phone will be implemented similar to email, only there are slight differences to handle phone number type:

    Phone number is displayed as a single text field and a radio button indicating mobile or landline:
    1) on page load:
        * If there is only an unverified mobile or landline phone number returned from getUser(), display that in the
          phone number field and set radio button indicating type
        * If there is only a verified mobile or landline phone number, display that in the phone number field and set
          radio button indicating type
        * If both verified and unverified are returned by getUser() then display the unverified phone number and set
          radio button indicating type
    2) on form submit:
        * If the displayed phone number is unverified and the user changes the number and/or type, REPLACE the
          previous unverified phone number and/or type, regardless of type, and save the new phone number value
          and phone type entered into the form (so account has only one unverified number of any type after save)
        * If the displayed phone number is verified and the user changes the number and/or type, add new unverified
          number and type (do not remove the existing verified phone number)
 */

import {Component, OnInit, ViewChild} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { NgForm } from '@angular/forms';

import { IResponse } from 'cloudentityjs/dist/typings/core/Request';
import {Observable} from 'rxjs';
import {APP_ROUTES} from '../../shared/constants/router.constants';

import { Step } from '../../shared/models/step.model';
import { StepIndicatorService } from '../../shared/services/step-indicator.service';
import { AuthenticationService } from 'sfg-ng-brand-library';

import { environment } from '@environment';
import User from '../../shared/models/user.model';
import UserInfoViewModel from '../../shared/models/user-info.view.model';
import {GlobalConstants} from '../../shared/global-constants';


@Component({
  selector: 'lgn-contact-info-collection',
  templateUrl: './contact-info-collection.component.html',
  styleUrls: ['./contact-info-collection.component.scss']
})
export class ContactInfoCollectionComponent implements OnInit {
  @ViewChild('collectInfoForm') collectInfoForm: NgForm;

  public SFG_EMPLOYEE_CODE: string = 'SFGEmployee';
  public contactInfo: UserInfoViewModel = new UserInfoViewModel();
  public origContactInfo: UserInfoViewModel;

  public userData: any;
  public h1Title: string;
  public selectedStep: number;
  public steps: Array<Step>;
  public retrievedPhoneNumber: string = '';

  // public Submitted: boolean = false;
  public userAttemptedToSubmit: boolean = false;
  public focusPrimaryPhone: boolean = false;
  public focusEmail: boolean = false;

  public editEmailDisplay: boolean = false;
  public editPhoneDisplay: boolean = false;
  public isSFGEmployee: boolean = false;

  public errorMessage: string;
  public customerSupportUrl: string = environment.customerSupportUrl;
  public activeError: string = '';

  public mask: any[] = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];

  /* Error messages - From the Login page */
  public errorMessages = {
    400: 'Something went wrong. The server did not understand this request. If you continue to ' +
    'experience this problem, please <a href="' + this.customerSupportUrl + '">contact us</a> for help',
    401: 'You must <a href="/login">Log in</a> with a valid user name and password to see this page. ',
    403: 'The page you\'re trying to access is not available to you.',
    404: 'We\'re sorry. We can\'t find that page. Please double check the web address or ' +
    '<a href="/">return to the login page</a> to access your account and secure services.',
    409: 'Something went wrong. The server could not process this request. If you continue to ' +
    'experience this problem, please <a href="' + this.customerSupportUrl + '">contact us</a> for help',
    422: 'Something went wrong. The server could not process this request. If you continue to ' +
    'experience this problem, please <a href="' + this.customerSupportUrl + '">contact us</a> for help'
  };

  constructor(
    private stepIndicatorService: StepIndicatorService,
    private router: Router,
    private route: ActivatedRoute,
    public authenticationService: AuthenticationService,
    private titleService: Title
  ) { }

  ngOnInit() {
    // set the page title
    this.titleService.setTitle('Contact Information | The Standard');

    // Setup service so that information can be passed to the rest of the step indicator chain
    this.stepIndicatorService.setH1Title('Don\'t get locked out.');

    // check to see if stepIndicatorService is populated with info, if not then route to login page
    if (this.stepIndicatorService.getSteps().length === 0) {
      this.router.navigate(['/login']);
    } else {
      this.h1Title = this.stepIndicatorService.getH1Title();
      this.selectedStep = this.route.snapshot.queryParams['step'];
      this.steps = this.stepIndicatorService.getSteps();
    }

    this.validateSession();
    this.getUserData();
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

  /**
   * Gets the user data and calls the data model to view model assignment function
   */
  public getUserData(): void {
    this.authenticationService.getUser().subscribe(
      (userData: IResponse) => {
        this.userData = userData.data;
        this.assignUserDataForContactInfo(this.userData);
      },
      (error: IResponse) => {
        /* if no data is returned from the getUser() request for any reason,
         * leave the contactInfo object empty and then provide the email edit field
         * for adding the information */
        this.editEmailDisplay = true;
      }
    );
  }

  /**
   * Assigns the values of the view model from the data model
   * @param userData
   */
  public assignUserDataForContactInfo(userData): void {
    let retrievedEmail: string;

    // Check if the user is an SFG Employee
    this.isSFGEmployee = (userData.customer === this.SFG_EMPLOYEE_CODE);

    // If there is only an unverified email, display that in the form
    // if there is only a verified email, display that in the form
    // if there is both, display the unverified

    if (this.isArrayDefined(userData.unverifiedEmails)) {
      // if the user has an unverified email, grab it
      retrievedEmail = userData.unverifiedEmails[userData.unverifiedEmails.length - 1];
      this.contactInfo.isEmailVerified = false;

    } else if (this.isArrayDefined(userData.verifiedEmails)) {
      // if they only have a verified, use that one
      if (userData.defaultEmail) {
        retrievedEmail = userData.defaultEmail;
      } else {
        retrievedEmail = userData.verifiedEmails[userData.verifiedEmails.length - 1];
      }
      this.contactInfo.isEmailVerified = true;

    } else {
      retrievedEmail = '';
      // if there is no email to grab, then provide the edit field to add it
      this.editEmailDisplay = true;
    }

    this.contactInfo.email = retrievedEmail;

    /* Following the logic above, if they have an unverified mobile, we want to display that first
    If they have both a verified and unverified, we want to display the verified
    If they only have verified, we display that

    There should never be a case where they have both a mobile and landline,
    but to cover the edge case we give preference to mobile */
    const userVerifiedMobiles = userData.verifiedMobiles;
    const userVerifiedLandlines = userData.verifiedPhones;
    const userUnverifiedMobiles = userData.unverifiedMobiles;
    const userUnverifiedLandlines = userData.unverifiedPhones;
    const userUnknownNumber = userData.unknownPhone;

    if (this.isArrayDefined(userUnverifiedMobiles)) {
      this.retrievedPhoneNumber = userUnverifiedMobiles[userUnverifiedMobiles.length - 1];
      this.contactInfo.isMobile = true;
    } else if (this.isArrayDefined(userVerifiedMobiles)) {
      this.retrievedPhoneNumber = userVerifiedMobiles[userVerifiedMobiles.length - 1];
      this.contactInfo.isMobile = true;
    } else if (this.isArrayDefined(userUnverifiedLandlines)) {
      this.retrievedPhoneNumber = userUnverifiedLandlines[userUnverifiedLandlines.length - 1];
      this.contactInfo.isMobile = false;
    } else if (this.isArrayDefined(userVerifiedLandlines)) {
      this.retrievedPhoneNumber = userVerifiedLandlines[userVerifiedLandlines.length - 1];
      this.contactInfo.isMobile = false;
    } else {
      this.retrievedPhoneNumber = userUnknownNumber;
    }

    // Only call formatPhoneNumber if there is something in retrievedPhoneNumber to format
    if (this.retrievedPhoneNumber) {
      this.contactInfo.phone = this.formatPhoneNumber(this.retrievedPhoneNumber);

      // Workaround for the edge case where somebody had a badly formatted phone that was
      // synced over from Portal LDAP.
      if (!this.contactInfo.phone.match(GlobalConstants.PHONE_REGEX)) {
        this.editPhoneDisplay = true;
      }

    } else {
      this.contactInfo.phone = '';
      this.editPhoneDisplay = true;
    }

    this.origContactInfo = UserInfoViewModel.clone(this.contactInfo); // Copy the data
  }

  /**
   * Formats the phone number
   * @param {string} val
   * @returns {string}
   */
  public formatPhoneNumber(val: string): string {
    // Default value is the one passed in
    // This will be returned if the number of digits are not 10 or 7
    let result = val ? val : '';

    // Match the value digits, convert to string, then remove all commas and periods
    const matched = val.match(/[1-9]+\d*/g);

    if (matched !== null) {
      const strMatched = matched.toString();
      if (strMatched) {
        const matchedVal = strMatched.replace(/[,\.]/g, '');

        if (matchedVal.length === 10 || matchedVal.length === 7) {
          // Format the number to US locale
          const pattern = (matchedVal.length === 10) ? '($1) $2-$3' : '$1-$2';
          const regex = (matchedVal.length === 10) ? /^(\d{3})(\d{3})(\d{4})$/ : /^(\d{3})(\d{4})$/;

          result = matchedVal.replace(regex, pattern);
        }
      }
    }

    return result;
  }

  /**
   * Click event for the email edit button
   */
  public onClickEditEmailDisplay(): void {
    this.editEmailDisplay = !this.editEmailDisplay;
  }

  /**
   * Click event for the Phone edit button
   */
  public onClickEditPhoneDisplay(): void {
    this.editPhoneDisplay = !this.editPhoneDisplay;
  }

  /**
   * If email address returned from getUser call is not null,
   * is verified and user changes the email address in the form
   *
   * Then we need to add the new email as unverified, and remove the outdated
   * email.
   */
  public userUpdateContactInfo(): Observable<IResponse[]> {
    // Remove mask from primary and mobile phone
    this.contactInfo.phone = this.contactInfo.phone.replace(/[^\w]/gi, '');

    this.userData.isEmailVerified = this.isThisEmailVerified(this.contactInfo.email);
    const isEmailInVerifiedList = this.userData.isEmailVerified;
    const isEmailInUnVerifiedList = this.isEmailInUnverifiedList(this.contactInfo.email);
    const updatedUser = new User();
    const userToReturn = {
      user: updatedUser
    };

    // Only allow non-SFG Employees to change their emails
    if (!this.isSFGEmployee) {
      // Check if the email is verified
      if (isEmailInVerifiedList) {
        // Set the verified email as default because email is already verified
        userToReturn.user.defaultEmail = this.contactInfo.email;
        userToReturn.user.unverifiedEmails = [];
      } else {
        // Add unverified email to unverified array
        userToReturn.user.unverifiedEmails = [this.contactInfo.email];
      }
    }
    if (this.isSFGEmployee && isEmailInUnVerifiedList) {
      /* If an SFG Employee (designated by User.customer attribute from OrchIS)
      has an unverified email, we need to go out of band to make a specific call
      to verify it -- they cannot change their email so the normal updateUserAndGenerateVerification()
      call would fail.
       */
      this.authenticationService.verifyEmail(this.contactInfo.email).subscribe(
        () => {},
        (error) => {
          this.activeError = error.status;
        }
      );
    }

    // Check on the phone number changes
    if (this.isThisPhoneVerified(this.contactInfo.phone)) {
      userToReturn.user.defaultMobile = this.contactInfo.phone;
    } else if (this.contactInfo.isMobile) {
      userToReturn.user.unverifiedMobiles = [this.contactInfo.phone];
      userToReturn.user.unverifiedPhones = [];
    } else {
      userToReturn.user.unverifiedPhones = [this.contactInfo.phone];
      userToReturn.user.unverifiedMobiles = [];
    }

    return this.authenticationService.updateAndGenerateVerification(userToReturn);
  }

  /**
   * Form submit function
   * Check to make sure mobile or phone boolean is selected (radio button)
   * check to make sure the form is valid.
   * If isMobile is undefined or the form is invalid it will make userAttemptedToSubmit true
   * If isMobile has a value and the form is valid, userAttemptedToSubmit will be false
   * setting userAttemptedToSubmit to true will display all the errors on the form and prevent submission
   */
  onSubmit(formValid: boolean = false) {
    this.userAttemptedToSubmit = (this.contactInfo.isMobile === undefined || !formValid);

    // update contactInfo
    // this.contactInfo.isMobile = (this.contactInfo.isMobile === true);
    if (this.contactInfo.email && this.contactInfo.phone && !this.userAttemptedToSubmit && formValid) {
      this.contactInfo.email = this.contactInfo.email.trim();
      this.userUpdateContactInfo().subscribe(
        () => {
          if (this.isThisEmailVerified(this.contactInfo.email) && this.isEmailInUnverifiedList(this.contactInfo.email)) {
            /* This covers an edge case if the user's email is both verified and unverified -- we need to tell them
            to verify the email.
             */
            this.steps[this.selectedStep].route = `/${APP_ROUTES.DATA_COLLECTION}/${APP_ROUTES.DATA_COLLECTION_EMAIL}`;
            this.router.navigate(
              [this.steps[this.selectedStep].route],
              {queryParams: {step: + this.selectedStep + 1 }}
            );
          } else if (this.isThisEmailVerified(this.contactInfo.email)) {
            /* If the user is pushing up an email that is already verified,
               they shouldn't route to the page that tells them to check and
               verify a new email. It will route them to the "Thanks, your info
               is updated go to My Home" page.
             */
            this.router.navigate([`/${APP_ROUTES.DATA_COLLECTION}/${APP_ROUTES.EMAIL_VERIFICATION}`]);
          } else {
            this.steps[this.selectedStep].route = `/${APP_ROUTES.DATA_COLLECTION}/${APP_ROUTES.DATA_COLLECTION_EMAIL}`;
            this.router.navigate(
              [this.steps[this.selectedStep].route],
              {queryParams: {step: + this.selectedStep + 1 }}
            );
          }
        },
        error => {
          this.activeError =  error.status;
        }
      );
    }

    this.userAttemptedToSubmit = true;
  }

  /**
   * Checks to see if the given email is verified
   * This is for controlling the visibility of the verified icon in the email input
   * @param selectedEmail
   * @returns {boolean} true when verified email, false when not verified and Undefined when email arrays don't exist
   */
  public isThisEmailVerified(selectedEmail): boolean {
    let result;
    let resultVerified: boolean = false;
    let resultUnverified: boolean = false;
    let verifiedEmails = [];
    let unverifiedEmails = [];

    if (this.isArrayDefined(this.userData.verifiedEmails)) {
      verifiedEmails = this.userData.verifiedEmails.map((email) => {
        return email.toLowerCase();
      });
    }
    if (this.isArrayDefined(this.userData.unverifiedEmails)) {
      unverifiedEmails = this.userData.unverifiedEmails.map((email) => {
        return email.toLowerCase();
      });
    }

    if (selectedEmail) {
      if (this.isArrayDefined(this.userData.verifiedEmails)) {
        resultVerified = verifiedEmails.includes(selectedEmail.toLowerCase());
      }

      if (this.isArrayDefined(this.userData.unverifiedEmails)) {
        resultUnverified = unverifiedEmails.includes(selectedEmail.toLowerCase());
      }

      // If the email is in the verified or not verified arrays, then return the value of resultVerified
      // otherwise return undefined
      result = (resultVerified || resultUnverified) ? resultVerified : undefined;
    } else {
      result = false;
    }

    return result;
  }

  /**
   * Checks to see if the given phone is verified
   * @param selectedPhone
   * @returns {boolean} true when verified phone, false when not verified
   */
  public isThisPhoneVerified(selectedPhone): boolean {
    let resultMobileVerified: boolean = false;
    let resultPhoneVerified: boolean = false;

    if (this.isArrayDefined(this.userData.verifiedMobiles)) {
      resultMobileVerified = this.userData.verifiedMobiles.includes(selectedPhone);
    }
    if (this.isArrayDefined(this.userData.verifiedPhones)) {
      resultPhoneVerified = this.userData.verifiedPhones.includes(selectedPhone);
    }

    return (resultMobileVerified || resultPhoneVerified);
  }


  /**
   * Checks if the given email is in the user unverifiedEmails list
   * @param {string} email
   * @returns {boolean}
   */
  public isEmailInUnverifiedList(email: string): boolean {
    let result: boolean = false;
    let unverifiedEmails = [];

    if (this.isArrayDefined(this.userData.unverifiedEmails)) {
      unverifiedEmails = this.userData.unverifiedEmails.map((val) => {
        return val.toLowerCase();
      });
      result = unverifiedEmails.includes(email.toLowerCase());
    }

    return result;
  }

  /**
   * Helper function to check if array exists
   * @param {Array<any>} array
   * @returns {boolean}
   */
  public isArrayDefined(array: Array<any>): boolean {
    return (Array.isArray(array) && array.length > 0);
  }
}

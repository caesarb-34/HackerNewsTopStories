import { Injectable } from '@angular/core';
import {APP_ROUTES} from '../shared/constants/router.constants';

import { StepIndicatorService } from '../shared/services/step-indicator.service';


@Injectable()
export class ForcedDataCollectionService {

  readonly DATA_COL_PREFIX = APP_ROUTES.DATA_COLLECTION;
  readonly MFA_PREFIX = APP_ROUTES.MFA;

  private needsPasswordReset: boolean = true;
  private needsContactInfoResetEmail: boolean = true;
  private needsContactInfoResetPhone: boolean = true;
  private needsOtpSetup: boolean = true;
  private needsOtpAuthentication: boolean = true;

  private navigationRoute: string;
  private stepIndex: number = 1;
  private numberOfCollections: number;

  private STEP_PASSWORD = {
    index: 1,
    label: 'Reset your password',
    route: `/${this.DATA_COL_PREFIX}/${APP_ROUTES.PASSWORD_EXPIRED}`
  };

  private STEP_PASSWORD_CONFIRMATION = {
    index: 1,
    label: 'Continue to Password Confirmation',
    route: `/${this.DATA_COL_PREFIX}/${APP_ROUTES.PASSWORD_CONFIRMATION}`
  };

  private STEP_DATA = {
    index: 1,
    label: 'Update Contact Information',
    route: `/${this.DATA_COL_PREFIX}/${APP_ROUTES.COLLECT_CONTACT_INFO}`
  };

  private STEP_DATA_PHONE_ONLY = {
    index: 1,
    label: 'Profile Update',
    route: `/${this.DATA_COL_PREFIX}/${APP_ROUTES.EMAIL_VERIFICATION}`
  };

  private STEP_DATA_EMAIL_CHANGE = {
    index: 1,
    label: 'Check Email',
    route: `/${this.DATA_COL_PREFIX}/${APP_ROUTES.DATA_COLLECTION_EMAIL}`
  };

  private STEPS_MFA_PREFERENCE = {
    index: 1,
    label: 'Mfa Preferences',
    route: `/${this.DATA_COL_PREFIX}/${APP_ROUTES.MFA_PREFERENCE}`
  };

  private STEPS_MFA_UNTRUSTED = {
    index: 1,
    label: 'Mfa Untrusted Device',
    route: `/${this.MFA_PREFIX}/${APP_ROUTES.UNTRUSTED_DEVICE}`
  };

  constructor(
    private stepIndicatorService: StepIndicatorService
  ) { }

  public setStepIndicatorReturnNavigation(validateAuthzPolicyErrorObject) {

    const neededSteps = validateAuthzPolicyErrorObject.data.details.recovery;
    const steps = [];

    this.numberOfCollections = 0;
    this.stepIndex = 1;

    this.needsPasswordReset = false;
    this.needsContactInfoResetEmail = false;
    this.needsContactInfoResetPhone = false;
    this.needsOtpSetup = false;
    this.needsOtpAuthentication = false;


    // cycles through the recovery array to see which errors are being returned
    this.needsPasswordReset = neededSteps.findIndex(
      item => item['id'] === 'User.passwordExpired'
    ) > -1;

    this.needsContactInfoResetEmail = neededSteps.findIndex(
      item => item['id'] === 'User.emailNotVerified'
    ) > -1;

    this.needsContactInfoResetPhone = neededSteps.findIndex(item => item['id'] === 'User.mobileNotVerified') > -1
      || neededSteps.findIndex(item => item['id'] === 'User.phoneNotVerified') > -1;

    this.needsOtpSetup = neededSteps.findIndex(
      item => item['id'] === 'OtpSetup'
    ) > -1;

    this.needsOtpAuthentication = neededSteps.findIndex(
      item => item['id'] === 'OtpAuthentication'
    ) > -1;

    // create the steps depending on the result of the recovery array search
    if (this.needsOtpAuthentication) {
      steps.push(this.STEPS_MFA_UNTRUSTED);
    }

    // Password page needed
    if (this.needsPasswordReset) {
      this.STEP_PASSWORD.index = this.stepIndex;
      steps.push(this.STEP_PASSWORD);
      this.numberOfCollections++;
      this.stepIndex++;
    }

    // If the Password page is the only page in the step array, add in the change confirmation page.
    // This page is not needed if going to a second forced data page.
    if (this.needsPasswordReset && !(this.needsContactInfoResetEmail || this.needsContactInfoResetPhone || this.needsOtpSetup)) {
      this.STEP_PASSWORD_CONFIRMATION.index = this.stepIndex;
      steps.push(this.STEP_PASSWORD_CONFIRMATION);
      this.stepIndex++;
    }

    // Data page needed
    if (this.needsContactInfoResetPhone || this.needsContactInfoResetEmail) {
      this.STEP_DATA.index = this.stepIndex;
      steps.push(this.STEP_DATA);
      this.numberOfCollections++;
      this.stepIndex++;
    }

    // If we expect the email to change
    // Else if we only expect the phone to change but not the email
    if (this.needsContactInfoResetEmail) {
      this.STEP_DATA_EMAIL_CHANGE.index = this.stepIndex;
      steps.push(this.STEP_DATA_EMAIL_CHANGE);
      this.stepIndex++;
    } else if (this.needsContactInfoResetPhone) {
      this.STEP_DATA_PHONE_ONLY.index = this.stepIndex;
      steps.push(this.STEP_DATA_PHONE_ONLY);
      this.stepIndex++;
    }

    // If MFA Preference page needed
    // Else if MFA Untrusted Device page needed
    if (this.needsOtpSetup) {
      this.STEPS_MFA_PREFERENCE.index = this.stepIndex;
      steps.push(this.STEPS_MFA_PREFERENCE);
      this.numberOfCollections++;
    }

    // Assign routing
    if (this.numberOfCollections > 1) {
      // If there are more than 1 forced data pages/collections in the steps array,
      // we want to do to the 'time to update' (/data-collection) page.
      this.navigationRoute = `${APP_ROUTES.DATA_COLLECTION}`;
    } else if ((this.numberOfCollections === 0) && this.needsOtpAuthentication) {
      // If there are no forced data pages, we are going to OTP Untrusted Device page
      this.navigationRoute = `/${APP_ROUTES.MFA}/${APP_ROUTES.UNTRUSTED_DEVICE}`;
    } else {
      // if there is only 1 forced data page we are going to, we don't want to see the 'time to update' (/data-collection) page.
      this.navigationRoute = steps[0].route;
    }

    this.stepIndicatorService.setSteps(steps);
    return this.navigationRoute;
  }

  public getNeedsPasswordReset() {
    return this.needsPasswordReset;
  }

  public getNeedsContactInfoResetEmail() {
    return this.needsContactInfoResetEmail;
  }

  public getNeedsContactInfoResetPhone() {
    return this.needsContactInfoResetPhone;
  }

  public getNeedsTwoFactorAuthentication() {
    return this.needsOtpSetup;
  }

}

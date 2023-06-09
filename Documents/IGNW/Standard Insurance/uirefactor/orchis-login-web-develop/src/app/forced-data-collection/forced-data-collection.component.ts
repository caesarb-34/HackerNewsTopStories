import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { AuthenticationService } from 'sfg-ng-brand-library';
import { StepIndicatorService } from '../shared/services/step-indicator.service';
import { ForcedDataCollectionService } from './forced-data-collection.service';
import {GlobalConstants} from '../shared/global-constants';


@Component({
  selector: 'lgn-forced-data-collection',
  templateUrl: './forced-data-collection.component.html',
  styleUrls: ['./forced-data-collection.component.scss']
})
export class ForcedDataCollectionComponent implements OnInit {

  public needsPasswordReset: boolean = false;
  public needsContactInfoReset: boolean = false;
  public needsTwoFactorAuthentication: boolean = false;

  constructor(public authenticationService: AuthenticationService,
              private titleService: Title,
              public stepIndicatorService: StepIndicatorService,
              public forcedDataCollectionService: ForcedDataCollectionService
  ) { }

  ngOnInit() {

    this.titleService.setTitle('Time to Update | The Standard');

    this.authenticationService.validateAuthzPolicy(GlobalConstants.MASTER_CONTROL_POLICY)
      .subscribe(
        () => {
          /* We know that if they get to this page, the user has recovery steps.
          It will always go down the error path
           */
        },
        (error) => {
          /* Either Forced Data Collection, Password Reset, or MFA setup is needed */
          this.forcedDataCollectionService.setStepIndicatorReturnNavigation(error);
          this.needsPasswordReset = this.forcedDataCollectionService.getNeedsPasswordReset();
          this.needsContactInfoReset = this.forcedDataCollectionService.getNeedsContactInfoResetEmail()
                                    || this.forcedDataCollectionService.getNeedsContactInfoResetPhone();
          this.needsTwoFactorAuthentication = this.forcedDataCollectionService.getNeedsTwoFactorAuthentication();
        }
      );
  }
}

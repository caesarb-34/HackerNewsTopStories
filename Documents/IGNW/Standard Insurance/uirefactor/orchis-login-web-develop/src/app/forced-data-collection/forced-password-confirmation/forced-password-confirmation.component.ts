import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router} from '@angular/router';
import { environment } from '@environment';
import {ForcedDataCollectionService} from '../forced-data-collection.service';
import {AuthenticationService} from 'sfg-ng-brand-library';
import {GlobalConstants} from '../../shared/global-constants';


@Component({
  selector: 'lgn-forced-password-confirmation',
  templateUrl: './forced-password-confirmation.component.html',
  styleUrls: ['./forced-password-confirmation.component.scss']
})
export class ForcedPasswordConfirmationComponent implements OnInit {

  public myHomeUrl: string = environment.myHomeUrl;
  public isForcedDataCollectionPolicyMet: boolean = false;
  public navigateVariable: string;

  constructor(private titleService: Title,
              private router: Router,
              public authenticationService: AuthenticationService,
              private forcedDataCollectionService: ForcedDataCollectionService) {}

  ngOnInit() {
    this.titleService.setTitle('Thank You | The Standard');
    this.verifyMfaSetup();
  }

  public navigateTo(): void {
    if (!this.isForcedDataCollectionPolicyMet) {
      this.router.navigate([this.navigateVariable]);
    } else {
      window.location.href = this.myHomeUrl;
    }
  }

  public verifyMfaSetup() {
    this.authenticationService.validateAuthzPolicy(GlobalConstants.MASTER_CONTROL_POLICY)
    .subscribe( () => {
      this.isForcedDataCollectionPolicyMet = true;
    },
    (error) => {
      this.navigateVariable = this.forcedDataCollectionService.setStepIndicatorReturnNavigation(error);
    });
  }

}

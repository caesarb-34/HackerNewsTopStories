import {AfterViewInit, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { Title } from '@angular/platform-browser';

import { environment } from '@environment';

import { SelfRegistrationService } from './self-registration.service';


@Component({
  selector: 'lgn-user-self-registration',
  templateUrl: './self-registration.component.html',
  styleUrls: ['./self-registration.component.scss']
})
export class SelfRegistrationComponent implements OnInit, AfterViewInit {
  public selectedStep: number;
  public stepLabel: number;
  public steps = [
    {index: 1, label: 'Create Account', title: 'Tell Us Who You Are | The Standard'},
    {index: 2, label: 'Set Credentials', title: 'Create a Password | The Standard'},
    {index: 3, label: 'Activate Account', title: 'Activate Account | The Standard'},
    {index: 4, label: 'Complete Setup', title: 'The Standard'}
  ];

  public customerSupportUrl = environment.customerSupportUrl;
  public errorMessages = {
    400: 'Something went wrong. The server did not understand this request. If you continue to ' +
    'experience this problem, please <a href="' + this.customerSupportUrl + '">contact us</a> for help',
    401: 'Something went wrong. The server did not understand this request. If you continue to ' +
    'experience this problem, please <a href="' + this.customerSupportUrl + '">contact us</a> for help',
    404: 'We\'re sorry. We can\'t find that page. Please double check the web address or ' +
    '<a href="/">return to the login page</a> to access your account and secure services.',
    409: 'That user name is not available. Please choose a different one. If you already have an account, ' +
    'please <a href="/login">log in</a>.',
     422: 'Password does not match policy rules.'
  };
  public activeError: string;

  constructor(
    private selfRegistrationService: SelfRegistrationService,
    private titleService: Title,
    private cd: ChangeDetectorRef
  ) {
    selfRegistrationService.pageStepObservable.subscribe(
       step => {
          this.selectedStep = step;
          this.stepLabel = step - 1;
          this.titleService.setTitle(this.steps[this.stepLabel].title);
       }
    );
    selfRegistrationService.errorMessageObservable.subscribe(
      error => {
        this.activeError = error;
      }
    );
  }
  ngAfterViewInit() {
    this.cd.detectChanges();
  }
  ngOnInit() {
    // initialize the page step to step 1
    this.selfRegistrationService.syncPageStep(1);
    // clear the error message
    this.selfRegistrationService.syncErrorMessage('');
  }
}

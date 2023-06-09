import {Component, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute, Router} from '@angular/router';
import {StepIndicatorService} from '../../shared/services/step-indicator.service';
import {environment} from '@environment';
import {IResponse} from 'cloudentityjs/dist/typings/core/Request';
import {AuthenticationService} from 'sfg-ng-brand-library';


@Component({
  selector: 'lgn-forced-reset-password',
  templateUrl: './forced-reset-password.component.html',
  styleUrls: ['./forced-reset-password.component.scss']
})
export class ForcedResetPasswordComponent implements OnInit {

  public selectedStep;
  public url: string = environment.identitySecurityUrl;
  public customerSupportUrl: string = environment.customerSupportUrl;
  public hasPasswordError: boolean = false;
  public activeErrorMessage: string = '';

  constructor(public stepIndicatorService: StepIndicatorService,
              public authenticationService: AuthenticationService,
              private router: Router,
              public route: ActivatedRoute,
              public titleService: Title) {
  }

  ngOnInit() {
    // check to see if stepIndicatorService is populated with info, if not then route to login page
    if (this.stepIndicatorService.getSteps().length === 0) {
      this.router.navigate(['']);
    }
    this.titleService.setTitle('Change Password | The Standard');
    this.authenticationService.verifySession().subscribe(
      () => {/* User's session is valid and they can reset password */
      },
      (error: IResponse) => {
        console.error(error.status);
        this.router.navigate(['']);
      }
    );
    this.selectedStep = Number(this.route.snapshot.queryParams['step']);
  }

  public handlePasswordError(activePasswordError) {
    this.hasPasswordError = activePasswordError.hasActiveError;
    this.activeErrorMessage = activePasswordError.activeErrorMessage;
  }

  /**
   * On a successful change of password, the user must relogin to get a new session.
   *
   * This method will log them out through OrchIS, and redirect to login page with an appropriate message.
   */
  public routeOnSuccess() {
    this.authenticationService.logout().subscribe(
      () => {/* No specific success path, we always want to route to login */},
      () => {/* No specific error path either, we always want to route to login */},
      () => {
        this.router.navigate(
          [''],
          {queryParams: {passwordresetlogout: true}}
        );
      }
    );
  }
}

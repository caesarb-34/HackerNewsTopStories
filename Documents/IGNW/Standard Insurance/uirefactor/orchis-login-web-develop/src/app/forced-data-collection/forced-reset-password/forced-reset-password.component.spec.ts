import {waitForAsync, ComponentFixture, TestBed} from '@angular/core/testing';
import {FormsModule} from '@angular/forms';
import { Title } from '@angular/platform-browser';
import {ActivatedRoute, Router} from '@angular/router';

import {NgIdleModule} from '@ng-idle/core';
import {MockIdleTimeoutComponent} from '../../../test/idle-timeout-mock/mock-idle-timeout.component';
import {ModalModule} from 'ngx-bootstrap/modal';
import {of, throwError} from 'rxjs';
import {createSpyObjFromClass} from '../../../test/test.helper';
import {ForcedResetPasswordComponent} from './forced-reset-password.component';
import {NewPasswordComponent} from '../../shared-components/new-password/new-password.component';
import {AuthenticationService} from 'sfg-ng-brand-library';
import {StepIndicatorService} from '../../shared/services/step-indicator.service';
import {MessagePopupComponent} from '../../shared-components/message-popup/message-popup.component';
import {ActivatedRouteStub} from '../../../test/router-stubs';
import {CapslockTooltipComponent} from '../../shared-components/capslock-tooltip/capslock-tooltip.component';


describe('ForcedResetPasswordComponent', () => {
  let component: ForcedResetPasswordComponent;
  let fixture: ComponentFixture<ForcedResetPasswordComponent>;
  let activatedRoute: ActivatedRouteStub;
  let compiledElem: HTMLElement;
  let titleService: Title;
  let authService: jasmine.SpyObj<AuthenticationService>;
  let router: jasmine.SpyObj<Router>;
  let stepService: StepIndicatorService;

  beforeEach(waitForAsync(() => {
    activatedRoute = new ActivatedRouteStub();
    authService = createSpyObjFromClass(AuthenticationService);
    router = createSpyObjFromClass(Router);
    stepService = createSpyObjFromClass(StepIndicatorService);

    TestBed.configureTestingModule({
      declarations: [
        ForcedResetPasswordComponent,
        MessagePopupComponent,
        NewPasswordComponent,
        CapslockTooltipComponent,
        MockIdleTimeoutComponent
      ],
      imports: [
        FormsModule,
        NgIdleModule.forRoot(),
        ModalModule.forRoot()
      ],
      providers: [
        {provide: Title, useClass: Title},
        {provide: AuthenticationService, useValue: authService},
        StepIndicatorService,
        {provide: ActivatedRoute, useValue: activatedRoute},
        {provide: Router, useValue: router}
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForcedResetPasswordComponent);
    component = fixture.componentInstance;
    activatedRoute.testQueryParams = {step: 1};
    compiledElem = fixture.debugElement.nativeElement;
    authService = TestBed.inject(AuthenticationService) as jasmine.SpyObj<AuthenticationService>;
    authService.verifySession.and.returnValue(of({ status: 200, headers: null, data: undefined }));
    stepService.setSteps([]);

    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    stepService = TestBed.inject(StepIndicatorService);

    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to base route if length is 0 on stepIndicatorService', () => {
    expect(router.navigate).toHaveBeenCalled();
  });

  it('should not navigate to base route if length > 0 for steps', () => {
    router.navigate.calls.reset();
    stepService.setSteps([{index: 1, label: ''}]);

    component.ngOnInit();

    expect(router.navigate).not.toHaveBeenCalled();

  });

  it('should navigate to base route if verifySession fails', () => {
    const spyError = spyOn(window.console, 'error').and.callFake(() => {});
    authService.verifySession.and.returnValue(throwError({status: 401}));

    component.ngOnInit();

    expect(spyError).toHaveBeenCalledWith(401);
    expect(router.navigate).toHaveBeenCalledWith(['']);
  });

  it('should set the title to \"Change Password \| The Standard\"', () => {
    titleService = TestBed.inject(Title);
    expect(titleService.getTitle()).toBe('Change Password | The Standard');
  });

  it('should show the current password field', () => {
    const currentPasswordElem = compiledElem.querySelector('#fieldCurrentPassword');
    expect(currentPasswordElem).toBeTruthy();
  });

  it('should display a message if the new password component emits an error', () => {
    component.handlePasswordError({hasActiveError: true, activeErrorMessage: 'Your password does not meet requirements.'});
    fixture.detectChanges();

    const messagePopup = compiledElem.querySelector('lgn-message-popup');
    expect(messagePopup.textContent).toContain('Your password does not meet requirements.');
  });

  it('should navigate to app base after authentication service logs out', () => {
    authService.logout.and.returnValue(of({ status: 200, headers: null, data: undefined}));

    component.routeOnSuccess();

    expect(authService.logout).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['']);
  });

  it('should navigate to app base after authentication service logs out with error', () => {
    authService.logout.and.returnValue(throwError({ status: 401, headers: null, data: undefined}));

    component.routeOnSuccess();

    expect(authService.logout).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['']);
  });

});

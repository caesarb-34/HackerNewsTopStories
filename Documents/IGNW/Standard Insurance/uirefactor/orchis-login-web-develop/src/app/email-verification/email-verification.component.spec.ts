import {waitForAsync, ComponentFixture, TestBed} from '@angular/core/testing';
import {Title} from '@angular/platform-browser';
import {ModalModule} from 'ngx-bootstrap/modal';
import {of, throwError} from 'rxjs';

import {EmailVerificationComponent} from './email-verification.component';
import {AuthenticationService} from 'sfg-ng-brand-library';
import {ActivatedRoute, Router} from '@angular/router';
import {ActivatedRouteStub, RouterStub} from '../../test/router-stubs';
import {ForcedDataCollectionService} from '../forced-data-collection/forced-data-collection.service';
import {AuthenticationServiceStub} from '../../test/services/authentication.service.stub';


describe('EmailVerificationComponent', () => {
  let component: EmailVerificationComponent;
  let fixture: ComponentFixture<EmailVerificationComponent>;
  let titleService: Title;

  let authService: AuthenticationServiceStub;
  let activatedRoute: ActivatedRouteStub;
  let routerStub = new RouterStub();

  beforeEach(waitForAsync(() => {
    activatedRoute = new ActivatedRouteStub();
    activatedRoute.testQueryParams = {code: 'abc123'};

    authService = new AuthenticationServiceStub();
    routerStub = new RouterStub();

    TestBed.configureTestingModule({
      declarations: [
        EmailVerificationComponent
      ],
      imports: [
        ModalModule.forRoot()
      ],
      providers: [
        {provide: Title, useClass: Title},
        {provide: ActivatedRoute, useValue: activatedRoute},
        {provide: AuthenticationService, useValue: authService},
        {provide: Router, useValue: routerStub},
        {provide: ForcedDataCollectionService, useClass: ForcedDataCollectionService},
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailVerificationComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should set the title to \"Thank You \| The Standard\"', () => {
    spyOn(component, 'verifyUserEmail').and.callFake(() => {});
    titleService = TestBed.inject(Title);
    component.ngOnInit();
    expect(titleService.getTitle()).toBe('Thank You | The Standard');
  });

  it('should get the otpCode from the query params and set response success to [true] when confirming id', () => {
    component.responseSuccess = false;
    authService.setConfirmVerifyIdentifier = of({});

    component.verifyUserEmail('abc123');

    expect(component.responseSuccess).toBeTruthy();
  });

  it('should call handleError() when response is error', () => {
    const spyHandleError = spyOn(component, 'handleError').and.callFake(() => {});
    component.responseSuccess = true;
    authService.setConfirmVerifyIdentifier = throwError(new Error());

    component.verifyUserEmail('abc123');

    expect(spyHandleError).toHaveBeenCalled();
  });

  it('should set the title to \'Your activation link has expired.\' if error code is \'Request.gone\'', () => {
    const errorObject = { data: { code: 'request.gone' } };
    component.handleError(errorObject);

    expect(component.errorTitle).toEqual(component.errorMessages[errorObject.data.code].title);
    expect(component.errorMessage).toEqual(component.errorMessages[errorObject.data.code].message);
    expect(component.responseSuccess).toBeFalsy();
  });

  it('should set responseSuccess to [false] and the title to default error message when code is not found', () => {
    const errorObject = { data: { code: 'missing-link' } };
    component.handleError(errorObject);

    expect(component.errorTitle).toEqual(component.errorMessages['default'].title);
    expect(component.errorMessage).toEqual(component.errorMessages['default'].message);
    expect(component.responseSuccess).toBeFalsy();
  });

  it('should set responseSuccess to [false] and the title to default error message when code is not found', () => {
    const errorObject = { };
    component.handleError(errorObject);

    expect(component.errorTitle).toEqual(component.errorMessages['default'].title);
    expect(component.errorMessage).toEqual(component.errorMessages['default'].message);
    expect(component.responseSuccess).toBeFalsy();
  });

  it('should call router navigate with the given string as the parameter', () => {
    const routeToNav = 'test-route';

    component.navigateTo(routeToNav);
    expect(routerStub.routes).toContain(routeToNav);
  });
});

import {Component} from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { BrowserModule, Title } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {NgIdleModule} from '@ng-idle/core';
import {MockIdleTimeoutComponent} from '../../../test/idle-timeout-mock/mock-idle-timeout.component';
import {ModalModule} from 'ngx-bootstrap/modal';
import {of} from 'rxjs';
import {ActivatedRouteStub} from '../../../test/router-stubs';
import {createSpyObjFromClass} from '../../../test/test.helper';

import { MfaEnrollmentConfirmationComponent } from './mfa-enrollment-confirmation.component';
import {AuthenticationService} from 'sfg-ng-brand-library';
import { CookieUtils } from '../../shared/utils/cookie';

describe('MfaEnrollmentConfirmationComponent', () => {
  let component: MfaEnrollmentConfirmationComponent;
  let fixture: ComponentFixture<MfaEnrollmentConfirmationComponent>;
  let titleService: Title;
  let authService: jasmine.SpyObj<AuthenticationService>;
  const activatedRoute = new ActivatedRouteStub();
  activatedRoute.testQueryParams = {mfaEnrollmentStatus: true};
  activatedRoute.testQueryParams = {mfaAuthenticated: true};

  const testGetUserData = {
    uid: 'venkata_int',
  };

  const router = {
    navigate: jasmine.createSpy('navigate')
  };

  beforeEach(waitForAsync(() => {
    authService = createSpyObjFromClass(AuthenticationService);

    TestBed.configureTestingModule({
      imports: [
        BrowserModule,
        FormsModule,
        ModalModule.forRoot(),
        NgIdleModule.forRoot()
      ],
      declarations: [
        MfaEnrollmentConfirmationComponent,
        MockIdleTimeoutComponent
      ],
      providers: [
        { provide: Title, useClass: Title },
        { provide: Router, useValue: router },
        { provide: AuthenticationService, useValue: authService },
        { provide: ActivatedRoute, useValue: activatedRoute }
      ]
      }).compileComponents();
   }));


  beforeEach(() => {
    fixture = TestBed.createComponent(MfaEnrollmentConfirmationComponent);
    component = fixture.componentInstance;

    authService = TestBed.inject(AuthenticationService) as jasmine.SpyObj<AuthenticationService>;
    authService.verifySession.and.returnValue(of({status: 200, headers: null, data: undefined}));

    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should set the title to \" Two-Step Verification Complete \| The Standard\"', () => {
    component.route.snapshot.queryParams['mfaAuthenticated'] = 'false';
    component.route.snapshot.queryParams['mfaEnrollmentStatus'] = 'true';
    component.ngOnInit();
    titleService = TestBed.inject(Title);
    expect(titleService.getTitle()).toBe('Two-Step Verification Complete | The Standard');
  });

  it('should set the title to \" Verification Successful \| The Standard\"', () => {
    component.route.snapshot.queryParams['mfaEnrollmentStatus'] = 'false';
    component.route.snapshot.queryParams['mfaAuthenticated'] = 'true';
    component.ngOnInit();
    titleService = TestBed.inject(Title);
    expect(titleService.getTitle()).toBe('Verification Successful | The Standard');
  });

  it('should be redirect to login page after setting the cookie', waitForAsync(() => {
      const setCookieSpy = spyOn(CookieUtils, 'setCookie');
      component.setDoNotAskUserCookie();
      expect(setCookieSpy).toHaveBeenCalled();
  }));

});

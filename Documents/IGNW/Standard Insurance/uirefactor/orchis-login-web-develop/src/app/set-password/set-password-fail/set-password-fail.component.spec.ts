import {waitForAsync, ComponentFixture, TestBed} from '@angular/core/testing';
import {ActivatedRoute, Router} from '@angular/router';
import {Title} from '@angular/platform-browser';
import {Component} from '@angular/core';
import {RouterTestingModule} from '@angular/router/testing';
import {ModalModule} from 'ngx-bootstrap/modal';
import {of, throwError} from 'rxjs';

import {SetPasswordFailComponent} from './set-password-fail.component';
import {AccountService} from '../../shared/services/account.service';
import {ActivatedRouteStub, RouterStub} from '../../../test/router-stubs';


/**
 * this mock component is a mock routing destination
 */
@Component({
  template: ``
})
class MockComponent {}


describe('SetPasswordFailComponent', () => {
  let component: SetPasswordFailComponent;
  let fixture: ComponentFixture<SetPasswordFailComponent>;

  let accountService: AccountService;
  let activatedRoute: ActivatedRouteStub;
  let titleService: Title;

  beforeEach(() => {
    activatedRoute = new ActivatedRouteStub();
    activatedRoute.testParamMap = { code: 422 };
    activatedRoute.testQueryParams = { provisioned: 'false', otpCode: '123123123123A' };
  });

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          {path: '', component: MockComponent},
          {path: 'forgot-password', component: MockComponent}
        ]),
        ModalModule.forRoot()
      ],
      declarations: [
        SetPasswordFailComponent,
        MockComponent
      ],
      providers: [
        {provide: Title, useClass: Title},
        {provide: Router, useClass: RouterStub},
        {provide: ActivatedRoute, useValue: activatedRoute},
        AccountService
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetPasswordFailComponent);
    accountService = fixture.debugElement.injector.get(AccountService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should set the title to \"Set a New Password \| The Standard\"', () => {
    titleService = TestBed.inject(Title);
    expect(titleService.getTitle()).toBe('Set a New Password | The Standard');
  });

  // TODO: Fix this unit test
  // xit('should say \"Your link has expired.\" on 422', () => {
  //   spyOn(component.route, 'paramMap').and.returnValue(of({}));
  //   component.ngOnInit();
  //   expect(component.messageText).toBe(component.errorMessages['422'].text);
  // });

  it('should navigate to "forgot-password" on "start over" button click', () => {
    const router = TestBed.inject(Router);
    const routerSpy: jasmine.Spy = spyOn(router, 'navigate');
    component.componentNavigate('forgot-password');
    expect(routerSpy).toHaveBeenCalled();
  });

  it('should change the behavior of the button if provisioned == true', () => {
    component.provisioned = true;
    fixture.detectChanges();
    const actionButton = fixture.debugElement.nativeElement.querySelector('.lgn-continue-btn');
    expect(actionButton.textContent).toContain('Resend');
  });

  it('should set response returned to [true] when resendActivationEmail() is successful', () => {
    spyOn(accountService, 'resendActivationEmail').and.returnValue(of({}));
    component.resendActivationLink();
    expect(component.responseReturned).toBeTruthy();
  });

  it('should set responseReturned and resendActivationError to [true] when resendActivationEmail() fails', () => {
    spyOn(accountService, 'resendActivationEmail').and.returnValue(throwError({}));
    component.resendActivationLink();
    expect(component.resendActivationError).toBeTruthy();
    expect(component.responseReturned).toBeTruthy();
  });

});

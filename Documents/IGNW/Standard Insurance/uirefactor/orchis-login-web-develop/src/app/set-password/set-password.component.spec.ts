import {waitForAsync, ComponentFixture, TestBed} from '@angular/core/testing';
import {FormsModule} from '@angular/forms';
import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {Title} from '@angular/platform-browser';

import {SetPasswordComponent} from './set-password.component';
import {StepIndicatorService} from '../shared/services/step-indicator.service';
import {StepIndicatorComponent} from '../shared-components/step-indicator/step-indicator.component';
import {NewPasswordComponent} from '../shared-components/new-password/new-password.component';
import {MessagePopupComponent} from '../shared-components/message-popup/message-popup.component';
import {AuthenticationService} from 'sfg-ng-brand-library';
import {CapslockTooltipComponent} from '../shared-components/capslock-tooltip/capslock-tooltip.component';
import {createSpyObjFromClass} from '../../test/test.helper';
import {BehaviorSubject} from 'rxjs';
import {UserData} from 'sfg-ng-brand-library/lib/shared/model/authentication.model';
/** mock authentication service */

@Component({
  template: `<router-outlet></router-outlet>`
})
class MockRoutingComponent {
}


/**
 * this mock component is a mock routing destination
 */
@Component({
  template: ``
})
class MockComponent {
}

const userData = {
  defaultEmail: 'test@test.com',
  unknownPhone: '1234567890',
  verifiedEmails: ['test@test.com'],
  unverifiedEmails: ['unverifiedtest@test.com'],
  unverifiedMobiles: ['0987654321', '1111111111'],
  unverifiedPhones: ['2222222222', '3333333333'],
  verifiedMobiles: ['4444444444', '5555555555'],
  verifiedPhones: ['6666666666', '7777777777'],
  customer: ''
};

describe('SetPasswordComponent', () => {
  let component: SetPasswordComponent;
  let fixture: ComponentFixture<SetPasswordComponent>;
  let compiledElem: HTMLElement;
  let mockAuthService: jasmine.SpyObj<AuthenticationService>;

  let titleService: Title;
  let router: Router;

  beforeEach(waitForAsync(() => {
    mockAuthService = createSpyObjFromClass(AuthenticationService);

    TestBed.configureTestingModule({
      declarations: [
        SetPasswordComponent,
        StepIndicatorComponent,
        MessagePopupComponent,
        MockRoutingComponent,
        MockComponent,
        NewPasswordComponent,
        MockComponent,
        CapslockTooltipComponent
      ],
      imports: [
        FormsModule,
        RouterTestingModule.withRoutes([
          {path: '', component: MockComponent},
          {path: 'password-changed', component: MockComponent},
          {path: 'set-password-fail/400', component: MockComponent},
          {path: 'set-password-fail/422', component: MockComponent}
        ])
      ],
      providers: [
        { provide: Title, useClass: Title },
        { provide: AuthenticationService, useValue: mockAuthService },
        StepIndicatorService
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.overrideComponent(StepIndicatorComponent,
      {set: {template: 'step component'}})
      .createComponent(SetPasswordComponent);
    component = fixture.componentInstance;

    mockAuthService.userData$ = new BehaviorSubject<UserData>({
      uid: 'test',
      firstName: 'test',
      lastName: 'test',
      defaultEmail: 'test@test.com',
      defaultPhone: '0000000000'
    });

    router = TestBed.inject(Router);
    compiledElem = fixture.debugElement.nativeElement;

    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should set the title to \"Set New Password \| The Standard\"', () => {
    titleService = TestBed.inject(Title);
    expect(titleService.getTitle()).toBe('Set New Password | The Standard');
  });

  it('should set hasPasswordError and activeErrorMessage when calling handlePasswordError()', () => {
    component.handlePasswordError({hasActiveError: true, activeErrorMessage: 'error'});

    expect(component.hasPasswordError).toBeTruthy();
    expect(component.activeErrorMessage).toEqual('error');
  });

  it('should navigate to \'\\\' with query param accountactivated = true when provisioned', () => {
    const spyRouterNav = spyOn(router, 'navigate').and.callFake(() => Promise.resolve(true));
    component.provisioned = true;
    component.handleNavigationToLogin();

    expect(spyRouterNav).toHaveBeenCalledWith(
        [component.setPasswordConfirmationUrl],
        {queryParams: { accountactivated: true }}
    );
  });

  it('should navigate to \'\\\' with query param passwordreset = true when not provisioned', () => {
    const spyRouterNav = spyOn(router, 'navigate').and.callFake(() => Promise.resolve(true));
    component.provisioned = false;
    component.handleNavigationToLogin();

    expect(spyRouterNav).toHaveBeenCalledWith(
        [component.setPasswordConfirmationUrl],
        {queryParams: { passwordreset: true }}
    );
  });

});

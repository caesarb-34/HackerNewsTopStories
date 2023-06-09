import {waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {Router} from '@angular/router';
import {ModalModule} from 'ngx-bootstrap/modal';

import {SetLoginCredentialsComponent } from './set-login-credentials.component';
import {CapslockTooltipComponent} from '../../shared-components/capslock-tooltip/capslock-tooltip.component';
import {SelfRegSetPasswordComponent} from '../self-reg-set-password/self-reg-set-password.component';
import {SelfRegistrationService} from '../self-registration.service';
import {RouterStub} from '../../../test/router-stubs';
import {InputTooltipComponent} from '../../shared-components/input-tooltip/input-tooltip.component';
import {ValidatePasswordDirective} from '../../shared-components/directives/validate-password.directive';


describe('SetLoginCredentialsComponent', () => {
  let component: SetLoginCredentialsComponent;
  let fixture: ComponentFixture<SetLoginCredentialsComponent>;
  let debug;
  const routerStub = new RouterStub();

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ModalModule.forRoot()
      ],
      declarations: [
        SetLoginCredentialsComponent,
        CapslockTooltipComponent,
        SelfRegSetPasswordComponent,
        InputTooltipComponent,
        ValidatePasswordDirective
      ],
      providers: [
        SelfRegistrationService,
        {provide: Router, useValue: routerStub},
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetLoginCredentialsComponent);
    component = fixture.componentInstance;
    debug = fixture.debugElement;
    fixture.detectChanges();
  });

  describe('===> onSubmit', () => {
    it('should call onSubmit', () => {
      spyOn(component, 'sendUserRegistrationDataToSelfRegistrationService').and.callFake(() => {});
      component.onSubmit();
    });

    it('should NOT call sendUserRegistrationDataToSelfRegistrationService if form is invalid', () => {
      component.newPassword = 'test';
      component.userName = 'dannielrolfe';

      const spyOnSendUserRegistrationDataToServiceToService = spyOn(component, 'sendUserRegistrationDataToSelfRegistrationService');
      fixture.detectChanges();
      component.onSubmit();
      expect(spyOnSendUserRegistrationDataToServiceToService).not.toHaveBeenCalled();
    });
  });

  describe('===> sendUserRegistrationDataToSelfRegistrationService', () => {
    it('should send the user registration data to self registration service', () => {
      component.userRegistrationViewModel.uid = 'dannielrolfe';
      component.userRegistrationViewModel.password = '#STANDard1';
      const spySetNewUserAndPassword = spyOn(component.selfRegistrationService, 'setNewUserIdAndPassword');
      const spyRegisterUser = spyOn(component.selfRegistrationService, 'registerUser');
      component.sendUserRegistrationDataToSelfRegistrationService();

      expect(spySetNewUserAndPassword).toHaveBeenCalled();
      expect(spyRegisterUser).toHaveBeenCalledWith('/register/step3');
    });

    it('should NOT send the user registration data to self registration service if the form is invalid', () => {
      const spySetNewUserAndPassword = spyOn(component.selfRegistrationService, 'setNewUserIdAndPassword');
      const spyRegisterUser = spyOn(component.selfRegistrationService, 'registerUser');

      component.setLoginCredentials.resetForm(undefined);
      component.newPassword = 'undefined';
      component.userName = 'undefined';
      component.onSubmit();

      expect(spySetNewUserAndPassword).not.toHaveBeenCalled();
      expect(spySetNewUserAndPassword).not.toHaveBeenCalled();
      expect(spyRegisterUser).not.toHaveBeenCalledWith('/register/step3');
    });
  });

  describe('===> Test regular expression for user name validation', () => {

    const leadingZeroStrings = [
        '0_starting_char'
    ];

    const leadingSymbolsStrings = [
      '@_starting_symbol',
      '$_starting_symbol',
      ';_starting_symbol',
      '|_starting_symbol',
      '&_starting_symbol',
      '/_starting_symbol',
      '\\_starting_symbol'
    ];

    const containsSymbolsStrings = [
      'contains_@_symbol',
      'contains_$_symbol',
      'contains_;_symbol',
      'contains_|_symbol',
      'contains_&_symbol',
      'contains_/_symbol',
      'contains_\\_symbol'
    ];

    const containsSpaceStrings = [
      'space more than 1',
      'space_at_end ',
      'space_mid and_end ',
      'space middle',
      ' leading_space'
    ];

    const passesUsernameCriteriaStrings = [
      'name!#%^*()_+\'"',
      'name{}[]~`<>,.?`',
      'contains_0_symbol',
      'end_zero_0'
    ];

    const failsUsernameCriteriaStrings = [
      'user@symbol',
      'User@Symbol',
      'name!@#$%^&*()|;',
    ];

    passesUsernameCriteriaStrings.forEach((item) => {
      it('should match when valid when username \'' + item + '\' is used', () => {
        expect(item).toMatch(component.usernameRegx);
      });
    });

    failsUsernameCriteriaStrings.forEach((item) => {
      it('should match as invalid when username \'' + item + '\' is used', () => {
        expect(item).not.toMatch(component.usernameRegx);
      });
    });

    leadingZeroStrings.forEach((item) => {
      it('should match as invalid when username contains leading zero:  \'' + item + '\'', () => {
        expect(item).not.toMatch(component.usernameRegx);
      });
    });

    leadingSymbolsStrings.forEach((item) => {
      it('should match as invalid when username contains leading symbol:  \'' + item + '\'', () => {
        expect(item).not.toMatch(component.usernameRegx);
      });
    });

    containsSpaceStrings.forEach((item) => {
      it('should match as invalid when username contains space in string:  \'' + item + '\'', () => {
        expect(item).not.toMatch(component.usernameRegx);
      });
    });

    containsSymbolsStrings.forEach((item) => {
      it('should match as invalid when username contains symbol in string:  \'' + item + '\'', () => {
        expect(item).not.toMatch(component.usernameRegx);
      });
    });
  });

  describe('===> Test username validator in form', () => {

    it('user name field in a form containing good user name should validate', waitForAsync(() => {
      let inputElement: HTMLInputElement;
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        inputElement = debug.query(By.css('[name=userName]')).nativeElement;
        inputElement.value = 'goodusername';
        inputElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        expect(component.userNameControl.hasError('pattern')).toBe(false);
      });
    }));

    it('user name field in a form containing bad user name should not validate', waitForAsync(() => {
      let inputElement: HTMLInputElement;
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        inputElement = debug.query(By.css('[name=userName]')).nativeElement;
        inputElement.value = 'BAD@username';
        inputElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        expect(component.userNameControl.hasError('pattern')).toBe(true);
      });
    }));

  });

});

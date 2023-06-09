import {waitForAsync, ComponentFixture, TestBed} from '@angular/core/testing';
import {FormsModule, NgForm} from '@angular/forms';
import {Router} from '@angular/router';
import {By, Title} from '@angular/platform-browser';
import {ModalModule} from 'ngx-bootstrap/modal';
import {of, throwError} from 'rxjs';
import {createSpyObjFromClass} from '../../test/test.helper';
// Components
import {PasswordRecoveryComponent} from './password-recovery.component';
import {StepIndicatorComponent} from '../shared-components/step-indicator/step-indicator.component';
import {MessagePopupComponent} from '../shared-components/message-popup/message-popup.component';
// Services
import {AuthenticationService} from 'sfg-ng-brand-library';

describe('PasswordRecoveryComponent', () => {
  let component: PasswordRecoveryComponent;
  let fixture: ComponentFixture<PasswordRecoveryComponent>;
  let compiledElem: HTMLElement;
  const routerStub = { navigate: jasmine.createSpy('navigate') };
  let titleService: Title;
  let authStub: jasmine.SpyObj<AuthenticationService>;

  let form: NgForm;
  let stepIndicator;
  let userNameLabel: HTMLElement;
  let userNameField: HTMLInputElement;
  let emailAddressLabel: HTMLElement;
  let emailAddressField: HTMLInputElement;
  let continueButton: HTMLElement;

  let spyFormSubmit: jasmine.Spy;

  const formTestCases = [
    {userNameVal: true, userEmailVal: true, formValid: true, expected: true},
    {userNameVal: true, userEmailVal: true, formValid: false, expected: true},
    {userNameVal: true, userEmailVal: false, formValid: true, expected: false},
    {userNameVal: true, userEmailVal: false, formValid: false, expected: false},
    {userNameVal: false, userEmailVal: true, formValid: true, expected: false},
    {userNameVal: false, userEmailVal: true, formValid: false, expected: false},
    {userNameVal: false, userEmailVal: false, formValid: true, expected: false},
    {userNameVal: false, userEmailVal: false, formValid: false, expected: false}
  ];

  beforeEach(() => {
    authStub = createSpyObjFromClass(AuthenticationService);
    TestBed.configureTestingModule({
      declarations: [
        PasswordRecoveryComponent,
        StepIndicatorComponent,
        MessagePopupComponent
      ],
      imports: [FormsModule, ModalModule.forRoot()],
      providers: [
        {provide: Router, useValue: routerStub},
        {provide: Title, useClass: Title},
        {provide: AuthenticationService, useValue: authStub }
      ]
    });

    fixture = TestBed.createComponent(PasswordRecoveryComponent);
    authStub = TestBed.inject(AuthenticationService) as jasmine.SpyObj<AuthenticationService>;
    component = fixture.componentInstance;
    compiledElem = fixture.debugElement.nativeElement;
    form = component.form;
    spyFormSubmit = spyOn(component, 'onSubmit').and.callThrough();

    fixture.detectChanges();
    routerStub.navigate.calls.reset();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should set the title to \"Forgot Password \| The Standard\"', () => {
    titleService = TestBed.inject(Title);
    expect(titleService.getTitle()).toBe('Forgot Password | The Standard');
  });

  // ===== Testing the functionality =====
  it('should redirect the route according to the passed url', waitForAsync(() => {
    authStub.requestResetPassword.and.returnValue(of({status: 200, headers: null, data: undefined}));

    fixture.whenStable().then(() => {
      // Set the component variable reference
      setElementVars();

      // Set the values of the controls
      userNameField.value = 'test';
      component.userName = 'test';
      emailAddressField.value = 'test@email.com';
      component.userEmail = 'test@email.com';
      userNameField.dispatchEvent(new Event('input'));
      emailAddressField.dispatchEvent(new Event('input'));

      fixture.detectChanges();
      component.onSubmit();

      expect(routerStub.navigate).toHaveBeenCalledWith([component.checkEmailUrl]);
    });
  }));


  it('should generate the step-indicator component', () => {
    stepIndicator = compiledElem.querySelector('lgn-step-indicator');
    authStub.requestResetPassword.and.returnValue(of({status: 200, headers: null, data: undefined}));
    expect(stepIndicator).toBeTruthy();
  });

  // Test Cases for OnSubmit function
  formTestCases.forEach(testCase => {
    const condition = 'username=[' + testCase.userNameVal
                    + '], email=[' + testCase.userEmailVal
                    + '], form Valid=[' + testCase.formValid + ']';

    it('onSubmit() should have expected result: [' + testCase.expected + '] when ' + condition, waitForAsync(() => {
      authStub.requestResetPassword.and.returnValue(of({status: 200, headers: null, data: undefined}));

      fixture.detectChanges();
      fixture.whenStable().then(() => {
        // Set the component variable reference
        setElementVars();

        // Set the values of the controls
        userNameField.value = testCase.userNameVal ? 'test' : null;
        component.userName = testCase.userNameVal ? 'test' : null;
        emailAddressField.value = testCase.userEmailVal ? 'test@email.com' : null;
        component.userEmail = testCase.userEmailVal ? 'test@email.com' : null;
        userNameField.dispatchEvent(new Event('input'));
        emailAddressField.dispatchEvent(new Event('input'));

        fixture.detectChanges();
        component.onSubmit();

        if (testCase.expected) {
          expect(routerStub.navigate).toHaveBeenCalledWith([component.checkEmailUrl]);
        } else {
          expect(routerStub.navigate).not.toHaveBeenCalled();
        }
      });
    }));
  });

  it('should display login message popup', waitForAsync(() => {

    authStub.requestResetPassword.and.returnValue(throwError({status: 400}));

    fixture.detectChanges();

    fixture.whenStable().then(() => {
      // Set the component variable reference
      setElementVars();

      // Set the values of the controls
      userNameField.value = 'test';
      component.userName = 'test';
      emailAddressField.value = 'test@email.com';
      component.userEmail = 'test@email.com';
      userNameField.dispatchEvent(new Event('input'));
      emailAddressField.dispatchEvent(new Event('input'));

      fixture.detectChanges();
      component.onSubmit();

      expect(authStub.requestResetPassword).toHaveBeenCalled();
      expect(routerStub.navigate).toHaveBeenCalledWith([component.checkEmailUrl]);

    });

  }));

  function setElementVars() {
    userNameField = fixture.debugElement.query(By.css('#username')).nativeElement;
    userNameLabel = fixture.debugElement.query(By.css('#userNameLabel')).nativeElement;
    emailAddressField = fixture.debugElement.query(By.css('#emailAddress')).nativeElement;
    emailAddressLabel = fixture.debugElement.query(By.css('#emailAddressLabel')).nativeElement;
    continueButton = fixture.debugElement.query(By.css('.lgn-continue-btn')).nativeElement;
  }

});

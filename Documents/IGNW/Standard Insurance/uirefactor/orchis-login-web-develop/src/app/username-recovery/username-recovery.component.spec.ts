import {waitForAsync, ComponentFixture, fakeAsync, TestBed} from '@angular/core/testing';
import {FormsModule} from '@angular/forms';
import {Router} from '@angular/router';
import {Title} from '@angular/platform-browser';
import {ModalModule} from 'ngx-bootstrap/modal';
import {of, throwError} from 'rxjs';
// Components and Services
import {UsernameRecoveryComponent} from './username-recovery.component';
import {AuthenticationService} from 'sfg-ng-brand-library';
import {AuthenticationServiceStub} from '../../test/services/authentication.service.stub';

describe('UsernameRecoveryComponent', () => {
  let component: UsernameRecoveryComponent;
  let fixture: ComponentFixture<UsernameRecoveryComponent>;

  // Service mock vars
  let titleService: Title;
  let authService: AuthenticationServiceStub;
  const routerStub = { navigate: jasmine.createSpy('navigate') };

  // Test common variables
  let expectedTitle: string;
  const testEmail = 'test@standard.com';


  beforeEach(() => {
    authService = new AuthenticationServiceStub();
  });

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UsernameRecoveryComponent ],
      imports: [
        FormsModule,
        ModalModule.forRoot()
      ],
      providers: [
        {provide: Router, useValue: routerStub},
        {provide: Title, useClass: Title},
        {provide: AuthenticationService, useValue: authService}
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsernameRecoveryComponent);
    component = fixture.componentInstance;
    expectedTitle = component.title;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set the title to ==> ' + expectedTitle, () => {
    titleService = TestBed.inject(Title);
    expect(titleService.getTitle()).toBe(expectedTitle);
  });

  it('should submit the form when the form is valid, make cjs call, and redirect to check-email', () => {
    // Note that the Authentication Stub sets the default value of recoverUserName to Observable.of({status: 200})
    component.userEmail = 'test@standard.com';
    component.onSubmit();
    fixture.detectChanges();

    expect(routerStub.navigate).toHaveBeenCalledWith(['/forgot-username/check-email']);
  });

  it('should call onSubmit(), but should set active error when form is submitted and is invalid and should not redirect to check-email',
      waitForAsync(() => {
        authService.setRecoverUserName = throwError(new Error());

        component.userEmail = testEmail;
        fixture.detectChanges();
        component.onSubmit();
        fixture.detectChanges();

        expect(component.hasActiveError).toBeTruthy();
      }));

  it('should not submit the form when the form is invalid', fakeAsync(() => {
    const spyRecoverUsername = spyOn(component.authService, 'recoverUserName')
      .and.callFake(() => of({status: 200, headers: null, data: undefined}));

    fixture.whenStable().then(() => {
      component.userEmail = '';
      fixture.detectChanges();
      component.onSubmit();

      expect(component.form.valid).toBeFalsy();
      expect(spyRecoverUsername).not.toHaveBeenCalled();
    });
  }));

});

import {HttpClientTestingModule} from '@angular/common/http/testing';
import {Component} from '@angular/core';
import {waitForAsync, ComponentFixture, fakeAsync, TestBed} from '@angular/core/testing';
import {FormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {Router, Routes} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {
  MockIdleTimeoutComponent,
  MockNoAuthHeaderComponent,
  MockSfgBrandFooterComponent, MockSfgBrandModalDialogComponent
} from '../test/idle-timeout-mock/mock-idle-timeout.component';
import {of} from 'rxjs';
import {SfgNgBrandLibraryConfig} from 'sfg-ng-brand-library/lib/shared/model/sfg-ng-brand-library.config';
import {createSpyObjFromClass} from '../test/test.helper';
// Components
import {AppComponent} from './app.component';
import {MessagePopupComponent} from './shared-components/message-popup/message-popup.component';
import {PasswordRecoveryComponent} from './password-recovery/password-recovery.component';
import {CheckEmailNotificationComponent} from './check-email-notification/check-email-notification.component';
import {SetPasswordComponent} from './set-password/set-password.component';
import {StepIndicatorComponent} from './shared-components/step-indicator/step-indicator.component';
import {EmailVerificationComponent} from './email-verification/email-verification.component';
import {ContactInfoCollectionComponent} from './forced-data-collection/contact-info-collection/contact-info-collection.component';
import {ForcedDataCheckEmailComponent} from './forced-data-collection/forced-data-check-email/forced-data-check-email.component';
import {SetPasswordFailComponent} from './set-password/set-password-fail/set-password-fail.component';
import {ForcedResetPasswordComponent} from './forced-data-collection/forced-reset-password/forced-reset-password.component';
import {ForcedDataCollectionComponent} from './forced-data-collection/forced-data-collection.component';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
// Services
import {AnalyticsService} from './shared/services/analytics.service';
import {AuthenticationServiceStub} from '../test/services/authentication.service.stub';
import {DrupalServiceStub} from '../test/services/drupal.service.stub';
import {AnalyticsServiceStub} from '../test/services/analytics.service.stub';
import {
  AuthenticationService, BrowserDetectionModule,
  HeaderMenuFactory,
  LinkTarget,
  LinkType,
  NavigationService
} from 'sfg-ng-brand-library';

@Component({
  selector: 'lgn-login-screen',
  template: '<div class="login-screen"></div>'
})
export class MockLoginScreenComponent {}


describe('AppComponent', () => {

  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;
  let compiledElem: HTMLElement;

  // Service Mocks
  let authService: AuthenticationServiceStub;
  let drupalService: DrupalServiceStub;
  let analyticsService: AnalyticsServiceStub;
  let navigationService: jasmine.SpyObj<NavigationService>;

  let router: Router;
  let spyPageViewAnalytics: jasmine.Spy;

  const appRoutes: Routes = [
    { path: 'login', component: CheckEmailNotificationComponent },
    { path: 'forgot-password', component: CheckEmailNotificationComponent },
    { path: 'check-email', component: CheckEmailNotificationComponent },
    { path: 'set-password', component: CheckEmailNotificationComponent },
    { path: 'set-password-fail/:code', component: PageNotFoundComponent },
    { path: 'email-verification', component: PageNotFoundComponent },
    { path: 'data-collection-email', component: PageNotFoundComponent },
    { path: 'data-collection', component: PageNotFoundComponent },
    { path: 'password-expired', component: PageNotFoundComponent },
    { path: 'collect-contact-info', component: PageNotFoundComponent },
    { path: '', component: PageNotFoundComponent },
    { path: '**', component: PageNotFoundComponent }
  ];

  const noAuthConfig: SfgNgBrandLibraryConfig = {
    buildInfo: {
      timestamp: '',
      version: '0'
    },
    env: 'test',
    appCode: 'login',
    cmEnv: 'test',
    cmEndpoint: 'TestEndpoint'
  };

  beforeEach(() => {
    authService = new AuthenticationServiceStub();
    drupalService = new DrupalServiceStub(of({}));
    analyticsService = new AnalyticsServiceStub();
    navigationService = createSpyObjFromClass(NavigationService);

    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        MockLoginScreenComponent,
        MessagePopupComponent,
        PasswordRecoveryComponent,
        CheckEmailNotificationComponent,
        SetPasswordComponent,
        StepIndicatorComponent,
        ForcedDataCheckEmailComponent,
        EmailVerificationComponent,
        ContactInfoCollectionComponent,
        SetPasswordFailComponent,
        ForcedResetPasswordComponent,
        ForcedDataCollectionComponent,
        PageNotFoundComponent,
        MockIdleTimeoutComponent,
        MockNoAuthHeaderComponent,
        MockSfgBrandFooterComponent,
        MockSfgBrandModalDialogComponent
      ],
      imports: [
        FormsModule,
        BrowserModule,
        RouterTestingModule.withRoutes(appRoutes),
        HttpClientTestingModule,
        BrowserDetectionModule.forRoot({unsupportedBrowsers: ['ie']})
      ],
      providers: [
        {provide: AuthenticationService, useClass: AuthenticationServiceStub},
        {provide: NavigationService, useValue: navigationService},
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    compiledElem = fixture.debugElement.nativeElement;

    router = TestBed.inject(Router);
    navigationService = TestBed.inject(NavigationService) as jasmine.SpyObj<NavigationService>;
    navigationService.setMenuItemAction.and.callFake(() => {});

    spyPageViewAnalytics = spyOn(AnalyticsService, 'sendPageHit').and.callFake(() => {});

    fixture.detectChanges();
  });

  it('should create the app', fakeAsync(() => {
    expect(component).toBeTruthy();
  }));

  it ('should change focus to main-content anchor tag', () => {
    component.focusOnMainContent();
    const curElement = document.activeElement;

    expect(curElement.id).toEqual('main-content');
  });

  it('should scroll the window to location 0,0 when router event change happens', waitForAsync(() => {
    const spyScrollTo = spyOn(window, 'scrollTo').and.callFake(() => {});
    router.navigate(['forgot-password']);

    fixture.whenStable().then(() => {
      expect(spyScrollTo).toHaveBeenCalledWith(0, 0);
    });
  }));

  it('should trigger navigation service setMenuItemAction when calling handleHeaderClickEvent()', () => {
    const helpLink = HeaderMenuFactory.createMenuItem(
      'help-link',
      'Help',
      LinkType.EXTERNAL,
      '#',
      LinkTarget.SELF,
      'fas fa-question-circle'
    );

    component.handleHeaderClickEvent(helpLink);

    expect(navigationService.setMenuItemAction).toHaveBeenCalledWith(helpLink);
  });

  describe('===> Analytics - Page Hit', () => {

    it('should ignore page hit on load of application and first route change event', () => {
      router.navigate(['/']);

      expect(spyPageViewAnalytics).not.toHaveBeenCalled();
    });

    it('should register all route changes as a hit after the first is ignored', waitForAsync(() => {
      const newRoute = '/email-verification';
      router.navigate(['/']);
      router.navigate([newRoute]);

      fixture.whenStable().then(() => {
        expect(spyPageViewAnalytics).toHaveBeenCalledWith(newRoute);
      });
    }));
  });

});

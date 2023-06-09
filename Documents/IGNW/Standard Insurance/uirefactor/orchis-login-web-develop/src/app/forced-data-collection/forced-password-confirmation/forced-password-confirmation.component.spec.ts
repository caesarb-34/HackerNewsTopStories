import {waitForAsync, ComponentFixture, TestBed} from '@angular/core/testing';
import {Title} from '@angular/platform-browser';
import {Router} from '@angular/router';
import {MockIdleTimeoutComponent} from '../../../test/idle-timeout-mock/mock-idle-timeout.component';
import {RouterStub} from '../../../test/router-stubs';
import {ForcedPasswordConfirmationComponent} from './forced-password-confirmation.component';
import {ForcedDataCollectionService} from '../forced-data-collection.service';
import {AuthenticationService} from 'sfg-ng-brand-library';
import {createSpyObjFromClass} from '../../../test/test.helper';
import {of} from 'rxjs';


describe('ForcedPasswordConfirmationComponent', () => {
  let component: ForcedPasswordConfirmationComponent;
  let fixture: ComponentFixture<ForcedPasswordConfirmationComponent>;
  let mockAuthService: jasmine.SpyObj<AuthenticationService>;
  let titleService: Title;
  let spyVerifySession: jasmine.Spy;
  const componentService = {};

  beforeEach(waitForAsync(() => {
    mockAuthService = createSpyObjFromClass(AuthenticationService);

    TestBed.configureTestingModule({
      declarations: [
        ForcedPasswordConfirmationComponent,
        MockIdleTimeoutComponent
      ],
      providers: [{provide: Title, useClass: Title},
        {provide: Router, useClass: RouterStub},
        {provide: ForcedDataCollectionService, useValue: componentService},
        {provide: AuthenticationService, useValue: mockAuthService},
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForcedPasswordConfirmationComponent);
    component = fixture.componentInstance;

    spyVerifySession = mockAuthService.validateAuthzPolicy
    .and.returnValue(of({ status: 200, headers: undefined, data: undefined }));

    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should set the title to \"Thank You \| The Standard\"', () => {
    titleService = TestBed.inject(Title);
    expect(titleService.getTitle()).toBe('Thank You | The Standard');
  });
});

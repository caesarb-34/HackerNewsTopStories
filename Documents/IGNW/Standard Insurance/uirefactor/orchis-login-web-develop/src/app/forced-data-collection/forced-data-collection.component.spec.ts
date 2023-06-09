import {waitForAsync, ComponentFixture, TestBed} from '@angular/core/testing';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute, Router} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';

import {NgIdleModule} from '@ng-idle/core';
import {MockIdleTimeoutComponent} from '../../test/idle-timeout-mock/mock-idle-timeout.component';
import {ModalModule} from 'ngx-bootstrap/modal';
import {of} from 'rxjs';
import {ForcedDataCollectionComponent} from './forced-data-collection.component';
import {AuthenticationService} from 'sfg-ng-brand-library';
import {StepIndicatorService} from '../shared/services/step-indicator.service';
import {ActivatedRouteStub, RouterStub} from '../../test/router-stubs';
import {ForcedDataCollectionService} from './forced-data-collection.service';
import {createSpyObjFromClass} from '../../test/test.helper';


describe('ForcedDataCollectionComponent', () => {
  let component: ForcedDataCollectionComponent;
  let fixture: ComponentFixture<ForcedDataCollectionComponent>;
  let activatedRoute: ActivatedRouteStub;
  let mockAuthenticationService: jasmine.SpyObj<AuthenticationService>;
  let titleService: Title;

  beforeEach(() => {
    activatedRoute = new ActivatedRouteStub();
  });

  beforeEach(waitForAsync(() => {
    mockAuthenticationService = createSpyObjFromClass(AuthenticationService);

    TestBed.configureTestingModule({
      declarations: [
        ForcedDataCollectionComponent,
        MockIdleTimeoutComponent
      ],
      imports: [
        RouterTestingModule,
        NgIdleModule.forRoot(),
        ModalModule.forRoot()
      ],
      providers: [
        StepIndicatorService,
        ForcedDataCollectionService,
        {provide: Title, useClass: Title},
        {provide: Router, useClass: RouterStub},
        {provide: ActivatedRoute, useValue: activatedRoute},
        {provide: AuthenticationService, useValue: mockAuthenticationService }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForcedDataCollectionComponent);
    component = fixture.componentInstance;
    mockAuthenticationService.validateAuthzPolicy.and.returnValue(of());
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should set the title to \"Time to Update \| The Standard\"', () => {
    titleService = TestBed.inject(Title);
    expect(titleService.getTitle()).toBe('Time to Update | The Standard');
  });
});

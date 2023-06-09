import {waitForAsync, ComponentFixture, TestBed} from '@angular/core/testing';
import {ActivatedRoute} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';

import {ForcedDataCheckEmailComponent} from './forced-data-check-email.component';
import {StepIndicatorService} from '../../shared/services/step-indicator.service';
import {ActivatedRouteStub} from '../../../test/router-stubs';


describe('ForcedDataCheckEmailComponent', () => {
  let component: ForcedDataCheckEmailComponent;
  let fixture: ComponentFixture<ForcedDataCheckEmailComponent>;
  let activatedRoute: ActivatedRouteStub;
  let spyStepIndicatorService: jasmine.Spy;
  let spyStepIndicatorH1: jasmine.Spy;
  let stepIndicatorService: StepIndicatorService;

  beforeEach(() => {
    activatedRoute = new ActivatedRouteStub();
  });

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        ForcedDataCheckEmailComponent
      ],
      imports: [
        RouterTestingModule
      ],
      providers: [
        StepIndicatorService,
        {provide: ActivatedRoute, useValue: activatedRoute},
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForcedDataCheckEmailComponent);
    component = fixture.componentInstance;
    stepIndicatorService = fixture.debugElement.injector.get(StepIndicatorService);
    spyStepIndicatorH1 = spyOn(stepIndicatorService, 'getH1Title').and.returnValue('My Title');
    spyStepIndicatorService = spyOn(stepIndicatorService, 'getSteps').and.returnValue([
        {
          index: 1,
          label: 'Update Contact Information',
          route: '/collect-contact-info'
        },
        {
          index: 2,
          label: 'Check your email',
          route: '/data-collection-email'
        }
      ]
    );
    activatedRoute.testQueryParams = {step: 2};
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

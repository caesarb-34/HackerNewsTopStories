import { waitForAsync, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Title } from '@angular/platform-browser';
import { TextMaskModule } from 'angular2-text-mask';
import {ModalModule} from 'ngx-bootstrap/modal';
// Components
import { SelfRegistrationComponent } from './self-registration.component';
import { StepIndicatorComponent } from '../shared-components/step-indicator/step-indicator.component';
import { CreateAccountComponent } from './create-account/create-account.component';
import { MessagePopupComponent } from '../shared-components/message-popup/message-popup.component';
// Services
import { SelfRegistrationService } from './self-registration.service';


describe('SelfRegistrationComponent', () => {
  let component: SelfRegistrationComponent;
  let fixture: ComponentFixture<SelfRegistrationComponent>;
  let titleService: Title;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ModalModule.forRoot(),
        TextMaskModule,
        RouterTestingModule
      ],
      declarations: [
        SelfRegistrationComponent,
        StepIndicatorComponent,
        MessagePopupComponent,
        CreateAccountComponent
      ],
      providers: [
        SelfRegistrationService
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.overrideComponent(StepIndicatorComponent, {
        set: { template: '<div id=\"StepIndicatorComponent\"></div>' }
      })
      .overrideComponent(CreateAccountComponent, {
        set: { template: '<div id=\"CreateAccountComponent\"></div>' }
      })
      .createComponent(SelfRegistrationComponent);

    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update the selectedStep', inject([SelfRegistrationService], (service: SelfRegistrationService) => {
    const step = 2;

    service.syncPageStep(step);

    expect(component.selectedStep).toEqual(step);
  }));

  it('should successfully subscribe to pageStepObservable', inject([SelfRegistrationService], (service: SelfRegistrationService) => {
    const step = 2;
    titleService = TestBed.inject(Title);

    service.syncPageStep(step);

    expect(titleService.getTitle()).toBe('Create a Password | The Standard');
    expect(component.selectedStep).toEqual(step);
    expect(component.stepLabel).toEqual(step - 1);
  }));
});

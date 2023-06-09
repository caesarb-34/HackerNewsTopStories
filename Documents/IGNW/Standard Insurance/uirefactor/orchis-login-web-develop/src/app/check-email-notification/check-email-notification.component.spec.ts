import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';

import { CheckEmailNotificationComponent } from './check-email-notification.component';
import { StepIndicatorComponent} from '../shared-components/step-indicator/step-indicator.component';


describe('CheckEmailNotificationComponent', () => {
  let component: CheckEmailNotificationComponent;
  let fixture: ComponentFixture<CheckEmailNotificationComponent>;
  let titleService: Title;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        CheckEmailNotificationComponent,
        StepIndicatorComponent
      ],
      providers: [
        {provide: Title, useClass: Title}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckEmailNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should set the title to \"Next Steps \| The Standard\"', () => {
    titleService = TestBed.inject(Title);
    expect(titleService.getTitle()).toBe('Next Steps | The Standard');
  });
});

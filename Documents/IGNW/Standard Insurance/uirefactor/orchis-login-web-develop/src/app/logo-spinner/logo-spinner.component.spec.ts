import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { LogoSpinnerComponent } from './logo-spinner.component';

describe('LogoSpinnerComponent', () => {
  let component: LogoSpinnerComponent;
  let fixture: ComponentFixture<LogoSpinnerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LogoSpinnerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogoSpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

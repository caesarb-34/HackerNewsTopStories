import { TestBed, inject } from '@angular/core/testing';

import { StepIndicatorService } from './step-indicator.service';

describe('StepIndicatorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StepIndicatorService]
    });
  });

  it('should be created', inject([StepIndicatorService], (service: StepIndicatorService) => {
    expect(service).toBeTruthy();
  }));
});

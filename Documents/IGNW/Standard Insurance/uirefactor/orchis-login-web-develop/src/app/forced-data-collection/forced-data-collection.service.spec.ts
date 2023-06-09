import { TestBed, inject } from '@angular/core/testing';

import { ForcedDataCollectionService } from './forced-data-collection.service';
import { StepIndicatorService } from '../shared/services/step-indicator.service';


describe('ForcedDataCollectionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ForcedDataCollectionService,
        StepIndicatorService
      ]
    });
  });

  it('should be created', inject([ForcedDataCollectionService], (service: ForcedDataCollectionService) => {
    expect(service).toBeTruthy();
  }));

  it('should be this.needsPasswordReset && (this.needsContactInfoResetEmail || this.needsContactInfoResetPhone) && OtpSetup',
    inject([
      ForcedDataCollectionService,
      StepIndicatorService
      ],
    (forcedDataCollectionService: ForcedDataCollectionService,
     stepIndicatorService: StepIndicatorService) => {
    const throwError = {
      data: {
        code: 'Authentication.Unauthenticated',
        message: 'Unauthenticated',
        details: {
          recovery: [
            { id: 'User.emailNotVerified', type: 'StaticErrorMessage' },
            { id: 'User.mobileNotVerified', type: 'StaticErrorMessage' },
            { id: 'User.passwordExpired', type: 'StaticErrorMessage' },
            { id: 'OtpSetup', type: 'StaticErrorMessage' }
          ]
        }
      }
    };

    forcedDataCollectionService.setStepIndicatorReturnNavigation(throwError);

    expect(forcedDataCollectionService.getNeedsPasswordReset()).toBeTruthy();
    expect(forcedDataCollectionService.getNeedsContactInfoResetEmail()).toBeTruthy();
    expect(forcedDataCollectionService.getNeedsContactInfoResetPhone()).toBeTruthy();
    expect(forcedDataCollectionService.getNeedsTwoFactorAuthentication()).toBeTruthy();
  }));

  it('should be this.needsPasswordReset && !(this.needsContactInfoResetEmail || this.needsContactInfoResetPhone) && !OtpSetup',
    inject([
        ForcedDataCollectionService,
        StepIndicatorService
      ],
      (forcedDataCollectionService: ForcedDataCollectionService,
       stepIndicatorService: StepIndicatorService) => {
        const throwError = {
          data: {
            code: 'Authentication.Unauthenticated',
            message: 'Unauthenticated',
            details: {
              recovery: [
                { id: 'User.passwordExpired', type: 'StaticErrorMessage' }
              ]
            }
          }
        };

        forcedDataCollectionService.setStepIndicatorReturnNavigation(throwError);

        expect(forcedDataCollectionService.getNeedsPasswordReset()).toBeTruthy();
        expect(forcedDataCollectionService.getNeedsContactInfoResetEmail()).toBeFalsy();
        expect(forcedDataCollectionService.getNeedsContactInfoResetPhone()).toBeFalsy();
        expect(forcedDataCollectionService.getNeedsTwoFactorAuthentication()).toBeFalsy();
  }));

  it('should be !this.needsPasswordReset && this.needsContactInfoResetEmail  && !OtpSetup',
    inject([
        ForcedDataCollectionService,
        StepIndicatorService
      ],
      (forcedDataCollectionService: ForcedDataCollectionService,
       stepIndicatorService: StepIndicatorService) => {
        const throwError = {
          data: {
            code: 'Authentication.Unauthenticated',
            message: 'Unauthenticated',
            details: {
              recovery: [
                { id: 'User.emailNotVerified', type: 'StaticErrorMessage' },
                { id: 'User.mobileNotVerified', type: 'StaticErrorMessage' }
              ]
            }
          }
        };

        forcedDataCollectionService.setStepIndicatorReturnNavigation(throwError);

        expect(forcedDataCollectionService.getNeedsPasswordReset()).toBeFalsy();
        expect(forcedDataCollectionService.getNeedsContactInfoResetEmail()).toBeTruthy();
        expect(forcedDataCollectionService.getNeedsTwoFactorAuthentication()).toBeFalsy();
  }));

  it('should be !this.needsPasswordReset && !this.needsContactInfoResetEmail && this.needsContactInfoResetPhone && !OtpSetup',
    inject([
        ForcedDataCollectionService,
        StepIndicatorService
      ],
      (forcedDataCollectionService: ForcedDataCollectionService,
       stepIndicatorService: StepIndicatorService) => {
        const throwError = {
          data: {
            code: 'Authentication.Unauthenticated',
            message: 'Unauthenticated',
            details: {
              recovery: [
                { id: 'User.mobileNotVerified', type: 'StaticErrorMessage' }
              ]
            }
          }
        };

        forcedDataCollectionService.setStepIndicatorReturnNavigation(throwError);

        expect(forcedDataCollectionService.getNeedsPasswordReset()).toBeFalsy();
        expect(forcedDataCollectionService.getNeedsContactInfoResetEmail()).toBeFalsy();
        expect(forcedDataCollectionService.getNeedsContactInfoResetPhone()).toBeTruthy();
        expect(forcedDataCollectionService.getNeedsTwoFactorAuthentication()).toBeFalsy();
  }));

  it('should be !this.needsPasswordReset && !this.needsContactInfoResetEmail && !this.needsContactInfoResetPhone && OtpSetup',
    inject([
        ForcedDataCollectionService,
        StepIndicatorService
      ],
      (forcedDataCollectionService: ForcedDataCollectionService,
       stepIndicatorService: StepIndicatorService) => {
        const throwError = {
          data: {
            code: 'Authentication.Unauthenticated',
            message: 'Unauthenticated',
            details: {
              recovery: [
                { id: 'OtpSetup', type: 'StaticErrorMessage' }
              ]
            }
          }
        };

        forcedDataCollectionService.setStepIndicatorReturnNavigation(throwError);

        expect(forcedDataCollectionService.getNeedsPasswordReset()).toBeFalsy();
        expect(forcedDataCollectionService.getNeedsContactInfoResetEmail()).toBeFalsy();
        expect(forcedDataCollectionService.getNeedsContactInfoResetPhone()).toBeFalsy();
        expect(forcedDataCollectionService.getNeedsTwoFactorAuthentication()).toBeTruthy();
      }));
});

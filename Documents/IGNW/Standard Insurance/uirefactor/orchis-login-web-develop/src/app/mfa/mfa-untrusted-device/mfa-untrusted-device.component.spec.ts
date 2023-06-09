import {waitForAsync, ComponentFixture, TestBed} from '@angular/core/testing';
import {By, Title} from '@angular/platform-browser';
import {Router, RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {NgIdleModule} from '@ng-idle/core';
import {AccordionModule} from 'ngx-bootstrap/accordion';
import {ModalModule} from 'ngx-bootstrap/modal';
import {of, throwError} from 'rxjs';
import {MockIdleTimeoutComponent} from '../../../test/idle-timeout-mock/mock-idle-timeout.component';

import {createSpyObjFromClass} from '../../../test/test.helper';
import MaskedUserIdentifiers from '../masked-user-identifiers.model';
import {MfaUntrustedDeviceComponent} from './mfa-untrusted-device.component';
import {AuthenticationService} from 'sfg-ng-brand-library';
import {RouterStub} from '../../../test/router-stubs';
import {MessagePopupComponent} from '../../shared-components/message-popup/message-popup.component';
import {OtpDeliveryChannel} from '../otp-delivery-channels.view.model';

/**
 * Reason for the dummy idle timeout component is:
 * idle-timeout component has its own setTimeout which interferes with the Async callback timeout
 */
describe('MfaUntrustedDeviceComponent', () => {
  let component: MfaUntrustedDeviceComponent;
  let fixture: ComponentFixture<MfaUntrustedDeviceComponent>;
  let ce: HTMLElement;
  let titleService: Title;
  let authService: jasmine.SpyObj<AuthenticationService>;
  const routerStub = new RouterStub();

  const mockMaskedIds: MaskedUserIdentifiers = {
    otpMfaDestination: '1521cd47-377d-4f52-9594-bc7270e41dde',
    otpMethod: 'E',
    emails: [
      {
        key: 'f4dc3deb-0f52-4df6-9097-e16ec339cc92',
        masked: 'd*********e@s*******.com',
        isDefault: true,
        isVerified: true
      }
    ],
    mobiles: [
      {
        key: 'b4af38e5-2678-4e47-8b6c-67b593d32944',
        masked: '******7890',
        isDefault: false,
        isVerified: false
      }
    ],
    phones: [
      {
        key: 'asd55adf-2341-23db-2bdb-6344df12abb',
        masked: '******1234',
        isDefault: false,
        isVerified: false
      }
    ]
  };

  beforeEach(waitForAsync(() => {
    authService = createSpyObjFromClass(AuthenticationService);

    TestBed.configureTestingModule({
      declarations: [
        MfaUntrustedDeviceComponent,
        MessagePopupComponent,
        MockIdleTimeoutComponent
      ],
      imports: [
        RouterModule,
        FormsModule,
        NgIdleModule.forRoot(),
        ModalModule.forRoot(),
        AccordionModule.forRoot()
      ],
      providers: [
        {provide: Router, useValue: routerStub},
        {provide: AuthenticationService, useValue: authService}
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MfaUntrustedDeviceComponent);
    component = fixture.componentInstance;
    ce = fixture.debugElement.nativeElement;

    authService = TestBed.inject(AuthenticationService) as jasmine.SpyObj<AuthenticationService>;
    authService.verifySession.and.returnValue(of({status: 200, headers: null, data: undefined}));
    authService.getMaskedUserIdentifiers.and.returnValue(of({status: 200, headers: null, data: undefined}));

    spyOn(window.console, 'log').and.callFake(() => {});

    fixture.detectChanges();
  });


  describe('Title', () => {
    beforeEach(() => {
      spyOn(component, 'getUserOtpDeliveryChannelOptions').and.callFake(() => {});
    });

    it('should be set to \"Send Code | The Standard\"', () => {
      titleService = TestBed.inject(Title);
      authService.getMaskedUserIdentifiers
        .and.returnValue(of({status: 200, headers: null, data: mockMaskedIds}));

      component.ngOnInit();
      expect(titleService.getTitle()).toBe('Send Code | The Standard');
    });
  });

  describe('View', () => {

    describe('when Preferred channel exits, but no other channels', () => {

      // create mock response from AuthenticationService.getMaskedIdentifiers to this test
      const mockMaskedIdentifiersEmailPreferred = {
        otpMfaDestination: 'f4dc3deb-0f52-4df6-9097-e16ec339cc92',
        otpMethod: 'E',
        emails: [
          {
            key: 'f4dc3deb-0f52-4df6-9097-e16ec339cc92',
            masked: 'd*********e@s*******.com',
            isDefault: true,
            isVerified: true
          },
          {
            key: '1ff79c5b-77c2-470a-84e5-86c3d0dde9a0',
            masked: 'i**********s@g****.com',
            isDefault: false,
            isVerified: false
          }
        ],
        mobiles: [
          {
            key: 'b4af38e5-2678-4e47-8b6c-67b593d32944',
            masked: '******7890',
            isDefault: false,
            isVerified: false
          }
        ],
        phones: [
          {
            key: 'b4af38e5-2678-4e47-8b6c-67b593d31122',
            masked: '******1234',
            isDefault: false,
            isVerified: false
          }
        ]
      };

      it('should have element with id="default-otp-channel" display correct mfaOtpDestination', waitForAsync(() => {
        authService.getMaskedUserIdentifiers.and.returnValue(
            of({status: 200, headers: null, data: mockMaskedIdentifiersEmailPreferred})
        );
        component.showChannelList = true;
        component.ngOnInit();
        fixture.detectChanges();
        // wait for it ..
        fixture.whenStable().then(() => {
          const defaultDeliveryChannelSpan = fixture.debugElement.query(By.css('#default-otp-channel')).nativeElement;
          expect(defaultDeliveryChannelSpan.innerHTML).toContain(component.displayLabels['E']);
          expect(defaultDeliveryChannelSpan.innerHTML).toContain(component.viewModel.preferredChannel.masked);
        });
      }));

      it('should not display the channel list with alt channel when no items in list', waitForAsync(() => {
        authService.getMaskedUserIdentifiers.and.returnValue(
            of({status: 200, headers: null, data: mockMaskedIdentifiersEmailPreferred})
        );
        component.showChannelList = true;
        component.ngOnInit();
        fixture.detectChanges();
        // wait for it ..
        fixture.whenStable().then(() => {
          /*
           * the preferred channel is automatically pulled into alt list of channels so it can be an option
           * but don't display the channel list with 1 entry (that is preferred)
           */
          expect(component.viewModel.altChannels.length).toBe(1); // because preferred is there automatically
          const accordions = ce.querySelectorAll('.lgn-otp-channel-option');
          expect(accordions.length).toBe(0);
        });
      }));

      it('should route to login if verify session returns an error', () => {
        authService.verifySession.and.returnValue(throwError({}));
        component.ngOnInit();

        expect(routerStub.routes).toContain('/login');
      });
    });


    describe('when Preferred channel is mobile, and one other default', () => {

      // create mock response from AuthenticationService.getMaskedIdentifiers to this test
      const mockMaskedIdentifiersMobileVoicePreferred = {
        otpMfaDestination: '1521cd47-377d-4f52-9594-bc7270e41dde',
        otpMethod: 'V',
        emails: [
          {
            key: 'f4dc3deb-0f52-4df6-9097-e16ec339cc92',
            masked: 'd*********e@s*******.com',
            isDefault: true,
            isVerified: true
          },
          {
            key: '1ff79c5b-77c2-470a-84e5-86c3d0dde9a0',
            masked: 'i**********s@g****.com',
            isDefault: false,
            isVerified: false
          }
        ],
        mobiles: [
          {
            key: 'b4af38e5-2678-4e47-8b6c-67b593d32944',
            masked: '******7890',
            isDefault: false,
            isVerified: false
          },
          {
            key: '1521cd47-377d-4f52-9594-bc7270e41dde',
            masked: '******7891',
            isDefault: true,
            isVerified: true
          }
        ],
        phones: [
          {
            key: 'asd55adf-2341-23db-2bdb-6344df12abb',
            masked: '******1234',
            isDefault: false,
            isVerified: false
          }
        ]
      };

      /*
       * expect three alt channels:
       * 1. the preferred itself - enabling user to flip-flop with input buttons
       *
       * and even there is only one "isDefault" found in "mobiles", it can be used for both, Voice and Text
       *
       * 2.text to "mobile"
       * 3.voice call to that same "mobile"
       */
      it('should display alt options channel list with 3 channels', waitForAsync(() => {
        authService.getMaskedUserIdentifiers.and.returnValue(
            of({ status: 200, headers: null, data: mockMaskedIdentifiersMobileVoicePreferred })
        );
        component.getUserOtpDeliveryChannelOptions();
        component.showChannelList = true;

        // wait for it ..
        fixture.whenStable().then(() => {
          fixture.detectChanges();
          expect(authService.getMaskedUserIdentifiers).toHaveBeenCalled();
          expect(component.viewModel.altChannels.length).toBe(3);
          const channelOptions = fixture.debugElement.nativeElement.querySelectorAll('.lgn-otp-channel-option');
          expect(channelOptions.length).toBe(3);
        });

      }));

      it('should set the active error when getMaskedUserIdentifiers returns an error', () => {
        component.activeError = null;
        authService.getMaskedUserIdentifiers
          .and.returnValue(throwError({status: 404}));

        component.getUserOtpDeliveryChannelOptions();
        expect(component.activeError).toBe(404);
      });
    });

  });


  describe('when Preferred channel is mobile plus two other defaults (email and phone)', () => {
    const mockMaskedIdentifiersMobileTextPreferred = {
      otpMfaDestination: '1521cd47-377d-4f52-9594-bc7270e41dde',
      otpMethod: 'M',
      emails: [
        {
          key: 'f4dc3deb-0f52-4df6-9097-e16ec339cc92',
          masked: 'd*********e@s*******.com',
          isDefault: true,
          isVerified: true
        },
        {
          key: '1ff79c5b-77c2-470a-84e5-86c3d0dde9a0',
          masked: 'i**********s@g****.com',
          isDefault: false,
          isVerified: false
        }
      ],
      mobiles: [
        {
          key: 'b4af38e5-2678-4e47-8b6c-67b593d32944',
          masked: '******7890',
          isDefault: false,
          isVerified: false
        },
        {
          key: '1521cd47-377d-4f52-9594-bc7270e41dde',
          masked: '******7891',
          isDefault: true,
          isVerified: true
        }
      ],
      phones: [
        {
          key: 'asd55adf-2341-23db-2bdb-6344df12abb',
          masked: '******1234',
          isDefault: false,
          isVerified: false
        },
        {
          key: '43be4b2c-2281-420f-9936-759da03afad7',
          masked: '******3211',
          isDefault: false,
          isVerified: false
        }, {
          key: '7ffc6e9b-6705-48e7-8fa7-413de9225a46',
          masked: '******3210',
          isDefault: true,
          isVerified: true
        }
      ]
    };

    /*
     * expect four alternate channels:
     * 1. preferred itself (as TEXT)  - enabling user to flip-flop with input buttons
     *
     *    but b/c it is "mobile" it will appear in alternate list as two entries
     *
     * 2. preferred itself (as VOICE)
     *
     * 3.email
     * 4.voice call to "phone"
     */
    it('should display alt options channel list with 4 channels', waitForAsync(() => {
      authService.getMaskedUserIdentifiers
        .and.returnValue(of({status: 200, headers: null, data: mockMaskedIdentifiersMobileTextPreferred}));

      component.getUserOtpDeliveryChannelOptions();
      component.showChannelList = true;

      // wait for it ..
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        expect(authService.getMaskedUserIdentifiers).toHaveBeenCalled();
        expect(component.viewModel.altChannels.length).toBe(4);
        const channelOptions = fixture.debugElement.nativeElement.querySelectorAll('.lgn-otp-channel-option');
        expect(channelOptions.length).toBe(4);
      });
    }));
  });

  describe('===> onSubmit()', () => {
    // create mock response from AuthenticationService.getMaskedIdentifiers to this test
    const testChannelList = {
      otpMfaDestination: '1521cd47-377d-4f52-9594-bc7270e41dde',
      otpMethod: 'M',
      emails: [
        {
          key: 'f4dc3deb-0f52-4df6-9097-e16ec339cc92',
          masked: 'd*********e@s*******.com',
          isDefault: true,
          isVerified: true
        },
        {
          key: '1ff79c5b-77c2-470a-84e5-86c3d0dde9a0',
          masked: 'i**********s@g****.com',
          isDefault: false,
          isVerified: false
        }
      ],
      mobiles: [
        {
          key: 'b4af38e5-2678-4e47-8b6c-67b593d32944',
          masked: '******7890',
          isDefault: false,
          isVerified: false
        },
        {
          key: '1521cd47-377d-4f52-9594-bc7270e41dde',
          masked: '******7891',
          isDefault: true,
          isVerified: true
        }
      ],
      phones: [
        {
          key: 'asd55adf-2341-23db-2bdb-6344df12abb',
          masked: '******1234',
          isDefault: false,
          isVerified: false
        }
      ]
    };

    it('should call requestSendAuthenticationOtp() with selected channel when one is selected', () => {
      authService.getMaskedUserIdentifiers
        .and.returnValue(of({status: 200, headers: null, data: testChannelList}));
      component.ngOnInit();
      const spyReqSendAuthOtp = spyOn(component, 'requestSendAuthenticationOtp');
      const testValue = {
        type: 'E',
        key: 'f4dc3deb-0f52-4df6-9097-e16ec339cc92',
        masked: 'd*********e@s*******.com',
        preferred: false
      };
      component.showChannelList = true;
      component.viewModel.selectedChannel = testValue;
      component.onSubmit();

      const preferredAltChannel = component.viewModel.altChannels.find(item => item.preferred === true );

      expect(preferredAltChannel.key).toBe(component.viewModel.preferredChannel.key);
      expect(spyReqSendAuthOtp).toHaveBeenCalledWith(testValue);
    });

    it('should call requestSendAuthenticationOtp() with preferred channel when one is not selected', () => {
      authService.getMaskedUserIdentifiers
        .and.returnValue(of({status: 200, headers: null, data: testChannelList}));
      component.ngOnInit();
      const spyReqSendAuthOtp = spyOn(component, 'requestSendAuthenticationOtp');
      const preferred: OtpDeliveryChannel = {
        preferred: true,
        key: '1521cd47-377d-4f52-9594-bc7270e41dde',
        masked: '******7891',
        type: 'M'
      };
      component.showChannelList = true;
      component.viewModel.selectedChannel = null;
      component.onSubmit();

      expect(spyReqSendAuthOtp).toHaveBeenCalledWith(jasmine.objectContaining(preferred));
    });
  });

  describe('===> requestSendAuthenticationOtp()', () => {

    it('should set the queryParam \'mfaAltChannel\' to true and navigate when using preferred channel', () => {
      const testValuePreferred = {
        key: '707fc2a9-86b7-401d-83f2-d60cba88d406',
        masked: '******1358',
        preferred: true,
        type: 'M'
      };

      const queryParamsList = {
        mfaOrigin: 'untrustedDevice',
        otpChannel: testValuePreferred.type,
        key: testValuePreferred.key,
        mfaAltChannel: true
      };

      authService.sendAuthenticationOtp.and.returnValue(of({status: 200, headers: null, data: undefined}));
      component.requestSendAuthenticationOtp(testValuePreferred);

      expect(routerStub.routes.toString()).toContain([component.routeToAuthenticateWithOtp].toString());
      expect(routerStub.nav_extras.toString()).toEqual({queryParams: queryParamsList}.toString());
    });

    it('should not set the queryParam \'mfaAltChannel\', but navigate when using alternate channel', () => {
      const testValueNonPreferred = {
        key: '707fc2a9-86b7-401d-83f2-d60cba88d406',
        masked: '******1358',
        preferred: false,
        type: 'M'
      };
      const queryParamsList = {
        mfaOrigin: 'untrustedDevice',
        otpChannel: testValueNonPreferred.type,
        key: testValueNonPreferred.key
      };

      authService.sendAuthenticationOtp.and.returnValue(of({status: 200, headers: null, data: undefined}));
      component.requestSendAuthenticationOtp(testValueNonPreferred);

      expect(routerStub.routes.toString()).toEqual([component.routeToAuthenticateWithOtp].toString());
      expect(routerStub.nav_extras.toString()).toEqual({queryParams: queryParamsList}.toString());
    });

    it('should set the active error when observable throws error', () => {
      const testValueNonPreferred = {
        key: '707fc2a9-86b7-401d-83f2-d60cba88d406',
        masked: '******1358',
        preferred: false,
        type: 'M'
      };
      component.activeError = null;
      authService.sendAuthenticationOtp.and.returnValue(throwError({status: 101, headers: null, data: undefined}));

      component.requestSendAuthenticationOtp(testValueNonPreferred);

      expect(component.activeError).toBe(101);
    });
  });

});

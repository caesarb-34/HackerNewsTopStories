import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import {Title} from '@angular/platform-browser';
import {NgIdleModule} from '@ng-idle/core';
import {FormsModule} from '@angular/forms';
import {MockIdleTimeoutComponent} from '../../../test/idle-timeout-mock/mock-idle-timeout.component';
import {ModalModule} from 'ngx-bootstrap/modal';
import {of, throwError} from 'rxjs';
import {createSpyObjFromClass} from '../../../test/test.helper';
import {DialogContent} from '../../shared/models/dialog-content.model';

import {ForcedMfaComponent} from './forced-mfa.component';
import {StepIndicatorService} from '../../shared/services/step-indicator.service';
import {AuthenticationService} from 'sfg-ng-brand-library';
import {ActivatedRouteStub} from '../../../test/router-stubs';
import {DrupalContentService} from '../../shared/services/drupal-content.service';
import {MessagePopupComponent} from '../../shared-components/message-popup/message-popup.component';
import {PhonePipe} from '../../shared/pipes/phone.pipe';


describe('ForcedMfaComponent', () => {

  describe('===> TestBed tests', () => {

    let component: ForcedMfaComponent;
    let fixture: ComponentFixture<ForcedMfaComponent>;
    let stepService;
    let cmService: jasmine.SpyObj<DrupalContentService>;
    let authService: jasmine.SpyObj<AuthenticationService>;
    let activatedRoute: ActivatedRouteStub;
    let titleService: Title;
    let compiledElem: HTMLElement;

    const router = {
      navigate: jasmine.createSpy('navigate')
    };

    const mockMaskedUserData = {
      data: {
        emails: [{
          key: 'f4dc3deb-0f52-4df6-9097-e16ec339cc92',
          masked: 'd*********e@s*******.com',
          isDefault: false,
          isVerified: false
        }, {
          key: '1ff79c5b-77c2-470a-84e5-86c3d0dde9a0',
          masked: 'i**********s@g****.com',
          isDefault: true,
          isVerified: true
        }],
        otpMethod: 'E',
        mobiles: [{
          key: 'b4af38e5-2678-4e47-8b6c-67b593d32944',
          masked: '******7890',
          isDefault: true,
          isVerified: true
        }, {
          key: '1521cd47-377d-4f52-9594-bc7270e41dde',
          masked: '******7891',
          isDefault: false,
          isVerified: false
        }],
        phones: [{
          key: '43be4b2c-2281-420f-9936-759da03afad7',
          masked: '******3211',
          isDefault: true,
          isVerified: true
        }, {
          key: '7ffc6e9b-6705-48e7-8fa7-413de9225a46',
          masked: '******3210',
          isDefault: false,
          isVerified: false
        }],
        otpMfaDestination: 'f4dc3deb-0f52-4df6-9097-e16ec339cc92'
      }
    };

    const testDrupalContent: Array<DialogContent> = [{
      id: 'id1',
      title: 'title1',
      body: 'body1',
      size: 'large1'
    }, {
      id: 'id2',
      title: 'title2',
      body: 'body2',
      size: 'large2'
    }];

    const testOtpMethodData = {
      body: {
        maskIdentifierKey: '6d4ab234-8fd3-4d3c-be27-8794621d9e1b',
        otpMethod: 'E'
      }
    };

    beforeEach(waitForAsync(() => {
      authService = createSpyObjFromClass(AuthenticationService);
      cmService = createSpyObjFromClass(DrupalContentService);
      activatedRoute = new ActivatedRouteStub();

      TestBed.configureTestingModule({
        declarations: [ // Components
          ForcedMfaComponent,
          MessagePopupComponent,
          PhonePipe,
          MockIdleTimeoutComponent
        ],
        imports: [ // Modules
          RouterModule,
          ModalModule.forRoot(),
          NgIdleModule.forRoot(),
          FormsModule
        ],
        providers: [ // Services
          StepIndicatorService,
          {provide: AuthenticationService, useValue: authService},
          {provide: DrupalContentService, useValue: cmService},
          {provide: Router, useValue: router},
          {provide: ActivatedRoute, useValue: activatedRoute},
          {provide: Title, useClass: Title}
        ]
      })
      .compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(ForcedMfaComponent);
      component = fixture.componentInstance;
      compiledElem = fixture.debugElement.nativeElement;
      stepService = fixture.debugElement.injector.get(StepIndicatorService);
      authService = TestBed.inject(AuthenticationService) as jasmine.SpyObj<AuthenticationService>;
      cmService = TestBed.inject(DrupalContentService) as jasmine.SpyObj<DrupalContentService>;

      authService.getMaskedUserIdentifiers
      .and.returnValue(of({status: 200, headers: null, data: mockMaskedUserData}));
      authService.verifySession
      .and.returnValue(of({status: 200, headers: null, data: mockMaskedUserData}));

      fixture.detectChanges();
    });

    it('should be created', () => {
      expect(component).toBeTruthy();
    });

    it('should set the title to \"MFA Preference \| The Standard\"', () => {
      titleService = TestBed.inject(Title);
      expect(titleService.getTitle()).toBe('MFA Preference | The Standard');
    });

    it('should redirect to login if validSession returns an error', () => {
      authService.verifySession
      .and.returnValue(throwError({status: 200, headers: null, data: mockMaskedUserData}));

      component.validateSession();
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });

    it('should show mfa modal when type is [mfaInfoModal]', () => {
      component.mfaDoIHaveToModalContent = null;
      component.mfaInfoModalContent = {id: null, title: null, body: null, size: null};
      cmService.getContent.and.returnValue(of(testDrupalContent));

      component.showModal('mfaInfoModal');
      fixture.detectChanges();
      expect(component.mfaInfoModalContent).toBe(testDrupalContent[0]);
    });

    it('should show mfa modal when type is [mfaDoIHaveToModal]', () => {
      component.mfaDoIHaveToModalContent = null;
      component.mfaInfoModalContent = null;
      cmService.getContent.and.returnValue(of(testDrupalContent));
      component.showModal('anything');
      expect(component.mfaDoIHaveToModalContent).toBe(testDrupalContent[0]);
      expect(component.mfaInfoModalContent).toBeNull();
    });

    it('should show user\'s default email, verified phone, and verified mobile ', () => {
      spyOn(component, 'validateSession').and.callFake(() => {
      });
      authService.getMaskedUserIdentifiers
      .and.returnValue(of({status: 200, headers: null, data: mockMaskedUserData.data}));

      component.ngOnInit();
      fixture.detectChanges();

      expect(component.identifiers).toEqual(mockMaskedUserData.data);
    });

    it('should log an error if user data is not returned', () => {
      authService.getMaskedUserIdentifiers.and.returnValue(throwError({status: 400}));
      expect(component.userData).toBeFalsy();
    });

    it('should error if form is not valid', () => {
      authService.getMaskedUserIdentifiers
      .and.returnValue(of({status: 200, headers: null, data: mockMaskedUserData}));
      const spyOnMfaMethod = authService.setupOtpMfa
      .and.returnValue(throwError({status: 204}));
      component.onSubmit();
      expect(spyOnMfaMethod).not.toHaveBeenCalled();
    });


    it('should post otpMethod', () => {
      authService.getMaskedUserIdentifiers
      .and.returnValue(of({status: 200, headers: null, data: mockMaskedUserData}));
      authService.setupOtpMfa.and.returnValue(of({status: 200, headers: null, data: undefined}));
      authService.setupMfaMethod.and.returnValue(of({status: 200, headers: null, data: undefined}));
      const spySendOtpMethod = spyOn(component, 'sendOtpMethod');
      component.collectedInputValue = 'E';
      component.onSubmit();

      expect(spySendOtpMethod).toHaveBeenCalled();
    });

    it('onSubmit should output error to console when post errors out', () => {
      authService.setupMfaMethod.and.returnValue(throwError({}));
      const spyConsole = spyOn(window.console, 'log').and.callThrough();
      component.collectedInputValue = 'E';
      component.onSubmit();
      expect(spyConsole).toHaveBeenCalledWith('post error');
    });

    it('should popup a message box if there is a 4xx error', () => {
      authService.getMaskedUserIdentifiers
      .and.returnValue(of({status: 200, headers: null, data: mockMaskedUserData}));
      authService.setupOtpMfa.and.returnValue(of({status: 409, headers: null, data: undefined}));

      component.activeError = '409';
      fixture.detectChanges();

      const messagePopup = compiledElem.querySelector('lgn-message-popup');
      expect(messagePopup).not.toBeNull();
      expect(messagePopup.textContent).toContain('Something went wrong');
    });

  });

  describe('===> functional tests', () => {
    let component: ForcedMfaComponent;

    const mockMaskedUserData = {
      data: {
        emails: [{
          key: 'f4dc3deb-0f52-4df6-9097-e16ec339cc92',
          masked: 'd*********e@s*******.com',
          isDefault: false,
          isVerified: false
        }, {
          key: '1ff79c5b-77c2-470a-84e5-86c3d0dde9a0',
          masked: 'i**********s@g****.com',
          isDefault: true,
          isVerified: true
        }],
        otpMethod: 'E',
        mobiles: [{
          key: 'b4af38e5-2678-4e47-8b6c-67b593d32944',
          masked: '******7890',
          isDefault: true,
          isVerified: true
        }, {
          key: '1521cd47-377d-4f52-9594-bc7270e41dde',
          masked: '******7891',
          isDefault: false,
          isVerified: false
        }],
        phones: [{
          key: '43be4b2c-2281-420f-9936-759da03afad7',
          masked: '******3211',
          isDefault: true,
          isVerified: true
        }, {
          key: '7ffc6e9b-6705-48e7-8fa7-413de9225a46',
          masked: '******3210',
          isDefault: false,
          isVerified: false
        }],
        otpMfaDestination: 'f4dc3deb-0f52-4df6-9097-e16ec339cc92'
      }
    };

    beforeEach(() => {
      component = new ForcedMfaComponent(
        createSpyObjFromClass(StepIndicatorService),
        createSpyObjFromClass(Router),
        createSpyObjFromClass(Title),
        createSpyObjFromClass(ActivatedRoute),
        createSpyObjFromClass(DrupalContentService),
        createSpyObjFromClass(AuthenticationService)
      );
    });

    describe('=== renderMobileForSmsAndVoice', () => {
      // false, true
      it('should set voice masked value to mobile masked value when mobile is default and phone is not', () => {
        const phone = mockMaskedUserData.data.mobiles[0];
        const mobile = mockMaskedUserData.data.phones[1];
        component.renderMobileForSmsAndVoice(phone, mobile);

        expect(component.isMfaRadioInputEnabled.phones).toBeFalsy();
        expect(component.isMfaRadioInputEnabled.mobiles).toBeFalsy();
      });

      // true, false
      it('should not set voice masked value to mobile masked value when mobile is not default and phone is default', () => {
        const phone = mockMaskedUserData.data.mobiles[1];
        const mobile = mockMaskedUserData.data.phones[0];
        component.renderMobileForSmsAndVoice(phone, mobile);

        expect(component.isMfaRadioInputEnabled.phones).toBeTruthy();
        expect(component.isMfaRadioInputEnabled.mobiles).toBeTruthy();
      });

      // false, false
      it('should NOT set voice masked value to mobile masked value when mobile and phone is not default', () => {
        const phone = mockMaskedUserData.data.mobiles[0];
        const mobile = mockMaskedUserData.data.phones[0];
        component.renderMobileForSmsAndVoice(phone, mobile);

        expect(component.isMfaRadioInputEnabled.phones).toBeFalsy();
        expect(component.isMfaRadioInputEnabled.mobiles).toBeFalsy();
      });

      // true, true
      it('should NOT set voice masked value to mobile masked value when mobile and phone isDefault', () => {
        const phone = mockMaskedUserData.data.mobiles[1];
        const mobile = mockMaskedUserData.data.phones[1];
        component.renderMobileForSmsAndVoice(phone, mobile);

        expect(component.isMfaRadioInputEnabled.phones).toBeFalsy();
        expect(component.isMfaRadioInputEnabled.mobiles).toBeFalsy();
      });
    });

    describe('=== extractMaskedContactPreference', () => {
      it('should return the default contact preference for email', () => {
        const mockDefaultEmail = mockMaskedUserData.data.emails[1];
        component.identifiers = mockMaskedUserData.data;
        const defaultEmail = component.extractMaskedContactPreference('emails');
        expect(defaultEmail).toEqual(mockDefaultEmail);
      });

      it('should return the default contact preference for phone', () => {
        const mockDefaultPhone = mockMaskedUserData.data.phones[0];
        component.identifiers = mockMaskedUserData.data;
        const defaultPhone = component.extractMaskedContactPreference('phones');
        expect(defaultPhone).toEqual(mockDefaultPhone);
      });

      it('should return the default contact preference for mobile', () => {
        const mockDefaultMobile = mockMaskedUserData.data.mobiles[0];
        component.identifiers = mockMaskedUserData.data;
        const defaultPhone = component.extractMaskedContactPreference('mobiles');
        expect(defaultPhone).toEqual(mockDefaultMobile);
      });
    });
  });
});

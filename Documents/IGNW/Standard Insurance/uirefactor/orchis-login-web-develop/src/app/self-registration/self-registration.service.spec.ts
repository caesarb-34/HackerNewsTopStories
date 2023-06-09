import { TestBed, inject } from '@angular/core/testing';
import { Router } from '@angular/router';
import {of} from 'rxjs';

import { SelfRegistrationService } from './self-registration.service';
import { UserRegistrationModel } from '../shared/models/user.registration.model';
import { RouterStub } from '../../test/router-stubs';


describe('SelfRegistrationService', () => {
  const routerStub = new RouterStub();

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SelfRegistrationService,
        {provide: Router, useValue: routerStub}
      ]
    });
  });

  it('should be created', inject([SelfRegistrationService], (service: SelfRegistrationService) => {
    expect(service).toBeTruthy();
  }));

  it('should setNewUserInformation with mobile device', inject([SelfRegistrationService], (service: SelfRegistrationService) => {
    const testUserInfoMobile: UserRegistrationModel = {
      uid: undefined,
      password: undefined,
      firstName: 'Dan',
      lastName: 'DMan',
      email: 'happy@lol.com',
      mobile: '1357924680',
      isMobile: true
    };

    const outputExpectedMobile: UserRegistrationModel = new UserRegistrationModel();

    outputExpectedMobile.uid = undefined;
    outputExpectedMobile.password = undefined;
    outputExpectedMobile.firstName = 'Dan';
    outputExpectedMobile.lastName = 'DMan';
    outputExpectedMobile.email = 'happy@lol.com';
    outputExpectedMobile.mfaMethod = 'NONE';
    outputExpectedMobile.middleName = undefined;
    outputExpectedMobile.phone = undefined;
    outputExpectedMobile.mobile = '1357924680';
    outputExpectedMobile.isMobile = true;

    service.setNewUserInformation(testUserInfoMobile);
    expect(service.getUserInformation()).toEqual(outputExpectedMobile);
  }));

  it('should setNewUserInformation with landline device', inject([SelfRegistrationService], (service: SelfRegistrationService) => {
    const testUserInfoPhone: UserRegistrationModel = {
      uid: '',
      password: '',
      firstName: 'Dan',
      lastName: 'DMan',
      email: 'happy@lol.com',
      mobile: '1357924680',
      isMobile: false
    };

    const outputExpectedPhone: UserRegistrationModel = new UserRegistrationModel();

    outputExpectedPhone.uid = undefined;
    outputExpectedPhone.password = undefined;
    outputExpectedPhone.firstName = 'Dan';
    outputExpectedPhone.lastName = 'DMan';
    outputExpectedPhone.email = 'happy@lol.com';
    outputExpectedPhone.mfaMethod = 'NONE';
    outputExpectedPhone.middleName = undefined;
    outputExpectedPhone.phone = '1357924680';
    outputExpectedPhone.mobile = undefined;
    outputExpectedPhone.isMobile = false;

    service.setNewUserInformation(testUserInfoPhone);
    expect(service.getUserInformation()).toEqual(outputExpectedPhone);
  }));

  it('should setNewUserIdAndPassword', inject([SelfRegistrationService], (service: SelfRegistrationService) => {
    const testUserInfoID: UserRegistrationModel = {
      uid: 'TitleWavesRule',
      password: 'Password12345',
      firstName: '',
      lastName: '',
      email: ''
    };

    const outputExpectedID: UserRegistrationModel = new UserRegistrationModel();

    outputExpectedID.uid = 'TitleWavesRule';
    outputExpectedID.uid = 'TitleWavesRule';
    outputExpectedID.password = 'Password12345';
    outputExpectedID.firstName = '';
    outputExpectedID.lastName = '';
    outputExpectedID.email = '';
    outputExpectedID.mfaMethod = 'NONE';
    outputExpectedID.middleName = undefined;
    outputExpectedID.phone = undefined;
    outputExpectedID.mobile = undefined;
    outputExpectedID.isMobile = undefined;

    service.setNewUserIdAndPassword(testUserInfoID);
    expect(service.getUserInformation()).toEqual(outputExpectedID);
  }));

  it('should registerUser', inject([SelfRegistrationService], (service: SelfRegistrationService) => {
    const spyRegisterCall = spyOn(service, 'registerCall').and.returnValue(of({status: 200, headers: null, data: undefined}));

    service.registerUser('/register/step3');
    expect(spyRegisterCall).toHaveBeenCalled();
  }));

});

import {waitForAsync} from '@angular/core/testing';
import {IResponse} from 'cloudentityjs/dist/typings/core/Request';
import User from '../models/user.model';
import {AccountService} from './account.service';

/// Tests ///

describe('AccountService', () => {

  let accountService: AccountService;

  describe('===> getUser()', () => {
    it('should return a new user object when response is successful', waitForAsync(() => {
      accountService = new AccountService();

      const testUser: User = {
        uuid: '123456'
      };

      const testResp: IResponse = { status: 200, data: testUser, headers: null };
      spyOn(accountService.cjs, 'getUser').and.returnValue(Promise.resolve(testResp));

      accountService.getUser().subscribe(next => {
        expect(next).toEqual(testUser);
      }, fail);
    }));
  });

  describe('===> activateUser()', () => {
    it('should return a response object when both code and password provided and response is successful', waitForAsync(() => {
      accountService = new AccountService();

      const testCode = 'abc123';
      const testPw = 'HelloThere!';
      const expectedCallObject = {
        body: { code: testCode, password: testPw }
      };

      const testResp: IResponse = { status: 200, data: {}, headers: null };
      spyOn(accountService.cjs, 'activateByEmail').and.returnValue(Promise.resolve(testResp));

      accountService.activateUser(testCode, testPw).subscribe(next => {
        expect(next).toEqual(testResp);
        expect(accountService.cjs.activateByEmail).toHaveBeenCalledWith(expectedCallObject);
      }, fail);
    }));

    it('should return a response object when only code provided and response is successful', waitForAsync(() => {
      accountService = new AccountService();

      const testCode = 'abc123';
      const expectedCallObject = {
        body: { code: testCode }
      };

      const testResp: IResponse = {
        status: 200,
        data: {},
        headers: null
      };
      spyOn(accountService.cjs, 'activateByEmail').and.returnValue(Promise.resolve(testResp));

      accountService.activateUser(testCode).subscribe(next => {
        expect(next).toEqual(testResp);
        expect(accountService.cjs.activateByEmail).toHaveBeenCalledWith(expectedCallObject);
      }, fail);
    }));
  });

  describe('===> resendActivationEmail()', () => {
    it('should return a response object when only code is provided and response is successful', waitForAsync(() => {
      accountService = new AccountService();

      const testCode = 'abc123';
      const expectedCallObject = {
        body: { code: testCode }
      };

      const testResp: IResponse = { status: 200, data: {}, headers: null };
      spyOn(accountService.cjs, 'resendActivationEmail').and.returnValue(Promise.resolve(testResp));

      accountService.resendActivationEmail(testCode).subscribe(next => {
        expect(next).toEqual(testResp);
        expect(accountService.cjs.resendActivationEmail).toHaveBeenCalledWith(expectedCallObject);
      }, fail);
    }));

    it('should return a response object when both code, identifier, destination provided and response is successful', waitForAsync(() => {
      accountService = new AccountService();

      const testCode = undefined;
      const testId = 'test-id';
      const testDestination = 'test-dest';
      const expectedCallObject = {
        body: {
          identifier: testId,
          destination: testDestination,
          destinationType: 'E'
        }
      };

      const testResp: IResponse = { status: 200, data: {}, headers: null };
      spyOn(accountService.cjs, 'resendActivationEmail').and.returnValue(Promise.resolve(testResp));

      accountService.resendActivationEmail(testCode, testId, testDestination).subscribe(next => {
        expect(next).toEqual(testResp);
        expect(accountService.cjs.resendActivationEmail).toHaveBeenCalledWith(expectedCallObject);
      }, fail);
    }));
  });

  describe('===> updateAndGenerateVerification()', () => {
    it('should call cjs.updateAndGenerateVerification() when updateAndGenerateVerification() is called', waitForAsync(() => {
      accountService = new AccountService();

      const testUser: User = {
        uuid: '123456'
      };
      const testResp: IResponse = { status: 200, data: {}, headers: null };

      spyOn(accountService.cjs, 'updateAndGenerateVerification').and.returnValue(Promise.resolve([testResp]));

      accountService.updateAndGenerateVerification(testUser).subscribe(next => {
        expect(accountService.cjs.updateAndGenerateVerification).toHaveBeenCalledWith({ user: testUser });
      }, fail);
    }));
  });

  describe('===> updateUser()', () => {
    it('should call cjs.updateUser() when updateUser() is called', waitForAsync(() => {
      accountService = new AccountService();

      const testUser: User = {
        uuid: '123456'
      };
      const testResp: IResponse = { status: 200, data: {}, headers: null };

      spyOn(accountService.cjs, 'updateUser').and.returnValue(Promise.resolve(testResp));

      accountService.updateUser(testUser).subscribe(next => {
        expect(accountService.cjs.updateUser).toHaveBeenCalledWith({ user: testUser });
      }, fail);
    }));
  });

  describe('===> listDevices()', () => {
    it('should call cjs.listDevices() when listDevices() is called', waitForAsync(() => {
      accountService = new AccountService();

      const testResp: IResponse = { status: 200, data: {}, headers: null };

      spyOn(accountService.cjs, 'listDevices').and.returnValue(Promise.resolve(testResp));

      accountService.listDevices().subscribe(next => {
        expect(accountService.cjs.listDevices).toHaveBeenCalled();
      }, fail);
    }));
  });
});

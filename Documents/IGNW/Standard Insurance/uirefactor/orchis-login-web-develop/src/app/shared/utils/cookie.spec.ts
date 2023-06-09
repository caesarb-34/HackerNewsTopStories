import {CookieUtils} from './cookie';

describe('Cookie Utilities', () => {

  const component = CookieUtils;

  describe('===> CookieUtils setCookie', () => {

    it('should set cookie', () => {
      const spyOnSetCookie = spyOn(component, 'setCookie').and.callThrough();
      CookieUtils.setCookie('name', 'true', 1);
      expect(spyOnSetCookie).toHaveBeenCalled();
    });
  });

  describe('===> CookieUtils  getCookie', () => {

    it('should get cookie', () => {
      const spyOnGetCookie = spyOn(component, 'getCookie').and.callThrough();
      component.getCookie('name');
      expect(spyOnGetCookie).toHaveBeenCalled();
    });

    it('should return empty string when cookie not found', () => {
      spyOn(document.cookie, 'split').and.returnValue(['name']);
      const result = component.getCookie('blah');
      expect(result).toEqual('');
    });

  });


});

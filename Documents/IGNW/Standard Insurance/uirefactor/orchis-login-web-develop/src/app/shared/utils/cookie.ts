import {Injectable} from '@angular/core';

@Injectable()

/**
 * COOKIE METHODS
 * Various cookie methods to be used by applications.
 *
 *  To delete cookies set predated expires:
 *    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
 */
export class CookieUtils {

  /**
   * Sample Use:
   *     CookieUtils.setCookie("my-cookie", "cookie value here");
   *
   * @name {string}         cookie name
   * @value {string}        the value of the cookie
   * @expireDays {number}   cookie expiry date.
   * Defaults to a "domain" cookie with path='/'
   */
  public static setCookie(name: string, value: string, expireDays: number): void {
    let result: string;
    result = this.createCookieString(name, value, expireDays);
    result.concat(';path=/');
    document.cookie = result;
  }

  /**
   *  Used to create a cookie based on expirydate
   * @param {string} name
   * @param value
   * @param expirydays (number)
   */
  public static createCookieString(name: string, value: string, expireDays: number): string {

    const date: Date = new Date();
    date.setTime(date.getTime() + (expireDays * 24 * 60 * 60 * 1000));
    const expires = 'expires=' + date.toUTCString();
    const result = name + '=' + value + ';' + expires;
    return result;
  }

  /* Returns string representation of a cookie value
     specified by the name parameter
  */
  public static getCookie(name: string): string {

    let result: string = '';
    const cookieName: string = name + '=';
    const cookies: Array<string> = document.cookie.split(';');
    cookies.forEach(cookie => {
      if (cookie.indexOf(name) >= 0) {
        result = cookie;
      }
    });
    result = result ? result.replace(/[<>]/g, '') : '';
    return result ? result.trim()
      .substring(cookieName.length, result.length) : '';
  }

}

// export for convenience.
export { ActivatedRoute, Router, RouterLink, RouterOutlet, NavigationEnd} from '@angular/router';

import {Injectable} from '@angular/core';
// tslint:disable-next-line
import {BehaviorSubject, Subject} from 'rxjs';


/**
 * stub out the router
 */
@Injectable()
export class RouterStub {

  private _routes: any[];
  // tslint:disable-next-line:variable-name
  private _nav_extras: NavigationExtras;
  private subject = new Subject();

  navigateByUrl(url: string) {
    return url;
  }
  navigate(commands: any[], extras?: NavigationExtras) {
    this._routes = commands;
    this._nav_extras = extras;
    this.triggerNavEnd(commands[0]);
  }

  /**
   * Returns the routes that the router.navigate function gets called with
   * @returns {any[]}
   */
  public get routes(): any[] {
    return this._routes;
  }

  /**
   * Returns the navigation extra preferences such as query params from the router.navigate function call
   * @returns {NavigationExtras}
   */
  public get nav_extras(): NavigationExtras {
    return this._nav_extras;
  }

  /**
   * Triggers the navigation end.
   * @param url
   */
  public triggerNavEnd(url) {
    const ne = new NavigationEnd(0, url, null);
    this.subject.next(ne);
  }

  public clearAll() {
    this._routes = undefined;
    this._nav_extras = undefined;
  }
}

// Only implements params and part of snapshot.paramMap
import {convertToParamMap, NavigationEnd, NavigationExtras, ParamMap, Params} from '@angular/router';

@Injectable()
export class ActivatedRouteStub {

  // ActivatedRoute.paramMap is Observable
  private paramsSubject = new BehaviorSubject(convertToParamMap(this.testParamMap));
  paramMap = this.paramsSubject.asObservable();

  // ActivatedRoute.queryParams
  private queryParamsSubject = new BehaviorSubject(this.testQueryParams);
  queryParams = this.queryParamsSubject.asObservable();

  // Test parameters
  private _testParamMap: ParamMap;
  get testParamMap() { return this._testParamMap; }
  set testParamMap(params: {}) {
    this._testParamMap = convertToParamMap(params);
    this.paramsSubject.next(this._testParamMap);
  }

  // Test query parameters
  private _testQueryParams: Params;
  get testQueryParams() { return this._testQueryParams; }
  set testQueryParams(params: {}) {
    this._testQueryParams = params;
    this.queryParamsSubject.next(this._testQueryParams);
  }

  // ActivatedRoute.snapshot.paramMap
  get snapshot() {
    return {
      params: this.testParamMap,
      queryParams: this.testQueryParams
    };
  }
}

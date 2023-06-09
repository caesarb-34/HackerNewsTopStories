import {Injectable} from '@angular/core';
import {Observable, of, throwError} from 'rxjs';

@Injectable()
export class DrupalServiceStub {
  private errorMessage: string;
  private dataReady: boolean = false;
  private endpointPath: string;
  private body: any;
  private content: Observable<any> = new Observable();
  public HOME_PAGE: string = 'https://www.standard.com';
  public GOTO_POLICY: string = 'CAN_REDIRECT_TO_GOTO';

  private _contentReturnValue: Observable<any> = of({});

  constructor(value: Observable<any>) { this._contentReturnValue = value; }

  public getContent(endpoint: string): Observable<object> {
    return this._contentReturnValue;
  }

  private handleError(error: any) {
    return throwError(error.message);
  }

  set setContentReturnValue(value: Observable<any>) { this._contentReturnValue = value; }
}

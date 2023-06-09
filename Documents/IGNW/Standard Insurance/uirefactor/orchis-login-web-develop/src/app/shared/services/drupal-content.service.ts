import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {catchError, map, timeout} from 'rxjs/operators';
import {GlobalConstants} from '../global-constants';
import {CloudACP} from '../models/login-content.model';
import {environment} from '@environment';

@Injectable()
export class DrupalContentService {

  public errorMessage: string;
  public dataReady: boolean = false;
  private endpointPath: string;
  public acpEndPointUrl: string = environment.acpUrl;

  constructor(private http: HttpClient) {
  }

  public getContent(endpoint: string): Observable<object> {
    return this.http.get(endpoint).pipe(
        catchError(this.handleError),
        timeout(GlobalConstants.DEFAULT_TIMEOUT),
    );
  }

  private handleError(error: any) {
    return throwError(error.message);
  }

  // cloud entity acp call
  public getAcpCall(cloudAcp: CloudACP): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const options = { headers: headers };

    return this.http.post(this.acpEndPointUrl, {
      loginId : cloudAcp.loginId,
      tenantId: 'default',
      tenantUrl: 'https:%2F%2Facpint.standard.com%2Fdefault',
      loginState: cloudAcp.loginState,
      idpClientId: cloudAcp.idpClientId
    } , options );
  }

}

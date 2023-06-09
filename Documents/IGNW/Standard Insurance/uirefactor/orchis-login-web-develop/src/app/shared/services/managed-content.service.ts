import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {environment} from '@environment';
import {ContentType, RequestState} from '../constants/managed-content.constants';


@Injectable({
  providedIn: 'root'
})
export class ManagedContentService {
  /**
   * Content types map is a map of section, elements, help, questions and question-groups maps.
   */
  private contentTypesMap: Map<string, Map<string, object>> = new Map();
  private contentTypesDefaultMap: Map<string, Map<string, object>> = new Map();
  private _contentReady$: BehaviorSubject<RequestState> = new BehaviorSubject(RequestState.PRISTINE);

  constructor(private http: HttpClient) {  }

  /**
   * Triggers initial call to get managed content. Returns an observable subscription so that the subscriber
   * would know when the calls finish
   */
  public loadManagedContent(): Observable<RequestState> {
    this._contentReady$.next(RequestState.WAITING);
    this.loadCmContent();

    return this._contentReady$.asObservable();
  }

  private loadCmContent() {
    this.managedContentCall(environment.cmSectionsEndpoint).subscribe(
        data => {
          if (!!data) {
            this.contentTypesMap.set(ContentType.SECTION, this.makeMapFromArray(data));
            this._contentReady$.next(RequestState.SUCCESS);
          }
        },
        error => {
          // TODO call route to something went wrong
          console.error('ERROR Getting Managed Content: ', error);
        }
    );
  }

  public contentHttpGetStatus(): Observable<RequestState> {
    return this._contentReady$.asObservable();
  }

  /**
   * Get a single content object based on its id.
   * If the key doesn't exist, then an attempt will be made to replace it with default content.
   * @param contentType - specify this from the enum ContentTypes
   * @param id - the id of the single object you want
   */
  public getContentById(contentType: ContentType, id: string): any {
    return this.getContentItem(id, this.contentTypesMap.get(contentType));
  }

  /**
   * Get a map of content from a contentTypeMap based on a string to be found in the id..
   * @param contentType - specify this from the enum ContentTypes
   * @param idString - the portion of the id that will be used to identify the objects intended
   *        to be retrieved.
   */
  public getContentBySelection(contentType: ContentType, idString: string): Map<string, any> {
    return this.getSelection(idString, this.contentTypesMap.get(contentType));
  }

  //  Utilities  =========================================================
  /**
   * Utility to create a selected subset of a map based on a
   * string in the id
   */
  private  getSelection(idString: string, inputMap: any): Map<string, any> {
    const outputMap = new Map();

    if (!!inputMap) {
      inputMap.forEach(item => {
        if (RegExp(idString).test(item.id)) {
          outputMap.set(item.id, item);
        }
      });
    }

    return outputMap;
  }

  // Make a map from an Array based on "id" key
  private makeMapFromArray(inputArray: any[]): any {
    const outputMap = new Map();

    if (!!inputArray && Array.isArray(inputArray)) {
      inputArray.forEach(item => {
        outputMap.set(item.id, item);
      });
    }

    return outputMap;
  }

  /**
   * Get content item from a map, show console warn if the item is not found.
   * @param id - a key to the map currently being processed.
   * @param contentMap
   */
  private getContentItem(id: string, contentMap: Map<string, object>): any {
    let result;

    if (!!contentMap && !!contentMap.get(id)) {
      result = contentMap.get(id);
    } else {
      console.warn(`Managed content item missing: ${id}`);
      result = undefined;
    }

    return result;
  }

  private managedContentCall(endpoint: string): Observable<any> {
    return this.http.get<any>(endpoint);
  }

}

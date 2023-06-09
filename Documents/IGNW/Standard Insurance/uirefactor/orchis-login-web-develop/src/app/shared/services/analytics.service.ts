import {Injectable} from '@angular/core';

// Declaration of WebTrends as an ambient function
// As we have to grab onto the global variables
declare var tag: any;

@Injectable()
export class AnalyticsService {

  public static sendPageHit(url: string): void {
    tag.dcsMultiTrack('DCS.dcsuri', url);
  }
}

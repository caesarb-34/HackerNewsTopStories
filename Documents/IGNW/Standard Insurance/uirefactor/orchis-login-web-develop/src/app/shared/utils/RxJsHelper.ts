import {Subscription} from 'rxjs';

export class RxJsHelper {

  static unSubscribeSafely(sub: Subscription): void {
    if (!!sub && !sub.closed) {
      sub.unsubscribe();
    }
  }
}

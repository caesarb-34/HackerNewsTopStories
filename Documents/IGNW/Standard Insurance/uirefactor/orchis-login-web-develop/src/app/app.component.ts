import {Component, OnInit} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {AnalyticsService} from './shared/services/analytics.service';
import {distinctUntilChanged} from 'rxjs/operators';
import {AuthenticationService, BrowserDetectionService, IMenuItem, ModalDialogService, NavigationService} from 'sfg-ng-brand-library';
import {ManagedContentService} from './shared/services/managed-content.service';


@Component({
  selector: 'lgn-app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Login | The Standard';
  private _initialRouteHit: boolean = true;

  constructor(
      private router: Router,
      private cmService: ManagedContentService,
      public authenticationService: AuthenticationService,
      private navigationService: NavigationService,
      private browserDetectionService: BrowserDetectionService,
      private sfgModal: ModalDialogService) { }

  ngOnInit() {
    // Browser is not supported
    if (this.browserDetectionService.isNotSupportedBrowser
        && this.browserDetectionService.renderUnsupportedBrowserModal) {
      this.sfgModal.setContentIdAndSize('outdated-browser', 'md');
    }

    this.cmService.loadManagedContent();
    this.windowScrollTo();
    this.initPageviewAnalytics();
  }

  /* This function will send an event to WebTrends on each router change,
   with the human readable URL.
   */
  public initPageviewAnalytics(): void {
    this.router.events.pipe(
        distinctUntilChanged(
          (previous, current) => this.checkUrl(previous, current)
        )).subscribe(
        pageHit => {
          // To eliminate the initial route page hit to remove duplicate entries
          if (!this._initialRouteHit) {
            AnalyticsService.sendPageHit(pageHit['url']);
          } else {
            this._initialRouteHit = false;
          }
        }
    );
  }

  private checkUrl(previous, current): boolean {
    if (current instanceof NavigationEnd) {
      return previous['url'] === current['url'];
    }
    return true;
  }

  public focusOnMainContent(): void {
    document.getElementById('main-content').focus();
  }

  public focusOnFooter(): void {
    document.getElementById('footer').focus();
  }

  public windowScrollTo(): void {
    this.router.events.subscribe(() => {
      window.scrollTo(0, 0);
    });
  }

  public handleHeaderClickEvent(menuItem: IMenuItem) {
    this.navigationService.setMenuItemAction(menuItem);
  }
}

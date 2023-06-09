import { Component, OnInit, HostListener } from '@angular/core';

@Component({
  selector: 'lgn-capslock-tooltip',
  templateUrl: './capslock-tooltip.component.html',
  styleUrls: ['./capslock-tooltip.component.scss']
})
export class CapslockTooltipComponent implements OnInit {

  public capsLockActive: boolean = false;

  constructor() {
  }

  ngOnInit() {
  }

  /**
   * Monitor the key press event and set the caps lock variable.
   * @param event is the window keypress event
   * Turn off our check and use the built-in check by IE and Edge
   */
  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    this.capsLockActive = event.getModifierState && event.getModifierState('CapsLock');
    this.checkIECapsLock();
  }

  /**
   * This method is for IE browser only. Cannot be tested in Chrome.
   */
  /* istanbul ignore next */
  private checkIECapsLock() {
    if (typeof(document['msCapsLockWarningOff']) !== 'undefined') {
      if (!document['msCapsLockWarningOff']) {
        this.capsLockActive = false;
      }
    }
  }
}


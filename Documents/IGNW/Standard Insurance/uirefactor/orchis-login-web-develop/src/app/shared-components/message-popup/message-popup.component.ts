import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'lgn-message-popup',
  templateUrl: './message-popup.component.html',
  styleUrls: ['./message-popup.component.scss']
})
export class MessagePopupComponent implements OnInit {
  @Input() public msgType: string;
  @Input() public usageType: string;
  @Input() public message: string;

  public isMsgWarning: boolean = false;
  public isMsgInfo: boolean = false;
  public isMsgError: boolean = false;
  public isMsgClear: boolean = false;
  public isMsgTotalOutage: boolean = false;

  constructor() { }

  ngOnInit() {
    this.setMessageType();
  }

  /**
   * Sets the css class type for the message container and icon
   * type for the message.
   */
  public setMessageType(): void {
    switch (this.msgType) {
      case 'warning': {
        this.isMsgWarning = true;
        break;
      }
      case 'error': {
        this.isMsgError = true;
        break;
      }
      case 'info': {
        this.isMsgInfo = true;
        break;
      }
      case 'total-outage': {
        this.isMsgTotalOutage = true;
        break;
      }
      case 'clear': {
        this.isMsgClear = true;
        break;
      }
    }
  }
}

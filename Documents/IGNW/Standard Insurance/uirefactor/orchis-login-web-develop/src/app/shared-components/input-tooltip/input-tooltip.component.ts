import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'lgn-input-tooltip',
  templateUrl: './input-tooltip.component.html',
  styleUrls: ['./input-tooltip.component.scss']
})
export class InputTooltipComponent implements OnInit {

  @Input() toolTipActive: boolean = false;
  @Input() intro: string;
  @Input() list: Array<string>;
  @Input() closing: string;
  @Input() cssClasses: string;  // This is optional
  @Input() width: number;    // optional - 190 seems to be good for minimum iphone 5
  /** This is the recommended default for cssClasses value if responsive is needed:
   *      public toolTipStyles: Array<string> = ['col-md-6', 'col-sm-6', 'col-xs-8'];
   */

  constructor() { }

  ngOnInit() {
  }

}

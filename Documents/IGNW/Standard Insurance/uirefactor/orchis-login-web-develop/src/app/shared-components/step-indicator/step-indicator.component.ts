import { Component, OnInit, Input } from '@angular/core';
import { Step } from '../../shared/models/step.model';

@Component({
  selector: 'lgn-step-indicator',
  templateUrl: './step-indicator.component.html',
  styleUrls: ['./step-indicator.component.scss']
})
export class StepIndicatorComponent implements OnInit {

  @Input() selectedStep: number;
  @Input() steps: Array<Step>;

  constructor() { }

  ngOnInit() {
  }

}

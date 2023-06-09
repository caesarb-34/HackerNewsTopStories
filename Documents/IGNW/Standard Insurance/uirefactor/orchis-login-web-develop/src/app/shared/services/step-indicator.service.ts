import { Injectable } from '@angular/core';
import { Step } from '../models/step.model';

@Injectable()
export class StepIndicatorService {

  private h1Title: string;
  private steps: Array<Step> = [];
  private displayIndicator: boolean = true;

  constructor() { }

  getSteps() {
    return this.steps;
  }

  setSteps(incomingSteps: Array<Step>) {
    this.steps = incomingSteps;
  }

  getH1Title() {
    return this.h1Title;
  }

  setH1Title(incomingTitle: string) {
    this.h1Title = incomingTitle;
  }

  getDisplayIndicator() {
    return this.displayIndicator;
  }

  setDisplayIndicator(incomingDisplayIndicator: boolean) {
    this.displayIndicator = incomingDisplayIndicator;
  }
}

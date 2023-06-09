import {Injectable} from '@angular/core';


@Injectable()
export class StepIndServMock {
  private title: string = 'My Title';
  private stepIndVal = [
    {
      index: 1,
      label: 'Update Contact Information',
      route: '/collect-contact-info'
    },
    {
      index: 2,
      label: 'Check your email',
      route: '/data-collection-email'
    }
  ];

  get getSteps() { return this.stepIndVal; }
  get getH1Title() { return this.title; }
  set setSteps(steps: any) { this.stepIndVal = steps; }
  set setH1Title(newTitle: string) { this.title = newTitle; }
}

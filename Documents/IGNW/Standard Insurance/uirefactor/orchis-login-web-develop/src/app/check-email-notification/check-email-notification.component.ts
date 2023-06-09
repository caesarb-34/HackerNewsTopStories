import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

import {Step} from '../shared/models/step.model';
import {environment} from '@environment';

@Component({
  selector: 'lgn-check-email-notification',
  templateUrl: './check-email-notification.component.html',
  styleUrls: ['./check-email-notification.component.scss']
})
export class CheckEmailNotificationComponent implements OnInit {

  public steps: Array<Step> = [
    {index: 1, label: 'Establish Identity'},
    {index: 2, label: 'Check Email'},
    {index: 3, label: 'Set Password'}
  ];

  public customerSupportUrl: string = environment.customerSupportUrl;

  constructor(private titleService: Title) {
  }

  ngOnInit() {
    this.titleService.setTitle('Next Steps | The Standard');
  }

}

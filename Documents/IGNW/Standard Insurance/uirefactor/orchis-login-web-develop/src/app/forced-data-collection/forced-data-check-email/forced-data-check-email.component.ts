import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { Title } from '@angular/platform-browser';
import {Step} from '../../shared/models/step.model';
import {environment} from '@environment';
import {StepIndicatorService} from '../../shared/services/step-indicator.service';


@Component({
  selector: 'lgn-check-email-notification',
  templateUrl: './forced-data-check-email.component.html',
  styleUrls: ['./forced-data-check-email.component.scss']
})
export class ForcedDataCheckEmailComponent implements OnInit {

  public selectedStep: number;
  public steps: Array<Step>;

  public customerSupportUrl: string = environment.customerSupportUrl;

  constructor(
    public stepIndicatorService: StepIndicatorService,
    public router: Router,
    public route: ActivatedRoute,
    private titleService: Title
  ) {
  }

  ngOnInit() {
    // set the page title
    this.titleService.setTitle('Next Steps | The Standard');

    if (this.stepIndicatorService.getSteps().length === 0) {
      this.router.navigate(['/login']);
    } else {
      this.selectedStep = this.route.snapshot.queryParams[ 'step' ];
      this.steps = this.stepIndicatorService.getSteps();
    }
  }
}

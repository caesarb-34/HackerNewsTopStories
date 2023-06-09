import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Title} from '@angular/platform-browser';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {AccountService} from '../../shared/services/account.service';
import {environment} from '@environment';


@Component({
  selector: 'lgn-set-password-fail',
  templateUrl: './set-password-fail.component.html',
  styleUrls: ['./set-password-fail.component.scss']
})
export class SetPasswordFailComponent implements OnInit {

  @ViewChild('resendActivationModal') public resendActivationModal: ModalDirective;

  public messageText: string = 'Something went wrong.';
  public messageSubText: string = 'The server could not process this request. You can start over to request a new link.';

  public resendActivationError: boolean = false;
  public responseReturned: boolean = false;
  public customerSupportUrl: string = environment.customerSupportUrl;
  public statusCode: string;
  public otpCode: string;
  public provisioned: boolean;

  public alreadyActivatedMessage = 'This account may have already been activated. If you are unable to log in, ' +
    'please <a href="' + this.customerSupportUrl + '">contact us</a> for help.';

  public errorMessages = {
    400: {
      text: 'Something went wrong.',
      subtext: 'The server could not process this request. You can start over to request a new link.'
    },
    410: {
      text: 'Your activation link has expired.',
      subtext: 'You can request a new link or <a href=\"' + this.customerSupportUrl + '\">contact us</a> for assistance.'
    },
    422: {
      text: 'Your activation link has expired.',
      subtext: 'You can request a new link or <a href=\"' + this.customerSupportUrl + '\">contact us</a> for assistance.'
    }
  };

  constructor(public route: ActivatedRoute,
              public titleService: Title,
              public router: Router,
              public accountService: AccountService) {
  }

  ngOnInit() {
    this.titleService.setTitle('Set a New Password | The Standard');
    this.statusCode = null;
    this.provisioned = this.route.snapshot.queryParams['provisioned'] === 'true';
    this.otpCode = this.route.snapshot.queryParams['otpCode'];
    this.route.paramMap.subscribe(
      p => {
        this.statusCode = (p.has('code') && p.get('code'));

        if (this.statusCode !== undefined && this.statusCode !== null) {
          const errorMsg = this.errorMessages[this.statusCode];

          this.messageText = errorMsg ? errorMsg.text : this.errorMessages['400'].text;
          this.messageSubText = errorMsg ? errorMsg.subtext : this.errorMessages['400'].subtext;
        }
    });
  }

  public componentNavigate(paramToNavigate: string): void {
    this.router.navigate([paramToNavigate]);
  }

  public resendActivationLink(): void {
    this.resendActivationError = false;
    this.resendActivationModal.show();

    this.accountService.resendActivationEmail(this.otpCode).subscribe(
      (next) => {
        this.responseReturned = true;
      },
      (error) => {
        this.resendActivationError = true;
        this.responseReturned = true;
      });
  }
}

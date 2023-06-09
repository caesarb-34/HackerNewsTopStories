import {Component, Input, HostListener, OnInit, ViewChild} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {AccountService} from '../../shared/services/account.service';
import {environment} from '@environment';


@Component({
  selector: 'lgn-resend-activation',
  templateUrl: './resend-activation.component.html',
  styleUrls: ['./resend-activation.component.scss']
})
export class ResendActivationComponent implements OnInit {

  @Input() public code: string;
  @Input() public identifier: string;
  @Input() public destination: string;
  @Input() public showLink: boolean;
  @Input() public linkLabel: string;
  @ViewChild('resendActivationModal') public resendActivationModal: ModalDirective;

  public resendActivationError: boolean = false;
  public responseReturned: boolean = false;
  public customerSupportUrl: string = environment.customerSupportUrl;

  // Currently supported as a generic error with no check for specific error codes.
  public errorMessages = {
    422: 'This account may have already been activated. If you are unable to log in, ' +
    'please <a href="' + this.customerSupportUrl + '">contact us</a> for help.',
  };

  constructor( public accountService: AccountService ) { }

  ngOnInit() { }

  /**
   * Click event for requesting a new link on link expired error message
   */
  public resendActivationEmail(): any {
    this.resendActivationError = false;
    this.resendActivationModal.show();

    this.accountService.resendActivationEmail(this.code, this.identifier, this.destination).subscribe(
      (next) => {
        this.responseReturned = true;
      },
      (error) => {
        this.resendActivationError = true;
        this.responseReturned = true;
    });
  }

  @HostListener('keypress', ['$event'])
  public pressEnterCallRequestNewLink(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
        this.resendActivationEmail();
    }
  }
}

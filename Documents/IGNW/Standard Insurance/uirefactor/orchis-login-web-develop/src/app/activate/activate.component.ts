import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AccountService} from '../shared/services/account.service';

@Component({
  selector: 'lgn-activate',
  templateUrl: './activate.component.html',
  styleUrls: ['./activate.component.scss']
})
export class ActivateComponent implements OnInit {

  public code: string;

  constructor(public router: Router,
              public route: ActivatedRoute,
              public accountService: AccountService) { }

  ngOnInit() {
    // Get the code query param
    this.code = this.route.snapshot.queryParams['code'];

    // Call CJS to activate the account
    this.accountService.activateUser(this.code).subscribe(
      data => {
        // Activation success redirect to login
        this.router.navigate(['/login'], {queryParams: {accountactivated: true}});
      },
      error => {
        // Redirect to login with error
        this.router.navigate(['/login'], {queryParams: {activationExpired: true, code: this.code}});
      }
    );
  }

}

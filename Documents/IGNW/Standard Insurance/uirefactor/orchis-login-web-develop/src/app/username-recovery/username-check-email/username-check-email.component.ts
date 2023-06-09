import { Component, OnInit } from '@angular/core';
import {environment} from '@environment';
import {Title} from '@angular/platform-browser';
import {Router} from '@angular/router';

@Component({
  selector: 'lgn-username-check-email',
  templateUrl: './username-check-email.component.html',
  styleUrls: ['./username-check-email.component.scss']
})
export class UsernameCheckEmailComponent implements OnInit {

  public title: string = 'Thank You | The Standard';
  public customerSupportUrl: string = environment.customerSupportUrl;

  constructor(private titleService: Title,
              private router: Router) { }

  ngOnInit() {
    this.titleService.setTitle(this.title);
  }

  public routeToLoginPage() {
    this.router.navigate(['/']);
  }
}

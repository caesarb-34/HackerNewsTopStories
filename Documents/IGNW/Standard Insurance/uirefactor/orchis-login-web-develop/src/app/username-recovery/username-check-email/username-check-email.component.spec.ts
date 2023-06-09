import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsernameCheckEmailComponent } from './username-check-email.component';
import {Title} from '@angular/platform-browser';
import {Router} from '@angular/router';
import {RouterStub} from '../../../test/router-stubs';

describe('UsernameCheckEmailComponent', () => {
  let component: UsernameCheckEmailComponent;
  let fixture: ComponentFixture<UsernameCheckEmailComponent>;
  let titleService: Title;

  let expectedTitle: string;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UsernameCheckEmailComponent ],
      providers: [
        {provide: Title, useClass: Title},
        {provide: Router, useClass: RouterStub}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsernameCheckEmailComponent);
    component = fixture.componentInstance;
    expectedTitle = component.title;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set the title to ' + expectedTitle, () => {
    titleService = TestBed.inject(Title);
    expect(titleService.getTitle()).toBe(expectedTitle);
  });
});

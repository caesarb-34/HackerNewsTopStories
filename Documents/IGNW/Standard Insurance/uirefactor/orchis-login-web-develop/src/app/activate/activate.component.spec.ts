import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';

import { ActivateComponent } from './activate.component';
import {AccountService} from '../shared/services/account.service';
import {ActivatedRouteStub, RouterStub} from '../../test/router-stubs';
import {AccountServiceStub} from '../../test/services/account.service.stub';
import {throwError} from 'rxjs';


describe('ActivateComponent', () => {
  let component: ActivateComponent;
  let fixture: ComponentFixture<ActivateComponent>;

  let routerStub: RouterStub;
  let activatedRoute: ActivatedRouteStub;
  let accountService: AccountServiceStub;
  const testCode = 123456;

  beforeEach(() => {
    routerStub = new RouterStub();
    activatedRoute = new ActivatedRouteStub();
    activatedRoute.testQueryParams = {};

    accountService = new AccountServiceStub();
  });

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterModule
      ],
      declarations: [ ActivateComponent ],
      providers: [
        {provide: AccountService, useValue: accountService},
        {provide: Router, useValue: routerStub},
        {provide: ActivatedRoute, useValue: activatedRoute}
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('===> ', () => {
    beforeEach(() => {
      activatedRoute.testQueryParams = { code: testCode };
    });

    // ===> ngOnInit() with code
    it('should navigate to login with accountActivated queryparam to true when successful', () => {
      component.ngOnInit();
      expect(routerStub.routes).toContain('/login');
      expect(routerStub.nav_extras.queryParams).toEqual({ accountactivated: true });
      routerStub.clearAll();
    });

    it('should navigate to login with queryparams activationExpired=true and code=123456 on error', () => {
      routerStub.clearAll();
      accountService.setActivateUser = throwError(new Error());
      component.ngOnInit();

      expect(component.code.toString()).toEqual(testCode.toString());
      expect(routerStub.routes).toContain('/login');
      expect(routerStub.nav_extras.queryParams).toEqual({ activationExpired: true, code: testCode });
    });
  });
});

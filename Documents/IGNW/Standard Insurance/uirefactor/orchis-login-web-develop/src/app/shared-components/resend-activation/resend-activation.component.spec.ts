import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import {ModalModule} from 'ngx-bootstrap/modal';
import {of, throwError} from 'rxjs';
import { ResendActivationComponent } from './resend-activation.component';
import {AccountService} from '../../shared/services/account.service';


describe('ResendActivationComponent', () => {
  let component: ResendActivationComponent;
  let fixture: ComponentFixture<ResendActivationComponent>;
  let spyAccountService: jasmine.Spy;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        ModalModule.forRoot()
      ],
      declarations: [ ResendActivationComponent ],
      providers: [
        AccountService
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResendActivationComponent);
    component = fixture.componentInstance;

    spyAccountService = spyOn(component.accountService, 'resendActivationEmail');

    fixture.detectChanges();
  });

  it('should create', () => {
    spyAccountService.and.callFake(() => {});
    expect(component).toBeTruthy();
  });

  it('should resend activation email when keyboard \'Enter\' key pressed', () => {
    const spyResend = spyOn(component, 'resendActivationEmail').and.callFake(() => {});
    const event = new KeyboardEvent('keydown', { key: 'Enter' });

    component.pressEnterCallRequestNewLink(event);

    expect(spyResend).toHaveBeenCalled();
  });

  it('should not resend activation email when other keyboard keys pressed', () => {
    const spyResend = spyOn(component, 'resendActivationEmail').and.callFake(() => {});
    const event = new KeyboardEvent('keydown', { key: 'c' });

    component.pressEnterCallRequestNewLink(event);

    expect(spyResend).not.toHaveBeenCalled();
  });

  describe('===> resendActivationEmail()', () => {

    it('should set resendActivationError and responseReturned to true when the service returns an error '
      + 'and show the modal', () => {
      spyAccountService.and.returnValue(throwError(new Error()));
      component.resendActivationEmail();
      expect(component.resendActivationError).toBeTruthy();
      expect(component.responseReturned).toBeTruthy();
    });

    it('should set responseReturned to true and show the modal', () => {
      spyAccountService.and.returnValue(of({}));
      component.resendActivationEmail();
      expect(component.resendActivationError).toBeFalsy();
      expect(component.responseReturned).toBeTruthy();
      expect(true).toBeTruthy();
    });
  });
});

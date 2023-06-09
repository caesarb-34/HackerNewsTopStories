import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { ActivateAccountComponent } from './activate-account.component';
import { SelfRegistrationService } from '../self-registration.service';
import { RouterStub } from '../../../test/router-stubs';
import { SharedComponentsModule } from '../../shared-components/shared-components.module';
import {AccountService} from '../../shared/services/account.service';


describe('ActivateAccountComponent', () => {
  let component: ActivateAccountComponent;
  let fixture: ComponentFixture<ActivateAccountComponent>;
  const routerStub = new RouterStub();

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        ActivateAccountComponent
      ],
      imports: [
        SharedComponentsModule
      ],
      providers: [
        SelfRegistrationService,
        AccountService,
        {provide: Router, useValue: routerStub}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivateAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should call selfRegistrationService syncPageStep', () => {
    spyOn(component.selfRegistrationService, 'syncPageStep').and.callFake(() => {});
    component.ngOnInit();
    expect(component.selfRegistrationService.syncPageStep).toHaveBeenCalled();
  });

});

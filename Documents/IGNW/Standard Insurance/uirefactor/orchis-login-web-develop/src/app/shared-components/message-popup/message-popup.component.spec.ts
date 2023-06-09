import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessagePopupComponent } from './message-popup.component';

describe('MessagePopupComponent', () => {
  let component: MessagePopupComponent;
  let fixture: ComponentFixture<MessagePopupComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MessagePopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessagePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should set isMsgWarning to true when message is type \'warning\'', () => {
    component.msgType = 'warning';
    component.setMessageType();
    expect(component.isMsgWarning).toBeTruthy();
  });

  it('should set isMsgError to true when message is type \'error\'', () => {
    component.msgType = 'error';
    component.setMessageType();
    expect(component.isMsgError).toBeTruthy();
  });

  it('should set isMsgInfo to true when message is type \'info\'', () => {
    component.msgType = 'info';
    component.setMessageType();
    expect(component.isMsgInfo).toBeTruthy();
  });
});

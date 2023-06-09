import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { CapslockTooltipComponent } from './capslock-tooltip.component';


describe('CapslockTooltipComponent', () => {
  let component: CapslockTooltipComponent;
  let fixture: ComponentFixture<CapslockTooltipComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CapslockTooltipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CapslockTooltipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should check if the capslock is on', () => {
    const event = new KeyboardEvent('keydown', {
      bubbles : true, cancelable : true, shiftKey : false
    });

    const spyModState = spyOn(event, 'getModifierState').and.callThrough();

    window.dispatchEvent(event);

    expect(spyModState).toHaveBeenCalledWith('CapsLock');
  });

});

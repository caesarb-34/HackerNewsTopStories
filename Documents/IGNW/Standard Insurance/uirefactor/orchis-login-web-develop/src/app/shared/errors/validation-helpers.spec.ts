import {ValidationHelpers} from './validation-helpers';
import {Component, ViewChild} from '@angular/core';
import {ComponentFixture, waitForAsync, TestBed} from '@angular/core/testing';
import {FormsModule, NgForm} from '@angular/forms';

@Component({
  template: `
    <form id="testForm" name="testForm" #testForm="ngForm">
      <input
        id="field1"
        name="field1"
        type="text"
        [(ngModel)]="field1UnderTestModel"
        #field1="ngModel"
      />
      <input
        id="field2"
        name="field2"
        type="text"
        [(ngModel)]="field2UnderTestModel"
        #field2="ngModel"
      />
      <input
        id="field3"
        name="field3"
        type="text"
        [(ngModel)]="field3UnderTestModel"
        #field3="ngModel"
      />
    </form>
    `
})

class TemplateDrivenFormTestComponent {
  @ViewChild('testForm') testForm: NgForm;
  field1UnderTestModel: string = '';
  field2UnderTestModel: string = '';
  field3UnderTestModel: string = '';
}

describe('ValidationHelpers', () => {
  it('should create an instance', () => {
    expect(ValidationHelpers).toBeTruthy();
  });
});


describe('===> Test touching all the form fields in the form', () => {
  let component: TemplateDrivenFormTestComponent;
  let fixture: ComponentFixture<TemplateDrivenFormTestComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule ],
      declarations: [TemplateDrivenFormTestComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplateDrivenFormTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('all fields should be set as touched', waitForAsync(() => {
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(component.testForm.controls['field1'].touched).toBeFalsy();
      expect(component.testForm.controls['field2'].touched).toBeFalsy();
      expect(component.testForm.controls['field3'].touched).toBeFalsy();
      ValidationHelpers.touchAllFormFields(component.testForm);
      expect(component.testForm.controls['field1'].touched).toBeTruthy();
      expect(component.testForm.controls['field2'].touched).toBeTruthy();
      expect(component.testForm.controls['field3'].touched).toBeTruthy();
    });
  }));

  it('should not do anything if null or undefined form is passed into it', waitForAsync(() => {
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(component.testForm.controls['field1'].touched).toBeFalsy();
      expect(component.testForm.controls['field2'].touched).toBeFalsy();
      expect(component.testForm.controls['field3'].touched).toBeFalsy();
      ValidationHelpers.touchAllFormFields(undefined);
      expect(component.testForm.controls['field1'].touched).toBeFalsy();
      expect(component.testForm.controls['field2'].touched).toBeFalsy();
      expect(component.testForm.controls['field3'].touched).toBeFalsy();
    });
  }));

});




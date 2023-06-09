
import {Component} from '@angular/core';
import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {InputTextTrimDirective} from './input-text-trim.directive';
import {FormsModule} from '@angular/forms';

@Component({
  template: `
    <h1>component with template-driven form</h1>
    <label for="trimme">Username</label>
    <input id="trimme" type="text" [(ngModel)]="inputUnderTestModel" value="" lgnInputTextTrim />
  `
})
class TemplateDrivenFormTestComponent {
  inputUnderTestModel: string = '';
}

describe('Directive \"lgnInputTextTrim\" with template-driven form', () => {

  let componentInstance: TemplateDrivenFormTestComponent;
  let fixture: ComponentFixture<TemplateDrivenFormTestComponent>;
  let inputElement: HTMLInputElement;

  const valueWithWhitespace = '  Blah   ';
  const valueWithWhitespaceRemoved = 'Blah';

  beforeEach( () => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [TemplateDrivenFormTestComponent, InputTextTrimDirective]
    });
  });

  describe('at initialization', () => {

    beforeEach(() => createTestComponentWithTemplateDrivenForm());

    it('should create test component', () => expect(componentInstance).toBeDefined());
    it('should have empty input field and model', () => {
      expect(inputElement.value).toBe('');
      expect(componentInstance.inputUnderTestModel).toBe('');
    });
  });

  describe('when user enters text', () => {

    beforeEach(() => createTestComponentWithTemplateDrivenForm());

    it('should trim both leading and trailing whitespace from the input element', () => {
      inputElement.value = valueWithWhitespace;
      inputElement.dispatchEvent(new Event('blur'));
      fixture.detectChanges();

      expect(inputElement.value)
        .toBe(valueWithWhitespaceRemoved, 'view input value should be trimmed');
      expect(componentInstance.inputUnderTestModel)
        .toBe(inputElement.value, 'model should be in sync with view');
      expect(componentInstance.inputUnderTestModel)
        .toBe(valueWithWhitespaceRemoved, 'model should be trimmed');
    });

  });

  describe('with \'two-way\' binding', () => {

    beforeEach(() => createTestComponentWithTemplateDrivenForm());

    it('should trim the input value on model change', fakeAsync( () => {
      componentInstance.inputUnderTestModel = valueWithWhitespace;
      fixture.detectChanges();
      tick();

      expect(componentInstance.inputUnderTestModel)
        .toBe(inputElement.value, 'model and value should be the same');

      inputElement.dispatchEvent(new Event('blur'));

      expect(componentInstance.inputUnderTestModel)
        .toBe(inputElement.value, 'model and value should be the same');
      expect(inputElement.value).toBe(valueWithWhitespaceRemoved, 'input value should be trimmed');
      expect(componentInstance.inputUnderTestModel)
        .toBe(valueWithWhitespaceRemoved, 'model should be trimmed');
    }));

    it('should not trim the value if the value is empty string', () => {
      const inputValue = '';
      inputElement.value = inputValue;
      fixture.detectChanges();
      inputElement.dispatchEvent(new KeyboardEvent('blur'));
      fixture.detectChanges();

      expect(inputElement.value).toEqual(inputValue);
    });

  });

  describe('with keyboard event', () => {
    beforeEach(() => createTestComponentWithTemplateDrivenForm());

    it('should set the value trimmed when keyboard event is with \'Enter\' key and value has spaces', () => {
      inputElement.value = '  hello  ';
      fixture.detectChanges();
      inputElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      fixture.detectChanges();

      expect(inputElement.value).toEqual('hello');
    });

    it('should set the value to be \'\' when keyboard event is with \'Enter\' key and value is \'\'', () => {
      const inputValue = '';
      inputElement.value = inputValue;
      fixture.detectChanges();
      inputElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      fixture.detectChanges();

      expect(inputElement.value).toEqual(inputValue);
    });

    it('should not do anything when keyboard event is other than \'Enter\' key and value has spaces', () => {
      const inputValue = '   hello    ';
      inputElement.value = inputValue;
      fixture.detectChanges();
      inputElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Ctrl' }));
      fixture.detectChanges();

      expect(inputElement.value).toEqual(inputValue);
    });
  });

  function createTestComponentWithTemplateDrivenForm(): void {
    fixture = TestBed.createComponent(TemplateDrivenFormTestComponent);
    componentInstance = fixture.componentInstance;
    // element under test
    inputElement = fixture.debugElement.query(By.css('input')).nativeElement;
    fixture.detectChanges();
  }

});

import {Directive, HostListener} from '@angular/core';
import {DefaultValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

/**
 * Custom directive to trim value of input text field on Form 'blur' event when
 * the element loses focus as the user navigates away from that field.
 * Sample use
 *
 *  <input id="trimme" type="text" [(ngModel)]="inputUnderTestModel" value="" lgnInputTextTrim />
 *
 * With "two-way" binding is in place, model changes get trimmed prior to view synchronization.
 */
@Directive({
  selector: 'input[lgnInputTextTrim]',
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: InputTextTrimDirective, multi: true }
  ]
})
export class InputTextTrimDirective extends DefaultValueAccessor {

  // set a new value to the field and model.
  private set value( val: any ) {
    // update element
    this.writeValue( val );
    // update model
    this.onChange( val );
  }

  /**
   * Updates the value on 'blur' event.
   * @param {string} event  event.type that triggered
   * @param {string} value  event.target.value
   */
  @HostListener('blur', ['$event.type', '$event.target.value'])
  onInput(event: string, value: string): void {
    // if defined - trim, otherwise don't
    this.value = (value) ? value.trim() : value;
  }

  /**
   * Updates the value when enter is pressed.
   * @param {string} event  event that triggered
   * @param {string} value  event.target.value
   */
  @HostListener('keydown', ['$event', '$event.target.value'])
  public handleKeyboardEvent(event: KeyboardEvent, value: string): void {
    if (event.key === 'Enter') {
      this.value = (value) ? value.trim() : value;
    }
  }
}

import {Injectable} from '@angular/core';
import {NgForm} from '@angular/forms';

@Injectable()
/**
 *
 *
 */
export class ValidationHelpers {

  /**
   * Mark all fields in the given form as touched.  This will turn on validation messages, since
   * validation messages only appear after a field is touched.
   * Call this during onSubmit().  It doesn't effect actual validation which must be handled
   * by each control's validators.
   * This might not handle nested sub forms.
   * @param form
   */
  public static touchAllFormFields(form: NgForm) {
    if (form) {
      Object.keys(form.controls).forEach((name) => {
        form.controls[name].markAsTouched({ onlySelf: true });
      });
    }
  }

}

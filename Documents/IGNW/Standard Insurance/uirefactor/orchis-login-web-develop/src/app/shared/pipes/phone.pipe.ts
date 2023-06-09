import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'phone'
})

/**
 * Formats the phone number
 * @param {string} value
 * @returns {string}
 */
export class PhonePipe implements PipeTransform {

  transform(value: string, args?: string): string {
    /*
     * Default value is the one passed in
     * this will be returned if the number of digits are not 10 or 7
     */

    let result = !!value ? '' : value;

    /* Match the value digits, convert to string, then remove all commas and periods */
    const matched = value.match(/[1-9]+\d*/g);

    if (!!matched) {
      let matchedVal = matched.join('');
      matchedVal = matchedVal.slice(0, 10);

      if (matchedVal.length <= 10 || matchedVal.length <= 7) {
        /* Format the number to US locale */
        const pattern = (matchedVal.length === 10) ? '($1) $2-$3' : '$1-$2';
        const regex = (matchedVal.length === 10) ? /^(\d{3})(\d{3})(\d{4})$/ : /^(\d{3})(\d{4})$/;

        result = matchedVal.replace(regex, pattern);
      }
    }

    return result;
  }

}

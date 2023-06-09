import { PhonePipe } from './phone.pipe';

describe('PhonePipe', () => {
  const pipe = new PhonePipe();

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  describe('===> transform()', () => {
    const testCases = [
      {input: '', expectedValue: ''},
      {input: '0', expectedValue: ''},
      {input: '1', expectedValue: '1'},
      {input: '123', expectedValue: '123'},
      {input: '1234567', expectedValue: '123-4567'},
      {input: '1234567890', expectedValue: '(123) 456-7890'},
      {input: '12345ABC67890', expectedValue: '(123) 456-7890'},
      {input: '123.456.789.8734587', expectedValue: '(123) 456-7898'},
      // {input: 'abcdefg', expectedValue: '(123) 456-7890'},
      // {input: '...', expectedValue: 'undefined'},
    ];

    testCases.forEach(testCase => {
      it(`should transform input \'${testCase.input}\' to value \'${testCase.expectedValue}\'`, () => {
        expect(pipe.transform(testCase.input)).toEqual(testCase.expectedValue);
      });
    });
  });
});

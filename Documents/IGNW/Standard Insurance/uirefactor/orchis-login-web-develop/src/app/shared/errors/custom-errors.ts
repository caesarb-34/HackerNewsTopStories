export class ExpectationFailedError {
  message: string;
  code: string;

  constructor(errorCode: string, errorMessage: string) {
    this.message = errorMessage;
    this.code = errorCode;
  }
}

export class UserRegistrationModel {
  uid: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
  mfaMethod?: string;
  middleName?: string;
  phone?: string;
  mobile?: string;
  isMobile?: boolean;


  constructor() {
    this.uid = undefined;
    this.password = undefined;
    this.firstName = '';
    this.lastName = '';
    this.email = '';
    this.mfaMethod = 'NONE';
    this.middleName = undefined;
    this.phone = undefined;
    this.mobile = undefined;
    this.isMobile = undefined;
  }
}

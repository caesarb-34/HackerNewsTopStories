import UserInfoViewModel from './user-info.view.model';


describe('UserInfoViewModel', () => {

  let userInfo: UserInfoViewModel;
  let original: UserInfoViewModel;

  beforeEach(() => {
    userInfo = new UserInfoViewModel();
    userInfo.email = 'me@me.com';
    userInfo.isEmailVerified = false;
    userInfo.phone = '5551212';
    userInfo.isMobile = false;
    userInfo.isPhoneVerified = false;
    userInfo.isSfgEmployee = false;
  });

  describe('isEmailChanged method', () => {

    beforeEach( () => {
      original = new UserInfoViewModel();
      original.email = 'me@me.com';
      original.isEmailVerified = false;
      original.phone = '5551212';
      original.isMobile = false;
      original.isPhoneVerified = false;
      original.isSfgEmployee = false;
    });

    it('should return false when email is the same', () => {
      expect(userInfo.isEmailChanged(original)).toBeFalsy();
    });

    it('should return true when email is different', () => {
      original.email = 'you@you.com';
      expect(userInfo.isEmailChanged(original)).toBeTruthy();
    });
  });


  describe('isPhoneAttributesChanged method', () => {
    let copiedObj: UserInfoViewModel;

    beforeEach( () => {
      copiedObj = UserInfoViewModel.clone(userInfo);
    });

    it('should return false when phone attributes are the same', () => {
      expect(userInfo.isPhoneAttributesChanged(copiedObj)).toBeFalsy();
    });

    it('should return true when userInfo phone is different', () => {
      userInfo.phone = '1112223333';
      expect(userInfo.isPhoneAttributesChanged(copiedObj)).toBeTruthy();
    });

    it('should return true when userInfo phone type is different', () => {
      userInfo.isMobile = true;
      expect(userInfo.isPhoneAttributesChanged(copiedObj)).toBeTruthy();
    });

    it('should return true when userInfo phone and phone type are different', () => {
      userInfo.phone = '1112223333';
      userInfo.isMobile = true;
      expect(userInfo.isPhoneAttributesChanged(copiedObj)).toBeTruthy();
    });
  });


  describe('equals method', () => {

    it('should return true when other is self', () => {
      const other: UserInfoViewModel = UserInfoViewModel.clone(userInfo);
      expect(userInfo.equals(other)).toBeTruthy();
    });

    it('should return false when other is undefined', () => {
      const other: UserInfoViewModel = undefined;
      expect(userInfo.equals(other)).toBeFalsy();
    });

    it('should return false when other is null', () => {
      const other: UserInfoViewModel = null;
      expect(userInfo.equals(other)).toBeFalsy();
    });


    describe('when comparing objects', () => {
      let equalsTestClone: UserInfoViewModel;

      beforeEach( () => {
        equalsTestClone = UserInfoViewModel.clone(userInfo);
      });

      it('should return true when other is a clone', () => {
        expect(userInfo.equals(equalsTestClone)).toBeTruthy();
      });

      it('should return false when other has different phone', () => {
        equalsTestClone.phone = '5101112222';
        expect(userInfo.equals(equalsTestClone)).toBeFalsy();
      });

      it('should return false when other has phone type changed', () => {
        equalsTestClone.isMobile = true;
        expect(userInfo.equals(equalsTestClone)).toBeFalsy();
      });

      it('should return false when other has email changed', () => {
        equalsTestClone.email = 'you@you.com';
        expect(userInfo.equals(equalsTestClone)).toBeFalsy();
      });

      it('should return false when other has email verified changed', () => {
        equalsTestClone.isEmailVerified = true;
        expect(userInfo.equals(equalsTestClone)).toBeFalsy();
      });

      it('should return false when other has sfgEmployee status changed', () => {
        equalsTestClone.isSfgEmployee = true;
        expect(userInfo.equals(equalsTestClone)).toBeFalsy();
      });

    });

    describe('===> Model Contact Change Functions', () => {

      describe('===> isPhoneAttributesChanged()', () => {
        const cases = [
          {phoneAttrChange: true, phoneTypeChange: true, expected: true},
          {phoneAttrChange: true, phoneTypeChange: false, expected: true},
          {phoneAttrChange: false, phoneTypeChange: true, expected: true},
          {phoneAttrChange: false, phoneTypeChange: false, expected: false},
        ];

        cases.forEach(item => {
          const statement = 'return ' + item.expected +
            ' when phone attributes are [' + item.phoneAttrChange +
            '] and email changed is [' + item.phoneTypeChange + ']';
          it('should ' + statement, () => {
            spyOn(userInfo, 'isPhoneNumberChanged').and.returnValue(item.phoneAttrChange);
            spyOn(userInfo, 'isPhoneTypeChanged').and.returnValue(item.phoneTypeChange);

            const testUserInfo = new UserInfoViewModel();
            expect(userInfo.isPhoneAttributesChanged(testUserInfo)).toEqual(item.expected);
          });
        });
      });

      describe('===> isPhoneNumberChanged()', () => {
        it('should return true when phone number changes', () => {
          const testUserInfo = new UserInfoViewModel();
          userInfo.phone = '0987654321';
          testUserInfo.phone = '1234567890';
          expect(userInfo.isPhoneNumberChanged(testUserInfo)).toBeTruthy();
        });

        it('should return false when phone number does not change', () => {
          const testUserInfo = new UserInfoViewModel();
          userInfo.phone = '1234567890';
          testUserInfo.phone = '1234567890';
          expect(userInfo.isPhoneNumberChanged(testUserInfo)).toBeFalsy();
        });
      });

      describe('===> isPhoneTypeChanged()', () => {
        it('should return true when phone type changes', () => {
          const testUserInfo = new UserInfoViewModel();
          userInfo.isMobile = false;
          testUserInfo.isMobile = true;
          expect(userInfo.isPhoneTypeChanged(testUserInfo)).toBeTruthy();
        });

        it('should return false when phone type does not change', () => {
          const testUserInfo = new UserInfoViewModel();
          userInfo.isMobile = true;
          testUserInfo.isMobile = true;
          expect(userInfo.isPhoneTypeChanged(testUserInfo)).toBeFalsy();
        });
      });


      describe('===> isContactInfoChanged()', () => {
        const cases = [
          {phoneAttrChange: true, emailChange: true, expected: true},
          {phoneAttrChange: true, emailChange: false, expected: true},
          {phoneAttrChange: false, emailChange: true, expected: true},
          {phoneAttrChange: false, emailChange: false, expected: false},
        ];

        cases.forEach(item => {
          const statement = 'return ' + item.expected +
                            ' when phone attributes are [' + item.phoneAttrChange +
                            '] and email changed is [' + item.emailChange + ']';

          it('should ' + statement, () => {
            spyOn(userInfo, 'isPhoneAttributesChanged').and.returnValue(item.phoneAttrChange);
            spyOn(userInfo, 'isEmailChanged').and.returnValue(item.emailChange);
            expect(userInfo.isContactInfoChanged(userInfo)).toEqual(item.expected);
          });
        });
      });

      describe('===> isMfaPreferenceChanged()', () => {
          it('should return true when Mfa preferences changed', () => {
            const testUserInfo = new UserInfoViewModel();
            userInfo.otpMethod = 'M';
            testUserInfo.otpMethod = 'V';
            expect(userInfo.isMfaPreferenceChanged(testUserInfo)).toBeTruthy();
          });

          it('should return', () => {
            const testUserInfo = userInfo;
            userInfo.otpMethod = 'V';
            testUserInfo.otpMethod = 'V';
            expect(userInfo.isMfaPreferenceChanged(testUserInfo)).toBeFalsy();
          });
      });

      describe('===> isMfaDestinationChanged()', () => {
        it('should ', () => {
          // userInfo.isMfaDestinationChanged();
          expect(true).toBeTruthy();
        });
      });

    });

  });

});

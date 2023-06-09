import {MaskedUserIdentifier, default as MaskedUserIdentifiers} from './masked-user-identifiers.model';
import {OtpDeliveryChannel, default as OtpDeliveryChannelsViewModel} from './otp-delivery-channels.view.model';

describe('OtpDeliveryChannelsViewModel', () => {


  describe('getPreferredOtpDeliveryChannel method', () => {
    it('should retrieve masked identifier pointed to by otpMfaDestination', () => {
      const maskedIdentifiers: MaskedUserIdentifiers =    {
        otpMethod: 'V',
        otpMfaDestination: 'b4af38e5-2678-4e47-8b6c-67b593d32944',
        emails: [{
          key: 'f4dc3deb-0f52-4df6-9097-e16ec339cc92',
          masked: 'd*********e@s*******.com',
          isDefault: false,
          isVerified: false
        }, {
          key: '1ff79c5b-77c2-470a-84e5-86c3d0dde9a0',
          masked: 'i**********s@g****.com',
          isDefault: false,
          isVerified: false
        }],
        mobiles: [{
          key: 'b4af38e5-2678-4e47-8b6c-67b593d32944',
          masked: '******7890',
          isDefault: true,
          isVerified: true
        }, {
          key: '1521cd47-377d-4f52-9594-bc7270e41dde',
          masked: '******7891',
          isDefault: false,
          isVerified: false
        }],
        phones: [{
          key: '43be4b2c-2281-420f-9936-759da03afad7',
          masked: '******3211',
          isDefault: false,
          isVerified: false
        }, {
          key: '7ffc6e9b-6705-48e7-8fa7-413de9225a46',
          masked: '******3210',
          isDefault: false,
          isVerified: false
        }]
      };
      const expectedKey: string = 'b4af38e5-2678-4e47-8b6c-67b593d32944';
      const expectedType: string = 'V';
      const expectedMasked: string = '******7890';
      const expectedPreferred: boolean = false;

      const preferredOtpDeliveryChannel: OtpDeliveryChannel
        = OtpDeliveryChannelsViewModel.getPreferredOtpDeliveryChannel(maskedIdentifiers);
      expect(preferredOtpDeliveryChannel).toBeDefined();
      expect(preferredOtpDeliveryChannel.key).toBe(expectedKey);
      expect(preferredOtpDeliveryChannel.type).toBe(expectedType);
      expect(preferredOtpDeliveryChannel.masked).toBe(expectedMasked);
      expect(preferredOtpDeliveryChannel.preferred).toBeTruthy();
    });

  });




  describe('findIdentifierByKey() method', () => {

    it('should find a masked identifier by key', () => {
      const maskedIdentifiers: MaskedUserIdentifiers =    {
        otpMethod: 'E',
        otpMfaDestination: 'f4dc3deb-0f52-4df6-9097-e16ec339cc92',
        emails: [{
          key: 'f4dc3deb-0f52-4df6-9097-e16ec339cc92',
          masked: 'd*********e@s*******.com',
          isDefault: true,
          isVerified: true
        }, {
          key: '1ff79c5b-77c2-470a-84e5-86c3d0dde9a0',
          masked: 'i**********s@g****.com',
          isDefault: false,
          isVerified: false
        }],
        mobiles: [{
          key: 'b4af38e5-2678-4e47-8b6c-67b593d32944',
          masked: '******7890',
          isDefault: false,
          isVerified: false
        }, {
          key: '1521cd47-377d-4f52-9594-bc7270e41dde',
          masked: '******7891',
          isDefault: false,
          isVerified: false
        }],
        phones: [{
          key: '43be4b2c-2281-420f-9936-759da03afad7',
          masked: '******3211',
          isDefault: false,
          isVerified: false
        }, {
          key: '7ffc6e9b-6705-48e7-8fa7-413de9225a46',
          masked: '******3210',
          isDefault: false,
          isVerified: false
        }]
      };
      const key: string = 'f4dc3deb-0f52-4df6-9097-e16ec339cc92';
      const maskedIdentifier: MaskedUserIdentifier = OtpDeliveryChannelsViewModel.findIdentifierByKey(key, maskedIdentifiers);
      expect(maskedIdentifier).toBeDefined();
      expect(maskedIdentifier.key).toBe(key);
      expect(maskedIdentifier.masked).toBe('d*********e@s*******.com');
      expect(maskedIdentifier.isDefault).toBeTruthy();
      expect(maskedIdentifier.isVerified).toBeTruthy();
    });

    it('should not throw an error when one (or more) of the categories is missing', () => {
      const maskedIdentifiers: MaskedUserIdentifiers =    {
        otpMethod: 'M',
        otpMfaDestination: 'b4af38e5-2678-4e47-8b6c-67b593d32944',
        mobiles: [{
          key: 'b4af38e5-2678-4e47-8b6c-67b593d32944',
          masked: '******7890',
          isDefault: true,
          isVerified: true
        }, {
          key: '1521cd47-377d-4f52-9594-bc7270e41dde',
          masked: '******7891',
          isDefault: false,
          isVerified: false
        }],
        phones: [{
          key: '43be4b2c-2281-420f-9936-759da03afad7',
          masked: '******3211',
          isDefault: false,
          isVerified: false
        }, {
          key: '7ffc6e9b-6705-48e7-8fa7-413de9225a46',
          masked: '******3210',
          isDefault: false,
          isVerified: false
        }]
      };
      const key: string = 'b4af38e5-2678-4e47-8b6c-67b593d32944';
      const maskedIdentifier: MaskedUserIdentifier = OtpDeliveryChannelsViewModel.findIdentifierByKey(key, maskedIdentifiers);
      expect(maskedIdentifier).toBeDefined();
      expect(maskedIdentifier.key).toBe(key);
      expect(maskedIdentifier.masked).toBe('******7890');
      expect(maskedIdentifier.isDefault).toBeTruthy();
      expect(maskedIdentifier.isVerified).toBeTruthy();
    });

    it('should return undefined when none of the id arrays exist', () => {
      const maskedIdentifiers: MaskedUserIdentifiers =    {
        otpMethod: 'E',
        otpMfaDestination: 'f4dc3deb-0f52-4df6-9097-e16ec339cc92'
      };
      const key: string = 'f4dc3deb-0f52-4df6-9097-e16ec339cc92';
      const maskedIdentifier: MaskedUserIdentifier = OtpDeliveryChannelsViewModel.findIdentifierByKey(key, maskedIdentifiers);
      expect(maskedIdentifier).toBeUndefined();
    });

  });




  describe('getAlternateOtpDeliveryChannels() method', () => {
    it('should pull isDefault and isVerified identifiers listing mobile twice - "M" and "V"', () => {
      const maskedIdentifiers: MaskedUserIdentifiers =    {
        otpMethod: 'E',
        otpMfaDestination: 'f4dc3deb-0f52-4df6-9097-e16ec339cc92',
        emails: [{
          key: 'f4dc3deb-0f52-4df6-9097-e16ec339cc92',
          masked: 'd*********e@s*******.com',
          isDefault: true,
          isVerified: true
        }, {
          key: '1ff79c5b-77c2-470a-84e5-86c3d0dde9a0',
          masked: 'i**********s@g****.com',
          isDefault: false,
          isVerified: false
        }],
        mobiles: [{
          key: 'b4af38e5-2678-4e47-8b6c-67b593d32944',
          masked: '******7890',
          isDefault: false,
          isVerified: false
        }, {
          key: '1521cd47-377d-4f52-9594-bc7270e41dde',
          masked: '******7891',
          isDefault: true,
          isVerified: true
        }],
        phones: [{
          key: '43be4b2c-2281-420f-9936-759da03afad7',
          masked: '******3211',
          isDefault: false,
          isVerified: false
        }, {
          key: '7ffc6e9b-6705-48e7-8fa7-413de9225a46',
          masked: '******3210',
          isDefault: false,
          isVerified: false
        }]
      };
      const expectedNumberOfAltChannels: number = 3; // 1 for email and 2 for mobile
      const expectedEmailChannelKey: string = 'f4dc3deb-0f52-4df6-9097-e16ec339cc92';
      const expectedEmailChannelMask: string = 'd*********e@s*******.com';

      const expectedMobileChannelKey: string = '1521cd47-377d-4f52-9594-bc7270e41dde';
      const expectedMobileChannelMask: string = '******7891';

      const altOtpDeliveryChannels: OtpDeliveryChannel[]
        = OtpDeliveryChannelsViewModel.getAlternateOtpDeliveryChannels(maskedIdentifiers);
      expect(altOtpDeliveryChannels).toBeDefined();
      expect(altOtpDeliveryChannels.length).toBe(expectedNumberOfAltChannels);

      const emailChannel = altOtpDeliveryChannels[0];
      expect(emailChannel).toBeDefined();
      expect(emailChannel.type).toBe(OtpDeliveryChannel.EMAIL_TYPE);
      expect(emailChannel.key).toBe(expectedEmailChannelKey);
      expect(emailChannel.masked).toBe(expectedEmailChannelMask);

      const mobileVoiceChannel = altOtpDeliveryChannels[1];
      expect(mobileVoiceChannel).toBeDefined();
      expect(mobileVoiceChannel.type).toBe(OtpDeliveryChannel.VOICE_TYPE);
      expect(mobileVoiceChannel.key).toBe(expectedMobileChannelKey);
      expect(mobileVoiceChannel.masked).toBe(expectedMobileChannelMask);

      const mobileTextChannel = altOtpDeliveryChannels[2];
      expect(mobileTextChannel).toBeDefined();
      expect(mobileTextChannel.type).toBe(OtpDeliveryChannel.MOBILE_TYPE);
      expect(mobileTextChannel.key).toBe(expectedMobileChannelKey);
      expect(mobileTextChannel.masked).toBe(expectedMobileChannelMask);
    });
  });
});

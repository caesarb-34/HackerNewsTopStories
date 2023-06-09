import {ExpectationFailedError} from '../shared/errors/custom-errors';
import MaskedUserIdentifiers, {MaskedUserIdentifier} from './masked-user-identifiers.model';

export default class OtpDeliveryChannelsViewModel {

  preferredChannel: OtpDeliveryChannel;
  selectedChannel: OtpDeliveryChannel;
  altChannels: OtpDeliveryChannel[];

  /**
   * get masked identifier pointed to by 'otpMfaDestination'
   *
   * @VisibleForTesting
   */
  public static getPreferredOtpDeliveryChannel(identifiers: MaskedUserIdentifiers): OtpDeliveryChannel {

    if ( ! identifiers.otpMfaDestination || ! identifiers.otpMethod ) {
      throw new ExpectationFailedError('417', 'optMfaDestination and/or optMethod are missing');
    }

    const preferredOtpDeliveryChannel: OtpDeliveryChannel = new OtpDeliveryChannel();
    const otpMfaDestination: MaskedUserIdentifier = this.findIdentifierByKey(identifiers.otpMfaDestination, identifiers);
    preferredOtpDeliveryChannel.key = otpMfaDestination.key;
    preferredOtpDeliveryChannel.masked = otpMfaDestination.masked;
    preferredOtpDeliveryChannel.type = identifiers.otpMethod;
    preferredOtpDeliveryChannel.preferred = true;
    return preferredOtpDeliveryChannel;
  }

  /**
   * Given MaskedUserIdentifiers like this, returns MaskedIdentifier that matches key
   *
   * {
   *   emails: [{
   *     key: 'f4dc3deb-0f52-4df6-9097-e16ec339cc92',
   *     masked: 'd*********e@s*******.com',
   *     isDefault: true,
   *     isVerified: true
   *   }, {
   *     key: '1ff79c5b-77c2-470a-84e5-86c3d0dde9a0',
   *     masked: 'i**********s@g****.com',
   *     isDefault: false,
   *     isVerified: false
   *   }],
   *   mobiles: [{
   *     key: 'b4af38e5-2678-4e47-8b6c-67b593d32944',
   *     masked: '******7890',
   *     isDefault: false,
   *     isVerified: false
   *   }, {
   *     key: '1521cd47-377d-4f52-9594-bc7270e41dde',
   *     masked: '******7891',
   *     isDefault: false,
   *     isVerified: false
   *   }],
   *   phones: [{
   *     key: '43be4b2c-2281-420f-9936-759da03afad7',
   *     masked: '******3211',
   *     isDefault: false,
   *     isVerified: false
   *   }, {
   *     key: '7ffc6e9b-6705-48e7-8fa7-413de9225a46',
   *     masked: '******3210',
   *     isDefault: false,
   *     isVerified: false
   *   }]
   * }
   * @VisibleForTesting
   */
  public static findIdentifierByKey(key: string, identifiers: MaskedUserIdentifiers): MaskedUserIdentifier {

    const emails: MaskedUserIdentifier[] =
      (identifiers.emails && identifiers.emails.length > 0) ?
        identifiers.emails : [];

    const mobiles: MaskedUserIdentifier[] =
      (identifiers.mobiles && identifiers.mobiles.length > 0) ?
        identifiers.mobiles : [];

    const phones: MaskedUserIdentifier[] =
      (identifiers.phones && identifiers.phones.length > 0) ?
        identifiers.phones : [];

    const combinedIdentifiers: MaskedUserIdentifier[] = emails.concat(mobiles, phones);

    return combinedIdentifiers.find(identifier => {
      return identifier.key === key;
    });
  }

  /**
   * At the moment, only 'isDefault' and 'isVerified' identifiers are eligible.
   * This can change once we begin to support multiple identifiers.
   * Given a structure like this
   *
   * emails: [{
   *   key: 'f4dc3deb-0f52-4df6-9097-e16ec339cc92',
   *   masked: 'd*********e@s*******.com',
   *   isDefault: true,
   *   isVerified: true
   * }, {
   *   key: '1ff79c5b-77c2-470a-84e5-86c3d0dde9a0',
   *   masked: 'i**********s@g****.com',
   *   isDefault: false,
   *   isVerified: false
   * }],
   * mobiles: [{
   *   key: 'b4af38e5-2678-4e47-8b6c-67b593d32944',
   *   masked: '******7890',
   *   isDefault: true,
   *   isVerified: true
   * }, {
   *   key: '1521cd47-377d-4f52-9594-bc7270e41dde',
   *   masked: '******7891',
   *   isDefault: false,
   *   isVerified: false
   * }],
   * phones: [{
   *   key: '43be4b2c-2281-420f-9936-759da03afad7',
   *   masked: '******3211',
   *   isDefault: true,
   *   isVerified: true
   * }, {
   *   key: '7ffc6e9b-6705-48e7-8fa7-413de9225a46',
   *   masked: '******3210',
   *   isDefault: false,
   *   isVerified: false
   * }]
   *
   * this method will return an array of 'OtpDeliveryChannels built from identifiers that are 'isDefault' and 'isVerified'.
   * NOTE: each category may have an identifier that 'isDefault' - i.e. a default email, a default phone and a default
   * mobile.
   * Also NOTE: mobiles can be used either for (M) text, or (V) voice, therefore a mobile channel will be added to
   * the list twice - once with 'M' type and once with 'V' type.  Whereas email and phone will appear with 'E' and 'V'
   * types respectively.
   *
   */
  public static getAlternateOtpDeliveryChannels(identifiers: MaskedUserIdentifiers): OtpDeliveryChannel[] {

    const altOtpDeliveryChannels: OtpDeliveryChannel[] = [];
    if (!identifiers) {
      return altOtpDeliveryChannels;
    }

    let defaultEmail: MaskedUserIdentifier;
    let defaultMobile: MaskedUserIdentifier;
    let defaultPhone: MaskedUserIdentifier;

    if (identifiers.emails) {
      defaultEmail = identifiers.emails.find(identifier => {
        return (identifier.isDefault && identifier.isVerified);
      });
    }

    if (identifiers.mobiles) {
      defaultMobile = identifiers.mobiles.find(identifier => {
        return (identifier.isDefault && identifier.isVerified);
      });
    }

    if (identifiers.phones) {
      defaultPhone = identifiers.phones.find(identifier => {
        return (identifier.isDefault && identifier.isVerified);
      });
    }

    // add email if exists
    if (defaultEmail) {
      const emailDeliveryChannel = new OtpDeliveryChannel();
      emailDeliveryChannel.type = 'E';
      emailDeliveryChannel.key = defaultEmail.key;
      emailDeliveryChannel.masked = defaultEmail.masked;
      altOtpDeliveryChannels.push(emailDeliveryChannel);
    }
    // add phone if exists
    if (defaultPhone) {
      const phoneDeliveryChannel = new OtpDeliveryChannel();
      phoneDeliveryChannel.type = 'V';
      phoneDeliveryChannel.key = defaultPhone.key;
      phoneDeliveryChannel.masked = defaultPhone.masked;
      altOtpDeliveryChannels.push(phoneDeliveryChannel);
    }
    // add mobile if exist creating TWO options - 'V' and 'M'
    if (defaultMobile) {
      // voice
      const mobileVoiceDeliveryChannel = new OtpDeliveryChannel();
      mobileVoiceDeliveryChannel.type = 'V';
      mobileVoiceDeliveryChannel.key = defaultMobile.key;
      mobileVoiceDeliveryChannel.masked = defaultMobile.masked;
      altOtpDeliveryChannels.push(mobileVoiceDeliveryChannel);
      // text
      const mobileTextDeliveryChannel = new OtpDeliveryChannel();
      mobileTextDeliveryChannel.type = 'M';
      mobileTextDeliveryChannel.key = defaultMobile.key;
      mobileTextDeliveryChannel.masked = defaultMobile.masked;
      altOtpDeliveryChannels.push(mobileTextDeliveryChannel);
    }
    return altOtpDeliveryChannels;
  }


  constructor() {
  }
}

export class OtpDeliveryChannel {
  public static EMAIL_TYPE = 'E';
  public static MOBILE_TYPE = 'M';
  public static VOICE_TYPE = 'V';

  type?: string;  // E | M | V
  key?: string;
  masked?: string;
  preferred?: boolean = false;

  constructor() {
  }
}

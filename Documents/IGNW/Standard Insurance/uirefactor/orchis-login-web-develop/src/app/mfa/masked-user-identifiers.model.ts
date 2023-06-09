/**
 * Sample data:
 *
 *      {
 *         otpMethod: 'E',
 *         otpMfaDestination: 'f4dc3deb-0f52-4df6-9097-e16ec339cc92',
 *         emails: [{
 *           key: 'f4dc3deb-0f52-4df6-9097-e16ec339cc92',
 *           masked: 'd*********e@s*******.com',
 *           isDefault: true,
 *           isVerified: true
 *         }, {
 *           key: '1ff79c5b-77c2-470a-84e5-86c3d0dde9a0',
 *           masked: 'i**********s@g****.com',
 *           isDefault: false,
 *           isVerified: false
 *         }],
 *         mobiles: [{
 *           key: 'b4af38e5-2678-4e47-8b6c-67b593d32944',
 *           masked: '******7890',
 *           isDefault: false,
 *           isVerified: false
 *         }, {
 *           key: '1521cd47-377d-4f52-9594-bc7270e41dde',
 *           masked: '******7891',
 *           isDefault: false,
 *           isVerified: false
 *         }],
 *         phones: [{
 *           key: '43be4b2c-2281-420f-9936-759da03afad7',
 *           masked: '******3211',
 *           isDefault: false,
 *           isVerified: false
 *         }, {
 *           key: '7ffc6e9b-6705-48e7-8fa7-413de9225a46',
 *           masked: '******3210',
 *           isDefault: false,
 *           isVerified: false
 *         }]
 *       }
 */
export default class MaskedUserIdentifiers {
  otpMfaDestination?: string;
  otpMethod?: string;  // E(mail) | M(obile) | V(oice)
  emails?: MaskedUserIdentifier[];
  mobiles?: MaskedUserIdentifier[];
  phones?: MaskedUserIdentifier[];
}

/**
 * represents individual masked user identifier
 */
export class MaskedUserIdentifier {
  key: string;
  masked: string;
  isDefault: boolean;
  isVerified: boolean;

  constructor(masked?) {
    this.masked = masked;
  }
}

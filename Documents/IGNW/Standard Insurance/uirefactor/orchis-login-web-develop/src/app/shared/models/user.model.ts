/**
 * represents 'user' object returned by cjs.getUser() or accepted by cjs.updateUser(user)
 */
export default class User {
  uuid?: string;
  uid?: string;
  unverifiedEmails?: string[];
  unverifiedMobiles?: string[];
  unverifiedPhones?: string[];
  verifiedEmails?: string[];
  verifiedMobiles?: string[];
  verifiedPhones?: string[];
  otpMfaDestination?: string;
  unknownPhone?: string;
  firstName?: string;
  forcePwdReset?: boolean;
  lastName?: string;
  middleName?: string;
  personId?: string;
  pwdLastChangedWithin?: string;
  pwdSetBy?: string;
  otpSetupComplete?: boolean;

  groupId?: string;
  isMemberOf?: string[];
  mfaMethod?: string;
  otpMethod?: string;
  locale?: string;
  dob?: string;
  gender?: string;
  address?: string;
  city?: string;
  locality?: string;
  country?: string;
  postalCode?: string;
  organization?: string;
  defaultEmail?: string;
  defaultMobile?: string;

  status?: string;
  entitlements?: string[];
  entitlementGroups?: string[];
  googleAuthSecretAccepted?: string;
  customer?: string;
  customers?: string[];
  eulaApproval?: string;
  eulaRevision?: string;
  newUserStatus?: boolean;

  constructor() {
  }

  public toString(): string {
    return ` User (
        uid: ${this.uid},
        unverifiedEmails: ${this.unverifiedEmails},
        unverifiedMobiles: ${this.unverifiedMobiles},
        unverifiedPhones: ${this.unverifiedPhones},
        verifiedEmails: ${this.verifiedEmails},
        verifiedMobiles: ${this.verifiedMobiles},
        verifiedPhones: ${this.verifiedPhones},
        unknownPhone: ${this.unknownPhone}
    ) `;
  }
}

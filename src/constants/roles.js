/**
 * Account roles.
 *
 * The values are the exact strings the API sends back on `user.role` and expects
 * on signup — uppercase. Compare against these constants, never against a
 * literal, so a backend rename is a one-line change here.
 */
export const ROLES = {
  CUSTOMER: 'CUSTOMER',
  TECHNICIAN: 'TECHNICIAN',
  ADMIN: 'ADMIN',
};

/** Account states returned by the API after signup / OTP verification. */
export const ACCOUNT_STATES = {
  READY: 'READY',
  WAITING_FOR_APPROVAL: 'WAITING_FOR_APPROVAL',
};

/**
 * Every URL in the app. Navigate with these constants instead of string
 * literals — the router and the callers can then never drift apart.
 */
export const ROUTES = {
  ROOT: '/',

  AUTH: {
    ROOT: '/auth',
    COVER: '/auth',
    LOGIN: '/auth/login',
    PHONE: '/auth/phone',
    OTP: '/auth/otp',
    REGISTER: '/auth/register',
  },

  CUSTOMER: {
    ROOT: '/customer',
    HOME: '/customer/home',
    SOLVE_METHOD: '/customer/solve-method',
    DIAGNOSIS: '/customer/diagnosis',
    DIAGNOSIS_RESULT: '/customer/diagnosis-result',
    TECHNICIANS: '/customer/technicians',
    BOOKING: '/customer/booking',
    TRACKING: '/customer/tracking',
  },

  TECHNICIAN: {
    ROOT: '/technician',
    HOME: '/technician/home',
    JOBS: '/technician/jobs',
    JOB_DETAILS: '/technician/job-details',
    ACTIVE_JOB: '/technician/active-job',
    SCHEDULE: '/technician/schedule',
  },

  PENDING_APPROVAL: '/pending-approval',
};

/** Where a user lands after signing in, by role. */
export const HOME_ROUTE_BY_ROLE = {
  CUSTOMER: ROUTES.CUSTOMER.HOME,
  TECHNICIAN: ROUTES.TECHNICIAN.HOME,
  ADMIN: ROUTES.CUSTOMER.HOME,
};

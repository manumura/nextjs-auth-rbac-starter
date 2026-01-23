export const appConstant = {
  ALG: 'RS256',
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  ACCESS_TOKEN_EXPIRES_AT: 'accessTokenExpiresAt',
  ID_TOKEN: 'idToken',
  MAX_USER_EVENTS_TO_STORE: 1000,
  // https://html.spec.whatwg.org/multipage/input.html#valid-e-mail-address
  EMAIL_VALIDATION_REGEX:
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
  CSRF_COOKIE_NAME: 'csrf_token',
};

export const errorMessages = {
  EMAIL_NOT_VERIFIED: {
    code: 'email_not_verified',
    text: 'Please verify your email before logging in.',
  },
  INVALID_EMAIL_OR_PASSWORD: {
    code: 'invalid_email_or_password',
    text: 'Invalid email or password.',
  },
  USER_DELETE_FAILED: {
    code: 'user_delete_failed',
    text: 'Failed to delete user.',
  },
};

export const appMessages = {
  PASSWORD_RESET_SUCCESS: {
    type: 'PASSWORD_RESET_SUCCESS',
    text: 'Password successfully reset! Please login with your new password.',
  },
  PROFILE_UPDATE_SUCCESS: {
    type: 'PROFILE_UPDATE_SUCCESS',
    text: 'Profile successfully updated!',
  },
  PROFILE_DELETE_SUCCESS: {
    type: 'PROFILE_DELETE_SUCCESS',
    text: 'Profile successfully deleted!',
  },
  PASSWORD_CHANGE_SUCCESS: {
    type: 'PASSWORD_CHANGE_SUCCESS',
    text: 'Password successfully updated!',
  },
  USER_CREATE_SUCCESS: {
    type: 'USER_CREATE_SUCCESS',
    text: 'User successfully created!',
  },
  USER_UPDATE_SUCCESS: {
    type: 'USER_UPDATE_SUCCESS',
    text: 'User successfully updated!',
  },
  USER_DELETE_SUCCESS: {
    type: 'USER_DELETE_SUCCESS',
    text: 'User successfully deleted!',
  },
  LOGIN_SUCCESS: {
    type: 'LOGIN_SUCCESS',
    text: 'Welcome ${name}.',
  },
  LOGOUT_SUCCESS: {
    type: 'LOGOUT_SUCCESS',
    text: 'Logout successful.',
  },
  REGISTER_SUCCESS: {
    type: 'REGISTER_SUCCESS',
    text: 'Registration successful! Please follow the link sent to your email to verify your account.',
  },
};

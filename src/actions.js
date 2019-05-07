// @flow
import type { AuthToken, AuthParams } from "./types";

const prefix = "@simpleweb/redux-saga-oauth";

export const AUTH_RESTORE = `${prefix}/AUTH_RESTORE`;

export const AUTH_LOGIN = `${prefix}/AUTH_LOGIN`;
export const AUTH_LOGIN_REQUEST = `${prefix}/AUTH_LOGIN_REQUEST`;
export const AUTH_LOGIN_ERROR = `${prefix}/AUTH_LOGIN_ERROR`;

export const AUTH_LOGOUT = `${prefix}/AUTH_LOGOUT`;
export const AUTH_LOGOUT_REQUEST = `${prefix}/AUTH_LOGOUT_REQUEST`;

export const AUTH_REFRESH_SUCCESS = `${prefix}/AUTH_REFRESH_SUCCESS`;
export const AUTH_REFRESH_ERROR = `${prefix}/AUTH_REFRESH_ERROR`;

export const AUTH_INVALID_ERROR = `${prefix}/AUTH_INVALID_ERROR`;

export const authRestore = () => ({
  type: AUTH_RESTORE,
});

export const authLogin = (payload: AuthToken) => ({
  type: AUTH_LOGIN,
  payload,
});
export const authLoginRequest = (
  payload: AuthParams,
  onSuccess: ?Function,
  onError: ?Function
) => ({
  type: AUTH_LOGIN_REQUEST,
  payload,
  onSuccess,
  onError,
});
export const authLoginError = (errors: ?any) => ({
  type: AUTH_LOGIN_ERROR,
  payload: {
    errors,
  },
});

export const authLogout = () => ({
  type: AUTH_LOGOUT,
});
export const authLogoutRequest = () => ({
  type: AUTH_LOGOUT_REQUEST,
});

export const authRefreshSuccess = (payload: AuthToken) => ({
  type: AUTH_REFRESH_SUCCESS,
  payload,
});
export const authRefreshError = (errors: ?any) => ({
  type: AUTH_REFRESH_ERROR,
  payload: {
    errors,
  },
});

export const authInvalidError = (errors: ?any) => ({
  type: AUTH_INVALID_ERROR,
  payload: {
    errors,
  },
});

// @flow
import {
  delay,
  select,
  race,
  take,
  fork,
  put,
  cancel,
  call,
} from "redux-saga/effects";
import axios from "axios";
import {
  AUTH_LOGIN_REQUEST,
  AUTH_LOGIN_ERROR,
  AUTH_LOGOUT_REQUEST,
  AUTH_INVALID_ERROR,
  authRestore,
  authLogin,
  authLoginError,
  authLogout,
  authRefreshSuccess,
  authRefreshError,
  authInvalidError,
} from "./actions";
import type { State } from "./reducer";

const tokenHasExpired = ({
  expires_in,
  created_at,
}: {
  expires_in: number,
  created_at: number,
}) => {
  const MILLISECONDS_IN_MINUTE = 1000 * 60;

  // set refreshBuffer to 10 minutes
  // so the token is refreshed before expiry
  const refreshBuffer = MILLISECONDS_IN_MINUTE * 10;

  // expiry time
  // multiplied by 1000 as server time are return in seconds, not milliseconds
  const expires_at = new Date((created_at + expires_in) * 1000).getTime();
  // the current time
  const now = new Date().getTime();
  // when we want the token to be refreshed
  const refresh_at = expires_at - refreshBuffer;

  return now >= refresh_at;
};

const createAuthSaga = (options: {
  loginActions?: Object,
  reducerKey: string,
  OAUTH_URL: string,
  OAUTH_CLIENT_ID: string,
  OAUTH_CLIENT_SECRET: string,
}) => {
  const {
    loginActions,
    OAUTH_URL,
    OAUTH_CLIENT_ID,
    OAUTH_CLIENT_SECRET,
    reducerKey,
  } = options;

  const getAuth = state => state[reducerKey];

  function* RefreshToken(refresh_token) {
    try {
      const params = {
        refresh_token,
        client_id: OAUTH_CLIENT_ID,
        client_secret: OAUTH_CLIENT_SECRET,
        grant_type: "refresh_token",
      };
      const { data: token } = yield call(axios.post, OAUTH_URL, params);
      yield put(authRefreshSuccess(token));
      return true;
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          yield put(authInvalidError(error.response));
        } else {
          yield put(authRefreshError(error.response));
        }
      } else {
        yield put(authRefreshError(error));
      }
      return false;
    }
  }

  function* RefreshLoop() {
    const maxRetries = 5;
    let retries = 0;

    while (true) {
      const { expires_in, created_at, refresh_token } = yield select(getAuth);

      // if the token has expired, refresh it
      if (
        expires_in !== null &&
        created_at !== null &&
        tokenHasExpired({ expires_in, created_at })
      ) {
        const refreshed = yield call(RefreshToken, refresh_token);

        // if the refresh succeeded set the retires to 0
        // if the refresh failed, log a failure
        if (refreshed) {
          // if the token has been refreshed, and their had been retries
          // let the user know everything is okay
          if (retries > 0) {
            // @TODO add hook
          }
          retries = 0;
        } else {
          retries = retries + 1;
        }

        if (retries > 0 && retries < maxRetries) {
          // @TODO add hook
        }

        if (retries === maxRetries) {
          // @TODO add hook
        }
      }

      // check again in 5 seconds
      // this will also replay failed refresh attempts
      yield delay(5000);
    }
  }

  function* Authorize(action) {
    try {
      const { onSuccess, payload } = action;

      const params = {
        ...payload,
        client_id: OAUTH_CLIENT_ID,
        client_secret: OAUTH_CLIENT_SECRET,
      };

      const { data: token } = yield call(axios.post, OAUTH_URL, params);
      yield put(authLogin(token));

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      const { onError } = action;

      if (onError) {
        onError(error.response ? error.response.data : error);
      }

      if (error.response) {
        yield put(authLoginError(error.response.data));
      } else {
        yield put(authLoginError(error));
      }
    }
  }

  function* Authentication(): Generator<*, *, *> {
    while (true) {
      const { loggedIn } = yield select(getAuth);
      var authorizeTask = null;

      // if the users is logged in, we can skip over this bit
      if (!loggedIn) {
        // wait for a user to request to login
        // or any custom login actions
        const actions = yield race({
          login: take(AUTH_LOGIN_REQUEST),
          ...loginActions,
        });

        if (actions.login) {
          // in the background, run a task to log them in
          authorizeTask = yield fork(Authorize, actions.login);
        }
      } else {
        // dispatch an action so we know the user is back into an
        // authenticated state
        yield put(authRestore());
      }

      // wait for...
      // the user to logout (AUTH_LOGOUT_REQUEST)
      // OR an error to occur during login (AUTH_LOGIN_ERROR)
      // OR the user to become unauthorized (AUTH_INVALID_ERROR)
      // but while they are logged in, begin the refresh token loop
      const actions = yield race({
        logout: take(AUTH_LOGOUT_REQUEST),
        loginError: take(AUTH_LOGIN_ERROR),
        unauthorized: take(AUTH_INVALID_ERROR),
        refresh: call(RefreshLoop),
      });

      // cancel the authorizeTask task if it's running and exists
      if (authorizeTask !== null) {
        yield cancel(authorizeTask);
      }

      // finally log the user out
      yield put(authLogout());
    }
  }

  return Authentication;
};

export default createAuthSaga;

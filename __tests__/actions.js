// @flow
import {
  AUTH_RESTORE,
  AUTH_LOGIN,
  AUTH_LOGIN_REQUEST,
  AUTH_LOGIN_ERROR,
  AUTH_LOGOUT,
  AUTH_LOGOUT_REQUEST,
  AUTH_REFRESH_SUCCESS,
  AUTH_REFRESH_ERROR,
  AUTH_INVALID_ERROR,
  authRestore,
  authLogin,
  authLoginRequest,
  authLoginError,
  authLogout,
  authLogoutRequest,
  authRefreshSuccess,
  authRefreshError,
  authInvalidError,
} from "./../src/actions";

describe("Auth Actions", () => {

  const token = {
    created_at: Math.round(new Date().getTime() / 1000),
    expires_in: 7200,
    refresh_token: "ddd3d24db5e9d2e9d224b28947799bbe8ced68ef888e4eeff46fe44f6a",
    access_token: "7c236b2600b2310bdfc128e5a13d76949506b52b86e1826150d575878fe",
    token_type: "bearer",
  };

  describe("Restore", () => {
    it(`authRestore() creates an ${AUTH_RESTORE} action`, () => {
      const action = authRestore();
      const expectedAction = {
        type: AUTH_RESTORE,
      };

      expect(action).toEqual(expectedAction);
    });
  });

  describe("Login", () => {
    it(`authLogin() creates an ${AUTH_LOGIN} action with a token`, () => {
      const action = authLogin(token);
      const expectedAction = {
        type: AUTH_LOGIN,
        payload: token,
      };

      expect(action).toEqual(expectedAction);
    });

    it(`authLoginRequest() creates an ${AUTH_LOGIN_REQUEST} action`, () => {
      const params = {
        client_id: "287ea71215dfb6552c7a4467966799ea3f815cd8d7c0325dcce9814103",
        grant_type: "password",
        username: "admin@simpleweb.co.uk",
        password: "password",
      };
      const action = authLoginRequest(params);
      const expectedAction = {
        type: AUTH_LOGIN_REQUEST,
        payload: params,
      };

      expect(action).toEqual(expectedAction);
    });

    it(`authLoginRequest() creates an ${AUTH_LOGIN_REQUEST} action with a onSuccess callback`, () => {
      const params = {
        client_id: "287ea71215dfb6552c7a4467966799ea3f815cd8d7c0325dcce9814103",
        grant_type: "password",
        username: "admin@simpleweb.co.uk",
        password: "password",
      };
      const onSuccess = () => undefined;
      const onError = () => undefined;
      const action = authLoginRequest(params, onSuccess, onError);
      const expectedAction = {
        type: AUTH_LOGIN_REQUEST,
        payload: params,
        onSuccess,
        onError,
      };

      expect(action).toEqual(expectedAction);
    });

    it(`authLoginRequest() creates an ${AUTH_LOGIN_REQUEST} action with a onError callback`, () => {
      const params = {
        client_id: "287ea71215dfb6552c7a4467966799ea3f815cd8d7c0325dcce9814103",
        grant_type: "password",
        username: "",
        password: "",
      };
      const onSuccess = () => undefined;
      const onError = () => undefined;
      const action = authLoginRequest(params, onSuccess, onError);
      const expectedAction = {
        type: AUTH_LOGIN_REQUEST,
        payload: params,
        onSuccess,
        onError,
      };

      expect(action).toEqual(expectedAction);
    });

    it(`authLoginError() creates an ${AUTH_LOGIN_ERROR} action`, () => {
      const errors = [{ text: "There was an error refreshing your token" }];
      const action = authLoginError(errors);
      const expectedAction = {
        type: AUTH_LOGIN_ERROR,
        payload: {
          errors,
        },
      };

      expect(action).toEqual(expectedAction);
    });
  });

  describe("Logout", () => {
    it(`authLogout() creates an ${AUTH_LOGOUT} action`, () => {
      const action = authLogout();
      const expectedAction = {
        type: AUTH_LOGOUT,
      };

      expect(action).toEqual(expectedAction);
    });

    it(`authLogoutRequest() creates an ${AUTH_LOGOUT_REQUEST} action`, () => {
      const action = authLogoutRequest();
      const expectedAction = {
        type: AUTH_LOGOUT_REQUEST,
      };

      expect(action).toEqual(expectedAction);
    });
  });

  describe("Refresh", () => {
    it(`authRefreshSuccess() creates an ${AUTH_REFRESH_SUCCESS} action with a token`, () => {
      const action = authRefreshSuccess(token);
      const expectedAction = {
        type: AUTH_REFRESH_SUCCESS,
        payload: token,
      };

      expect(action).toEqual(expectedAction);
    });

    it(`authRefreshError() creates an ${AUTH_REFRESH_ERROR} action with errors`, () => {
      const errors = [{ text: "There was an error refreshing your token" }];
      const action = authRefreshError(errors);
      const expectedAction = {
        type: AUTH_REFRESH_ERROR,
        payload: {
          errors,
        },
      };

      expect(action).toEqual(expectedAction);
    });
  });

  describe("Invalid", () => {
    it(`authInvalidError() creates an ${AUTH_INVALID_ERROR} action with errors`, () => {
      const errors = [{ text: "There was an error refreshing your token" }];
      const action = authInvalidError(errors);
      const expectedAction = {
        type: AUTH_INVALID_ERROR,
        payload: {
          errors,
        },
      };

      expect(action).toEqual(expectedAction);
    });
  });

});

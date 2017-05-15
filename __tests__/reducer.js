// @flow
import reducer from "./../src/reducer";
import {
  authLogin,
  authLogout,
  authRefreshSuccess,
} from "./../src/actions";

describe("Auth Reducer", () => {

  const token = {
    created_at: Math.round(new Date().getTime() / 1000),
    expires_in: 7200,
    refresh_token: "ddd3d24db5e9d2e9d224b28947799bbe8ced68ef888e4eeff46fe44f6a",
    access_token: "7c236b2600b2310bdfc128e5a13d76949506b52b86e1826150d575878fe",
    token_type: "bearer",
  };

  const initialState = {
    loggedIn: false,
    access_token: null,
    token_type: null,
    refresh_token: null,
    expires_in: null,
    created_at: null,
  };

  it("should return an initial state", () => {
    const state = undefined;
    const action = {};
    const expectedState = {
      loggedIn: false,
      access_token: null,
      token_type: null,
      refresh_token: null,
      expires_in: null,
      created_at: null,
    };

    expect(reducer(state, action)).toEqual(expectedState);
  });

  it("should handle authLogin()", () => {
    const state = {
      ...initialState,
    };
    const action = authLogin(token);
    const expectedState = {
      loggedIn: true,
      access_token: token.access_token,
      token_type: token.token_type,
      refresh_token: token.refresh_token,
      expires_in: token.expires_in,
      created_at: token.created_at,
    };

    expect(reducer(state, action)).toEqual(expectedState);
  });

  it("should handle authLogout()", () => {
    const state = {
      loggedIn: true,
      ...token,
    };
    const action = authLogout();
    const expectedState = {
      loggedIn: false,
      access_token: null,
      token_type: null,
      refresh_token: null,
      expires_in: null,
      created_at: null,
    };

    expect(reducer(state, action)).toEqual(expectedState);
  });

  it("should handle authRefreshSuccess()", () => {
    const refreshToken = {
      created_at: Math.round(new Date().getTime() / 1000) + 1000,
      expires_in: 7200,
      refresh_token: "79b6da5f71196434f74e3694d4efec96179835ed1b93b8af0ee9c191",
      access_token: "58b9dee623a94d921a440b063bd030bdc75ea81c2a1a84975d6d264ae",
      token_type: "bearer",
    };
    const state = {
      loggedIn: true,
      access_token: token.access_token,
      token_type: token.token_type,
      refresh_token: token.refresh_token,
      expires_in: token.expires_in,
      created_at: token.created_at,
    };
    const action = authRefreshSuccess(refreshToken);
    const expectedState = {
      loggedIn: true,
      access_token: refreshToken.access_token,
      token_type: refreshToken.token_type,
      refresh_token: refreshToken.refresh_token,
      expires_in: refreshToken.expires_in,
      created_at: refreshToken.created_at,
    };

    expect(reducer(state, action)).toEqual(expectedState);
  });

});

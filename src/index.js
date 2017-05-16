// @flow
import * as Actions from "./actions";
import Reducer from "./reducer";
import createOAuthSaga from "./saga";

const login = Actions.authLoginRequest;
const logout = Actions.authLogoutRequest;

export {
  Actions,
  Reducer,
  createOAuthSaga,
  login,
  logout,
};

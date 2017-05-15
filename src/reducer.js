// @flow
import {
  AUTH_LOGIN,
  AUTH_LOGOUT,
  AUTH_REFRESH_SUCCESS,
} from "./actions";
import type { AuthToken } from "./types";

export type State = {
  loggedIn: bool,
  access_token: null|string,
  created_at: null|number,
  expires_in: null|number,
  refresh_token: null|string,
  token_type: null|string,
};

type Action = {
  type?: string,
  payload?: AuthToken,
};

const initialState: State = {
  loggedIn: false,
  access_token: null,
  created_at: null,
  expires_in: null,
  refresh_token: null,
  token_type: null,
};

const reducer = (state: State = initialState, action: Action): State => {
  switch(action.type) {
    case AUTH_LOGIN:
    case AUTH_REFRESH_SUCCESS:
      if (action.payload) {
        return {
          ...state,
          loggedIn: true,
          access_token: action.payload.access_token,
          token_type: action.payload.token_type,
          refresh_token: action.payload.refresh_token,
          expires_in: action.payload.expires_in,
          created_at: action.payload.created_at,
        };
      }

    case AUTH_LOGOUT:
      return {
        ...initialState,
      };

    // this is for debugging, there is no public action to call this
    case "AUTH_EXPIRE_TOKEN":
      return {
        ...state,
        expires_in: 0,
      };

    default:
      return state;
  }
};

export default reducer;

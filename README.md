# redux-saga-oauth

[![NPM](https://img.shields.io/npm/v/@simpleweb/redux-saga-oauth.svg)](https://www.npmjs.com/package/@simpleweb/redux-saga-oauth)
[![Build Status](https://semaphoreci.com/api/v1/projects/80e0a632-ac8f-4dc6-bfca-10565b56f6f8/1319097/badge.svg)](https://semaphoreci.com/simpleweb/redux-saga-oauth)

👮 An OAuth module for Redux Saga powered applications

## What does it do?

Redux Saga OAuth provides a reducer and a saga to handle authentication within
any JavaScript application that uses Redux and Redux Saga.

### Key features

* Has Flow support for easier integration
* Handles all HTTP requests with [axios](https://github.com/mzabriskie/axios)
* Allows for any grant types and extra data to be passed during login
* Automatically handles token refresh following the standard flow
* Handles failures during the refresh flow and will retry until it succeeds
* Allows the refresh token to be expired on the server and log users out

## Getting started

### Install

You can install this via `yarn` or `npm`, however, `yarn` is the preferred
method.

```
yarn add @simpleweb/redux-saga-oauth
```
```
npm install --save @simpleweb/redux-saga-oauth
```

It also has a peer dependency of `redux-saga`, please make sure this is
installed before hand.

### Usage

#### Add the provided reducer to your store

Within your existing Redux store, bring in the provided reducer. It’s key
(`auth` in the example below) can be customised to anything you like.

```js
import { Reducer } from "@simpleweb/redux-saga-oauth";


const store = createStore(
  combineReducers({
    auth: Reducer,
  })
);
```

#### Add the provided saga to your root saga

Create the provided auth saga and add it to your root saga. These are the
required options you must pass. The `reducerKey` should match the key from
the step above.

```js
import { createOAuthSaga } from "@simpleweb/redux-saga-oauth";

const authSaga = createOAuthSaga({
  reducerKey: "auth",
  OAUTH_URL: "http://localhost:3000/oauth/token.json",
  OAUTH_CLIENT_ID: "<CLIENT ID>",
  OAUTH_CLIENT_SECRET: "<CLIENT SECRET>",
});

const sagas = function* rootSaga() {
  yield all([
    fork(authSaga),
  ]);
}
```

#### Login and logout

To login, simply import the provided actions, pass through your API’s
corresponding credentials and dispatch the action.

```js
import { login, logout } from "@simpleweb/redux-saga-oauth";

const params = {
  username: "ben@simpleweb.co.uk",
  password: "mysecurepassword",
  grant_type: "password",
};

store.dispatch(
  login(params)
);

store.dispatch(
  logout()
);
```

#### Actions

The module does expose all it’s internal Redux actions and constants should you
need them. They are exposed like so.

```js
import { Actions } from "@simpleweb/redux-saga-oauth";

Actions.authLoginRequest()
Actions.AUTH_LOGIN_REQUEST
```

#### Authenticated requests

This will something you _will_ want to do after having got this working, while
the code is not directly provided in the module, it's worth moving this into
your own codebase as some sort of helper function to make authenticated
requests using the access token in the store.

Please note any `import`’s are missing from the code below.

`App/Sagas/AuthenticatedRequest.js`

```js
// Custom error type to be thrown from this saga
// e.g. throw new AuthenticationSagaError('Some message');
function AuthenticationSagaError(message) {
  this.message = message;
  this.name = "AuthenticationSagaError";
}

// Helper function to get the authentication state from the store
// the "authentication" key will be unique to your code
const getAuthentication = state => state.auth;

// Helper function to check if the token has expired
export const tokenHasExpired = ({ expiresIn, createdAt }) => {
  const MILLISECONDS_IN_MINUTE = 1000 * 60;

  // Set refreshBuffer to 10 minutes
  // so the token is refreshed before expiry
  const refreshBuffer = MILLISECONDS_IN_MINUTE * 10;

  // Expiry time
  // multiplied by 1000 as server time are return in seconds, not milliseconds
  const expiresAt = new Date((createdAt + expiresIn) * 1000).getTime();
  // The current time
  const now = new Date().getTime();
  // When we want the token to be refreshed
  const refreshAt = expiresAt - refreshBuffer;

  return now >= refreshAt;
};

// Helper function to get the access token from the store
// if the token has expired, it will wait until the token has been refreshed
// or an authentication invalid error is thrown
function* getAccessToken() {
  const authentication = yield select(getAuthentication);

  // Expires_in, created_at

  // If the token has expired, wait for the refresh action
  if (
    tokenHasExpired({
      expiresIn: authentication.expires_in,
      createdAt: authentication.created_at,
    })
  ) {
    yield race({
      refreshError: take(AUTH_INVALID_ERROR),
      tokenRefreshed: take(AUTH_REFRESH_SUCCESS),
    });
  }

  // Return the latest access token
  const latestAuthentication = yield select(getAuthentication);
  return latestAuthentication.access_token;
}

// Finally the function you’ll use inside your sagas to make requests
export default function* AuthenticatedRequest(...args) {
  // Get the current access token, wait for it if it needs refreshing
  const accessToken = yield getAccessToken();

  if (accessToken) {
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    try {
      return yield call(...args, config);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        yield put(authInvalidError(error.response));
        throw new AuthenticationSagaError("Unauthorized");
      } else {
        throw error;
      }
    }
  } else {
    throw new AuthenticationSagaError("No access token");
  }
}
```

##### Usage

The `AuthenticatedRequest` function simply wraps your normally API calls so
additional headers can be passed down to add in the access token.

```js
import axios from "axios";
import AuthenticatedRequest from "App/Sagas/AuthenticatedRequest";

function* MakeRequest() {
  try {
    const response = yield AuthenticatedRequest(axios.get, "/user");
  } catch(error) {

  }
}
```

## Development

You can test this locally by installing it’s dependencies and linking it as a
local module.

```
git clone git@github.com:simpleweb/redux-saga-oauth.git
cd redux-saga-oauth
yarn && yarn link
```

## Deployment

Increment the `version` inside of the `package.json` and create a commit stating
a new version has been created, e.g. "🚀 Released 1.0.0".

On Github,
[draft a new release](https://github.com/simpleweb/redux-saga-oauth/releases/new)
, set the version and release title to "vX.X.X" (the version number that you
want to release) and add a description of the new release.

Now run `yarn publish --access=public` to deploy the code to npm.

## TL;DR

![](https://media.giphy.com/media/12OIWdzFhisgww/giphy.gif)

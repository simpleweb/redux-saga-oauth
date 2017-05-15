# redux-saga-oauth
👮 An OAuth module for Redux Saga powered applications

## Getting started

### Install

_coming soon_

### Usage

#### Add the provided reducer to your store

Within your existing Redux store, bring in the provided reducer. It’s key
(`auth` in the example below) can be customised to anything you like.

```js
import { authSagaReducer } from "@simpleweb/redux-saga-oauth";


const store = createStore(
  combineReducers({
    auth: authSagaReducer,
  })
);
```

#### Add the provided saga to your root saga

Create the provided auth saga and add it to your root saga. These are the
required options you must pass. The `reducerKey` should match the key from
the step above.

```js
import { createAuthSaga } from "@simpleweb/redux-saga-oauth";

const authSaga = createAuthSaga({
  reducerKey: "auth",
  OAUTH_URL: "http://localhost:3000/oauth/token.json",
  OAUTH_CLIENT_ID: "<CLIENT ID>",
});

const sagas = function* rootSaga() {
  yield all([
    fork(authSaga),
  ]);
}
```

#### Login

To login, simply import the provided actions, pass through your API’s
corresponding credentials and dispatch the action.

```js
import { authSagaActions } from "@simpleweb/redux-saga-oauth";

const params = {
  username: "ben@simpleweb.co.uk",
  password: "mysecurepassword",
  grant_type: "password",
};

const callback = () => {
  console.log("You’ve been logged in")
};

store.dispatch(
  authSagaActions.authLoginRequest(params, callback)
);
```

#### Logout

You can logout in a very similar way.

```js
import { authSagaActions } from "@simpleweb/redux-saga-oauth";

store.dispatch(
  authSagaActions.authLogoutRequest()
);
```

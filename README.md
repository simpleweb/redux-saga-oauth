# redux-saga-oauth
👮 An OAuth module for Redux Saga powered applications

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

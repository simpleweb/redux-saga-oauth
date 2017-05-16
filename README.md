# redux-saga-oauth [![Build Status](https://semaphoreci.com/api/v1/projects/80e0a632-ac8f-4dc6-bfca-10565b56f6f8/1319097/badge.svg)](https://semaphoreci.com/simpleweb/redux-saga-oauth)
👮 An OAuth module for Redux Saga powered applications

## What does it do?

Redux Saga OAuth provides a reducer and a saga to handle authentication within
any JavaScript application that uses Redux and Redux Saga.

### Key features

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

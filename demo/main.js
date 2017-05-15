// @flow
declare var $: any;
import { createStore, applyMiddleware, combineReducers } from "redux";
import createSagaMiddleware from "redux-saga";
import { take } from "redux-saga/effects";
import { all, fork } from "redux-saga/effects";
import { createLogger } from "redux-logger";
import {
  authSagaReducer,
  createAuthSaga,
  authSagaActions,
} from "./../src";

const loggerMiddleware = createLogger();

const authSaga = createAuthSaga({
  loginActions: {
    userRegister: take("USERS_REGISTER_SUCCESS"),
  },
  reducerKey: 'custom_auth',
  OAUTH_URL: `http://localhost:3000/oauth/token.json`,
  OAUTH_CLIENT_ID: "287ea71215dfb6552c7a4467966799ea3f815cd8d7c0325dcce981410337878e",
});

const sagas = function* rootSaga() {
  yield all([
    fork(authSaga),
  ]);
}

const reducers = combineReducers({
  custom_auth: authSagaReducer,
});

const sagaMiddleware = createSagaMiddleware();

const store = createStore(
  reducers,
  applyMiddleware(...[
    sagaMiddleware,
    loggerMiddleware,
  ])
);

const render = () => {
  const { loggedIn } = store.getState().custom_auth;
  if (loggedIn) {
    $("body").addClass("is-logged-in");
  } else {
    $("body").removeClass("is-logged-in");
  }
};

store.subscribe(render);

sagaMiddleware.run(sagas);

console.log("Running...", store.getState().custom_auth);

$("form").on("submit", (e) => {
  e.preventDefault();

  const email = $("input[name=email]").val();
  const password = $("input[name=password]").val();

  const params = {
    username: email,
    password,
    grant_type: "password",
  };

  const callback = () => {
    console.log("You’ve been logged in")
  };

  store.dispatch(
    authSagaActions.authLoginRequest(params, callback)
  );
});

$("#expire").on("click", () => {
  store.dispatch(
    { type: "AUTH_EXPIRE_TOKEN" }
  );
});

$("#logout").on("click", () => {
  store.dispatch(
    authSagaActions.authLogoutRequest()
  );
});

$("#simulate").on("click", () => {
  store.dispatch(
    { type: "USERS_REGISTER_SUCCESS" }
  );
});

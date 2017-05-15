// @flow
import { createStore, applyMiddleware, combineReducers } from "redux";
import createSagaMiddleware from "redux-saga";
import { all, fork } from "redux-saga/effects";
import { createLogger } from "redux-logger";
import { reducer as auth } from "./../src";

const loggerMiddleware = createLogger();

const sagas = function* rootSaga() {
  yield all([]);
}

const reducers = combineReducers({
  auth,
});

const sagaMiddleware = createSagaMiddleware();

const store = createStore(
  reducers,
  applyMiddleware(...[
    sagaMiddleware,
    loggerMiddleware,
  ])
);

sagaMiddleware.run(sagas);

console.log("Running...", store.getState());

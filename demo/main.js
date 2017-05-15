// @flow
import { createStore, applyMiddleware, combineReducers } from "redux";
import createSagaMiddleware from "redux-saga";
import { all, fork } from "redux-saga/effects";
import { createLogger } from "redux-logger";
import ReduxSagaOAuth from "./../src";

const loggerMiddleware = createLogger();

const dummyReducer = () => ({});

const sagas = function* rootSaga() {
  yield all([]);
}

const reducers = combineReducers({
  dummy: dummyReducer,
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

/**
 * Created by iLeaf Solutions
 * on Aug 27, 2019
 * ConfigureStore - Store configuring.
 */

import sagas from '../sagas';
import reduxReset from 'redux-reset';
import rootReducers from '../reducers';
import {createLogger} from 'redux-logger';
import createSagaMiddleware from 'redux-saga';
import {createStore, compose, applyMiddleware} from 'redux';
// import AsyncStorage from "@react-native-community/async-storage";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  persistReducer,
  persistStore,
  persistCombineReducers,
} from 'redux-persist';
import createEncryptor from 'redux-persist-transform-encrypt';

// import { createStore, applyMiddleware } from "redux";
// import createSagaMiddleware from "redux-saga";
// import { persistStore, persistReducer } from "redux-persist";
// import createEncryptor from "redux-persist-transform-encrypt";
// import AsyncStorage from "@react-native-community/async-storage";
// import logger from "redux-logger";
// import rootReducer from "../reducers";
// import sagas from "../sagas";

// const createReduxStore = (secretKey) => {
//   const encryptor = createEncryptor({
//     secretKey: "secretKey",
//     onError(error) {
//       console.log("ENCRYPTION ERROR: ^^^^^^^^^^^^", error);
//     },
//   });
//   const persistConfig = {
//     key: "reduxPersist",
//     storage: AsyncStorage,
//     // transforms: [encryptor],
//   };

//   sagaMiddleware = createSagaMiddleware();
//   const middlewares = [sagaMiddleware, logger];
//   const persistedReducer = persistReducer(persistConfig, rootReducer);
//   store = createStore(persistedReducer, applyMiddleware(...middlewares));
//   const persistor = persistStore(store);
//   sagaMiddleware.run(sagas);
//   return persistor;
// };

// export default createReduxStore;

const encryptor = createEncryptor({
  secretKey: 'secretKey',
  onError(error) {
    console.log('ENCRYPTION ERROR: ^^^^^^^^^^^^', error);
  },
});

const config = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: [
    'appReducer',
    'searchHistoryReducer',
    'loginReducer',
    'homeReducer',
    'addAddressReducer',
    'cartReducer',
  ], //to persist reducer data
  blacklist: ['productsListReducer', 'filterListReducer'], //to remove reducer to persist
  debug: true, //to get useful logging,
  transforms: [encryptor],
};

const middleware = [];
const sagaMiddleware = createSagaMiddleware();

middleware.push(sagaMiddleware);

if (__DEV__) {
  middleware.push(createLogger());
}

const reducers = persistCombineReducers(config, rootReducers);
const enhancers = [applyMiddleware(...middleware), reduxReset()];
// const initialState = {};
const persistConfig = {enhancers};
const store = createStore(reducers, undefined, compose(...enhancers));
const persistor = persistStore(store, persistConfig, () => {
  //   console.log('Test', store.getState());
});
const configureStore = () => {
  return {persistor, store};
};

sagaMiddleware.run(sagas);

export default configureStore;

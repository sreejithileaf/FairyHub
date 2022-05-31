// "ADD_ADDRESS_REQUEST";
// "ADD_ADDRESS_RESPONSE";
// "ADD_ADDRESS_FAILED";

import * as types from '../actions/types';
import createReducer from '../lib/createReducer';

const initialState = {
  addressList: [],
  message: '',
};

export const addAddressReducer = createReducer(initialState, {
  [types.ADD_ADDRESS_REQUEST](state, action) {
    return {
      ...state,
    };
  },
  [types.ADD_ADDRESS_RESPONSE](state, action) {
    return {
      ...state,
      addressList: action.response,
      message: 'success',
    };
  },
  [types.UPDATE_ADDRESS](state, action) {
    return {
      ...state,
      addressList: action.address,
      message: 'success',
    };
  },
  [types.ADD_ADDRESS_FAILED](state, action) {
    return {
      ...state,
      message: 'failure',
    };
  },
  [types.USER_LOG_OUT](state, action) {
    return {
      ...state,
      addressList: [],
      message: '',
    };
  },
});

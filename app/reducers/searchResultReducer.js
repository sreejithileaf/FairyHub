/**
 * Created by Jebin for iLeaf Solutions Pvt.Ltd
 * on March 10, 2020
 * Search Result Reducer - handles search results state
 */

import createReducer from '../lib/createReducer';
import * as types from '../actions/types';

const initialState = {
  searchResultArray: [],
};

export const searchResultReducer = createReducer(initialState, {
  [types.UPDATE_SEARCH_RESULT](state, actions) {
    return {
      ...state,
      searchResultArray: actions.searchResultArray,
    };
  },
  [types.CLEAR_SEARCH_RESULT](state, actions) {
    return {
      ...state,
      searchResultArray: [],
    };
  },
  [types.USER_LOG_OUT](state, action) {
    return {
      ...state,
      searchResultArray: [],
    };
  },
});

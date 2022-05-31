import * as types from "../actions/types";
import createReducer from "../lib/createReducer";

const initialState = {
  filter_list: [],
  selectedFilters: {},
  message: "",
  filterCategoryId: "",
};

export const filterListReducer = createReducer(initialState, {
  [types.LOAD_FILTER_REQUEST](state, action) {
    return {
      ...state,
    };
  },
  [types.LOAD_FILTER_RESPONSE](state, action) {
    // const filterArray =
    return {
      ...state,
      filter_list: action.response,
      filterCategoryId: action.filterCategoryId,
      message: "success",
    };
  },
  [types.LOAD_FILTER_FAILURE](state, action) {
    return {
      ...state,
      filter_list: [],
      message: "failure",
    };
  },
  [types.UPDATE_SELECTED_FILTERS](state, action) {
    return {
      ...state,
      selectedFilters: action.filters,
    };
  },
  [types.RESET_FILTER](state, action) {
    return {
      ...state,
      filter_list: [],
      selectedFilters: {},
      message: "",
    };
  },
  [types.RESET_FILTER_DATA](state) {
    return {
      ...state,
      selectedFilters: {},
    };
  },
});

/**
 * Created by Arun for iLeaf Solutions Pvt.Ltd
 * on March 4 , 2020
 * Filter Result Actions -  Actions for Filter Result data updations
 */

import * as types from "./types";

// action requst to load filters
export function loadFilterRequest(categoryid, callback) {
  return {
    type: types.LOAD_FILTER_REQUEST,
    categoryid, //pass category id
    callback,
  };
}

//action to collect response
export function loadFilterList(response, filterCategoryId) {
  return {
    type: types.LOAD_FILTER_RESPONSE,
    response,
    filterCategoryId,
  };
}

//action request for failure status
export function loadFilterFailure() {
  return {
    type: types.LOAD_FILTER_FAILURE,
    status: "failed", //pass category id
  };
}

//action to update filters
export function updateFilters(filters) {
  return {
    type: types.UPDATE_SELECTED_FILTERS,
    filters, //pass category id
  };
}

//action request to reset filters
export function resetFilters() {
  return {
    type: types.RESET_FILTER,
  };
}

export function filterRequest(params) {
  return {
    type: types.FILTER_REQUEST,
    params,
  };
}
export function filterResponse(response) {
  return {
    type: types.FILTER_RESPONSE,
    response,
  };
}
export function filterFailed() {
  return {
    type: types.FILTER_FAILURE,
    status: "failed",
  };
}

export function clearSelectedFilters() {
  return {
    type: types.RESET_FILTER_DATA,
  };
}

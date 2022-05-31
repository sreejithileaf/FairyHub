/**
 * Created by ARUN
 * on MARCH 05, 2020
 * Loading - Actions for data in home screen
 */

import * as types from "./types";

export function getPromotionCategories(params, callback) {
  return {
    type: types.GET_PROMOTION_CATEGORIES,
    params,
    callback,
  };
}

export function getPromotionProducts(params, callback) {
  return {
    type: types.GET_PROMOTION_PRODUCTS,
    params,
    callback,
  };
}

export function homeRequest(callback) {
  return {
    type: types.GET_HOME_REQUEST,
    callback,
  };
}

export function homeAddRequest(callback) {
  return {
    type: types.GET_HOME_ADD_REQUEST,
    callback,
  };
}

export function homeResponse(response) {
  return {
    type: types.GET_HOME_RESPONSE,
    response,
  };
}

export function homeAddResponse(updateTime, response) {
  return {
    type: types.GET_HOME_ADD_RESPONSE,
    updateTime,
    response,
  };
}

export function homeFailure() {
  return {
    type: types.GET_HOME_FAILED,
  };
}

export function getStatusItems(params, callback) {
  return {
    type: types.GET_STATUS_DATA,
    params,
    callback,
  };
}

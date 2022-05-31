/**
 * Created by Jebin for iLeaf Solutions Pvt.Ltd
 * on February 20, 2020
 * CategoryActions - actions for category related operations
 */

import * as types from "./types";

export function getAllCategories() {
  return {
    type: types.GET_ALL_CATEGORIES,
  };
}

export function onCategoryResponse(response) {
  return {
    type: types.GET_ALL_CATEGORIES_RESPONSE,
    response,
  };
}

export function getSubCategoryList(params, callback) {
  return {
    type: types.GET_SUB_CATEGORY_LIST,
    params,
    callback,
  };
}

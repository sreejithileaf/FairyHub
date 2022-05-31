/**
 * Created by Jebin for iLeaf Solutions Pvt.Ltd
 * on February 28, 2020
 * SearchSaga - handles searching of products
 */

import { showSingleAlert } from "../config/common";
import { put, call, select } from "redux-saga/effects";
import { translate } from "../config/languageSwitching";
import { getSearchProductsAPI, getTopSearchesAPI } from "../api/apiMethods";
import * as searchActions from "../actions/searchActions";
import * as loadingActions from "../actions/loadingActions";

export function* getProductsBySearchTextSaga(action) {
  const { isNetworkAvailable, adminToken, storeCode } = yield select(
    (state) => state.appReducer
  );
  if (!isNetworkAvailable) {
    showSingleAlert(translate("No internet connection"));
    return;
  }

  yield put(loadingActions.enableLoader());

  try {
    // let params = {
    //   "searchCriteria[filter_groups][0][filters][0][field]": "name",
    //   "searchCriteria[filter_groups][0][filters][0][value]":
    //     "%" + action.searchText + "%",
    //   "searchCriteria[filter_groups][0][filters][0][condition_type]": "like",

    //   "searchCriteria[filter_groups][2][filters][0][field]": "visibility",
    //   "searchCriteria[filter_groups][2][filters][0][value]": 4,
    //   "searchCriteria[filter_groups][2][filters][0][condition_type]": "eq",

    //   "searchCriteria[filter_groups][0][filters][1][field]": "description",
    //   "searchCriteria[filter_groups][0][filters][1][value]":
    //     "%" + action.searchText + "%",
    //   "searchCriteria[filter_groups][0][filters][1][condition_type]": "like",

    //   "searchCriteria[filter_groups][0][filters][2][field]": "sku",
    //   "searchCriteria[filter_groups][0][filters][2][value]":
    //     "%" + action.searchText + "%",
    //   "searchCriteria[filter_groups][0][filters][2][condition_type]": "like",

    //   "searchCriteria[filter_groups][0][filters][3][field]": "barcode",
    //   "searchCriteria[filter_groups][0][filters][3][value]":
    //     "%" + action.searchText + "%",
    //   "searchCriteria[filter_groups][0][filters][3][condition_type]": "like",

    //   // "searchCriteria[filter_groups][4][filters][0][condition_type]": "eq",
    //   // "searchCriteria[filter_groups][4][filters][0][field]":
    //   //   "quantity_and_stock_status",
    //   // "searchCriteria[filter_groups][4][filters][0][value]": "2",
    // };

    let params = {
      key: action.searchText,
      page: 0,
      page_size: 30,
      sort_field: "name",
      sort_order: "desc",
    };

    console.log("INPUTS ", params);
    const response = yield call(
      getSearchProductsAPI,
      params,
      storeCode,
      adminToken
    );
    console.log("API RESPONSE OF SEARCH PRODUCTS ", response[0]);
    yield put(loadingActions.disableLoader({}));

    if (response && response.length > 0 && response[0].products) {
      yield put(searchActions.updateProductSearchList(response[0].products));
    } else {
      yield put(searchActions.updateProductSearchList([]));
    }
  } catch (error) {
    console.log("API ERROR!!!!", error);
    yield put(loadingActions.disableLoader({}));
  }
}

export function* getTopSearches(action) {
  const { isNetworkAvailable, adminToken, storeCode } = yield select(
    (state) => state.appReducer
  );
  if (!isNetworkAvailable) {
    showSingleAlert(translate("No internet connection"));
    return;
  }

  yield put(loadingActions.enableLoader());

  try {
    const response = yield call(getTopSearchesAPI, storeCode, adminToken);
    console.log("API RESPONSE OF TOP SEARCH ", response);
    yield put(loadingActions.disableLoader({}));

    if (response && response.length >= 0 && action.callback) {
      action.callback(response);
    }
  } catch (error) {
    console.log("API ERROR!!!!", error);
    yield put(loadingActions.disableLoader({}));
  }
}

export function* getProductsBySearchResultTextSaga(action) {
  const { isNetworkAvailable, adminToken, storeCode } = yield select(
    (state) => state.appReducer
  );
  if (!isNetworkAvailable) {
    showSingleAlert(translate("No internet connection"));
    return;
  }

  yield put(loadingActions.enableProductListLoader());

  try {
    // let params = {
    //   "searchCriteria[filter_groups][0][filters][0][field]": "name",
    //   "searchCriteria[filter_groups][0][filters][0][value]":
    //     "%" + action.searchText + "%",
    //   "searchCriteria[filter_groups][0][filters][0][condition_type]": "like",

    //   "searchCriteria[filter_groups][2][filters][0][field]": "visibility",
    //   "searchCriteria[filter_groups][2][filters][0][value]": 4,
    //   "searchCriteria[filter_groups][2][filters][0][condition_type]": "eq",

    //   "searchCriteria[filter_groups][0][filters][1][field]": "description",
    //   "searchCriteria[filter_groups][0][filters][1][value]":
    //     "%" + action.searchText + "%",
    //   "searchCriteria[filter_groups][0][filters][1][condition_type]": "like",

    //   "searchCriteria[filter_groups][0][filters][2][field]": "sku",
    //   "searchCriteria[filter_groups][0][filters][2][value]":
    //     "%" + action.searchText + "%",
    //   "searchCriteria[filter_groups][0][filters][2][condition_type]": "like",

    //   "searchCriteria[filter_groups][0][filters][3][field]": "barcode",
    //   "searchCriteria[filter_groups][0][filters][3][value]":
    //     "%" + action.searchText + "%",
    //   "searchCriteria[filter_groups][0][filters][3][condition_type]": "like",

    //   "searchCriteria[filter_groups][3][filters][0][condition_type]": "eq",
    //   "searchCriteria[filter_groups][3][filters][0][field]": "status",
    //   "searchCriteria[filter_groups][3][filters][0][value]": "1",
    // };

    // let params = {
    //   key: action.searchText,
    //   page: 0,
    //   page_size: 20,
    //   sort_field: "name",
    //   sort_order: "desc",
    // };

    // console.log("---------++++++-------", params);

    const response = yield call(
      getSearchProductsAPI,
      action.searchText,
      storeCode,
      adminToken
    );
    console.log("API RESPONSE OF SEARCH RESULT PRODUCTS ", response);
    yield put(loadingActions.disableProductListLoader({}));

    if (response && response.length > 0 && response[0].products) {
      action.callback(response[0]);
    }
  } catch (error) {
    console.log("API ERROR!!!!", error);
    yield put(loadingActions.disableProductListLoader({}));
  }
}

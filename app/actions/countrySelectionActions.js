/**
 * Created by Jebin for iLeaf Solutions Pvt.Ltd
 * on February 28, 2020
 * SearchActions - Actions for search products
 */

import * as types from './types';

export function getStores() {
  return {
    type: types.GET_STORES,
  };
}

export function getStoresView() {
  return {
    type: types.GET_STORES_VIEW,
  };
}

export function getStoresResponse(storesList) {
  return {
    type: types.GET_STORES_RESPONSE,
    storesList,
  };
}

export function getStoresViewResponse(storesViewList) {
  return {
    type: types.GET_STORES_VIEW_RESPONSE,
    storesViewList,
  };
}

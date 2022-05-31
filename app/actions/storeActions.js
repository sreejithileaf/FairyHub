/**
 * Created by Jebin for iLeaf Solutions Pvt.Ltd
 * on February 28, 2020
 * StoreActions - Actions for store related actions
 */

import * as types from "./types";

export function getStores(getStoreInfoCallback) {
  return {
    type: types.GET_STORES,
    getStoreInfoCallback,
  };
}

export function getStoresView() {
  return {
    type: types.GET_STORES_VIEW,
  };
}

export function updateStoreInfo(
  storesList,
  storesViewList,
  storeConfiguration,
  appMediaBaseUrl,
  storeCode
) {
  return {
    type: types.UPDATE_STORES_INFO,
    storesList,
    storesViewList,
    storeConfiguration,
    appMediaBaseUrl,
    storeCode,
  };
}

export function updateFilterDatas(
  productsGenders,
  productsColors,
  productsAgeGroups,
  productsAges,
  productsSizes,
  productsBrands,
  productsDeliveryTypes,
  productsRefundable
) {
  return {
    type: types.UPDATE_FILTER_DATAS,
    productsGenders,
    productsColors,
    productsAgeGroups,
    productsAges,
    productsSizes,
    productsBrands,
    productsDeliveryTypes,
    productsRefundable,
  };
}

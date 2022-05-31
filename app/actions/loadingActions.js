/**
 * Created by Jebin Benny
 * on August 07, 2019
 * Loading - Actions for loading status
 */

import * as types from './types';

export function enableLoader() {
  return {
    type: types.ENABLE_LOADER,
  };
}

export function disableLoader() {
  return {
    type: types.DISABLE_LOADER,
  };
}

export function enableHomeScreenLoader() {
  return {
    type: types.ENABLE_SCREEN_LOADER,
  };
}

export function disableHomeScreenLoader() {
  return {
    type: types.DISABLE_SCREEN_LOADER,
  };
}


export function enableProductListLoader() {
  return {
    type: types.PRODUCT_LIST_ENABLE_LOADER,
  }
}

export function disableProductListLoader() {
  return {
    type: types.PRODUCT_LIST_DISABLE_LOADER,
  }
}
/**
 * Created by Jebin for iLeaf Solutions Pvt.Ltd
 * on February 18, 2020
 * Search History Reducer - handles search history state
 */

import createReducer from "../lib/createReducer";
import * as types from "../actions/types";

const initialState = {
  searchHistoryarray: [],
  recentlyViewedProducts: [],
};

export const searchHistoryReducer = createReducer(initialState, {
  [types.UPDATE_SEARCH_HISTORY](state, actions) {
    return {
      ...state,
      searchHistoryarray: actions.newList,
    };
  },
  [types.USER_LOG_OUT](state, action) {
    return {
      ...state,
      searchHistoryarray: [],
    };
  },
  [types.ADD_RECENTLY_VIEWED](state, actions) {
    let productDetails = actions.productDict;
    let recentProductDict = {
      deliverytype:
        productDetails.specifications &&
        productDetails.specifications.deliverytype,
      entity_id: productDetails.entity_id && productDetails.entity_id,
      image: productDetails.image && productDetails.image.main,
      finalPrice: productDetails.finalPrice && productDetails.finalPrice,
      is_in_stock: productDetails.is_in_stock && productDetails.is_in_stock,
      is_variants: productDetails.is_variants && productDetails.is_variants,
      name: productDetails.name && productDetails.name,
      sku: productDetails.sku && productDetails.sku,
      regularPrice: productDetails.regularPrice && productDetails.regularPrice,
    };

    let tempArray = state.recentlyViewedProducts;
    let index = tempArray.findIndex((el) => el.sku == recentProductDict.sku);

    if (index >= 0) {
      tempArray.splice(index, 1);
      tempArray.splice(0, 0, recentProductDict);
    } else if (tempArray.length === 11) {
      tempArray.splice(10, 1);
      tempArray.splice(0, 0, recentProductDict);
    } else {
      tempArray.splice(0, 0, recentProductDict);
    }

    return {
      ...state,
      recentlyViewedProducts: tempArray,
    };
  },
});

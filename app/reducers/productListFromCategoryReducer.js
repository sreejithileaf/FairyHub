// productListFromCategoryReducer

/**
 * Created by Jebin for iLeaf Solutions Pvt.Ltd
 * on February 28, 2020
 * Products List Reducer - Store the list of products in the app
 */

import createReducer from "../lib/createReducer";
import * as types from "../actions/types";

const initialState = {
  productsList: [],
  productsListOnCategory1: [],
};

export const productListFromCategoryReducer = createReducer(initialState, {
  [types.UPDATE_PRODUCTS_LIST](state, actions) {
    return {
      ...state,
      productsList: actions.productsList,
    };
  },
  [types.CLEAR_CATEGORY_PRODUCTS_LIST_FROM_CATEGORY](state, actions) {
    return {
      ...state,
      productsListOnCategory1: [],
    };
  },
  [types.UPDATE_CATEGORY_PRODUCTS_LIST_FROM_CATEGORY](state, actions) {
    switch (actions.categoryType) {
      case "categoryType1":
        return {
          ...state,
          productsListOnCategory1: actions.categoryProductList,
        };
    }

    return {
      ...state,
    };
  },
});

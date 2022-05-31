/**
 * Created by Jebin for iLeaf Solutions Pvt.Ltd
 * on March 11, 2020
 * Cart Reducer - handles cart states
 */

import * as types from "../actions/types";
import createReducer from "../lib/createReducer";

const initialState = {
  cartArray: [],
  guestCartArray: [],
  availableBalloons: [],
  availableGiftwraps: [],
  availableBalloonsUpdatedTime: "",
  availableGiftWrapUpdatedTime: "",
  cartAddOnsArray: [],
  cartTotals: {},
  deliveryNote: "",
};

export const cartReducer = createReducer(initialState, {
  [types.GET_PRODUCTS_IN_CART](state, action) {
    return {
      ...state,
    };
  },
  [types.CART_PRODUCT_LIST](state, action) {
    return {
      ...state,
      cartArray: action.response,
      message: "success",
    };
  },
  [types.UPDATE_CART_PRODUCT_LIST](state, action) {
    return {
      ...state,
      cartArray: action.cartArray,
      cartAddOnsArray: action.cartAddOns,
      message: "success",
    };
  },
  [types.UPDATE_GUEST_CART_PRODUCT_LIST](state, action) {
    return {
      ...state,
      guestCartArray: action.cartArray,
      message: "success",
      cartAddOnsArray: action.cartAddOns,
    };
  },
  [types.GET_PRODUCTS_IN_CART_FAILED](state, action) {
    return {
      ...state,
      message: "failure",
    };
  },
  [types.UPDATE_CART_LIST](state, action) {
    return {
      ...state,
      guestCartArray: action.cartArray,
      message: "failure",
    };
  },
  [types.USER_LOG_OUT](state, action) {
    return {
      ...state,
      cartArray: [],
      guestCartArray: [],
      availableBalloons: [],
      availableGiftwraps: [],
      cartAddOnsArray: [],
      cartTotals: {},
      deliveryNote: "",
    };
  },
  [types.GUEST_CART_CLEAR](state, action) {
    return {
      ...state,
      guestCartArray: [],
      availableBalloons: [],
      availableGiftwraps: [],
      cartAddOnsArray: [],
      cartTotals: {},
    };
  },
  [types.APP_STORE_CODE_CHANGE](state) {
    return {
      ...state,
      guestCartArray: [],
      cartArray: [],
      availableBalloons: [],
      availableGiftwraps: [],
      cartAddOnsArray: [],
      cartTotals: {},
      deliveryNote: "",
    };
  },
  [types.UPDATE_AVAILABLE_BALLOONS](state, action) {
    return {
      ...state,
      availableBalloons: action.availableBalloons,
    };
  },
  [types.UPDATE_AVAILABLE_GIFT_WRAP](state, action) {
    return {
      ...state,
      availableGiftwraps: action.availableGiftwraps,
    };
  },
  [types.UPDATE_CART_TOTALS](state, action) {
    return {
      ...state,
      cartTotals: action.cartTotals,
    };
  },
  [types.UPDATE_DELIVERY_NOTE](state, action) {
    return {
      ...state,
      deliveryNote: action.deliveryNote,
    };
  },
});

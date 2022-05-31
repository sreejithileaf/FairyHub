/**
 * Created by Jebin for iLeaf Solutions Pvt.Ltd
 * on February 12, 2020
 * Login Reducer - handles login states in the app
 */

import createReducer from "../lib/createReducer";
import * as types from "../actions/types";

const initialState = {
  userInfo: null,
  wishList: [],
  cartID: "",
  userName: "",
  password: "",
  guestInfo: null,
  forgotPassword: false,
  guestAddressList: [],
  emailReminders: [],
};

export const loginReducer = createReducer(initialState, {
  [types.USER_LOGOUT](state) {
    return {
      ...state,
      userInfo: null,
    };
  },
  [types.REGISTER_RESPONSE](state, action) {
    return {
      ...state,
      userInfo: action.response,
    };
  },
  [types.APP_UPDATE_USER_INFO](state, action) {
    return {
      ...state,
      guestInfo: null,
      userInfo: action.userInfo,
      userName: action.userName,
      password: action.password,
      guestAddressList: [],
    };
  },
  [types.REGISTER_FAILED](state) {
    return {
      ...state,
      userInfo: null,
    };
  },
  [types.UPADTE_CART_ID](state, action) {
    return {
      ...state,
      cartID: action.id,
    };
  },
  [types.PROFILE_UPDATE_RESPONSE](state, action) {
    return {
      ...state,
      userInfo: action.response,
    };
  },
  [types.FORGOT_PASSWORD_RESPONSE](state, action) {
    return {
      ...state,
      forgotPassword: action.response,
    };
  },
  [types.PASSWORD_UPDATE_RESPONSE](state, action) {
    return {
      ...state,
      userInfo: action.response,
    };
  },
  [types.USER_WISHLIST_RESPONSE](state, action) {
    return {
      ...state,
      wishList: action.wishListResponse,
    };
  },
  [types.USER_LOG_OUT](state, action) {
    return {
      ...state,
      userInfo: null,
      guestInfo: null,
      wishList: [],
      cartID: "",
      userName: "",
      password: "",
      guestAddressList: [],
      emailReminders: [],
    };
  },
  [types.UPDATE_GUEST_INFO](state, action) {
    return {
      ...state,
      guestInfo: action.guestInfo,
    };
  },

  [types.GUEST_ADD_ADDRESS_REQUEST](state, action) {
    return {
      ...state,
      guestAddressList: action.params,
    };
  },

  [types.GUEST_EDIT_ADDRESS_REQUEST](state, action) {
    return {
      ...state,
      guestAddressList: action.params,
    };
  },
  [types.UPDATE_EMAIL_REMINDER_ARRAY](state, action) {
    return {
      ...state,
      emailReminders: action.emailReminders,
    };
  },
});

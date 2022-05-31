/**
 * Created by Jebin for iLeaf Solutions Pvt.Ltd
 * on February 12, 2020
 * App Reducer - handles app common states
 *
 */

import createReducer from "../lib/createReducer";
import * as types from "../actions/types";
const { width, height } = Dimensions.get("window");
import { Dimensions } from "react-native";
import constants from "../config/constants";

// adminToken UAT: 75bpvontn560cgkdjhk816e5gyvooopz
// adminToken prelive: 4i4uqguo3gydvqi9javxgq1i3qvlart4

const initialState = {
  userToken: "",
  enableBiometricAuth: false,
  adminToken: constants.ADMIN_TOKEN, // "4i4uqguo3gydvqi9javxgq1i3qvlart4", //"4i4uqguo3gydvqi9javxgq1i3qvlart4", //"pd8nfw9abutc423t2u5qsx1d5qlopa3h",
  guestToken: "",
  quoteId: "",
  isNetworkAvailable: false,
  isHandset: true,
  selectedLanguage: "en",
  screenWidth: width,
  screenHeight: height,
  orientation: "PORTRAIT",
  stores: [],
  storesView: [],
  storeCode: "default",
  currency: "KWD",
  appLogo: "",
  storeConfiguration: [],
  isSocialMediaLogin: false,
  appMediaBaseUrl: "",
  isLocalizationSet: false,
  homeBannerArray: [],

  productsGenders: [],
  productsColors: [],
  productsAgeGroups: [],
  productsAges: [],
  productsSizes: [],
  productsBrands: [],
  productsDeliveryTypes: [],
  productsRefundable: [],
};

export const appReducer = createReducer(initialState, {
  [types.APP_NETWORK_STATUS](state, action) {
    return {
      ...state,
      isNetworkAvailable: action.networkStatus,
    };
  },
  [types.UPDATE_DEVICE_TYPE](state, action) {
    return {
      ...state,
      isHandset: action.deviceType === "Handset" ? true : false,
    };
  },
  [types.UPDATE_SOCIAL_MEDIA_LOGIN_STATUS](state, action) {
    return {
      ...state,
      isSocialMediaLogin: action.status,
    };
  },
  [types.UPDATE_BIOMETRIC_AUTH](state, action) {
    return {
      ...state,
      enableBiometricAuth: action.status,
    };
  },
  [types.APP_LANGUAGE_CHANGE](state, action) {
    // let storeCode = "";
    // if (action.language == "en") {
    //   storeCode = state.storeConfiguration[0].code;
    // } else {
    //   storeCode = state.storeConfiguration[1].code;
    // }

    return {
      ...state,
      selectedLanguage: action.language,
      // storeCode: storeCode,
    };
  },
  [types.ORIENTATION_CHANGE](state, action) {
    return {
      ...state,
      screenWidth: action.screenWidth,
      screenHeight: action.screenHeight,
      orientation: action.orientation,
    };
  },
  [types.LOGIN_RESPONSE](state, action) {
    return {
      ...state,
      userToken: action.response,
    };
  },
  [types.LOGIN_FAILED](state) {
    return {
      ...state,
      userToken: "",
    };
  },
  [types.USER_LOGOUT](state) {
    return {
      ...state,
      userToken: "",
      USER_LOG_OUT: false,
    };
  },
  [types.UPDATE_GUEST_TOKEN](state, action) {
    return {
      ...state,
      guestToken: action.guestToken,
      quoteId: action.quoteId,
      userToken: "",
    };
  },
  [types.GET_STORES_RESPONSE](state, action) {
    return {
      ...state,
      stores: action.storesList,
    };
  },
  [types.UPDATE_STORES_INFO](state, action) {
    return {
      ...state,
      stores: action.storesList,
      storesView: action.storesViewList,
      storeConfiguration: action.storeConfiguration,
      appMediaBaseUrl: action.appMediaBaseUrl,
      storeCode: action.storeCode,
    };
  },
  [types.UPDATE_FILTER_DATAS](state, action) {
    return {
      ...state,
      productsGenders: action.productsGenders,
      productsColors: action.productsColors,
      productsAgeGroups: action.productsAgeGroups,
      productsAges: action.productsAges,
      productsSizes: action.productsSizes,
      productsBrands: action.productsBrands,
      productsDeliveryTypes: action.productsDeliveryTypes,
      productsRefundable: action.productsRefundable,
    };
  },
  [types.APP_STORE_CODE_CHANGE](state, action) {
    return {
      ...state,
      storeCode: action.code,
      guestToken: "",
      quoteId: "",
    };
  },
  [types.APP_UPDATE_CURRENCY](state, action) {
    return {
      ...state,
      currency: action.currency,
    };
  },
  [types.USER_LOG_OUT](state, action) {
    return {
      ...state,
      userToken: "",
      guestToken: "",
      quoteId: "",
      isSocialMediaLogin: false,
    };
  },
  [types.CLEAR_QUOTE_ID](state, action) {
    return {
      ...state,
      guestToken: "",
      quoteId: "",
    };
  },
  [types.UPDATE_HOME_BANNERS](state, action) {
    return {
      ...state,
      homeBannerArray: action.bannerArray,
    };
  },
  [types.UPDATE_APP_LOGO](state, action) {
    return {
      ...state,
      appLogo: action.appLogo,
    };
  },
  [types.UPDATE_APP_LOCALIZATION_STATUS](state, action) {
    return {
      ...state,
      isLocalizationSet: action.status,
    };
  },
});

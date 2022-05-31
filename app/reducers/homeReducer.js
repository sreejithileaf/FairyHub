import * as types from "../actions/types";
import createReducer from "../lib/createReducer";

const initialState = {
  banner_array: [],
  topCategory_array: [],
  topSales_array: [],
  bestSellers_array: [],
  newProducts_array: [],
  message: "",
  appLogoUrl: "",
  add_array: [],
  appSplashUrl: "",
  appSplashLogoUrl: "",
  loaderLogoUrl: "",
  loaderMainLogoUrl: "",
  homeAdsUpdateTime: "",
  appSplashVideoUrl: ""
};

export const homeReducer = createReducer(initialState, {
  [types.GET_HOME_REQUEST](state, action) {
    return {
      ...state,
      // banner_array: [],
      // topCategory_array: [],
      // topSales_array: [],
      // bestSellers_array: [],
      // newProducts_array: [],
      message: "requesting",
    };
  },
  [types.GET_HOME_RESPONSE](state, action) {
    const homeArray = action.response;
    return {
      ...state,
      appLogoUrl: homeArray[0].logos.mobile || "",
      appSplashUrl: homeArray[0].logos.splash || "",
      appSplashLogoUrl: homeArray[0].logos.splash_logo || "",
      appSplashVideoUrl: homeArray[0].logos.splash_video || "",
      loaderLogoUrl: homeArray[0].logos.loader_logo || "",
      loaderMainLogoUrl: homeArray[0].logos.main_loader_logo || "",
      banner_array: homeArray[1].banners,
      topCategory_array: homeArray[3].top_categories,
      promotionCategory_array: homeArray[4].promotion_categories,
      message: "success",
    };
  },
  [types.GET_HOME_ADD_RESPONSE](state, action) {
    const homeAddArray = action.response;
    return {
      ...state,
      add_array: homeAddArray,
      message: "success",
      homeAdsUpdateTime: action.updateTime,
    };
  },
  [types.GET_HOME_FAILED](state, action) {
    return {
      ...state,
      banner_array: [],
      topCategory_array: [],
      topSales_array: [],
      bestSellers_array: [],
      newProducts_array: [],
      message: "failure",
    };
  },
});

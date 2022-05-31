/**
 * Created by ARUN for iLeaf Solutions Pvt.Ltd
 * on MARCH 3, 2020
 * CategorySaga - handles search history state
 */

import { showSingleAlert } from "../config/common";
import { getCartProducts } from "../api/apiMethods";
import * as homeAction from "../actions/homeAction";
import * as cartActions from "../actions/cartActions";
import * as appActions from "../actions/appActions";
import { put, call, select } from "redux-saga/effects";
import {
  getHomePageDetails,
  getHomePageAdds,
  getPromotionCategories,
  getPromotionProducts,
  getStatusDataAPI,
} from "../api/apiMethods";
import { translate } from "../config/languageSwitching";
import RNFetchBlob from "rn-fetch-blob";
import * as loadingActions from "../actions/loadingActions";
import Constants from "../config/constants";
import moment from "moment";

// Our worker Saga that logins the user
export function* getHomeDetails(action) {
  console.log("ACTION IN HOME RESPONSE", action);
  const {
    isNetworkAvailable,
    adminToken,
    storeCode,
    userToken,
    appMediaBaseUrl,
  } = yield select((state) => state.appReducer);
  const {
    appSplashUrl,
    appLogoUrl,
    appSplashLogoUrl,
    loaderLogoUrl,
    loaderMainLogoUrl,
    appSplashVideoUrl
  } = yield select((state) => state.homeReducer);
  if (!isNetworkAvailable) {
    showSingleAlert(translate("No internet connection"));
    return;
  }
  yield put(loadingActions.enableHomeScreenLoader());
  try {
    const response = yield call(getHomePageDetails, storeCode, adminToken);
    console.log("rrrrr", response);

    if (response && response.length > 0) {
      let logo = response[0].logos;

      let splashImage = logo.splash;
      let appLogo = logo.mobile;
      let splashLogo = logo.splash_logo;
      let loaderLogo = logo.loader_logo;
      let loaderMainLogo = logo.main_loader_logo;
      let splashVideo = logo.splash_video;

      if (splashVideo && appSplashVideoUrl !== splashVideo) {
        console.log("------------------------------new splash video");
        let dirs = RNFetchBlob.fs.dirs;
        let ext = splashVideo.split('.').pop();
        RNFetchBlob.config({
          path: dirs.DocumentDir + "/splashVideo." + ext,
        })
          .fetch("GET", appMediaBaseUrl + splashVideo, {})
          .then((res) => {
            // the path should be dirs.DocumentDir + 'path-to-file.anything'
            console.log(
              "splash video saved to---------------------------------------------- ",
              res.path()
            );
          });
      }

      if (appSplashUrl !== splashImage) {
        console.log("---------------------------------new splash");
        let dirs = RNFetchBlob.fs.dirs;
        RNFetchBlob.config({
          path: dirs.DocumentDir + "/splashImage.png",
        })
          .fetch("GET", appMediaBaseUrl + splashImage, {})
          .then((res) => {
            // the path should be dirs.DocumentDir + 'path-to-file.anything'
            console.log(
              "splash image saved to---------------------------------------------------- ",
              res.path()
            );
          });
      }

      if (loaderLogo && loaderLogoUrl !== loaderLogo) {
        console.log("---------------------------------new loader logo");
        let dirs = RNFetchBlob.fs.dirs;
        RNFetchBlob.config({
          path: dirs.DocumentDir + "/loaderImage.png",
        })
          .fetch("GET", appMediaBaseUrl + loaderLogo, {})
          .then((res) => {
            // the path should be dirs.DocumentDir + 'path-to-file.anything'
            console.log(
              "loader image saved to---------------------------------------------------- ",
              res.path()
            );
          });
      }

      if (loaderMainLogo && loaderMainLogoUrl !== loaderMainLogo) {
        var filename = loaderMainLogo.replace(/^.*[\\\/]/, "");

        console.log("---------------------------------new loader logo");
        let dirs = RNFetchBlob.fs.dirs;
        RNFetchBlob.config({
          path: dirs.DocumentDir + "/" + filename,
        })
          .fetch("GET", appMediaBaseUrl + loaderMainLogo, {})
          .then((res) => {
            console.log(
              "loader Main image saved to---------------------------------------------------- ",
              res.path()
            );
          });
      }

      if (appSplashLogoUrl !== splashLogo) {
        console.log("---------------------------------new splash Logo");
        let dirs = RNFetchBlob.fs.dirs;
        RNFetchBlob.config({
          path: dirs.DocumentDir + "/splashLogo.png",
        })
          .fetch("GET", appMediaBaseUrl + splashLogo, {})
          .then((res) => {
            // the path should be dirs.DocumentDir + 'path-to-file.anything'
            console.log(
              "splash Logo saved to---------------------------------------------------- ",
              res.path()
            );
          });
      }

      if (appLogoUrl !== appLogo) {
        console.log("---------------------------------new LOGO....");
        let dirs = RNFetchBlob.fs.dirs;
        RNFetchBlob.config({
          path: dirs.DocumentDir + "/appLogo.png",
        })
          .fetch("GET", appMediaBaseUrl + appLogo, {})
          .then((res) => {
            // the path should be dirs.DocumentDir + 'path-to-file.anything'
            console.log(
              "App Logo image saved to---------------------------------------------------- ",
              res.path()
            );
          });

        let path = "";
        if (Constants.IS_ANDROID) {
          path = "file:///" + dirs.DocumentDir + "/appLogo.png";
        } else {
          path = dirs.DocumentDir + "/appLogo.png";
        }
        yield put(appActions.updateAppLogo(path));
      }

      if (action.callback) {
        action.callback(response);
      }
    }

    console.log("HOME RESPONSE===========>>>>>", response);
    if (userToken !== "" && response.length > 0) {
      const cartresponse = yield call(getCartProducts, userToken); //userToken
      console.log("HOME RESPONSE", response);
      console.log("response from cart list", cartresponse);
      yield put(loadingActions.disableHomeScreenLoader({}));
      if (cartresponse.length >= 0) {
        yield put(cartActions.updateCartProducts(cartresponse));
        yield put(homeAction.homeResponse(response));
      }
    } else {
      yield put(homeAction.homeResponse(response));
      yield put(loadingActions.disableHomeScreenLoader({}));
    }
  } catch (error) {
    console.log("API ERROR!!!!", error);
    yield put(loadingActions.disableHomeScreenLoader({}));
  }
}

export function* getHomeadds(action) {
  const { isNetworkAvailable, adminToken, storeCode, userToken } = yield select(
    (state) => state.appReducer
  );
  const { add_array, homeAdsUpdateTime } = yield select(
    (state) => state.homeReducer
  );
  if (!isNetworkAvailable) {
    showSingleAlert(translate("No internet connection"));
    return;
  }
  try {
    const response = yield call(getHomePageAdds, storeCode, adminToken);
    console.log("Ads RESPONSE===========>>>>>", response);
    let newAdsArray = [];

    if (response.length > 0) {
      if (homeAdsUpdateTime == "") {
        newAdsArray = response;
      } else if (
        moment(homeAdsUpdateTime).format("YYYY-MM-DD") !==
        moment().format("YYYY-MM-DD")
      ) {
        newAdsArray = response;
      } else {
        response.map((item) => {
          let isfound = false;

          if (add_array.length > 0) {
            add_array.map((sub) => {
              if (sub.id === item.id) {
                isfound = true;
              }
            });
          }

          if (!isfound) {
            newAdsArray.push(item);
          }
        });
      }
    }

    // newAdsArray = response;

    action.callback(newAdsArray);

    console.log("NEW ADS ARRAY===", newAdsArray);

    yield put(
      homeAction.homeAddResponse(moment().format("YYYY-MM-DD"), response)
    );
  } catch (error) {
    console.log("API ERROR!!!!", error);
  }
}

export function* getPromotionCategoriesSaga(action) {
  const { isNetworkAvailable, adminToken, storeCode, userToken } = yield select(
    (state) => state.appReducer
  );
  if (!isNetworkAvailable) {
    showSingleAlert(translate("No internet connection"));
    return;
  }
  // yield put(loadingActions.enableHomeScreenLoader());
  try {
    const response = yield call(
      getPromotionCategories,
      action.params,
      storeCode,
      adminToken
    );
    console.log("PROMOTION CATEGORIES RESPONSE===========>>>>>", response);

    if (response && response.length >= 0) {
      if (action.callback) {
        action.callback(response);
      }
    }

    // yield put(loadingActions.disableHomeScreenLoader({}));
  } catch (error) {
    console.log("API ERROR!!!!", error);
    // yield put(loadingActions.disableHomeScreenLoader({}));
  }
}

export function* getPromotionProductsSaga(action) {
  const { isNetworkAvailable, adminToken, storeCode, userToken } = yield select(
    (state) => state.appReducer
  );
  if (!isNetworkAvailable) {
    showSingleAlert(translate("No internet connection"));
    return;
  }
  // yield put(loadingActions.enableHomeScreenLoader());
  try {
    const response = yield call(
      getPromotionProducts,
      action.params,
      storeCode,
      adminToken
    );
    console.log("PROMOTION PRODUCTS------- RESPONSE===========>>>>>", response);

    if (response && response.length >= 0) {
      if (action.callback) {
        action.callback(true, response);
      }
    }

    // yield put(loadingActions.disableHomeScreenLoader({}));
  } catch (error) {
    console.log("API ERROR!!!!", error);
    // yield put(loadingActions.disableHomeScreenLoader({}));
    if (action.callback) {
      action.callback(false, []);
    }
  }
}

export function* getStatusDataSaga(action) {
  const { isNetworkAvailable, adminToken, storeCode, userToken } = yield select(
    (state) => state.appReducer
  );
  if (!isNetworkAvailable) {
    showSingleAlert(translate("No internet connection"));
    return;
  }
  yield put(loadingActions.enableHomeScreenLoader());
  try {
    const response = yield call(
      getStatusDataAPI,
      action.params,
      storeCode,
      adminToken
    );
    console.log("STATUS DATAS RESPONSE===========>>>>>", response);

    if (response && response.length >= 0) {
      if (action.callback) {
        action.callback(response);
      }
    }

    yield put(loadingActions.disableHomeScreenLoader({}));
  } catch (error) {
    console.log("API ERROR!!!!", error);
    yield put(loadingActions.disableHomeScreenLoader({}));
    if (action.callback) {
      action.callback(false, []);
    }
  }
}

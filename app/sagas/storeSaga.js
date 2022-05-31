/**
 * Created by Jebin for iLeaf Solutions Pvt.Ltd
 * on February 28, 2020
 * StoreSaga - handles store related operations
 */

import {
  getStoresAPI,
  getStoresViewAPI,
  getAllCategoriesAPI,
  getStoreConfigurationAPI,
  getAllAttributesAPI,
} from "../api/apiMethods";
import { showSingleAlert } from "../config/common";
import * as storeActions from "../actions/storeActions";
import { translate } from "../config/languageSwitching";
import { put, call, select, all } from "redux-saga/effects";
import * as loadingActions from "../actions/loadingActions";
import * as categoryActions from "../actions/categoryActions";

export function* getStoresSaga(action) {
  const { isNetworkAvailable, selectedLanguage } = yield select(
    (state) => state.appReducer
  );
  const { adminToken } = yield select((state) => state.appReducer);
  if (!isNetworkAvailable) {
    showSingleAlert(translate("No internet connection"));
    return;
  }

  yield put(loadingActions.enableLoader());

  try {
    const {
      // stores,
      // storesView,
      storeConfiguration,
      // categories,
      getAllAttributes,
    } = yield all({
      // stores: call(getStoresAPI, adminToken),
      // storesView: call(getStoresViewAPI, adminToken),
      storeConfiguration: call(getStoreConfigurationAPI, adminToken),
      // categories: call(getAllCategoriesAPI, adminToken),
      getAllAttributes: call(getAllAttributesAPI, adminToken),
    });
    // console.log("API RESPONSE OF GET_STORES ", stores);
    // console.log("API RESPONSE OF GET_STORES_VIEW ", storesView);
    console.log("API RESPONSE OF STORE CONFIGURATIONS", storeConfiguration);
    // console.log("API RESPONSE OF ALL CATEGORIES ", categories);
    console.log("API RESPONSE OF PRODUCTS getAllAttributes", getAllAttributes);

    const stores = [
      {
        id: 0,
        website_id: 0,
        root_category_id: 0,
        default_store_id: 0,
        name: "Default",
        code: "default",
      },
      {
        id: 1,
        website_id: 1,
        root_category_id: 2,
        default_store_id: 1,
        name: "Main Website Store",
        code: "main_website_store",
      },
    ];

    const storesView = [
      {
        id: 1,
        code: "default",
        name: "English",
        website_id: 1,
        store_group_id: 1,
        is_active: 1,
      },
      {
        id: 0,
        code: "admin",
        name: "Admin",
        website_id: 0,
        store_group_id: 0,
        is_active: 1,
      },
      {
        id: 2,
        code: "arabic",
        name: "Arabic",
        website_id: 1,
        store_group_id: 1,
        is_active: 1,
      },
    ];

    let productsGenders = getAllAttributes[0].options;
    let productsColors = getAllAttributes[1].options;
    let productsAgeGroups = getAllAttributes[2].options;
    let productsAges = getAllAttributes[3].options;
    let productsSizes = getAllAttributes[4].options;
    let productsBrands = getAllAttributes[5].options;
    let productsDeliveryTypes = getAllAttributes[6].options;
    let productsRefundable = getAllAttributes[7].options;

    let appMediaBaseUrl = "";
    let storeCode = "";
    if (storeConfiguration && storeConfiguration.length > 1) {
      let storeDict;
      //   selectedLanguage === "ar"
      //     ? storeConfiguration[1]
      //     : storeConfiguration[0];

      // appMediaBaseUrl = storeDict.secure_base_media_url;
      // storeCode = storeDict.code;

      console.log("--------------#########----------", storeConfiguration);

      storeConfiguration.map((storeItem) => {
        if (storeItem.locale === "en_US" && selectedLanguage === "en") {
          storeDict = storeItem;
        } else if (storeItem.locale === "ar_SA" && selectedLanguage === "ar") {
          storeDict = storeItem;
        }
      });

      appMediaBaseUrl = storeDict.secure_base_media_url;
      storeCode = storeDict.code;

      console.log("^^^^^^^^^^^^^^^^^^^^", storeDict);
    }

    const { categories } = yield all({
      categories: call(getAllCategoriesAPI, adminToken, storeCode),
    });
    console.log("API RESPONSE OF ALL CATEGORIES--------- ", categories);

    yield put(loadingActions.disableLoader({}));

    if (
      stores &&
      storesView &&
      categories &&
      storeConfiguration &&
      productsGenders &&
      productsColors &&
      productsAgeGroups &&
      productsAges &&
      productsSizes &&
      productsBrands &&
      productsDeliveryTypes &&
      productsRefundable
    ) {
      yield put(
        storeActions.updateStoreInfo(
          stores,
          storesView,
          storeConfiguration,
          appMediaBaseUrl,
          storeCode
        )
      );
      yield put(categoryActions.onCategoryResponse(categories));
      yield put(
        storeActions.updateFilterDatas(
          productsGenders,
          productsColors,
          productsAgeGroups,
          productsAges,
          productsSizes,
          productsBrands,
          productsDeliveryTypes,
          productsRefundable
        )
      );

      if (action.getStoreInfoCallback) {
        action.getStoreInfoCallback(true);
      }
    } else {
      if (action.getStoreInfoCallback) {
        action.getStoreInfoCallback(false);
      }
    }
  } catch (error) {
    if (action.getStoreInfoCallback) {
      action.getStoreInfoCallback(false);
    }
    console.log("GET_STORES API ERROR!!!!", error);
    yield put(loadingActions.disableLoader({}));
  }
}

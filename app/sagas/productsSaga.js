/**
 * Created by Jebin for iLeaf Solutions Pvt.Ltd
 * on March 02, 2020
 * ProductsSaga - handles listing products
 */

import {
  getProductDetailAPI,
  getSearchProductsAPI,
  get360DegreeImagesAPI,
  getCategoryProductsAPI,
  getRelatedProductDetailAPI,
  getProductDetailUrlKeyAPI,
  addUserReviews,
  getUserReviews,
  notifyMeAPI,
  getBoughtTogetherProductsAPI,
} from "../api/apiMethods";
import { showSingleAlert } from "../config/common";
import { put, call, select } from "redux-saga/effects";
import { translate } from "../config/languageSwitching";
import * as searchActions from "../actions/searchActions";
import * as loadingActions from "../actions/loadingActions";
import * as productsActions from "../actions/productsActions";

export function* getProductsListSaga(action) {
  const { isNetworkAvailable, adminToken, storeCode } = yield select(
    (state) => state.appReducer
  );

  if (!isNetworkAvailable) {
    showSingleAlert(translate("No internet connection"));
    return;
  }

  yield put(loadingActions.enableLoader());

  try {
    let params = {
      "searchCriteria[current_page]": action.pageIndex,
      "searchCriteria[page_size]": action.pageCount,
    };
    const response = yield call(
      getSearchProductsAPI,
      params,
      storeCode,
      adminToken
    );
    console.log("API RESPONSE OF GET PRODUCTS ", response);
    yield put(loadingActions.disableLoader({}));

    if (response && response.items && response.items) {
      const { productsList } = yield select(
        (state) => state.productsListReducer
      );
      yield put(
        searchActions.updateProductSearchList([
          ...productsList,
          ...response.items,
        ])
      );
      if (action.getProductListCallback) {
        action.getProductListCallback(true);
      }
    } else {
      if (action.getProductListCallback) {
        action.getProductListCallback(false);
      }
    }

    // if (response.success) {
    //   yield put(loginActions.onLoginResponse(response.data));
    //   setTimeout(() => {
    //     Snackbar.show({
    //       title: 'You Have Successfully Logged In',
    //       duration: Snackbar.LENGTH_SHORT,
    //     });
    //   }, 200);
    //   yield call(navigationActions.navigateToHomeScreen);
    //   yield put(loginActions.disableLoader({}));
    // } else {
    //   yield put(loginActions.loginFailed());
    //   yield put(loginActions.disableLoader({}));
    //   setTimeout(() => {
    //     Snackbar.show({
    //       title: response.Message,
    //       duration: Snackbar.LENGTH_SHORT,
    //     });
    //   }, 200);
    // }
  } catch (error) {
    console.log("API ERROR!!!!", error);
    yield put(loadingActions.disableLoader({}));
  }
}

export function* getProductDetailSaga(action) {
  const { isNetworkAvailable, adminToken, storeCode } = yield select(
    (state) => state.appReducer
  );
  if (!isNetworkAvailable) {
    showSingleAlert(translate("No internet connection"));
    return;
  }

  yield put(loadingActions.enableLoader());

  try {
    const response = yield call(
      getProductDetailAPI,
      action.productId,
      storeCode,
      adminToken
    );
    console.log("API RESPONSE OF PRODUCTS DETAIL", response);
    yield put(loadingActions.disableLoader({}));

    if (response && response.length > 0 && response[0].entity_id) {
      if (action.productDetailsCallback) {
        action.productDetailsCallback(response[0]);
      }
    } else {
      if (action.productDetailsCallback) {
        action.productDetailsCallback(null);
      }
    }
  } catch (error) {
    console.log("API ERROR!!!!", error);
    showSingleAlert(translate("API_Failed"));
    yield put(loadingActions.disableLoader({}));
    if (action.productDetailsCallback) {
      action.productDetailsCallback(null);
    }
  }
}

export function* getProductDetailURLKEYSaga(action) {
  const { isNetworkAvailable, adminToken, storeCode } = yield select(
    (state) => state.appReducer
  );
  if (!isNetworkAvailable) {
    showSingleAlert(translate("No internet connection"));
    return;
  }

  yield put(loadingActions.enableLoader());

  try {
    const response = yield call(
      getProductDetailUrlKeyAPI,
      action.urlKey,
      storeCode,
      adminToken
    );
    console.log("API RESPONSE OF PRODUCTS DETAIL WITH URL KEY", response);
    yield put(loadingActions.disableLoader({}));

    if (response && response.length > 0 && response[0].entity_id) {
      if (action.productDetailsCallback) {
        action.productDetailsCallback(response[0]);
      }
    } else {
      if (action.productDetailsCallback) {
        action.productDetailsCallback(null);
      }
    }
  } catch (error) {
    console.log("API ERROR!!!!", error);
    showSingleAlert(translate("API_Failed"));
    yield put(loadingActions.disableLoader({}));
    if (action.productDetailsCallback) {
      action.productDetailsCallback(null);
    }
  }
}

export function* getRealtedProductDetailSaga(action) {
  const { isNetworkAvailable, adminToken, storeCode } = yield select(
    (state) => state.appReducer
  );
  if (!isNetworkAvailable) {
    showSingleAlert(translate("No internet connection"));
    return;
  }

  try {
    const response = yield call(
      getRelatedProductDetailAPI,
      action.productId,
      storeCode,
      adminToken
    );
    console.log("API RESPONSE OF RELATED PRODUCTS:::", response);

    if (response && response.length > 0) {
      let obj = response[0];
      if (obj.error) {
        if (action.relatedproductDetailsCallback) {
          action.relatedproductDetailsCallback([]);
        }
      } else {
        if (action.relatedproductDetailsCallback) {
          action.relatedproductDetailsCallback(response);
        }
      }
    } else {
      if (action.relatedproductDetailsCallback) {
        action.relatedproductDetailsCallback([]);
      }
    }
  } catch (error) {
    console.log("API ERROR!!!!", error);
    if (action.relatedproductDetailsCallback) {
      action.relatedproductDetailsCallback([]);
    }
  }
}

export function* getCategoryProductsListSaga(action) {
  const { isNetworkAvailable, adminToken, storeCode } = yield select(
    (state) => state.appReducer
  );

  if (!isNetworkAvailable) {
    showSingleAlert(translate("No internet connection"));
    return;
  }

  // yield put(loadingActions.enableLoader());
  yield put(loadingActions.enableProductListLoader());

  try {
    let params = {
      category_id: action.categoryId,
      sort_field: action.filterParams.sort_field,
      sort_orer: action.filterParams.sort_orer,
      page: action.pageIndex,
      page_size: action.pageCount,
      filter_attributes: action.filterParams.filter_attributes || {},
    };

    console.log("params !!!!!!!!", params);

    const response = yield call(
      getCategoryProductsAPI,
      params,
      storeCode,
      adminToken
    );
    if (action.fromHome) {
      console.log(
        "API RESPONSE OF CATEGORY PRODUCTS LIST From HOME ",
        response
      );
    } else {
      console.log(
        "API RESPONSE OF CATEGORY PRODUCTS LIST from CATEGORY ",
        response
      );
    }
    yield put(loadingActions.disableProductListLoader({}));

    if (response && response.length >= 0 && response[0].products) {
      // if (action.fromHome) {
      const { productsListOnCategory1 } = action.fromHome
        ? yield select((state) => state.productsListReducer)
        : yield select((state) => state.productListFromCategoryReducer);

      let selectedCategoryProductArray = [];
      let newProductArray = response[0].products;

      switch (action.categoryType) {
        case "categoryType1":
          if (action.pageIndex == 0) {
            selectedCategoryProductArray = newProductArray;
          } else {
            selectedCategoryProductArray = [
              ...productsListOnCategory1,
              ...newProductArray,
            ];
          }
          break;
      }

      console.log("selectedCategoryProductArray", selectedCategoryProductArray);

      if (action.fromHome) {
        yield put(
          productsActions.updateCategoryProductList(
            selectedCategoryProductArray,
            action.categoryType
          )
        );

        if (action.getCategoryProductsListCallback) {
          let obj = response[0];
          let isPendingDataAvailable =
            obj.total_count > selectedCategoryProductArray.length
              ? true
              : false;
          console.log("######### TOTAL", obj.total_count);
          console.log("######### ARRAY", selectedCategoryProductArray.length);
          console.log("######### STATUS", isPendingDataAvailable);

          action.getCategoryProductsListCallback(true, isPendingDataAvailable);
        }
      } else {
        yield put(
          productsActions.updateCategoryProductListFromCategory(
            selectedCategoryProductArray,
            action.categoryType
          )
        );
        if (action.getCategoryProductsListCallback) {
          let obj = response[0];
          let isPendingDataAvailable =
            obj.total_count > selectedCategoryProductArray.length
              ? true
              : false;
          console.log("######### TOTAL", obj.total_count);
          console.log("######### ARRAY", selectedCategoryProductArray.length);
          console.log("######### STATUS", isPendingDataAvailable);

          action.getCategoryProductsListCallback(true, isPendingDataAvailable);
        }
      }
    } else {
      // showSingleAlert(translate('API_Failed'));

      if (action.fromHome) {
        yield put(
          productsActions.updateCategoryProductList([], action.categoryType)
        );
      } else {
        yield put(
          productsActions.updateCategoryProductListFromCategory(
            [],
            action.categoryType
          )
        );
      }
    }
  } catch (error) {
    console.log("API ERROR!!!!", error);
    yield put(loadingActions.disableProductListLoader({}));
  }
}

export function* get360ImagesSaga(action) {
  const { isNetworkAvailable, adminToken, storeCode } = yield select(
    (state) => state.appReducer
  );
  if (!isNetworkAvailable) {
    showSingleAlert(translate("No internet connection"));
    return;
  }

  yield put(loadingActions.enableLoader());

  try {
    const response = yield call(
      get360DegreeImagesAPI,
      action.productId,
      storeCode,
      adminToken
    );
    console.log("API RESPONSE OF 360 degree Images array", response);
    yield put(loadingActions.disableLoader({}));

    if (response && response.length > 0 && response[0].id) {
      if (action.callback) {
        action.callback(response);
      }
    } else {
      showSingleAlert(translate("API_Failed"));
    }
  } catch (error) {
    console.log("API ERROR!!!!", error);
    yield put(loadingActions.disableLoader({}));
  }
}

export function* addUserReviewSaga(action) {
  const { isNetworkAvailable, adminToken, storeCode } = yield select(
    (state) => state.appReducer
  );
  if (!isNetworkAvailable) {
    showSingleAlert(translate("No internet connection"));
    return;
  }
  yield put(loadingActions.enableLoader());
  try {
    const response = yield call(
      addUserReviews,
      action.reviewDict,
      storeCode,
      adminToken
    );
    console.log("API RESPONSE OF ADD REVIEW", response);
    yield put(loadingActions.disableLoader({}));
    if (response) {
      if (action.reviewAddCallback) {
        action.reviewAddCallback(true);
      }
    } else {
      showSingleAlert(translate("API_Failed"));
      if (action.reviewAddCallback) {
        action.reviewAddCallback(false);
      }
    }
  } catch (error) {
    console.log("API ERROR!!!!", error);
    showSingleAlert(translate("API_Failed"));
    if (action.reviewAddCallback) {
      action.reviewAddCallback(false);
    }
    yield put(loadingActions.disableLoader({}));
  }
}

export function* getUserReviewSaga(action) {
  const { isNetworkAvailable, adminToken, storeCode } = yield select(
    (state) => state.appReducer
  );
  if (!isNetworkAvailable) {
    showSingleAlert(translate("No internet connection"));
    return;
  }
  // yield put(loadingActions.enableLoader());
  try {
    const response = yield call(
      getUserReviews,
      action.skuId,
      storeCode,
      adminToken
    );
    console.log("API RESPONSE OF GET REVIEW", response);

    if (action.callback) {
      action.callback(response);
    }
    yield put(productsActions.updateUserRevews(response));
    // yield put(loadingActions.disableLoader({}));
  } catch (error) {
    console.log("API ERROR!!!!", error);
    showSingleAlert(translate("API_Failed"));
    // yield put(loadingActions.disableLoader({}));
  }
}

export function* notifyMeSaga(action) {
  const { isNetworkAvailable, adminToken, storeCode, userToken } = yield select(
    (state) => state.appReducer
  );
  if (!isNetworkAvailable) {
    showSingleAlert(translate("No internet connection"));
    return;
  }
  yield put(loadingActions.enableLoader());
  try {
    const response = yield call(
      notifyMeAPI,
      action.params,
      storeCode,
      userToken //adminToken
    );
    console.log("API RESPONSE OF NOTIFY ME API", response);
    yield put(loadingActions.disableLoader({}));

    if (response === true) {
      if (action.callback) action.callback(true);
    } else {
      if (action.callback) action.callback(false);
      showSingleAlert(
        translate("API_Failed", "Ok", () => {
          this.props.navigation.pop();
        })
      );
    }
  } catch (error) {
    console.log("API ERROR!!!!", error);
    showSingleAlert(translate("API_Failed"));
    if (action.callback) action.callback(false);
    yield put(loadingActions.disableLoader({}));
  }
}

export function* getBoughtTogetherSaga(action) {
  const { isNetworkAvailable, adminToken, storeCode, userToken } = yield select(
    (state) => state.appReducer
  );
  if (!isNetworkAvailable) {
    showSingleAlert(translate("No internet connection"));
    return;
  }
  yield put(loadingActions.enableLoader());
  try {
    const response = yield call(
      getBoughtTogetherProductsAPI,
      action.productId,
      storeCode,
      userToken //adminToken
    );
    console.log("API RESPONSE OF BOUGHT TOGETHER PRODUCTS API", response);
    yield put(loadingActions.disableLoader({}));

    if (response && response.length > 0) {
      let obj = response[0];
      if (obj.error) {
      } else {
        if (action.getBoughtTogetherProductsCallback)
          action.getBoughtTogetherProductsCallback(response);
      }
    } else {
    }
  } catch (error) {
    console.log("API ERROR!!!!", error);
    showSingleAlert(translate("API_Failed"));
    yield put(loadingActions.disableLoader({}));
  }
}

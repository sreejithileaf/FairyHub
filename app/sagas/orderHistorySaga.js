/**
 * Created by Jebin for iLeaf Solutions Pvt.Ltd
 * on March 19, 2020
 * Order history Saga - handles Order history operations
 */

import { showSingleAlert } from "../config/common";
import { put, call, select } from "redux-saga/effects";
import {
  getCartID,
  getOrderHistoryApi,
  getOrderDetailApi,
  orderRefundApi,
  orderReOrderApi,
  getOrderTrackingApi,
} from "../api/apiMethods";
import { translate } from "../config/languageSwitching";
import * as loadingActions from "../actions/loadingActions";
import * as cartActions from "../actions/cartActions";
import * as loginActions from "../actions/loginActions";

export function* getOrderHistory(action) {
  const { isNetworkAvailable, adminToken } = yield select(
    (state) => state.appReducer
  );
  const { userInfo } = yield select((state) => state.loginReducer);
  if (!isNetworkAvailable) {
    showSingleAlert(translate("No internet connection"));
    return;
  }

  yield put(loadingActions.enableLoader());
  try {
    let params = {
      searchCriteria: "all",
      "searchCriteria[filterGroups][0][filters][0][field]": "customer_email",
      "searchCriteria[filterGroups][0][filters][0][value]": userInfo.email,
      "searchCriteria[sortOrders][0][field]": "created_at",
      "searchCriteria[sortOrders][0][direction]": "desc",
      "searchCriteria[pageSize]": action.params.pageSize,
      "searchCriteria[currentPage]": action.params.pageIndex,
    };

    const response = yield call(
      getOrderHistoryApi,
      params,
      adminToken
      //'pi97uov11pk3gzyavah0xsiiaqaxby8v',
    );
    console.log("API RESPONSE OF ORDER HISTORY", response);
    yield put(loadingActions.disableLoader({}));

    if (response && response.message) {
      showSingleAlert(response.message);
    } else if (response) {
      if (action.callback) {
        action.callback(response);
      }
    }
  } catch (error) {
    console.log("ORDER HISTORY API ERROR!!!!", error);
    yield put(loadingActions.disableLoader({}));
  }
}

export function* getOrderDetailSaga(action) {
  const { isNetworkAvailable, adminToken } = yield select(
    (state) => state.appReducer
  );
  const { userInfo } = yield select((state) => state.loginReducer);
  if (!isNetworkAvailable) {
    showSingleAlert(translate("No internet connection"));
    return;
  }

  yield put(loadingActions.enableLoader());
  try {
    const response = yield call(getOrderDetailApi, action.orderId, adminToken);
    console.log("API RESPONSE OF ORDER DETAIL===", response);
    yield put(loadingActions.disableLoader({}));

    if (response && response.message) {
      showSingleAlert(response.message);
    } else if (response) {
      if (action.callback) {
        action.callback(response);
      }
    }
  } catch (error) {
    console.log("ORDER HISTORY API ERROR!!!!", error);
    yield put(loadingActions.disableLoader({}));
  }
}

export function* orderRefundSaga(action) {
  const {
    isNetworkAvailable,
    userToken,
    storeCode,
    adminToken,
    guestToken,
  } = yield select((state) => state.appReducer);
  if (!isNetworkAvailable) {
    showSingleAlert(translate("No internet connection"));
    return;
  }

  yield put(loadingActions.enableLoader());
  try {
    const response = yield call(
      orderRefundApi,
      action.params,
      storeCode,
      userToken
    );
    console.log("API RESPONSE OF ORDER REFUND ===", response);
    yield put(loadingActions.disableLoader({}));

    if (response && response.message) {
      showSingleAlert(response.message);
    } else if (response) {
      if (action.callback) {
        action.callback(response);
      }
    }
  } catch (error) {
    console.log("ORDER HISTORY API ERROR!!!!", error);
    yield put(loadingActions.disableLoader({}));
  }
}

export function* reOrderSaga(action) {
  const {
    isNetworkAvailable,
    userToken,
    storeCode,
    adminToken,
    guestToken,
  } = yield select((state) => state.appReducer);
  if (!isNetworkAvailable) {
    showSingleAlert(translate("No internet connection"));
    return;
  }

  yield put(loadingActions.enableLoader());
  try {
    const response = yield call(
      orderReOrderApi,
      action.params,
      storeCode,
      userToken
    );
    console.log("API RESPONSE OF RE-ORDER ===", response);
    yield put(loadingActions.disableLoader({}));

    if (
      response &&
      response.length == 2 &&
      response[0] == true &&
      response[1].length > 0
    ) {
      showSingleAlert(response[1]);
    } else if (response && response.length > 0 && response[0].cart_items) {
      yield put(cartActions.getProuctsInCart());
      if (action.callback) {
        action.callback(response);
      }

      // Get cart id
      const cartIDResponse = yield call(getCartID, userToken, storeCode);
      console.log("+++++++++ cartID RESPONSE ++++++++++", cartIDResponse);
      if (cartIDResponse && cartIDResponse.message) {
        // yield put(loginActions.cartProductsCallFailed());
        console.log("CART LIST ID RESPONSE ERROR::: ", cartIDResponse.message);
      } else {
        yield put(loginActions.updateCartId(cartIDResponse));
        console.log("CART LIST ID RESPONSE::: ", cartIDResponse);
      }
    }
  } catch (error) {
    console.log("ORDER HISTORY API ERROR!!!!", error);
    yield put(loadingActions.disableLoader({}));
  }
}

export function* getOrderTrackingHistory(action) {
  const { isNetworkAvailable, adminToken, userToken } = yield select(
    (state) => state.appReducer
  );
  const { userInfo } = yield select((state) => state.loginReducer);
  if (!isNetworkAvailable) {
    showSingleAlert(translate("No internet connection"));
    return;
  }

  yield put(loadingActions.enableLoader());
  try {  
    let params = {
      id: action.params.id,     
    };

    const response = yield call(
      getOrderTrackingApi,
      params,
      userToken
      //'pi97uov11pk3gzyavah0xsiiaqaxby8v',
    );
    console.log("API RESPONSE OF ORDER TRACKING", response);
    yield put(loadingActions.disableLoader({}));

    if (response && response.message) {
      showSingleAlert(response.message);
    } else if (response) {
      if (action.callback) {
        action.callback(response);
      }
    }
  } catch (error) {
    console.log("ORDER TRACKING API ERROR!!!!", error);
    yield put(loadingActions.disableLoader({}));
  }
}

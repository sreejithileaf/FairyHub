/**
 * Created by Jebin for iLeaf Solutions Pvt.Ltd
 * on February 20, 2020
 * AddAddressSaga - handles add address API saga
 */

import {
  addAddressAPI,
  getUserInfoAPI,
  deleteAddressAPI,
  getAllRegionsAPI,
} from "../api/apiMethods";
import { showSingleAlert } from "../config/common";
import { put, call, select } from "redux-saga/effects";
import { translate } from "../config/languageSwitching";
import * as loadingActions from "../actions/loadingActions";
import * as addAddressAction from "../actions/addAddressAction";
import * as navigationActions from "../actions/navigationActions";

// Our worker Saga that logins the user
export function* addAddressSaga(action) {
  const { isNetworkAvailable, userToken } = yield select(
    (state) => state.appReducer
  );

  if (!isNetworkAvailable) {
    showSingleAlert(translate("No internet connection"));
    return;
  }

  yield put(loadingActions.enableLoader());
  try {
    const response = yield call(addAddressAPI, action.params, userToken);
    if (response.message) {
      yield put(loadingActions.disableLoader({}));
      showSingleAlert(translate("API_Failed"));
    } else {
      const userInfoResponse = yield call(getUserInfoAPI, userToken);
      yield put(addAddressAction.updateAddress(userInfoResponse.addresses));
      yield put(loadingActions.disableLoader({}));
      if (action.addAddressCallback) {
        action.addAddressCallback(true);
      }
    }
  } catch (error) {
    yield put(addAddressAction.addAddressFailed());
    yield put(loadingActions.disableLoader({}));
  }
}

export function* editAddressSaga(action) {
  const { isNetworkAvailable, userToken } = yield select(
    (state) => state.appReducer
  );

  if (!isNetworkAvailable) {
    showSingleAlert(translate("No internet connection"));
    return;
  }

  yield put(loadingActions.enableLoader());
  try {
    const response = yield call(addAddressAPI, action.params, userToken);

    if (response.message) {
      yield put(loadingActions.disableLoader({}));
    } else {
      const userInfoResponse = yield call(getUserInfoAPI, userToken);
      yield put(addAddressAction.updateAddress(userInfoResponse.addresses));
      yield put(loadingActions.disableLoader({}));
      if (action.editAddressCallback) {
        action.editAddressCallback(true);
      }
    }
  } catch (error) {
    yield put(addAddressAction.addAddressFailed());
    yield put(loadingActions.disableLoader({}));
  }
}

export function* deleteAddressSaga(action) {
  const { isNetworkAvailable, userToken } = yield select(
    (state) => state.appReducer
  );

  if (!isNetworkAvailable) {
    showSingleAlert(translate("No internet connection"));
    return;
  }

  yield put(loadingActions.enableLoader());
  try {
    const response = yield call(deleteAddressAPI, action.addressId, userToken);

    if (response.message) {
      showSingleAlert(translate("API_Failed"));
      yield put(loadingActions.disableLoader({}));
    } else {
      const { addressList } = yield select((state) => state.addAddressReducer);
      let addressArray = addressList;
      addressArray.splice(action.addressIndex, 1);
      yield put(addAddressAction.updateAddress(addressArray));
      yield put(loadingActions.disableLoader({}));
    }
  } catch (error) {
    yield put(addAddressAction.addAddressFailed());
    yield put(loadingActions.disableLoader({}));
  }
}

export function* getAllRegionsSaga(action) {
  const { isNetworkAvailable, userToken, storeCode, adminToken } = yield select(
    (state) => state.appReducer
  );

  if (!isNetworkAvailable) {
    showSingleAlert(translate("No internet connection"));
    return;
  }

  // yield put(loadingActions.enableLoader());
  try {
    const response = yield call(getAllRegionsAPI, storeCode, adminToken);

    yield put(loadingActions.disableLoader({}));

    if (response && response.length > 0 && response[0].region) {
      let regions = response[0].region;
      if (action.callback) {
        action.callback(regions);
      }
    } else {
      showSingleAlert(translate("API_Failed"));
      if (action.callback) {
        action.callback([]);
      }
    }
  } catch (error) {
    yield put(addAddressAction.addAddressFailed());
    yield put(loadingActions.disableLoader({}));
  }
}

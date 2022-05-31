/* Redux saga class
 * Registers the user into the app
 * requires firstname, lastname, email and password.
 */

import {
  registerUser,
  addEmailReminderGuestAPI,
  getAllEmailReminderAPI,
} from "../api/apiMethods";
import { showSingleAlert } from "../config/common";
import { put, call, select } from "redux-saga/effects";
import { translate } from "../config/languageSwitching";
import * as loginActions from "../actions/loginActions";
import { format, addHours } from "date-fns";
import * as loadingActions from "../actions/loadingActions";

export function* registerUserSaga(action) {
  console.log("register saga call", action);
  const {
    isNetworkAvailable,
    storeCode,
    storesView,
    adminToken,
  } = yield select((state) => state.appReducer);
  if (!isNetworkAvailable) {
    showSingleAlert(translate("No internet connection"));
    return;
  }

  yield put(loadingActions.enableLoader());

  try {
    let storeId = action.isRTL ? 2 : 1;
    storesView.map((item) => {
      if (item.code === storeCode) {
        storeId = item.id;
      }
    });

    console.log("STOR ID", storeId);

    const response = yield call(registerUser, action.userInfo, storeId);
    console.log("API RESPONSE OF REGISTER ", response);
    yield put(loadingActions.disableLoader({}));

    if (response && response.message) {
      yield put(loginActions.registerFailed());
      showSingleAlert(response.message);
    } else if (response && response.id) {
      console.log("REGISTER :::", response);
      // yield put(loginActions.onRegisterResponse(response));
      console.log("=================>>>>>>>>", action.userInfo);

      if (action.userInfo.emailReminderArray.length > 0) {
        let params = [];

        action.userInfo.emailReminderArray.map((reminderItem) => {
          let dict = {
            name: reminderItem.name,
            occasion: reminderItem.occasion,
            birthdate: reminderItem.birthdate,
            gender: reminderItem.gender,
            customer_id: response.id,
          };

          params.push(dict);
        });

        const addEmailReminderResponse = yield call(
          addEmailReminderGuestAPI,
          { reminders: params },
          storeId,
          adminToken
        );

        console.log(
          "ADD BIRTHDAY REMINDER AT REGISTRATION RESPONSE",
          addEmailReminderResponse
        );
      }

      if (action.registerCallback) {
        action.registerCallback(true);
      }
    }
  } catch (error) {
    console.log("REGISTER API ERROR!!!!", error);
    yield put(loginActions.registerFailed());
    yield put(loadingActions.disableLoader({}));
  }
}

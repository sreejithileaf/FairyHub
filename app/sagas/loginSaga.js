/* Redux saga class
 * logins the user into the app
 * requires username and password.
 */
import {
  getCartID,
  loginUser,
  getWishlist,
  profileUpdate,
  forgotPassword,
  passwordUpdate,
  submitFeedback,
  getUserInfoAPI,
  addWishlistItem,
  getCartProducts,
  socialMediaLogin,
  removeWishlistItem,
  updateUserTokenAPI,
  addEmailReminderAPI,
  deleteEmailReminderAPI,
  getAllEmailReminderAPI,
  mergeGuestCartAPI,
} from "../api/apiMethods";
import { showSingleAlert } from "../config/common";
import * as cartActions from "../actions/cartActions";
import { put, call, select } from "redux-saga/effects";
import * as loginActions from "../actions/loginActions";
import { translate } from "../config/languageSwitching";
import * as loadingActions from "../actions/loadingActions";
import * as addAddressAction from "../actions/addAddressAction";

export function* loginUserSaga(action) {
  const {
    isNetworkAvailable,
    userToken,
    adminToken,
    storeCode,
    guestToken,
  } = yield select((state) => state.appReducer);
  const { guestCartArray } = yield select((state) => state.cartReducer);
  if (!isNetworkAvailable) {
    showSingleAlert(translate("No internet connection"));
    return;
  }

  let loginState = false,
    userInfoState = false,
    wishListState = false,
    cartIdState = false,
    cartListState = false;
  yield put(loadingActions.enableLoader());
  try {
    const response = yield call(
      loginUser,
      action.username,
      action.password,
      storeCode
    );
    console.log("API RESPONSE OF LOGIN::: ", response);
    if (response && response.message) {
      yield put(loadingActions.disableLoader({}));
      if (userToken === "") {
        showSingleAlert(response.message);
        // showSingleAlert(translate("login_error"));
      }
      if (action.loginCallback) {
        action.loginCallback(false, userToken === "" ? false : true);
      }
    } else if (response && response.length > 0) {
      if (response[0].error) {
        loginState = false;
        showSingleAlert(response[0].message);
        yield put(loadingActions.disableLoader({}));

        if (action.loginCallback) {
          action.loginCallback(false, userToken === "" ? false : true);
        }
        return;
      }

      loginState = true;
      yield put(loginActions.onLoginResponse(response));
      yield put(loginActions.updateSocialMediaLoginStatus(false));

      // Get user info
      const userInfoResponse = yield call(getUserInfoAPI, response);
      console.log("==========userInfoResponse====", userInfoResponse);
      if (userInfoResponse && userInfoResponse.id) {
        userInfoState = true;
        yield put(
          loginActions.updateUserInfo(userInfoResponse, action.username, "")
        );
        yield put(
          addAddressAction.addAddressResponse(userInfoResponse.addresses)
        );
      } else {
        yield put(loginActions.updateUserInfo(null));
      }

      // Merge guest cart
      if (
        guestToken.length > 0 &&
        guestCartArray.length > 0 &&
        userInfoResponse &&
        userInfoResponse.id
      ) {
        let params = {
          customerId: userInfoResponse.id,
          storeId: userInfoResponse.store_id,
        };

        const mergeGuestCartResponse = yield call(
          mergeGuestCartAPI,
          params,
          storeCode,
          guestToken,
          response
        );
        console.log("MERGE GUEST CART API RESPONSE", mergeGuestCartResponse);

        if (mergeGuestCartResponse == true) {
          // clear guest cart
          yield put(loginActions.clearGuestCart());
        }
      }

      // Get wish list
      const wishListResponse = yield call(getWishlist, response);
      if (wishListResponse && wishListResponse.message) {
        console.log("WISHLIST API RESPONSE ERROR:::", wishListResponse.message);
      } else {
        wishListState = true;
        console.log("WISHLIST API RESPONSE:::", wishListResponse);
        yield put(loginActions.updateWishList(wishListResponse));
      }

      const cartIDResponse = yield call(getCartID, response, storeCode);
      console.log("+++++++++ cartID RESPONSE ++++++++++", cartIDResponse);
      if (cartIDResponse && cartIDResponse.message) {
        // yield put(loginActions.cartProductsCallFailed());
        console.log("CART LIST ID RESPONSE ERROR::: ", cartIDResponse.message);
      } else {
        cartIdState = true;
        yield put(loginActions.updateCartId(cartIDResponse));
        console.log("CART LIST ID RESPONSE::: ", cartIDResponse);
      }

      // Get cart list
      const cartResponse = yield call(getCartProducts, response);
      if (cartResponse && cartResponse.message) {
        yield put(cartActions.cartProductsCallFailed());
        console.log("CART LIST RESPONSE ERROR::: ", cartResponse.message);
      } else {
        cartListState = true;
        yield put(cartActions.updateCartProducts(cartResponse));
        console.log("CART LIST RESPONSE::: ", cartResponse);
      }

      yield put(loadingActions.disableLoader({}));
      if (action.loginCallback) {
        if (
          loginState &&
          userInfoState &&
          wishListState &&
          cartIdState &&
          cartListState
        ) {
          action.loginCallback(true, false);
        } else {
          action.loginCallback(false, true);
        }
      }
    }
  } catch (error) {
    console.log("LOGIN API ERROR!!!!", error);
    yield put(loginActions.loginFailed());
    yield put(loadingActions.disableLoader({}));
  }
}

// Social media login
export function* socialMediaLoginSaga(action) {
  const {
    isNetworkAvailable,
    userToken,
    adminToken,
    storeCode,
    guestToken,
  } = yield select((state) => state.appReducer);
  const { guestCartArray } = yield select((state) => state.cartReducer);

  if (!isNetworkAvailable) {
    showSingleAlert(translate("No internet connection"));
    return;
  }

  let loginState = false,
    userInfoState = false,
    wishListState = false,
    cartIdState = false,
    cartListState = false;
  yield put(loadingActions.enableLoader());
  try {
    const socialMediaLoginResponse = yield call(
      socialMediaLogin,
      action.params
    );

    console.log(
      "API RESPONSE OF SOCIAL MEDIA LOGIN::: ",
      socialMediaLoginResponse
    );

    let response = "";
    if (socialMediaLoginResponse.length > 0) {
      console.log("###");
      let dictLog = socialMediaLoginResponse[0].customerdetails;
      response = dictLog.token;
    } else {
      response = socialMediaLoginResponse;
      console.log("---", response);
    }
    if (response && response.messages) {
      console.log("======+++");
      yield put(loadingActions.disableLoader({}));
      if (userToken === "") {
        //showSingleAlert(response.message);
        showSingleAlert(translate("login_error"));
      }
      if (action.loginCallback) {
        action.loginCallback(false, userToken === "" ? false : true, null);
      }
    } else if (response && response.message) {
      console.log("======+++");
      yield put(loadingActions.disableLoader({}));
      if (userToken === "") {
        showSingleAlert(response.message);
      }
      if (action.loginCallback) {
        action.loginCallback(false, userToken === "" ? false : true, null);
      }
    } else if (response && response.length > 0) {
      loginState = true;
      yield put(loginActions.onLoginResponse(response));
      yield put(loginActions.updateSocialMediaLoginStatus(true));

      // Get user info
      const userInfoResponse = yield call(getUserInfoAPI, response);
      console.log("==========userInfoResponse====", userInfoResponse);
      if (userInfoResponse && userInfoResponse.id) {
        userInfoState = true;
        yield put(
          loginActions.updateUserInfo(userInfoResponse, action.username, "")
        );
        yield put(
          addAddressAction.addAddressResponse(userInfoResponse.addresses)
        );
      } else {
        yield put(loginActions.updateUserInfo(null));
      }

      // Merge guest cart
      if (
        guestToken.length > 0 &&
        guestCartArray.length > 0 &&
        userInfoResponse &&
        userInfoResponse.id
      ) {
        let params = {
          customerId: userInfoResponse.id,
          storeId: userInfoResponse.store_id,
        };

        const mergeGuestCartResponse = yield call(
          mergeGuestCartAPI,
          params,
          storeCode,
          guestToken,
          response
        );
        console.log("MERGE GUEST CART API RESPONSE", mergeGuestCartResponse);

        if (mergeGuestCartResponse == true) {
          // clear guest cart
          yield put(loginActions.clearGuestCart());
        }
      }

      // Get wish list
      const wishListResponse = yield call(getWishlist, response);
      if (wishListResponse && wishListResponse.message) {
        console.log("WISHLIST API RESPONSE ERROR:::", wishListResponse.message);
      } else {
        wishListState = true;
        console.log("WISHLIST API RESPONSE:::", wishListResponse);
        yield put(loginActions.updateWishList(wishListResponse));
      }

      const cartIDResponse = yield call(getCartID, response, storeCode);
      console.log("+++++++++ cartID RESPONSE ++++++++++", cartIDResponse);
      if (cartIDResponse && cartIDResponse.message) {
        // yield put(loginActions.cartProductsCallFailed());
        console.log("CART LIST ID RESPONSE ERROR::: ", cartIDResponse.message);
      } else {
        cartIdState = true;
        yield put(loginActions.updateCartId(cartIDResponse));
        console.log("CART LIST ID RESPONSE::: ", cartIDResponse);
      }

      // Get cart list
      const cartResponse = yield call(getCartProducts, response);
      if (cartResponse && cartResponse.message) {
        yield put(cartActions.cartProductsCallFailed());
        console.log("CART LIST RESPONSE ERROR::: ", cartResponse.message);
      } else {
        cartListState = true;
        yield put(cartActions.updateCartProducts(cartResponse));
        console.log("CART LIST RESPONSE::: ", cartResponse);
      }
      // clear guest cart
      yield put(loginActions.clearGuestCart());

      yield put(loadingActions.disableLoader({}));
      if (action.loginCallback) {
        if (
          loginState &&
          userInfoState &&
          wishListState &&
          cartIdState &&
          cartListState
        ) {
          action.loginCallback(true, false, socialMediaLoginResponse);
        } else {
          action.loginCallback(false, true, null);
        }
      }
    }
  } catch (error) {
    console.log("LOGIN API ERROR!!!!", error);
    yield put(loginActions.loginFailed());
    yield put(loadingActions.disableLoader({}));
  }
}

export function* getUserSaga(action) {
  const { isNetworkAvailable, userToken, adminToken, storeCode } = yield select(
    (state) => state.appReducer
  );
  if (!isNetworkAvailable) {
    showSingleAlert(translate("No internet connection"));
    return;
  }

  let loginState = false,
    userInfoState = false,
    wishListState = false,
    cartIdState = false,
    cartListState = false;

  let updateToken = "";
  yield put(loadingActions.enableLoader());
  try {
    // Update user token
    const updateTokenResponse = yield call(
      updateUserTokenAPI,
      storeCode,
      userToken
    );
    console.log(
      "API RESPONSE OF USER TOKEN UPDATED===>>>",
      updateTokenResponse
    );

    if (updateTokenResponse.length > 0) {
      if (
        updateTokenResponse[0].status == true &&
        updateTokenResponse[0].token
      ) {
        updateToken = updateTokenResponse[0].token;
        loginState = true;
        yield put(loginActions.onLoginResponse(updateToken));
      } else {
        loginState = false;
      }
    } else {
      loginState = false;
    }

    // Get user info
    let response = updateToken.length > 0 ? updateToken : "";
    const userInfoResponse = yield call(getUserInfoAPI, response);
    console.log("==========userInfoResponse====", userInfoResponse);
    if (userInfoResponse && userInfoResponse.id) {
      userInfoState = true;
      yield put(
        loginActions.updateUserInfo(userInfoResponse, action.username, "")
      );
      yield put(
        addAddressAction.addAddressResponse(userInfoResponse.addresses)
      );
    } else {
      yield put(loginActions.updateUserInfo(null));
    }

    // Get wish list
    const wishListResponse = yield call(getWishlist, response);
    if (wishListResponse && wishListResponse.message) {
      console.log("WISHLIST API RESPONSE ERROR:::", wishListResponse.message);
    } else {
      wishListState = true;
      console.log("WISHLIST API RESPONSE:::", wishListResponse);
      yield put(loginActions.updateWishList(wishListResponse));
    }

    // Get cart id
    const cartIDResponse = yield call(getCartID, response, storeCode);
    console.log("+++++++++ cartID RESPONSE ++++++++++", cartIDResponse);
    if (cartIDResponse && cartIDResponse.message) {
      // yield put(loginActions.cartProductsCallFailed());
      console.log("CART LIST ID RESPONSE ERROR::: ", cartIDResponse.message);
    } else {
      cartIdState = true;
      yield put(loginActions.updateCartId(cartIDResponse));
      console.log("CART LIST ID RESPONSE::: ", cartIDResponse);
    }

    // Get cart list
    const cartResponse = yield call(getCartProducts, response);
    if (cartResponse && cartResponse.message) {
      yield put(cartActions.cartProductsCallFailed());
      console.log("CART LIST RESPONSE ERROR::: ", cartResponse.message);
    } else {
      cartListState = true;
      yield put(cartActions.updateCartProducts(cartResponse));
      console.log("CART LIST RESPONSE::: ", cartResponse);
    }
    // clear guest cart
    yield put(loginActions.clearGuestCart());

    yield put(loadingActions.disableLoader({}));
    if (action.loginCallback) {
      if (
        loginState &&
        userInfoState &&
        wishListState &&
        cartIdState &&
        cartListState
      ) {
        action.loginCallback(true, false);
      } else {
        action.loginCallback(false, true);
      }
    }
  } catch (error) {
    console.log("LOGIN API ERROR!!!!", error);
    yield put(loginActions.loginFailed());
    yield put(loadingActions.disableLoader({}));
  }
}

export function* forgotPasswordSaga(action) {
  const { isNetworkAvailable, storeCode } = yield select(
    (state) => state.appReducer
  );
  if (!isNetworkAvailable) {
    showSingleAlert(translate("No internet connection"));
    return;
  }
  yield put(loadingActions.enableLoader());
  try {
    const response = yield call(forgotPassword, action.user_email, storeCode);
    yield put(loadingActions.disableLoader({}));

    console.log("API RESPONSE OF FORGOT PASSWORD ", response);
    if (response) {
      if (response.message) {
        showSingleAlert(translate("Cant find this user"));
      } else {
        if (action.forgotPasswordCallback) {
          action.forgotPasswordCallback(response);
        }
      }
    } else {
      showSingleAlert(translate("API_Failed"));
    }
  } catch (error) {
    console.log("FORGOT PASSWORD API ERROR!!!!", error);
    yield put(loadingActions.disableLoader({}));
  }
}

export function* profileUpdateSaga(action) {
  const { isNetworkAvailable, userToken } = yield select(
    (state) => state.appReducer
  );
  if (!isNetworkAvailable) {
    showSingleAlert(translate("No internet connection"));
    return;
  }
  yield put(loadingActions.enableLoader());
  try {
    const response = yield call(profileUpdate, action.userInfo, userToken);
    console.log("API RESPONSE OF UPDATE PROFILE ", response);
    if (response) {
      if (response.message) {
        showSingleAlert(response.message);
        yield put(loadingActions.disableLoader({}));
      } else {
        if (action.newPassword.length > 0) {
          const passwordResponse = yield call(
            passwordUpdate,
            action.oldPassword,
            action.newPassword,
            userToken
          );
          console.log("API RESPONSE OF PASSWORD UPDATE ", passwordResponse);
          if (passwordResponse) {
            if (passwordResponse.message) {
              showSingleAlert(passwordResponse.message);
              yield put(loadingActions.disableLoader({}));
              if (action.profileUpdateCallback) {
                action.profileUpdateCallback(false);
              }
            } else {
              yield put(loginActions.onProfileUpdateResponse(response));
              yield put(loadingActions.disableLoader({}));
              if (action.profileUpdateCallback) {
                action.profileUpdateCallback(true);
              }
            }
          }
        } else {
          yield put(loginActions.onProfileUpdateResponse(response));
          yield put(loadingActions.disableLoader({}));
          if (action.profileUpdateCallback) {
            action.profileUpdateCallback(true);
          }
        }
      }
    }
  } catch (error) {
    console.log("PROFILE UPDATE API ERROR!!!!", error);
    yield put(loadingActions.disableLoader({}));
  }
}

export function* passwordUpdateSaga(action) {
  const { isNetworkAvailable, userToken } = yield select(
    (state) => state.appReducer
  );
  if (!isNetworkAvailable) {
    showSingleAlert(translate("No internet connection"));
    return;
  }
  yield put(loadingActions.enableLoader());
  try {
    if (action.newPassword.length > 0) {
      const passwordResponse = yield call(
        passwordUpdate,
        action.oldPassword,
        action.newPassword,
        userToken
      );
      console.log("API RESPONSE OF PASSWORD UPDATE ", passwordResponse);
      if (passwordResponse) {
        if (passwordResponse.message) {
          showSingleAlert(passwordResponse.message);
          yield put(loadingActions.disableLoader({}));
          if (action.passwordUpdateCallback) {
            action.passwordUpdateCallback(false);
          }
        } else {
          yield put(loadingActions.disableLoader({}));
          if (action.passwordUpdateCallback) {
            action.passwordUpdateCallback(true);
          }
        }
      }
    } else {
      yield put(loadingActions.disableLoader({}));
      if (action.passwordUpdateCallback) {
        action.passwordUpdateCallback(true);
      }
    }
  } catch (error) {
    console.log("PASSWORD UPDATE API ERROR!!!!", error);
    yield put(loadingActions.disableLoader({}));
  }
}

export function* removeWishlistItemSaga(action) {
  const { isNetworkAvailable, userToken } = yield select(
    (state) => state.appReducer
  );
  if (!isNetworkAvailable) {
    showSingleAlert(translate("No internet connection"));
    if (action.removeCallback) {
      action.removeCallback(false);
    }
    return;
  }
  try {
    const response = yield call(
      removeWishlistItem,
      action.productId,
      userToken
    );
    console.log("API RESPONSE OF REMOVE ITEM ", response);
    if (response) {
      if (response.message) {
        showSingleAlert(response.message);
        if (action.removeCallback) {
          action.removeCallback(false);
        }
      } else {
        if (action.removeCallback) {
          action.removeCallback(true);
        }
        const wishListResponse = yield call(getWishlist, userToken);
        if (wishListResponse && wishListResponse.message) {
          console.log(
            "WISHLIST API RESPONSE ERROR:::",
            wishListResponse.message
          );
        } else {
          console.log("WISHLIST API RESPONSE:::", wishListResponse);
          yield put(loginActions.updateWishList(wishListResponse));
        }
      }
    }
  } catch (error) {
    console.log("REMOVE ITEM API ERROR!!!!", error);
    if (action.removeCallback) {
      action.removeCallback(false);
    }
  }
}

export function* addWishlistItemSaga(action) {
  const { isNetworkAvailable, userToken } = yield select(
    (state) => state.appReducer
  );
  if (!isNetworkAvailable) {
    showSingleAlert(translate("No internet connection"));
    if (action.addCallback) {
      action.addCallback(false);
    }
    return;
  }
  try {
    const response = yield call(addWishlistItem, action.productId, userToken);
    console.log("API RESPONSE OF ADD ITEM ", response);
    if (response) {
      if (response.message) {
        showSingleAlert(response.message);
        if (action.addCallback) {
          action.addCallback(false);
        }
      } else {
        if (action.addCallback) {
          action.addCallback(true);
        }
        const wishListResponse = yield call(getWishlist, userToken);
        if (wishListResponse && wishListResponse.message) {
          console.log(
            "WISHLIST API RESPONSE ERROR:::",
            wishListResponse.message
          );
        } else {
          console.log("WISHLIST API RESPONSE:::", wishListResponse);
          yield put(loginActions.updateWishList(wishListResponse));
        }
      }
    }
  } catch (error) {
    console.log("ADD ITEM API ERROR!!!!", error);
    if (action.addCallback) {
      action.addCallback(false);
    }
  }
}

export function* submitFeedbackSaga(action) {
  const { isNetworkAvailable } = yield select((state) => state.appReducer);
  if (!isNetworkAvailable) {
    showSingleAlert(translate("No internet connection"));
    return;
  }
  yield put(loadingActions.enableLoader());
  try {
    const response = yield call(
      submitFeedback,
      action.firstName,
      action.lastName,
      action.email,
      action.mobile,
      action.reason,
      action.message
    );
    console.log("API RESPONSE OF SUBMIT FEEDBACK ", response);
    yield put(loadingActions.disableLoader());
    if (response) {
      if (response.message) {
        showSingleAlert(response.message);
        if (action.callBack) {
          console.log("callbackkkk1");
          action.callBack(false);
        }
      } else {
        if (action.callBack) {
          console.log("callbackkkk2");
          action.callBack(true);
        }
      }
    }
  } catch (error) {
    yield put(loadingActions.disableLoader());
    console.log("SUBMIT FEEDBACK API ERROR!!!!", error);
  }
}

export function* updateUserTokenSaga(action) {
  const { isNetworkAvailable, userToken, adminToken, storeCode } = yield select(
    (state) => state.appReducer
  );
  if (!isNetworkAvailable) {
    showSingleAlert(translate("No internet connection"));
    return;
  }
  try {
    // Update user token
    const updateTokenResponse = yield call(
      updateUserTokenAPI,
      storeCode,
      userToken
    );

    let updateToken = "";
    console.log("API RESPONSE OF RENEW USER TOKEN ", updateTokenResponse);

    if (updateTokenResponse.length > 0) {
      if (
        updateTokenResponse[0].status == true &&
        updateTokenResponse[0].token
      ) {
        updateToken = updateTokenResponse[0].token;
        yield put(loginActions.onLoginResponse(updateToken));
        if (action.callback) {
          action.callback(true);
        }
      } else {
        if (action.callback) {
          action.callback(false);
        }
      }
    } else {
      if (action.callback) {
        action.callback(false);
      }
    }

    // if (updateTokenResponse) {
    //   if (updateTokenResponse.message) {
    //     showSingleAlert(response.message);
    //     if (action.callback) {
    //       action.callback(false);
    //     }
    //   } else {
    //     if (action.callback) {
    //       action.callback(true);
    //     }
    //   }
    // } else {
    //   if (action.callback) {
    //     action.callback(false);
    //   }
    // }
  } catch (error) {
    console.log("SUBMIT FEEDBACK API ERROR!!!!", error);
  }
}

export function* addEmailReminderSaga(action) {
  const { isNetworkAvailable, userToken, adminToken, storeCode } = yield select(
    (state) => state.appReducer
  );
  if (!isNetworkAvailable) {
    showSingleAlert(translate("No internet connection"));
    return;
  }
  yield put(loadingActions.enableLoader());

  try {
    const response = yield call(
      addEmailReminderAPI,
      action.params,
      storeCode,
      userToken
    );
    console.log("API RESPONSE OF ADD EMAIL REMINDER ", response);
    yield put(loadingActions.disableLoader({}));

    if (response) {
      if (response.message) {
        if (action.callback) {
          action.callback(false);
        }
      } else {
        const getAllEmailReminders = yield call(
          getAllEmailReminderAPI,
          storeCode,
          userToken
        );

        if (
          getAllEmailReminders &&
          getAllEmailReminders.length > 0 &&
          getAllEmailReminders[0].remainder_details
        ) {
          if (getAllEmailReminders.message) {
            if (action.callback) {
              action.callback(false);
            }
          } else {
            if (action.callback) {
              action.callback(true);
            }
            yield put(
              loginActions.updateEmailRemindersArray(
                getAllEmailReminders[0].remainder_details
              )
            );
          }
        } else {
          if (action.callback) {
            action.callback(false);
          }
        }
      }
    } else {
      if (action.callback) {
        action.callback(false);
      }
    }
  } catch (error) {
    console.log("SUBMIT FEEDBACK API ERROR!!!!", error);
    showSingleAlert(translate("API_Failed"));
    yield put(loadingActions.disableLoader({}));
  }
}

export function* getAllEmailReminderSaga(action) {
  const { isNetworkAvailable, userToken, adminToken, storeCode } = yield select(
    (state) => state.appReducer
  );
  if (!isNetworkAvailable) {
    showSingleAlert(translate("No internet connection"));
    return;
  }
  yield put(loadingActions.enableLoader());

  try {
    const response = yield call(getAllEmailReminderAPI, storeCode, userToken);
    console.log("API RESPONSE OF GET ALL EMAIL REMINDERS ", response);
    yield put(loadingActions.disableLoader({}));

    if (response && response.length > 0 && response[0].remainder_details) {
      if (response.message) {
        if (action.callback) {
          action.callback(false);
        }
      } else {
        if (action.callback) {
          action.callback(true);
        }
        yield put(
          loginActions.updateEmailRemindersArray(response[0].remainder_details)
        );
      }
    } else {
      if (action.callback) {
        action.callback(false);
      }
    }
  } catch (error) {
    console.log("SUBMIT FEEDBACK API ERROR!!!!", error);
    showSingleAlert(translate("API_Failed"));
    yield put(loadingActions.disableLoader({}));
  }
}

export function* deleteEmailReminderSaga(action) {
  const { isNetworkAvailable, userToken, adminToken, storeCode } = yield select(
    (state) => state.appReducer
  );
  if (!isNetworkAvailable) {
    showSingleAlert(translate("No internet connection"));
    return;
  }
  yield put(loadingActions.enableLoader());

  try {
    const response = yield call(
      deleteEmailReminderAPI,
      action.params,
      storeCode,
      userToken
    );
    console.log("API RESPONSE OF DELETE EMAIL REMINDERS ", response);
    yield put(loadingActions.disableLoader({}));

    if (response) {
      if (response.message) {
        if (action.callback) {
          action.callback(false);
          showSingleAlert(translate("API_Failed"));
        }
      } else {
        const getAllEmailReminders = yield call(
          getAllEmailReminderAPI,
          storeCode,
          userToken
        );

        if (
          getAllEmailReminders &&
          getAllEmailReminders.length > 0 &&
          getAllEmailReminders[0].remainder_details
        ) {
          if (getAllEmailReminders.message) {
            if (action.callback) {
              action.callback(false);
            }
          } else {
            if (action.callback) {
              action.callback(true);
            }
            yield put(
              loginActions.updateEmailRemindersArray(
                getAllEmailReminders[0].remainder_details
              )
            );
          }
        } else {
          if (action.callback) {
            action.callback(false);
          }
        }
      }
    } else {
      if (action.callback) {
        action.callback(false);
        showSingleAlert(translate("API_Failed"));
      }
    }
  } catch (error) {
    console.log("SUBMIT FEEDBACK API ERROR!!!!", error);
    showSingleAlert(translate("API_Failed"));
    yield put(loadingActions.disableLoader({}));
  }
}

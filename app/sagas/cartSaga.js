/**
 * Created by Arun for iLeaf Solutions Pvt.Ltd
 * on March 15, 2020
 * CartSaga - handles search history state
 */

import {
  getCartID,
  getCartProducts,
  addProductToCart,
  getGuestCartTotalCostAPI,
  getLoggedUserCartTotalCostAPI,
  updateCartItemApi,
  updateGuestCartItemApi,
  updateGuestProductsAPI,
  getAvailableAddOnsAPI,
  addAddOnLoginedUserAPI,
  addAddOnGuestUserAPI,
  getMoreAddOnsAPI,
  addExtraProductsLoggedUserAPI,
  addExtraProductsGuestUserAPI,
} from '../api/apiMethods';
import {showSingleAlert} from '../config/common';
import * as cartActions from '../actions/cartActions';
import {put, call, select} from 'redux-saga/effects';
import * as loginActions from '../actions/loginActions';
import {translate} from '../config/languageSwitching';
import * as loadingActions from '../actions/loadingActions';

export function* getCartSaga(action) {
  const {isNetworkAvailable, userToken, storeCode, adminToken, guestToken} =
    yield select(state => state.appReducer);

  if (!isNetworkAvailable) {
    showSingleAlert(translate('No internet connection'));
    return;
  }

  yield put(loadingActions.enableLoader());
  try {
    if (userToken.length > 0) {
      const response = yield call(getCartProducts, userToken);
      console.log('response from cart list', response);
      yield put(loadingActions.disableLoader({}));
      if (response.length > 0) {
        yield put(cartActions.updateCartProducts(response));
        yield put(loadingActions.disableLoader({}));
        if (action.callback) {
          action.callback(response);
        }
      } else if (response.message) {
        alert(JSON.stringify(response.message));
      }
    } else {
      const guestCartArray = yield call(
        updateGuestProductsAPI,
        guestToken,
        adminToken,
      );
      console.log('GUEST CART ARRAY RESPONSE==', guestCartArray);
      yield put(loadingActions.disableLoader({}));
      if (guestCartArray.message) {
        alert(JSON.stringify(guestCartArray.message));
      } else {
        if (action.callback) {
          action.callback(guestCartArray);
        }
        yield put(cartActions.updateGuestCartProducts(guestCartArray));
      }
    }
  } catch (error) {
    console.log('API ERROR!!!!', error);
    yield put(cartActions.cartProductsCallFailed());
    yield put(loadingActions.disableLoader({}));
  }
}

export function* addProductToCartSaga(action) {
  const {isNetworkAvailable, userToken, storeCode} = yield select(
    state => state.appReducer,
  );
  if (!isNetworkAvailable) {
    showSingleAlert(translate('No internet connection'));
    return;
  }

  yield put(loadingActions.enableLoader());
  try {
    const {cartArray} = yield select(state => state.cartReducer);
    const response = yield call(addProductToCart, action.params, userToken); //userToken
    console.log('+++++++  response from add product ++++++++ ', response);

    if (action.isAllItems) {
      if (response && response.item_id) {
        if (action.callback) {
          setTimeout(() => {
            action.callback(true);
          }, 100);
        }
      }
    } else {
      if (response && response.item_id) {
        const updatedArray = yield call(getCartProducts, userToken);
        console.log(
          '++++++++++ updated array for logged user ++++++ ',
          updatedArray,
        );
        yield put(cartActions.updateCartProducts(updatedArray));
        yield put(loadingActions.disableLoader({}));
        if (action.callback) {
          action.callback(true);
        }
      } else if (response.message) {
        if (
          response.message === 'No such entity with %fieldName = %fieldValue'
        ) {
          const cartIDResponse = yield call(getCartID, userToken, storeCode);
          console.log('NEW CART ID', cartIDResponse);

          yield put(loginActions.updateCartId(cartIDResponse));

          let params = action.params;
          params.cart_item.quote_id = cartIDResponse;

          const response2 = yield call(addProductToCart, params, userToken); //userToken

          if (response2 && response2.item_id) {
            const updatedArray = yield call(getCartProducts, userToken);
            console.log(
              '++++++++++ updated array for logged user 2 ++++++ ',
              updatedArray,
            );
            yield put(cartActions.updateCartProducts(updatedArray));
            yield put(loadingActions.disableLoader({}));
            if (action.callback) {
              action.callback(true);
            }
          } else if (response2.message) {
            yield put(loadingActions.disableLoader({}));
            if (response2 && response2.message) {
              if (action.callback) action.callback(false, response2.message);
            } else {
              if (action.callback) action.callback(false, null);
            }
          } else {
            yield put(loadingActions.disableLoader({}));
            if (action.callback) action.callback(false, null);
          }
        } else {
          yield put(loadingActions.disableLoader({}));
          if (response && response.message) {
            if (action.callback) action.callback(false, response.message);
          } else {
            if (action.callback) action.callback(false, null);
          }
        }
      } else {
        yield put(loadingActions.disableLoader({}));
        if (action.callback) action.callback(false, null);
      }
    }
  } catch (error) {
    console.log('API ERROR!!!!', error);
    yield put(cartActions.cartProductsCallFailed());
    yield put(loadingActions.disableLoader({}));
  }
}

export function* getTotalCartCostSaga(action) {
  const {isNetworkAvailable, userToken, storeCode, adminToken, guestToken} =
    yield select(state => state.appReducer);
  if (!isNetworkAvailable) {
    showSingleAlert(translate('No internet connection'));
    return;
  }

  yield put(loadingActions.enableLoader());
  try {
    let response;
    if (userToken.length > 0) {
      response = yield call(
        getLoggedUserCartTotalCostAPI,
        storeCode,
        userToken,
      );
    } else {
      response = yield call(
        getGuestCartTotalCostAPI,
        storeCode,
        guestToken,
        adminToken,
      );
    }

    console.log('GET CART TOTAL COST RESPONSE==>>>', response);

    if (response && response.grand_total) {
      yield put(cartActions.updateCarttotals(response));
      if (userToken.length > 0) {
        const cartresponse = yield call(getCartProducts, userToken); //userToken
        console.log('response from cart list', cartresponse);
        if (response && !response.message) {
          yield put(cartActions.updateCartProducts(cartresponse));
        }
      } else {
        const guestCartArray = yield call(
          updateGuestProductsAPI,
          guestToken,
          adminToken,
        );
        console.log('GUEST CART ARRAY RESPONSE==', guestCartArray);
        yield put(cartActions.updateGuestCartProducts(guestCartArray));
      }
      if (action.getTotalCostCallback) {
        action.getTotalCostCallback(response);
      }
    } else if (response.message) {
      if (action.getTotalCostCallback) {
        if (
          response.message ===
          "The consumer isn't authorized to access %resources."
        ) {
          action.getTotalCostCallback(null, 'SESSION_EXPIRED');
          yield put(loginActions.userDidLogOut());
        } else {
          action.getTotalCostCallback(null);
          alert(JSON.stringify(response.message));
        }
      }
    }
    yield put(loadingActions.disableLoader({}));
  } catch (error) {
    console.log('API ERROR!!!!', error);
    yield put(cartActions.cartProductsCallFailed());
    yield put(loadingActions.disableLoader({}));
  }
}

export function* getLoggedUserCartIdSaga(action) {
  const {isNetworkAvailable, userToken, storeCode} = yield select(
    state => state.appReducer,
  );
  if (!isNetworkAvailable) {
    showSingleAlert(translate('No internet connection'));
    return;
  }

  yield put(loadingActions.enableLoader());
  try {
    const cartIDResponse = yield call(getCartID, userToken, storeCode);

    console.log('LOGGED USER CART ID RESPONSE', cartIDResponse);

    if (cartIDResponse && cartIDResponse.message) {
      console.log('CART LIST ID RESPONSE ERROR::: ', cartIDResponse.message);
      if (action.getLoggedUserCartIdCallback) {
        action.getLoggedUserCartIdCallback(false);
      }
    } else {
      yield put(loginActions.updateCartId(cartIDResponse));
      if (action.getLoggedUserCartIdCallback) {
        action.getLoggedUserCartIdCallback(true);
      }
    }
    yield put(loadingActions.disableLoader({}));
  } catch (error) {
    console.log('API ERROR!!!!', error);
    yield put(cartActions.cartProductsCallFailed());
    yield put(loadingActions.disableLoader({}));
  }
}

export function* updateCartDateTimeSaga(action) {
  const {isNetworkAvailable, userToken, adminToken, guestToken} = yield select(
    state => state.appReducer,
  );
  const {cartTotals} = yield select(state => state.cartReducer);
  if (!isNetworkAvailable) {
    showSingleAlert(translate('No internet connection'));
    return;
  }
  yield put(loadingActions.enableLoader());
  try {
    let response;
    if (userToken.length > 0) {
      response = yield call(updateCartItemApi, action.cartDict, userToken);
    } else {
      response = yield call(
        updateGuestCartItemApi,
        action.cartDict,
        guestToken,
        adminToken,
      );
    }

    console.log('CART DATE TIME UPDATE RESPONSE--', response);
    if (response && response.message && response.length < 3) {
      showSingleAlert(response.message);
    } else if (response.length >= 3) {
      if (userToken.length > 0) {
        yield put(cartActions.updateCartProducts(response[1].cart_items));
      } else {
        yield put(cartActions.updateGuestCartProducts(response[1].cart_items));
      }

      if (response.length == 3) {
        cartTotals.total_segments = response[2].total_segments;
        yield put(cartActions.updateCarttotals(cartTotals));
      }
    } else {
      // showSingleAlert("Error in update delivery date & time");
      // showSingleAlert(translate("delivery date and time error"));
    }
    yield put(loadingActions.disableLoader({}));
  } catch (error) {
    console.log('API ERROR!!!!', error);
    showSingleAlert(translate('API_Failed'));
    yield put(loadingActions.disableLoader({}));
  }
}

export function* getAvailableAddOnsSaga(action) {
  const {isNetworkAvailable, userToken, adminToken, guestToken, storeCode} =
    yield select(state => state.appReducer);
  if (!isNetworkAvailable) {
    showSingleAlert(translate('No internet connection'));
    return;
  }
  yield put(loadingActions.enableLoader());
  try {
    let response = yield call(
      getAvailableAddOnsAPI,
      action.params,
      storeCode,
      adminToken,
    );

    console.log('GET AVAILABLE ADD ONS RESPONSE', response);
    if (response && response.message) {
      if (action.callback) {
        action.callback(false);
      }
      showSingleAlert(response.message);
    } else {
      if (action.callback) {
        action.callback(true);
      }

      if (action.params.addon_type === 'balloon') {
        yield put(cartActions.updateAvailableBalloons(response));
      } else {
        yield put(cartActions.updateAvailableGiftWraps(response));
      }
    }
    // yield put(loadingActions.disableLoader({}));
    yield new Promise(resolve =>
      setTimeout(() => {
        resolve();
      }, 1000),
    );
    yield put(loadingActions.disableLoader({}));
  } catch (error) {
    console.log('API ERROR!!!!', error);
    showSingleAlert(translate('API_Failed'));
    yield put(loadingActions.disableLoader({}));
  }
}

export function* getMoreAddOnsSaga(action) {
  const {isNetworkAvailable, userToken, adminToken, guestToken, storeCode} =
    yield select(state => state.appReducer);
  if (!isNetworkAvailable) {
    showSingleAlert(translate('No internet connection'));
    return;
  }
  // yield put(loadingActions.enableLoader());
  try {
    let response = yield call(
      getMoreAddOnsAPI,
      action.params,
      storeCode,
      adminToken,
    );

    console.log('GET MORE ADD ONS RESPONSE', response);

    if (response && response.message) {
      if (action.callback) {
        action.callback(false);
      }
      showSingleAlert(response.message);
    } else {
      if (action.callback) {
        action.callback(response);
      }
    }

    // yield put(loadingActions.disableLoader({}));
  } catch (error) {
    console.log('API ERROR!!!!', error);
    showSingleAlert(translate('API_Failed'));
    // yield put(loadingActions.disableLoader({}));
  }
}

export function* addAddOnsSaga(action) {
  const {isNetworkAvailable, userToken, adminToken, guestToken, storeCode} =
    yield select(state => state.appReducer);
  if (!isNetworkAvailable) {
    showSingleAlert(translate('No internet connection'));
    return;
  }
  yield put(loadingActions.enableLoader());
  try {
    let response;
    if (userToken.length > 0) {
      response = yield call(
        addAddOnLoginedUserAPI,
        action.params,
        storeCode,
        userToken,
      );
    } else {
      response = yield call(
        addAddOnGuestUserAPI,
        action.params,
        storeCode,
        guestToken,
        adminToken,
      );
    }

    console.log('ADD ADD ONS RESPONSE', response);
    if (response && response.message) {
      if (action.callback) {
        action.callback(false);
      }
      showSingleAlert(response.message);
    } else {
      if (action.callback) action.callback(true);
      // if (userToken.length > 0) {
      //   const cartresponse = yield call(getCartProducts, userToken); //userToken
      //   console.log("response from cart list", cartresponse);
      //   if (cartresponse && !cartresponse.message) {
      //     yield put(cartActions.updateCartProducts(cartresponse));
      //     if (action.callback) action.callback(true);
      //   } else {
      //     if (action.callback) action.callback(false);
      //     showSingleAlert(cartresponse.message);
      //   }
      // } else {
      //   const updatedArray = yield call(
      //     updateGuestProductsAPI,
      //     guestToken,
      //     adminToken
      //   );
      //   console.log("Guest cart list", updatedArray);
      //   if (updatedArray && !updatedArray.message) {
      //     yield put(cartActions.updateGuestCartProducts(updatedArray));
      //     if (action.callback) action.callback(true);
      //   } else {
      //     if (action.callback) action.callback(false);
      //     showSingleAlert(updatedArray.message);
      //   }
      // }
    }
    yield put(loadingActions.disableLoader({}));
  } catch (error) {
    console.log('API ERROR!!!!', error);
    showSingleAlert(translate('API_Failed'));
    yield put(loadingActions.disableLoader({}));
  }
}

export function* addExtraProductsToCartSaga(action) {
  const {isNetworkAvailable, userToken, storeCode, adminToken, guestToken} =
    yield select(state => state.appReducer);
  if (!isNetworkAvailable) {
    showSingleAlert(translate('No internet connection'));
    return;
  }

  yield put(loadingActions.enableLoader());
  try {
    if (userToken.length > 0) {
      const response = yield call(
        addExtraProductsLoggedUserAPI,
        action.params,
        storeCode,
        userToken,
      );

      console.log(
        'RESPONSE OF ADD EXTRA PRODUCTS TO CART LOGGED USER ',
        response,
      );

      if (response && response.length > 0) {
        let dict = response[0];
        if (dict.error) {
          yield put(loadingActions.disableLoader({}));
          showSingleAlert(dict.message);
        } else {
          const cartresponse = yield call(getCartProducts, userToken); //userToken
          console.log('response from cart list', cartresponse);
          if (response && !response.message) {
            yield put(cartActions.updateCartProducts(cartresponse));
          }

          yield put(loadingActions.disableLoader({}));
          if (action.callback) action.callback();
        }
      } else {
        yield put(loadingActions.disableLoader({}));
        showSingleAlert(translate('API_Failed'));
      }
    } else {
      const response = yield call(
        addExtraProductsGuestUserAPI,
        action.params,
        storeCode,
        adminToken,
      );
      console.log(
        'RESPONSE OF ADD EXTRA PRODUCTS TO CART GUEST USER ',
        response,
      );

      if (response && response.length > 0) {
        let dict = response[0];
        if (dict.error) {
          yield put(loadingActions.disableLoader({}));
          showSingleAlert(dict.message);
        } else {
          const guestCartArray = yield call(
            updateGuestProductsAPI,
            guestToken,
            adminToken,
          );
          console.log('GUEST CART ARRAY RESPONSE==', guestCartArray);
          yield put(loadingActions.disableLoader({}));

          yield put(cartActions.updateGuestCartProducts(guestCartArray));
          if (action.callback) action.callback();
        }
      } else {
        yield put(loadingActions.disableLoader({}));
        showSingleAlert(translate('API_Failed'));
      }
    }
  } catch (error) {
    console.log('API ERROR!!!!', error);
    yield put(cartActions.cartProductsCallFailed());
    yield put(loadingActions.disableLoader({}));
  }
}

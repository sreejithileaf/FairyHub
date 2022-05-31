/**
 * Created by Jebin for iLeaf Solutions Pvt.Ltd
 * on March 19, 2020
 * Checkout Saga - handles checkout operations
 */

import {
  getCartID,
  placeOrderGuestAPI,
  setShipmentGuestAPI,
  placeOrderLoggedUserAPI,
  setShipmentLoggedUserAPI,
  applyVoucherCodeGuestAPI,
  getPaymentMethodsGuestAPI,
  getShipmentMethodsGuestAPI,
  applyVoucherCodeLoggedUserAPI,
  getPaymentMethodsLoggedUserAPI,
  getShipmentMethodsLoggedUserAPI,
  getDeliveryDateAndTime,
  removeVoucherCodeLoggedUserAPI,
  removeVoucherCodeGuestAPI,
  placeOrderCODLoggedUserAPI,
  placeOrderCODGuestUserAPI,
  getCollectionMethodsLoggedUserAPI,
  getCollectionMethodsGuestUserAPI,
  getPaymentUrlLoggedUserAPI,
  getPaymentUrlGuestUserAPI,
  placeOrderPaymentLoggedUserAPI,
  placeOrderPaymentGuestUserAPI,
  getPaymentFailedInfoAPI,
  addDeliveryNoteAPI,
  getRetryPaymentUrlLoggedUserAPI,
  placeOrderPaymentReTryLoggedUserAPI,
  getRetryPaymentOptionsAPI,
  placeOrderPaymentAPI,
  retainCartLoggedUserAPI,
  retainCartGuestUserAPI,
  myFatoorahCreateGuestSession,
  myFatoorahCreateLoggedinUserSession,
  myFatoorahProcessGuestSession,
  myFatoorahProcessLoggedinUserSession,
  myFatoorahGetPaymentMethods,
  getPaymentUrlMyFatoorah,
  myFatoorahGetPaymentMethodsGuest,
  getPaymentUrlMyFatoorahGuest,
} from '../api/apiMethods';
import Images from '../config/images';
import {showSingleAlert} from '../config/common';
import * as cartActions from '../actions/cartActions';
import {translate} from '../config/languageSwitching';
import * as loginActions from '../actions/loginActions';
import * as guestActions from '../actions/guestActions';
import * as loadingActions from '../actions/loadingActions';
import {put, call, all, select} from 'redux-saga/effects';
import * as checkoutActions from '../actions/checkoutActions';
import {el} from 'date-fns/locale';

// Our worker Saga that logins the user
export function* setShipmentSaga(action) {
  const {
    isNetworkAvailable,
    userToken,
    storeCode,
    adminToken,
    guestToken,
    selectedLanguage,
  } = yield select(state => state.appReducer);
  const {cartID} = yield select(state => state.loginReducer);

  if (!isNetworkAvailable) {
    showSingleAlert(translate('No internet connection'));
    return;
  }

  yield put(loadingActions.enableLoader());
  try {
    let response;
    if (userToken.length > 0) {
      response = yield call(
        setShipmentLoggedUserAPI,
        action.params,
        storeCode,
        userToken,
      );
    } else {
      response = yield call(
        setShipmentGuestAPI,
        action.params,
        storeCode,
        guestToken,
        adminToken,
      );
    }
    console.log('SET SHIPMENT RESPONSE=====', response);
    let paymentMethodsArray = [];

    if (response.message && action.orderPlacedCallback) {
      action.orderPlacedCallback(false, {});
    } else if (action.orderPlacedCallback) {
      let collectionMethodResponse;
      if (userToken.length > 0) {
        collectionMethodResponse = yield call(
          myFatoorahGetPaymentMethods,
          {quote_id: cartID},
          storeCode,
          userToken,
        );
      } else {
        collectionMethodResponse = yield call(
          myFatoorahGetPaymentMethodsGuest,
          {quote_id: guestToken},
          storeCode,
          adminToken,
        );
      }

      // collectionMethodResponse = [true, null];
      console.log(
        'GET PAYMENT COLLECTION METHODS RESPONSE---',
        collectionMethodResponse,
      );

      if (
        collectionMethodResponse &&
        collectionMethodResponse.length > 1 &&
        collectionMethodResponse[0] === true &&
        collectionMethodResponse[1]
      ) {
        let collectionMethods = collectionMethodResponse[1];

        let paymentMethodsArray = [];

        collectionMethods.map(collItem => {
          let dict;
          if (selectedLanguage == 'ar') {
            dict = {
              image: {uri: collItem.ImageUrl},
              title:
                collItem.PaymentMethodEn === 'KNET'
                  ? 'الكي نت'
                  : collItem.PaymentMethodEn === 'VISA/MASTER'
                  ? 'بطاقة الإئتمان'
                  : collItem.PaymentMethodEn,
              // selectedLanguage == 'ar'
              //   ? collItem.PaymentMethodAr
              //   : collItem.PaymentMethodEn,
              paymentMethodId: collItem.PaymentMethodId,
              IsEmbeddedSupported: collItem.IsEmbeddedSupported,
            };
          } else {
            dict = {
              image: {uri: collItem.ImageUrl},
              title:
                collItem.PaymentMethodEn === 'KNET'
                  ? 'Debit Card'
                  : collItem.PaymentMethodEn === 'VISA/MASTER'
                  ? 'Credit Card'
                  : collItem.PaymentMethodEn,
              // selectedLanguage == 'ar'
              //   ? collItem.PaymentMethodAr
              //   : collItem.PaymentMethodEn,
              paymentMethodId: collItem.PaymentMethodId,
              IsEmbeddedSupported: collItem.IsEmbeddedSupported,
            };
          }

          paymentMethodsArray.push(dict);
        });
        response.payment_methods.map(payMethod => {
          if (payMethod.code === 'cashondelivery') {
            let dict = {
              image: Images.cod,
              title: selectedLanguage == 'ar' ? 'نقداً' : payMethod.title,
              paymentMethodId: payMethod.code,
            };
            paymentMethodsArray.push(dict);
          }
        });
        action.orderPlacedCallback(true, {
          ...response,
          ...{payment_methods: paymentMethodsArray},
        });

        console.log('+++++++++++++', paymentMethodsArray);
      } else {
        // action.orderPlacedCallback(false, {});
        let paymentMethodsArray = [];
        console.log('==========================================');
        response.payment_methods.map(payMethod => {
          if (payMethod.code === 'cashondelivery') {
            let dict = {
              image: Images.cod,
              title: selectedLanguage == 'ar' ? 'نقداً' : payMethod.title,
              paymentMethodId: payMethod.code,
            };
            paymentMethodsArray.push(dict);
          }
        });
        action.orderPlacedCallback(true, {
          ...response,
          ...{payment_methods: paymentMethodsArray},
        });
      }

      /* MY FATOORAH START*/

      // if (response.message && action.orderPlacedCallback) {
      //   action.orderPlacedCallback(false, {});
      // } else if (action.orderPlacedCallback) {
      //   const cartIDResponse = yield call(getCartID, userToken, storeCode);
      //   // let collectionMethodResponse;

      //   console.log('==========================================');
      //   response.payment_methods.map(payMethod => {
      //     if (payMethod.code === 'cashondelivery') {
      //       let dict = {
      //         image: Images.cod,
      //         title: payMethod.title,
      //         paymentMethodId: payMethod.code,
      //       };
      //       paymentMethodsArray.push(dict);
      //     } else if (payMethod.code === 'myfatoorah_gateway') {
      //       let dict = {
      //         image: Images.myFathoraIcon,
      //         title: 'Debit/Credit Card', //payMethod.title,
      //         paymentMethodId: payMethod.code,
      //       };
      //       paymentMethodsArray.push(dict);
      //     }
      //   });
      //   action.orderPlacedCallback(true, {
      //     ...response,
      //     ...{payment_methods: paymentMethodsArray},
      //   });

      /* END*/

      yield put(cartActions.updateCarttotals(response.totals));
    } else {
      showSingleAlert(translate('API_Failed'));
    }
    yield put(loadingActions.disableLoader({}));
  } catch (error) {
    showSingleAlert(translate('API_Failed'));
    console.log('API ERROR!!!! - SET SHIPMENT', error);
    yield put(loadingActions.disableLoader({}));
    if (action.orderPlacedCallback) {
      action.orderPlacedCallback(false, {});
    }
  }
}

export function* applyVoucherCodeSaga(action) {
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
        applyVoucherCodeLoggedUserAPI,
        action.voucherCode,
        storeCode,
        userToken,
      );
    } else {
      response = yield call(
        applyVoucherCodeGuestAPI,
        action.voucherCode,
        storeCode,
        guestToken,
        adminToken,
      );
    }

    yield put(loadingActions.disableLoader({}));

    console.log('APPLY VOUCHER CODE RESPONSE', response);

    if (response && response.message) {
      if (action.apllyCodeCallback)
        action.apllyCodeCallback(false, response.message);
    } else {
      if (action.apllyCodeCallback) action.apllyCodeCallback(true, '');
    }

    // } else {
    //   yield put(loadingActions.disableLoader({}));
    //   showSingleAlert(translate('API_Failed'));
    // }
  } catch (error) {
    showSingleAlert(translate('API_Failed'));
    console.log('API ERROR!!!!', error);
    yield put(loadingActions.disableLoader({}));
  }
}

export function* removeVoucherCodeSaga(action) {
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
        removeVoucherCodeLoggedUserAPI,
        storeCode,
        userToken,
      );
    } else {
      response = yield call(
        removeVoucherCodeGuestAPI,
        storeCode,
        guestToken,
        adminToken,
      );
    }

    yield put(loadingActions.disableLoader({}));

    console.log('DELETE VOUCHER CODE RESPONSE', response);

    if (response && response.message) {
      if (action.removeAppliedVoucherCallback)
        action.removeAppliedVoucherCallback(false);
    } else {
      if (action.removeAppliedVoucherCallback)
        action.removeAppliedVoucherCallback(true);
    }
  } catch (error) {
    showSingleAlert(translate('API_Failed'));
    console.log('API ERROR!!!!', error);
    yield put(loadingActions.disableLoader({}));
  }
}

export function* getPaymentAndShipmentMethodsSaga(action) {
  const {isNetworkAvailable, userToken, storeCode, adminToken, guestToken} =
    yield select(state => state.appReducer);

  if (!isNetworkAvailable) {
    showSingleAlert(translate('No internet connection'));
    return;
  }

  yield put(loadingActions.enableLoader());
  try {
    let response;

    let shipmentMethods = [];
    let paymentMethods = [];

    if (userToken.length > 0) {
      const {shipment, payment} = yield all({
        payment: call(getPaymentMethodsLoggedUserAPI, storeCode, userToken),
        shipment: call(getShipmentMethodsLoggedUserAPI, storeCode, userToken),
      });
      shipmentMethods = shipment;
      paymentMethods = payment;
    } else {
      const {shipment, payment} = yield all({
        payment: call(
          getPaymentMethodsGuestAPI,
          storeCode,
          guestToken,
          adminToken,
        ),
        shipment: call(
          getShipmentMethodsGuestAPI,
          storeCode,
          guestToken,
          adminToken,
        ),
      });
      shipmentMethods = shipment;
      paymentMethods = payment;
    }

    yield put(loadingActions.disableLoader({}));

    console.log('GET PAYMENT METHODS RESPONSE', paymentMethods);
    console.log('GET SHIPMENT METHODS RESPONSE', shipmentMethods);

    if (
      paymentMethods &&
      paymentMethods.length > 0 &&
      paymentMethods[0].code &&
      shipmentMethods &&
      shipmentMethods.length > 0 &&
      shipmentMethods[0].carrier_code
    ) {
      if (action.getPaymentAndShippingMethodsCallback)
        action.getPaymentAndShippingMethodsCallback(
          paymentMethods,
          shipmentMethods,
        );
    } else {
      if (action.getPaymentAndShippingMethodsCallback)
        action.getPaymentAndShippingMethodsCallback([], []);
    }
  } catch (error) {
    // showSingleAlert(translate('API_Failed'));
    console.log('API ERROR!!!! - GET PAYMENT AND SHIPING', error);
    yield put(loadingActions.disableLoader({}));
    if (action.getPaymentAndShippingMethodsCallback)
      action.getPaymentAndShippingMethodsCallback([], []);
  }
}

export function* getDeliveryDateAndTimeSaga(action) {
  const {isNetworkAvailable} = yield select(state => state.appReducer);

  if (!isNetworkAvailable) {
    showSingleAlert(translate('No internet connection'));
    return;
  }

  yield put(loadingActions.enableLoader());
  try {
    const response = yield call(getDeliveryDateAndTime);
    yield put(loadingActions.disableLoader({}));

    console.log('GET DELIVERY DATE AND TIME', response);
    if (response) {
      if (action.getDeliveryDateCallback) {
        action.getDeliveryDateCallback(true, response);
      }
    } else {
      showSingleAlert(translate('API_Failed'));
      if (action.getDeliveryDateCallback) {
        action.getDeliveryDateCallback(false, '');
      }
    }
  } catch (error) {
    showSingleAlert(translate('API_Failed'));
    console.log('API ERROR!!!! - GET DELIVERY DATE AND TIME', error);
    if (action.getDeliveryDateCallback) {
      action.getDeliveryDateCallback(false, '');
    }
    yield put(loadingActions.disableLoader({}));
  }
}

export function* placeOrderCODSaga(action) {
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
        placeOrderCODLoggedUserAPI,
        action.codDict,
        storeCode,
        userToken,
      );
    } else {
      response = yield call(
        placeOrderCODGuestUserAPI,
        action.codDict,
        storeCode,
        guestToken,
        adminToken,
      );
    }

    console.log('PLACE COD ORDER RESPONSE---', response);

    if (response && response.length > 0 && response[0].entity_id) {
      if (userToken.length > 0) {
        yield put(cartActions.updateCartProducts([]));
        const cartIDResponse = yield call(getCartID, userToken, storeCode);
        console.log('GET CARTID RESPONSE --- ', cartIDResponse);

        yield put(loadingActions.disableLoader({}));
        if (cartIDResponse && cartIDResponse.message) {
          // yield put(loginActions.cartProductsCallFailed());
          console.log(
            'CART LIST ID RESPONSE ERROR::: ',
            cartIDResponse.message,
          );
          if (action.orderPlacedCallback) {
            action.orderPlacedCallback(false);
          }
        } else {
          yield put(loginActions.updateCartId(cartIDResponse));
          console.log('CART LIST ID RESPONSE::: ', cartIDResponse);
          if (action.orderPlacedCallback) {
            action.orderPlacedCallback(true, response[0].entity_id);
          }
        }
      } else {
        yield put(loadingActions.disableLoader({}));
        if (action.orderPlacedCallback) {
          action.orderPlacedCallback(true, response[0].entity_id);
        }
        yield put(guestActions.updateCartList([]));
        yield put(guestActions.clearQuoteId());
      }
    } else if (response && response.length > 0 && response[0].error) {
      showSingleAlert(response[0].error_desc);
      yield put(loadingActions.disableLoader({}));
    } else if (response.message) {
      showSingleAlert(response.message);
      yield put(loadingActions.disableLoader({}));
    } else {
      yield put(loadingActions.disableLoader({}));
      showSingleAlert(translate('API_Failed'));
    }
  } catch (error) {
    showSingleAlert(translate('API_Failed'));
    console.log('API ERROR!!!! - PLACE ORDER COD', error);
    yield put(loadingActions.disableLoader({}));
  }
}

export function* placeOrderPaymentSaga(action) {
  const {isNetworkAvailable, userToken, storeCode, adminToken, guestToken} =
    yield select(state => state.appReducer);

  if (!isNetworkAvailable) {
    showSingleAlert(translate('No internet connection'));
    return;
  }

  yield put(loadingActions.enableLoader());
  try {
    let response;
    if (action.isCardPayment) {
      if (userToken.length > 0) {
        response = yield call(
          placeOrderPaymentLoggedUserAPI,
          action.params,
          storeCode,
          userToken,
        );
      } else {
        response = yield call(
          placeOrderPaymentGuestUserAPI,
          action.params,
          storeCode,
          guestToken,
          adminToken,
        );
      }
    } else {
      response = yield call(
        placeOrderPaymentAPI,
        action.params,
        storeCode,
        '',
        '',
      );
    }

    console.log('PLACE ORDER BY PAYMENT RESPONSE---', response);

    yield put(loadingActions.disableLoader({}));

    if (response && response.length > 0 && response[0].entity_id) {
      if (userToken.length > 0) {
        yield put(cartActions.updateCartProducts([]));
        const cartIDResponse = yield call(getCartID, userToken, storeCode);
        console.log('GET CARTID RESPONSE --- ', cartIDResponse);

        yield put(loadingActions.disableLoader({}));
        if (cartIDResponse && cartIDResponse.message) {
          // yield put(loginActions.cartProductsCallFailed());
          console.log(
            'CART LIST ID RESPONSE ERROR::: ',
            cartIDResponse.message,
          );
          if (action.paymentOrderPlacedCallback) {
            action.paymentOrderPlacedCallback(false);
          }
        } else {
          yield put(loginActions.updateCartId(cartIDResponse));
          console.log('CART LIST ID RESPONSE::: ', cartIDResponse);
          if (action.paymentOrderPlacedCallback) {
            action.paymentOrderPlacedCallback(true, response[0].entity_id);
          }
        }
      } else {
        yield put(loadingActions.disableLoader({}));
        if (action.paymentOrderPlacedCallback) {
          action.paymentOrderPlacedCallback(true, response[0].entity_id);
        }
        yield put(guestActions.updateCartList([]));
        yield put(guestActions.clearQuoteId());
      }
    } else if (
      response &&
      response.length > 0 &&
      response[0].error &&
      response[0].error_desc
    ) {
      showSingleAlert(response[0].error_desc);
      yield put(loadingActions.disableLoader({}));
    } else if (
      response &&
      response.length > 0 &&
      response[0].error &&
      response[0].errorMessage
    ) {
      yield put(cartActions.getProuctsInCart());
      showSingleAlert(response[0].errorMessage);
      yield put(loadingActions.disableLoader({}));
    } else if (response && response.length > 0 && response[0].status) {
      //Handle null error in response

      console.log('NUL-------------------lllll');
      yield put(loadingActions.disableLoader({}));
      if (action.paymentOrderPlacedCallback) {
        action.paymentOrderPlacedCallback(false, '');
      }
    } else {
      yield put(loadingActions.disableLoader({}));
      showSingleAlert(translate('API_Failed'));
    }
  } catch (error) {
    showSingleAlert(translate('API_Failed'));
    console.log('API ERROR!!!! - PLACE ORDER PAYMENT', error);
    yield put(loadingActions.disableLoader({}));
  }
}

export function* getCollectionMethodsSaga(action) {
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
        getCollectionMethodsLoggedUserAPI,
        action.params,
        storeCode,
        userToken,
      );
    } else {
      response = yield call(
        getCollectionMethodsGuestUserAPI,
        action.params,
        storeCode,
        guestToken,
        adminToken,
      );
    }

    console.log('GET PAYMENT COLLECTION METHODS RESPONSE---', response);
    yield put(loadingActions.disableLoader({}));

    if (response && response.length > 1 && response[0] === true) {
      let methods = response[1];
      if (action.collectionMethodsCallback)
        action.collectionMethodsCallback(methods);
    } else {
      if (action.collectionMethodsCallback)
        action.collectionMethodsCallback([]);
    }
  } catch (error) {
    showSingleAlert(translate('API_Failed'));
    console.log('COLLECTION METHODS GET API ERROR!!!! ', error);
    yield put(loadingActions.disableLoader({}));
  }
}

export function* getPaymentURLSaga(action) {
  const {isNetworkAvailable, userToken, storeCode, adminToken, guestToken} =
    yield select(state => state.appReducer);

  if (!isNetworkAvailable) {
    showSingleAlert(translate('No internet connection'));
    return;
  }

  yield put(loadingActions.enableLoader());
  try {
    let response;
    // if (userToken.length > 0) {
    //   response = yield call(
    //     getPaymentUrlLoggedUserAPI,
    //     action.params,
    //     storeCode,
    //     userToken,
    //   );
    // } else {
    //   response = yield call(
    //     getPaymentUrlGuestUserAPI,
    //     action.params,
    //     storeCode,
    //     guestToken,
    //     adminToken,
    //   );
    // }

    //New Payment API
    if (userToken.length > 0) {
      response = yield call(
        getPaymentUrlMyFatoorah,
        action.params,
        storeCode,
        userToken,
      );
    } else {
      response = yield call(
        getPaymentUrlMyFatoorahGuest,
        action.params,
        storeCode,
        adminToken,
      );
    }

    console.log('GET PAYMENT URL RESPONSE---', response);
    yield put(loadingActions.disableLoader({}));

    if (response && response.length > 0 && response[0].status) {
      let dict = response[0];
      if (action.paymentURLCallback) action.paymentURLCallback(dict);

      if (userToken.length > 0) {
        yield put(cartActions.updateCartProducts([]));
        const cartIDResponse = yield call(getCartID, userToken, storeCode);
        console.log('GET CARTID RESPONSE --- ', cartIDResponse);

        yield put(loadingActions.disableLoader({}));
        if (cartIDResponse && cartIDResponse.message) {
          console.log(
            'CART LIST ID RESPONSE ERROR::: ',
            cartIDResponse.message,
          );
        } else {
          yield put(loginActions.updateCartId(cartIDResponse));
          console.log('CART LIST ID RESPONSE::: ', cartIDResponse);
        }
      } else {
        yield put(loadingActions.disableLoader({}));
        yield put(guestActions.updateCartList([]));
        yield put(guestActions.clearQuoteId());
      }
    }

    if (
      response &&
      response.length > 0 &&
      response[0].error &&
      response[0].errorCode === 'QUOTEERROR'
    ) {
      let message = response[0].error_desc;
      // showSingleAlert(message);

      if (userToken.length > 0) {
        showSingleAlert(
          translate(
            'Order is pending, please got to order history and confirm',
          ),
        );
      } else {
        showSingleAlert(translate('guest order cancel message'));
      }

      if (action.paymentURLCallback)
        action.paymentURLCallback({isCartError: true});
      if (userToken.length > 0) {
        yield put(cartActions.updateCartProducts([]));
        const cartIDResponse = yield call(getCartID, userToken, storeCode);
        console.log('GET CARTID RESPONSE --- ', cartIDResponse);

        yield put(loadingActions.disableLoader({}));
        if (cartIDResponse && cartIDResponse.message) {
          console.log(
            'CART LIST ID RESPONSE ERROR::: ',
            cartIDResponse.message,
          );
        } else {
          yield put(loginActions.updateCartId(cartIDResponse));
          console.log('CART LIST ID RESPONSE::: ', cartIDResponse);
        }
      } else {
        yield put(loadingActions.disableLoader({}));

        yield put(guestActions.updateCartList([]));
        yield put(guestActions.clearQuoteId());
      }
    } else if (response.message) {
      showSingleAlert(response.message);
    } else {
      if (action.paymentURLCallback) action.paymentURLCallback(null);
    }
  } catch (error) {
    showSingleAlert(translate('API_Failed'));
    console.log('API ERROR!!!! - GET PAYMENT URL', error);
    yield put(loadingActions.disableLoader({}));
  }
}

export function* getPaymentFailedInfoSaga(action) {
  const {isNetworkAvailable, userToken, storeCode, adminToken, guestToken} =
    yield select(state => state.appReducer);

  if (!isNetworkAvailable) {
    showSingleAlert(translate('No internet connection'));
    return;
  }

  yield put(loadingActions.enableLoader());
  try {
    let response = yield call(
      getPaymentFailedInfoAPI,
      action.params,
      storeCode,
    );
    console.log('GET PAYMENT FAILED INFO RESPONSE---', response);
    // yield put(loadingActions.disableLoader({}));

    if (response && response.length > 0) {
      if (action.callback) {
        // action.callback(response[0]);
      }

      if (userToken.length > 0) {
        yield put(cartActions.updateCartProducts([]));
        const cartIDResponse = yield call(getCartID, userToken, storeCode);
        console.log('GET CARTID RESPONSE --- ', cartIDResponse);

        yield put(loadingActions.disableLoader({}));
        if (cartIDResponse && cartIDResponse.message) {
          // yield put(loginActions.cartProductsCallFailed());
          console.log(
            'CART LIST ID RESPONSE ERROR::: ',
            cartIDResponse.message,
          );
          if (action.callback) {
            action.callback(false, response[0]);
          }
        } else {
          yield put(loginActions.updateCartId(cartIDResponse));
          console.log('CART LIST ID RESPONSE::: ', cartIDResponse);
          if (action.callback) {
            action.callback(true, response[0]);
          }
        }
      } else {
        yield put(loadingActions.disableLoader({}));
        if (action.callback) {
          action.callback(true, response[0]);
        }
        yield put(guestActions.updateCartList([]));
        yield put(guestActions.clearQuoteId());
      }
    }
  } catch (error) {
    showSingleAlert(translate('API_Failed'));
    console.log('API ERROR!!!!', error);
    yield put(loadingActions.disableLoader({}));
  }
}

export function* addDeliveryNoteSaga(action) {
  const {isNetworkAvailable, userToken, storeCode, adminToken, guestToken} =
    yield select(state => state.appReducer);

  if (!isNetworkAvailable) {
    showSingleAlert(translate('No internet connection'));
    return;
  }

  yield put(loadingActions.enableLoader());
  try {
    let response = yield call(
      addDeliveryNoteAPI,
      action.params,
      storeCode,
      userToken,
    );

    // let response;
    // if (userToken.length > 0) {
    //   response = yield call(
    //     getPaymentUrlLoggedUserAPI,
    //     action.params,
    //     storeCode,
    //     userToken
    //   );
    // } else {
    //   response = yield call(
    //     getPaymentUrlGuestUserAPI,
    //     action.params,
    //     storeCode,
    //     guestToken,
    //     adminToken
    //   );
    // }

    console.log('ADD DELIVERY NOTE RESPONSE---', response);
    yield put(loadingActions.disableLoader({}));

    yield put(
      checkoutActions.updateDeliveryNote(
        'ddddd ceejowefwkfwef wfkwneofweofnwef fkwnfownefnwefkwefe wfkwofwofweofnownfwf wefnwefowjfwefwe fwefnowefiwefwf wefwnfeowenfe',
      ),
    );

    // if (response && response.length > 1 && response[0] === true) {
    //   let dict = response[1];
    //   if (action.paymentURLCallback) action.paymentURLCallback(dict);
    // }
    // if (
    //   response &&
    //   response.length > 0 &&
    //   response[0].error &&
    //   response[0].errorCode === "QUOTEERROR"
    // ) {
    //   let message = response[0].error_desc;
    //   showSingleAlert(message);
    //   if (action.paymentURLCallback) action.paymentURLCallback(null);
    // } else {
    //   if (action.paymentURLCallback) action.paymentURLCallback(null);
    // }
  } catch (error) {
    showSingleAlert(translate('API_Failed'));
    console.log('API ERROR!!!!', error);
    yield put(loadingActions.disableLoader({}));
  }
}

export function* getRetryPaymentURLSaga(action) {
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
        getRetryPaymentUrlLoggedUserAPI,
        action.params,
        storeCode,
        userToken,
      );
    }

    console.log('GET RETRY PAYMENT URL RESPONSE---', response);
    yield put(loadingActions.disableLoader({}));

    if (response && response.length > 0 && response[0].status) {
      let dict = response[0];
      if (action.paymentURLCallback) action.paymentURLCallback(dict);
    } else {
      if (action.paymentURLCallback) action.paymentURLCallback(null);
    }
  } catch (error) {
    showSingleAlert(translate('API_Failed'));
    console.log('API ERROR!!!! - GET PAYMENT URL', error);
    yield put(loadingActions.disableLoader({}));
  }
}

export function* placeOrderPaymentRetrySaga(action) {
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
        placeOrderPaymentReTryLoggedUserAPI,
        action.params,
        storeCode,
        userToken,
      );
    }

    console.log('RETRY PLACE ORDER BY PAYMENT RESPONSE---', response);

    yield put(loadingActions.disableLoader({}));

    if (response && response.length > 0 && response[0].entity_id) {
      if (action.paymentOrderPlacedCallback) {
        action.paymentOrderPlacedCallback(true, response[0].entity_id);
      }
    } else if (response && response.length > 0 && response[0].error) {
      showSingleAlert(response[0].error_desc);
      yield put(loadingActions.disableLoader({}));
    } else {
      yield put(loadingActions.disableLoader({}));
      showSingleAlert(translate('API_Failed'));
    }
  } catch (error) {
    showSingleAlert(translate('API_Failed'));
    console.log('API ERROR!!!! - PLACE ORDER PAYMENT', error);
    yield put(loadingActions.disableLoader({}));
  }
}

export function* getRetryPaymentOptionsSaga(action) {
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
        getRetryPaymentOptionsAPI,
        action.params,
        storeCode,
        userToken,
      );
    }

    console.log('GET RETRY PAYMENT OPTIONS RESPONSE---', response);

    yield put(loadingActions.disableLoader({}));

    if (response && response.length > 0 && !response[0].error) {
      if (action.callback) {
        action.callback(true, response[0].methods.PaymentMethods);
      }
    } else if (response && response.length > 0 && response[0].error) {
      showSingleAlert(response[0].error_desc);
      yield put(loadingActions.disableLoader({}));
    } else {
      yield put(loadingActions.disableLoader({}));
      showSingleAlert(translate('API_Failed'));
    }
  } catch (error) {
    showSingleAlert(translate('API_Failed'));
    console.log('API ERROR!!!! - PLACE ORDER PAYMENT', error);
    yield put(loadingActions.disableLoader({}));
  }
}

export function* retainCartSaga(action) {
  const {
    isNetworkAvailable,
    userToken,
    storeCode,
    adminToken,
    guestToken,
    quoteId,
  } = yield select(state => state.appReducer);

  if (!isNetworkAvailable) {
    showSingleAlert(translate('No internet connection'));
    return;
  }

  yield put(loadingActions.enableLoader());
  try {
    let response;
    if (userToken.length > 0) {
      response = yield call(retainCartLoggedUserAPI, {}, storeCode, userToken);
    } else {
      response = yield call(
        retainCartGuestUserAPI,
        action.params,
        storeCode,
        adminToken,
      );
    }

    console.log('RETAIN CART RESPONSE---', response);

    yield put(loadingActions.disableLoader({}));

    if (response && response.length > 0 && response[0].error) {
      if (action.callback) {
        action.callback(false, response[0].errorData);
      }
    } else if (response && response.length > 0 && response[0].quote_id) {
      if (userToken.length > 0) {
        yield put(loginActions.updateCartId(response[0].quote_id));
      } else {
        yield put(
          guestActions.onCreateGuestCart(
            response[0].quote_token,
            response[0].quote_id,
          ),
        );
      }

      if (action.callback) {
        action.callback(true, response[0].errorData);
      }
    } else {
      showSingleAlert(translate('API_Failed'));
    }

    // if (response && response.length > 0 && !response[0].error) {
    //   if (action.callback) {
    //     action.callback(true, response[0].methods.PaymentMethods);
    //   }
    // } else if (response && response.length > 0 && response[0].error) {
    //   showSingleAlert(response[0].error_desc);
    //   yield put(loadingActions.disableLoader({}));
    // } else {
    //   yield put(loadingActions.disableLoader({}));
    //   showSingleAlert(translate("API_Failed"));
    // }
  } catch (error) {
    showSingleAlert(translate('API_Failed'));
    console.log('API ERROR!!!! - PLACE ORDER PAYMENT', error);
    yield put(loadingActions.disableLoader({}));
  }
}

export function* myFatoorahCreateSessionSaga(action) {
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
        myFatoorahCreateLoggedinUserSession,
        action.params,
        storeCode,
        userToken,
      );
      console.log('RESPONSE OF CREATE LOGGED IN USER SESSION', response);
    } else {
      response = yield call(
        myFatoorahCreateGuestSession,
        action.params,
        storeCode,
        adminToken,
      );
      console.log('RESPONSE OF CREATE MYFATOORAH GUEST SESSION ', response);
    }

    if (response && response.length > 0) {
      let dict = response[0];
      yield put(loadingActions.disableLoader({}));
      if (action.callback) action.callback(true, dict);
    } else {
      yield put(loadingActions.disableLoader({}));
      showSingleAlert(translate('API_Failed'));
    }

    if (
      response &&
      response.length > 0 &&
      response[0].error &&
      response[0].errorCode === 'QUOTEERROR'
    ) {
      let message = response[0].error_desc;
      // showSingleAlert(message);

      if (userToken.length > 0) {
        showSingleAlert(
          translate(
            'Order is pending, please got to order history and confirm',
          ),
        );
      } else {
        showSingleAlert(translate('guest order cancel message'));
      }

      if (action.callback) action.callback({isCartError: true});
      if (userToken.length > 0) {
        yield put(cartActions.updateCartProducts([]));
        const cartIDResponse = yield call(getCartID, userToken, storeCode);
        console.log('GET CARTID RESPONSE --- ', cartIDResponse);

        yield put(loadingActions.disableLoader({}));
        if (cartIDResponse && cartIDResponse.message) {
          console.log(
            'CART LIST ID RESPONSE ERROR::: ',
            cartIDResponse.message,
          );
        } else {
          yield put(loginActions.updateCartId(cartIDResponse));
          console.log('CART LIST ID RESPONSE::: ', cartIDResponse);
        }
      } else {
        yield put(loadingActions.disableLoader({}));

        yield put(guestActions.updateCartList([]));
        yield put(guestActions.clearQuoteId());
      }
    } else if (response.message) {
      showSingleAlert(response.message);
    } else {
      if (action.callback) action.callback(null);
    }
  } catch (error) {
    console.log('API ERROR!!!!', error);
    yield put(cartActions.cartProductsCallFailed());
    yield put(loadingActions.disableLoader({}));
  }
}

export function* myFatoorahProcessSessionSaga(action) {
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
        myFatoorahProcessLoggedinUserSession,
        action.params,
        storeCode,
        userToken,
      );
    } else {
      response = yield call(
        myFatoorahProcessGuestSession,
        action.params,
        storeCode,
        adminToken,
      );
    }
    console.log('RESPONSE OF PROCESS SESSION', response);
    yield put(loadingActions.disableLoader({}));

    if (response && response.length > 0 && response[0].status) {
      let dict = response[0];
      if (action.callback) action.callback(true, dict);

      if (userToken.length > 0) {
        yield put(cartActions.updateCartProducts([]));
        const cartIDResponse = yield call(getCartID, userToken, storeCode);
        console.log('GET CARTID RESPONSE --- ', cartIDResponse);

        yield put(loadingActions.disableLoader({}));
        if (cartIDResponse && cartIDResponse.message) {
          console.log(
            'CART LIST ID RESPONSE ERROR::: ',
            cartIDResponse.message,
          );
        } else {
          yield put(loginActions.updateCartId(cartIDResponse));
          console.log('CART LIST ID RESPONSE::: ', cartIDResponse);
        }
      } else {
        yield put(loadingActions.disableLoader({}));
        yield put(guestActions.updateCartList([]));
        yield put(guestActions.clearQuoteId());
      }
    }
    if (
      response &&
      response.length > 0 &&
      response[0].error &&
      response[0].errorCode === 'QUOTEERROR'
    ) {
      let message = response[0].error_desc;
      // showSingleAlert(message);

      if (userToken.length > 0) {
        showSingleAlert(
          translate(
            'Order is pending, please got to order history and confirm',
          ),
        );
      } else {
        showSingleAlert(translate('guest order cancel message'));
      }

      if (action.callback) action.callback({isCartError: true});
      if (userToken.length > 0) {
        yield put(cartActions.updateCartProducts([]));
        const cartIDResponse = yield call(getCartID, userToken, storeCode);
        console.log('GET CARTID RESPONSE --- ', cartIDResponse);

        yield put(loadingActions.disableLoader({}));
        if (cartIDResponse && cartIDResponse.message) {
          console.log(
            'CART LIST ID RESPONSE ERROR::: ',
            cartIDResponse.message,
          );
        } else {
          yield put(loginActions.updateCartId(cartIDResponse));
          console.log('CART LIST ID RESPONSE::: ', cartIDResponse);
        }
      } else {
        yield put(loadingActions.disableLoader({}));

        yield put(guestActions.updateCartList([]));
        yield put(guestActions.clearQuoteId());
      }
    } else if (response.message) {
      showSingleAlert(response.message);
    } else {
      console.log('ERR IN API');
      if (action.callback) action.callback(null);
    }
  } catch (error) {
    console.log('API ERROR!!!!', error);
    yield put(cartActions.cartProductsCallFailed());
    yield put(loadingActions.disableLoader({}));
  }
}

export function* myFatoorahGetPaymentMethodsSaga(action) {
  const {
    isNetworkAvailable,
    userToken,
    storeCode,
    adminToken,
    guestToken,
    selectedLanguage,
  } = yield select(state => state.appReducer);
  const {cartID} = yield select(state => state.loginReducer);

  if (!isNetworkAvailable) {
    showSingleAlert(translate('No internet connection'));
    return;
  }

  yield put(loadingActions.enableLoader());
  try {
    let response;

    response = yield call(
      myFatoorahGetPaymentMethods,
      action.params,
      storeCode,
      userToken,
    );

    console.log('MY FATOORAH PAYMENT METHODS', response);
    if (response && response.length > 0) {
      let dict = response[1];
      if (dict.error) {
        yield put(loadingActions.disableLoader({}));
        showSingleAlert(dict.message);
      } else {
        yield put(loadingActions.disableLoader({}));

        if (action.callback) action.callback(true, dict);
      }
    } else {
      yield put(loadingActions.disableLoader({}));
      showSingleAlert(translate('API_Failed'));
    }
  } catch (error) {
    showSingleAlert(translate('API_Failed'));
    console.log('API ERROR!!!! - GET PAYMENT METHODS', error);
    yield put(loadingActions.disableLoader({}));
  }
}

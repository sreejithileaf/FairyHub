/**
 * Created by Jebin for iLeaf Solutions Pvt.Ltd
 * on March 19, 2020
 * CheckOut Actions - actions for checkout products
 */

import * as types from './types';

export function setShipmentInfo(params, orderPlacedCallback) {
  return {
    type: types.SET_SHIPMENT_INFO,
    params,
    orderPlacedCallback,
  };
}

export function applyVoucher(voucherCode, apllyCodeCallback) {
  return {
    type: types.APPLY_VOUCHER_CODE,
    voucherCode,
    apllyCodeCallback,
  };
}

export function removeAppliedVoucher(removeAppliedVoucherCallback) {
  return {
    type: types.REMOVE_VOUCHER_CODE,
    removeAppliedVoucherCallback,
  };
}

export function getPaymentAndShippingMethods(
  getPaymentAndShippingMethodsCallback,
) {
  return {
    type: types.GET_PAYMENT_AND_SHIPPING_METHODS,
    getPaymentAndShippingMethodsCallback,
  };
}

export function getDeliveryTimeAndDate(getDeliveryDateCallback) {
  return {
    type: types.GET_DELIVERY_DATE,
    getDeliveryDateCallback,
  };
}

export function placeOrderWithCOD(codDict, orderPlacedCallback) {
  return {
    type: types.PLACE_ORDER_COD,
    codDict,
    orderPlacedCallback,
  };
}

export function getPaymentCollectMethods(params, collectionMethodsCallback) {
  return {
    type: types.GET_COLLECTION_METHODS,
    params,
    collectionMethodsCallback,
  };
}

export function getPaymentURL(params, paymentURLCallback) {
  return {
    type: types.GET_PAYMENT_URL,
    params,
    paymentURLCallback,
  };
}

export function getPaymentFailedInfo(params, callback) {
  return {
    type: types.GET_PAYMENT_FAILED_INFO,
    params,
    callback,
  };
}

export function addDeliveryNote(params, callback) {
  return {
    type: types.ADD_DELIVERY_NOTE,
    params,
    callback,
  };
}

export function updateDeliveryNote(deliveryNote) {
  return {
    type: types.UPDATE_DELIVERY_NOTE,
    deliveryNote,
  };
}

export function placeOrderWithPayment(
  params,
  isCardPayment,
  paymentOrderPlacedCallback,
) {
  return {
    type: types.PAYMENT_PLACE_ORDER,
    params,
    isCardPayment,
    paymentOrderPlacedCallback,
  };
}

export function getRetryPaymentURL(params, paymentURLCallback) {
  return {
    type: types.GET_RE_TRY_PAYMENT_URL,
    params,
    paymentURLCallback,
  };
}

export function placeOrderWithPaymentReTry(params, paymentOrderPlacedCallback) {
  return {
    type: types.PAYMENT_PLACE_ORDER_RETRY,
    params,
    paymentOrderPlacedCallback,
  };
}

export function getRetryPaymentOptions(params, callback) {
  return {
    type: types.GET_RETRY_PAYMENT_OPTIONS,
    params,
    callback,
  };
}

export function retainCart(params, callback) {
  return {
    type: types.RETAIN_CART,
    params,
    callback,
  };
}

export function createMyFatoorahSession(params, callback) {
  return {
    type: types.MY_FATOORAH_CREATE_SESSION,
    params,
    callback,
  };
}

export function processMyFatoorahSession(params, callback) {
  return {
    type: types.MY_FATOORAH_PROCESS_SESSION,
    params,
    callback,
  };
}

export function myFatoorahGetPaymentMethods(params, callback) {
  return {
    type: types.MY_FATOORAH_GET_PAYMENT_METHODS,
    params,
    callback,
  };
}

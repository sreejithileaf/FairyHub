/**
 * Created by Jebin for iLeaf Solutions Pvt.Ltd
 * on February 18, 2020
 * History Actions -  Actions for History data updations
 */

import * as types from "./types";

export function getOrderHistory(params, callback) {
  return {
    type: types.GET_ORDER_HISTORY,
    params,
    callback,
  };
}

export function getOrderDetail(orderId, callback) {
  return {
    type: types.GET_ORDER_DETAIL,
    orderId,
    callback,
  };
}

export function orderRefund(params, callback) {
  return {
    type: types.ORDER_REFUND,
    params,
    callback,
  };
}

export function reOrderItems(params, callback) {
  return {
    type: types.RE_ORDER_ITEMS,
    params,
    callback,
  };
}

export function getOrderTrackingHistory(params, callback) {
  return {
    type: types.GET_ORDER_TRACKING,
    params,
    callback,
  };
}

/**
 * Created by Jebin for iLeaf Solutions Pvt.Ltd
 * on February 20, 2020
 * CategoryActions - actions for category related operations
 */

import * as types from "./types";

export function addAddressRequest(params, addAddressCallback) {
  return {
    type: types.ADD_ADDRESS_REQUEST,
    params,
    addAddressCallback,
  };
}

export function addAddressResponse(response) {
  return {
    type: types.ADD_ADDRESS_RESPONSE,
    response,
  };
}

export function editAddressRequest(params, editAddressCallback) {
  return {
    type: types.EDIT_ADDRESS_REQUEST,
    params,
    editAddressCallback,
  };
}

export function updateAddress(address) {
  return {
    type: types.UPDATE_ADDRESS,
    address,
  };
}

export function addAddressFailed() {
  return {
    type: types.ADD_ADDRESS_FAILED,
    response,
  };
}

export function deleteAddress(addressId, addressIndex) {
  return {
    type: types.DELETE_ADDRESS,
    addressId,
    addressIndex,
  };
}

export function guestAddAddressRequest(params) {
  return {
    type: types.GUEST_ADD_ADDRESS_REQUEST,
    params,
  };
}

export function guestEditAddressRequest(params) {
  return {
    type: types.GUEST_EDIT_ADDRESS_REQUEST,
    params,
  };
}

export function getAvailableRegions(callback) {
  return {
    type: types.GET_AVAILABLE_REGIONS,
    callback,
  };
}

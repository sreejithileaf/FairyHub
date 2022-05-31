/**
 * Created by Arun for iLeaf Solutions Pvt.Ltd
 * on March 16, 2020
 * CartActions - actions for category related operations
 */

import * as types from "./types";

export function getProuctsInCart(callback) {
  return {
    type: types.GET_PRODUCTS_IN_CART,
    callback,
  };
}

export function addProductToCartLoggedUser(params, isAllItems, callback) {
  return {
    type: types.ADD_PRODUCT_TO_CART_LOGGEDUSER,
    params,
    isAllItems,
    callback,
  };
}

export function cartProductsCallFailed() {
  return {
    type: types.GET_PRODUCTS_IN_CART_FAILED,
  };
}

export function updateCartProducts(product) {
  let cartAddOns = [];
  let cartArray = [];

  product.map((item) => {
    if (item.extension_attributes.addons) {
      cartAddOns.push(item);
    } else {
      cartArray.push(item);
    }
  });

  return {
    type: types.UPDATE_CART_PRODUCT_LIST,
    cartArray,
    cartAddOns,
  };
}

export function updateGuestCartProducts(product) {
  let cartAddOns = [];
  let cartArray = [];

  product.map((item) => {
    if (item.extension_attributes.addons) {
      cartAddOns.push(item);
    } else {
      cartArray.push(item);
    }
  });
  return {
    type: types.UPDATE_GUEST_CART_PRODUCT_LIST,
    cartArray,
    cartAddOns,
  };
}

export function removeProductFromCart() {
  return {
    type: types.REMOVE_PRODUCT_FROM_CART,
    response,
  };
}

export function addProductFromCartToWishList(
  entityId,
  productId,
  addProductToWishListCallback
) {
  return {
    type: types.ADD_CART_PRODUCT_TO_WISHLIST,
    entityId,
    productId,
    addProductToWishListCallback,
  };
}

export function updateGuestCart(
  productid,
  updateGuestCartCallback,
  params,
  index
) {
  return {
    type: types.UPDATE_GUEST_CART,
    productid,
    updateGuestCartCallback,
    params,
    index,
  };
}

export function updateUserCart(params, updateCallback, productid) {
  return {
    type: types.UPDATE_USER_CART,
    params,
    updateCallback,
    productid,
  };
}

export function removeGuestCart(productid, removeGuestCartCallback, index) {
  return {
    type: types.REMOVE_GUEST_CART,
    productid,
    removeGuestCartCallback,
    index,
  };
}

export function removeUserCart(productid, removeUserCartCallback) {
  return {
    type: types.REMOVE_USER_CART,
    productid,
    removeUserCartCallback,
  };
}

export function getTotalCost(getTotalCostCallback) {
  return {
    type: types.GET_TOTAL_CART_COST,
    getTotalCostCallback,
  };
}

export function updateCartDateAndTime(cartDict) {
  return {
    type: types.UPDATE_CART_DATE_TIME,
    cartDict,
  };
}

export function getAvailableAddOns(params, callback) {
  return {
    type: types.GET_AVAILABLE_ADD_ONS,
    params,
    callback,
  };
}

export function getMoreAddOns(params, callback) {
  return {
    type: types.GET_MORE_ADD_ONS,
    params,
    callback,
  };
}

export function updateAvailableBalloons(availableBalloons) {
  return {
    type: types.UPDATE_AVAILABLE_BALLOONS,
    availableBalloons,
  };
}

export function updateAvailableGiftWraps(availableGiftwraps) {
  return {
    type: types.UPDATE_AVAILABLE_GIFT_WRAP,
    availableGiftwraps,
  };
}

export function addAddOns(params, callback) {
  return {
    type: types.ADD_ADD_ONS,
    params,
    callback,
  };
}

export function updateCarttotals(cartTotals) {
  return {
    type: types.UPDATE_CART_TOTALS,
    cartTotals,
  };
}

export function addExtraProductsToCart(params, callback) {
  return {
    type: types.ADD_EXTRA_PRODUCTS_TO_CART,
    params,
    callback,
  };
}

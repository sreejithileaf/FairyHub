/**
 * Created by Jebin for iLeaf Solutions Pvt.Ltd
 * on March 02, 2020
 * ProductsActions - Actions for products listing
 */

import * as types from "./types";

export function getProductsList(pageIndex, pageCount, getProductListCallback) {
  return {
    type: types.GET_PRODUCTS_LIST,
    pageIndex,
    pageCount,
    getProductListCallback,
  };
}

export function getCategoryProductsList(
  pageIndex,
  pageCount,
  categoryType,
  categoryId,
  filterParams,
  getCategoryProductsListCallback,
  fromHome
) {
  return {
    type: types.GET_CATEGORY_PRODUCTS_LIST,
    pageIndex,
    pageCount,
    categoryType,
    categoryId,
    filterParams,
    getCategoryProductsListCallback,
    fromHome,
  };
}

export function getProductDetail(productId, productDetailsCallback) {
  return {
    type: types.GET_PRODUCT_DETAIL,
    productId,
    productDetailsCallback,
  };
}

export function getProductDetailWithURLKey(urlKey, productDetailsCallback) {
  return {
    type: types.GET_PRODUCT_DETAIL_WITH_URL_KEY,
    urlKey,
    productDetailsCallback,
  };
}

export function getRelatedProductDetail(
  productId,
  relatedproductDetailsCallback
) {
  return {
    type: types.GET_RELATED_PRODUCT_DETAIL,
    productId,
    relatedproductDetailsCallback,
  };
}

export function getBoughtTogetherProducts(
  productId,
  getBoughtTogetherProductsCallback
) {
  return {
    type: types.GET_BOUGHT_TOGETHER_PRODUCTS,
    productId,
    getBoughtTogetherProductsCallback,
  };
}

export function updateProductDetails(productDetailsDict) {
  return {
    type: types.UPDATE_PRODUCT_DETAIL,
    productDetailsDict,
  };
}

export function updateCategoryProductList(categoryProductList, categoryType) {
  return {
    type: types.UPDATE_CATEGORY_PRODUCTS_LIST,
    categoryProductList,
    categoryType,
  };
}

export function updateCategoryProductListFromCategory(
  categoryProductList,
  categoryType
) {
  return {
    type: types.UPDATE_CATEGORY_PRODUCTS_LIST_FROM_CATEGORY,
    categoryProductList,
    categoryType,
  };
}

export function clearCategoryProducts() {
  return {
    type: types.CLEAR_CATEGORY_PRODUCTS_LIST,
  };
}

export function clearCategoryProductsFromCategory() {
  return {
    type: types.CLEAR_CATEGORY_PRODUCTS_LIST_FROM_CATEGORY,
  };
}

// export function getDegreeImage() {
//   alert('productId');
//   return {
//     type: types.GET_ROTTATION_IMGAGES_ARRAY,
//   };
// }

export function get360Images(productId, callback) {
  return {
    type: types.GET_ROTTATION_IMGAGES_ARRAY,
    productId,
    callback,
  };
}

export function addToRecentlyViewed(productDict) {
  return {
    type: types.ADD_RECENTLY_VIEWED,
    productDict,
  };
}

export function postUserReview(reviewDict, reviewAddCallback) {
  return {
    type: types.ADD_REVIEW,
    reviewDict,
    reviewAddCallback,
  };
}

export function getUserReviews(skuId, callback) {
  return {
    type: types.GET_REVIEW,
    skuId,
    callback,
  };
}

export function updateUserRevews(reviewList) {
  return {
    type: types.UPDATE_REVIEW,
    reviewList,
  };
}

export function notifyMe(params, callback) {
  return {
    type: types.NOTIFY_ME,
    params,
    callback,
  };
}

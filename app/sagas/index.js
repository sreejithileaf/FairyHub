/**
 * Created by Jebin for iLeaf Solutions Pvt.Ltd
 * on February 12, 2020
 * Sagas -  Redux saga class init.
 */

import {
  addAddressSaga,
  editAddressSaga,
  deleteAddressSaga,
  getAllRegionsSaga,
} from './addAddressSaga';
import {
  getUserSaga,
  loginUserSaga,
  profileUpdateSaga,
  passwordUpdateSaga,
  submitFeedbackSaga,
  addWishlistItemSaga,
  removeWishlistItemSaga,
  socialMediaLoginSaga,
  forgotPasswordSaga,
  updateUserTokenSaga,
  addEmailReminderSaga,
  getAllEmailReminderSaga,
  deleteEmailReminderSaga,
} from './loginSaga';
import {
  getCartSaga,
  addProductToCartSaga,
  getTotalCartCostSaga,
  getLoggedUserCartIdSaga,
  updateCartDateTimeSaga,
  getAvailableAddOnsSaga,
  addAddOnsSaga,
  getMoreAddOnsSaga,
  addExtraProductsToCartSaga,
} from './cartSaga';
import {
  get360ImagesSaga,
  getProductsListSaga,
  getProductDetailSaga,
  getProductDetailURLKEYSaga,
  getRealtedProductDetailSaga,
  getCategoryProductsListSaga,
  addUserReviewSaga,
  getUserReviewSaga,
  notifyMeSaga,
  getBoughtTogetherSaga,
} from './productsSaga';
import {
  removeProductUserCart,
  removeProductGuestCart,
} from './removeCartProducts';
import {
  setShipmentSaga,
  applyVoucherCodeSaga,
  removeVoucherCodeSaga,
  getPaymentAndShipmentMethodsSaga,
  getDeliveryDateAndTimeSaga,
  placeOrderCODSaga,
  getCollectionMethodsSaga,
  getPaymentURLSaga,
  getRetryPaymentURLSaga,
  placeOrderPaymentSaga,
  placeOrderPaymentRetrySaga,
  getPaymentFailedInfoSaga,
  addDeliveryNoteSaga,
  getRetryPaymentOptionsSaga,
  retainCartSaga,
  myFatoorahCreateSessionSaga,
  myFatoorahProcessSessionSaga,
  myFatoorahGetPaymentMethodsSaga,
} from './checkoutSaga';
import * as types from '../actions/types';
import {getStoresSaga} from './storeSaga';
import {
  getHomeDetails,
  getHomeadds,
  getPromotionCategoriesSaga,
  getPromotionProductsSaga,
  getStatusDataSaga,
} from './homeSaga';
import {registerUserSaga} from './registerSaga';

import {
  getOrderHistory,
  getOrderDetailSaga,
  orderRefundSaga,
  reOrderSaga,
  getOrderTrackingHistory,
} from './orderHistorySaga';




import {getFilterDetails} from './getAllFiltersSaga';
import {getFilterProducts} from './filterResultSaga';
import {getAllCategoriesSaga, getSubCategoriesSaga} from './categoriesSaga';
import {
  getProductsBySearchTextSaga,
  getTopSearches,
  getProductsBySearchResultTextSaga,
} from './searchSaga';
import {takeEvery, all, takeLatest} from 'redux-saga/effects';
import {addWishlistFromCartSaga} from './addWishlistFromCartSaga';
import {
  createGuestCartSaga,
  guestAddToCartSaga,
  checkGuestSessionSaga,
} from './guestSaga';
import {updateLoggedinUserCart, updateGuestCart} from './updateCartProducts';

export default function* watch() {
  yield all([
    takeLatest(types.LOGIN_REQUEST, loginUserSaga),
    takeLatest(types.SOCIAL_MEDIA_LOGIN_REQUEST, socialMediaLoginSaga),
    takeLatest(types.USER_DATA_REQUEST, getUserSaga),
    takeLatest(types.RENEW_USER_TOKEN, updateUserTokenSaga),
    takeLatest(types.FORGOT_PASSWORD_REQUEST, forgotPasswordSaga),
    takeLatest(types.GET_ALL_CATEGORIES, getAllCategoriesSaga),
    takeLatest(types.SEARCH_TEXT_CHANGE, getProductsBySearchTextSaga),
    takeLatest(types.REGISTER_REQUEST, registerUserSaga),
    takeLatest(types.GET_STORES, getStoresSaga),
    takeLatest(types.GET_HOME_REQUEST, getHomeDetails),
    takeLatest(types.GET_HOME_ADD_REQUEST, getHomeadds),
    takeLatest(types.GET_PRODUCTS_LIST, getProductsListSaga),
    takeLatest(types.GET_PRODUCT_DETAIL, getProductDetailSaga),
    takeLatest(types.GET_RELATED_PRODUCT_DETAIL, getRealtedProductDetailSaga),
    takeLatest(types.FILTER_REQUEST, getFilterProducts),
    takeLatest(types.LOAD_FILTER_REQUEST, getFilterDetails),
    takeLatest(types.GET_CATEGORY_PRODUCTS_LIST, getCategoryProductsListSaga),
    takeLatest(types.PROFILE_UPDATE_REQUEST, profileUpdateSaga),
    takeLatest(types.PASSWORD_UPDATE_REQUEST, passwordUpdateSaga),
    takeLatest(types.CREATE_GUEST_CART, createGuestCartSaga),
    takeLatest(types.GUEST_ADD_TO_CART, guestAddToCartSaga),
    takeLatest(types.REMOVE_WISHLIST_ITEM, removeWishlistItemSaga),
    takeLatest(types.ADD_WISHLIST_ITEM, addWishlistItemSaga),
    takeLatest(types.ADD_ADDRESS_REQUEST, addAddressSaga),
    takeLatest(types.EDIT_ADDRESS_REQUEST, editAddressSaga),
    takeLatest(types.GET_PRODUCTS_IN_CART, getCartSaga),
    takeLatest(types.ADD_CART_PRODUCT_TO_WISHLIST, addWishlistFromCartSaga),
    takeLatest(types.ADD_PRODUCT_TO_CART_LOGGEDUSER, addProductToCartSaga),
    takeLatest(types.UPDATE_USER_CART, updateLoggedinUserCart),
    takeLatest(types.UPDATE_GUEST_CART, updateGuestCart),
    takeLatest(types.REMOVE_GUEST_CART, removeProductGuestCart),
    takeLatest(types.REMOVE_USER_CART, removeProductUserCart),
    takeLatest(types.SET_SHIPMENT_INFO, setShipmentSaga),
    takeLatest(types.GET_TOTAL_CART_COST, getTotalCartCostSaga),
    takeLatest(types.GET_ORDER_HISTORY, getOrderHistory), 
    takeLatest(types.GET_ROTTATION_IMGAGES_ARRAY, get360ImagesSaga),
    takeLatest(types.SUBMIT_CONTACT_US, submitFeedbackSaga),
    takeLatest(types.DELETE_ADDRESS, deleteAddressSaga),
    takeLatest(types.APPLY_VOUCHER_CODE, applyVoucherCodeSaga),
    takeEvery(
      types.GET_PAYMENT_AND_SHIPPING_METHODS,
      getPaymentAndShipmentMethodsSaga,
    ),
    takeLatest(types.GET_LOGGED_USER_CART_ID, getLoggedUserCartIdSaga),
    takeLatest(types.ADD_REVIEW, addUserReviewSaga),
    takeLatest(types.GET_REVIEW, getUserReviewSaga),
    takeLatest(types.GET_DELIVERY_DATE, getDeliveryDateAndTimeSaga),
    takeLatest(types.UPDATE_CART_DATE_TIME, updateCartDateTimeSaga),
    takeLatest(types.GET_AVAILABLE_ADD_ONS, getAvailableAddOnsSaga),
    takeLatest(types.ADD_ADD_ONS, addAddOnsSaga),
    takeLatest(types.REMOVE_VOUCHER_CODE, removeVoucherCodeSaga),
    takeLatest(types.PLACE_ORDER_COD, placeOrderCODSaga),
    takeLatest(types.GET_COLLECTION_METHODS, getCollectionMethodsSaga),
    takeLatest(types.GET_PAYMENT_URL, getPaymentURLSaga),
    takeLatest(types.PAYMENT_PLACE_ORDER, placeOrderPaymentSaga),
    takeLatest(types.GET_ORDER_DETAIL, getOrderDetailSaga),
    takeLatest(types.ORDER_REFUND, orderRefundSaga),
    takeLatest(types.NOTIFY_ME, notifyMeSaga),
    takeLatest(types.GET_TOP_SEARCHES, getTopSearches),
    takeLatest(types.ADD_EMAIL_REMINDER, addEmailReminderSaga),
    takeLatest(types.GET_EMAIL_REMINDER, getAllEmailReminderSaga),
    takeLatest(types.DELETE_EMAIL_REMINDER, deleteEmailReminderSaga),
    takeLatest(types.RE_ORDER_ITEMS, reOrderSaga),
    takeLatest(types.GET_PAYMENT_FAILED_INFO, getPaymentFailedInfoSaga),
    takeLatest(types.ADD_DELIVERY_NOTE, addDeliveryNoteSaga),
    takeLatest(types.GET_AVAILABLE_REGIONS, getAllRegionsSaga),
    takeLatest(types.CHECK_GUEST_SESSION, checkGuestSessionSaga),
    takeLatest(
      types.SEARCH_TEXT_CHANGE_RESULT,
      getProductsBySearchResultTextSaga,
    ),
    takeLatest(types.GET_PROMOTION_CATEGORIES, getPromotionCategoriesSaga),
    takeLatest(types.GET_PROMOTION_PRODUCTS, getPromotionProductsSaga),
    takeLatest(types.GET_MORE_ADD_ONS, getMoreAddOnsSaga),
    takeLatest(types.GET_RE_TRY_PAYMENT_URL, getRetryPaymentURLSaga),
    takeLatest(types.PAYMENT_PLACE_ORDER_RETRY, placeOrderPaymentRetrySaga),
    takeLatest(types.GET_RETRY_PAYMENT_OPTIONS, getRetryPaymentOptionsSaga),
    takeLatest(types.GET_STATUS_DATA, getStatusDataSaga),
    takeLatest(
      types.GET_PRODUCT_DETAIL_WITH_URL_KEY,
      getProductDetailURLKEYSaga,
    ),
    takeLatest(types.RETAIN_CART, retainCartSaga),
    takeLatest(types.GET_BOUGHT_TOGETHER_PRODUCTS, getBoughtTogetherSaga),
    takeLatest(types.ADD_EXTRA_PRODUCTS_TO_CART, addExtraProductsToCartSaga),
    takeLatest(types.GET_SUB_CATEGORY_LIST, getSubCategoriesSaga),
    takeLatest(types.MY_FATOORAH_CREATE_SESSION, myFatoorahCreateSessionSaga),
    takeLatest(types.MY_FATOORAH_PROCESS_SESSION, myFatoorahProcessSessionSaga),
    takeLatest(
      types.MY_FATOORAH_GET_PAYMENT_METHODS,
      myFatoorahGetPaymentMethodsSaga,
    ),
    takeLatest(types.GET_ORDER_TRACKING, getOrderTrackingHistory),
  ]);
}

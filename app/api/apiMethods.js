/**
 * Created by Jebin for iLeaf Solutions Pvt.Ltd
 * on February 12, 2020
 * API Methods -
 */

import ApiConstants from './apiConstants';
import Api from './index';

export function loginUser(username, password, storeCode) {
  return Api(
    ApiConstants.API_LOGIN,
    {username: username, password: password},
    'post',
    storeCode,
    null,
  );
}

export function updateUserTokenAPI(storeCode, userToken) {
  return Api(
    ApiConstants.API_UPDATE_USER_TOKEN,
    {token: userToken},
    'post',
    storeCode,
    userToken,
  );
}

export function socialMediaLogin(params) {
  return Api(ApiConstants.API_SOCIAL_MEDIA_LOGIN, params, 'post', null);
}

export function getUserInfoAPI(userToken) {
  return Api(ApiConstants.API_GET_USER_INFO, null, 'get', null, userToken);
}

export function registerUser(userInfo, storeId) {
  return Api(
    ApiConstants.API_REGISTER_USER,
    {
      customer: {
        email: userInfo.email,
        firstname: userInfo.firstName,
        lastname: userInfo.lastName,
        store_id: storeId,
        custom_attributes: [
          {
            attribute_code: 'fhmobile_number',
            value: userInfo.mobile,
          },
          {
            attribute_code: 'fhcountry_code',
            value: userInfo.countryCode,
          },
        ],
      },
      password: userInfo.password,
    },
    'post',
    null,
  );
}

export function profileUpdate(userInfo, userToken) {
  return Api(
    ApiConstants.API_GET_USER_INFO,
    {customer: userInfo},
    'put',
    null,
    userToken,
  );
}

export function forgotPassword(user_email, storeCode) {
  return Api(
    ApiConstants.API_FORGOT_PASSWORD,
    {email: user_email, template: 'email_reset', websiteId: 1},
    'put',
    storeCode,
    null,
  );
}

export function getWishlist(userToken) {
  return Api(ApiConstants.API_GET_WISHLIST, null, 'get', null, userToken);
}

export function removeWishlistItem(productId, userToken) {
  return Api(
    ApiConstants.API_REMOVE_WISHLIST_ITEM + '/' + productId,
    null,
    'post',
    null,
    userToken,
  );
}

export function addWishlistItem(productId, userToken) {
  return Api(
    ApiConstants.API_ADD_WISHLIST_ITEM + '/' + productId,
    null,
    'post',
    null,
    userToken,
  );
}

export function passwordUpdate(oldPassword, newPassword, userToken) {
  return Api(
    ApiConstants.API_PASSWORD_CHANGE,
    {currentPassword: oldPassword, newPassword: newPassword},
    'put',
    null,
    userToken,
  );
}

export function getStoresAPI(adminToken) {
  return Api(ApiConstants.API_GET_STORES, null, 'get', null, adminToken);
}

export function getStoresViewAPI(adminToken) {
  return Api(ApiConstants.API_GET_STORES_VIEW, null, 'get', null, adminToken);
}

export function getAllCategoriesAPI(adminToken, storeCode) {
  return Api(
    ApiConstants.API_GET_CATEGORIES,
    null,
    'get',
    storeCode,
    adminToken,
  );
}

export function getAllAttributesAPI(adminToken) {
  return Api(
    ApiConstants.API_GET_ALL_ATTRIBUTES,
    null,
    'get',
    null,
    adminToken,
  );
}

export function addAddressAPI(params, userToken) {
  return Api(ApiConstants.API_ADD_ADDRESS, params, 'put', null, userToken);
}

export function deleteAddressAPI(params, userToken) {
  return Api(
    ApiConstants.API_DELETE_ADDRESS + '/' + params,
    null,
    'post',
    null,
    userToken,
  );
}

export function addProductToCart(params, userToken) {
  return Api(ApiConstants.API_PRODUCT_CART, params, 'post', null, userToken);
}

export function getCartProducts(userToken) {
  return Api(
    ApiConstants.API_GET_LOGGED_USER_CART,
    null,
    'get',
    null,
    userToken,
  );
}

export function getAllRegionsAPI(storeCode, adminToken) {
  return Api(
    ApiConstants.API_GET_ALL_REGIONS,
    null,
    'get',
    storeCode,
    adminToken,
  );
}

export function getCartID(userToken, storeCode) {
  return Api(ApiConstants.API_USER_CART_ID, null, 'post', storeCode, userToken);
}

export function getStoreConfigurationAPI(adminToken) {
  return Api(
    ApiConstants.API_STORE_CONFIGURATION,
    null,
    'get',
    null,
    adminToken,
  );
}

export function getSearchProductsAPI(params, storeCode, adminToken) {
  let url = ApiConstants.API_GET_PRODUCTS + '/' + JSON.stringify(params);
  return Api(url, null, 'get', storeCode, adminToken);
}

export function getProductDetailAPI(productId, storeCode, adminToken) {
  return Api(
    ApiConstants.API_PRODUCT_DETAIL,
    {sku: productId},
    'post',
    storeCode,
    adminToken,
  );
}

export function getProductDetailUrlKeyAPI(productId, storeCode, adminToken) {
  return Api(
    ApiConstants.API_PRODUCT_DETAIL_URL_KEY,
    {urlkey: productId},
    'post',
    storeCode,
    adminToken,
  );
}

export function getRelatedProductDetailAPI(productId, storeCode, adminToken) {
  return Api(
    ApiConstants.API_RELATED_PRODUCT_DETAIL,
    {sku: productId},
    'post',
    storeCode,
    adminToken,
  );
}

export function getPromotionCategories(params, storeCode, adminToken) {
  return Api(
    ApiConstants.API_GET_PROMOTION_CATEGORIES,
    params,
    'post',
    storeCode,
    adminToken,
  );
}

export function getPromotionProducts(params, storeCode, adminToken) {
  return Api(
    ApiConstants.API_GET_PROMOTION_PRODUCTS,
    params,
    'post',
    storeCode,
    adminToken,
  );
}

export function getFilterProductDetails(filters, storeCode, adminToken) {
  return Api(
    ApiConstants.API_GET_PRODUCTS,
    filters,
    'get',
    storeCode,
    adminToken,
  );
}

export function getAllFilters(id, storeCode, adminToken) {
  return Api(ApiConstants.FILTER, id, 'get', storeCode, adminToken);
}

export function getHomePageDetails(storeCode, adminToken) {
  return Api(ApiConstants.API_HOME, null, 'get', storeCode, adminToken);
}

export function getHomePageAdds(storeCode, adminToken) {
  return Api(
    ApiConstants.API_GET_ENABLE_ADDS,
    null,
    'get',
    storeCode,
    adminToken,
  );
}

export function getCategoryProductsAPI(params, storeCode, adminToken) {
  let url =
    ApiConstants.API_GET_PRODUCTS_IN_CATEGORY + '/' + JSON.stringify(params);
  return Api(url, null, 'get', storeCode, adminToken);
}

export function createGuestCartAPI(storeCode, adminToken) {
  return Api(ApiConstants.API_GUEST_CART, null, 'post', storeCode, adminToken);
}

export function guestAddToCartAPI(params, quoteId, storeCode, adminToken) {
  return Api(
    ApiConstants.API_GUEST_CART + '/' + quoteId + '/items',
    params,
    'post',
    null,
    adminToken,
  );
}

export function updateGuestCartAPI(params, guesttoken, productID, adminToken) {
  return Api(
    ApiConstants.API_GUEST_CART + '/' + guesttoken + '/items',
    params,
    'post',
    null,
    adminToken,
  );
}
export function updateGuestProductsAPI(guesttoken, adminToken) {
  return Api(
    ApiConstants.API_GUEST_CART + '/' + guesttoken + '/items',
    null,
    'get',
    null,
    adminToken,
  );
}

export function deleteGuestCartAPI(guesttoken, productID, adminToken) {
  return Api(
    ApiConstants.API_DELETE_FROM_CART_GUEST_USER,
    {quote_id: guesttoken, item_id: productID},
    'post',
    null,
    adminToken,
  );
}
export function deleteCartAPI(productID, userToken) {
  return Api(
    ApiConstants.API_DELETE_FROM_CART_LOGGED_USER,
    {item_id: productID},
    'post',
    null,
    userToken,
  );
}

export function updateLoggedUserCartAPI(params, productid, userToken) {
  return Api(ApiConstants.API_PRODUCT_CART, params, 'post', null, userToken);

  return Api(ApiConstants.API_PRODUCT_CART, params, 'post', null, userToken);
}

export function getGuestquoteIdAPI(guestToken, storeCode, adminToken) {
  return Api(
    ApiConstants.API_GUEST_CART + '/' + guestToken,
    null,
    'get',
    storeCode,
    adminToken,
  );
}

export function get360DegreeImagesAPI(productId, storeCode, adminToken) {
  return Api(
    ApiConstants.API_PRODUCT_360_IMAGES,
    productId,
    'get',
    storeCode,
    adminToken,
  );
}

export function setShipmentGuestAPI(params, storeCode, guestToken, adminToken) {
  return Api(
    '/guest-carts/' + guestToken + '/shipping-information',
    params,
    'post',
    storeCode,
    adminToken,
  );
}

export function setShipmentLoggedUserAPI(params, storeCode, userToken) {
  return Api(
    '/carts/mine/shipping-information',
    params,
    'post',
    storeCode,
    userToken,
  );
}

export function placeOrderGuestAPI(params, storeCode, guestToken, adminToken) {
  return Api(
    '/guest-carts/' + guestToken + '/order',
    params,
    'put',
    storeCode,
    adminToken,
  );
}

export function placeOrderLoggedUserAPI(params, storeCode, userToken) {
  return Api('/carts/mine/order', params, 'put', storeCode, userToken);
}

export function getLoggedUserCartTotalCostAPI(storeCode, userToken) {
  return Api('/carts/mine/totals', null, 'get', storeCode, userToken);
}

export function getGuestCartTotalCostAPI(storeCode, guestToken, adminToken) {
  return Api(
    '/guest-carts/' + guestToken + '/totals',
    null,
    'get',
    storeCode,
    adminToken,
  );
}

export function getOrderHistoryApi(params, userToken) {
  return Api(ApiConstants.API_PRODUCT_HISTORY, params, 'get', null, userToken);
}

export function getOrderTrackingApi(params,userToken) {
  return Api(ApiConstants.API_ORDER_TRACKING, params, 'post', null,userToken);
}

export function getOrderDetailApi(orderId, userToken) {
  return Api(
    ApiConstants.API_PRODUCT_HISTORY + '/' + orderId,
    null,
    'get',
    null,
    userToken,
  );
}

export function submitFeedback(
  firstName,
  lastName,
  email,
  mobile,
  reason,
  message,
) {
  return Api(
    ApiConstants.API_CONTACT_US,
    {
      first_name: firstName,
      last_name: lastName,
      email: email,
      phonenumber: mobile,
      message: message,
      reason: reason,
    },
    'post',
    null,
    null,
  );
}

export function applyVoucherCodeLoggedUserAPI(
  voucherCode,
  storeCode,
  userToken,
) {
  return Api(
    '/carts/mine/coupons/' + voucherCode,
    null,
    'put',
    storeCode,
    userToken,
  );
}

export function applyVoucherCodeGuestAPI(
  voucherCode,
  storeCode,
  guestToken,
  adminToken,
) {
  return Api(
    '/guest-carts/' + guestToken + '/coupons/' + voucherCode,
    null,
    'put',
    storeCode,
    '', //adminToken
  );
}

export function removeVoucherCodeLoggedUserAPI(storeCode, userToken) {
  return Api(
    ApiConstants.API_REMOVE_VOUCHER,
    null,
    'delete',
    storeCode,
    userToken,
  );
}

export function removeVoucherCodeGuestAPI(storeCode, guestToken, adminToken) {
  return Api(
    '/guest-carts/' + guestToken + '/coupons',
    null,
    'delete',
    storeCode,
    adminToken,
  );
}

export function getPaymentMethodsLoggedUserAPI(storeCode, userToken) {
  return Api('/carts/mine/payment-methods', null, 'get', storeCode, userToken);
}

export function getPaymentMethodsGuestAPI(storeCode, guestToken, adminToken) {
  return Api(
    '/guest-carts/' + guestToken + '/payment-methods/',
    null,
    'get',
    storeCode,
    adminToken,
  );
}

export function getShipmentMethodsLoggedUserAPI(storeCode, userToken) {
  return Api('/carts/mine/shipping-methods', null, 'get', storeCode, userToken);
}

export function getShipmentMethodsGuestAPI(storeCode, guestToken, adminToken) {
  return Api(
    '/guest-carts/' + guestToken + '/shipping-methods/',
    null,
    'get',
    storeCode,
    adminToken,
  );
}

export function addUserReviews(reviewDict, storeCode, adminToken) {
  return Api(
    ApiConstants.API_POST_REVIEW,
    reviewDict,
    'post',
    storeCode,
    adminToken,
  );
}

export function getUserReviews(sku, storeCode, adminToken) {
  return Api(
    '/products/' + sku + '/reviews',
    null,
    'get',
    storeCode,
    adminToken,
  );
}

export function getDeliveryDateAndTime() {
  return Api(ApiConstants.API_GET_DELIVERY_DATE_AND_TIME, null, 'get', null);
}

export function updateCartItemApi(cartDict, userToken) {
  return Api(
    ApiConstants.API_UPDATE_CART_ITEM_LOGGED_USER,
    cartDict,
    'post',
    null,
    userToken,
  );
}

export function updateGuestCartItemApi(cartDict, guestToken, adminToken) {
  return Api(
    ApiConstants.API_UPDATE_CART_ITEM_GUEST,
    cartDict,
    'post',
    null,
    adminToken,
  );
}

export function getAvailableAddOnsAPI(params, storeCode, adminToken) {
  return Api(
    ApiConstants.API_GET_AVAILABLE_ADD_ONS,
    params,
    'post',
    storeCode,
    adminToken,
  );
}

export function addAddOnLoginedUserAPI(params, storeCode, userToken) {
  return Api(
    ApiConstants.API_ADD_ADD_ONS_LOGIN_USER,
    params,
    'post',
    storeCode,
    userToken,
  );
}

export function addAddOnGuestUserAPI(
  params,
  storeCode,
  guestToken,
  adminToken,
) {
  return Api(
    ApiConstants.API_ADD_ADD_ONS_GUEST_USER,
    params,
    'post',
    storeCode,
    adminToken,
  );
}

export function getMoreAddOnsAPI(params, storeCode, adminToken) {
  return Api(
    ApiConstants.API_GET_MORE_ADD_ONS,
    params,
    'post',
    storeCode,
    adminToken,
  );
}

export function placeOrderCODLoggedUserAPI(params, storeCode, userToken) {
  return Api(
    ApiConstants.API_PLACE_COD_ORDER,
    params,
    'post',
    storeCode,
    userToken,
  );
}

export function placeOrderCODGuestUserAPI(
  params,
  storeCode,
  guestToken,
  adminToken,
) {
  return Api(
    //"/guest-carts/" + guestToken + "/order",
    ApiConstants.API_PLACE_COD_ORDER_GUEST,
    params,
    'post',
    storeCode,
    adminToken,
  );
}

export function placeOrderPaymentLoggedUserAPI(params, storeCode, userToken) {
  return Api(
    ApiConstants.API_PROCESS_ORDER_LOGGED_USER,
    params,
    'post',
    storeCode,
    userToken,
  );
}

export function placeOrderPaymentReTryLoggedUserAPI(
  params,
  storeCode,
  userToken,
) {
  return Api(
    ApiConstants.API_PROCESS_PAYMENT_RETRY_LOGGED_USER,
    params,
    'post',
    storeCode,
    userToken,
  );
}

export function getRetryPaymentOptionsAPI(params, storeCode, userToken) {
  return Api(
    ApiConstants.API_GET_RETRY_PAYMENT_OPTIONS,
    params,
    'post',
    storeCode,
    userToken,
  );
}

export function placeOrderPaymentGuestUserAPI(
  params,
  storeCode,
  guestToken,
  adminToken,
) {
  return Api(
    ApiConstants.API_PROCESS_ORDER_LOGGED_GUEST,
    params,
    'post',
    storeCode,
    adminToken,
  );
}

export function placeOrderPaymentAPI(
  params,
  storeCode,
  guestToken,
  adminToken,
) {
  return Api(
    ApiConstants.API_PROCESS_PAYMENT_USER,
    params,
    'post',
    storeCode,
    adminToken,
  );
}

export function getCollectionMethodsLoggedUserAPI(
  params,
  storeCode,
  userToken,
) {
  return Api(
    ApiConstants.API_GET_PAYMENT_COLLECTION_METHODS_LOGGED_USER,
    params,
    'post',
    storeCode,
    userToken,
  );
}

export function getCollectionMethodsGuestUserAPI(
  params,
  storeCode,
  guestToken,
  adminToken,
) {
  return Api(
    ApiConstants.API_GET_PAYMENT_COLLECTION_METHODS_GUEST_USER,
    params,
    'post',
    storeCode,
    adminToken,
  );
}

export function getPaymentUrlLoggedUserAPI(params, storeCode, userToken) {
  return Api(
    ApiConstants.API_GET_PAYMENT_URL_LOGGED_USER,
    params,
    'post',
    storeCode,
    userToken,
  );
}

export function getRetryPaymentUrlLoggedUserAPI(params, storeCode, userToken) {
  return Api(
    ApiConstants.API_GET_RE_TRY_PAYMENT_URL_LOGGED_USER,
    params,
    'post',
    storeCode,
    userToken,
  );
}

export function getPaymentUrlGuestUserAPI(
  params,
  storeCode,
  guestToken,
  adminToken,
) {
  return Api(
    ApiConstants.API_GET_PAYMENT_URL_GUEST_USER,
    params,
    'post',
    storeCode,
    adminToken,
  );
}

export function orderRefundApi(params, storeCode, userToken) {
  return Api(
    ApiConstants.API_ORDER_REFUND,
    params,
    'post',
    storeCode,
    userToken,
  );
}

export function orderReOrderApi(params, storeCode, userToken) {
  return Api(ApiConstants.API_RE_ORDER, params, 'post', storeCode, userToken);
}

export function notifyMeAPI(params, storeCode, adminToken) {
  return Api(ApiConstants.API_NOTIFY_ME, params, 'post', storeCode, adminToken);
}

export function getTopSearchesAPI(storeCode, adminToken) {
  return Api(ApiConstants.TOP_SEARCHES, null, 'get', storeCode, adminToken);
}

export function addEmailReminderAPI(params, storeCode, userToken) {
  return Api(
    ApiConstants.API_ADD_EMAIL_REMINDER,
    params,
    'post',
    storeCode,
    userToken,
  );
}

export function addEmailReminderGuestAPI(params, storeCode, adminToken) {
  return Api(
    ApiConstants.API_ADD_EMAIL_REMINDER_GUEST,
    params,
    'post',
    storeCode,
    adminToken,
  );
}

export function getAllEmailReminderAPI(storeCode, userToken) {
  return Api(
    ApiConstants.API_GET_ALL_EMAIL_REMINDER,
    null,
    'get',
    storeCode,
    userToken,
  );
}

export function deleteEmailReminderAPI(params, storeCode, userToken) {
  return Api(
    ApiConstants.API_DELETE_EMAIL_REMINDER,
    params,
    'post',
    storeCode,
    userToken,
  );
}

export function mergeGuestCartAPI(params, storeCode, guestToken, userToken) {
  return Api(
    ApiConstants.API_GUEST_CART + '/' + guestToken,
    params,
    'put',
    storeCode,
    userToken,
  );
}

export function getPaymentFailedInfoAPI(params, storeCode) {
  return Api(
    ApiConstants.API_PAYMENT_ERROR_INFO,
    params,
    'post',
    storeCode,
    null,
  );
}

export function addDeliveryNoteAPI(params, storeCode) {
  return Api(
    ApiConstants.API_PAYMENT_ERROR_INFO,
    params,
    'post',
    storeCode,
    null,
  );
}

export function getStatusDataAPI(params, storeCode, adminToken) {
  return Api(
    ApiConstants.API_GET_STATUS_DATA,
    params,
    'post',
    storeCode,
    adminToken,
  );
}

export function retainCartLoggedUserAPI(params, storeCode, adminToken) {
  return Api(
    ApiConstants.API_RETAIN_CART_LOGGED_USER,
    params,
    'post',
    storeCode,
    adminToken,
  );
}

export function retainCartGuestUserAPI(params, storeCode, adminToken) {
  return Api(
    ApiConstants.API_RETAIN_CART_GUEST_USER,
    params,
    'post',
    storeCode,
    adminToken,
  );
}

export function getBoughtTogetherProductsAPI(productId, storeCode, adminToken) {
  return Api(
    ApiConstants.API_BOUGHT_TOGETHER_PRODUCTS,
    {sku: productId},
    'post',
    storeCode,
    adminToken,
  );
}

export function addExtraProductsLoggedUserAPI(params, storeCode, adminToken) {
  return Api(
    ApiConstants.API_ADD_EXTRA_PRODUCTS_LOGGED_USER,
    params,
    'post',
    storeCode,
    adminToken,
  );
}

export function addExtraProductsGuestUserAPI(params, storeCode, adminToken) {
  return Api(
    ApiConstants.API_ADD_EXTRA_PRODUCTS_GUEST_USER,
    params,
    'post',
    storeCode,
    adminToken,
  );
}

export function getSubCategoriesAPI(params, storeCode, adminToken) {
  return Api(
    ApiConstants.API_GET_SUB_CATEGORIES,
    params,
    'post',
    storeCode,
    adminToken,
  );
}

export function myFatoorahCreateGuestSession(params, storeCode, adminToken) {
  return Api(
    ApiConstants.API_MY_FATOORAH_CREATE_GUEST_SESSION,
    params,
    'post',
    storeCode,
    adminToken,
  );
}

export function myFatoorahCreateLoggedinUserSession(
  params,
  storeCode,
  userToken,
) {
  return Api(
    ApiConstants.API_MY_FATOORAH_CREATE_LOGGEDIN_USER_SESSION,
    params,
    'post',
    storeCode,
    userToken,
  );
}

export function myFatoorahProcessGuestSession(params, storeCode, adminToken) {
  return Api(
    ApiConstants.API_MY_FATOORAH_PROCESS_GUEST_SESSION,
    params,
    'post',
    storeCode,
    adminToken,
  );
}
export function myFatoorahProcessLoggedinUserSession(
  params,
  storeCode,
  userToken,
) {
  return Api(
    ApiConstants.API_MY_FATOORAH_PROCESS_LOGGEDIN_USER_SESSION,
    params,
    'post',
    storeCode,
    userToken,
  );
}

export function myFatoorahGetPaymentMethods(params, storeCode, userToken) {
  return Api(
    ApiConstants.API_MY_FATOORAH_GET_PAYMENT_METHODS,
    params,
    'post',
    storeCode,
    userToken,
  );
}

export function getPaymentUrlMyFatoorah(params, storeCode, userToken) {
  return Api(
    ApiConstants.API_GET_PAYMENT_URL_MY_FATOORAH,
    params,
    'post',
    storeCode,
    userToken,
  );
}
export function getPaymentUrlMyFatoorahGuest(params, storeCode, adminToken) {
  return Api(
    ApiConstants.API_GET_PAYMENT_URL_MY_FATOORAH_GUEST,
    params,
    'post',
    storeCode,
    adminToken,
  );
}

export function myFatoorahGetPaymentMethodsGuest(
  params,
  storeCode,
  adminToken,
) {
  return Api(
    ApiConstants.API_MY_FATOORAH_GET_PAYMENT_METHODS_GUEST,
    params,
    'post',
    storeCode,
    adminToken,
  );
}

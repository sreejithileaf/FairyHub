/**
 * Created by Jebin for iLeaf Solutions Pvt.Ltd
 * on February 12, 2020
 * LoginActions - Actions for login
 */

import * as types from "./types";

export function requestLogin(username, password, loginCallback) {
  return {
    type: types.LOGIN_REQUEST,
    username,
    password,
    loginCallback,
  };
}

export function reOpenApp(loginCallback) {
  return {
    type: types.USER_DATA_REQUEST,
    loginCallback,
  };
}

export function renewUserToken(callback) {
  return {
    type: types.RENEW_USER_TOKEN,
    callback,
  };
}

export function requestSocialMediaLogin(params, loginCallback) {
  return {
    type: types.SOCIAL_MEDIA_LOGIN_REQUEST,
    params,
    loginCallback,
  };
}

export function updateSocialMediaLoginStatus(status) {
  return {
    type: types.UPDATE_SOCIAL_MEDIA_LOGIN_STATUS,
    status,
  };
}

export function requestforgotPassword(user_email, forgotPasswordCallback) {
  return {
    type: types.FORGOT_PASSWORD_REQUEST,
    user_email,
    forgotPasswordCallback,
  };
}

export function loginFailed() {
  return {
    type: types.LOGIN_FAILED,
  };
}

export function updateCartId(id) {
  return {
    type: types.UPADTE_CART_ID,
    id,
  };
}

export function onLoginResponse(response) {
  return {
    type: types.LOGIN_RESPONSE,
    response,
  };
}

export function enableLoader() {
  return {
    type: types.LOGIN_ENABLE_LOADER,
  };
}

export function disableLoader() {
  return {
    type: types.LOGIN_DISABLE_LOADER,
  };
}

export function requestRegister(userInfo, isRTL, registerCallback) {
  return {
    type: types.REGISTER_REQUEST,
    userInfo,
    isRTL,
    registerCallback,
  };
}

export function registerFailed() {
  return {
    type: types.REGISTER_FAILED,
  };
}

export function onRegisterResponse(response) {
  return {
    type: types.REGISTER_RESPONSE,
    response,
  };
}

export function updateUserInfo(userInfo, userName, password) {
  return {
    type: types.APP_UPDATE_USER_INFO,
    userInfo,
    userName,
    password,
  };
}

export function profileUpdateRequest(
  userInfo,
  oldPassword,
  newPassword,
  profileUpdateCallback
) {
  return {
    type: types.PROFILE_UPDATE_REQUEST,
    userInfo,
    oldPassword,
    newPassword,
    profileUpdateCallback,
  };
}

export function passwordUpdateRequest(
  // userInfo,
  oldPassword,
  newPassword,
  passwordUpdateCallback
) {
  return {
    type: types.PASSWORD_UPDATE_REQUEST,
    // userInfo,
    oldPassword,
    newPassword,
    passwordUpdateCallback,
  };
}

export function onProfileUpdateResponse(response) {
  return {
    type: types.PROFILE_UPDATE_RESPONSE,
    response,
  };
}

export function onForgotPasswordResponse(response) {
  return {
    type: types.FORGOT_PASSWORD_RESPONSE,
    response,
  };
}

export function onPasswordUpdateResponse(response) {
  return {
    type: types.PASSWORD_UPDATE_RESPONSE,
    response,
  };
}

export function updateWishList(wishListResponse) {
  return {
    type: types.USER_WISHLIST_RESPONSE,
    wishListResponse,
  };
}

export function removeItemFromWishlist(productId, removeCallback) {
  return {
    type: types.REMOVE_WISHLIST_ITEM,
    productId,
    removeCallback,
  };
}

export function addItemToWishlist(productId, addCallback) {
  return {
    type: types.ADD_WISHLIST_ITEM,
    productId,
    addCallback,
  };
}

export function userDidLogOut() {
  return {
    type: types.USER_LOG_OUT,
  };
}

export function updateGuestInfo(guestInfo) {
  return {
    type: types.UPDATE_GUEST_INFO,
    guestInfo,
  };
}

export function clearGuestCart() {
  return {
    type: types.GUEST_CART_CLEAR,
  };
}

export function onFeedbackSubmit(
  firstName,
  lastName,
  email,
  mobile,
  reason,
  message,
  callBack
) {
  return {
    type: types.SUBMIT_CONTACT_US,
    firstName,
    lastName,
    email,
    mobile,
    reason,
    message,
    callBack,
  };
}

export function addNewReminder(params, callback) {
  return {
    type: types.ADD_EMAIL_REMINDER,
    params,
    callback,
  };
}

export function getEmailReminders(callback) {
  return {
    type: types.GET_EMAIL_REMINDER,
    callback,
  };
}

export function updateEmailRemindersArray(emailReminders) {
  return {
    type: types.UPDATE_EMAIL_REMINDER_ARRAY,
    emailReminders,
  };
}

export function removeEmailReminder(params, callback) {
  return {
    type: types.DELETE_EMAIL_REMINDER,
    params,
    callback,
  };
}

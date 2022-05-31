/**
 * Created by Jebin for iLeaf Solutions Pvt.Ltd
 * on February 26, 2020
 * ProductDetailContainer -
 */

import { connect } from "react-redux";
import React, { Component } from "react";
import ProductDetailView from "./ProductDetailView";
import * as appActions from "../../actions/appActions";
import * as guestActions from "../../actions/guestActions";
import * as loginActions from "../../actions/loginActions";
import * as productsActions from "../../actions/productsActions";
import * as cartActions from "../../actions/cartActions";

class ProductDetailContainer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <ProductDetailView {...this.props} />;
  }
}

function mapStateToProps(state) {
  return {
    isNetworkAvailable: state.appReducer.isNetworkAvailable,
    isLoading: state.loadingReducer.isLoading,
    selectedLanguage: state.appReducer.selectedLanguage,
    appMediaBaseUrl: state.appReducer.appMediaBaseUrl,
    userToken: state.appReducer.userToken,
    quoteID: state.loginReducer.cartID,
    guestQuoteId: state.appReducer.quoteId,
    guestToken: state.appReducer.guestToken,
    isHandset: state.appReducer.isHandset,
    isRTL: state.appReducer.selectedLanguage === "ar" ? true : false,
    screenWidth: state.appReducer.screenWidth,
    screenHeight: state.appReducer.screenHeight,
    orientation: state.appReducer.orientation,
    productDetails: state.productDetailReducer.productDetails,
    currency: state.appReducer.currency,
    productsSizes: state.appReducer.productsSizes,
    productsColors: state.appReducer.productsColors,
    productsBrands: state.appReducer.productsBrands,
    productsAgeGroups: state.appReducer.productsAgeGroups,
    productsGenders: state.appReducer.productsGenders,
    productsAges: state.appReducer.productsAges,
    productsDeliveryTypes: state.appReducer.productsDeliveryTypes,
    cartArray:
      state.appReducer.userToken.length > 0
        ? state.cartReducer.cartArray
        : state.cartReducer.guestCartArray,
    wishList: state.loginReducer.wishList,
    guestInfo: state.loginReducer.guestInfo,
    recentlyViewedProducts: state.searchHistoryReducer.recentlyViewedProducts,
    userInfo: state.loginReducer.userInfo,
    appMediaBaseUrl: state.appReducer.appMediaBaseUrl,
    guestAddressList: state.loginReducer.guestAddressList || [],
    appLogoUrl: state.appReducer.appLogo || "",
  };
}

function mapDispatchToProps(dispatch) {
  return {
    didChangeLAnguage: (language) => {
      dispatch(appActions.onChangeLanguage(language));
    },
    getProductDetail: (productId, productDetailsCallback) => {
      dispatch(
        productsActions.getProductDetail(productId, productDetailsCallback)
      );
    },
    getProductDetailWithURLKey: (urlKey, productDetailsCallback) => {
      dispatch(
        productsActions.getProductDetailWithURLKey(
          urlKey,
          productDetailsCallback
        )
      );
    },
    getRelatedProductDetail: (productId, relatedproductDetailsCallback) => {
      dispatch(
        productsActions.getRelatedProductDetail(
          productId,
          relatedproductDetailsCallback
        )
      );
    },
    getBoughtTogetherProducts: (
      productId,
      getBoughtTogetherProductsCallback
    ) => {
      dispatch(
        productsActions.getBoughtTogetherProducts(
          productId, //"BD31227Z",
          getBoughtTogetherProductsCallback
        )
      );
    },
    createGuestCart: (createGuestCartCallback) => {
      dispatch(guestActions.createGuestCart(createGuestCartCallback));
    },
    guestAddToCart: (params, isAllItems, guestAddToCartCallback) => {
      dispatch(
        guestActions.guestAddToCart(params, isAllItems, guestAddToCartCallback)
      );
    },
    onLikeTap: (productId, likeCallback) => {
      dispatch(loginActions.addItemToWishlist(productId, likeCallback));
    },
    onDislikeTap: (productId, removeCallback) => {
      dispatch(loginActions.removeItemFromWishlist(productId, removeCallback));
    },
    addPtoCartForLoggedUser: (params, isAllItems, callBack) => {
      dispatch(
        cartActions.addProductToCartLoggedUser(params, isAllItems, callBack)
      );
    },
    getTotalCost: (getTotalCostCallback) => {
      dispatch(cartActions.getTotalCost(getTotalCostCallback));
    },
    get360Images: (productId, callBack) => {
      dispatch(productsActions.get360Images(productId, callBack));
    },
    addToRecentlyViewed: (productDict) => {
      dispatch(productsActions.addToRecentlyViewed(productDict));
    },
    postUserReview: (reviewDict, reviewAddCallback) => {
      dispatch(productsActions.postUserReview(reviewDict, reviewAddCallback));
    },
    notifyMe: (params, callback) => {
      dispatch(productsActions.notifyMe(params, callback));
    },
    getUserReviews: (skuId, callback) => {
      dispatch(productsActions.getUserReviews(skuId, callback));
    },
    updateUserCart: (guestparams, updateCallback, productid) => {
      dispatch(
        cartActions.updateUserCart(guestparams, updateCallback, productid)
      );
    },
    updateGuestCart: (
      productid,
      updateGuestCartCallback,
      guestparams,
      index
    ) => {
      dispatch(
        cartActions.updateGuestCart(
          productid,
          updateGuestCartCallback,
          guestparams,
          index
        )
      );
    },
    getProuctsInCart: () => {
      dispatch(cartActions.getProuctsInCart());
    },
    addExtraProductsToCart: (params, callback) => {
      dispatch(cartActions.addExtraProductsToCart(params, callback));
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProductDetailContainer);

/**
 * Created by Jebin for iLeaf Solutions Pvt.Ltd
 * on February 19, 2020
 * WishListContainer -
 */

import { connect } from "react-redux";
import React, { Component } from "react";
import WishListView from "./WishListView";
import * as appActions from "../../actions/appActions";
import * as productsActions from "../../actions/productsActions";
import * as loginActions from "../../actions/loginActions";
import * as guestActions from "../../actions/guestActions";
import * as cartActions from "../../actions/cartActions";

class WishListContainer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <WishListView {...this.props} />;
  }
}

function mapStateToProps(state) {
  return {
    selectedLanguage: state.appReducer.selectedLanguage,
    screenWidth: state.appReducer.screenWidth,
    screenHeight: state.appReducer.screenHeight,
    appMediaBaseUrl: state.appReducer.appMediaBaseUrl,
    orientation: state.appReducer.orientation,
    productsList: state.productsListReducer.productsList,
    userToken: state.appReducer.userToken,
    quoteID: state.loginReducer.cartID,
    isLoading: state.loadingReducer.isLoading,
    guestToken: state.appReducer.guestToken,
    wishList: state.loginReducer.wishList,
    currency: state.appReducer.currency,
    isHandset: state.appReducer.isHandset,
    isRTL: state.appReducer.selectedLanguage === "ar" ? true : false,
    cartArray:
      state.appReducer.userToken.length > 0
        ? state.cartReducer.cartArray
        : state.cartReducer.guestCartArray,
    appLogoUrl: state.appReducer.appLogo || "",
  };
}

function mapDispatchToProps(dispatch) {
  return {
    didChangeLAnguage: (language) => {
      dispatch(appActions.onChangeLanguage(language));
    },
    getProductsList: (pageIndex, pageCount, getProductListCallback) => {
      dispatch(
        productsActions.getProductsList(
          pageIndex,
          pageCount,
          getProductListCallback
        )
      );
    },
    onRemoveTap: (productId, removeCallback) => {
      dispatch(loginActions.removeItemFromWishlist(productId, removeCallback));
    },
    createGuestCart: (createGuestCartCallback) => {
      dispatch(guestActions.createGuestCart(createGuestCartCallback));
    },
    guestAddToCart: (params, guestAddToCartCallback) => {
      dispatch(guestActions.guestAddToCart(params, guestAddToCartCallback));
    },
    addPtoCartForLoggedUser: (params, callBack) => {
      dispatch(cartActions.addProductToCartLoggedUser(params, callBack));
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WishListContainer);

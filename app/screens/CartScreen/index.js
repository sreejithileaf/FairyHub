/**
 * Created by Kareem for iLeaf Solutions Pvt.Ltd
 * on July 13, 2020
 * CartScreen -  container
 */

import { connect } from "react-redux";
import CartScreen from "./CartScreen";
import React, { Component } from "react";
import * as CartActions from "../../actions/cartActions";
import * as LoginActions from "../../actions/loginActions";
import * as LoadingActions from "../../actions/loadingActions";
import HudView from "../../components/hudView";
import * as checkoutActions from "../../actions/checkoutActions";

class CartScreenContainer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <CartScreen {...this.props} />;
  }
}

function mapStateToProps(state) {
  return {
    isLoading: state.loadingReducer.isLoading,
    isRTL: state.appReducer.selectedLanguage === "ar" ? true : false,
    isNetworkAvailable: state.appReducer.isNetworkAvailable,
    productsSizes: state.appReducer.productsSizes,
    currency: state.appReducer.currency,
    productsColors: state.appReducer.productsColors,
    cartList: state.cartReducer.cartArray,
    guestcartList: state.cartReducer.guestCartArray,
    userToken: state.appReducer.userToken,
    guestToken: state.appReducer.guestToken,
    cartId: state.loginReducer.cartID,
    guestInfo: state.loginReducer.guestInfo,
    productsAgeGroups: state.appReducer.productsAgeGroups,
    productsBrands: state.appReducer.productsBrands,
    productsGenders: state.appReducer.productsGenders,
    productsAges: state.appReducer.productsAges,
    cartAddOnsArray: state.cartReducer.cartAddOnsArray,
    addressList: state.addAddressReducer.addressList || [],
    guestAddressList: state.loginReducer.guestAddressList || [],
    cartTotals: state.cartReducer.cartTotals,
    appMediaBaseUrl: state.appReducer.appMediaBaseUrl,
    screenWidth: state.appReducer.screenWidth,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    addProductFromCartToWishList: (
      entityId,
      productId,
      addProductToWishListCallback
    ) => {
      dispatch(
        CartActions.addProductFromCartToWishList(
          entityId,
          productId,
          addProductToWishListCallback
        )
      );
    },
    getProuctsInCart: () => {
      dispatch(CartActions.getProuctsInCart());
    },
    removeGuestCart: (id, removeGuestCartCallback, index) => {
      dispatch(CartActions.removeGuestCart(id, removeGuestCartCallback, index));
    },
    removeProductFromCart: (item, removeUserCartCallback) => {
      dispatch(CartActions.removeUserCart(item, removeUserCartCallback));
    },
    getTotalCost: (getTotalCostCallback) => {
      dispatch(CartActions.getTotalCost(getTotalCostCallback));
    },
    updateUserCart: (guestparams, updateCallback, productid) => {
      dispatch(
        CartActions.updateUserCart(guestparams, updateCallback, productid)
      );
    },
    updateGuestCart: (
      productid,
      updateGuestCartCallback,
      guestparams,
      index
    ) => {
      dispatch(
        CartActions.updateGuestCart(
          productid,
          updateGuestCartCallback,
          guestparams,
          index
        )
      );
    },
    renewUserToken: (callback) => {
      dispatch(LoginActions.renewUserToken(callback));
    },
    userDidLogOut: () => {
      dispatch(LoginActions.userDidLogOut());
    },
    applyVoucher: (voucherCode, apllyCodeCallback) => {
      dispatch(checkoutActions.applyVoucher(voucherCode, apllyCodeCallback));
    },
    removeAppliedVoucher: (removeAppliedVoucherCallback) => {
      dispatch(
        checkoutActions.removeAppliedVoucher(removeAppliedVoucherCallback)
      );
    },
    enableLoader: () => {
      dispatch(LoadingActions.enableLoader());
    },
    disableLoader: () => {
      dispatch(disableLoader.enableLoader());
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CartScreenContainer);

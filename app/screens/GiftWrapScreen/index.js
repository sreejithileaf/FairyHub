/**
 * Created by Arun for iLeaf Solutions Pvt.Ltd
 * on February 17, 2020
 * AddressListContainer - AddressListScreen container
 */

import { connect } from "react-redux";
import React, { Component } from "react";
import GiftWrapScreen from "./GiftWrapScreen";
import * as appActions from "../../actions/appActions";
import * as addAddressAction from "../../actions/addAddressAction";
import * as CartActions from "../../actions/cartActions";

class GiftWrapContainer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <GiftWrapScreen {...this.props} />;
  }
}

function mapStateToProps(state) {
  return {
    isLoading: state.loadingReducer.isLoading,
    selectedLanguage: state.appReducer.selectedLanguage,
    userInfo: state.loginReducer.userInfo || {},
    loginResponse: state.loginReducer,
    addressList: state.addAddressReducer.addressList || [],
    isRTL: state.appReducer.selectedLanguage === "ar" ? true : false,
    availableGiftWrapUpdatedTime:
      state.cartReducer.availableGiftWrapUpdatedTime,
    availableGiftwraps: state.cartReducer.availableGiftwraps,
    currency: state.appReducer.currency,
    appMediaBaseUrl: state.appReducer.appMediaBaseUrl,

    cartId: state.loginReducer.cartID,
    quoteID:
      state.appReducer.userToken.length > 0
        ? state.loginReducer.cartID
        : state.appReducer.quoteId,
    userToken: state.appReducer.userToken,
    cartAddOnsArray: state.cartReducer.cartAddOnsArray,
    screenWidth: state.appReducer.screenWidth,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getAvailableGiftwrap: (params, callback) => {
      dispatch(CartActions.getAvailableAddOns(params, callback));
    },
    addGiftWraps: (params, callback) => {
      dispatch(CartActions.addAddOns(params, callback));
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GiftWrapContainer);

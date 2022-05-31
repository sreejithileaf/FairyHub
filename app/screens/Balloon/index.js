/**
 * Created by Arun for iLeaf Solutions Pvt.Ltd
 * on February 17, 2020
 * AddressListContainer - AddressListScreen container
 */

import { connect } from "react-redux";
import React, { Component } from "react";
import Balloon from "./Balloon";
import * as appActions from "../../actions/appActions";
import * as addAddressAction from "../../actions/addAddressAction";
import * as CartActions from "../../actions/cartActions";

class BalloonContainer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <Balloon {...this.props} />;
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
    availableBalloonsUpdatedTime:
      state.cartReducer.availableBalloonsUpdatedTime,
    currency: state.appReducer.currency,
    availableBalloons: state.cartReducer.availableBalloons,

    cartId: state.loginReducer.cartID,
    quoteID:
      state.appReducer.userToken.length > 0
        ? state.loginReducer.cartID
        : state.appReducer.quoteId,
    userToken: state.appReducer.userToken,
    cartAddOnsArray: state.cartReducer.cartAddOnsArray,
    appMediaBaseUrl: state.appReducer.appMediaBaseUrl,
    screenWidth: state.appReducer.screenWidth,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getAvailableBalloons: (params, callback) => {
      dispatch(CartActions.getAvailableAddOns(params, callback));
    },
    getMoreAddOns: (params, callback) => {
      dispatch(CartActions.getMoreAddOns(params, callback));
    },
    addBalloons: (params, callback) => {
      dispatch(CartActions.addAddOns(params, callback));
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BalloonContainer);

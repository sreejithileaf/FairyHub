/**
 * Created by Arun for iLeaf Solutions Pvt.Ltd
 * on May 20, 2022
 * TrackYourOrderContainer - TrackYourOrder container
 */

import { connect } from "react-redux";
import * as orderHistoryActions from "../../actions/orderHistoryActions";
import React, { Component } from "react";
import TrackYourOrder from "./TrackYourOrder";


class TrackYourOrderContainer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <TrackYourOrder {...this.props} />;
  }
} 

function mapStateToProps(state) {
  return {
    isLoading: state.loadingReducer.isLoading,
    selectedLanguage: state.appReducer.selectedLanguage,
    userInfo: state.loginReducer.userInfo || {},
    addressList: state.addAddressReducer.addressList || [],
    isRTL: state.appReducer.selectedLanguage === "ar" ? true : false,
    cartList: state.cartReducer.cartArray,
    userToken: state.appReducer.userToken,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getOrderTrackingHistory: (params, callback) => {
      dispatch(orderHistoryActions.getOrderTrackingHistory(params, callback));
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TrackYourOrderContainer);

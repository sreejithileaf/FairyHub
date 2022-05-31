import { connect } from "react-redux";
import * as orderHistoryActions from "../../actions/orderHistoryActions";
import OrderHistoryDetailScreen from "./OrderHistoryDetailScreen";
import React, { Component } from "react";
import * as checkoutActions from "../../actions/checkoutActions";

class OrderHistoryDetailContainer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <OrderHistoryDetailScreen {...this.props} />;
  }
}

function mapStateToProps(state) {
  return {
    userToken: state.appReducer.userToken,
    selectedLanguage: state.appReducer.selectedLanguage,
    productsSizes: state.appReducer.productsSizes,
    productsColors: state.appReducer.productsColors,
    isLoading: state.loadingReducer.isLoading,
    isRTL: state.appReducer.selectedLanguage === "ar" ? true : false,
    currency: state.appReducer.currency,
    appMediaBaseUrl: state.appReducer.appMediaBaseUrl,
    screenWidth: state.appReducer.screenWidth,
    userInfo: state.loginReducer.userInfo,
    addressList: state.addAddressReducer.addressList || [],
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getOrderHistory: (callback) => {
      dispatch(orderHistoryActions.getOrderHistory(callback));
    },
    orderRefund: (params, callback) => {
      dispatch(orderHistoryActions.orderRefund(params, callback));
    },
    reOrderItems: (params, callback) => {
      dispatch(orderHistoryActions.reOrderItems(params, callback));
    },
    setShipmentInfo: (params, orderPlacedCallback) => {
      dispatch(checkoutActions.setShipmentInfo(params, orderPlacedCallback));
    },
    getRetryPaymentURL: (params, paymentURLCallback) => {
      dispatch(checkoutActions.getRetryPaymentURL(params, paymentURLCallback));
    },
    getPaymentFailedInfo: (params, callback) => {
      dispatch(checkoutActions.getPaymentFailedInfo(params, callback));
    },
    placeOrderWithPaymentReTry: (params, paymentOrderPlacedCallback) => {
      dispatch(
        checkoutActions.placeOrderWithPaymentReTry(
          params,
          paymentOrderPlacedCallback
        )
      );
    },
    getPaymentOptions: (params, callback) => {
      dispatch(checkoutActions.getRetryPaymentOptions(params, callback));
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OrderHistoryDetailContainer);

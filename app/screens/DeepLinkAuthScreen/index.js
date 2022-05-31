import { connect } from "react-redux";
import * as orderHistoryActions from "../../actions/orderHistoryActions";
import DeepLinkAuthScreen from "./DeepLinkAuthScreen";
import React, { Component } from "react";

class OverviewContainer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <DeepLinkAuthScreen {...this.props} />;
  }
}

function mapStateToProps(state) {
  return {
    userToken: state.appReducer.userToken,
    selectedLanguage: state.appReducer.selectedLanguage,
    productsSizes: state.appReducer.productsSizes,
    productsColors: state.appReducer.productsColors,
    cartArray: state.cartReducer.cartArray,
    guestCartArray: state.cartReducer.guestCartArray,
    isLoading: state.loadingReducer.isLoading,
    isRTL: state.appReducer.selectedLanguage === "ar" ? true : false,
    currency: state.appReducer.currency,
    userInfo: state.loginReducer.userInfo || {},
    addressList: state.addAddressReducer.addressList || [],
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getOrderHistory: (params, callback) => {
      dispatch(orderHistoryActions.getOrderHistory(params, callback));
    },
    reOrderItems: (params, callback) => {
      dispatch(orderHistoryActions.reOrderItems(params, callback));
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OverviewContainer);

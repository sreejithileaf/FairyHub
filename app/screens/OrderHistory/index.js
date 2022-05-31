import { connect } from "react-redux";
import * as orderHistoryActions from "../../actions/orderHistoryActions";
import OrderHistoryScreen from "./OrderHistoryScreen";
import React, { Component } from "react";

class OrderHistoryContainer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <OrderHistoryScreen {...this.props} />;
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
    productsAgeGroups: state.appReducer.productsAgeGroups,
    productsBrands: state.appReducer.productsBrands,
    productsGenders: state.appReducer.productsGenders,
    productsAges: state.appReducer.productsAges,
    appMediaBaseUrl: state.appReducer.appMediaBaseUrl,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getOrderHistory: (params, callback) => {
      dispatch(orderHistoryActions.getOrderHistory(params, callback));
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OrderHistoryContainer);

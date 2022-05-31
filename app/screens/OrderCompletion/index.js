import { connect } from "react-redux";
import * as orderHistoryActions from "../../actions/orderHistoryActions";
import OrderCompletionScreen from "./OrderCompletionScreen";
import React, { Component } from "react";

class OrderCompletionContainer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <OrderCompletionScreen {...this.props} />;
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
    productsAgeGroups: state.appReducer.productsAgeGroups,
    productsBrands: state.appReducer.productsBrands,
    productsGenders: state.appReducer.productsGenders,
    productsAges: state.appReducer.productsAges,
    appMediaBaseUrl: state.appReducer.appMediaBaseUrl,
    cartAddOnsArray: state.cartReducer.cartAddOnsArray,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getOrderDetail: (orderId, callback) => {
      dispatch(orderHistoryActions.getOrderDetail(orderId, callback));
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OrderCompletionContainer);

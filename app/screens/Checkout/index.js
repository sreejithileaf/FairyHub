/**
 * Created by Jebin for iLeaf Solutions Pvt.Ltd
 * on March 18, 2020
 * Checkout Container -
 */

import {connect} from 'react-redux';
import React, {Component} from 'react';
import CheckoutView from './CheckoutView';
import * as appActions from '../../actions/appActions';
import * as cartActions from '../../actions/cartActions';
import * as checkoutActions from '../../actions/checkoutActions';
import * as historyActions from '../../actions/historyActions';

class CheckoutContainer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <CheckoutView {...this.props} />;
  }
}

function mapStateToProps(state) {
  return {
    isLoading: state.loadingReducer.isLoading,
    selectedLanguage: state.appReducer.selectedLanguage,
    isRTL: state.appReducer.selectedLanguage === 'ar' ? true : false,
    searchHistoryarray: state.searchHistoryReducer.searchHistoryarray,
    screenWidth: state.appReducer.screenWidth,
    screenHeight: state.appReducer.screenHeight,
    orientation: state.appReducer.orientation,
    searchResultArray: state.searchResultReducer.searchResultArray,
    productsSizes: state.appReducer.productsSizes,
    productsColors: state.appReducer.productsColors,
    cartList: state.cartReducer.cartArray,
    guestcartList: state.cartReducer.guestCartArray,
    userToken: state.appReducer.userToken,
    currency: state.appReducer.currency,
    guestInfo: state.loginReducer.guestInfo,
    userInfo: state.loginReducer.userInfo,
    storeCode: state.appReducer.storeCode,
    addressList: state.addAddressReducer.addressList || [],
    productsAgeGroups: state.appReducer.productsAgeGroups,
    productsBrands: state.appReducer.productsBrands,
    productsGenders: state.appReducer.productsGenders,
    productsAges: state.appReducer.productsAges,
    guestAddressList: state.loginReducer.guestAddressList || [],
    cartAddOnsArray: state.cartReducer.cartAddOnsArray,
    guestToken: state.appReducer.guestToken,
    cartTotals: state.cartReducer.cartTotals,
    cartID: state.loginReducer.cartID,
    appMediaBaseUrl: state.appReducer.appMediaBaseUrl,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setShipmentInfo: (params, orderPlacedCallback) => {
      dispatch(checkoutActions.setShipmentInfo(params, orderPlacedCallback));
    },
    applyVoucher: (voucherCode, apllyCodeCallback) => {
      dispatch(checkoutActions.applyVoucher(voucherCode, apllyCodeCallback));
    },
    removeAppliedVoucher: removeAppliedVoucherCallback => {
      dispatch(
        checkoutActions.removeAppliedVoucher(removeAppliedVoucherCallback),
      );
    },
    getTotalCost: getTotalCostCallback => {
      dispatch(cartActions.getTotalCost(getTotalCostCallback));
    },
    getDeliveryDateAndTIme: getDeliveryDateCallback => {
      dispatch(checkoutActions.getDeliveryTimeAndDate(getDeliveryDateCallback));
    },
    updateCartDateTime: cartDict => {
      dispatch(cartActions.updateCartDateAndTime(cartDict));
    },
    placeOrderWithCOD: (codDict, orderPlacedCallback) => {
      dispatch(checkoutActions.placeOrderWithCOD(codDict, orderPlacedCallback));
    },
    getPaymentCollectMethods: (params, collectionMethodsCallback) => {
      dispatch(
        checkoutActions.getPaymentCollectMethods(
          params,
          collectionMethodsCallback,
        ),
      );
    },
    getPaymentURL: (params, paymentURLCallback) => {
      dispatch(checkoutActions.getPaymentURL(params, paymentURLCallback));
    },
    getPaymentFailedInfo: (params, callback) => {
      dispatch(checkoutActions.getPaymentFailedInfo(params, callback));
    },
    addDeliveryNote: (params, callback) => {
      dispatch(checkoutActions.addDeliveryNote(params, callback));
    },
    placeOrderWithPayment: (
      params,
      isCardPayment,
      paymentOrderPlacedCallback,
    ) => {
      dispatch(
        checkoutActions.placeOrderWithPayment(
          params,
          isCardPayment,
          paymentOrderPlacedCallback,
        ),
      );
    },
    retainCart: (params, callback) => {
      dispatch(checkoutActions.retainCart(params, callback));
    },
    getProuctsInCart: callback => {
      dispatch(cartActions.getProuctsInCart(callback));
    },

    createMyFatoorahSession: (params, callback) => {
      dispatch(checkoutActions.createMyFatoorahSession(params, callback));
    },
    processMyFatoorahSession: (params, callback) => {
      dispatch(checkoutActions.processMyFatoorahSession(params, callback));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CheckoutContainer);

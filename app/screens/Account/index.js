/**
 * Created by Jebin for iLeaf Solutions Pvt.Ltd
 * on February 17, 2020
 * AccountContainer - AccountScreen container
 */

import { connect } from "react-redux";
import React, { Component } from "react";
import AccountScreen from "./AccountScreen";
import * as appActions from "../../actions/appActions";
import * as loginActions from "../../actions/loginActions";

class AccountContainer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <AccountScreen {...this.props} />;
  }
}

function mapStateToProps(state) {
  return {
    selectedLanguage: state.appReducer.selectedLanguage,
    enableBiometricAuth: state.appReducer.enableBiometricAuth,
    isSocialMediaLogin: state.appReducer.isSocialMediaLogin,
    isRTL: state.appReducer.selectedLanguage === "ar" ? true : false,
    userToken: state.appReducer.userToken,
    guestToken: state.appReducer.guestToken,
    userInfo: state.loginReducer.userInfo,
    cartArray:
      state.appReducer.userToken.length > 0
        ? state.cartReducer.cartArray
        : state.cartReducer.guestCartArray,
    stores: state.appReducer.stores,
    storesView: state.appReducer.storesView,
    storeConfiguration: state.appReducer.storeConfiguration,
    storeCode: state.appReducer.storeCode,
    appLogoUrl: state.appReducer.appLogo || "",
  };
}

function mapDispatchToProps(dispatch) {
  return {
    didChangeLAnguage: (language) => {
      dispatch(appActions.onChangeLanguage(language));
    },
    // storeCodeUpdated: (code) => {
    //   dispatch(appActions.onstoreCodeUpdated(code));
    // },
    updateCurrency: (currency) => {
      dispatch(appActions.updateCurrency(currency));
    },
    userDidLogOut: () => {
      dispatch(loginActions.userDidLogOut());
    },
    onChangeBiometricAuthStatus: (status) => {
      dispatch(appActions.onChangeBiometricAuthStatus(status));
    },
    socialMediaLogin: (params, loginCallback) => {
      dispatch(loginActions.requestSocialMediaLogin(params, loginCallback));
    },
    userDidLogOut: () => {
      dispatch(loginActions.userDidLogOut());
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AccountContainer);

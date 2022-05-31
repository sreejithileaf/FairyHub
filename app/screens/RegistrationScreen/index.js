/**
 * Created by Tinoy for iLeaf Solutions Pvt.Ltd
 * on February 19, 2020
 * RegistrationScreen - RegistrationScreen Container
 */

import React, { Component } from "react";
import RegistrationScreen from "./RegistrationScreen";
import { connect } from "react-redux";
import * as navigationActions from "../../actions/navigationActions";
import * as loginActions from "../../actions/loginActions";

class RegistrationContainer extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return <RegistrationScreen {...this.props} />;
  }
}

function mapStateToProps(state) {
  return {
    registerResponse: state.loginReducer.response,
    isLoading: state.loadingReducer.isLoading,
    isRTL: state.appReducer.selectedLanguage === "ar" ? true : false,
    appLogoUrl: state.appReducer.appLogo || "",
  };
}

function mapDispatchToProps(dispatch) {
  return {
    navigateToHomeScreen: () => {
      navigationActions.navigateToHomeScreen;
    },
    onRegisterUser: (userInfo, isRTL, registerCallback) => {
      dispatch(loginActions.requestRegister(userInfo, isRTL, registerCallback));
    },
    onLoginUser: (email, password, loginCallback) => {
      dispatch(loginActions.requestLogin(email, password, loginCallback));
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RegistrationContainer);

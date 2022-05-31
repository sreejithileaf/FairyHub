/**
 * Created by Jebin for iLeaf Solutions Pvt.Ltd
 * on July 29, 2020
 * BiometricAuth - BiometricAuthContainer
 */

import { connect } from "react-redux";
import React, { Component } from "react";
import BiometricAuthView from "./BiometricAuthView";
import * as appActions from "../../actions/appActions";

class BiometricAuthContainer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <BiometricAuthView {...this.props} />;
  }
}

function mapStateToProps(state) {
  return {
    selectedLanguage: state.appReducer.selectedLanguage,
    screenWidth: state.appReducer.screenWidth,
    screenHeight: state.appReducer.screenHeight,
    orientation: state.appReducer.orientation,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    didChangeLAnguage: (language) => {
      dispatch(appActions.onChangeLanguage(language));
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BiometricAuthContainer);

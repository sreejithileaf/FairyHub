/**
 * Created by Jebin for iLeaf Solutions Pvt.Ltd
 * on March 26, 2021
 * StatusView Container -
 */

import { connect } from "react-redux";
import React, { Component } from "react";
import StatusView from "./StatusView";
import * as homeAction from "../../actions/homeAction";
import * as appActions from "../../actions/appActions";
import * as productsActions from "../../actions/productsActions";
import * as loginActions from "../../actions/loginActions";
import * as guestActions from "../../actions/guestActions";
import * as cartActions from "../../actions/cartActions";

class StatusViewContainer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <StatusView {...this.props} />;
  }
}

function mapStateToProps(state) {
  return {
    screenWidth: state.appReducer.screenWidth,
    screenHeight: state.appReducer.screenHeight,
    appMediaBaseUrl: state.appReducer.appMediaBaseUrl,
    orientation: state.appReducer.orientation,
    isLoading: state.loadingReducer.isLoading,
    guestToken: state.appReducer.guestToken,
    currency: state.appReducer.currency,
    isHandset: state.appReducer.isHandset,
    isRTL: state.appReducer.selectedLanguage === "ar" ? true : false,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getStatusItems: (params, callBack) => {
      dispatch(homeAction.getStatusItems(params, callBack));
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StatusViewContainer);

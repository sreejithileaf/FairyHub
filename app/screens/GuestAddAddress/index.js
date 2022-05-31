/**
 * Created by Jebin for iLeaf Solutions Pvt.Ltd
 * on February 17, 2020
 * GuestAddAddress - GuestAddAddress container
 */

import { connect } from "react-redux";
import React, { Component } from "react";
import GuestAddAddressView from "./GuestAddAddressView";
import * as appActions from "../../actions/appActions";
import * as addAddressAction from "../../actions/addAddressAction";

class GuestAddAddressContainer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <GuestAddAddressView {...this.props} />;
  }
}

function mapStateToProps(state) {
  return {
    selectedLanguage: state.appReducer.selectedLanguage,
    storeCode: state.appReducer.storeCode,
    storeView: state.appReducer.storesView,
    guestAddressList: state.loginReducer.guestAddressList || [],
    isLoading: state.loadingReducer.isLoading,
    isRTL: state.appReducer.selectedLanguage === "ar" ? true : false,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    addAddressUser: (details) => {
      dispatch(addAddressAction.guestAddAddressRequest(details));
    },
    editAddressUser: (details) => {
      dispatch(addAddressAction.guestEditAddressRequest(details));
    },
    getAvailableRegions: (callback) => {
      dispatch(addAddressAction.getAvailableRegions(callback));
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GuestAddAddressContainer);

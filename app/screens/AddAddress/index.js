/**
 * Created by Jebin for iLeaf Solutions Pvt.Ltd
 * on February 17, 2020
 * AccountContainer - AccountScreen container
 */

import { connect } from "react-redux";
import React, { Component } from "react";
import AddAddressScreen from "./AddAddress";
import * as appActions from "../../actions/appActions";
import * as addAddressAction from "../../actions/addAddressAction";

class AddAddressContainer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <AddAddressScreen {...this.props} />;
  }
}

function mapStateToProps(state) {
  return {
    selectedLanguage: state.appReducer.selectedLanguage,
    storeCode: state.appReducer.storeCode,
    storeView: state.appReducer.storesView,
    userInfo: state.loginReducer.userInfo || {},
    addressList: state.addAddressReducer.addressList || [],
    isLoading: state.loadingReducer.isLoading,
    isRTL: state.appReducer.selectedLanguage === "ar" ? true : false,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    didChangeLAnguage: (language) => {
      dispatch(appActions.onChangeLanguage(language));
    },
    addAddressUser: (details, addAddressCallback) => {
      dispatch(addAddressAction.addAddressRequest(details, addAddressCallback));
    },
    editAddressUser: (details, editAddressCallback) => {
      dispatch(
        addAddressAction.editAddressRequest(details, editAddressCallback)
      );
    },
    getAvailableRegions: (callback) => {
      dispatch(addAddressAction.getAvailableRegions(callback));
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddAddressContainer);

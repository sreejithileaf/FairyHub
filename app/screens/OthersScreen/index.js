/**
 * Created by Arun for iLeaf Solutions Pvt.Ltd
 * on February 17, 2020
 * AddressListContainer - AddressListScreen container
 */

import { connect } from "react-redux";
import React, { Component } from "react";
import OthersScreen from "./OthersScreen";
import * as appActions from "../../actions/appActions";
import * as loginActions from "../../actions/loginActions";
import * as addAddressAction from "../../actions/addAddressAction";

class OthersScreenContainer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <OthersScreen {...this.props} />;
  }
}

function mapStateToProps(state) {
  return {
    isLoading: state.loadingReducer.isLoading,
    selectedLanguage: state.appReducer.selectedLanguage,
    userInfo: state.loginReducer.userInfo || {},
    loginResponse: state.loginReducer,
    addressList: state.addAddressReducer.addressList || [],
    isRTL: state.appReducer.selectedLanguage === "ar" ? true : false,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    removeAddress: (addressId, addressIndex) => {
      dispatch(addAddressAction.deleteAddress(addressId, addressIndex));
    },
    editAddressUser: (details, editAddressCallback) => {
      dispatch(
        addAddressAction.editAddressRequest(details, editAddressCallback)
      );
    },
    onPasswordUpdate: (
      oldPassword,
      newPassword,
      passwordUpdateCallback
    ) => {
      dispatch(
        loginActions.passwordUpdateRequest(
          oldPassword,
          newPassword,
          passwordUpdateCallback
        )
      );
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OthersScreenContainer);

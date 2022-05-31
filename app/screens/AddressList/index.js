/**
 * Created by Arun for iLeaf Solutions Pvt.Ltd
 * on February 17, 2020
 * AddressListContainer - AddressListScreen container
 */

import { connect } from "react-redux";
import React, { Component } from "react";
import AddressListScreen from "./AddressList";
import * as appActions from "../../actions/appActions";
import * as addAddressAction from "../../actions/addAddressAction";
import * as checkoutActions from "../../actions/checkoutActions";

class AddressListContainer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <AddressListScreen {...this.props} />;
  }
}

function mapStateToProps(state) {
  return {
    isLoading: state.loadingReducer.isLoading,
    selectedLanguage: state.appReducer.selectedLanguage,
    userInfo: state.loginReducer.userInfo || {},
    addressList: state.addAddressReducer.addressList || [],
    isRTL: state.appReducer.selectedLanguage === "ar" ? true : false,
    cartList: state.cartReducer.cartArray,
    userToken: state.appReducer.userToken,
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
    setShipmentInfo: (params, orderPlacedCallback) => {
      dispatch(checkoutActions.setShipmentInfo(params, orderPlacedCallback));
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddressListContainer);

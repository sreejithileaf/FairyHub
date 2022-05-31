/**
 * Created by Arun for iLeaf Solutions Pvt.Ltd
 * on February 17, 2020
 * AddressListContainer - AddressListScreen container
 */

import { connect } from 'react-redux';
import React, { Component } from 'react';
import ReachUsScreen from './ReachUs';
import * as appActions from '../../actions/appActions';
import * as addAddressAction from '../../actions/addAddressAction';
import * as loginActions from "../../actions/loginActions";

class ReachUsContainer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <ReachUsScreen {...this.props} />;
  }
}

function mapStateToProps(state) {
  return {
    isLoading: state.loadingReducer.isLoading,
    selectedLanguage: state.appReducer.selectedLanguage,
    userInfo: state.loginReducer.userInfo || {},
    loginResponse: state.loginReducer,
    addressList: state.addAddressReducer.addressList || [],
    isRTL: state.appReducer.selectedLanguage === 'ar' ? true : false,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    removeAddress: (addressId, addressIndex) => {
      dispatch(addAddressAction.deleteAddress(addressId, addressIndex));
    },
    editAddressUser: (details, editAddressCallback) => {
      dispatch(
        addAddressAction.editAddressRequest(details, editAddressCallback),
      );
    },
    onFeedbackSubmit: (firstName, lastName, email, mobile, reason, message, callBack) => {
      dispatch(
        loginActions.onFeedbackSubmit(firstName, lastName, email, mobile, reason, message, callBack)
      );
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ReachUsContainer);

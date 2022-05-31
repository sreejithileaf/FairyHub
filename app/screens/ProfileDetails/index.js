/**
 * Created by Tinoy for iLeaf Solutions Pvt.Ltd
 * on February 28, 2020
 * ProfileContainer -
 */

import { connect } from "react-redux";
import React, { Component } from "react";
import ProfileDetailView from "./ProfileDetailView";
import * as loginActions from "../../actions/loginActions";
import * as appActions from "../../actions/appActions";

class ProfileContainer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <ProfileDetailView {...this.props} />;
  }
}

function mapStateToProps(state) {
  return {
    selectedLanguage: state.appReducer.selectedLanguage,
    userInfo: state.loginReducer.userInfo,
    isLoading: state.loadingReducer.isLoading,
    emailReminders: state.loginReducer.emailReminders,
    isRTL: state.appReducer.selectedLanguage === "ar" ? true : false,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onProfileUpdate: (
      userInfo,
      oldPassword,
      newPassword,
      profileUpdateCallback
    ) => {
      dispatch(
        loginActions.profileUpdateRequest(
          userInfo,
          oldPassword,
          newPassword,
          profileUpdateCallback
        )
      );
    },
    addNewReminder: (params, callback) => {
      dispatch(loginActions.addNewReminder(params, callback));
    },
    getEmailReminders: (callback) => {
      dispatch(loginActions.getEmailReminders(callback));
    },
    removeEmailReminder: (parameter, callback) => {
      dispatch(loginActions.removeEmailReminder(parameter, callback));
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProfileContainer);

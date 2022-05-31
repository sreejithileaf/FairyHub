import PropTypes from "prop-types";
import React, { Component } from "react";
import { AlertIOS } from "react-native";
import FingerprintScanner from "react-native-fingerprint-scanner";
import { translate } from "../../../config/languageSwitching";

class FingerprintPopup extends Component {
  componentDidMount() {
    FingerprintScanner.authenticate({
      description: "Scan your fingerprint on the device scanner to continue",
    })
      .then(() => {
        this.props.handlePopupDismissed(true);
        alert(translate("authenticated_successfully"));
      })
      .catch((error) => {
        this.props.handlePopupDismissed(false);
        alert(error.message);
      });
  }

  render() {
    return false;
  }
}

FingerprintPopup.propTypes = {
  handlePopupDismissed: PropTypes.func.isRequired,
};

export default FingerprintPopup;

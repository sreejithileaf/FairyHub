import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  Alert,
  Image,
  Text,
  TouchableOpacity,
  View,
  ViewPropTypes,
  Platform,
} from "react-native";

import FingerprintScanner from "react-native-fingerprint-scanner";
import styles from "./Fingerprint_popup_AndroidStyles";
import ShakingText from "./ShakingText.component";

import { showSingleAlert } from "../../../config/common";
import { translate } from "../../../config/languageSwitching";

// Based on https://github.com/hieuvp/react-native-fingerprint-scanner/blob/master/examples/src/FingerprintPopup.component.android.js
// - this example component supports both the legacy device-specific (Android < v23) and
//   current (Android >= 23) biometric APIs
// - your lib and implementation may not need both
class BiometricPopup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errorMessageLegacy: undefined,
      biometricLegacy: undefined,
    };

    this.description = null;
  }

  componentDidMount() {
    if (this.requiresLegacyAuthentication()) {
      authLegacy();
    } else {
      this.authCurrent();
    }
  }

  componentWillUnmount = () => {
    FingerprintScanner.release();
  };

  requiresLegacyAuthentication() {
    return Platform.Version < 23;
  }

  authCurrent() {
    FingerprintScanner.authenticate({
      description: this.props.description || "Log in with Biometrics",
    })
      .then(() => {
        this.props.onAuthenticate();
      })
      .catch((error) => {
        let message = "";
        switch (error.name) {
          case "DeviceLockedPermanent":
            message =
              "Authentication was not successful, device must be unlocked via password";
            break;
          case "DeviceLocked":
            message =
              "Authentication was not successful, the device currently in a lockout of 30 seconds";
            break;
          case "SystemCancel":
            message =
              "Authentication was canceled by system - e.g. if another application came to foreground while the authentication dialog was up";
            break;
          case "AuthenticationTimeout":
            message =
              "Authentication was not successful because the operation timed out";
            break;
        }
        if (message !== "") showSingleAlert(message, "OK");
      });
  }

  authLegacy() {
    FingerprintScanner.authenticate({
      onAttempt: this.handleAuthenticationAttemptedLegacy,
    })
      .then(() => {
        this.props.handlePopupDismissedLegacy();
        Alert.alert(
          translate("Fingerprint_Authentication"),
          translate("authenticated_successfully")
        );
      })
      .catch((error) => {
        this.setState({
          errorMessageLegacy: error.message,
          biometricLegacy: error.biometric,
        });
        this.description.shake();
      });
  }

  handleAuthenticationAttemptedLegacy = (error) => {
    this.setState({ errorMessageLegacy: error.message });
    this.description.shake();
  };

  renderLegacy() {
    const { errorMessageLegacy, biometricLegacy } = this.state;
    const { style, handlePopupDismissedLegacy } = this.props;

    return (
      <View style={styles.container}>
        <View style={[styles.contentContainer, style]}>
          <Image
            style={styles.logo}
            source={require("./assets/finger_print.png")}
          />

          <Text style={styles.heading}>Biometric{"\n"}Authentication</Text>
          <ShakingText
            ref={(instance) => {
              this.description = instance;
            }}
            style={styles.description(!!errorMessageLegacy)}
          >
            {errorMessageLegacy ||
              `Scan your ${biometricLegacy} on the\ndevice scanner to continue`}
          </ShakingText>

          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={handlePopupDismissedLegacy}
          >
            <Text style={styles.buttonText}>BACK TO MAIN</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  render = () => {
    if (this.requiresLegacyAuthentication()) {
      return this.renderLegacy();
    }

    // current API UI provided by native BiometricPrompt
    return null;
  };
}

BiometricPopup.propTypes = {
  description: PropTypes.string,
  onAuthenticate: PropTypes.func.isRequired,
  handlePopupDismissedLegacy: PropTypes.func,
  style: ViewPropTypes.style,
};

export default BiometricPopup;

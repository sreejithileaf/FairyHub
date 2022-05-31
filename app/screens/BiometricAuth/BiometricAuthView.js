// /**
//  * Created by Jebin for iLeaf Solutions Pvt.Ltd
//  * on July 29, 2020
//  * BiometricAuth - BiometricAuthView
//  */

// import styles from "./styles";
// import { View, TouchableOpacity } from "react-native";
// import React, { Component } from "react";
// import FingerprintScanner from "react-native-fingerprint-scanner";

// class BiometricAuthView extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {};
//   }

//   componentDidMount() {}

//   _checkTouchId = () => {
//     FingerprintScanner.authenticate({
//       description: "Scan your fingerprint on the device scanner to continue",
//     })
//       .then(() => {
//         // this.props.handlePopupDismissed();
//         // alert("Authenticated successfully");
//         console.log("SUCCESS----");
//       })
//       .catch((error) => {
//         // this.props.handlePopupDismissed();
//         alert(error.message);

//         console.log("ERRORR----", error);
//       });
//   };

//   render() {
//     console.log("EEE");
//     return (
//       <View style={styles.container}>
//         <TouchableOpacity onPress={this._checkTouchId}>
//           <View style={{ width: 100, height: 100, backgroundColor: "red" }} />
//         </TouchableOpacity>
//       </View>
//     );
//   }
// }

// export default BiometricAuthView;

import Constants from "../../config/constants";
import Images from "../../config/images";

import { translate } from "../../config/languageSwitching";

import React, { Component } from "react";
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  AppState,
  ImageStore,
} from "react-native";
import FingerprintScanner from "react-native-fingerprint-scanner";

import styles from "./SupportingFiles/Application.container.styles";
import FingerprintPopupiOS from "./SupportingFiles/FingerprintPopup.component.ios";
import FingerprintPopupAndroid from "./SupportingFiles/FingerprintPopup.component.android";

import TouchID from "react-native-touch-id";

class BiometricAuthView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errorMessage: undefined,
      biometric: undefined,
      popupShowed: false,
      typeHeader: "",
    };
  }

  handleFingerprintShowed = () => {
    if (Constants.IS_ANDROID) {
      this.setState({ popupShowed: true });
    } else {
      this._requestForIOSAUth();
    }
  };

  handleFingerprintDismissed = (status) => {
    this.setState({ popupShowed: false });
    if (status) {
      this.props.navigation.navigate("Tab");
    }
  };

  componentDidMount = async () => {
    AppState.addEventListener("change", this.handleAppStateChange);
    // Get initial fingerprint enrolled
    this.detectFingerprintAvailable();

    FingerprintScanner.isSensorAvailable()
      .then((biometryType) => {
        // console.log("------***IS SENSOR AVAILABLE***---", biometryType);
      })
      .catch((error) => {
        // console.log("====ERROR TO CHECK SENSOOR====", error);
      });

    this._requestForIOSAUth();

    if (!Constants.IS_ANDROID) {
      // this._requestForIOSAUth();

      TouchID.isSupported()
        .then((biometryType) => {
          // Success code
          if (biometryType === "FaceID") {
            // console.log("FaceID is supported.");
            this.setState({ typeHeader: "FaceID" });
          } else {
            // console.log("TouchID is supported.");
            this.setState({ typeHeader: "TouchId" });
          }
        })
        .catch((error) => {
          // Failure code
          console.log(error);
        });
    }
  };

  _requestForIOSAUth = () => {
    const optionalConfigObject = {
      imageErrorColor: "#ff0000", // Android
      sensorDescription: "Touch sensor", // Android
      sensorErrorDescription: "Failed", // Android
      cancelText: "Cancel", // Android
      fallbackLabel: "", // iOS (if empty, then label is hidden)
      unifiedErrors: false, // use unified error messages (default false)
      passcodeFallback: true, // iOS - allows the device to fall back to using the passcode, if faceid/touch is not available. this does not mean that if touchid/faceid fails the first few times it will revert to passcode, rather that if the former are not enrolled, then it will use the passcode.
    };

    TouchID.authenticate(
      translate("Scan your fingerprint on the device scanner to continue"),
      optionalConfigObject
    )
      .then((success) => {
        // Success code
        this.handleFingerprintDismissed(true);
      })
      .catch((error) => {
        // Failure code

        this._requestForIOSAUthPasscode();
      });
  };

  _requestForIOSAUthPasscode = () => {
    const optionalConfigObject = {
      title: "Authentication Required", // Android
      imageColor: "#e00606", // Android
      imageErrorColor: "#ff0000", // Android
      sensorDescription: "Touch sensor", // Android
      sensorErrorDescription: "Failed", // Android
      cancelText: "Cancel", // Android
      fallbackLabel: "", // iOS (if empty, then label is hidden)
      unifiedErrors: false, // use unified error messages (default false)
      passcodeFallback: true, // iOS - allows the device to fall back to using the passcode, if faceid/touch is not available. this does not mean that if touchid/faceid fails the first few times it will revert to passcode, rather that if the former are not enrolled, then it will use the passcode.
      touchIDDisabled: true,
    };

    TouchID.authenticate(
      translate("Scan your fingerprint on the device scanner to continue"),
      optionalConfigObject
    )
      .then((success) => {
        // Success code
        this.handleFingerprintDismissed(true);
      })
      .catch((error) => {
        // Failure code
        this._requestForIOSAUthPasscode();
      });
  };

  componentWillUnmount() {
    AppState.removeEventListener("change", this.handleAppStateChange);
  }

  detectFingerprintAvailable = () => {
    FingerprintScanner.isSensorAvailable().catch((error) => {
      this.setState({
        errorMessage: error.message,
        biometric: error.biometric,
      });
    });
  };

  handleAppStateChange = (nextAppState) => {
    if (
      this.state.appState &&
      this.state.appState.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      FingerprintScanner.release();
      this.detectFingerprintAvailable();
    }
    this.setState({ appState: nextAppState });
  };

  render() {
    const { errorMessage, biometric, popupShowed, typeHeader } = this.state;

    return (
      <View style={styles.container}>
        {/* <TouchableOpacity
          style={styles.fingerprint}
          onPress={this.handleFingerprintShowed}
          disabled={!!errorMessage}
        >
          <Image
            source={require("./SupportingFiles/assets/finger_print.png")}
          />
        </TouchableOpacity> */}

        {/* {errorMessage && (
          <Text style={styles.errorMessage}>
            {errorMessage} {biometric}
          </Text>
        )} */}

        <View style={{ alignItems: "center", justifyContent: "center" }}>
          <Image source={Images.fingerPrintAuth} />
          <Text
            style={{
              fontSize: 28,
              color: Constants.APP_BLACK_COLOR,
              fontFamily: Constants.Fonts.BOLD,
              marginTop: 10,
            }}
          >
            {translate("Fairyhub Locked")}
          </Text>
          <Text
            style={{
              fontSize: 17,
              color: Constants.APP_GRAY_COLOR,
              fontFamily: Constants.Fonts.REGULAR,
              marginTop: 10,
            }}
          >
            {typeHeader === "FaceID"
              ? translate("Unlock with Face Id to open fairyhub")
              : translate("Unlock with Fingerprint to open fairyhub")}
          </Text>

          {typeHeader === "FaceID" || Constants.IS_ANDROID ? (
            <TouchableOpacity
              onPress={this.handleFingerprintShowed}
              disabled={!!errorMessage}
              style={{
                height: 50,
                alignItems: "center",
                justifyContent: "center",
                marginTop: 10,
              }}
            >
              <Text
                style={{
                  fontSize: 17,
                  color: "rgb(89,143,174)",
                  fontFamily: Constants.Fonts.REGULAR,
                }}
              >
                {typeHeader === "FaceID"
                  ? translate("Use Face ID")
                  : translate("Use Fingerprint")}
              </Text>
            </TouchableOpacity>
          ) : (
            <Text
              style={{
                marginHorizontal: 20,
                color: Constants.APP_RED_COLOR,
                fontFamily: Constants.Fonts.REGULAR,
                fontSize: 14,
                textAlign: "center",
                marginTop: 20,
              }}
            >
              {"Scan your fingerprint on the device scanner to continue"}
            </Text>
          )}
        </View>

        {popupShowed &&
          (Constants.IS_ANDROID ? (
            <FingerprintPopupAndroid
              style={styles.popup}
              handlePopupDismissed={this.handleFingerprintDismissed}
              onAuthenticate={() => this.handleFingerprintDismissed(true)}
            />
          ) : (
            <FingerprintPopupiOS
              style={styles.popup}
              handlePopupDismissed={this.handleFingerprintDismissed}
            />
          ))}
      </View>
    );
  }
}

export default BiometricAuthView;

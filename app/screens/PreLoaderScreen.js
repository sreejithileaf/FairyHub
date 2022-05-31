/**
 * Created by Jebin for iLeaf Solutions Pvt.Ltd
 * on February 12, 2020
 * PreLoaderScreen - UI starts from this screen (Initial data loading token updating, netinfo updating etc.)
 */

import {
  translate,
  setI18nConfig,
  setI18nConfigSecondTime,
} from "./../config/languageSwitching";
import {
  View,
  Image,
  Animated,
  StatusBar,
  Dimensions,
  SafeAreaView,
  ImageBackground,
} from "react-native";
import Images from "../config/images";
import { connect } from "react-redux";
import Modal from "react-native-modal";
import Video from "react-native-video";
import React, { Component } from "react";
import Login from "../screens/LoginScreen";
import Constants from "../config/constants";
import DeviceInfo from "react-native-device-info";
import Orientation from "react-native-orientation";
import * as RNLocalize from "react-native-localize";
import NetInfo from "@react-native-community/netinfo";
import SplashScreen from "react-native-splash-screen";
import * as appActions from "./../actions/appActions";
import * as loginActions from "../actions/loginActions";
import * as storeActions from "./../actions/storeActions";
import * as categoryActions from "./../actions/categoryActions";
import EmptyDataPlaceholder from "../components/emptyDataPlaceholder";
import RNFetchBlob from "rn-fetch-blob";

import { showSingleAlert, showAlertWithCallback } from "../config/common";

class PreLoaderScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAPICalled: false,
      animationValue: new Animated.Value(200),
      isLoginViewShow: false,
      isNetworkAvailableChecked: false,
    };
  }

  componentDidMount() {
    setTimeout(function() {
      SplashScreen.hide();
    }, 100);

    let type = DeviceInfo.getDeviceType();
    this.props.updateDeviceType(type);

    if (this.props.selectedLanguage == "") {
      // setI18nConfig();
    } else {
      setI18nConfigSecondTime(this.props.selectedLanguage);
    }
    // RNLocalize.addEventListener('change', this.handleLocalizationChange);

    this.unsubscribe = NetInfo.addEventListener((state) => {
      this._handleConnectivityChange(state);
    });

    if (type != "Handset") {
      Orientation.addOrientationListener(this._orientationDidChange);
    }

    setInterval(() => {
      if (this.state.viewState == true) {
        Animated.timing(this.state.animationValue, {
          toValue: 200,
          useNativeDriver: false,
        }).start(() => {
          this.setState({ viewState: false });
        });
      } else {
        Animated.timing(this.state.animationValue, {
          toValue: 100,
          useNativeDriver: false,
        }).start(this.setState({ viewState: true }));
      }
    }, 600);
  }

  _getStoreInfoCallback = (status) => {
    if (status) {
      this._checkAppIntroStatus();
    } else {
      showSingleAlert(translate("API_Failed"), translate("Try Again"), () => {
        this.props.getStores(this._getStoreInfoCallback);
      });
    }
  };

  componentWillUnmount() {}

  //Method to check whether user logged in or not.
  _checkAppIntroStatus() {
    const { userToken, userName, password, storeCode } = this.props;
    if (userToken !== "") {
      this.props.reOpenApp((status, showAlert) => {
        if (status) {
          // this.props.navigation.navigate("Tab");
          this._navigateToScreen("Tab");
        } else {
          if (showAlert) {
            showAlertWithCallback(
              "User session expired, please login again",
              "Login",
              "Continue as guest",
              () => {
                this.setState({ isLoginViewShow: true });
              },
              () => {
                // this.props.navigation.navigate("Tab");
                this._navigateToScreen("Tab");
              }
            );
          }
          this.props.userDidLogOut();
        }
      });
    } else {
      // if (storeCode.length > 0) {
      //   // this.props.navigation.navigate("Tab");
      //   this._navigateToScreen("Tab");
      // } else {
      //   // this.props.navigation.navigate("LoginScreen");
      //   this._navigateToScreen("LoginScreen");
      // }
      this._navigateToScreen("Tab");
    }
  }

  _navigateToScreen = (screen) => {
    if (this.props.enableBiometricAuth) {
      this.props.navigation.navigate("BiometricAuth");
    } else {
      this.props.navigation.navigate(screen);
    }
  };

  _handleConnectivityChange = (state) => {
    let networkStatus = state.isConnected;
    this.props.onChangeNetworkStatus(networkStatus);

    const { isAPICalled } = this.state;
    if (networkStatus && !isAPICalled) {
      this.setState({ isAPICalled: true });
      this.props.getStores(this._getStoreInfoCallback);
      // this._getStoreInfoCallback(true);
    } else if (!networkStatus && !isAPICalled) {
      // showSingleAlert(
      //   translate("Please check your internet connection"),
      //   translate("Try Again"),
      //   () => {
      //     setTimeout(() => {
      //       this._handleConnectivityChange({ isConnected: false });
      //     }, 1000);
      //   }
      // );
    }
  };

  _orientationDidChange = (orientation) => {
    const { width, height } = Dimensions.get("window");

    this.props.onChangeOrientation(width, height, orientation);

    if (orientation === "LANDSCAPE") {
    } else {
      // do something with portrait layout
    }
  };

  render() {
    const animatedStyle = {
      width: this.state.animationValue,
      height: this.state.animationValue,
    };
    const { isLoginViewShow, isAPICalled } = this.state;
    const {
      isNetworkAvailable,
      appLogoUrl,
      appSplashUrl,
      appSplashLogoUrl,
      appSplashVideoUrl,
    } = this.props;
    let dirs = RNFetchBlob.fs.dirs;

    let path = "";
    if (Constants.IS_ANDROID) {
      path = "file:///" + dirs.DocumentDir + "/splashImage.png";
    } else {
      path = dirs.DocumentDir + "/splashImage.png";
    }

    let splashLogoPath = "";
    if (Constants.IS_ANDROID) {
      splashLogoPath = "file:///" + dirs.DocumentDir + "/splashLogo.png";
    } else {
      splashLogoPath = dirs.DocumentDir + "/splashLogo.png";
    }

    let videoPath = "";
    if (Constants.IS_ANDROID) {
      videoPath =
        "file:///" +
        dirs.DocumentDir +
        "/splashVideo." +
        appSplashVideoUrl.split(".").pop();
    } else {
      videoPath =
        dirs.DocumentDir + "/splashVideo." + appSplashVideoUrl.split(".").pop();
    }

    return (
      <View style={{ flex: 1 }}>
        <StatusBar
          barStyle="light-content"
          backgroundColor="transparent"
          translucent={true}
        />

        {isNetworkAvailable && isAPICalled ? (
          <View style={{ flex: 1 }}>
            {appSplashVideoUrl !== "" ? (
              <Video
                ref={(videoPlayer) => (this.player = videoPlayer)}
                source={{ uri: videoPath }}
                resizeMode="cover"
                muted={true}
                repeat={true}
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  bottom: 0,
                  left: 0,
                }}
              />
            ) : (
              <ImageBackground
                source={
                  appSplashUrl !== ""
                    ? { uri: path }
                    : Images.placeHolderProduct
                }
                style={{
                  width: Constants.screenWidth,
                  height: Constants.SCREEN_HEIGHT,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    // backgroundColor: Constants.APP_THEME_COLOR,
                  }}
                >
                  {/* <Animated.Image
                  style={[{}, animatedStyle]}
                  source={{ uri: appLogoUrl }}
                  resizeMode={"contain"}
                  /> */}

                  <Image
                    style={{ width: 200, height: 200 }}
                    source={{ uri: splashLogoPath }}
                    resizeMode={"contain"}
                  />
                </View>
                <Modal isVisible={isLoginViewShow}>
                  <View style={{ flex: 1 }}>
                    <Login
                      didTapOnclose={() => {
                        this.setState({ isLoginViewShow: false });
                        this._navigateToScreen("Tab");
                      }}
                    />
                  </View>
                </Modal>
              </ImageBackground>
            )}
          </View>
        ) : (
          !isNetworkAvailable && (
            <View style={{ flex: 1 }}>
              <EmptyDataPlaceholder
                titleText={"No internet connection"}
                descriptionText={
                  "Please restore your internet connection and try again."
                }
                placeHolderImage={Images.NetworkError}
                buttonText={"Try again"}
                didTapOnButton={() => {
                  setTimeout(() => {
                    this._handleConnectivityChange({ isConnected: false });
                  }, 1000);
                }}
              />
            </View>
          )
        )}
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    isNetworkAvailable: state.appReducer.isNetworkAvailable,
    loginReducer: state.loginReducer,
    selectedLanguage: state.appReducer.selectedLanguage,
    stores: state.appReducer.stores,
    storesView: state.appReducer.storesView,
    storeCode: state.appReducer.storeCode,
    userToken: state.appReducer.userToken,
    userName: state.loginReducer.userName,
    password: state.loginReducer.password,
    enableBiometricAuth: state.appReducer.enableBiometricAuth,
    appSplashUrl: state.homeReducer.appSplashUrl,
    appSplashVideoUrl: state.homeReducer.appSplashVideoUrl,
    appSplashLogoUrl: state.homeReducer.appSplashLogoUrl,
    appLogoUrl: state.appReducer.appLogo || "",
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateDeviceType: (devicetype) => {
      dispatch(appActions.updateDeviceType(devicetype));
    },
    onChangeNetworkStatus: (networkStatus) => {
      dispatch(appActions.onChangeNetworkStatus(networkStatus));
    },
    onChangeOrientation: (screenWidth, screenHeight, orientation) => {
      dispatch(
        appActions.onChangeOrientation(screenWidth, screenHeight, orientation)
      );
    },
    getStores: (getStoreInfoCallback) => {
      dispatch(storeActions.getStores(getStoreInfoCallback));
    },
    reOpenApp: (callback) => {
      dispatch(loginActions.reOpenApp(callback));
    },
    userDidLogOut: () => {
      dispatch(loginActions.userDidLogOut());
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PreLoaderScreen);

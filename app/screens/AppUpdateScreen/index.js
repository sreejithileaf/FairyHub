/**
 * Created by Jebin for iLeaf Solutions Pvt.Ltd
 * on February 12, 2020
 * AppUpdateScreen - UI starts from this screen (Initial data loading token updating, netinfo updating etc.)
 */

import {
  View,
  Text,
  Image,
  Linking,
  Animated,
  StatusBar,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
  ImageBackground,
} from "react-native";
import Images from "../../config/images";
import { connect } from "react-redux";
import Modal from "react-native-modal";
import React, { Component } from "react";
import Constants from "../../config/constants";
import DeviceInfo from "react-native-device-info";
import Orientation from "react-native-orientation";
import * as RNLocalize from "react-native-localize";
import NetInfo from "@react-native-community/netinfo";
import SplashScreen from "react-native-splash-screen";
import * as appActions from "../../actions/appActions";
import * as storeActions from "../../actions/storeActions";
import * as categoryActions from "../../actions/categoryActions";
import EmptyDataPlaceholder from "../../components/emptyDataPlaceholder";
import RNFetchBlob from "rn-fetch-blob";

import { showSingleAlert, showAlertWithCallback } from "../../config/common";

class AppUpdateScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAPICalled: false,
      animationValue: new Animated.Value(200),
      isLoginViewShow: false,
      isNetworkAvailableChecked: false,
    };
  }

  componentDidMount() {}

  componentWillUnmount() {}

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
    } = this.props;

    let message = this.props.navigation.state.params.message;
    let type = this.props.navigation.state.params.type;

    if (type === "maintenance") {
      return (
        <View style={{ flex: 1 }}>
          <View style={{ flex: 1 }}>
            <EmptyDataPlaceholder
              titleText={"Maintenance break"}
              descriptionText={message}
              placeHolderImage={Images.NetworkError}
              // buttonText={"Try again"}
              didTapOnButton={() => {
                //TODO
              }}
            />
          </View>
        </View>
      );
    }

    if (type == "update") {
      return (
        <View style={{ flex: 1 }}>
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: Constants.APP_SEPARATOR_COLOR,
            }}
          >
            <View
              style={{
                width: "85%",
                backgroundColor: "white",
                borderRadius: 10,
              }}
            >
              <Text
                style={{
                  fontFamily: Constants.Fonts.BOLD,
                  textAlign: "center",
                  marginVertical: 20,
                  fontSize: 18,
                }}
              >
                {"Upgrade to continue"}
              </Text>
              <Text
                style={{
                  fontFamily: Constants.Fonts.REGULAR,
                  textAlign: "center",
                  marginVertical: 20,
                  fontSize: 16,
                  marginHorizontal: 20,
                  marginTop: 0,
                  color: Constants.APP_GRAY_COLOR,
                }}
              >
                {message}
              </Text>
              <View
                style={{
                  height: 1,
                  backgroundColor: Constants.APP_SEPARATOR_COLOR,
                }}
              />
              <TouchableOpacity
                onPress={() => {
                  if (Constants.IS_ANDROID) {
                    Linking.canOpenURL(`market://details?id=com.fairyhub.app`)
                      .then(() => {
                        Linking.openURL(`market://details?id=com.fairyhub.app`);
                      })
                      .catch();
                  } else {
                    Linking.canOpenURL(
                      `itms-apps://itunes.apple.com/us/app/id1422685012`
                    )
                      .then(() => {
                        Linking.openURL(
                          `itms-apps://itunes.apple.com/us/app/id1422685012`
                        );
                      })
                      .catch();
                  }
                }}
                style={{}}
              >
                <Text
                  style={{
                    fontFamily: Constants.Fonts.BOLD,
                    textAlign: "center",
                    marginVertical: 15,
                    fontSize: 18,
                    color: "rgb(0,122,255)",
                  }}
                >
                  {"Update"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    }

    return (
      <View style={{ flex: 1 }}>
        <StatusBar
          barStyle="light-content"
          backgroundColor="transparent"
          translucent={true}
        />
        <View style={{ flex: 1 }}>
          <EmptyDataPlaceholder
            titleText={"Maintenance break"}
            descriptionText={message}
            placeHolderImage={Images.NetworkError}
            buttonText={"Try again"}
            didTapOnButton={() => {
              //TODO
            }}
          />
        </View>
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    // isNetworkAvailable: state.appReducer.isNetworkAvailable,
    // loginReducer: state.loginReducer,
    // selectedLanguage: state.appReducer.selectedLanguage,
    // stores: state.appReducer.stores,
    // storesView: state.appReducer.storesView,
    // storeCode: state.appReducer.storeCode,
    // userToken: state.appReducer.userToken,
    // userName: state.loginReducer.userName,
    // password: state.loginReducer.password,
    // enableBiometricAuth: state.appReducer.enableBiometricAuth,
    // appSplashUrl: state.homeReducer.appSplashUrl,
    // appSplashLogoUrl: state.homeReducer.appSplashLogoUrl,
    // appLogoUrl: state.appReducer.appLogo || "",
  };
}

function mapDispatchToProps(dispatch) {
  return {
    // reOpenApp: (callback) => {
    //   dispatch(loginActions.reOpenApp(callback));
    // },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AppUpdateScreen);

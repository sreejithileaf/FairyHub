import {
  Text,
  View,
  FlatList,
  StatusBar,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import moment from "moment";
import styles from "./styles";
import Modal from "react-native-modal";
import React, { Component } from "react";
import Images from "../../config/images";
import { isEmpty, showSimpleSnackbar } from "../../config/common";
import Constants from "../../config/constants";
import Countries from "../../lib/countires.js";
import HudView from "../../components/hudView";
import ItemCell from "../../components/itemCell";
import { translate } from "../../config/languageSwitching/index";
import EmptyDataPlaceholder from "../../components/emptyDataPlaceholder";
import { WebView } from "react-native-webview";
import Login from "../LoginScreen";
import { showSingleAlert } from "../../config/common";
import NavigationHeader from "../../components/NavigationHeaders/NavigationHeader1";

class DeepLinkAuthScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaderVisible: true,
      isLoginViewShow: false,
      resetPasswordUrl: "",
      title: "",
      type: "",
    };
  }

  componentDidMount() {
    let data = this.props.navigation.state.params;
    this.setState({
      resetPasswordUrl: data.dataUrl,
      title: data.title,
      type: data.type,
    });
  }

  _didTapOnBackButton = () => {};

  _onLoad = (state) => {
    if (
      state.url.indexOf("/login") > -1 &&
      this.state.type === "RESET_PASSWORD"
    ) {
      this.setState({ isShowResetPasswordView: false, resetPasswordUrl: "" });
      setTimeout(() => {
        this.setState({ isLoginViewShow: true });
      }, 500);
    } else if (
      state.url.indexOf("/login") > -1 &&
      this.state.type === "ACCOUNT_VERIFY"
    ) {
      showSingleAlert(translate("Account verified"), "OK", () => {
        this.navigate();
      });
    }
  };

  navigate = () => {
    if (this.state.type === "RESET_PASSWORD") {
      global.isDeepLinkOpenResetPassword = true;
    } else if (this.state.type === "ACCOUNT_VERIFY") {
      global.isDeepLinkOpenAccountConfirm = true;
    }
    this.props.navigation.navigate("Tab");
  };

  render() {
    const run2 = `
                document.getElementsByTagName('header')[0].style.display="none";
                document.getElementsByTagName('footer')[0].style.display="none";
                document.getElementsByClassName('main-content')[0].style.padding="0px";
                document.getElementsByClassName('tawk-min-container')[0].style.display="none";
                `;
    const { isLoginViewShow, title } = this.state;
    return (
      <SafeAreaView
        style={{
          margin: 0,
          flex: 1,
          backgroundColor: "rgb(255,255,255)",
        }}
      >
        <NavigationHeader
          isWishlist={false}
          hideSearch={true}
          title={title}
          showBackButton={true}
          didTapOnLeftButton={() => {
            this.setState({
              loaderVisible: false,
            });
            this.navigate();
          }}
          isRTL={this.props.isRTL}
        />
        <WebView
          ref={(c) => (this._webview = c)}
          source={{
            uri: this.state.resetPasswordUrl,
          }}
          onLoadStart={() => this.setState({ loaderVisible: true })}
          onLoadEnd={() => {
            this.setState({ loaderVisible: false });
            if (this._webview) {
              setTimeout(() => {
                this._webview && this._webview.injectJavaScript(run2);
              }, 5000);
            }
          }}
          onNavigationStateChange={this._onLoad}
          onError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.log("-------WebView error: ", nativeEvent);
            this.setState({
              loaderVisible: false,
              resetPasswordUrl: "",
            });
            showSingleAlert(translate("API_Failed"), "Ok", () => {});
          }}
          // injectedJavaScript={jsCode}
          javaScriptEnabledAndroid={true}
          injectedJavaScript={run2}
        />
        {this.state.loaderVisible && <HudView />}
        <Modal
          onBackButtonPress={() => {
            this.setState({ isLoginViewShow: false });
            this.navigate();
          }}
          isVisible={isLoginViewShow}
          style={{ margin: 0 }}
        >
          <View style={{ flex: 1 }}>
            <Login
              didTapOnclose={() => {
                this.setState({ isLoginViewShow: false });
                this.navigate();
              }}
            />
          </View>
        </Modal>
      </SafeAreaView>
    );
  }
}

export default DeepLinkAuthScreen;

/**
 * Created by iLeaf Solutions Pvt.Ltd
 * on February 19, 2020
 * AddressListView - Address List View will show the Addresses of user.
 */

import {
  View,
  Text,
  Image,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Styles from "./style";
import { WebView } from "react-native-webview";
import HudView from "../../components/hudView";
import React, { Component, memo } from "react";
import NavigationHeader1 from "../../components/NavigationHeaders/NavigationHeader1";

class OthersScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loaderVisible: true,
    };
  }

  componentDidMount() {
    const { params } = this.props.navigation.state;
    // console.log("isRTL", params.qty);
    this.setState({
      heading: params.heading,
      url: params.url,
    });
  }

  //Header Back Arrow Function
  _didTapOnBackButton = () => {
    this.props.navigation.goBack();
  };

  render() {
    const { secureTextEntry, errors = {} } = this.state;
    const { addressList, isLoading, isRTL } = this.props;

    // webView.evaluateJavaScript("document.getElementById('zls_ctn_wrap').style.display = 'none'", completionHandler: nil)
    //     webView.evaluateJavaScript("$('header').remove();", completionHandler: nil)
    //     webView.evaluateJavaScript("$('footer').remove();", completionHandler: nil)
    //     webView.evaluateJavaScript("document.getElementsByClassName('title-bar')[0].style.display = 'none'", completionHandler: nil)

    // const jsCode = `document.getElementById('zls_ctn_wrap').style.display = 'none';
    //  document.getElementsByClassName('title-bar')[0].style.display = 'none';
    //  `;
    return (
      <SafeAreaView style={Styles.container}>
        <NavigationHeader1
          // hideBottomLine
          title={this.state.heading}
          hideSearch={true}
          showBackButton={true}
          didTapOnLeftButton={this._didTapOnBackButton}
          isRTL={isRTL}
        />
        <View style={Styles.safeContainer}>
          <WebView
            source={{
              uri: this.state.url,
            }}
            onLoadStart={() => this.setState({ loaderVisible: true })}
            onLoadEnd={() => this.setState({ loaderVisible: false })}
            // javaScriptEnabledAndroid={true}
            // injectedJavaScript={jsCode}
          />
        </View>
        {this.state.loaderVisible && <HudView />}
      </SafeAreaView>
    );
  }
}

export default OthersScreen;

/**
 * Created by ILeaf solutions
 * on July 03, 2019
 * HudView - App loading screen.
 */

import React, { Component } from "react";
import Constants from "../config/constants";
import { View, ActivityIndicator, Image } from "react-native";
import Images from "../config/images";
import RNFetchBlob from "rn-fetch-blob";
import { connect } from "react-redux";

class HudView extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      styles,
      parentStyle,
      loaderLogoUrl,
      loaderMainLogoUrl,
    } = this.props;
    let dirs = RNFetchBlob.fs.dirs;
    let path = "";
    if (Constants.IS_ANDROID) {
      path = "file:///" + dirs.DocumentDir + "/loaderImage.png";
    } else {
      path = dirs.DocumentDir + "/loaderImage.png";
    }

    if (loaderLogoUrl === "") {
      path = Images.logo2;
    } else {
      path = { uri: path };
    }

    let mainLogoPath = "";

    var filename = loaderMainLogoUrl.replace(/^.*[\\\/]/, "");

    if (Constants.IS_ANDROID) {
      mainLogoPath = "file:///" + dirs.DocumentDir + "/" + filename;
    } else {
      mainLogoPath = dirs.DocumentDir + "/" + filename;
    }

    if (loaderMainLogoUrl === "") {
      mainLogoPath = Images.loadingImage;
    } else {
      mainLogoPath = { uri: mainLogoPath };
    }

    return (
      <View
        style={[
          {
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(255,255,255,0.5)",
          },
          parentStyle ? parentStyle : null,
        ]}
      >
        <Image
          style={{
            resizeMode: "contain",
            width: 200,
            height: 90,
            marginBottom: -60,
          }}
          // source={{ uri: path }}
          source={path}
        />
        <View
          style={[
            {
              width: 200,
              height: 200,
              backgroundColor: "rgba(255,255,255,0)",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 5,
              overflow: "hidden",
              // backgroundColor: "red",
            },
            styles ? styles : null,
          ]}
        >
          <Image
            style={{ width: 200, height: 200, marginTop: 50 }}
            source={mainLogoPath}
          />
          {/* <ActivityIndicator size="large" color={Constants.APP_THEME_COLOR} /> */}
        </View>
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    loaderLogoUrl: state.homeReducer.loaderLogoUrl,
    loaderMainLogoUrl: state.homeReducer.loaderMainLogoUrl,
  };
}

function mapDispatchToProps(dispatch) {
  return {};
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HudView);

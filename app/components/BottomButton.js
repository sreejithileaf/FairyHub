import React, { Component } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Animated,
  Easing,
  TouchableWithoutFeedback,
} from "react-native";
import Constants from "../config/constants";
import { normalizedWidth, normalizedHeight } from "../config/common";

import Ripple from "react-native-material-ripple";

var scaleValue = new Animated.Value(0);

export default class BottomButton extends Component {
  scale = () => {
    scaleValue.setValue(0);
    Animated.timing(scaleValue, {
      toValue: 1,
      duration: 300,
      easing: Easing.easeOutBack,
    }).start();
  };

  onPress = () => {
    this.scale();
  };

  getContent = () => {
    return <Text style={{}}>{"props.label"}</Text>;
  };

  render() {
    const { buttonText, onButtonClick, disabled } = this.props;
    const buttonScale = scaleValue.interpolate({
      // inputRange: [0, 0.5, 1],
      // outputRange: [1, 1.1, 1],
      inputRange: [0, 0.5, 1],
      outputRange: [1, 1.2, 1],
    });
    return (
      <View style={{ paddingHorizontal: 30, marginTop: 30 }}>
        <Ripple
          rippleDuration={1000}
          onPress={() => {
            this.onPress();
            onButtonClick();
          }}
          disabled={disabled}
        >
          {/* <TouchableOpacity
          style={{}}
          activeOpacity={0.7}
          onPress={() => {
            this.onPress();
            onButtonClick();
          }}
        > */}
          <Animated.View
            style={[
              {
                width: "100%",
                height: 47,
                // justifyContent: "center",
                // alignItems: "center",
                borderRadius: 24,
                backgroundColor: disabled
                  ? "rgba(246,125,32,0.7)"
                  : Constants.APP_THEME_COLOR2,
                overflow: "hidden",
              },
              {
                // transform: [{ scale: buttonScale }],
                alignItems: "center",
                justifyContent: "center",
              },
            ]}
          >
            <Text
              style={{
                color: Constants.APP_WHITE_COLOR,
                fontSize: 18,
                // paddingVertical: 14,
                fontFamily: Constants.Fonts.BOLD,
                textAlign: "center",
              }}
            >
              {buttonText.toUpperCase()}
            </Text>
          </Animated.View>
          {/* </TouchableOpacity> */}
        </Ripple>
      </View>
    );
  }
}

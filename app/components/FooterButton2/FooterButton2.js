import styles from "./styles";
import React, { Component } from "react";
import { Text, View } from "react-native";
import constants from "../../config/constants";
import { TouchableOpacity } from "react-native-gesture-handler";
import { normalizedWidth, normalizedHeight } from "../../config/common";

export default class FooterButton2 extends Component {
  render() {
    const {
      buttonText1,
      buttonText2,
      onButton1Click,
      onButton2Click,
      singleButton,
    } = this.props;
    return (
      <View
        style={[
          styles.container,
          { justifyContent: singleButton ? "center" : "space-between" },
        ]}
      >
        {!singleButton && (
          <TouchableOpacity
            activeOpacity={constants.ACTIVE_OPACITY}
            style={styles.button1}
            onPress={onButton1Click}
          >
            <Text style={styles.buttonText1}>{buttonText1}</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          activeOpacity={constants.ACTIVE_OPACITY}
          style={[
            styles.button2,
            {
              width: singleButton
                ? constants.SCREEN_WIDTH - 100
                : normalizedWidth(180),
            },
          ]}
          onPress={onButton2Click}
        >
          <Text style={styles.buttonText2}>{buttonText2}</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

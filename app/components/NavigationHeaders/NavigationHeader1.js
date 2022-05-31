/**
 * Created by Jebin for iLeaf Solutions Pvt.Ltd
 * on February 17, 2020
 * NavigationHeader - Navigation header component.
 */

import styles from "./styles";
import Images from "../../config/images";
import React, { Component } from "react";
import Constants from "../../config/constants";
import { View, Text, Image, TouchableOpacity } from "react-native";

class NavigationHeader1 extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      title,
      didTapOnLeftButton,
      isRTL,
      hideBottomLine,
      RightButtonComponent1,
      didTapOnRightButton1,
      bottomBorderWidth,
      extraStyle,
    } = this.props;
    return (
      <View>
        <View
          style={[
            styles.container,
            {
              borderBottomWidth: hideBottomLine
                ? 0
                : bottomBorderWidth
                ? bottomBorderWidth
                : 1,
              backgroundColor: "white",
            },
            extraStyle,
          ]}
        >
          <TouchableOpacity
            onPress={didTapOnLeftButton && didTapOnLeftButton}
            hitSlop={{ top: 20, bottom: 20, left: 50, right: 50 }}
          >
            <Image
              source={Images.backButton}
              resizeMode={"contain"}
              style={{
                marginLeft: 20,
                marginRight: 20,
                // width: 24,
                height: 18,
                transform: [{ rotate: isRTL ? "180deg" : "0deg" }],
              }}
            />
          </TouchableOpacity>
          <Text style={styles.titleText}>{title}</Text>
          {RightButtonComponent1 ? (
            <TouchableOpacity
              style={{
                width: 60,
                alignItems: "center",
                justifyContent: "center",
              }}
              onPress={didTapOnRightButton1 && didTapOnRightButton1}
            >
              <RightButtonComponent1 />
            </TouchableOpacity>
          ) : (
            <View style={{ width: 44 }} />
          )}
        </View>
      </View>
    );
  }
}
export default NavigationHeader1;

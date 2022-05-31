/**
 * Created by Kareem for iLeaf Solutions Pvt.Ltd
 * on July 07, 2020
 * NavigationHeader3 - Navigation header component.
 */
import React, { Component } from "react";
import { Text, View, TouchableOpacity, Image } from "react-native";
import styles from "./styles";
import constants from "../../config/constants";
import images from "../../config/images";
import { translate } from "../../config/languageSwitching";

export default class NavigationHeader3 extends Component {
  render() {
    const {
      navigationBackgroundColor,
      hideBottomLine,
      isDark,
      navigation,
      handleReset,
    } = this.props;

    return (
      <View>
        <View
          style={[
            styles.container,
            {
              backgroundColor: navigationBackgroundColor
                ? navigationBackgroundColor
                : constants.APP_WHITE_COLOR,
              borderBottomWidth: hideBottomLine ? 0 : 1,
            },
          ]}
        >
          <View style={styles.subContainer}>
            <View style={styles.row}>
              <TouchableOpacity
                style={{
                  height: 40,
                  width: 35,
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 10,
                  // marginLeft: 10,
                }}
                hitSlop={{ top: 20, bottom: 20, left: 5, right: 5 }}
                onPress={() => navigation.goBack()}
              >
                <Image
                  source={images.cross}
                  resizeMode={"contain"}
                  style={{
                    tintColor: isDark
                      ? constants.APP_GRAY_COLOR2
                      : constants.APP_BLACK_COLOR,
                    width: 35,
                    height: 35,
                  }}
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.titleText2}>{translate("Filter")}</Text>
            <TouchableOpacity onPress={handleReset}>
              <Text style={styles.rightText}>{translate("RESET")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

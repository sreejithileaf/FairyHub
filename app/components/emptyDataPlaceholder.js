/**
 * Created by ILeaf solutions
 * on March 12, 2020
 * EmptyDataPlaceholder -
 */

import React, { Component } from "react";
import Constants from "../config/constants";
import { View, Image, Text, TouchableOpacity } from "react-native";
import { normalizedWidth, normalizedHeight } from "../config/common";
import { translate } from "../config/languageSwitching";

export default class EmptyDataPlaceholder extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      titleText,
      descriptionText,
      placeHolderImage,
      imageStyle,
      buttonText,
      didTapOnButton,
      isFromSearchScreen,
    } = this.props;
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: Constants.APP_WHITE_COLOR,
        }}
      >
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            marginTop: isFromSearchScreen ? 0 : -150, //-(normalizedWidth(300) / 2),
          }}
        >
          <Image
            resizeMode="contain"
            style={[
              {
                width: normalizedHeight(200),
                height: normalizedHeight(200),
              },
              imageStyle,
            ]}
            source={placeHolderImage}
          />
          <Text
            style={{
              fontFamily: Constants.Fonts.MEDIUM,
              fontSize: 20,
              color: "rgb(112,112,112)",
              textAlign: "center",
            }}
          >
            {titleText}
          </Text>
          <Text
            style={{
              fontFamily: Constants.Fonts.REGULAR,
              fontSize: 14,
              color: "rgb(194,194,194)",
              paddingHorizontal: 105,
              textAlign: "center",
              marginTop: 10,
            }}
          >
            {descriptionText}
          </Text>

          {buttonText && buttonText.length > 0 && (
            <TouchableOpacity
              style={{
                height: 30,
                width: 125,
                borderRadius: 5,
                borderWidth: 1,
                marginTop: 25,
                borderColor: constants.APP_THEME_COLOR,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: Constants.APP_WHITE_COLOR,
              }}
              onPress={didTapOnButton && didTapOnButton}
            >
              <Text
                style={{
                  fontFamily: constants.Fonts.REGULAR,
                  fontSize: 14,
                  textAlign: "left",
                  color: Constants.APP_THEME_COLOR,
                }}
              >
                {buttonText}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }
}

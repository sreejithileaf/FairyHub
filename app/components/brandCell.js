/**
 * Created by Jebin for iLeaf Solutions Pvt.Ltd
 * on February 10, 2021
 * Brand Cell - Brands item cell
 */

import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import React, { Component } from "react";
import Constants from "../config/constants";
import Images from "../config/images";
import { normalizedHeight, normalizedWidth } from "../config/common";
import { translate } from "../config/languageSwitching/index";
import ImageComponent from "./ImageComponent";

const BrandCell = React.memo(
  ({ data, index, didTapOnBrand, appMediaBaseUrl }) => {
    let imageUrl = appMediaBaseUrl + data.image;

    return (
      <TouchableOpacity
        onPress={() => {
          didTapOnBrand();
        }}
      >
        <View style={{ alignItems: "center", marginHorizontal: 5 }}>
          <ImageComponent
            key={index + "brandId"}
            source={{
              uri: imageUrl,
            }}
            style={{
              height: normalizedHeight(80),
              width: normalizedHeight(80),
            }}
          />
          <Text
            style={{
              marginVertical: 10,
              fontFamily: Constants.Fonts.REGULAR,
              fontSize: 14,
              color: Constants.APP_THEME_COLOR,
            }}
          >
            {data.label}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
);

const styles = StyleSheet.create({});

export default BrandCell;

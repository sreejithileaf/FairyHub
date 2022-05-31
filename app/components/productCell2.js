/**
 * Created by Jebin for iLeaf Solutions Pvt.Ltd
 * on February 26, 2020
 * Product Cell - Product basic info are display here
 */

import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import React, { Component } from "react";
import Constants from "../config/constants";
import Images from "../config/images";
import { normalizedHeight, normalizedWidth } from "../config/common";
import { translate } from "../config/languageSwitching/index";
import ImageLoader from "react-native-image-progress";

const ProductCell2 = React.memo(
  ({ item, index, didTapOnItem, currency, isFromProductDetail }) => {
    let itemImage = item.thumbnail
      ? { uri: Constants.APP_S3_BASE_URL + item.thumbnail }
      : "";
    const imageDescription = item.name ? item.name : "";
    let itemCost = item.final_price
      ? item.final_price.toFixed(2) + " " + currency
      : "00 " + currency;

    if (isFromProductDetail) {
      let imageDict = item.image;
      let itemImageArray = imageDict.images ? imageDict.images : [];

      itemImage = itemImageArray.length > 0 ? itemImageArray[0] : "";
      itemImage = { uri: Constants.APP_S3_BASE_URL + itemImage };

      itemCost = item.finalPrice
        ? item.finalPrice.toFixed(2) + " " + currency
        : "00 " + currency;
    }
    return (
      <TouchableOpacity
        activeOpacity={Constants.ACTIVE_OPACITY}
        onPress={() => didTapOnItem(item)}
        style={{
          backgroundColor: Constants.APP_WHITE_COLOR,
          marginRight: 15,
          marginLeft: index == 0 ? 20 : 0,
          marginVertical: 10,
        }}
      >
        <ImageLoader
          source={itemImage}
          resizeMode={"contain"}
          defaultSource={Images.placeHolderProduct}
          style={{
            width: normalizedWidth(162),
            height: normalizedWidth(162),
            borderRadius: 5,
            borderWidth: 1,
            borderColor: Constants.APP_SEPARATOR_COLOR,
          }}
        />
        {/* <Image
          source={itemImage}
          resizeMode={'contain'}
          style={{
            width: normalizedWidth(162),
            height: normalizedWidth(162),
            borderRadius: 5,
            borderWidth: 1,
            borderColor: Constants.APP_SEPARATOR_COLOR,
          }}
        /> */}
        <Text style={[styles.itemTitle2, { width: normalizedWidth(162) }]}>
          {imageDescription}
        </Text>
        <Text style={styles.itemCost}>{itemCost}</Text>
      </TouchableOpacity>
    );
  }
);

const styles = StyleSheet.create({
  itemTitle2: {
    fontSize: 14,
    fontFamily: Constants.Fonts.REGULAR,
    color: Constants.APP_GRAY_COLOR3,
    marginTop: 10,
    textAlign: "left",
  },
  itemCost: {
    fontSize: 12,
    fontFamily: Constants.Fonts.REGULAR,
    color: Constants.APP_THEME_COLOR2,
    marginTop: 5,
    textAlign: "left",
  },
});

export default ProductCell2;

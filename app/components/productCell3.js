/**
 * Created by Jebin for iLeaf Solutions Pvt.Ltd
 * on February 25, 2020
 * Product Cell - Product basic info are display here
 */

import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import React, { Component } from "react";
import Constants from "../config/constants";
import Images from "../config/images";
import { normalizedHeight, normalizedWidth } from "../config/common";
import { translate } from "../config/languageSwitching/index";

import ImageLoader from "react-native-image-progress";

const ProductCell3 = React.memo(
  ({
    data,
    index,
    didSelectAdd,
    didTapOnLikeButton,
    screenWidth,
    numOfColumns,
    currency,
    likeActive,
    isHandset,
    appMediaBaseUrl,
  }) => {
    let imageUrl = appMediaBaseUrl + data.thumbnail;
    let actualPrice = parseFloat(data.price);
    let finalPrice = data.final_price;
    let itemWidth = Constants.IS_ANDROID
      ? (screenWidth - 32) / numOfColumns
      : (screenWidth - 38) / numOfColumns; //32

    let percentage = ((actualPrice - finalPrice) / actualPrice) * 100;
    percentage = Number(percentage.toFixed(1));

    return (
      <TouchableOpacity
        activeOpacity={Constants.ACTIVE_OPACITY}
        style={{
          marginLeft: index == 0 ? 10 : 0,
          // marginLeft: index == 0 ? 0 : 50
          // marginRight: 50
          marginRight: 6,
          // height: normalizedHeight(280),
        }}
        onPress={() => {
          didSelectAdd(data);
        }}
      >
        <View
          style={{
            backgroundColor: Constants.APP_WHITE_COLOR,
            borderWidth: 0.5,
            borderColor: Constants.APP_SEPARATOR_COLOR,
            borderRadius: 10,
            // height: normalizedHeight(280),
            height: isHandset ? 220 : normalizedHeight(280),
            // height: normalizedWidth(219),
            // width: normalizedWidth(176)
            shadowColor: "rgba(112,112,112,0.16)",
            shadowOffset: {
              width: 0,
              height: 3,
            },
            shadowOpacity: 0.5,
            shadowRadius: 4.65,
            elevation: 9,
            marginVertical: 10,
          }}
        >
          <View style={{ overflow: "hidden", alignItems: "center" }}>
            <ImageLoader
              source={{ uri: imageUrl }}
              resizeMode={"contain"}
              defaultSource={Images.placeHolderProduct}
              style={{
                width: 200, //(screenWidth - 32) / numOfColumns, //(Constants.SCREEN_WIDTH - 50) / 2,
                height: isHandset ? 120 : normalizedWidth(120),
                marginTop: 28,
              }}
              renderError={() => {}}
            />
            {percentage > 0 && (
              <View
                style={{
                  position: "absolute",
                  width: 50,
                  height: 20,
                  left: 5,
                  top: 5,
                  backgroundColor: "rgb(139, 197, 81)",
                  borderRadius: 2,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    color: Constants.APP_WHITE_COLOR,
                    fontFamily: Constants.Fonts.REGULAR,
                    fontSize: 9,
                  }}
                >
                  {percentage + " % OFF"}
                </Text>
              </View>
            )}
            {/* {data.is_variants && (
              <View style={styles.variantsContainer}>
                <View style={styles.varientView}>
                  <Image
                    source={Images.variants}
                    resizeMode={"contain"}
                    style={{
                      width: 13, //normalizedWidth(13),
                      height: 13, //normalizedWidth(13),
                    }}
                  />
                  <Text style={styles.variantsText}>
                    {translate("variants")}
                  </Text>
                </View>
              </View>
            )} */}
            {/* {!data.is_in_stock && (
              <View style={[styles.overlay, { width: itemWidth - 4 }]} />
            )}
            {!data.is_in_stock && (
              <Text style={styles.outOfStockText}>
                {translate("Out of stock")}
              </Text>
            )} */}
          </View>
          {/* <TouchableOpacity
            onPress={() => {
              didTapOnLikeButton(likeActive);
            }}
            style={styles.wishListContainer}
          >
            <Image
              source={Images.likeImage}
              resizeMode={"contain"}
              style={{
                width: 15,
                height: 15,
                tintColor: likeActive ? Constants.APP_RED_COLOR : null,
              }}
            />
          </TouchableOpacity> */}
          {/* <TouchableOpacity
            onPress={() => {
              // didTapOnLikeButton(likeActive);
            }}
            style={styles.productTruckContainer}
          >
            <Image
              source={Images.productTruck}
              resizeMode={"contain"}
              style={{
                width: 25,
                height: 15,
              }}
            />
          </TouchableOpacity> */}
          <View
            style={{
              // backgroundColor: "red",
              position: "absolute",
              left: 5,
              right: 5,
              bottom: 5,
              flex: 1,
            }}
          >
            <Text numberOfLines={2} style={[styles.productName]}>
              {data.name}
            </Text>

            <View style={{ marginTop: 5 }}>
              <Text style={[styles.cost]}>
                {Number(finalPrice).toFixed(3) + " " + currency}
              </Text>
              {actualPrice !== finalPrice && (
                <Text style={styles.offerText}>
                  {Number(actualPrice).toFixed(3) + " " + currency}
                </Text>
              )}
            </View>
          </View>
          {/* {percentage > 0 && (
            <View
              style={{
                // height: 20,
                backgroundColor: Constants.APP_BLACK_COLOR,
                position: "absolute",
                top: 10,
                left: 10,
                borderRadius: 3,
              }}
            >
              <Text style={styles.offerTextPercent}>
                {percentage + "% OFF"}
              </Text>
            </View>
          )} */}
          {!data.is_in_stock && (
            <View style={[styles.overlay]}>
              <View style={styles.outOfStockContainer}>
                <Text style={styles.outOfStockText}>
                  {translate("Out of stock")}
                </Text>
              </View>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  }
);

const styles = StyleSheet.create({
  productName: {
    fontFamily: Constants.Fonts.REGULAR,
    fontSize: 12,
    color: Constants.APP_BLACK_COLOR,
    marginTop: 5,
    marginHorizontal: 3,
    textAlign: "center",
  },
  productNameSub: {
    fontFamily: Constants.Fonts.BOLD,
    fontSize: 11,
    color: Constants.APP_GRAY_COLOR,
    marginTop: 5,
    marginHorizontal: 3,
    textAlign: "left",
  },
  outOfStockText: {
    color: "rgb(181,24,24)",
    position: "absolute",
    width: "93%",
    fontSize: 16,
    fontFamily: Constants.Fonts.MEDIUM,
    textAlign: "center",
    textAlignVertical: "center",
    height: normalizedHeight(36),
    alignSelf: "center",
    backgroundColor: "rgba(255,255,255,0.7)",
    bottom: normalizedHeight(30),
    elevation: 3,
  },
  overlay: {
    backgroundColor: "rgba(255,255,255, 0.7)",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    elevation: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  outOfStockContainer: {
    width: "100%",
    height: 35,
    backgroundColor: "rgba(249,249,249,1)",
    alignItems: "center",
    justifyContent: "center",
  },
  outOfStockText: {
    color: "rgb(181,24,24)",
    fontSize: 16,
    fontFamily: Constants.Fonts.MEDIUM,
    textAlign: "center",
    textAlignVertical: "center",
    alignSelf: "center",
    backgroundColor: "rgba(249,249,249,1)",
    width: "100%",
  },
  cost: {
    fontFamily: Constants.Fonts.REGULAR,
    fontSize: 12,
    color: Constants.APP_BLACK_COLOR,
    flex: 1,
    marginStart: 3,
    textAlign: "center",
  },
  offerText: {
    fontFamily: Constants.Fonts.MEDIUM,
    fontSize: 12,
    color: "rgb(174,174,174)",
    textDecorationLine: "line-through",
    marginTop: 3,
    textAlign: "center",
    // marginRight: 20,
    // flex: 1,
  },
  offerTextPercent: {
    fontFamily: Constants.Fonts.REGULAR,
    fontSize: 12,
    color: Constants.APP_WHITE_COLOR,
    margin: 2,
    // marginRight: 20,
    // flex: 1,
  },
  wishListContainer: {
    width: 26, //normalizedWidth(26),
    height: 26, //normalizedWidth(26),
    position: "absolute",
    top: 5,
    right: 1,
    backgroundColor: "rgba(0,0,0,0)",
    borderRadius: 26 / 2, //normalizedWidth(26) / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  productTruckContainer: {
    width: 26, //normalizedWidth(26),
    height: 26, //normalizedWidth(26),
    position: "absolute",
    top: 5,
    left: 7,
    backgroundColor: "rgba(0,0,0,0)",
    borderRadius: 26 / 2, //normalizedWidth(26) / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  variantsContainer: {
    // width: normalizedWidth(26),
    // height: normalizedWidth(26),
    position: "absolute",
    bottom: 10,
    left: 0,
    right: 0,
    backgroundColor: "transparent",
    borderRadius: 26 / 2, //normalizedWidth(26) / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  varientView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(244,246,248,1)",
    height: 18, //normalizedHeight(20),
    width: 70, //normalizedWidth(75),
    borderRadius: 18 / 2, // normalizedHeight(20) / 2,
    borderWidth: 0.5,
    borderColor: "rgba(110,110,110,0.3)",
  },
  variantsText: {
    fontFamily: Constants.Fonts.REGULAR,
    fontSize: 10,
    color: Constants.APP_GRAY_COLOR3,
    marginLeft: 5,
  },
});

export default ProductCell3;

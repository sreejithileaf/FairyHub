/**
 * Created by Kareem for iLeaf Solutions Pvt.Ltd
 * on July 07, 2020
 * NavigationHeader - Navigation header component.
 */

import styles from "./styles";
import React, { Component } from "react";
import Images from "../../config/images";
import Constants from "../../config/constants";
import ImageLoader from "react-native-image-progress";
import { View, TouchableOpacity, Image, Text, Alert } from "react-native";
import { normalizedHeight, normalizedWidth } from "../../config/common";

class NavigationHeader2 extends Component {
  constructor(props) {
    super(props);
  }

  render() {  
    const {
      title,
      didTapOnSearch,
      didTapOnCart,
      hideBottomLine,
      didTapOnFlag,
      isShowFlag,
      isDark,
      showBackButton,
      didTapOnBackButton,
      showFilter,
      didTapOnFilter,
      isRTL,
      showShare,
      resetButton,
      didTapOnReset,
      hideSearch,
      showAddAddress,
      showHome,
      didTapOnAddAddressButton,
      didTapOnHomeButton,
      didTapOnShare,
      showCart,
      countryFlag,
      cartItemsCount,
      isFilterApplied,
      navigationBackgroundColor,
      isWishlist,
      appLogoUrl,
    } = this.props;

    return (
      <View>
        <View
          style={[
            styles.container,
            // {
            //   backgroundColor: navigationBackgroundColor
            //     ? navigationBackgroundColor
            //     : Constants.APP_WHITE_COLOR,
            //   borderBottomWidth: hideBottomLine ? 0 : 1,
            // },
          ]}
        >
          <View style={{ justifyContent: "center" }}>
            {showBackButton ? (
              <TouchableOpacity
                onPress={didTapOnBackButton && didTapOnBackButton}
                hitSlop={{ top: 20, bottom: 20, left: 50, right: 50 }}
              >
                <Image
                  source={Images.backButton}
                  resizeMode={"contain"}
                  style={{
                    marginLeft: 20,
                    // width: 24,
                    height: 18,
                    marginRight: 20,
                    transform: [{ rotate: isRTL ? "180deg" : "0deg" }],
                  }}
                />
              </TouchableOpacity>
            ) : isShowFlag ? (
              <TouchableOpacity
                style={{
                  height: 40,
                  width: 35,
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "row",
                  marginLeft: 15,
                }}
                hitSlop={{ top: 20, bottom: 20, left: 5, right: 5 }}
                onPress={didTapOnFlag && didTapOnFlag}
              >
                <Image
                  source={countryFlag}
                  resizeMode={"cover"}
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: 18 / 2,
                    borderColor: Constants.APP_GRAY_COLOR2,
                    borderWidth: 1,
                  }}
                />
                <Text
                  style={{
                    fontFamily: Constants.Fonts.REGULAR,
                    fontSize: 15,
                    color: "rgb(154,154,154)",
                    marginLeft: 3,
                  }}
                >
                  {isRTL ? "En" : "ع"}
                </Text>
              </TouchableOpacity>
            ) : (
              <View />
            )}
          </View>
          {showBackButton ? (
            title && title.length > 0 ? (
              didTapOnSearch ? (
                <Text style={[styles.titleTextCP, { marginLeft: 45 }]}>
                  {title}
                </Text>
              ) : (
                <Text style={styles.titleTextCP}>{title}</Text>
              )
            ) : (
              <View
                style={{
                  marginLeft: 45,
                  flex: 1,
                  alignItems: "center",
                }}
              >
                <ImageLoader
                  source={{ uri: appLogoUrl }}
                  resizeMode={"contain"}
                  // resizeMode={"cover"}
                  indicator={() => <View style={{ width: 0, height: 0 }} />}
                  defaultSource={Images.logo}
                  style={{
                    height: 55,
                    width: 130,
                    // marginBottom: -5,
                    // marginBottom: 6,
                  }}
                />
              </View>
            )
          ) : (
            <View
              style={{
                marginLeft: 45,
                flex: 1,
                alignItems: "center",
              }}
            >
              {/* <Image
                source={{ uri: appLogoUrl }}
                resizeMode={"contain"}
                style={{
                  height: 53,
                  width: 120,
                }}
              /> */}
              <ImageLoader
                source={{ uri: appLogoUrl }}
                resizeMode={"contain"}
                // resizeMode={"cover"}
                indicator={() => <View style={{ width: 0, height: 0 }} />}
                defaultSource={Images.logo}
                style={{
                  height: 55,
                  width: 130,
                  // marginBottom: -5,
                  // marginBottom: 6,
                }}
              />
            </View>
          )}

          {showFilter && (
            <TouchableOpacity
              style={{
                height: 40,
                width: 35,
                alignItems: "center",
                justifyContent: "center",
              }}
              hitSlop={{ top: 20, bottom: 20, left: 5, right: 5 }}
              onPress={didTapOnFilter && didTapOnFilter}
            >
              <View
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 15,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor:
                    Object.keys(isFilterApplied).length > 1
                      ? Constants.APP_THEME_COLOR
                      : Constants.APP_WHITE_COLOR,
                }}
              >
                <Image
                  source={Images.filter}
                  resizeMode={"cover"}
                  style={{
                    width: 18,
                    height: 18,
                    tintColor: Constants.APP_GRAY_COLOR4,
                  }}
                />
              </View>
            </TouchableOpacity>
          )}

          {showAddAddress && (
            <TouchableOpacity
              style={{
                height: 35,
                width: 35,
                alignItems: "center",
                justifyContent: "center",
                marginRight: 20,
                borderRadius: 5,
                backgroundColor: Constants.APP_THEME_COLOR,
              }}
              hitSlop={{ top: 20, bottom: 20, left: 5, right: 5 }}
              onPress={didTapOnAddAddressButton && didTapOnAddAddressButton}
            >
              <Image
                source={Images.plus2}
                resizeMode={"center"}
                style={{
                  // tintColor: Constants.APP_GRAY_COLOR,
                  width: 15,
                  height: 15,
                }}
              />
            </TouchableOpacity>
          )}

          {showHome && (
            <TouchableOpacity
              hitSlop={{ top: 20, bottom: 20, left: 5, right: 5 }}
              onPress={didTapOnHomeButton && didTapOnHomeButton}
            >
              <Image
                source={Images.homeCheckoutScreen}
                resizeMode={"center"}
                style={{
                  marginLeft: 20,
                  // width: 24,
                  marginRight: 20,
                  // transform: [{ rotate: isRTL ? "180deg" : "0deg" }],
                }}
              />
            </TouchableOpacity>
          )}

          {!hideSearch && (
            <TouchableOpacity
              style={{
                height: 40,
                width: 35,
                alignItems: "center",
                justifyContent: "center",
                marginLeft: 10,
              }}
              hitSlop={{ top: 20, bottom: 20, left: 5, right: 5 }}
              onPress={didTapOnSearch && didTapOnSearch}
            >
              <Image
                source={Images.search}
                resizeMode={"center"}
                style={{
                  // tintColor: Constants.APP_GRAY_COLOR,
                  width: 21,
                  height: 21,
                }}
              />
            </TouchableOpacity>
          )}
          {resetButton && (
            <TouchableOpacity
              style={{
                height: 30,
                width: 60,
                alignItems: "center",
                justifyContent: "center",
                marginRight: 30,
                borderRadius: 15,
                borderWidth: 1,
                borderColor: Constants.APP_BOX_BACKGROUND_GREY,
              }}
              onPress={didTapOnReset && didTapOnReset}
            >
              <Text
                style={{
                  color: Constants.APP_THEME_COLOR,
                  fontFamily: Constants.Fonts.REGULAR,
                  fontSize: 12,
                }}
              >
                RESET
              </Text>
            </TouchableOpacity>
          )}

          {showShare && (
            <TouchableOpacity
              style={{
                height: 40,
                width: 35,
                alignItems: "center",
                justifyContent: "center",
                // marginRight: 10,
                marginLeft: 10,
              }}
              hitSlop={{ top: 20, bottom: 20, left: 5, right: 5 }}
              onPress={didTapOnShare && didTapOnShare}
            >
              <Image
                source={Images.share}
                resizeMode={"contain"}
                style={{
                  width: 18,
                  height: 18,
                }}
              />
            </TouchableOpacity>
          )}

          {showCart && (
            <TouchableOpacity
              style={{
                height: 40,
                width: 35,
                alignItems: "center",
                justifyContent: "center",
                marginRight: 10,
                marginLeft: 10,
              }}
              hitSlop={{ top: 20, bottom: 20, left: 5, right: 5 }}
              onPress={didTapOnCart && didTapOnCart}
            >
              <Image
                source={Images.cart}
                resizeMode={"contain"}
                style={{
                  // tintColor: Constants.APP_GRAY_COLOR,
                  width: 21,
                  height: 21,
                }}
              />
              {cartItemsCount > 0 && (
                <View
                  style={{
                    position: "absolute",
                    bottom: 8,
                    right: 0,
                    flex: 1,
                    height: 15,
                    borderRadius: 7.5,
                    backgroundColor: Constants.APP_THEME_COLOR,
                    alignItems: "center",
                    justifyContent: "center",
                    minWidth: 15,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: Constants.Fonts.BOLD,
                      fontSize: 8,
                      color: Constants.APP_WHITE_COLOR,
                    }}
                  >
                    {cartItemsCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }
}
export default NavigationHeader2;

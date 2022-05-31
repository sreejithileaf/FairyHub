/**
 * Created by Jebin for iLeaf Solutions Pvt.Ltd
 * on February 25, 2020
 * Product Cell - Product basic info are display here
 */

import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import React, {Component} from 'react';
import Constants from '../config/constants';
import Images from '../config/images';
import {normalizedHeight, normalizedWidth} from '../config/common';
import {translate} from '../config/languageSwitching/index';
import ImageComponent from './ImageComponent';
import ImageLoader from 'react-native-image-progress';
import images from '../config/images';

const ProductCell = React.memo(
  ({
    data,
    index,
    didSelectAdd,
    didTapOnLikeButton,
    didTapOnAddToCart,
    screenWidth,
    numOfColumns,
    currency,
    likeActive,
    productsDeliveryTypes,
    appMediaBaseUrl,
    totalItemsCount,
    isHandset,
    didTapOnVideo,
  }) => {
    // console.log('ITEM', data);
    // console.log('INDEX', index);

    let imageUrl = appMediaBaseUrl + data.thumbnail;
    let actualPrice = data.price;
    let finalPrice = data.final_price;
    let itemWidth = Constants.IS_ANDROID
      ? (screenWidth - 32) / numOfColumns
      : (screenWidth - 55) / numOfColumns; //32//28
    let percentage = ((actualPrice - finalPrice) / actualPrice) * 100;
    percentage = Number(percentage.toFixed(1));

    let deliveryType = 0;
    if (data.delivery_type) {
      switch (data.delivery_type) {
        case '5576':
          deliveryType = 1; // Same Day Delivery
          break;
        case '5615':
          deliveryType = 2; // Scheduled delivery
          break;
        case '5616':
          deliveryType = 0; // None
          break;
      }
    }

    let isColorVarient = false;
    let isAgeVarient = false;
    if (data.child && data.child) {
      if (data.child.attributes) {
        const {size, color} = data.child.attributes;
        if (size.attribute_value) {
          isAgeVarient = true;
        }
        if (color.attribute_value) {
          isColorVarient = true;
        }
      }
    }

    return (
      <TouchableOpacity
        // key={index}
        activeOpacity={Constants.ACTIVE_OPACITY}
        style={{
          // marginTop: index == 0 || index == 1 ? 15 : 0,
          // width: (Constants.SCREEN_WIDTH - 40) / 4,
          padding: 4,
          // height: normalizedHeight(numOfColumns == 2 ? 420 : 320),
          elevation: 10,
          shadowColor: Constants.APP_TRANSPARENT_COLOR, //Constants.APP_GRAY_COLOR,
          shadowOpacity: 0.35,
          shadowRadius: 3,
        }}
        onPress={() => {
          didSelectAdd(data);
        }}>
        <View
          style={{
            backgroundColor: Constants.APP_WHITE_COLOR,
            borderRadius: 15,
            height:
              numOfColumns == 2
                ? 260
                : normalizedHeight(numOfColumns == 2 ? 380 : 300),
            overflow: 'hidden',
          }}>
          <View
            style={{
              //   width: itemWidth,
              // height: normalizedHeight(300), alignItems: "center",
              justifyContent: 'center',
            }}>
            <View
              style={{
                paddingTop: normalizedWidth(31),
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <ImageComponent
                // key={Math.random()}
                source={{
                  uri: imageUrl,
                }}
                style={{
                  // width: 100, //(screenWidth - 32) / numOfColumns, //(Constants.SCREEN_WIDTH - 50) / 2,
                  height: numOfColumns == 2 ? 150 : normalizedHeight(180),
                  width: normalizedHeight(180),
                }}
              />
            </View>

            {percentage > 0 && (
              <View
                style={{
                  position: 'absolute',
                  width: 50,
                  height: 20,
                  left: 10,
                  top: 10,
                  backgroundColor: 'rgb(139, 197, 81)',
                  borderRadius: 2,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    color: Constants.APP_WHITE_COLOR,
                    fontFamily: Constants.Fonts.REGULAR,
                    fontSize: 9,
                  }}>
                  {percentage + ' % OFF'}
                </Text>
              </View>

              // <View
              //   style={{
              //     position: 'absolute',
              //     width: 50,
              //     height: 15,
              //     left: 10,
              //     top: 10,
              //     backgroundColor: 'rgb(169,0,23)', //"rgb(139, 197, 81)",
              //     borderRadius: 4,
              //     alignItems: 'center',
              //     justifyContent: 'center',
              //   }}>
              //   <Text
              //     style={{
              //       color: Constants.APP_WHITE_COLOR,
              //       fontFamily: Constants.Fonts.MYRIAD,
              //       fontSize: 9,
              //     }}>
              //     {'-' + percentage + '%'}
              //   </Text>
              // </View>
            )}
            {(data.status_video_type == 'video' ||
              data.status_video_type == 'image') &&
              data.status_video !== '' && (
                <TouchableOpacity
                  onPress={() => didTapOnVideo(data)}
                  hitSlop={{left: 10, right: 10, top: 10, bottom: 10}}
                  style={{
                    position: 'absolute',
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    top: -1,
                    right: -1,
                    backgroundColor: 'rgb(248,248,248)',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Image
                    style={{width: 30, height: 30, borderRadius: 15}}
                    source={Images.homeVideo}
                  />
                </TouchableOpacity>
              )}
          </View>

          <View
            style={{
              marginHorizontal: 10,
              flex: 1,
            }}>
            <Text numberOfLines={2} style={[styles.productName]}>
              {data.name}
            </Text>
            {/* <Text style={[styles.productName]}>{"Description text"}</Text> */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <View
                style={{
                  marginVertical: 10,
                  marginRight: 5,
                  marginLeft: 5,
                }}>
                <TouchableOpacity
                  onPress={() => {
                    didTapOnLikeButton(likeActive);
                  }}
                  style={styles.wishListContainer}
                  hitSlop={{top: 20, left: 20, right: 20, bottom: 20}}>
                  <Image
                    source={Images.likeImage}
                    resizeMode={'contain'}
                    style={{
                      width: 17,
                      height: 14,
                      tintColor: likeActive ? Constants.APP_RED_COLOR : null,
                    }}
                  />
                </TouchableOpacity>
              </View>
              <View
                style={{
                  marginVertical: 10,
                  // height: 30,
                }}>
                <Text style={[styles.cost]}>
                  {Number(data.final_price).toFixed(3) + ' ' + currency}
                </Text>
                {percentage > 0 && (
                  <Text style={styles.offerText}>
                    {Number(actualPrice).toFixed(3) + ' ' + currency}
                  </Text>
                )}
              </View>
            </View>
          </View>

          {!data.is_in_stock && (
            <View style={[styles.overlay]}>
              <View style={styles.outOfStockContainer}>
                <Text style={styles.outOfStockText}>
                  {translate('Out of stock')}
                </Text>
              </View>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  },
);

const styles = StyleSheet.create({
  productName: {
    fontFamily: Constants.Fonts.REGULAR,
    fontSize: 12,
    color: Constants.APP_BLACK_COLOR,
    marginTop: 5,
    marginHorizontal: 3,
    textAlign: 'left',
    height: 30,
  },
  outOfStockContainer: {
    width: '100%',
    height: 35,
    backgroundColor: 'rgba(249,249,249,1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  outOfStockText: {
    color: 'rgb(181,24,24)',
    fontSize: 16,
    fontFamily: Constants.Fonts.MEDIUM,
    textAlign: 'center',
    textAlignVertical: 'center',
    alignSelf: 'center',
    backgroundColor: 'rgba(249,249,249,1)',
    width: '100%',
  },
  overlay: {
    backgroundColor: 'rgba(255,255,255, 0.7)',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    elevation: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cost: {
    fontFamily: Constants.Fonts.BOLD,
    fontSize: 11,
    color: Constants.APP_BLACK_COLOR,
    marginStart: 3,
    textAlign: 'left',
  },
  offerText: {
    fontFamily: Constants.Fonts.REGULAR,
    fontSize: 12,
    color: 'rgb(174,174,174)',
    textDecorationLine: 'line-through',
    marginStart: 3,
    textAlign: 'left',
    // marginRight: 20,
    // flex: 1,
  },
  offerTextPercent: {
    fontFamily: Constants.Fonts.MEDIUM,
    fontSize: 8,
    color: Constants.APP_WHITE_COLOR,
    position: 'absolute',
    left: 6,
  },
  wishListContainer2: {
    position: 'absolute',
    bottom: 0,
    right: 1,
  },
  wishListContainer: {
    // position: "absolute",
    // top: 12,
    // right: 10,
    // bottom: 10,
    backgroundColor: 'rgba(0,0,0,0)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  productColorContainer: {
    position: 'absolute',
    bottom: 8,
    left: 9,
  },
  productSizeContainer: {
    position: 'absolute',
    bottom: 8,
    left: 44,
  },
  productTruckContainer: {
    position: 'absolute',
    bottom: 13,
    right: 60,
  },
  productOfferContainer: {
    position: 'absolute',
    top: 8,
    left: 10,
  },
  variantsContainer: {
    // width: normalizedWidth(26),
    // height: normalizedWidth(26),
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    borderRadius: 26 / 2, //normalizedWidth(26) / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  varientView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(244,246,248,1)',
    height: 18, //normalizedHeight(20),
    width: 70, //normalizedWidth(75),
    borderRadius: 18 / 2, // normalizedHeight(20) / 2,
    borderWidth: 0.5,
    borderColor: 'rgba(110,110,110,0.3)',
  },
  variantsText: {
    fontFamily: Constants.Fonts.REGULAR,
    fontSize: 10,
    color: Constants.APP_GRAY_COLOR3,
    marginLeft: 5,
  },
});

export default ProductCell;

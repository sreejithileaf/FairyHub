/**
 * Created by Jebin for iLeaf Solutions Pvt.Ltd
 * on March 18, 2020
 * item Cell -
 */

import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import React, {useState, Component} from 'react';
import Constants from '../config/constants';
import Images from '../config/images';
import {
  normalizedHeight,
  normalizedWidth,
  showSingleAlert,
  showSimpleSnackbar,
} from '../config/common';
import {translate} from '../config/languageSwitching/index';
import moment from 'moment';

import ImageLoader from 'react-native-image-progress';
let colorName = [];
let sizeName = [];
const KeyText = ({
  itemKey,
  itemValue,
  keylabel,
  currency,
  orderConfirmationScreen,
}) => {
  let value =
    itemKey === 'TOTAL PRICE' || itemKey === 'Unit Price'
      ? Number(keylabel).toFixed(3) + ' ' + currency
      : keylabel;
  return (
    <View
      style={{
        marginTop: 10,
        flexDirection: 'row',
        // justifyContent: 'flex-start',
      }}>
      <View style={{flexDirection: 'row'}}>
        <Text
          style={{
            fontSize: itemKey === 'TOTAL PRICE' ? 15 : 12.5,
            fontFamily:
              itemKey === 'TOTAL PRICE'
                ? Constants.Fonts.MEDIUM
                : Constants.Fonts.MEDIUM,
            color:
              itemKey === 'TOTAL PRICE'
                ? Constants.APP_BLACK_COLOR
                : Constants.APP_GRAY_COLOR3,
            textAlign: 'left',
          }}>
          {itemValue}
        </Text>
        <Text
          style={{
            fontSize: itemKey === 'TOTAL PRICE' ? 15 : 11,
            fontFamily:
              itemKey === 'TOTAL PRICE'
                ? Constants.Fonts.MEDIUM
                : Constants.Fonts.MEDIUM,
            marginLeft: 5,
          }}>
          :
        </Text>
      </View>
      <View style={{marginLeft: 5}}>
        <Text
          style={{
            fontSize: itemKey === 'TOTAL PRICE' ? 15 : 11,
            fontFamily:
              itemKey === 'TOTAL PRICE'
                ? Constants.Fonts.MEDIUM
                : Constants.Fonts.MEDIUM,
            textAlign: 'left',
            color:
              itemKey === 'TOTAL PRICE'
                ? Constants.APP_BLACK_COLOR
                : Constants.APP_GRAY_COLOR3,
          }}>
          {value}
        </Text>
      </View>
    </View>
  );
};

const QuantityControl = ({
  quantiryItem,
  getQuantity,
  updateCartProduct,
  isNetworkAvailable,
}) => {
  const [quantityValue, setQuantity] = useState(quantiryItem.qty);

  function incrementQuantity() {
    if (!isNetworkAvailable) {
      showSingleAlert(translate('No internet connection'));
      return;
    }

    if (quantityValue >= Constants.MAX_PRODUCT_COUNT) {
      showSimpleSnackbar(
        translate('Product maximum count is') +
          ' ' +
          Constants.MAX_PRODUCT_COUNT,
      );

      // showSingleAlert(
      //   translate('Product maximum count is') +
      //     ' ' +
      //     Constants.MAX_PRODUCT_COUNT,
      // );
      return;
    }

    setQuantity(quantityValue + 1);
    getQuantity(quantityValue + 1);
    updateCartProduct(quantityValue + 1);
  }
  function decrementQuantity() {
    if (!isNetworkAvailable) {
      showSingleAlert(translate('No internet connection'));
      return;
    }
    if (quantityValue - 1 >= 1) {
      setQuantity(quantityValue - 1);
      getQuantity(quantityValue - 1);
      updateCartProduct(quantityValue - 1);
    }
  }
  return (
    <View style={{flexDirection: 'row', marginTop: 15, alignItems: 'center'}}>
      <TouchableOpacity
        onPress={decrementQuantity}
        style={{
          borderWidth: 1,
          borderColor: Constants.APP_GREY_TEXT_COLOR,
          width: 20,
          height: 20,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text
          style={{
            color: Constants.APP_GREY_TEXT_COLOR,
            fontFamily: Constants.Fonts.REGULAR,
          }}>
          -
        </Text>
      </TouchableOpacity>
      <TextInput
        style={{
          marginHorizontal: 14,
          width: 30,
          textAlign: 'center',
          paddingVertical: 0,
          fontSize: 16,
          fontFamily: Constants.Fonts.MEDIUM,
          color: Constants.APP_BLACK_COLOR,
        }}
        value={quantityValue.toString()}
      />

      <TouchableOpacity
        onPress={incrementQuantity}
        style={{
          // marginLeft: 10,
          borderWidth: 1,
          borderColor: Constants.APP_GREY_TEXT_COLOR,
          width: 20,
          height: 20,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text
          style={{
            color: Constants.APP_GREY_TEXT_COLOR,
            fontFamily: Constants.Fonts.REGULAR,
          }}>
          +
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const ItemCell = React.memo(
  ({
    item,
    index,
    productsColors,
    productsSizes,
    addProductToWishList,
    allowAddOption,
    showQuantity,
    orderConfirmationScreen,
    orderHistoryDetailsScreen,
    currency,
    updateCartProductToParent,
    totalCost,
    itemTotalCost,
    appMediaBaseUrl,
    didTapOnItem,
  }) => {
    function removeFromCart() {}

    function addToWishList() {
      addProductToWishList(item);
    }

    function updateCartProduct(qty) {
      updateCartProductToParent(qty, item, index);
    }

    const totalProductGross = item.price * item.qty;
    const [totalGross, setTotalGross] = useState(totalProductGross);

    function getQuantity(quantityValue) {
      setTotalGross(quantityValue * item.price);
    }

    // if (item.product_option && item.product_option.extension_attributes) {
    //   const attributesColor = item.product_option.extension_attributes.configurable_item_options.filter(
    //     (color) => {
    //       return color.option_id === "93";
    //     }
    //   );
    //   const attributesSize = item.product_option.extension_attributes.configurable_item_options.filter(
    //     (size) => {
    //       return size.option_id === "178";
    //     }
    //   );
    //   const colorID = ""; // attributesColor[0].option_value.toString();
    //   const sizeID = ""; //attributesSize[0].option_value.toString();

    //   colorName = productsColors.filter((item) => {
    //     return colorID === item.value;
    //   });
    //   sizeName = productsSizes.filter((item) => {
    //     return sizeID === item.value;
    //   });
    //   console.log("colorName,sizename \n", colorName, sizeName);
    // } else {
    //   colorName = [];
    //   sizeName = [];
    // }

    const imageSource =
      item.extension_attributes && item.extension_attributes.image
        ? {
            uri: appMediaBaseUrl + item.extension_attributes.image,
          }
        : Images.placeHolderProduct;

    let unitPrice = item.price;

    let total = totalGross;

    if (totalCost && totalCost.items) {
      totalCost.items.map((dataItem, index) => {
        if (dataItem.item_id === item.item_id) {
          unitPrice = dataItem.price_incl_tax;
          total = dataItem.row_total;
        }
      });
    }

    if (itemTotalCost) {
      total = itemTotalCost;
    }

    let finalPrice = item.price;
    let actualPrice = item.original_price;

    let percentage = ((actualPrice - finalPrice) / actualPrice) * 100;
    percentage = Number(percentage.toFixed(1));

    let isRefundable =
      item.extension_attributes &&
      item.extension_attributes.is_refundable === '5599'
        ? true
        : false;

    let isAddons = false;
    if (item.extension_attributes && item.extension_attributes.addons) {
      isAddons = true;
    }

    let deliveryDate = '';
    let deliveryTime = '';

    if (
      item.extension_attributes &&
      item.extension_attributes.custom_options &&
      item.extension_attributes.custom_options.length > 0
    ) {
      let customOptionsArray = item.extension_attributes.custom_options;

      customOptionsArray.map(dataItemStr => {
        let dataItem = JSON.parse(dataItemStr);
        if (dataItem.delivery_date) {
          deliveryDate = dataItem.delivery_date.value;
          deliveryDate = moment(deliveryDate).format('MMM DD, YYYY');

          if (deliveryDate === moment().format('MMM DD, YYYY')) {
            deliveryDate = 'Today';
          }
        }
        if (dataItem.delivery_time) {
          deliveryTime = dataItem.delivery_time.value;
        }
      });
    }

    return (
      <View
        style={{
          marginTop: 0,
          backgroundColor: Constants.APP_TRANSPARENT_COLOR,
        }}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            // padding: 10,
            marginTop: 10,
          }}>
          <TouchableOpacity
            onPress={() => {
              if (didTapOnItem) {
                didTapOnItem();
              }
            }}>
            <View
              style={{
                width: 98,
                height: 117,
                borderRadius: 5,
                borderWidth: 0.5,
                borderColor: Constants.APP_SEPARATOR_COLOR,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Image
                source={imageSource}
                defaultSource={Images.placeHolderProduct}
                resizeMode="contain"
                style={{
                  width: 90,
                  height: 100,
                  // marginTop: 25,
                  // marginBottom: 31,
                  // marginLeft: 10,
                  // marginRight: 15,
                }}
              />
              {percentage > 0 && (
                <View
                  style={{
                    position: 'absolute',
                    bottom: 5,
                    left: 10,
                    alignItems: 'center',
                    justifyContent: 'center',
                    // width: 50,
                    // height: 15,
                    // backgroundColor: 'rgb(169,0,23)',
                    height: 20,
                    width: 48,
                    backgroundColor: 'rgb(139,197,81)',
                    // borderRadius: 4,
                  }}>
                  <Text
                    style={{
                      color: Constants.APP_WHITE_COLOR,
                      // fontFamily: Constants.Fonts.MYRIAD,
                      fontFamily: Constants.Fonts.REGULAR,
                      fontSize: 9,
                    }}>
                    {percentage + '% OFF'}
                    {/* {'-' + percentage + '%'} */}
                  </Text>
                </View>
              )}
            </View>
          </TouchableOpacity>

          <View style={{marginHorizontal: 20, flex: 1}}>
            <Text
              multiline={true}
              numberOfLines={0}
              style={{
                flex: 1,
                fontFamily: Constants.Fonts.MEDIUM,
                fontSize: 14,
                color: Constants.APP_BLACK_COLOR,
                textAlign: 'left',
              }}>
              {item.name}
            </Text>

            <View style={{flex: 1}}>
              {orderConfirmationScreen && (
                <View
                  style={{
                    // flexDirection: "row",
                    // alignItems: "center",
                    marginTop: 10,
                  }}>
                  <Text
                    style={{
                      fontSize: 12,
                      fontFamily: Constants.Fonts.REGULAR,
                      color: Constants.APP_GRAY_COLOR,
                      textAlign: 'left',
                    }}>
                    Brand : Step 2
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      fontFamily: Constants.Fonts.REGULAR,
                      color: Constants.APP_GRAY_COLOR,
                      textAlign: 'left',
                      marginTop: 10,
                      // marginLeft: 15,
                    }}>
                    Gender : Unisex
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      fontFamily: Constants.Fonts.REGULAR,
                      color: Constants.APP_GRAY_COLOR,
                      textAlign: 'left',
                      marginTop: 10,
                      // marginLeft: 15,
                    }}>
                    Age : 1+
                  </Text>
                </View>
              )}
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 10,
                }}>
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: Constants.Fonts.REGULAR,
                    color: Constants.APP_GRAY_COLOR,
                    textAlign: 'left',
                  }}>
                  {translate('Quantity') + ' : ' + item.qty_ordered}
                </Text>
              </View>

              {/* {showQuantity && (
                <KeyText
                  itemKey={translate("Quantity")}
                  keylabel={item.qty}
                  currency={currency}
                />
              )} */}
              <KeyText
                itemKey={'Unit Price'}
                itemValue={translate('Unit Price')}
                keylabel={unitPrice}
                currency={currency}
                orderConfirmationScreen={orderConfirmationScreen}
              />
              <KeyText
                itemKey={'TOTAL PRICE'}
                itemValue={translate('TOTAL PRICE')}
                keylabel={total.toFixed(2)}
                currency={currency}
                orderConfirmationScreen={orderConfirmationScreen}
              />
              {!orderConfirmationScreen && !isAddons && (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 10,
                  }}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: Constants.Fonts.REGULAR,
                      color: isRefundable
                        ? Constants.APP_BLACK_COLOR
                        : Constants.APP_RED_COLOR,
                      textAlign: 'left',
                    }}>
                    {isRefundable
                      ? translate('Refundable')
                      : translate('Non Refundable')}
                  </Text>
                </View>
              )}

              {orderHistoryDetailsScreen && (
                <View>
                  {deliveryDate !== '' && (
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginTop: 10,
                      }}>
                      <Text
                        style={{
                          fontSize: 12,
                          fontFamily: Constants.Fonts.MEDIUM,
                          color: Constants.APP_GRAY_COLOR,
                          textAlign: 'left',
                        }}>
                        {translate('Delivery Date') + ' : ' + deliveryDate}
                      </Text>
                    </View>
                  )}
                  {deliveryTime !== '' && (
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginTop: 10,
                      }}>
                      <Text
                        style={{
                          fontSize: 12,
                          fontFamily: Constants.Fonts.MEDIUM,
                          color: Constants.APP_GRAY_COLOR,
                          textAlign: 'left',
                        }}>
                        {translate('Delivery Time') + ' : ' + deliveryTime}
                      </Text>
                    </View>
                  )}
                </View>
              )}
            </View>

            {/* {allowAddOption && (
              <QuantityControl
                quantiryItem={item}
                getQuantity={getQuantity}
                updateCartProduct={updateCartProduct}
              />
            )} */}
          </View>
        </View>
      </View>
    );
  },
);

const styles = StyleSheet.create({});

export default ItemCell;

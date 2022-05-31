import styles from './styles';
import React, {Component} from 'react';
import images from '../../config/images';
import constants from '../../config/constants';
import {Text, View, Image, TouchableOpacity, TextInput} from 'react-native';
import {showAlertWithCallback, isEmpty} from '../../config/common';
import {translate} from '../../config/languageSwitching';
import ImageComponent from '../../components/ImageComponent';

const QuantityIncreament = ({count, onIncreament, onDecreament}) => {
  return (
    <View style={styles.increamentWrap}>
      <TouchableOpacity
        onPress={onDecreament}
        hitSlop={{top: 5, bottom: 5, left: 5, right: 5}}>
        <Image source={images.decrement} style={styles.plusIcon} />
      </TouchableOpacity>
      <TextInput style={styles.countNum} value={count.toString()} />
      <TouchableOpacity
        onPress={onIncreament}
        hitSlop={{top: 5, bottom: 5, left: 5, right: 5}}>
        <Image source={images.increment} style={styles.plusIcon} />
      </TouchableOpacity>
    </View>
  );
};

export default class CartCard extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  _OnIncreament = () => {
    this.props.didTapOnIncrement(this.props.data.qty + 1);
  };

  _OnDecreament = giftWrapsTotal => {
    if (this.props.data.qty !== 1) {
      if (giftWrapsTotal > 0) {
        showAlertWithCallback(
          translate('removeItemForAddons'),
          translate('Ok'),
          translate('Cancel'),
          () => {
            this.props.didTapOnIncrement(this.props.data.qty - 1);
          },
          null,
        );
      } else {
        this.props.didTapOnIncrement(this.props.data.qty - 1);
      }
    }
  };

  _enableGiftWrap = (navigation, data) => {
    if (this.props.isFromCheckout) return;
    navigation.navigate('GiftWrapScreen', {
      qty: this.props.data.qty,
      parentDict: data,
      didGiftWrapUpdated: () => {
        this.props.didAddOnsAdded();
      },
    });
  };

  _enableBalloons = (navigation, data) => {
    if (this.props.isFromCheckout) return;

    navigation.navigate('Balloon', {
      qty: this.props.data.qty,
      parentDict: data,
      didBalloonsUpdated: () => {
        this.props.didAddOnsAdded();
      },
    });
  };

  _removeFromCart = id => {
    showAlertWithCallback(
      translate('product remove confirmation'),
      translate('Yes'),
      translate('No'),
      () => {
        this.props.removeCart(id);
      },
      null,
    );
  };

  render() {
    const {
      data,
      currency,
      removeCart,
      didTapOnMoveToWishlist,
      productsAges,
      productsAgeGroups,
      productsBrands,
      productsGenders,
      isFromCheckout,
      navigation,
      cartAddOnsArray,
      hideAddons,
      appMediaBaseUrl,
      didTapOnItem,
    } = this.props;
    const {params} = this.props.navigation.state;
    const {isGiftWrap, isBalloons} = this.state;

    let extension_attributes = data.extension_attributes;
    let age = '';
    let gender = '';
    let brand = '';

    let percentage = '';
    let isRefundable = false;

    let isOutOfStock = false;
    let requestedQuantityNotAvailable = false;

    if (extension_attributes) {
      if (extension_attributes.age) {
        let ageDict = productsAges.filter(obj => {
          return obj.value === String(extension_attributes.age);
        });
        age = ageDict.length > 0 ? ageDict[0].label : '';
      }

      if (extension_attributes.brand) {
        let brandDict = productsBrands.filter(obj => {
          return obj.value === String(extension_attributes.brand);
        });
        brand = brandDict.length > 0 ? brandDict[0].label : '';
      }

      if (extension_attributes.gender) {
        let genderDict = productsGenders.filter(obj => {
          return obj.value === String(extension_attributes.gender);
        });
        gender = genderDict.length > 0 ? genderDict[0].label : '';
      }

      if (extension_attributes.is_refundable) {
        isRefundable =
          extension_attributes.is_refundable === '5599' ? true : false;
      }

      let finalPrice = data.price;
      let actualPrice = extension_attributes.original_price;

      percentage = ((actualPrice - finalPrice) / actualPrice) * 100;
      percentage = Number(percentage.toFixed(1));

      if (
        (extension_attributes.qty && Number(extension_attributes.qty) <= 0) ||
        (extension_attributes.is_in_stock &&
          Number(extension_attributes.is_in_stock) !== 1)
      ) {
        isOutOfStock = true;
      } else if (
        extension_attributes &&
        extension_attributes.qty &&
        Number(extension_attributes.qty) < data.qty
      ) {
        requestedQuantityNotAvailable = true;
      }
    }

    let selectedGiftWrapArray = [];
    let selectedBalloonsArray = [];

    let dataString = '';
    let balloonsTotal = 0;
    let giftWrapsTotal = 0;

    if (cartAddOnsArray && cartAddOnsArray.length > 0) {
      cartAddOnsArray.map(item => {
        let dataArray =
          item.extension_attributes.custom_options &&
          item.extension_attributes.custom_options.length > 0
            ? item.extension_attributes.custom_options
            : [];

        let parentSKU = '';
        // let balloonType = "Non Inflated";
        dataArray.map(itm => {
          let dt = JSON.parse(itm);
          let keys = Object.keys(dt);
          if (keys[0] === 'parent_sku') {
            parentSKU = dt.parent_sku.value;
          }
          // else if (keys[0] === "inflated") {
          //   balloonType = dt.inflated.value ? "Inflated" : "Non Inflated";
          // }
        });

        if (data.sku === parentSKU) {
          if (item.extension_attributes && item.extension_attributes.addons) {
            let val = item.extension_attributes.addons;
            if (val === '5650') {
              selectedBalloonsArray.push(item);
              // dataString =
              //   dataString +
              //   item.qty +
              //   " x " +
              //   (balloonType === "inflated" ? 0 : item.price.toFixed(2)) +
              //   currency +
              //   " = " +
              //   String(Number(item.qty * item.price).toFixed(2)) +
              //   currency +
              //   (balloonType === "inflated" ? "(Inflated)" : "(Non Inflated)") +
              //   "\n";
              balloonsTotal = balloonsTotal + item.qty * item.price;
            } else if (val === '5651') {
              selectedGiftWrapArray.push(item);
              giftWrapsTotal = giftWrapsTotal + item.qty * item.price;
            }
          }
        }
      });
    }

    return (
      <View>
        <View style={styles.cardWrap}>
          <TouchableOpacity
            onPress={() => (didTapOnItem ? didTapOnItem() : null)}>
            <View style={styles.productImgWrap}>
              {/* <Image
                source={{
                  uri: appMediaBaseUrl + data?.extension_attributes?.image,
                }}
                style={styles.productImg}
                defaultSource={images.placeHolderProduct}
              /> */}

              <ImageComponent
                source={{
                  uri: appMediaBaseUrl + data?.extension_attributes?.image,
                }}
                style={styles.productImg}
              />

              {percentage > 0 && (
                <View style={styles.discountContainer}>
                  <Text style={styles.discountText}>
                    {/* {'-' + percentage + '%'} */}
                    {percentage + ' % OFF'}
                  </Text>
                </View>
              )}
              {isOutOfStock && (
                <View style={[styles.overlay]}>
                  <View style={styles.outOfStockContainer}>
                    <Text style={styles.outOfStockText}>
                      {translate('Out of stock')}
                    </Text>
                  </View>
                </View>
              )}

              {requestedQuantityNotAvailable && (
                <View style={[styles.overlay]}>
                  <View style={styles.outOfStockContainer}>
                    <Text style={styles.outOfStockText}>
                      {translate('req qty not available')}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          </TouchableOpacity>
          <View style={styles.content}>
            <Text style={styles.title}>{data?.name}</Text>
            <View style={styles.row}>
              {brand.length > 0 && (
                <Text style={styles.specText}>
                  {translate('Brand') + ' : ' + brand}
                </Text>
              )}

              {gender.length > 0 && (
                <Text style={styles.specText}>
                  {translate('GENDER') + ' : ' + gender}
                </Text>
              )}

              {age.length > 0 && (
                <Text style={styles.specText}>
                  {translate('Age') + ' : ' + age}
                </Text>
              )}
            </View>
            {isFromCheckout && (
              <View style={styles.priceRow}>
                <Text style={styles.semiBoldText}>
                  {translate('Quantity')} :{' '}
                </Text>
                <Text style={[styles.semiBoldText]}>{data?.qty}</Text>
              </View>
            )}

            <View style={styles.priceRow}>
              <Text style={styles.semiBoldText}>
                {translate('Unit Price')} :{' '}
              </Text>
              <Text style={[styles.semiBoldText]}>
                {data?.price.toFixed(3)} {currency}
              </Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.semiBoldText}>
                {translate('Total Price')} :{' '}
              </Text>
              <Text style={[styles.semiBoldText]}>
                {(data?.price * data?.qty).toFixed(3)} {currency}
              </Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceRedText}>
                {translate('Gross Total')} :{' '}
              </Text>
              <Text style={[styles.priceRedText]}>
                {/* {(data?.price * data?.qty).toFixed(3)} {currency} */}
                {(
                  data?.price * data?.qty +
                  balloonsTotal +
                  giftWrapsTotal
                ).toFixed(3) + currency}
              </Text>
            </View>
            {isFromCheckout && !isRefundable && (
              <View style={styles.priceRow}>
                <Text
                  style={[
                    styles.priceRedText,
                    {
                      fontFamily: constants.Fonts.REGULAR,
                      color: constants.APP_RED_COLOR,
                    },
                  ]}>
                  {translate('Non Refundable')}
                </Text>
              </View>
            )}
            {!isFromCheckout && (
              <QuantityIncreament
                count={this.props.data.qty}
                onIncreament={this._OnIncreament}
                onDecreament={() => this._OnDecreament(giftWrapsTotal)}
              />
            )}
          </View>
        </View>
        {(data.extension_attributes['available_balloons'] === '5579' ||
          data.extension_attributes['available_giftwrap'] === '5581') &&
          !hideAddons && (
            <View style={{paddingHorizontal: 20}}>
              <View style={styles.row1}>
                {isFromCheckout ? (
                  selectedGiftWrapArray.length > 0 ? (
                    data.extension_attributes['available_giftwrap'] ===
                      '5581' && (
                      <TouchableOpacity
                        style={styles.checkBoxWrap}
                        activeOpacity={constants.ACTIVE_OPACITY}
                        hitSlop={{top: 5, bottom: 5, left: 10, right: 10}}
                        onPress={() => this._enableGiftWrap(navigation, data)}>
                        {selectedGiftWrapArray.length > 0 ? (
                          <View style={styles.checkboxImg}>
                            <Image
                              source={images.tick}
                              style={{
                                height: 10,
                                width: 10,
                              }}
                            />
                          </View>
                        ) : (
                          <View style={styles.unCheckboxImg} />
                        )}
                        <Text style={[styles.priceRedText, {marginTop: 10}]}>
                          {translate('Gift Wrap')}
                        </Text>
                      </TouchableOpacity>
                    )
                  ) : (
                    <View style={{flex: 1}} />
                  )
                ) : (
                  data.extension_attributes['available_giftwrap'] ===
                    '5581' && (
                    <TouchableOpacity
                      style={styles.checkBoxWrap}
                      activeOpacity={constants.ACTIVE_OPACITY}
                      hitSlop={{top: 5, bottom: 5, left: 10, right: 10}}
                      onPress={() => this._enableGiftWrap(navigation, data)}>
                      {selectedGiftWrapArray.length > 0 ? (
                        <View style={styles.checkboxImg}>
                          <Image
                            source={images.tick}
                            style={{
                              height: 10,
                              width: 10,
                            }}
                          />
                        </View>
                      ) : (
                        <View style={styles.unCheckboxImg} />
                      )}
                      <Text style={[styles.priceRedText, {marginTop: 10}]}>
                        {translate('Gift Wrap')}
                      </Text>
                    </TouchableOpacity>
                  )
                )}

                {isFromCheckout ? (
                  selectedBalloonsArray.length > 0 ? (
                    data.extension_attributes['available_balloons'] ===
                      '5579' && (
                      <TouchableOpacity
                        style={styles.checkBoxWrap}
                        activeOpacity={constants.ACTIVE_OPACITY}
                        hitSlop={{top: 5, bottom: 5, left: 10, right: 10}}
                        onPress={() => this._enableBalloons(navigation, data)}>
                        {selectedBalloonsArray.length > 0 ? (
                          <View style={styles.checkboxImg}>
                            <Image
                              source={images.tick}
                              style={{
                                height: 10,
                                width: 10,
                              }}
                            />
                          </View>
                        ) : (
                          <View style={styles.unCheckboxImg} />
                        )}
                        <Text style={[styles.priceRedText, {marginTop: 10}]}>
                          {translate('Balloons')}
                        </Text>
                      </TouchableOpacity>
                    )
                  ) : (
                    <View style={{flex: 1}} />
                  )
                ) : (
                  data.extension_attributes['available_balloons'] ===
                    '5579' && (
                    <TouchableOpacity
                      style={styles.checkBoxWrap}
                      activeOpacity={constants.ACTIVE_OPACITY}
                      hitSlop={{top: 5, bottom: 5, left: 10, right: 10}}
                      onPress={() => this._enableBalloons(navigation, data)}>
                      {selectedBalloonsArray.length > 0 ? (
                        <View style={styles.checkboxImg}>
                          <Image
                            source={images.tick}
                            style={{
                              height: 10,
                              width: 10,
                            }}
                          />
                        </View>
                      ) : (
                        <View style={styles.unCheckboxImg} />
                      )}
                      <Text style={[styles.priceRedText, {marginTop: 10}]}>
                        {translate('Balloons')}
                      </Text>
                    </TouchableOpacity>
                  )
                )}
              </View>
              <View style={[styles.row1, {marginTop: 10}]}>
                <View style={styles.checkBoxWrap1}>
                  {selectedGiftWrapArray.length > 0 && (
                    <Text style={styles.semiBoldText1}>
                      {giftWrapsTotal.toFixed(3) + currency}
                    </Text>
                  )}
                </View>
                <View style={styles.checkBoxWrap1}>
                  {selectedBalloonsArray.length > 0 && (
                    <Text style={styles.semiBoldText1}>
                      {balloonsTotal.toFixed(3) + currency}
                    </Text>
                  )}
                </View>
              </View>
            </View>
          )}
        {!isFromCheckout && (
          <View style={styles.bottomButtonContainer}>
            <TouchableOpacity
              style={[styles.bottomButton1Container,{marginEnd:5}]}
              onPress={() => {
                this._removeFromCart(data.item_id);
              }}>
              <Text style={styles.bottomButtonText}>
                {translate('Remove').toUpperCase()}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.bottomButton1Container,{marginStart :5}]}
              onPress={() => {
                didTapOnMoveToWishlist(data);
              }}>
              <Text style={styles.bottomButtonText2}>
                {translate('Add to Wishlist').toUpperCase()}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }
}

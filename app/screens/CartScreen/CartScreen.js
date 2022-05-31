/**
 * Created by Kareem for iLeaf Solutions Pvt.Ltd
 * on July 10, 2020
 * Cart - Screen.
 */
import {
  Text,
  View,
  SafeAreaView,
  StatusBar,
  ScrollView,
  FlatList,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {
  showSingleAlert,
  showAlertWithCallback,
  showSimpleSnackbar,
} from '../../config/common';
import styles from './styles';
import React, {Component} from 'react';
import Modal from 'react-native-modal';
import images from '../../config/images';
import constants from '../../config/constants';
import CartCard from '../../components/CartCard/CartCard';
import {translate} from '../../config/languageSwitching';
import ItemFooter from '../../components/ItemFooter/ItemFooter';
import FooterButton from '../../components/FooterButton/FooterButton';
import EmptyDataPlaceholder from '../../components/emptyDataPlaceholder';
import NavigationHeader1 from '../../components/NavigationHeaders/NavigationHeader1';
import Constants from '../../config/constants';
import HudView from '../../components/hudView';
import Login from '../LoginScreen';

export default class CartScreen extends Component {
  constructor(props) {
    super(props);

    let isFromCheckout = this.props.navigation.state.params.isFromCheckout;

    this.state = {
      totalCostDict: null,
      modalVisible: false,
      loginModalVisible: false,
      totalCostBeforeDiscount: 0,
      totalCostAfterDiscount: 0,
      cartTotalDiscount: 0,
      userSessionExpired: false,
      isFromCheckout,
      shippingAmount: 0,
      isVoucherApplied: false,
      voucherCode: '',
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let grandTotlaFilterResultNew = nextProps.cartTotals.total_segments
      ? nextProps.cartTotals.total_segments.filter(obj => {
          return obj.code === 'grand_total';
        })
      : [];
    let grandTotlaFilterResultOld = prevState.totalCostDict
      ? prevState.totalCostDict.total_segments.filter(obj => {
          return obj.code === 'grand_total';
        })
      : [];

    if (
      grandTotlaFilterResultNew.length > 0 &&
      (grandTotlaFilterResultOld.length == 0 ||
        grandTotlaFilterResultNew[0].value !=
          grandTotlaFilterResultOld[0].value)
    ) {
      const {userToken, cartList, guestcartList} = nextProps;
      let totalCostDict = nextProps.cartTotals;

      let totalCostBeforeDiscount = 0;
      let totalCostAfterDiscount = 0;
      let cartTotalDiscount = 0;
      let shippingAmount = 0;
      let isVoucherApplied = false;
      let voucherCode = '';

      if (totalCostDict && totalCostDict.total_segments) {
        let subTotalFilterResult = totalCostDict.total_segments.filter(obj => {
          return obj.code === 'subtotal';
        });
        totalCostBeforeDiscount =
          subTotalFilterResult.length > 0 ? subTotalFilterResult[0].value : 0;

        let grandTotlaFilterResult = totalCostDict.total_segments.filter(
          obj => {
            return obj.code === 'grand_total';
          },
        );
        totalCostAfterDiscount =
          grandTotlaFilterResult.length > 0
            ? grandTotlaFilterResult[0].value
            : 0;

        let cartTotlaFilterResult = totalCostDict.total_segments.filter(obj => {
          return obj.code === 'discount';
        });

        cartTotalDiscount =
          cartTotlaFilterResult.length > 0 ? cartTotlaFilterResult[0].value : 0;

        let shippingFilterResult = totalCostDict.total_segments.filter(obj => {
          return obj.code === 'shipping';
        });
        shippingAmount =
          shippingFilterResult.length > 0 ? shippingFilterResult[0].value : 0;
        const cartData = userToken.length > 0 ? cartList : guestcartList;

        cartData.map(cartItem => {
          let offerAmount = 0;
          let finalPrice = cartItem.price;
          let actualPrice = cartItem.extension_attributes.original_price;
          offerAmount = (actualPrice - finalPrice) * cartItem.qty;
          totalCostBeforeDiscount = totalCostBeforeDiscount + offerAmount;
        });

        totalCostBeforeDiscount = Number(totalCostBeforeDiscount).toFixed(3);
      }

      if (
        totalCostDict &&
        totalCostDict.extension_attributes &&
        totalCostDict.extension_attributes.discounts &&
        totalCostDict.extension_attributes.discounts.length > 0
      ) {
        let discountArray = totalCostDict.extension_attributes.discounts;
        let dt = JSON.parse(discountArray[0]);

        if (dt && dt.code) {
          voucherCode = dt.code && dt.code[0].code;
          isVoucherApplied = true;
        }
      }

      return {
        totalCostDict: nextProps.cartTotals,
        totalCostWithoutDiscount: totalCostDict.base_grand_total,
        totalCostBeforeDiscount,
        totalCostAfterDiscount,
        cartTotalDiscount,
        shippingAmount,
        isVoucherApplied,
        voucherCode,
      };
    } else return null;
  }

  componentDidMount() {
    if (this.props.guestToken === '' && this.props.userToken === '') {
      return;
    }

    if (this.props.userToken && this.props.isNetworkAvailable) {
      this.props.enableLoader();
      this.props.renewUserToken(status => {
        if (!status) {
          this.props.disableLoader();
          this.props.userDidLogOut();
          this.setState({loginModalVisible: true});
        } else {
          this._commonTotalPriceUpdate();
        }
      });
    } else {
      this._commonTotalPriceUpdate();
    }
  }

  //Footer Sticky Button1 Function
  _onButton1Click = () => {
    this.props.navigation.navigate('Home');
  };

  onStartShoppingClick = () => {
    this.props.navigation.navigate('Home');
  };

  onReloadClick = () => {
    this._commonTotalPriceUpdate();
  };

  //Footer Sticky Button2 Function
  _onButton2Click = () => {
    const {isFromCheckout} = this.state;
    const {
      userToken,
      guestcartList,
      cartList,
      guestInfo,
      addressList,
      guestAddressList,
    } = this.props;
    let cartData = userToken.length > 0 ? cartList : guestcartList;

    let isAnyOutOfStock = false;
    let requestedQuantityNotAvailable = false;
    cartData.map(cartItem => {
      let extension_attributes = cartItem.extension_attributes;

      if (
        extension_attributes &&
        ((extension_attributes.qty && Number(extension_attributes.qty) <= 0) ||
          (extension_attributes.is_in_stock &&
            Number(extension_attributes.is_in_stock) !== 1))
      ) {
        isAnyOutOfStock = true;
      } else if (
        extension_attributes &&
        extension_attributes.qty &&
        Number(extension_attributes.qty) < cartItem.qty
      ) {
        requestedQuantityNotAvailable = true;
      }
    });

    if (isAnyOutOfStock) {
      showSingleAlert(translate('one or mpre products are out of stock'));
      return;
    }

    if (requestedQuantityNotAvailable) {
      showSingleAlert(translate('req qty not available'));
      return;
    }

    if (cartData.length > Constants.MAX_CART_SIZE) {
      showSingleAlert(
        translate('cart count exceeds1') +
          Constants.MAX_CART_SIZE +
          translate('cart count exceeds2'),
      );
      return;
    }

    let isOverItem = false;
    cartData.map(item => {
      if (item.qty > Constants.MAX_PRODUCT_COUNT) {
        isOverItem = true;
      }
    });

    if (isOverItem) {
      showSingleAlert(
        translate('products maximum count exceeds1') +
          Constants.MAX_PRODUCT_COUNT +
          translate('products maximum count exceeds2'),
      );
      return;
    }

    let totalCost = this.state.totalCostDict;
    if (userToken.length > 0) {
      if (isFromCheckout) {
        let callbackFunction =
          this.props.navigation.state.params.checkoutCallback;
        callbackFunction();
        this.props.navigation.pop();
      } else {
        if (addressList.length > 0) {
          this.props.navigation.navigate('Checkout', {totalCost});
        } else {
          this.props.navigation.navigate('AddAddressScreen', {
            details: {},
            isFromCheckOutScreen: true,
            totalCost: totalCost,
          });
        }
      }
    } else {
      if (!guestInfo) {
        this.setState({modalVisible: true});
      } else {
        if (isFromCheckout) {
          let callbackFunction =
            this.props.navigation.state.params.checkoutCallback;
          callbackFunction();
          this.props.navigation.pop();
        } else {
          if (guestAddressList.length > 0) {
            this.props.navigation.navigate('Checkout', {totalCost});
          } else {
            this.props.navigation.navigate('GuestAddAddress', {
              details: {},
              isFromCheckOutScreen: true,
              totalCost: totalCost,
            });
          }
        }
      }
    }
  };

  //Header Back Arrow Function
  _didTapOnBackButton = () => {
    this.props.navigation.goBack();
  };

  _removeGuestCartCallback = status => {
    if (status) {
      this._commonTotalPriceUpdate();
      showSimpleSnackbar(translate('Product removed from Cart'));
    }
  };

  _removeUserCartCallback = status => {
    if (status) {
      this._commonTotalPriceUpdate();
      showSimpleSnackbar(translate('Product removed from Cart'));
    }
  };

  _commonTotalPriceUpdate = () => {
    const {userToken, cartList, guestcartList} = this.props;
    this.props.getTotalCost((totalCostDict, sessionStatus) => {
      if (totalCostDict) {
        // console.log("===CART!!%%%%", totalCostDict);
        // this.setState({
        //   totalCostWithoutDiscount: totalCostDict.base_grand_total,
        // });
        // if (totalCostDict && totalCostDict.grand_total) {
        //   this.setState({
        //     totalCostDict,
        //   });
        // }
        // let totalCostBeforeDiscount = 0;
        // let totalCostAfterDiscount = 0;
        // let cartTotalDiscount = 0;
        // let shippingAmount = 0;
        // let isVoucherApplied = false;
        // let voucherCode = "";
        // if (totalCostDict && totalCostDict.total_segments) {
        //   let subTotalFilterResult = totalCostDict.total_segments.filter(
        //     (obj) => {
        //       return obj.code === "subtotal";
        //     }
        //   );
        //   totalCostBeforeDiscount =
        //     subTotalFilterResult.length > 0 ? subTotalFilterResult[0].value : 0;
        //   let grandTotlaFilterResult = totalCostDict.total_segments.filter(
        //     (obj) => {
        //       return obj.code === "grand_total";
        //     }
        //   );
        //   totalCostAfterDiscount =
        //     grandTotlaFilterResult.length > 0
        //       ? grandTotlaFilterResult[0].value
        //       : 0;
        //   let cartTotlaFilterResult = totalCostDict.total_segments.filter(
        //     (obj) => {
        //       return obj.code === "discount";
        //     }
        //   );
        //   cartTotalDiscount =
        //     cartTotlaFilterResult.length > 0
        //       ? cartTotlaFilterResult[0].value
        //       : 0;
        //   if (cartTotlaFilterResult.length > 0) {
        //     let discountDict = cartTotlaFilterResult[0];
        //     let discountTitle = discountDict["title"];
        //     let check1 = discountTitle.indexOf("(") > -1;
        //     let check2 = discountTitle.indexOf(")") > -1;
        //     var matches = discountTitle.match(/\((.*)\)/);
        //     if (matches) {
        //       voucherCode = matches[1];
        //     }
        //     if (check1 && check2) isVoucherApplied = true;
        //   }
        //   let shippingFilterResult = totalCostDict.total_segments.filter(
        //     (obj) => {
        //       return obj.code === "shipping";
        //     }
        //   );
        //   shippingAmount =
        //     shippingFilterResult.length > 0 ? shippingFilterResult[0].value : 0;
        //   const cartData = userToken.length > 0 ? cartList : guestcartList;
        //   cartData.map((cartItem) => {
        //     let offerAmount = 0;
        //     let finalPrice = cartItem.price;
        //     let actualPrice = cartItem.extension_attributes.original_price;
        //     offerAmount = (actualPrice - finalPrice) * cartItem.qty;
        //     totalCostBeforeDiscount = totalCostBeforeDiscount + offerAmount;
        //   });
        //   totalCostBeforeDiscount = totalCostBeforeDiscount.toFixed(3);
        //   this.setState({
        //     totalCostBeforeDiscount,
        //     totalCostAfterDiscount,
        //     cartTotalDiscount,
        //     shippingAmount,
        //     isVoucherApplied,
        //     voucherCode,
        //   });
        // }
      } else if (sessionStatus === 'SESSION_EXPIRED') {
        showSingleAlert(translate('user session expired'), 'Ok', () => {
          this.setState({modalVisible: true});
        });
      }
    });
  };

  _updateProductCount = (quantity, item, index) => {
    const {userToken, isNetworkAvailable, guestToken, cartId} = this.props;

    if (!isNetworkAvailable) {
      return;
    }

    let guestparams = {
      cart_item: {
        sku: item.sku,
        qty: quantity,
        quote_id: userToken === '' ? guestToken : cartId,
        item_id: item.item_id,
      },
    };

    if (userToken === '') {
      this.props.updateGuestCart(
        item.item_id,
        this._updateCartCallback,
        guestparams,
        index,
      );
    } else {
      this.props.updateUserCart(
        guestparams,
        this._updateCartCallback,
        item.item_id,
      );
    }
  };

  _updateCartCallback = (status, message) => {
    if (status) {
      this._commonTotalPriceUpdate();
    } else {
      showSingleAlert(message, 'Ok', () => {
        // this.props.getProuctsInCart();
      });
    }
  };

  _didTapOnApplyVoucher = () => {
    const {voucherCode, isVoucherApplied} = this.state;
    if (isVoucherApplied) return;
    if (voucherCode === '') {
      showSingleAlert(translate('voucher code empty'));
      return;
    }
    this.props.applyVoucher(voucherCode, (status, message) => {
      if (status) {
        showSingleAlert(translate('Voucher applied successfully'));
        this.setState({isVoucherApplied: true});
        this._commonTotalPriceUpdate();
      } else {
        //showSingleAlert(translate("Invalid Voucher"));
        showSingleAlert(message);
        this.setState({voucherCode: '', isVoucherApplied: false});
      }
    });
  };

  render() {
    const {
      isLoading,
      cartList,
      currency,
      guestcartList,
      userToken,
      removeGuestCart,
      removeProductFromCart,
      isNetworkAvailable,
      cartAddOnsArray,
      isRTL,
    } = this.props;
    const {
      modalVisible,
      loginModalVisible,
      totalCostBeforeDiscount,
      totalCostAfterDiscount,
      cartTotalDiscount,
      shippingAmount,
      isVoucherApplied,
      voucherCode,
    } = this.state;
    const cartData = userToken.length > 0 ? cartList : guestcartList;
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: constants.APP_WHITE_COLOR,
        }}>
        <StatusBar
          hidden={false}
          backgroundColor={constants.APP_WHITE_COLOR}
          translucent={false}
        />
        <NavigationHeader1
          showBackButton={true}
          title={translate('Cart')}
          isWishlist={false}
          hideSearch={true}
          didTapOnLeftButton={this._didTapOnBackButton}
          isRTL={this.props.isRTL}
          bottomBorderWidth={2}
        />
        {!isNetworkAvailable ? (
          <View style={{flex: 1}}>
            <EmptyDataPlaceholder
              titleText={translate('Network Error')}
              descriptionText={translate('error_data')}
              placeHolderImage={images.NetworkError}
              buttonText={translate('Reload')}
              didTapOnButton={this.onReloadClick}
            />
          </View>
        ) : cartData.length == 0 ? (
          <View style={{flex: 1}}>
            <EmptyDataPlaceholder
              titleText={translate('Your Cart is empty')}
              descriptionText={translate('cart_empty_list_placeholder')}
              placeHolderImage={images.cartEmpty}
              buttonText={translate('Start shopping')}
              didTapOnButton={this.onStartShoppingClick}
            />
          </View>
        ) : (
          <>
            <FlatList
              style={styles.scrollView}
              data={[1]}
              renderItem={() => {
                return (
                  <View>
                    <FlatList
                      style={{
                        flex: 1,
                        backgroundColor: Constants.APP_WHITE_COLOR,
                      }}
                      data={cartData}
                      extraData={
                        userToken.length > 0 ? guestcartList : cartList
                      }
                      keyExtractor={(item, index) => index.toString()}
                      renderItem={({item, i}) => (
                        <CartCard
                          key={i}
                          data={item}
                          currency={currency}
                          productsAges={this.props.productsAges}
                          productsAgeGroups={this.props.productsAgeGroups}
                          productsBrands={this.props.productsBrands}
                          productsGenders={this.props.productsGenders}
                          cartAddOnsArray={cartAddOnsArray}
                          didAddOnsAdded={() => {
                            this._commonTotalPriceUpdate();
                          }}
                          didTapOnIncrement={value => {
                            this._updateProductCount(value, item, i);
                          }}
                          didTapOnDecrement={value => {
                            this._updateProductCount(value, item, i);
                          }}
                          didTapOnMoveToWishlist={item => {
                            userToken.length > 0
                              ? this.props.addProductFromCartToWishList(
                                  item.extension_attributes.entity_id,
                                  item.item_id,
                                  status => {
                                    if (status) {
                                      this._commonTotalPriceUpdate();
                                      showSimpleSnackbar(
                                        translate('Product moved to wishlist'),
                                      );
                                    }
                                  },
                                )
                              : showAlertWithCallback(
                                  translate('user_not_login'),
                                  translate('Login'),
                                  translate('Cancel'),
                                  () => {
                                    this.setState({loginModalVisible: true});
                                  },
                                  null,
                                );
                          }}
                          removeCart={id => {
                            userToken.length > 0
                              ? removeProductFromCart(
                                  id,
                                  this._removeUserCartCallback,
                                  i,
                                )
                              : removeGuestCart(
                                  id,
                                  this._removeGuestCartCallback,
                                  i,
                                );
                          }}
                          navigation={this.props.navigation}
                          appMediaBaseUrl={this.props.appMediaBaseUrl}
                          didTapOnItem={() =>
                            this.props.navigation.push('ProductDetail', {
                              sku: item.sku,
                              isFromCartScreen: true,
                            })
                          }
                        />
                      )}
                    />
                    <View style={styles.itemCellContainer}>
                      <View style={{marginHorizontal: 15}}>
                        <Text
                          style={{
                            fontFamily: Constants.Fonts.MEDIUM,
                            fontSize: 14,
                            marginTop: 10,
                            textAlign: 'left',
                            color: "rgb(40, 48, 63)"
                          }}>
                          {translate('Add Voucher code')}
                        </Text> 
                        <View
                          style={{
                            flexDirection: 'row',
                            marginBottom: isVoucherApplied ? 10 : 25,
                            marginTop: 10,
                          }}>
                          <TextInput
                            style={[
                              styles.voucherInput,
                              {textAlign: isRTL ? 'right' : 'left'},
                            ]}
                            value={voucherCode}
                            editable={!isVoucherApplied}
                            onChangeText={text =>
                              this.setState({voucherCode: text})
                            }
                            placeholder={translate('Enter Voucher Code')}
                          />
                          <TouchableOpacity
                            style={[
                              styles.applyButton,
                              {
                                backgroundColor: isVoucherApplied
                                  ? 'green'
                                  : Constants.APP_DARKBLUE_COLOR,
                              },
                            ]}
                            onPress={this._didTapOnApplyVoucher}>
                            {isVoucherApplied ? (
                              <Text
                                style={[
                                  styles.applyText,
                                  {color: Constants.APP_WHITE_COLOR},
                                ]}>
                                {translate('Applied')}
                              </Text>
                            ) : (
                              <Text style={styles.applyText}>
                                {translate('Apply')}
                              </Text>
                            )}
                          </TouchableOpacity>
                        </View>
                        {isVoucherApplied && (
                          <View style={styles.removeVoucher}>
                            <TouchableOpacity
                              activeOpacity={constants.ACTIVE_OPACITY}
                              style={styles.removeWrap}
                              hitSlop={{
                                top: 20,
                                left: 20,
                                right: 20,
                                bottom: 20,
                              }}
                              onPress={() => {
                                showAlertWithCallback(
                                  translate('removeVoucher'),
                                  translate('Yes'),
                                  translate('No'),
                                  () => {
                                    this.props.removeAppliedVoucher(status => {
                                      if (status)
                                        this._commonTotalPriceUpdate();
                                    });
                                  },
                                  null,
                                );
                              }}>
                              <Text style={styles.removeText}>
                                {translate('Remove CAPITAL')}
                              </Text>
                            </TouchableOpacity>
                          </View>
                        )}
                      </View>
                    </View>

                    <View style={[styles.itemWrap,{ marginTop: 15}]}>
                      <View style={styles.TotalRow}>
                        <Text style={styles.TotalLabel}>
                          {translate('Cart Total (Before Discounts)')}
                        </Text>
                        <Text style={styles.TotalValues}>
                          {totalCostBeforeDiscount + ' ' + currency}
                        </Text>
                      </View>

                      {cartData.map((item, i) => {
                        let percentage;
                        let finalPrice = item.price;
                        let actualPrice =
                          item.extension_attributes.original_price;

                        percentage =
                          ((actualPrice - finalPrice) / actualPrice) * 100;
                        percentage = Number(percentage.toFixed(1));
                        if (percentage > 0)
                          return (
                            <View style={styles.TotalRow}>
                              <Text style={styles.TotalLabel}>
                                {translate('item') +
                                  ' ' +
                                  Number(i + 1) +
                                  ', ' +
                                  percentage +
                                  '% ' +
                                  translate('Off') +
                                  (item.qty > 1
                                    ? ' ( ' + item.qty + ' nos. )'
                                    : '')}
                              </Text>
                              <Text style={styles.TotalValuesRed}>
                                {'-' +
                                  Number(
                                    (actualPrice - finalPrice) * item.qty,
                                  ).toFixed(3) +
                                  ' ' +
                                  currency}
                              </Text>
                            </View>
                          );
                      })}

                      {cartTotalDiscount != 0 && (
                        <View style={styles.TotalRow}>
                          <Text style={styles.TotalLabel}>
                            {isVoucherApplied
                              ? translate('Cart discount include voucher')
                              : translate('Cart discount')}
                          </Text>
                          <Text style={styles.TotalValuesRed}>
                            {Number(cartTotalDiscount).toFixed(3) +
                              ' ' +
                              currency}
                          </Text>
                        </View>
                      )}
                      {shippingAmount > 0 && (
                        <View style={styles.TotalRow}>
                          <Text style={styles.TotalLabel}>
                            {translate('Local Shipping')}
                          </Text>
                          <Text style={styles.TotalValues}>
                            {Number(shippingAmount).toFixed(3) + ' ' + currency}
                          </Text>
                        </View>
                      )}

                      <View style={styles.TotalRow}>
                        <Text style={styles.TotalLabel}>
                          {translate('Cart Total (After Discounts)')}
                        </Text>
                        <Text style={styles.TotalValues}>
                          {Number(totalCostAfterDiscount).toFixed(3) +
                            ' ' +
                            currency}
                        </Text>
                      </View>
                      <View style={{marginBottom: 10}} />
                      {shippingAmount == 0 && (
                        <Text style={styles.TotalValues}>
                          {translate('shipping_info_des')}
                        </Text>
                      )}
                    </View>
                    <View style={styles.horizontalLineWrap}/>

                    <View style={[styles.itemWrap,{ marginTop:5}]}>

                      <View style={styles.TotalRow}>
                        <Text style={styles.TotalLabelBold}>
                          {translate('TOTAL PAYMENT')}{' '}
                        </Text>
                        <Text style={styles.TotalValuesBold}>
                          {Number(totalCostAfterDiscount).toFixed(3) +
                            ' ' +
                            currency}
                        </Text>
                      </View>
                    </View>
                    <View style={[styles.horizontalLineWrap, {marginBottom: 30}]}/>
                  </View> 
                );
              }}></FlatList>

            <FooterButton
              buttonText1={translate('Continue')}
              buttonText2={translate('Checkout')}
              onButton1Click={this._onButton1Click}
              onButton2Click={this._onButton2Click}
              screenWidth={this.props.screenWidth}
            />
          </>
        )}
        <Modal
          onBackButtonPress={() => this.setState({modalVisible: false})}
          isVisible={modalVisible}
          style={{margin: 0}}>
          <View style={{flex: 1}}>
            <Login
              isGuestLogin={false}
              didTapOnclose={() => this.setState({modalVisible: false})}
              guestInfoAddedCallback={() => {
                this.setState({modalVisible: false});

                if (this.state.isFromCheckout) {
                  let callbackFunction =
                    this.props.navigation.state.params.checkoutCallback;
                  callbackFunction();
                  this.props.navigation.pop();
                } else {
                  this.props.navigation.navigate('GuestAddAddress', {
                    details: {},
                    isFromCheckOutScreen: true,
                    totalCost: this.state.totalCostDict,
                  });
                }
              }}
            />
          </View>
        </Modal>
        <Modal
          style={{margin: 0}}
          onBackButtonPress={() => this.setState({loginModalVisible: false})}
          isVisible={loginModalVisible}>
          <View style={{flex: 1}}>
            <Login
              didTapOnclose={() => this.setState({loginModalVisible: false})}
            />
          </View>
        </Modal>
        {/* <TouchableOpacity
          style={{height: 50, width: 50, backgroundColor: 'red'}}
          onPress={() => {
            this.props.removeProductFromCart(
              '132231',
              this._removeUserCartCallback,
              0,
            );
          }}></TouchableOpacity> */}
        {isLoading && <HudView />}
      </SafeAreaView>
    );
  }
}

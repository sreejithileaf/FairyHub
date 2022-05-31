import {
  View,
  Text,
  FlatList,
  StatusBar,
  ScrollView,
  BackHandler,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from 'react-native';
import styles from './styles';
import React, {Component} from 'react';
import Constants from '../../config/constants';
import {StackActions} from '@react-navigation/native';
import {translate} from '../../config/languageSwitching/index';
import NavigationHeader1 from '../../components/NavigationHeaders/NavigationHeader1';
import {
  normalizedHeight,
  normalizedWidth,
  addEventTracking,
} from '../../config/common';
import Images from '../../config/images';
import HudView from '../../components/hudView';
import moment from 'moment';
import analytics from '@react-native-firebase/analytics';

import CartCard2 from '../../components/CartCard2/CartCard';

const CategoryCell = React.memo(
  ({
    item,
    index,
    currency,
    navigation,
    productsAges,
    productsAgeGroups,
    productsBrands,
    productsGenders,
    props,
    totalItems,
  }) => {
    if (item.extension_attributes && item.extension_attributes.addons) {
      return <View></View>;
    }

    if (item.product_type === 'simple' && item.parent_item) {
      return <View></View>;
    }

    let optionsForDateTime = item.extension_attributes.custom_options
      ? item.extension_attributes.custom_options
      : null;
    let deliveryDate = '';
    let deliveryTime = '';

    if (optionsForDateTime && optionsForDateTime.length > 0) {
      optionsForDateTime.map(obj => {
        let dict = JSON.parse(obj);
        if (dict.delivery_date) {
          deliveryDate = dict.delivery_date.value;
          deliveryDate = moment(deliveryDate).format('MMM DD, YYYY');

          if (deliveryDate === moment().format('MMM DD, YYYY')) {
            deliveryDate = 'Today';
          }
        }
        if (dict.delivery_time) {
          deliveryTime = dict.delivery_time.value;
        }
      });
    }

    return (
      <View
        style={{
          backgroundColor: Constants.APP_WHITE_COLOR,
          marginTop: 15,
        }}>
        <View style={{marginHorizontal: 0}}>
          <CartCard2
            isFromCheckout={true}
            key={index + 'chkot'}
            data={item}
            currency={currency}
            productsAges={productsAges}
            productsAgeGroups={productsAgeGroups}
            productsBrands={productsBrands}
            productsGenders={productsGenders}
            cartAddOnsArray={props.cartAddOnsArray}
            navigation={navigation}
            hideAddons
            isFromOrderConfirmation={true}
            totalItems={totalItems}
            appMediaBaseUrl={props.appMediaBaseUrl}
          />
          {totalItems.map(addOnItem => {
            if (
              addOnItem.extension_attributes &&
              addOnItem.extension_attributes.addons
            ) {
              let percentage = '';
              let finalPrice = addOnItem.price;
              let actualPrice = addOnItem.original_price;

              percentage = ((actualPrice - finalPrice) / actualPrice) * 100;
              percentage = Number(percentage.toFixed(1));

              let isGiftwrap =
                addOnItem.extension_attributes.addons === '5651' ? true : false;

              let message = '';
              let isInflated = 'No';
              let parentSKU = '';

              if (isGiftwrap) {
                let options = addOnItem.extension_attributes.custom_options;
                if (options.length > 0) {
                  options.map(obj => {
                    let dict = JSON.parse(obj);
                    if (dict.parent_sku) {
                      parentSKU = dict.parent_sku.value;
                    }
                    if (dict.message) {
                      message = dict.message.value;
                    }
                  });
                }
              } else {
                let options = addOnItem.extension_attributes.custom_options;
                if (options.length > 0) {
                  options.map(obj => {
                    let dict = JSON.parse(obj);
                    if (dict.parent_sku) {
                      parentSKU = dict.parent_sku.value;
                    }
                    if (dict.inflated) {
                      isInflated = dict.inflated.value;
                    }
                  });
                }
              }

              if (parentSKU !== item.sku) return;

              return (
                <View
                  style={{
                    marginLeft: 55,
                    flexDirection: 'row',
                    marginVertical: 10,
                  }}>
                  <View style={styles.productImgWrap}>
                    <Image
                      source={{
                        uri:
                          props.appMediaBaseUrl +
                          addOnItem?.extension_attributes?.image,
                      }}
                      style={styles.productImg}
                      defaultSource={Images.placeHolderProduct}
                    />
                  </View>
                  {isGiftwrap ? (
                    <View style={{marginLeft: 20, flex: 1}}>
                      <Text style={styles.messageTitle}>Message:</Text>
                      <Text style={styles.messageText}>{message}</Text>
                      <Text style={[styles.messageTitle, {marginTop: 5}]}>
                        {'Price : ' + Number(finalPrice).toFixed(3) + 'KWD'}
                      </Text>
                    </View>
                  ) : (
                    <View style={{marginLeft: 20, flex: 1}}>
                      <Text style={[styles.messageTitle, {marginTop: 5}]}>
                        {'Inflated Balloon : ' + isInflated.toUpperCase()}
                      </Text>
                      <Text style={[styles.messageTitle, {marginTop: 5}]}>
                        {'Price : ' + Number(finalPrice).toFixed(3) + 'KWD'}
                      </Text>
                    </View>
                  )}
                </View>
              );
            }
          })}

          {/* <Text style={styles.deliveryText}>
            {translate("Product will be delivered on the same day")}
          </Text> */}
          {deliveryTime !== '' && (
            <Text style={styles.deliveryText}>
              {translate('Delivery Time') +
                ' : ' +
                translate('Between') +
                ' ' +
                deliveryTime}
            </Text>
          )}
          {deliveryDate !== '' && (
            <Text style={styles.deliveryText}>
              {translate('Delivery Date') + ' : ' + deliveryDate}
            </Text>
          )}

          <View
            style={{
              height: 3,
              marginTop: 10,
              backgroundColor: Constants.APP_SEPARATOR_COLOR,
            }}
          />
        </View>
      </View>
    );
  },
);

class OrderCompletionScreen extends Component {
  constructor(props) {
    super(props);

    const deliveryAddressDict =
      props.navigation.state.params.deliveryAddressDict;
    const billingAddressDict = props.navigation.state.params.billingAddressDict;
    const totalCostDict = props.navigation.state.params.totalCostDict;
    const itemArray = props.navigation.state.params.itemArray;
    const shippingAmount = props.navigation.state.params.shippingAmount;
    const paymentMode = props.navigation.state.params.paymentMode;

    this.state = {
      deliveryAddressDict,
      billingAddressDict,
      totalCostDict,
      itemArray,
      shippingAmount,
      paymentMode,
      orderDetail: null,
      deliveryNote: '',
    };
  }

  componentDidMount() {
    BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick,
    );

    addEventTracking('zc6a6n');

    analytics()
      .logEvent('order_completion_screen')
      .then(rsp => {
        console.log('VIEW ORDER COMPLETION SCREEN SUCCESS-----', rsp);
      })
      .catch(error => {
        console.log('ERROR@@@@', error);
      });

    let orderId = this.props.navigation.state.params.orderId;

    this.props.getOrderDetail(orderId, response => {
      let deliveryNoteArray = response.status_histories;
      let deliveryNote = '';
      deliveryNoteArray.map(noteDict => {
        if (
          noteDict.status === 'pending' &&
          noteDict.comment &&
          noteDict.comment !== ''
        ) {
          deliveryNote = noteDict.comment;
        }
      });

      this.setState({
        deliveryAddressDict: response.billing_address,
        orderDetail: response,
        deliveryNote,
      });
    });
  }

  componentWillUnmount() {
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick,
    );
  }

  handleBackButtonClick = () => {
    this.props.navigation.dispatch(StackActions.popToTop());
    return true;
  };

  _didTapOnBackButton = () => {
    //this.props.navigation.navigate('Cart');
    this.props.navigation.dispatch(StackActions.popToTop());
  };

  _getShippingAddress = orderItem => {
    return (
      orderItem.billing_address.firstname +
      ' ' +
      orderItem.billing_address.lastname +
      '\n' +
      orderItem.billing_address.street[0] +
      '\n' +
      orderItem.billing_address.city +
      '\n' +
      orderItem.billing_address.postcode +
      '\nmob: ' +
      orderItem.billing_address.telephone
    );
  };

  render() {
    const {
      selectedLanguage,
      userToken,
      productsSizes,
      productsColors,
      isLoading,
      isRTL,
      currency,
      navigation,
      productsAges,
      productsAgeGroups,
      productsBrands,
      productsGenders,
    } = this.props;
    const {
      itemArray,
      deliveryAddressDict,
      billingAddressDict,
      totalCostDict,
      shippingAmount,
      paymentMode,
      orderDetail,
      deliveryNote,
    } = this.state;

    const paymethod =
      orderDetail &&
      orderDetail.payment &&
      orderDetail.payment.additional_information &&
      orderDetail.payment.additional_information.length > 0
        ? orderDetail.payment.additional_information[0]
        : '';

    let isCod = paymethod === 'Cash On Delivery' ? true : false;
    let paymentInfo = null;
    if (!isCod && paymethod.length > 0) {
      paymentInfo = JSON.parse(paymethod);
    }

    return (
      <SafeAreaView style={styles.safeContainer}>
        <StatusBar
          barStyle="dark-content"
          hidden={false}
          backgroundColor={Constants.APP_WHITE_COLOR}
        />
        <NavigationHeader1
          title={
            'Order Number ' + (orderDetail ? orderDetail.increment_id : '')
          }
          showBackButton={true}
          didTapOnLeftButton={this._didTapOnBackButton}
          isRTL={selectedLanguage === 'ar' ? true : false}
          hideSearch={true}
        />
        {orderDetail && (
          <FlatList
            style={{backgroundColor: Constants.APP_WHITE_COLOR}}
            data={[1]}
            renderItem={() => {
              return (
                <View>
                  <View
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderBottomWidth: 1,
                      borderBottomColor: Constants.APP_SEPARATOR_COLOR,
                    }}>
                    <Image
                      source={Images.success}
                      style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: 15,
                      }}
                    />
                    <Text
                      style={{
                        fontFamily: Constants.Fonts.REGULAR,
                        fontSize: 13,
                        color: Constants.APP_GREEN_COLOR,
                        marginHorizontal: 35,
                        marginBottom: 20,
                        marginTop: 13,
                        textAlign: 'center',
                      }}>
                      {'Your order has been placed and a confirmation email has been sent - Your order number is ' +
                        orderDetail.increment_id +
                        ' its getting prepared for delivery'}
                    </Text>
                  </View>
                  <View style={styles.scrollContainer}>
                    <FlatList
                      style={{
                        flex: 1,
                        backgroundColor: Constants.APP_WHITE_COLOR,
                      }}
                      data={orderDetail.items}
                      extraData={orderDetail.items}
                      renderItem={({item, index}) => (
                        <CategoryCell
                          item={item}
                          index={index}
                          currency={currency}
                          navigation={this.props.navigation}
                          productsAges={productsAges}
                          productsAgeGroups={productsAgeGroups}
                          productsBrands={productsBrands}
                          productsGenders={productsGenders}
                          props={this.props}
                          totalItems={orderDetail.items}
                        />
                      )}
                    />

                    <View style={styles.cardWrapper}>
                      {/* <View
                  style={[styles.underLineStyle, { marginVertical: 1.5 }]}
                /> */}
                      <View style={styles.wrapper}>
                        <Text style={styles.normalText}>
                          {translate('Order subtotal')}
                        </Text>
                        <Text style={styles.normalText}>
                          {orderDetail.subtotal.toFixed(3) + ' ' + currency}
                        </Text>
                      </View>
                      {orderDetail && (
                        <View style={styles.wrapper}>
                          <Text style={styles.normalText}>
                            {translate('Cart discount')}
                          </Text>
                          <Text
                            style={
                              ([styles.normalText],
                              {
                                fontFamily: Constants.Fonts.MEDIUM,
                                color: Constants.APP_RED_COLOR,
                              })
                            }>
                            {Number(orderDetail.discount_amount).toFixed(3) +
                              ' ' +
                              orderDetail.order_currency_code}
                          </Text>
                        </View>
                      )}
                      <View style={styles.wrapper}>
                        <Text style={styles.normalText}>
                          {translate('Shipping')}
                        </Text>
                        <Text style={styles.normalText}>
                          {shippingAmount &&
                            shippingAmount.toFixed(3) + ' ' + currency}
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.underLineStyle,
                          {marginTop: 9.5, marginBottom: 1.5},
                        ]}
                      />
                      <View style={styles.wrapper}>
                        <Text style={styles.normalTextBold}>
                          {translate('TOTAL')}
                        </Text>
                        <Text style={styles.normalTextBold}>
                          {orderDetail.grand_total.toFixed(3) + ' ' + currency}
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.underLineStyle,
                          {marginBottom: 5.5, marginTop: 10.5},
                        ]}
                      />
                    </View>

                    <View style={styles.wrapperColumn}>
                      <Text style={styles.largeTextBold}>
                        {translate('Personal information')}
                      </Text>
                      <Text style={styles.addressText}>
                        {deliveryAddressDict &&
                          deliveryAddressDict.firstname +
                            ' ' +
                            deliveryAddressDict.lastname +
                            '\n' +
                            deliveryAddressDict.email}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.underLineStyle,
                        {marginBottom: 5.5, marginTop: 1.5},
                      ]}
                    />
                    <View style={styles.wrapperColumn}>
                      <Text style={styles.largeTextBold}>
                        {translate('Delivery Address2')}
                      </Text>
                      <Text style={styles.addressText}>
                        {
                          //  'Cecilia Chapman \n711-2880 Nulla St. \nMankato Mississippi 96522 \n(257) 563-7401'
                          deliveryAddressDict.firstname +
                            ' ' +
                            deliveryAddressDict.lastname +
                            '\n' +
                            deliveryAddressDict.street +
                            '\n' +
                            deliveryAddressDict.city +
                            // "\n" +
                            // deliveryAddressDict.postcode +
                            '\n' +
                            deliveryAddressDict.telephone
                        }
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.underLineStyle,
                        {marginBottom: 5.5, marginTop: 1.5},
                      ]}
                    />
                    <View style={styles.wrapperColumn}>
                      <Text style={styles.largeTextBold}>
                        {translate('Billing Address')}
                      </Text>
                      <Text style={styles.addressText}>
                        {
                          //  'Cecilia Chapman \n711-2880 Nulla St. \nMankato Mississippi 96522 \n(257) 563-7401'
                          billingAddressDict.firstname +
                            ' ' +
                            billingAddressDict.lastname +
                            '\n' +
                            billingAddressDict.street +
                            '\n' +
                            billingAddressDict.city +
                            // "\n" +
                            // billingAddressDict.postcode +
                            '\n' +
                            billingAddressDict.telephone
                        }
                      </Text>
                    </View>
                    {deliveryNote !== '' && (
                      <View
                        style={[styles.underLineStyle, {marginBottom: 10.5}]}
                      />
                    )}

                    {deliveryNote !== '' && (
                      <View style={styles.wrapperColumn}>
                        <Text style={styles.largeTextBold}>
                          {translate('Delivery note')}
                        </Text>
                        <Text style={styles.addressText}>{deliveryNote}</Text>
                      </View>
                    )}

                    <View
                      style={[
                        styles.underLineStyle,
                        {marginBottom: 5.5, marginTop: 1.5},
                      ]}
                    />
                    <View style={{marginHorizontal: 20}}>
                      <Text style={styles.largeTextBold}>
                        {translate('Payment Details')}
                      </Text>
                      {isCod ? (
                        <Text style={[styles.addressText, {marginBottom: 20}]}>
                          {translate('Payment Method') + ' - ' + paymethod}
                        </Text>
                      ) : paymentInfo ? (
                        <View style={{marginBottom: 20}}>
                          <Text style={[styles.addressText, {}]}>
                            {translate('Invoice No') +
                              ' : ' +
                              paymentInfo.invoiceId}
                          </Text>
                          <Text style={[styles.addressText, {}]}>
                            {translate('Amount') +
                              ' : ' +
                              Number(orderDetail.payment.amount_paid).toFixed(
                                3,
                              ) +
                              ' ' +
                              orderDetail.order_currency_code}
                          </Text>
                          <Text style={[styles.addressText, {}]}>
                            {translate('Order No') +
                              ' : ' +
                              orderDetail.increment_id}
                          </Text>
                          <Text style={[styles.addressText, {}]}>
                            {translate('Reference No') +
                              ' : ' +
                              paymentInfo.TransactionId}
                          </Text>
                          <Text style={[styles.addressText, {}]}>
                            {translate('Gateway') +
                              ' : ' +
                              paymentInfo.paymentGateway}
                          </Text>
                          <Text style={[styles.addressText, {}]}>
                            {translate('Status') +
                              ' : ' +
                              paymentInfo.invoiceStatus}
                          </Text>
                        </View>
                      ) : null}
                    </View>
                  </View>
                </View>
              );
            }}></FlatList>
        )}
        {isLoading && <HudView />}
      </SafeAreaView>
    );
  }
}

export default OrderCompletionScreen;

/**
 * Created by iLeaf Solutions Pvt.Ltd
 * on February 19, 2020
 * AddressListView - Address List View will show the Addresses of user.
 */

import {
  View,
  Text,
  Image,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Switch,
} from 'react-native';
import {WebView} from 'react-native-webview';
import HudView from '../../components/hudView';
import React, {Component, memo} from 'react';
import NavigationHeader1 from '../../components/NavigationHeaders/NavigationHeader1';
import Images from '../../config/images';
import {translate} from '../../config/languageSwitching/index';
import constants from '../../config/constants';
import {TextField} from 'react-native-material-textfield';
import FooterButton from '../../components/FooterButton/FooterButton';
import {showSingleAlert} from '../../config/common';

function detectCardType(number) {
  var re = {
    visa: /^4[0-9]{6,}$/, // /^4[0-9]{12}(?:[0-9]{3})?$/,
    mastercard:
      /^5[1-5][0-9]{5,}|222[1-9][0-9]{3,}|22[3-9][0-9]{4,}|2[3-6][0-9]{5,}|27[01][0-9]{4,}|2720[0-9]{3,}$/,
    'American Express': /^3[47][0-9]{5,}$/,
    'Diners Club': /^3(?:0[0-5]|[68][0-9])[0-9]{4,}$/,
    Discover: /^6(?:011|5[0-9]{2})[0-9]{3,}$/,
    JCB: /^(?:2131|1800|35[0-9]{3})[0-9]{3,}$/,
  };

  for (var key in re) {
    if (re[key].test(number)) {
      return key;
    }
  }
}

class PaymentScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loaderVisible: true,
      isSaveCardDetails: false,

      cardHolderName: '',
      cardNumber: '',
      expireMonth: '',
      expireYear: '',
      securityNumber: '',
      isSelectSavedCard: props.savedCardInfo ? true : false,
      cardType: '',
    };
  }

  componentDidMount() {
    //   const { params } = this.props.navigation.state;
    //   // console.log("isRTL", params.qty);
    //   this.setState({
    //     heading: params.heading,
    //     url: params.url,
    //   });
  }

  //Header Back Arrow Function
  _didTapOnBackButton = () => {
    //   this.props.navigation.goBack();
  };

  didTapOnPay = () => {
    const {
      cardHolderName,
      cardNumber,
      expireMonth,
      expireYear,
      securityNumber,
      isSaveCardDetails,
      isSelectSavedCard,
      cardType,
    } = this.state;

    const {savedCardInfo} = this.props;

    if (isSelectSavedCard) {
      if (securityNumber.trim() == '') {
        showSingleAlert(translate('security number empty'));
        return;
      }
      let params = {
        card: '',
        expirymonth: '',
        expiryyear: '',
        cvc: securityNumber,
        holder: '',
        tokenpayment: '1',
        savetoken: '0',
        cardtype: '',
      };
      this.props.didTapOnClose();
      this.props.didTapOnPay(params);
    } else {
      if (cardHolderName.trim() == '') {
        showSingleAlert(translate('card holder name empty'));
        return;
      } else if (cardNumber.trim() == '') {
        showSingleAlert(translate('card number empty'));
        return;
      } else if (cardNumber.length !== 16) {
        showSingleAlert(translate('card number invalid'));
        return;
      } else if (expireMonth.trim() == '') {
        showSingleAlert(translate('expire month empty'));
        return;
      } else if (expireMonth.length !== 2) {
        showSingleAlert(translate('expire month invalid'));
        return;
      } else if (expireYear.trim() == '') {
        showSingleAlert(translate('expire year empty'));
        return;
      } else if (expireYear.length !== 2) {
        showSingleAlert(translate('expire year invalid'));
        return;
      } else if (securityNumber.trim() == '') {
        showSingleAlert(translate('security number empty'));
        return;
      }
      let params = {
        card: cardNumber,
        expirymonth: expireMonth,
        expiryyear: expireYear,
        cvc: securityNumber,
        holder: cardHolderName,
        tokenpayment: '0',
        savetoken: isSaveCardDetails,
        cardtype: cardType,
      };
      this.props.didTapOnClose();
      this.props.didTapOnPay(params);
    }
  };

  render() {
    const {isSaveCardDetails, isSelectSavedCard, cardType} = this.state;
    const {currency, cartTotal, shippingAmount, savedCardInfo} = this.props;
    return (
      <View
        style={{
          backgroundColor: 'white',
          height: '80%',
          //   flex: 1,
          width: '100%',
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
        }}>
        <TouchableOpacity
          onPress={() => {
            this.props.didTapOnClose();
          }}
          style={{
            width: 30,
            height: 30,
            backgroundColor: 'rgba(110,110,110,0.1)',
            marginLeft: 20,
            marginTop: 20,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 5,
          }}>
          <Image style={{tintColor: 'black'}} source={Images.close}></Image>
        </TouchableOpacity>

        <ScrollView>
          <View style={{flex: 1, marginHorizontal: 20}}>
            {savedCardInfo && (
              <View>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({isSelectSavedCard: !isSelectSavedCard});
                  }}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 20,
                  }}>
                  <View style={styles.optionBackground}>
                    <View
                      style={
                        isSelectSavedCard ? styles.optionStatus : {}
                      }></View>
                  </View>
                  <Text
                    style={{
                      fontFamily: constants.Fonts.BOLD,
                      color: constants.APP_BLACK_COLOR,
                      fontSize: 15,
                      marginLeft: 20,
                      textAlign: 'left',
                    }}>
                    {translate('Saved Card Details')}
                  </Text>
                </TouchableOpacity>
                <View
                  style={
                    isSelectSavedCard ? {} : {height: 0, overflow: 'hidden'}
                  }>
                  <Text
                    style={{
                      fontFamily: constants.Fonts.MEDIUM,
                      color: 'rgb(91,91,91)',
                      fontSize: 14,
                      marginTop: 20,
                      textAlign: 'left',
                    }}>
                    {translate('Card Type') + ' : ' + savedCardInfo.type}
                  </Text>
                  <Text
                    style={{
                      fontFamily: constants.Fonts.MEDIUM,
                      color: 'rgb(91,91,91)',
                      fontSize: 14,
                      marginTop: 20,
                      textAlign: 'left',
                    }}>
                    {translate('Card Number') +
                      ' : ' +
                      '************' +
                      savedCardInfo.card}
                  </Text>
                  <TextField
                    ref={ref => (this.securityCode = ref)}
                    defaultValue={
                      this.state.datePicked
                        ? format(this.state.newDate, 'dd-MM-yyyy')
                        : null
                    }
                    containerStyle={styles.containerStyle}
                    labelTextStyle={styles.inpuLabelTextStyle}
                    style={{
                      fontFamily: constants.Fonts.REGULAR,
                      color: 'rgb(91, 91, 91)',
                    }}
                    secureTextEntry={true}
                    keyboardType={'number-pad'}
                    labelFontSize={16}
                    fontSize={16}
                    textColor={'rgb(91, 91, 91)'}
                    labelOffset={{x0: 0, y0: 0, x1: 0, y1: -9}}
                    activeLineWidth={1.5}
                    lineWidth={1}
                    tintColor={'rgb(142, 142, 142)'}
                    baseColor={'rgb(193, 193, 193)'}
                    autoCorrect={false}
                    enablesReturnKeyAutomatically={true}
                    onFocus={this.onFocus}
                    onChangeText={txt => this.setState({securityNumber: txt})}
                    onSubmitEditing={this.onSubmitDate}
                    returnKeyType="next"
                    label={translate('Security code')}
                    // error={errors.date}
                    blurOnSubmit={false}
                    maxLength={5}
                  />
                </View>
              </View>
            )}

            {savedCardInfo ? (
              <TouchableOpacity
                onPress={() => {
                  this.setState({isSelectSavedCard: !isSelectSavedCard});
                }}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 20,
                }}>
                <View style={styles.optionBackground}>
                  <View
                    style={isSelectSavedCard ? {} : styles.optionStatus}></View>
                </View>
                <Text
                  style={{
                    fontFamily: constants.Fonts.BOLD,
                    color: constants.APP_BLACK_COLOR,
                    fontSize: 15,
                    textAlign: 'left',
                    marginLeft: 20,
                  }}>
                  {savedCardInfo
                    ? translate('New Card Details')
                    : translate('Card Details')}
                </Text>
              </TouchableOpacity>
            ) : (
              <Text
                style={{
                  fontFamily: constants.Fonts.BOLD,
                  color: constants.APP_BLACK_COLOR,
                  fontSize: 15,
                  textAlign: 'left',
                  marginTop: 20,
                }}>
                {savedCardInfo
                  ? translate('New Card Details')
                  : translate('Card Details')}
              </Text>
            )}
            <View
              style={
                isSelectSavedCard
                  ? {height: 0, overflow: 'hidden', marginBottom: 20}
                  : {}
              }>
              <TextField
                ref={ref => (this.holderName = ref)}
                containerStyle={styles.containerStyle}
                labelTextStyle={styles.inpuLabelTextStyle}
                style={{
                  fontFamily: constants.Fonts.REGULAR,
                }}
                labelFontSize={16}
                fontSize={16}
                textColor={'rgb(91,91,91)'}
                labelOffset={{x0: 0, y0: 0, x1: 0, y1: -9}}
                activeLineWidth={1.5}
                lineWidth={1}
                tintColor={'rgb(142, 142, 142)'}
                baseColor={'rgb(193, 193, 193)'}
                autoCorrect={false}
                enablesReturnKeyAutomatically={true}
                onFocus={this.onFocus}
                onChangeText={txt => this.setState({cardHolderName: txt})}
                onSubmitEditing={() => {
                  this.cardNumber.focus();
                }}
                returnKeyType="next"
                label={translate('Card Holder Name')}
                maxLength={30}
                blurOnSubmit={false}
                formatText={this.formatSpacing}
              />
              <TextField
                ref={ref => (this.cardNumber = ref)}
                containerStyle={styles.containerStyle}
                labelTextStyle={styles.inpuLabelTextStyle}
                style={{
                  fontFamily: constants.Fonts.REGULAR,
                }}
                keyboardType={'decimal-pad'}
                labelFontSize={16}
                fontSize={16}
                textColor={'rgb(91,91,91)'}
                labelOffset={{x0: 0, y0: 0, x1: 0, y1: -9}}
                activeLineWidth={1.5}
                lineWidth={1}
                tintColor={'rgb(142, 142, 142)'}
                baseColor={'rgb(193, 193, 193)'}
                autoCorrect={false}
                enablesReturnKeyAutomatically={true}
                onFocus={this.onFocus}
                onChangeText={txt => {
                  console.log('CARD TYPE---');

                  if (txt.length > 1) {
                    let cardType = detectCardType(Number(txt));
                    console.log('CARD TYPE---', cardType);
                    if (cardType && cardType.length > 0) {
                      this.setState({cardType});
                    } else {
                      this.setState({cardType: ''});
                    }
                  }
                  this.setState({cardNumber: txt});
                }}
                onSubmitEditing={() => {
                  // this.cardNumber.focus();
                }}
                returnKeyType="next"
                label={translate('Card Number')}
                maxLength={30}
                blurOnSubmit={false}
                formatText={this.formatSpacing}
              />
              <Text
                style={{
                  fontFamily: constants.Fonts.REGULAR,
                  color: 'rgb(91,91,91)',
                }}>
                {cardType.toUpperCase()}
              </Text>
              <View style={{flexDirection: 'row'}}>
                <TextField
                  ref={ref => (this.expiryMonth = ref)}
                  // containerStyle={styles.containerStyle}
                  containerStyle={{
                    flex: 1,
                    paddingRight: 20,
                    zIndex: 1000,
                  }}
                  labelTextStyle={styles.inpuLabelTextStyle}
                  style={{
                    fontFamily: constants.Fonts.REGULAR,
                  }}
                  labelFontSize={16}
                  fontSize={16}
                  keyboardType={'number-pad'}
                  textColor={'rgb(91,91,91)'}
                  labelOffset={{x0: 0, y0: 0, x1: 0, y1: -9}}
                  activeLineWidth={1.5}
                  lineWidth={1}
                  tintColor={'rgb(142, 142, 142)'}
                  baseColor={'rgb(193, 193, 193)'}
                  autoCorrect={false}
                  enablesReturnKeyAutomatically={true}
                  onFocus={this.onFocus}
                  onChangeText={txt => this.setState({expireMonth: txt})}
                  onSubmitEditing={this.onSubmitOccasion}
                  returnKeyType="next"
                  label={translate('Expiry Month')}
                  maxLength={2}
                  blurOnSubmit={false}
                  formatText={this.formatSpacing}
                />
                <View style={{paddingHorizontal: 10}} />
                <TextField
                  ref={ref => (this.expiryDate = ref)}
                  containerStyle={styles.containerStyle}
                  labelTextStyle={styles.inpuLabelTextStyle}
                  style={{
                    fontFamily: constants.Fonts.REGULAR,
                  }}
                  labelFontSize={16}
                  fontSize={16}
                  keyboardType={'number-pad'}
                  textColor={'rgb(91,91,91)'}
                  labelOffset={{x0: 0, y0: 0, x1: 0, y1: -9}}
                  activeLineWidth={1.5}
                  lineWidth={1}
                  tintColor={'rgb(142, 142, 142)'}
                  baseColor={'rgb(193, 193, 193)'}
                  autoCorrect={false}
                  enablesReturnKeyAutomatically={true}
                  onFocus={this.onFocus}
                  onChangeText={txt => this.setState({expireYear: txt})}
                  onSubmitEditing={this.onSubmitOccasion}
                  returnKeyType="next"
                  label={translate('Expiry Year')}
                  maxLength={2}
                  blurOnSubmit={false}
                  formatText={this.formatSpacing}
                />
                <View style={{paddingHorizontal: 10}} />
              </View>

              <TextField
                ref={ref => (this.securityCode = ref)}
                defaultValue={
                  this.state.datePicked
                    ? format(this.state.newDate, 'dd-MM-yyyy')
                    : null
                }
                containerStyle={styles.containerStyle}
                labelTextStyle={styles.inpuLabelTextStyle}
                style={{
                  fontFamily: constants.Fonts.REGULAR,
                  color: 'rgb(91, 91, 91)',
                }}
                keyboardType={'number-pad'}
                labelFontSize={16}
                fontSize={16}
                textColor={'rgb(91, 91, 91)'}
                labelOffset={{x0: 0, y0: 0, x1: 0, y1: -9}}
                activeLineWidth={1.5}
                lineWidth={1}
                tintColor={'rgb(142, 142, 142)'}
                baseColor={'rgb(193, 193, 193)'}
                autoCorrect={false}
                enablesReturnKeyAutomatically={true}
                onFocus={this.onFocus}
                onChangeText={txt => this.setState({securityNumber: txt})}
                onSubmitEditing={this.onSubmitDate}
                secureTextEntry={true}
                returnKeyType="next"
                label={translate('Security code')}
                // error={errors.date}
                blurOnSubmit={false}
                maxLength={5}
              />

              {/* <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 20,
                }}>
                <Text
                  style={{
                    flex: 1,
                    marginRight: 10,
                    fontFamily: constants.Fonts.REGULAR,
                    fontSize: 14,
                    textAlign: 'left',
                  }}>
                  {translate('save card description')}
                </Text>
                <Switch
                  trackColor={{false: 'gray', true: constants.APP_THEME_COLOR}}
                  thumbColor={constants.APP_WHITE_COLOR}
                  ios_backgroundColor="gray"
                  onValueChange={value => {
                    this.setState({isSaveCardDetails: value});
                  }}
                  value={isSaveCardDetails}
                />
              </View> */}
            </View>
            {/* <View
              style={{
                flexDirection: 'row',
                marginTop: 20,
                height: 40,
                borderBottomColor: constants.APP_SEPARATOR_COLOR,
                borderBottomWidth: 1,
              }}>
              <Image
                source={Images.lock}
                style={{tintColor: constants.APP_THEME_COLOR}}></Image>
              <Text
                style={{
                  fontSize: 16,
                  color: constants.APP_THEME_COLOR,
                  fontFamily: constants.Fonts.REGULAR,
                  marginLeft: 15,
                }}>
                {translate('more about card security')}
              </Text>
            </View> */}
            <View style={styles.totalViewContainer}>
              <Text
                style={[
                  styles.titleLabel,
                  styles.totalTitle,
                  {color: constants.APP_GRAY_COLOR},
                ]}>
                {translate('Cart Total')}
              </Text>
              <Text style={[styles.titleLabel]}>
                {Number(cartTotal - shippingAmount).toFixed(3) + ' ' + currency}
              </Text>
            </View>
            {shippingAmount !== 0 && (
              <View style={styles.totalViewContainer}>
                <Text
                  style={[
                    styles.titleLabel,
                    styles.totalTitle,
                    {color: constants.APP_GRAY_COLOR},
                  ]}>
                  {translate('Shipping Charges')}
                </Text>
                <Text style={[styles.titleLabel]}>
                  {Number(shippingAmount).toFixed(3) + ' ' + currency}
                </Text>
              </View>
            )}
            <View style={styles.totalViewContainer}>
              <Text style={[styles.titleLabel, styles.totalTitle]}>
                {translate('TOTAL')}
              </Text>
              <Text style={[styles.titleLabel, styles.grandTotalText]}>
                {Number(cartTotal).toFixed(3) + ' ' + currency}
              </Text>
            </View>

            <Text
              style={{
                flex: 1,
                marginRight: 10,
                fontFamily: constants.Fonts.REGULAR,
                fontSize: 14,
                marginBottom: 25,
                textAlign: 'left',
              }}>
              {translate('paymentTerms')}
            </Text>
          </View>
        </ScrollView>
        <FooterButton
          buttonText1={translate('Cancel').toUpperCase()}
          buttonText2={translate('pay').toUpperCase()}
          onButton1Click={() => {
            this.props.didTapOnClose();
          }}
          onButton2Click={this.didTapOnPay}
          screenWidth={this.props.screenWidth}
        />
      </View>
    );
  }
}

export default PaymentScreen;

const styles = StyleSheet.create({
  containerStyle: {
    // marginTop: 8,
    flex: 1,
  },
  inpuLabelTextStyle: {
    fontFamily: constants.Fonts.REGULAR,
    marginTop: 10,
    fontSize: 16,
    color: 'rgb(193, 193, 193)',
  },
  totalViewContainer: {flexDirection: 'row', marginBottom: 10},
  titleLabel: {
    marginVertical: 8,
    fontFamily: constants.Fonts.REGULAR,
    fontSize: 14,
    color: constants.APP_GRAY_COLOR3,
    textAlign: 'left',
  },
  titleValueLabel: {
    flex: 1,
    marginVertical: 8,
    fontFamily: constants.Fonts.REGULAR,
    fontSize: 14,
    color: constants.APP_GRAY_COLOR3,
    textAlign: 'right',
  },
  totalTitle: {
    flex: 1,
    fontFamily: constants.Fonts.BOLD,
    color: constants.APP_BLACK_COLOR,
  },
  totalViewContainer: {flexDirection: 'row', marginBottom: 10},
  grandTotalText: {
    fontFamily: constants.Fonts.BOLD,
    color: constants.APP_BLACK_COLOR,
  },
  optionBackground: {
    width: 20,
    height: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    borderWidth: 3,
    borderColor: constants.APP_THEME_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionStatus: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: constants.APP_THEME_COLOR,
  },
});

/**
 * Created by Jebin for iLeaf Solutions Pvt.Ltd
 * on March 18, 2020
 * Checkout style -
 */

import {StyleSheet, I18nManager} from 'react-native';
import AppStyles from '../../config/styles';
import Constants from '../../config/constants';
import {normalizedHeight, normalizedWidth} from '../../config/common';

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: AppStyles.color.COLOR_WHITE,
  },
  container: {
    backgroundColor: 'rgb(241,243,246)',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Constants.APP_WHITE_COLOR,
  },
  titleText: {
    fontSize: 15,
    fontFamily: Constants.Fonts.REGULAR,
    flex: 1,
    textAlign: 'left',
    marginLeft: 30,
    color: Constants.APP_GRAY_COLOR3,
  },
  separatorView: {
    height: 10,
    backgroundColor: Constants.APP_GRAY_COLOR2,
  },
  searchButton: {
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchHistoryText: {
    fontFamily: Constants.Fonts.REGULAR,
    fontSize: 14,
    color: Constants.APP_GRAY_COLOR3,
    textAlign: 'left',
    marginLeft: 18,
  },
  recentSearchTitle: {
    fontFamily: Constants.Fonts.MEDIUM,
    fontSize: 15,
    color: Constants.APP_BLACK_COLOR,
    textAlign: 'left',
    flex: 1,
  },
  clearButonText: {
    fontFamily: Constants.Fonts.LIGHT,
    fontSize: 15,
    color: Constants.APP_GRAY_COLOR,
  },
  searchHistoryTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    marginHorizontal: 20,
  },
  addVoucherCode: {
    fontSize: 16,
    fontFamily: Constants.Fonts.BOLD,
    color: Constants.APP_BLACK_COLOR,
    marginVertical: 10,
    textAlign: 'left',
  },
  addVoucherCode1: {
    fontSize: 14,
    fontFamily: Constants.Fonts.REGULAR,
    color: Constants.APP_BLACK_COLOR,
    marginVertical: 10,
    textAlign: 'left',
    lineHeight: 24,
  },
  addVoucherCode2: {
    fontSize: 14,
    fontFamily: Constants.Fonts.REGULAR,
    color: 'rgb(120,120,120)',
    // marginVertical: 10,
    textAlign: 'left',
  },
  voucherInput: {
    flex: 1,
    fontSize: 13,
    fontFamily: Constants.Fonts.REGULAR,
    color: 'rgb(164,164,164)',
    height: 42,
    borderRadius: 5,
    paddingLeft: 10,
    backgroundColor: 'rgb(249,249,249)',
    borderWidth: 1,
    borderColor: 'rgb(217,217,217)',
  },
  dateInput: {
    flex: 1,
    fontSize: 12,
    fontFamily: Constants.Fonts.REGULAR,
    color: 'rgb(120,120,120)',
    height: 42,
    borderRadius: 5,
    paddingLeft: 20,
    // backgroundColor: "rgb(249,249,249)",
    borderWidth: 1,
    borderColor: Constants.APP_GRAY_COLOR3,
  },
  applyButton: {
    width: normalizedWidth(83),
    height: 42,
    backgroundColor: Constants.APP_THEME_COLOR,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  applyText: {
    fontSize: 13,
    fontFamily: Constants.Fonts.MEDIUM,
    color: Constants.APP_WHITE_COLOR,
  },
  itemCellContainer: {
    marginTop: 5,
    backgroundColor: Constants.APP_WHITE_COLOR,
    flex: 1,
  },
  paymentMethodButton: {
    // backgroundColor: "rgb(244,246,248)",
    height: 45,
    alignItems: 'center',
    marginBottom: 5,
    flexDirection: 'row',

    backgroundColor: 'rgb(249,249,249)',
    // margin: 20,
    // shadowOffset: { width: 0, height: 2 },
    // shadowColor: "rgba(46,69,187,0.56)",
    // shadowOpacity: 0.3,
    // shadowRadius: 5,
    borderRadius: 5,
    paddingBottom: 5,
    paddingTop: 5,
    paddingHorizontal: 10,
    // elevation: 3,
  },
  paymentOption: {
    marginLeft: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Constants.APP_GRAY_COLOR3,
  },
  paymentOption2: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  paymentText: {
    fontFamily: Constants.Fonts.REGULAR,
    fontSize: 14,
    color: Constants.APP_GRAY_COLOR,
    marginLeft: 25,
    textAlign: 'left',
    marginRight: 5,
  },
  addressText: {
    marginVertical: 5,
    fontFamily: Constants.Fonts.REGULAR,
    fontSize: 14,
    color: Constants.APP_GRAY_COLOR3,
    textAlign: 'left',
  },
  titleLabel: {
    marginVertical: 8,
    fontFamily: Constants.Fonts.REGULAR,
    fontSize: 14,
    color: Constants.APP_GRAY_COLOR3,
    textAlign: 'left',
  },
  titleValueLabel: {
    flex: 1,
    marginVertical: 8,
    fontFamily: Constants.Fonts.REGULAR,
    fontSize: 14,
    color: Constants.APP_GRAY_COLOR3,
    textAlign: 'right',
  },
  bottomButtonContainer: {
    height: normalizedHeight(100),
    width: '100%',
    backgroundColor: Constants.APP_WHITE_COLOR,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addTocartButton: {
    flex: 1,
    borderRadius: 15,
    height: normalizedHeight(60),
    borderWidth: 1,
    marginLeft: 20,
    marginRight: 10,
    borderColor: Constants.APP_GRAY_COLOR3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buyNowButton: {
    borderRadius: normalizedHeight(54 / 2),
    height: normalizedHeight(54),
    marginRight: 20,
    marginLeft: 10,
    backgroundColor: Constants.APP_THEME_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
    alignSelf: 'center',
  },
  buyNowText: {
    fontFamily: Constants.Fonts.MEDIUM,
    fontSize: 15,
    color: Constants.APP_WHITE_COLOR,
  },
  tickSwitch: {
    width: 20,
    height: 20,
    tintColor: Constants.APP_BLACK_COLOR,
    paddingRight: 5,
  },
  sameDayDeliveryPickerContainer: {
    height: 70,
    flex: 1,
    marginTop: 10,
  },
  deliveryDateText: {
    fontFamily: Constants.Fonts.REGULAR,
    fontSize: 12,
    color: Constants.APP_GRAY_COLOR3,
  },
  pickerButton: {
    borderWidth: 1,
    borderColor: Constants.APP_GRAY_COLOR3,
    height: 30,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    width: '80%',
  },
  dateText: {
    fontFamily: Constants.Fonts.REGULAR,
    fontSize: 12,
    color: Constants.APP_GRAY_COLOR3,
  },
  shippingAndTotal: {
    backgroundColor: Constants.APP_WHITE_COLOR,
    // margin: 20,
    // shadowOffset: { width: 0, height: 2 },
    // shadowColor: "rgba(46,69,187,0.56)",
    // shadowOpacity: 0.3,
    // shadowRadius: 5,
    // borderRadius: 5,
    paddingBottom: 5,
    // paddingTop: 5,
    // marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 20,
    // elevation: 3,
  },
  TotalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  simpleRow: {
    flexDirection: 'row',
  },
  removeWrap: {
    backgroundColor: constants.APP_RED_COLOR,
    height: normalizedHeight(17),
    width: normalizedWidth(74),
    justifyContent: 'center',
    // padding: 10,
    height: 17,
    borderRadius: 2,
    marginVertical: 8,
  },
  removeText: {
    textAlign: 'center',
    color: constants.APP_WHITE_COLOR,
    fontFamily: constants.Fonts.REGULAR,
    fontSize: 10,
  },
  TotalValuesRed: {
    fontSize: 14,
    fontFamily: constants.Fonts.MEDIUM,
    color: constants.APP_RED_COLOR,
    lineHeight: 20,
    // marginBottom: 13,
  },
  TotalLabel: {
    fontSize: 14,
    fontFamily: constants.Fonts.REGULAR,
    color: constants.APP_GRAY_COLOR,
    lineHeight: 20,
    marginVertical: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    paddingTop: 10,
    flex: 1,
  },
  checkBoxWrap: {
    width: '50%',
    // marginRight: 38,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    paddingTop: 10,
  },
  checkBoxWrap1: {
    width: '50%',
    // marginRight: 38,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    // paddingTop: 10,
  },
  checkBoxWrap2: {
    width: '45%',
    // marginRight: 38,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    // paddingTop: 10,
  },
  checkboxImg: {
    height: 18,
    width: 18,
    marginRight: 10,
    tintColor: '#44c856',
  },
  unCheckboxImg: {
    height: 18,
    width: 18,
    marginRight: 10,
    tintColor: constants.APP_GRAY_COLOR3,
  },
  semiBoldText: {
    fontSize: 11,
    color: constants.APP_GRAY_COLOR,
    fontFamily: constants.Fonts.MEDIUM,
  },
  addAddressButton: {
    height: 26,
    width: 135,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Constants.APP_THEME_COLOR,
    marginBottom: 10,
  },
  addAddressButtonText: {
    fontFamily: Constants.Fonts.REGULAR,
    color: Constants.APP_GREY_TEXT_COLOR,
    fontSize: 13,
  },
  changeAddressButtonText: {
    fontFamily: Constants.Fonts.REGULAR,
    color: Constants.APP_GRAY_COLOR,
    fontSize: 13,
    textAlign: 'left',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  changeAddressButton: {
    borderColor: Constants.APP_THEME_COLOR,
    borderWidth: 1,
    borderRadius: 24,
    position: 'absolute',
    right: 0,
    top: -35,
  },
  removeVoucher: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  grandTotalText: {
    fontFamily: Constants.Fonts.BOLD,
    color: Constants.APP_BLACK_COLOR,
  },
  totalTitle: {
    flex: 1,
    fontFamily: Constants.Fonts.BOLD,
    color: Constants.APP_BLACK_COLOR,
  },
  totalViewContainer: {flexDirection: 'row', marginBottom: 10},
  separatorView2: {
    height: 1,
    backgroundColor: Constants.APP_SEPARATOR_COLOR,
    marginVertical: 5,
  },
  separatorView3: {
    height: 1,
    backgroundColor: Constants.APP_SEPARATOR_COLOR,
    marginVertical: 10,
    marginHorizontal: 20,
  },
  lineView: {height: 1, backgroundColor: Constants.APP_SEPARATOR_COLOR},
  lineView2: {height: 1, backgroundColor: Constants.APP_GRAY_COLOR2},
  voucherSubContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  voucherTitle: {
    fontFamily: Constants.Fonts.MEDIUM,
    fontSize: 14,
    marginTop: 10,
    textAlign: 'left',
  },
  itemList: {flex: 1, backgroundColor: Constants.APP_WHITE_COLOR},
  listContainer: {flex: 1, backgroundColor: Constants.APP_WHITE_COLOR},
  itemContainer: {
    backgroundColor: Constants.APP_WHITE_COLOR,
    paddingBottom: 5,
    marginTop: 10,
  },
  deliveryNoteModalWrapper: {
    //flex: 1,
    width: Constants.SCREEN_WIDTH,
    height: Constants.SCREEN_HEIGHT,
    // paddingHorizontal: 5,
    // alignItems: "center",
    alignSelf: 'center',
    justifyContent: 'flex-end',
  },
  deliveryNoteCardWrapper: {
    backgroundColor: 'rgb(255,255,255)',
    borderRadius: 15,
    width: '94%',
  },
  deliveryNoteText: {
    margin: 22,
    fontFamily: Constants.Fonts.MEDIUM,
    alignSelf: 'center',
    color: 'rgb(42,42,42)',
    fontSize: 17,
  },
  inputContainerFull: {
    borderWidth: 1,
    borderColor: 'rgb(164, 164, 164)',
    borderRadius: 15,
    width: '91%',
    // height: normalizedHeight(48),
    marginTop: 10,
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
  },
  deliveryNoteInputs: {
    minHeight: normalizedHeight(45),
    maxHeight: normalizedHeight(150),
    margin: 5,
    borderBottomColor: '#FFFFFF',
    flex: 1,
    color: 'rgb(164, 164,164)',
    textAlign: I18nManager.isRTL ? 'right' : 'left',
    fontFamily: Constants.Fonts.LIGHT,
    marginTop: 10,
  },
  pwdSubmitWrapper: {
    flexDirection: 'row',
    width: '91%',
    alignSelf: 'center',
    justifyContent: 'space-evenly',
    marginTop: 32,
    marginBottom: 26,
  },
  pwdCancelWrapper: {
    height: normalizedHeight(40),
    width: '45%',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 13,
    borderWidth: 1,
    borderColor: 'rgb(112,112,112)',
  },
  pwdCancelTxt: {
    fontFamily: Constants.Fonts.MEDIUM,
    color: 'rgb(42,42,42)',
  },
  pwdSubmitBtnWrapper: {
    height: normalizedHeight(40),
    width: '45%',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 13,
    backgroundColor: Constants.APP_THEME_COLOR,
  },
  pwdSubmitTxt: {
    fontFamily: Constants.Fonts.MEDIUM,
    color: 'rgb(255,255,255)',
  },
});

export default styles;
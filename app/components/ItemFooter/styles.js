/**
 * Created by Jebin for iLeaf Solutions Pvt.Ltd
 * on March 18, 2020
 * Checkout style -
 */

import { StyleSheet } from "react-native";
import AppStyles from "../../config/styles";
import Constants from "../../config/constants";
import { normalizedHeight, normalizedWidth } from "../../config/common";

const styles = StyleSheet.create({
  dateText: {
    fontFamily: Constants.Fonts.REGULAR,
    fontSize: 12,
    color: Constants.APP_GRAY_COLOR3,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    paddingTop: 10,
    flex: 1,
  },
  rowNn: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    paddingTop: 10,
    marginBottom: 15,
    flex: 1,
  },
  rowN: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    paddingTop: 20,
    flex: 1,
  },
  checkBoxWrap: {
    width: "50%",
    // marginRight: 38,
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    paddingTop: 10,
  },
  checkBoxWrap3: {
    width: "50%",
    // marginRight: 38,
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    // paddingTop: 10,
  },
  checkBoxWrap1: {
    width: "50%",
    // marginRight: 38,
    // flexDirection: "row",
    // alignItems: "center",
    // flexWrap: "wrap",
    // paddingTop: 10,
    // backgroundColor: "red",
  },
  checkBoxWrap2: {
    width: "48%",
    // marginRight: 38,
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    // paddingTop: 10,
  },
  checkboxImg: {
    height: 18,
    width: 18,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "rgb(68,200,86)",
    alignItems: "center",
    justifyContent: "center",
    // tintColor: "#44c856",
  },
  unCheckboxImg: {
    height: 18,
    width: 18,
    marginRight: 10,
    borderWidth: 1,
    borderColor: constants.APP_BLACK_COLOR,
  },
  checkboxImg1: {
    height: 18,
    width: 18,
    marginRight: 10,
    borderWidth: 1,
    borderColor: Constants.APP_GRAY_COLOR6,
    alignItems: "center",
    justifyContent: "center",
    // tintColor: "#44c856",
  },
  semiBoldText: {
    fontSize: 11,
    color: constants.APP_GRAY_COLOR,
    fontFamily: constants.Fonts.MEDIUM,
    textAlign: "left",
  },
  semiBoldText1: {
    fontSize: 11,
    color: "rgb(154,154,154)",
    fontFamily: constants.Fonts.MEDIUM,
  },
  semiBoldText2: {
    fontSize: 11,
    color: constants.APP_GRAY_COLOR,
    fontFamily: constants.Fonts.MEDIUM,
    marginLeft: 3,
    textAlign: "left",
    // backgroundColor: "green",
  },
  semiBoldText3: {
    fontSize: 15,
    color: Constants.APP_GRAY_COLOR6, 
    fontFamily: Constants.Fonts.LEXENDLIGHT,  
    marginLeft: 8,
    marginBottom: 10
  },
  dateInput: {
    flex: 1,
    fontSize: 12,
    fontFamily: Constants.Fonts.REGULAR,
    color: "rgb(120,120,120)",
    height: 42,
    borderRadius: 5,
    paddingLeft: 20,
    // backgroundColor: "rgb(249,249,249)",
    borderWidth: 1,
    borderColor: "rgb(112,112,112)",
    // width: "100%"
  },
  pickerButton: {
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    position: "absolute",
    // top: 26,
    right: 0,
  },
  cancelDoneButton: {
    paddingVertical: 10,
    paddingHorizontal: 5,
    color: Constants.APP_WHITE_COLOR,
    fontFamily: Constants.Fonts.BOLD,
  },
  scheduledDeliveryText: {
    fontFamily: Constants.Fonts.REGULAR,
    color: Constants.APP_GRAY_COLOR3,
    fontSize: 13,
    marginBottom: 10,
    marginHorizontal: 10,
    textAlign: "left",
  },
  sameDayDescription: {
    fontFamily: Constants.Fonts.LEXENDLIGHT,
    fontSize: 12,
    color: Constants.APP_GRAY_COLOR5,
    marginTop: 5,
  },
  dateAndTimeSlot: {
    fontFamily: Constants.Fonts.REGULAR,
    fontSize: 12,
    color: Constants.APP_THEME_DARK_GRAY,
    marginTop: 15,
    marginBottom: -5,
  },
});

export default styles;

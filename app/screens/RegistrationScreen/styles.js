/**
 * Created by Tinoy for iLeaf Solutions Pvt.Ltd
 * on February 19, 2020
 * RegistrationScreen - RegistrationScreen Styles
 */

import { StyleSheet, I18nManager } from "react-native";
import Constants from "../../config/constants";
import { normalizedHeight, normalizedWidth } from "../../config/common";

const styles = StyleSheet.create({
  container: {
    //height: Constants.SCREEN_HEIGHT - 30,
    // height: Constants.SCREEN_HEIGHT < 800 ? 700 : 800,
    backgroundColor: "rgb(255,255,255)",
  },
  safeContainer: {
    flex: 1,
  },
  container2: {
    paddingHorizontal: 43,
  },
  welcomText: {
    color: "rgb(40,40,40)",
    fontSize: 28,
    marginTop: 110,
    marginStart: 16,
    textAlign: "left",
    alignSelf: "flex-start",
    letterSpacing: 1.4,
    fontFamily: Constants.Fonts.MEDIUM,
  },
  pickerButton: {
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    width: "50%",
    position: "absolute",
    top: 26,
    right: 0,
  },
  text_input_style: {
    height: 40,
    fontSize: 16,
    color: "rgb(91,91,91)",
    borderBottomWidth: 1,
    borderBottomColor: "rgb(91,91,91)",
    fontFamily: Constants.Fonts.REGULAR,
    textDecorationLine: "none",
  },
  dateText: {
    fontFamily: Constants.Fonts.REGULAR,
    // fontSize: 12,
    color: Constants.APP_GRAY_COLOR3,
  },
  countryCodeContainer: {
    position: "absolute",
    top: 13,
    left: 0,
    width: normalizedWidth(85),
    height: 85,
    justifyContent: "center",
  },
  countryCodeText: {
    fontFamily: constants.Fonts.REGULAR,
    fontSize: 16,
    color: "transparent",
    marginBottom: 10,
  },
  logoStyle: {
    height: normalizedWidth(200),
    width: normalizedWidth(250),
    marginTop: normalizedWidth(46),
    marginBottom: normalizedWidth(5),
    alignSelf: "center",
  },
  heading: {
    fontFamily: Constants.Fonts.BOLD,
    fontSize: 22,
    color: Constants.APP_THEME_COLOR,
    textAlign: "left",
  },
  girlImage: {
    width: "86%",
    position: "absolute",
    right: "-16%",
  },
  blurCard: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  subText: {
    color: "rgb(142,142,142)",
    fontSize: 15,
    marginTop: 65,
    marginStart: 14,
    textAlign: "left",
    alignSelf: "flex-start",
    fontFamily: Constants.Fonts.REGULAR,
  },
  containerStyle: {
    marginTop: 8,
    flex: 1,
  },
  inpuLabelTextStyle: {
    fontFamily: Constants.Fonts.REGULAR,
    marginTop: 10,
    fontSize: 16,
    color: "rgb(193, 193, 193)",
  },
  forgotPassword: {
    marginTop: normalizedWidth(20),
    fontSize: 14,
    textAlign: "right",
    color: "rgb(40,40,40)",
    fontFamily: Constants.Fonts.REGULAR,
  },
  submitButtonStyle: {
    marginTop: 49,
    width: "100%",
    height: 47,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 24,
    backgroundColor: "rgb(255,157,10)",
  },
  addButtonStyle: {
    // marginTop: 39,
    // width: "100%",
    height: 26,
    width: 57,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 13,
    backgroundColor: "rgb(174,174,174)",
    position: "absolute",
    right: 0,
  },
  addText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: Constants.Fonts.REGULAR,
    // paddingHorizontal: 15,
    paddingVertical: 2,
  },
  submitText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontFamily: Constants.Fonts.MEDIUM,
  },
  footerContainer: {
    flexDirection: "row",
    marginVertical: normalizedHeight(49),
    alignSelf: "center",
  },
  signup: {
    marginStart: 6,
    marginTop: normalizedWidth(20),
    fontSize: 14,
    color: Constants.APP_THEME_COLOR2,
    fontFamily: Constants.Fonts.REGULAR,
  },
  forgotPwdinputs: {
    height: normalizedHeight(45),
    margin: 14,
    borderBottomColor: "#FFFFFF",
    flex: 1,
    color: "rgb(164, 164,164)",
    textAlign: I18nManager.isRTL ? "right" : "left",
    fontFamily: Constants.Fonts.LIGHT,
  },
  inputContainerFull: {
    borderWidth: 1,
    borderColor: "rgb(164, 164, 164)",
    borderRadius: 15,
    width: "91%",
    height: normalizedHeight(48),
    marginTop: 10,
    flexDirection: "row",
    alignSelf: "center",
    alignItems: "center",
  },
  messageErrorText: {
    marginTop: 5,
    fontSize: 12,
    color: "#c51414",
    textAlign: "left",
  },
  closeButtonView: {
    position: "absolute",
    top: 40,
    right: 20,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelDoneButton: {
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  boyOrGirlText: {
    fontFamily: Constants.Fonts.REGULAR,
    color: Constants.APP_GRAY_COLOR,
    fontSize: 15,
    left: 5,
    flex: 1,
    textAlign: "left",
  },
  dateLabel: {
    fontFamily: Constants.Fonts.REGULAR,
    color: Constants.APP_GRAY_COLOR,
    fontSize: 15,
    textAlign: "right",
    marginLeft: 10,
  },
  occasionLabel: {
    fontFamily: Constants.Fonts.REGULAR,
    color: Constants.APP_GRAY_COLOR,
    fontSize: 15,
    textAlign: "left",
    marginVertical: 10,
    flex: 1,
  },
  trashContainer: {
    backgroundColor: "rgba(217,217,217,0.15)",
    borderRadius: 3,
    height: 22,
    width: 22,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 0,
  },
  floatLabel : {
    fontSize:15
  }
});

export default styles;

/**
 * Created by Nithin for iLeaf Solutions Pvt.Ltd
 * on July 09, 2020
 * LoginScreen - LoginScreen Styles
 */

import { StyleSheet, I18nManager } from "react-native";
import Constants from "../../config/constants";
import { normalizedHeight, normalizedWidth } from "../../config/common";

const styles = StyleSheet.create({
  container: {
    //flex: 1,
    //height: Constants.SCREEN_HEIGHT,
    // height: Constants.SCREEN_HEIGHT < 800 ? 700 : 800,
    backgroundColor: "rgb(255,255,255)",
  },
  container2: {
    paddingHorizontal: 49,
  },
  logoStyle: {
    height: normalizedWidth(200),
    width: normalizedWidth(250),
    marginTop: normalizedWidth(46),
    marginBottom: normalizedWidth(5),
    alignSelf: "center",
  },
  girlImage: {
    width: "86%",
    position: "absolute",
    right: "-16%",
    top: "4%",
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
    textAlign: "center",
    fontFamily: Constants.Fonts.BOLD,
  },
  containerStyle: {
    marginTop: 8,
  },
  inpuLabelTextStyle: {
    fontFamily: Constants.Fonts.REGULAR,
    marginTop: 10,
    fontSize: 16,
    color: "rgb(193, 193, 193)",
  },
  inputContainerStyle: {
    borderWidth: 2,
    borderColor: "rgb(142,142,142)",
    marginHorizontal: 50,
    borderRadius: 24,
    height: 35,
  },
  forgotPassword: {
    marginTop: normalizedWidth(20),
    fontSize: 14,
    textAlign: "right",
    color: "rgb(40,40,40)",
    fontFamily: Constants.Fonts.REGULAR,
  },
  heading1: {
    fontFamily: Constants.Fonts.BOLD,
    fontSize: 22,
    // color: Constants.APP_THEME_COLOR,
    textAlign: "left",
    flex: 1,
  },
  heading2: {
    fontFamily: Constants.Fonts.BOLD,
    fontSize: 22,
    // color: Constants.APP_THEME_COLOR,
    textAlign: "right",
    flex: 1,
  },
  submitButtonStyle: {
    marginTop: 39,
    width: "100%",
    height: 47,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 24,
    backgroundColor: "rgb(255,157,10)",
  },
  googleButtonStyle: {
    height: 47,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 7,
    backgroundColor: "rgb(252,83,69)",
    flex: 1,
  },
  facebookButtonStyle: {
    height: 47,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 7,
    backgroundColor: "rgb(76,118,190)",
    flex: 1,
  },
  appleButtonStyle: {
    // width: normalizedWidth(150),
    height: 47,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 7,
    backgroundColor: "rgb(0,0,0)",
    flexDirection: "row",
  },
  submitText: {
    color: Constants.APP_WHITE_COLOR,
    fontSize: 18,
    paddingVertical: 14,
    fontFamily: Constants.Fonts.SEMIBOLD,
  },
  googleLoginText: {
    color: Constants.APP_WHITE_COLOR,
    fontSize: 13,
    paddingVertical: 14,
    fontFamily: Constants.Fonts.REGULAR,
    marginLeft: 30,
  },
  facebookLoginText: {
    color: Constants.APP_WHITE_COLOR,
    fontSize: 13,
    paddingVertical: 14,
    fontFamily: Constants.Fonts.REGULAR,
    marginLeft: 25,
  },
  appleLoginText: {
    color: Constants.APP_WHITE_COLOR,
    fontSize: 13,
    paddingVertical: 14,
    fontFamily: Constants.Fonts.REGULAR,
    marginLeft: 15,
  },
  footerContainer: {
    flexDirection: "row",
    // marginTop: 18,
    alignSelf: "center",
  },
  footerContainer2: {
    flexDirection: "row",
    marginTop: 34,
    alignSelf: "center",
  },
  signup: {
    marginStart: 6,
    marginTop: normalizedWidth(20),
    fontSize: 14,
    color: Constants.APP_THEME_COLOR2,
    fontFamily: Constants.Fonts.REGULAR,
  },
  orText: {
    fontSize: 18,
    fontFamily: Constants.Fonts.REGULAR,
    color: "rgb(91,91,91)",
    marginTop: normalizedWidth(7),
  },
  orContainer: {
    marginTop: 15,
    marginBottom: 15,
  },
  guestButton: {
    fontSize: 16,
    color: Constants.APP_THEME_COLOR2,
    fontFamily: Constants.Fonts.MEDIUM,
  },
  guestContainer: {
    // marginTop: 39,
    width: "100%",
    height: 47,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 44,
    borderWidth: 1,
    borderColor: Constants.APP_SEPARATOR_COLOR,
  },
  forgotPwdinputs: {
    height: 45, //normalizedHeight(45),
    margin: 5,
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
    // height: normalizedHeight(48),
    marginTop: 10,
    flexDirection: "row",
    alignSelf: "center",
    alignItems: "center",
  },

  safeContainer: {
    flex: 1,
  },
  title: {
    fontSize: 22,
    marginBottom: 34,
    marginStart: 32,
    fontWeight: "bold",
    color: "#1c385c",
  },

  errorText: {
    marginHorizontal: 24,
    height: normalizedHeight(20),
    fontSize: 12,
    marginTop: 4,
    textAlign: "left",
    color: "red",
  },
  closeButtonView: {
    position: "absolute",
    top: 50,
    right: 20,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  line: {
    width: "20%",
    borderBottomWidth: 1,
    borderBottomColor: Constants.APP_GRAY_COLOR,
    marginBottom: normalizedHeight(12),
  },
  passwordModalWrapper: {
    //flex: 1,
    width: Constants.SCREEN_WIDTH,
    height: Constants.SCREEN_HEIGHT,
    // paddingHorizontal: 5,
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
  },
  passwordCardWrapper: {
    backgroundColor: "rgb(255,255,255)",
    borderRadius: 15,
    width: "94%",
  },
  starText: {
    fontSize: 35,
    fontFamily: Constants.Fonts.BOLD,
    color: Constants.APP_THEME_COLOR2,
    position: "absolute",
    top: 210,
    left: 160,
  },
  iconLock: {
    height: 100,
    width: normalizedWidth(75),
    position: "absolute",
    left: 169,
    top: 109,
  },
  iconLockbg: {
    height: 122,
    width: normalizedWidth(148),
    position: "absolute",
    left: 133,
    top: 130,
  },
  changePassText: {
    // marginVertical: 11.5,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    fontFamily: Constants.Fonts.BOLD,
    fontSize: 20,
    position: "absolute",
    left: 128,
    bottom: 10,
  },
  forgotPwdTxt: {
    margin: 22,
    fontFamily: Constants.Fonts.MEDIUM,
    alignSelf: "center",
    color: "rgb(42,42,42)",
    fontSize: 17,
  },
  pwdSubmitWrapper: {
    flexDirection: "row",
    width: "91%",
    alignSelf: "center",
    justifyContent: "space-evenly",
    marginTop: 32,
    marginBottom: 26,
  },
  pwdCancelWrapper: {
    height: normalizedHeight(40),
    width: "45%",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 13,
    borderWidth: 1,
    borderColor: "rgb(112,112,112)",
  },
  pwdCancelTxt: {
    fontFamily: Constants.Fonts.MEDIUM,
    color: "rgb(42,42,42)",
  },
  pwdSubmitBtnWrapper: {
    height: normalizedHeight(40),
    width: "45%",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 13,
    backgroundColor: Constants.APP_THEME_COLOR,
  },
  pwdSubmitTxt: {
    fontFamily: Constants.Fonts.MEDIUM,
    color: "rgb(255,255,255)",
  },
  termsWrapper: {
    flexDirection: "row",
    marginTop: 36,
    alignItems: "center",
    marginStart: normalizedWidth(30),
  },
  termsTick: {
    width: 18,
    height: 18,
    alignSelf: "center",
  },
  termsText: {
    marginStart: 12,
    fontSize: 13,
    textAlign: "left",
    color: "rgb(120, 120, 120)",
    fontFamily: Constants.Fonts.REGULAR,
  },
  termsTextColored: {
    fontSize: 13,
    textAlign: "left",
    color: "rgb(100, 171, 235)",
    fontFamily: Constants.Fonts.REGULAR,
  },
  floatLabel : {
    fontSize:15
  }
});

export default styles;
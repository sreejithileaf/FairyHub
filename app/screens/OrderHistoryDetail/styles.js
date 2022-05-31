import { StyleSheet } from "react-native";
import AppStyles from "../../config/styles";
import Constants from "../../config/constants";
import { normalizedWidth, normalizedHeight } from "../../config/common";

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: Constants.APP_WHITE_COLOR,
  },
  scrollContainer: {
    // marginTop: 5,
  },
  itemImage: {
    width: 14,
    height: 14,
    // marginEnd: 18,
    alignSelf: "center",
  },
  underLineStyle: {
    borderBottomWidth: 1,
    borderBottomColor: Constants.APP_SEPARATOR_COLOR,
    // marginVertical: 5,
  },
  underLineStyle2: {
    borderBottomWidth: 1,
    borderBottomColor: Constants.APP_SEPARATOR_COLOR,
    marginTop: 18,
    marginBottom: 3,
    marginHorizontal: 18,
  },
  orderNumberText: {
    fontSize: 14,
    color: Constants.APP_BLACK_COLOR,
    fontFamily: Constants.Fonts.MEDIUM,
    textAlign: "left",
    width: 110,
  },
  deliveryStatusText: {
    fontSize: 14,
    fontFamily: Constants.Fonts.REGULAR,
    textAlign: "left",
    marginTop: 4,
  },
  normalText: {
    fontSize: 14,
    fontFamily: Constants.Fonts.REGULAR,
    color: Constants.APP_GRAY_COLOR3,
    textAlign: "left",
  },
  textBlue: {
    fontSize: 14,
    flex: 1,
    fontFamily: Constants.Fonts.MEDIUM,
    color: "rgb(92,115,207)",
    textAlign: "right",
  },
  normalTextBold: {
    fontSize: 14,
    fontFamily: Constants.Fonts.MEDIUM,
    color: "rgb(0,0,0)",
    textAlign: "left",
    marginBottom: 10,
  },
  largeTextBold: {
    fontSize: 16,
    // marginTop: 4,
    fontFamily: Constants.Fonts.MEDIUM,
    color: "rgb(0,0,0)",
    textAlign: "left",
  },
  wrapper: {
    flexDirection: "row",
    marginHorizontal: 18,
    marginTop: 12,
    justifyContent: "space-between",
  },
  wrapperColumn: {
    marginHorizontal: 20,
    // marginTop: 4,
  },
  addressText: {
    fontSize: 14,
    marginTop: 10,
    // marginBottom: 12,
    fontFamily: Constants.Fonts.REGULAR,
    color: Constants.APP_GRAY_COLOR3,
    textAlign: "left",
    // marginBottom: 20,
  },
  cardWrapper: {
    marginTop: 8,
    backgroundColor: Constants.APP_WHITE_COLOR,
  },
  titleStyle: {
    // marginTop: 20,
    textAlign: "left",
    marginLeft: 20,
    marginBottom: 10,
    fontSize: 18,
    color: Constants.APP_THEME_COLOR,
    fontFamily: Constants.Fonts.MEDIUM,
  },
  container: {
    paddingBottom: 16,
    paddingTop: 25,
    paddingHorizontal: 70,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: constants.APP_GRAY_COLOR,
    shadowOffset: {
      width: 0,
      height: -5,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 3,
    // backgroundColor: constants.APP_WHITE_COLOR,
  },
  button1: {
    justifyContent: "center",
    borderRadius: 10,
    borderColor: constants.APP_GRAY_COLOR4,
    backgroundColor: constants.APP_WHITE_COLOR,
    borderWidth: 0.5,
    width: normalizedWidth(180),
    height: 47,
  },
  buttonText1: {
    textAlign: "center",
    color: constants.APP_GRAY_COLOR,
    fontFamily: constants.Fonts.MEDIUM,
    fontSize: 15,
  },
  button2: {
    backgroundColor: constants.APP_THEME_COLOR,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    borderColor: constants.APP_THEME_COLOR,
    borderWidth: 1,
    width: "100%",
    // paddingHorizontal: 51,
    height: 47,
  },
  buttonText2: {
    textAlign: "center",
    color: constants.APP_WHITE_COLOR,
    fontFamily: constants.Fonts.MEDIUM,
    fontSize: 15,
  },
  deliveryNoteModalWrapper: {
    //flex: 1,
    width: Constants.SCREEN_WIDTH,
    height: Constants.SCREEN_HEIGHT,
    // paddingHorizontal: 5,
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
  },
  deliveryNoteCardWrapper: {
    backgroundColor: "rgb(255,255,255)",
    borderRadius: 15,
    width: "94%",
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
  deliveryNoteText: {
    margin: 22,
    fontFamily: Constants.Fonts.MEDIUM,
    alignSelf: "center",
    color: "rgb(42,42,42)",
    fontSize: 17,
  },
  paymentMethodButton: {
    // backgroundColor: "rgb(244,246,248)",
    height: 45,
    alignItems: "center",
    marginBottom: 5,
    flexDirection: "row",

    backgroundColor: "rgb(249,249,249)",
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
    alignItems: "center",
    justifyContent: "center",
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
    textAlign: "left",
    marginRight: 5,
  },
});

export default styles;

import { StyleSheet } from "react-native";
import Constants from "../../config/constants";
import { normalizedHeight, normalizedWidth } from "../../config/common";

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Constants.APP_WHITE_COLOR },
  underLineStyle: {
    height: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: Constants.APP_GRAY_COLOR4,
    shadowColor: constants.APP_GRAY_COLOR,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 3,
    // marginHorizontal: 20
    backgroundColor: "white",
  },
  underLineStyle1: {
    borderBottomWidth: 1,
    borderBottomColor: Constants.APP_GRAY_COLOR4,
  },
  underLineStyle2: {
    borderBottomWidth: 1,
    borderBottomColor: Constants.APP_GRAY_COLOR4,
    // marginHorizontal: 20,
    // marginBottom: 20,
  },
  underLineStyle3: {
    borderBottomWidth: 1,
    borderBottomColor: Constants.APP_GRAY_COLOR4,
    shadowColor: constants.APP_GRAY_COLOR,
    shadowOffset: {
      width: 0,
      height: -5,
    },
    shadowOpacity: 0.25,
    elevation: 3,
  },
  closeButtonView: {
    top: 10,
    right: 0,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  text_input_style_textarea: {
    height: 120,
    paddingLeft: 15,
    lineHeight: 25,
    textAlignVertical: "top",
    fontFamily: Constants.Fonts.REGULAR,
    fontSize: 14,
    color: constants.APP_GRAY_COLOR,
    borderWidth: 1,
    borderRadius: 7,
    borderColor: "rgb(154,154,154)",
  },
  wrapperContainer: {
    flexDirection: "row",
    marginVertical: 20,
    flexWrap: "wrap",
    alignItems: "flex-start",
  },
  balloonImg: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: constants.APP_SEPARATOR_COLOR,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: constants.APP_WHITE_COLOR,
    elevation: 5,
    overflow: "hidden",
  },
  balloonImg2: {
    height: 45,
    width: 45,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: constants.APP_SEPARATOR_COLOR,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  radioButtonContainer: {
    flexDirection: "row",
    marginTop: 25,
    marginBottom: 20,
  },
  radioImgSize: {
    height: 20,
    width: 20,
  },
  priceText: {
    fontFamily: constants.Fonts.REGULAR,
    fontSize: 14,
    textAlign: "left",
    color: constants.APP_BLACK_COLOR,
    // marginLeft: 20
  },
  noOfWraps: {
    fontFamily: constants.Fonts.REGULAR,
    fontSize: 16,
    textAlign: "left",
    color: constants.APP_GRAY_COLOR,
    paddingLeft: 15,
    // marginLeft: 20
  },
  priceText1: {
    fontFamily: constants.Fonts.REGULAR,
    fontSize: 14,
    textAlign: "left",
    color: constants.APP_GRAY_COLOR,
    lineHeight: 24,
    flex: 1,
    marginHorizontal: 15,
    // marginTop: 5,
    marginBottom: 10,
    // height: 50
  },
  priceText2: {
    fontFamily: constants.Fonts.BOLD,
    fontSize: 14,
    textAlign: "left",
    color: constants.APP_BLACK_COLOR,
    // lineHeight: 24,
    flex: 1,
    marginHorizontal: 15,
  },
  messageText2: {
    fontFamily: constants.Fonts.REGULAR,
    fontSize: 13,
    textAlign: "left",
    color: constants.APP_BLACK_COLOR,
    // lineHeight: 24,
    // flex: 1,
    // marginHorizontal: 15,
  },
  messageText3: {
    fontFamily: constants.Fonts.REGULAR,
    fontSize: 14,
    textAlign: "left",
    color: constants.APP_BLACK_COLOR,
    // lineHeight: 24,
    flex: 1,
    marginHorizontal: 15,
    marginBottom: 10,
  },
  increamentWrap: {
    flexDirection: "row",
    paddingTop: 30,
    paddingBottom: 35,
    position: "absolute",
    right: 15,
    alignItems: "center",
  },
  increamentWrap1: {
    flexDirection: "row",
    right: 0,
    top: 62,
    // alignItems: "center",
  },
  plusIcon: {
    height: 24,
    width: 24,
    resizeMode: "contain",
  },
  countNum: {
    // marginHorizontal: 8,
    height: 30,
    width: 30,
    textAlign: "center",
    paddingVertical: 0,
    fontSize: 13,
    fontFamily: constants.Fonts.BOLD,
    color: constants.APP_BLACK_COLOR,
    backgroundColor: "rgba(249,91,91,0.1)",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "rgb(203,203,203)",
  },
  buttonContainer: {
    height: 30,
    width: 60,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: constants.APP_SEPARATOR_COLOR,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    right: 0,
    bottom: -5,
    backgroundColor: Constants.APP_WHITE_COLOR,
  },
  selectedBalloonContainer: {
    marginHorizontal: 20,
    flexDirection: "row",
    marginVertical: 20,
    backgroundColor: Constants.APP_WHITE_COLOR,
    // alignItems: "center",
  },
  buttonText: {
    fontFamily: constants.Fonts.REGULAR,
    fontSize: 9,
    textAlign: "center",
    color: constants.APP_BLACK_COLOR,
    marginRight: 7,
  },
  cardText: {
    textAlign: "left",
    marginTop: 20,
    marginBottom: 16,
    color: "rgb(81,81,81)",
    fontFamily: constants.Fonts.MEDIUM,
    fontSize: 16,
    paddingLeft: 15,
    flex: 1,
  },
  submitButtonStyle: {
    marginVertical: 30,
    width: "100%",
    height: 47,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 24,
    backgroundColor: "rgb(255,157,10)",
  },
  submitText: {
    color: Constants.APP_WHITE_COLOR,
    fontSize: 18,
    paddingVertical: 14,
    fontFamily: Constants.Fonts.SEMIBOLD,
  },
  pickerContainer: {
    marginHorizontal: 20,
    borderWidth: 1,
    borderRadius: 7,
    borderColor: constants.APP_SEPARATOR_COLOR,
  },
  pickerStyle: {
    fontFamily: constants.Fonts.REGULAR,
    color: constants.APP_GRAY_COLOR,
    fontSize: 16,
    width: 120,
  },
  lettermax: {
    fontFamily: constants.Fonts.REGULAR,
    fontSize: 12,
    marginVertical: 10,
    color: "rgb(217,217,217)",
    textAlign: "right",
  },
  cardModalWrapper: {
    //flex: 1,
    width: Constants.SCREEN_WIDTH,
    height: Constants.SCREEN_HEIGHT,
    // paddingHorizontal: 5,
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
  },
  cardWrapper: {
    backgroundColor: "rgb(255,255,255)",
    borderRadius: 15,
    width: "94%",
  },
  footerContainer: {
    marginTop: 63,
    paddingBottom: 16,
    paddingTop: 20,
    paddingHorizontal: 18,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
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
    elevation: 1,
    backgroundColor: constants.IS_ANDROID
      ? constants.APP_TRANSPARENT_COLOR
      : constants.APP_WHITE_COLOR,
  },
  button1: {
    justifyContent: "center",
    borderRadius: 15,
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
    borderRadius: 15,
    borderColor: constants.APP_THEME_COLOR,
    borderWidth: 1,
    width: normalizedWidth(180),
    height: 47,
  },
  buttonText2: {
    textAlign: "center",
    color: constants.APP_WHITE_COLOR,
    fontFamily: constants.Fonts.MEDIUM,
    fontSize: 15,
  },
  remainingItem: {
    fontSize: 15,
    position: "absolute",
    right: 10,
    fontFamily: constants.Fonts.REGULAR,
    color: constants.APP_GRAY_COLOR,
  },
  totalCostContainer: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginVertical: 15,
    marginTop: 20,
  },
  totalCostText: {
    fontFamily: constants.Fonts.BOLD,
    fontSize: 16,
    marginRight: 5,
  },
  totalPriceText: {
    fontFamily: constants.Fonts.BOLD,
    fontSize: 16,
    paddingHorizontal: 5,
    position: "absolute",
    right: 0,
  },
  noOfProductsContainer: {
    flexDirection: "row",
    paddingTop: 30,
    paddingBottom: 35,
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
  decrementContainer: {
    borderWidth: 1,
    borderColor: "rgb(203,203,203)",
    borderRightWidth: 0,
    borderTopLeftRadius: 3.5,
    borderBottomLeftRadius: 3.5,
    height: 30,
    width: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  decrementText: {
    fontFamily: Constants.Fonts.BOLD,
    fontSize: 10,
    paddingHorizontal: 10,
    transform: [{ rotate: "90deg" }],
    color: "rgba(0,0,0,0.4)",
  },
  incrementContainer: {
    borderWidth: 1,
    borderColor: "rgb(203,203,203)",
    borderLeftWidth: 0,
    borderTopRightRadius: 3.5,
    borderBottomRightRadius: 3.5,
    height: 30,
    width: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  incrementText: {
    fontFamily: Constants.Fonts.BOLD,
    fontSize: 20,
    paddingHorizontal: 10,
    transform: [{ rotate: "90deg" }],
    color: "rgba(0,0,0,0.4)",
  },
  overlay: {
    backgroundColor: "rgba(255,255,255, 0.7)",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    elevation: 3,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  outOfStockContainer: {
    width: "90%",
    height: 35,
    backgroundColor: "rgba(249,249,249,1)",
    alignItems: "center",
    justifyContent: "center",
  },
  outOfStockText: {
    color: "rgb(181,24,24)",
    fontSize: 16,
    fontFamily: Constants.Fonts.MEDIUM,
    textAlign: "center",
    textAlignVertical: "center",
    alignSelf: "center",
    backgroundColor: "rgba(249,249,249,1)",
    // width: "100%",
    // marginHorizontal: 10,
  },
  sectionTitle: {
    marginLeft: 10,
    // marginTop: 11,
    // marginBottom: 5,
    textAlign: "left",
    fontFamily: Constants.Fonts.BOLD,
    fontSize: 16,
    color: Constants.APP_BLACK_COLOR,
  },
});

export default styles;

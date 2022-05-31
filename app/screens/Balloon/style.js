import { StyleSheet } from "react-native";
import Constants from "../../config/constants";
import { normalizedHeight, normalizedWidth } from "../../config/common";

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Constants.APP_WHITE_COLOR },
  underLineStyle: {
    borderBottomWidth: 1,
    borderBottomColor: Constants.APP_GRAY_COLOR4,
    // marginHorizontal: 20
    // marginVertical: 5,
    height: 10,
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
  underLineStyle2: {
    borderBottomWidth: 1,
    borderBottomColor: Constants.APP_GRAY_COLOR4,
    // marginBottom: 20,
  },
  text_input_style_textarea: {
    height: 120,
    paddingLeft: 15,
    lineHeight: 25,
    textAlignVertical: "top",
    fontFamily: Constants.Fonts.REGULAR,
    fontSize: 14,
    color: "rgb(217,217,217)",
    borderWidth: 1,
    borderRadius: 7,
    borderColor: constants.APP_SEPARATOR_COLOR,
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
    // flexDirection: "row",
    marginTop: 15,
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
  priceText2: {
    fontFamily: constants.Fonts.REGULAR,
    fontSize: 14,
    textAlign: "left",
    color: constants.APP_GRAY_COLOR,
    // lineHeight: 24,
    flex: 1,
    marginHorizontal: 10,
    marginVertical: 5,
  },
  increamentWrap: {
    flexDirection: "row",
    alignItems: "center",
  },
  plusIcon: {
    height: 24,
    width: 24,
    resizeMode: "contain",
  },
  countNum: {
    marginHorizontal: 8,
    width: 30,
    textAlign: "center",
    paddingVertical: 0,
    fontSize: 13,
    fontFamily: constants.Fonts.BOLD,
    color: constants.APP_BLACK_COLOR,
  },
  buttonContainer: {
    height: 30,
    width: 70,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: constants.APP_SEPARATOR_COLOR,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Constants.APP_WHITE_COLOR,
  },
  selectedBalloonContainer: {
    marginHorizontal: 20,
    flexDirection: "row",
    marginVertical: 20,
    alignItems: "center",
  },
  buttonText: {
    fontFamily: constants.Fonts.REGULAR,
    fontSize: 9,
    textAlign: "center",
    color: constants.APP_BLACK_COLOR,
    marginRight: 7,
  },
  cardText: {
    textAlign: "center",
    marginTop: 50,
    marginBottom: 16,
    color: "rgb(81,81,81)",
    fontFamily: constants.Fonts.MEDIUM,
    fontSize: 16,
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
  inflated: {
    flex: 1,
    fontSize: 14,
    color: "rgb(112,112,112)",
    fontFamily: constants.Fonts.REGULAR,
    textAlign: "left",
  },
  priceView: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
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
  closeContainer: {
    height: 50,
    alignItems: "center",
    flexDirection: "row",
    borderBottomColor: Constants.APP_SEPARATOR_COLOR,
    borderBottomWidth: 1,
  },
  closeButton: {
    width: 15,
    height: 15,
    tintColor: "rgb(0,0,0)",
    marginRight: 10,
  },
  selectText: {
    fontSize: 14,
    color: Constants.APP_BLACK_COLOR,
    fontFamily: Constants.Fonts.REGULAR,
    flex: 1,
    marginHorizontal: 10,
    textAlign: "left",
  },
  optionContainer: {
    marginHorizontal: 20,
    marginTop: 20,
  },
  inflatedButton: {
    height: 40,
    alignItems: "center",
    flexDirection: "row",
  },
  checkBoxIcon: {
    height: 18,
    width: 18,
    resizeMode: "contain",
    marginRight: 13,
    tintColor: "rgba(110,110,110,0.5)",
  },
  checkBoxIconSelected: {
    height: 18,
    width: 18,
    tintColor: Constants.APP_THEME_COLOR,
    resizeMode: "contain",
    marginRight: 13,
    tintColor: constants.APP_THEME_COLOR,
  },
  popUpAddButton: {
    marginVertical: 30,
    width: "70%",
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 24,
    backgroundColor: "rgb(255,157,10)",
    alignSelf: "center",
  },
  popUpSubmitText: {
    color: Constants.APP_WHITE_COLOR,
    fontSize: 15,
    fontFamily: Constants.Fonts.BOLD,
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
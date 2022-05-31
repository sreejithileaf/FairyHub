import { StyleSheet } from "react-native";
import Constants from "../../config/constants";
import { normalizedHeight, normalizedWidth } from "../../config/common";

const Styles = StyleSheet.create({
  text_input_style: {
    height: 40,
    fontSize: 16,
    color: "rgb(91,91,91)",
    borderBottomWidth: 1,
    borderBottomColor: "#bcbcbc",
    fontFamily: Constants.Fonts.REGULAR,
    textDecorationLine: "none",
  },
  text_input_style2: {
    height: 4,
    fontSize: 16,
    color: "rgb(91,91,91)",
    borderBottomWidth: 1,
    borderBottomColor: "#bcbcbc",
    fontFamily: Constants.Fonts.REGULAR,
    textDecorationLine: "none",
  },
  text_input_style_country: {
    backgroundColor: "#f4f6f8",
    height: 45,
    paddingLeft: 2,
    borderRadius: 5,
    paddingTop: 12,
  },
  text_input_style_error: {
    height: 40,
    fontSize: 16,
    color: "rgb(91,91,91)",
    borderBottomWidth: 1,
    borderBottomColor: "red",
    fontFamily: Constants.Fonts.REGULAR,
    textDecorationLine: "none",
  },
  text_input_style_error2: {
    height: 4,
    fontSize: 16,
    color: "rgb(91,91,91)",
    borderBottomWidth: 1,
    borderBottomColor: "red",
    fontFamily: Constants.Fonts.REGULAR,
    textDecorationLine: "none",
  },
  text_input_style_textarea: {
    backgroundColor: "#f4f6f8",
    height: 120,
    paddingLeft: 10,
    borderRadius: 2,
    lineHeight: 25,
    textAlignVertical: "top",
    fontFamily: Constants.Fonts.REGULAR,
    fontSize: 15,
    color: Constants.APP_BLACK_COLOR,
  },
  text_input_style_textarea_error: {
    backgroundColor: "#f4f6f8",
    height: 120,
    paddingLeft: 2,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: "red",
    fontFamily: Constants.Fonts.REGULAR,
    fontSize: 15,
    color: Constants.APP_BLACK_COLOR,
  },
  addAddressBtn: {
    flex: 1,
    justifyContent: "flex-end",
    marginTop: 20,
    marginBottom: 20,
    marginHorizontal: 60,
  },
  countryCode: {
    position: "absolute",
    top: 13,
    left: 50,
    width: 290,
    height: 45,
    justifyContent: "center",
  },
  callingCodeText: {
    fontFamily: constants.Fonts.REGULAR,
    fontSize: 16,
    color: constants.APP_THEME_COLOR,
    marginTop: 12,
  },
  callingCodeContainer: {
    paddingHorizontal: 40,
    paddingBottom: 25,
    flexDirection: "row",
  },
  btn_touchable_style: {
    width: "80%",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: Constants.APP_THEME_COLOR,
    borderRadius: normalizedHeight(54 / 2),
    height: normalizedHeight(54),
  },
  textTile: {
    fontFamily: Constants.Fonts.REGULAR,
    fontSize: 16,
    color: Constants.APP_BLACK_COLOR,
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
  holderView: {
    // flexDirection: "row",
    marginHorizontal: 10,
    marginVertical: 12,
  },
  iconContainer: {
    width: 25,
    height: 45,
    alignItems: "center",
    justifyContent: "center",
  },
  lettermax: {
    fontFamily: constants.Fonts.REGULAR,
    fontSize: 12,
    marginVertical: 10,
    color: "rgb(143,143,143)",
    textAlign: "right",
  },
  useDifferentAddress: {
    flexDirection: "row",
  },
  unCheckboxImg: {
    height: 18,
    width: 18,
    marginRight: 10,
    borderWidth: 1,
    borderColor: constants.APP_BLACK_COLOR,
  },
  checkboxImg: {
    height: 18,
    width: 18,
    marginRight: 10,
    borderWidth: 1,
    borderColor: constants.APP_THEME_COLOR,
    alignItems: "center",
    justifyContent: "center",
    // tintColor: "#44c856",
  },
  differentAddress: {
    fontFamily: Constants.Fonts.REGULAR,
    fontSize: 14,
    color: Constants.APP_BLACK_COLOR,
  },
  cityItemContainer: {
    alignItems: "center",
    borderBottomColor: Constants.APP_SEPARATOR_COLOR,
    borderBottomWidth: 1,
    flexDirection: "row",
  },
  cityName: {
    textAlign: "left",
    marginHorizontal: 15,
    color: Constants.APP_THEME_DARK_GRAY,
    fontSize: 14,
    marginVertical: 15,
    flex: 1,
  },
  tick: {
    width: 15,
    height: 15,
    marginRight: 15,
  },
});

export default Styles;

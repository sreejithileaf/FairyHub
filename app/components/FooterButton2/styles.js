import constants from "../../config/constants";
import { StyleSheet, Platform } from "react-native";
import { normalizedWidth, normalizedHeight } from "../../config/common";

const styles = StyleSheet.create({
  container: {
    paddingBottom: 16,
    paddingTop: 20,
    paddingHorizontal: 18,
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
    backgroundColor: constants.IS_ANDROID
      ? constants.APP_TRANSPARENT_COLOR
      : constants.APP_WHITE_COLOR,
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
    borderRadius: 10,
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
});
export default styles;

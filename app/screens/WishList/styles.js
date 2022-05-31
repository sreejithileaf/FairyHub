/**
 * Created by Jebin for iLeaf Solutions Pvt.Ltd
 * on February 19, 2020
 * WishList styles -
 */

import { StyleSheet } from "react-native";
import AppStyles from "../../config/styles";
import Constants from "../../config/constants";
import { normalizedHeight, normalizedWidth } from "../../config/common";

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: Constants.APP_WHITE_COLOR,
  },
  container: {
    backgroundColor: AppStyles.color.COLOR_WHITE,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonLogin: {
    borderRadius: 14,
    width: "65%",
    backgroundColor: Constants.APP_THEME_COLOR,
    height: normalizedHeight(44),
    marginVertical: normalizedHeight(20),
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
  },
  socialName: {
    fontSize: 15,
    color: Constants.APP_WHITE_COLOR,
    fontFamily: Constants.Fonts.MEDIUM,
  },
  loginContentText: {
    alignSelf: "center",
    fontSize: 14,
    color: "rgb(164,164,164)",
    fontFamily: Constants.Fonts.REGULAR,
  },
  bottomContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    marginBottom: 24,
    alignSelf: "center",
  },
  titleStyle: {
    textAlign: "left",
    marginTop: 20,
    marginLeft: 20,
    fontSize: 18,
    color: Constants.APP_THEME_COLOR,
    fontFamily: Constants.Fonts.MEDIUM,
  },
  dummyView: {
    width: 100,
    height: 0,
    backgroundColor: Constants.APP_TRANSPARENT_COLOR,
  },
  floatingAction: {
    alignItems: "center",
    justifyContent: "center",
    width: 48,
    position: "absolute",
    bottom: 60,
    right: 20,
    height: 48,
    backgroundColor: Constants.APP_WHITE_COLOR,
    borderRadius: 100,

    shadowColor: "rgba(110,110,110,0.7)",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.5,
    shadowRadius: 4.65,

    elevation: 5,
  },
});

export default styles;

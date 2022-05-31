/**
 * Created by Shijesh for iLeaf Solutions Pvt.Ltd
 * on September 9, 2020
 * Product review styles -
 */

import { StyleSheet } from "react-native";
import AppStyles from "../../config/styles";
import Constants from "../../config/constants";
import { normalizedHeight, normalizedWidth } from "../../config/common";

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: AppStyles.color.COLOR_WHITE,
  },
  container: {
    backgroundColor: AppStyles.color.COLOR_WHITE,
    flex: 1,
    // justifyContent: "center",
    // alignItems: "center",
  },
  subContainer: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginVertical: 10,
  },
  review: {
    fontSize: 13,
    color: Constants.APP_GRAY_COLOR,
    fontFamily: Constants.Fonts.REGULAR,
    flex: 1,
    height: 35,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: Constants.APP_SEPARATOR_COLOR,
    paddingLeft: 10,
  },
  reviewSubmitButton: {
    width: 72,
    height: 35,
    borderRadius: 5,
    backgroundColor: Constants.APP_THEME_COLOR,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },
  flatListContainer: {
    marginHorizontal: 20,
    marginVertical: 10,
  },
  usernameText: {
    fontSize: 12,
    color: Constants.APP_BLACK_COLOR,
    fontFamily: Constants.Fonts.REGULAR,
  },
  reviewTimeText: {
    fontSize: 12,
    color: Constants.APP_GREY_TEXT_COLOR,
    fontFamily: Constants.Fonts.REGULAR,
  },
  reviewDescText: {
    fontSize: 12,
    color: Constants.APP_BLACK_COLOR,
    fontFamily: Constants.Fonts.REGULAR,
    marginHorizontal: 15,
    marginVertical: 10,
  },
  flatSubContainer: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Constants.APP_GRAY_COLOR4,
    marginTop: 5,
  },
  nameTimeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 15,
    marginVertical: 5,
  },
  reviewDescription: {
    fontSize: 12,
    color: Constants.APP_GRAY_COLOR,
    fontFamily: Constants.Fonts.REGULAR,
    lineHeight: 20,
    textAlign: "center",
  },
  postText: {
    fontSize: 12,
    color: Constants.APP_WHITE_COLOR,
    fontFamily: Constants.Fonts.REGULAR,
  },
});

export default styles;

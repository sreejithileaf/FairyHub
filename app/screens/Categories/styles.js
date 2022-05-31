/**
 * Created by Nithin for iLeaf Solutions Pvt.Ltd
 * on July 14, 2020
 * Categories styles -
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
  main_container: {
    flex: 1,
    flexDirection: "row",
    // paddingBottom: normalizedHeight(16),
    paddingRight: normalizedHeight(10),
    backgroundColor: "rgba(255,255,255,0.9)",
  },
  category_container: {
    // width: "32.5%",
    paddingLeft: normalizedHeight(25),
    backgroundColor: "rgb(245,245,245)",
  },
  category_img_container: {
    overflow: "hidden",
    width: normalizedWidth(82),
    height: normalizedWidth(82),
    borderRadius: 5,
    // borderWidth: 1,
  },
  category_item_selected: {
    width: normalizedWidth(29),
    height: normalizedWidth(82),
    backgroundColor: Constants.APP_WHITE_COLOR,
    marginTop: 25,
  },
  category_item_not_selected: {
    width: normalizedWidth(27),
    height: normalizedWidth(82),
    marginTop: 25,
  },
  categorySelectedTitle: {
    fontSize: 14,
    fontFamily: Constants.Fonts.BOLD,
    textTransform: "uppercase",
    color: Constants.APP_THEME_COLOR,
  },
  categoryTitle: {
    fontSize: 14,
    textTransform: "uppercase",
    fontFamily: Constants.Fonts.REGULAR,
  },
  subcategory_container: {
    flex: 1,
    width: "65%",
    paddingRight: 7,
    paddingLeft: normalizedWidth(39),
    marginTop: normalizedWidth(60),
    // marginBottom: normalizedWidth(30),
    backgroundColor: Constants.APP_WHITE_COLOR,
  },
  categoryTitleText: {
    position: "absolute",
    paddingLeft: normalizedWidth(39),
    fontFamily: Constants.Fonts.MEDIUM,
    fontSize: 18,
    color: Constants.APP_THEME_COLOR2,
  },
  subcategoryItemContainer: {
    backgroundColor: Constants.APP_WHITE_COLOR,
    alignItems: "center",
    flexDirection: "row",
  },
  subcategoryItemText: {
    textAlign: "left",
    fontSize: 16,
    fontFamily: Constants.Fonts.REGULAR,
    color: "rgb(109,109,109)",
    marginLeft: 5,
    flex: 1,
  },
  line: {
    height: 1.5,
    marginTop: normalizedWidth(10),
    // width: "97%",
    marginRight: 5,
    backgroundColor: Constants.APP_SEPARATOR_COLOR,
  },
  line2: {
    height: 1,
    marginTop: normalizedWidth(5),
    // width: "97%",
    marginRight: 5,
    backgroundColor: Constants.APP_SEPARATOR_COLOR,
  },
  subcategorymainItemContainer: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  subcategoryText: {
    fontFamily: Constants.Fonts.REGULAR,
    fontSize: 14,
    color: "rgb(174,174,174)",
    textAlign: "left",
    marginLeft: 5,
    flex: 1,
  },
  arrowSideImg: {
    width: 11.5,
    height: 11.5,
  },
  titleStyle: {
    textAlign: "left",
    marginTop: 20,
    marginLeft: 20,
    fontSize: 18,
    color: Constants.APP_THEME_COLOR,
    fontFamily: Constants.Fonts.MEDIUM,
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

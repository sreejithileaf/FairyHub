/**
 * Created by Nithin for iLeaf Solutions Pvt.Ltd
 * on July 14, 2020
 * HomeScreen - HomeScreen Styles
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
    backgroundColor: "rgb(248,248,248)",
    flex: 1,
  },
  closeButtonView: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderRadius: 15,
  },
  sectionTitle: {
    marginLeft: 10,
    // marginTop: 11,
    // marginBottom: 5,
    textAlign: "left",
    fontFamily: Constants.Fonts.BOLD,
    fontSize: 18,
    color: Constants.APP_BLACK_COLOR,
  },
  pagerContainer: {
    position: "absolute",
    bottom: 10,
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  pagerItem: {
    width: 7,
    height: 7,
    backgroundColor: "rgba(255,255,255,0.3)",
    margin: 2,
    borderRadius: 3.5,
    borderWidth: 1,
    borderColor: Constants.APP_GRAY_COLOR,
  },
  categoryListContainer: {
    // height: normalizedHeight(162),
    width: "100%",
    paddingTop: 10,
    backgroundColor: Constants.APP_WHITE_COLOR,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    borderWidth: 1,
    borderColor: Constants.APP_SEPARATOR_COLOR,
    borderTopColor: Constants.APP_TRANSPARENT_COLOR,
    shadowColor: "rgba(110,110,110,0.2)",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.5,
    shadowRadius: 4.65,
    elevation: 9,
  },
  paginationContainer: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "center",
  },
  paginationImage: {
    width: 10,
    height: 10,
    marginHorizontal: 5,
  },
  categoryTitle: {
    marginVertical: 5,
    fontFamily: Constants.Fonts.MEDIUM,
    fontSize: 13,
    color: Constants.APP_GRAY_COLOR3,
    marginHorizontal: 10,
    textAlign: "center",
    // width: 150
  },
  itemTitle: {
    fontSize: 12,
    fontFamily: Constants.Fonts.REGULAR,
    color: Constants.APP_GRAY_COLOR3,
    marginTop: 10,
    textAlign: "left",
  },
  itemTitle2: {
    fontSize: 14,
    fontFamily: Constants.Fonts.REGULAR,
    color: Constants.APP_GRAY_COLOR3,
    marginTop: 10,
    textAlign: "left",
  },
  itemCost: {
    fontSize: 12,
    fontFamily: Constants.Fonts.REGULAR,
    color: Constants.APP_THEME_COLOR2,
    marginTop: 5,
    textAlign: "left",
  },
  separatorView: {
    height: 1,
    marginBottom: 10,
    backgroundColor: Constants.APP_SEPARATOR_COLOR,
  },
  wishListContainer: {
    width: normalizedWidth(26),
    height: normalizedWidth(26),
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: Constants.APP_WHITE_COLOR,
    borderRadius: normalizedWidth(26) / 2,
    alignItems: "center",
    justifyContent: "center",
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
  viewAll: {
    fontSize: 14,
    fontFamily: Constants.Fonts.MEDIUM,
    color: Constants.APP_WHITE_COLOR,
  },
  topCategoryStles: {
    backgroundColor: "white",
    paddingTop: 10,
  },
});

export default styles;

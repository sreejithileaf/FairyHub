/**
 * Created by Jebin for iLeaf Solutions Pvt.Ltd
 * on February 18, 2020
 * Search style -
 */

import { StyleSheet } from "react-native";
import AppStyles from "../../config/styles";
import Constants from "../../config/constants";

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: AppStyles.color.COLOR_WHITE,
  },
  container: {
    backgroundColor: AppStyles.color.COLOR_WHITE,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  searchContainer: {
    height: 44,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Constants.APP_WHITE_COLOR,
  },
  titleText: {
    fontSize: 15,
    fontFamily: Constants.Fonts.REGULAR,
    flex: 1,
    textAlign: "left",
    marginLeft: 30,
    color: Constants.APP_GRAY_COLOR3,
  },
  separatorView: {
    // height: 10,
    marginTop: 20,
    backgroundColor: Constants.APP_GRAY_COLOR2,
  },
  searchButton: {
    width: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  searchHeadingContainer: {
    flex: 1,
    backgroundColor: "rgb(243,243,243)",
    height: 40,
    marginBottom: 10,
  },
  searchHeadingText: {
    fontFamily: Constants.Fonts.REGULAR,
    marginLeft: 20,
    marginTop: 10,
    color: Constants.APP_GRAY_COLOR,
    fontSize: 14,
    textAlign: "left",
  },
  searchHistoryText: {
    fontFamily: Constants.Fonts.REGULAR,
    fontSize: 14,
    color: Constants.APP_GRAY_COLOR3,
    textAlign: "left",
    marginLeft: 18,
    flex: 1,
  },
  recentSearchTitle: {
    fontFamily: Constants.Fonts.MEDIUM,
    fontSize: 15,
    color: Constants.APP_BLACK_COLOR,
    textAlign: "left",
    flex: 1,
  },
  clearButonText: {
    fontFamily: Constants.Fonts.LIGHT,
    fontSize: 15,
    color: Constants.APP_GRAY_COLOR,
  },
  searchHistoryTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 50,
    marginHorizontal: 20,
  },
  searchMainContainer: {
    flexDirection: "row",
    backgroundColor: "rgb(243,243,243)",
    marginHorizontal: 15,
    flex: 1,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "rgba(112,112,112,0.13)",
  },
});

export default styles;

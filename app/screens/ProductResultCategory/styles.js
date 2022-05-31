/**
 * Created by Jebin for iLeaf Solutions Pvt.Ltd
 * on February 25, 2020
 * ProductListStyles - Product list Styles
 */
import { StyleSheet } from "react-native";
import AppStyles from "../../config/styles";
import Constants from "../../config/constants";

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: Constants.APP_WHITE_COLOR,
  },
  container: {
    justifyContent: "space-around",
    alignItems: "center",
    flex: 1,
    backgroundColor: "#00a1f1",
  },
  containerGridLeft: {
    justifyContent: "space-around",
    alignItems: "center",
    flex: 1,
    backgroundColor: "#ffbbff",
  },
  containerGridRight: {
    justifyContent: "space-around",
    alignItems: "center",
    flex: 1,
    backgroundColor: "#7cbb7c",
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
  superTitleContainer: {
    height: 50,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    // justifyContent: "space-around",
    borderBottomWidth: 1,
    borderBottomColor: Constants.APP_SEPARATOR_COLOR,
  },
  topTitle: {
    fontFamily: Constants.Fonts.BOLD,
    fontSize: 14,
    color: Constants.APP_BLACK_COLOR,
    paddingHorizontal: 20,
  },
  topTitle1: {
    fontFamily: Constants.Fonts.BOLD,
    fontSize: 16,
    color: Constants.APP_BLACK_COLOR,
    // justifyContent: "center",
    // alignItems:"center",
    // alignContent:"center"
    // paddingHorizontal: 20,
  },
  genderContainer: {
    // borderBottomColor: "rgb(249,65,206)",
    // backgroundColor: "red",
  },
  genderCategoryUnderLine: {
    backgroundColor: "rgb(249,65,206)",
    marginTop: 5,
    borderRadius: 1.5,
    marginHorizontal: 20,
  },

  filterContainer: {
    position: "absolute",
    bottom: 45,
    // right: 15,
    left: 15,
    width: 100,
    height: 35,
    backgroundColor: Constants.APP_WHITE_COLOR,
    borderRadius: 17.5,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    elevation: 10,
    paddingHorizontal: 10,
    shadowColor: Constants.APP_DARK_BLACK_COLOR,
    shadowOpacity: 0.35,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 3,
    },
  },
  filterContainer2: {
    width: 90,
    height: 35,
    backgroundColor: Constants.APP_WHITE_COLOR,
    borderRadius: 17.5,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    elevation: 10,
    paddingHorizontal: 10,
    shadowColor: Constants.APP_DARK_BLACK_COLOR,
    shadowOpacity: 0.35,
    shadowRadius: 5,
    marginRight: 10,
    shadowOffset: {
      width: 0,
      height: 3,
    },
  },
  filterText: {
    fontFamily: Constants.Fonts.REGULAR,
    fontSize: 12,
    color: Constants.APP_BLACK_COLOR,
    marginHorizontal: 10,
  },
  genderContainer: {
    height: 42,
    width: 103,
    marginLeft: 20,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  genderRangeText: {
    fontFamily: Constants.Fonts.BOLD,
    fontSize: 14,
    marginLeft: 10,
  },
  genderIcon: { height: 35, width: 35 },
  genderImageContainer: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    backgroundColor: Constants.APP_WHITE_COLOR,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  genderCell: { flexDirection: "row", alignItems: "center" },
  clearButton: {
    width: 70,
    height: 27,
    borderRadius: 13.5,
    borderWidth: 1,
    borderColor: "rgb(174,174,174)",
    backgroundColor: Constants.APP_WHITE_COLOR,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },
  clearButton2: {
    // width: 50,
    // height: 27,
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "rgb(174,174,174)",
    backgroundColor: Constants.APP_WHITE_COLOR,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  clearButtonText: {
    fontFamily: Constants.Fonts.REGULAR,
    fontSize: 12,
    color: "rgb(174,174,174)",
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

import { StyleSheet } from "react-native";
import AppStyles from "../../config/styles";
import Constants from "../../config/constants";
import { normalizedHeight, normalizedWidth } from "../../config/common";

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: Constants.APP_WHITE_COLOR,
  },
  scrollContainer: {
    marginTop: 5,
  },
  itemImage: {
    width: 14,
    height: 14,
    // marginEnd: 18,
    alignSelf: "center",
  },
  underLineStyle: {
    borderBottomWidth: 1,
    borderBottomColor: Constants.APP_SEPARATOR_COLOR,
  },
  orderNumberText: {
    fontSize: 14,
    color: Constants.APP_BLACK_COLOR,
    fontFamily: Constants.Fonts.BOLD,
    textAlign: "left",
    // width: 110,
  },
  deliveryStatusText: {
    fontSize: 12,
    fontFamily: Constants.Fonts.REGULAR,
    textAlign: "left",
  },
  line: {
    height: 1,
    // width: "100%",
    backgroundColor: Constants.APP_SEPARATOR_COLOR,
    marginTop: normalizedHeight(21.5),
    // marginBottom: normalizedHeight(17.5),
  },
  line2: {
    height: 1,
    // width: "100%",
    backgroundColor: Constants.APP_SEPARATOR_COLOR,
    marginTop: normalizedHeight(17.5),
    // marginBottom: normalizedHeight(17.5),
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
  order_detailContainer: {
    marginTop: 3,
    // backgroundColor: Constants.APP_WHITE_COLOR,
    marginBottom: 10,
  },
  order_noContainer: {
    marginHorizontal: 20,
    // marginTop: 10
  },
  dateContainer: {
    flexDirection: "row",
    marginTop: 4,
    marginBottom: 5,
  },
  contactContentText: {
    fontFamily: constants.Fonts.REGULAR,
    fontSize: 16,
    color: "rgb(109,109,109)",
    paddingHorizontal: 5,
    marginTop: 13,
    textAlign: "left",
  },
  headingContainers: {
    backgroundColor: "rgb(246,246,246)",
    marginTop: 10,
  },
  headingContainers1: {
    backgroundColor: "rgb(246,246,246)",
    marginTop: 30,
  },
  headingContainers2: {
    backgroundColor: "rgb(246,246,246)",
    marginTop: 15,
  },
  mainheading: {
    fontFamily: constants.Fonts.MEDIUM,
    fontSize: 18,
    color: "rgb(81,81,81)",
    paddingHorizontal: 20,
    marginVertical: 10,
    textAlign: "left",
  },
  addressheading: {
    fontFamily: constants.Fonts.REGULAR,
    fontSize: 12,
    color: constants.APP_GRAY_COLOR,
    paddingHorizontal: 20,
    marginVertical: 20,
    textAlign: "left",
  },
  addressText: {
    color: constants.APP_THEME_COLOR,
    fontFamily: constants.Fonts.REGULAR,
    fontSize: 12,
    marginRight: 5,
    marginTop: 12,
    textAlign: "left",
  },
  defaultAddressheading: {
    fontFamily: constants.Fonts.REGULAR,
    fontSize: 12,
    color: constants.APP_THEME_COLOR,
    paddingRight: 5,
    marginVertical: 20,
    textAlign: "left",
  },
  contactContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  underline: {
    borderBottomWidth: 1,
    marginHorizontal: 20,
    borderColor: constants.APP_SEPARATOR_COLOR,
  },
  idText: {
    fontFamily: constants.Fonts.REGULAR,
    fontSize: 16,
    color: "rgb(109,109,109)",
    position: "absolute",
    left: 138,
    top: 1,
  },
  dateText: {
    fontFamily: constants.Fonts.REGULAR,
    fontSize: 16,
    color: "rgb(109,109,109)",
    textAlign: "left",
  },
  orderSize: {
    fontFamily: constants.Fonts.REGULAR,
    fontSize: 16,
    color: "rgb(109,109,109)",
    paddingHorizontal: 2,
    marginTop: 20,
    textAlign: "left",
  },
  recorderButton: {
    position: "absolute",
    right: 20,
    top: -5,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 24,
    borderColor: Constants.APP_RED_COLOR,
    borderWidth: 1,
  },
  recorderButtonText: {
    color: Constants.APP_RED_COLOR,
    fontFamily: Constants.Fonts.REGULAR,
    fontSize: 12,
    paddingLeft: 22,
    paddingRight: 21,
    paddingTop: 8,
    paddingBottom: 7,
  },
});

export default styles;

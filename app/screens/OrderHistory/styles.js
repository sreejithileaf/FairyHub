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
    flex: 1,
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
    marginTop: 15,
    marginBottom: 5,
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
    marginTop: normalizedHeight(8.5),
    marginBottom: normalizedHeight(17.5),
  },
  line2: {
    height: 3,
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
  recorderButton: {
    position: "absolute",
    right: 20,
    top: 0,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 24,
    borderColor: Constants.APP_RED_COLOR,
    borderWidth: 1,
  },
  statusButton: {
    position: "absolute",
    right: 20,
    top: 0,
    justifyContent: "center",
    alignItems: "center",
    // borderRadius: 24,
    // borderColor: Constants.APP_RED_COLOR,
    // borderWidth: 1,
  },
  recorderButtonText: {
    color: Constants.APP_RED_COLOR,
    fontFamily: Constants.Fonts.REGULAR,
    fontSize: 12,
    // paddingLeft: 22,
    // paddingRight: 21,
    paddingTop: 3,
    // paddingBottom: 7,
  },
});

export default styles;

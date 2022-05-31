import { StyleSheet } from "react-native";
import AppStyles from "../../config/styles";
import Constants from "../../config/constants";

const styles = StyleSheet.create({
  container: {
    height: 60,
    flexDirection: "row",
    borderBottomColor: Constants.APP_SEPARATOR_COLOR,
    borderBottomWidth: 2,
    // justifyContent: 'center',
    alignItems: "center",
    backgroundColor: Constants.APP_WHITE_COLOR,
    // shadowColor: "rgba(110,110,110,0.2)",
    // shadowOffset: {
    //   width: 0,
    //   height: 3,
    // },
    // shadowOpacity: 0.5,
    // shadowRadius: 4.65,

    // elevation: 9,
  },
  subContainer: {
    justifyContent: "space-between",
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    paddingHorizontal: 10,
  },
  titleText: {
    fontSize: 16,
    flex: 1,
    textAlign: "center",
    color: Constants.APP_BLACK_COLOR,
    fontFamily: Constants.Fonts.BOLD,
  },
  titleTextCP: {
    fontSize: 16,
    flex: 1,
    textAlign: "center",
    color: Constants.APP_BLACK_COLOR,
    fontFamily: Constants.Fonts.BOLD,
    marginLeft: 20,
  },
  titleText2: {
    fontSize: 16,
    flex: 1,
    textAlign: "center",
    marginLeft: 10,
    color: Constants.APP_BLACK_COLOR,
    fontFamily: Constants.Fonts.BOLD,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  rightText: {
    fontSize: 15,
    marginRight: 10,
    fontFamily: Constants.Fonts.MEDIUM,
    textDecorationLine: "underline",
    color: Constants.APP_THEME_COLOR,
  },
});

export default styles;

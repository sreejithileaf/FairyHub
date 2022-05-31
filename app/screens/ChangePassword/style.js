import { StyleSheet } from "react-native";
import Constants from "../../config/constants";
import { normalizedHeight, normalizedWidth } from "../../config/common";

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Constants.APP_WHITE_COLOR },
  iconLock: {
    height: 100,
    width: normalizedWidth(75),
    position: "absolute",
    left: 169,
    top: 39
  },
  iconLockbg: {
    height: 122,
    width: normalizedWidth(148),
    position: "absolute",
    left: 133,
    top: 60
  },
  starText: {
    fontSize: 35,
    fontFamily: Constants.Fonts.BOLD,
    color: Constants.APP_THEME_COLOR2,
    position: "absolute",
    top: 135,
    left: 160
  },
  containerStyle: {
    marginTop: 2,
  },
  inpuLabelTextStyle: {
    fontFamily: Constants.Fonts.REGULAR,
    marginTop: 10,
    fontSize: 16,
    color: "rgb(193, 193, 193)",
  },
  submitText: {
    color: Constants.APP_WHITE_COLOR,
    fontSize: 18,
    paddingVertical: 14,
    fontFamily: Constants.Fonts.SEMIBOLD,
  },
  lockContainer: {
    marginTop: 60,
    justifyContent: "center",
    alignItems: "center"
  },
  submitButtonStyle: {
    marginTop: 39,
    marginBottom: 40,
    width: "100%",
    height: 47,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 24,
    backgroundColor: Constants.APP_THEME_COLOR2,
  },
  submitText: {
    color: Constants.APP_WHITE_COLOR,
    fontSize: 18,
    paddingVertical: 14,
    fontFamily: Constants.Fonts.SEMIBOLD,
  },
});

export default styles;

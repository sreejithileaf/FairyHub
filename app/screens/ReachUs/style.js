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
    top: 39,
  },
  iconLockbg: {
    height: 122,
    width: normalizedWidth(148),
    position: "absolute",
    left: 133,
    top: 60,
  },
  starText: {
    fontSize: 35,
    fontFamily: Constants.Fonts.BOLD,
    color: Constants.APP_THEME_COLOR2,
    position: "absolute",
    top: 135,
    left: 160,
  },
  containerStyle: {
    marginTop: 2,
    flex: 1,
  },
  addressContainer: {
    marginTop: 20,
    flexDirection: "row",
    marginBottom: 20,
  },
  mapContainer: {
    marginTop: 20,
    marginBottom: 20,
    // paddingHorizontal: 40
  },
  mapViewContainer: {
    width: Constants.SCREEN_WIDTH,
    height: normalizedHeight(300),
    alignSelf: "center",
    marginLeft: 10,
  },
  addressText: {
    fontFamily: constants.Fonts.REGULAR,
    fontSize: 16,
    color: constants.APP_RED_COLOR,
    position: "absolute",
    left: 40,
    bottom: -3,
  },
  inpuLabelTextStyle: {
    fontFamily: Constants.Fonts.REGULAR,
    marginTop: 10,
    fontSize: 16,
    color: "rgb(193, 193, 193)",
  },
  messageErrorText: {
    marginTop: 5,
    fontSize: 12,
    color: "#c51414",
    textAlign: "left",
  },
  contactAddressText: {
    fontFamily: constants.Fonts.REGULAR,
    fontSize: 20,
    color: "rgb(91,91,91)",
  },
  mainAddressText: {
    fontFamily: constants.Fonts.REGULAR,
    fontSize: 16,
    color: "rgb(109,109,109)",
    lineHeight: 30,
    marginTop: 15,
    textAlign: "left",
  },
  inpuLabelTextStyle2: {
    fontFamily: Constants.Fonts.REGULAR,
    marginTop: 10,
    fontSize: 16,
    color: "rgb(193, 193, 193)",
    borderRadius: 0,
  },
  countryCodeContainer: {
    position: "absolute",
    top: 13,
    left: 0,
    width: normalizedWidth(85),
    height: 85,
    justifyContent: "center",
  },
  countryCodeText: {
    fontFamily: constants.Fonts.REGULAR,
    fontSize: 16,
    marginBottom: 10,
  },
  submitText: {
    color: Constants.APP_WHITE_COLOR,
    fontSize: 18,
    paddingVertical: 14,
    fontFamily: Constants.Fonts.SEMIBOLD,
  },
  submitButtonStyle: {
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

  floatingAction: {
    alignItems: "center",
    justifyContent: "center",
    width: 48,
    position: "absolute",
    bottom: 40,
    right: 30,
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

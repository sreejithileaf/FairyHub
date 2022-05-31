import { StyleSheet } from "react-native";
import Constants from "../../config/constants";
import { normalizedHeight, normalizedWidth } from "../../config/common";

const styles = StyleSheet.create({

  listContainer: {
  
    flex: 1,
    marginTop: 10,
  },

  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },

  container: { flex: 1, backgroundColor: Constants.APP_WHITE_COLOR },
  text_align: { textAlign: "center" },
  emptylist: { flex: 1, alignItems: "center", justifyContent: "center" },
  addressCardContainer: {
    flex: 1,
    // marginHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  addressText: {
    color: Constants.APP_BLACK_COLOR,
    fontFamily: Constants.Fonts.REGULAR,
    fontSize: 14,
    marginLeft: 20,
    marginRight: 5,
    marginTop: 12,
    fontWeight: 'bold',
    textAlign: "left",
  },
  addAddressBtn: {
    // flex: 1,
    justifyContent: "flex-end",
    padding: 10,
    marginTop: 25,
  },
  btn_touchable_style: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Constants.APP_THEME_COLOR,
    alignSelf: "center",
    width: "60%",
    marginBottom: 10,
    borderRadius: normalizedHeight(54 / 2),
    height: normalizedHeight(54),
  },
  underLineStyle: {
    borderBottomWidth: 1,
    borderBottomColor: Constants.APP_SEPARATOR_COLOR,
     marginLeft: 20,
     marginRight: 20,
  },
  card_name_row: { flexDirection: "row", marginHorizontal: 20 },
  checkmark: { width: 10, height: 7 },
  button_left_container: { flexDirection: "row", flex: 1 },
  btn_set_default: {
    width: 125,
    height: 26,
    backgroundColor: "#dbb85a",
    borderWidth: 1,
    borderColor: "#dbb85a",
    paddingTop: 3,
    borderRadius: 26 / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  btn_bottom_touchable_style: {
    position: "absolute",
    top: 5,
    right: 15,
    backgroundColor: "rgba(217,217,217,0.12)",
    borderRadius: 3,
    height: 22,
    width: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  button_container: {
    flexDirection: "row",
    marginTop: 10,
    marginLeft: 10,
    justifyContent: "space-between",
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
  bottomButtonContainer: {
    flexDirection: "row",
    marginVertical: 15,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: constants.APP_SEPARATOR_COLOR,
    alignItems: "center",
    justifyContent: "center",
  },
  bottomButton1Container: {
    borderRightWidth: 1,
    borderColor: constants.APP_SEPARATOR_COLOR,
    // paddingRight: 10,
    flex: 1,
  },
  bottomButtonText: {
    fontFamily: constants.Fonts.REGULAR,
    fontSize: 9,
    color: constants.APP_RED_COLOR,
    paddingVertical: 10,
    textAlign: "center",
  },
});

export default styles;

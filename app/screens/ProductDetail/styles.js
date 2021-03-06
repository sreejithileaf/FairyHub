/**
 * Created by Jebin for iLeaf Solutions Pvt.Ltd
 * on February 19, 2020
 * Cart styles -
 */

import { StyleSheet } from "react-native";
import AppStyles from "../../config/styles";
import Constants from "../../config/constants";
import { normalizedHeight, normalizedWidth } from "../../config/common";
import constants from "../../config/constants";

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
  wishListContainer: {
    width: normalizedWidth(37),
    height: normalizedWidth(37),
    // position: "absolute",
    // top: 0, //normalizedWidth(10),
    // right: 0,
    backgroundColor: "rgba(255,255,255,0.0)",
    borderRadius: normalizedWidth(37) / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  imageRottationContainer: {
    width: normalizedWidth(41),
    height: normalizedWidth(20),
    position: "absolute",
    bottom: normalizedWidth(25),
    right: normalizedWidth(20),
    backgroundColor: "rgba(255,255,255,1.0)",
    borderRadius: normalizedWidth(20) / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  pagerContainer: {
    // position: "absolute",
    // bottom: 25,
    // left: 20,
    // bottom: 10,
    // alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginBottom: 15,
    marginTop: 15,
  },
  pagerItem: {
    width: 7,
    height: 3,
    backgroundColor: "rgba(255,255,255,0.3)",
    margin: 2,
    borderRadius: 2,
  },
  likeButtonImage: {
    width: 40, //normalizedWidth(30),
    height: 40, // normalizedWidth(25),
    // tintColor: Constants.APP_RED_COLOR,
  },
  scrollContainer: {
    backgroundColor: Constants.APP_WHITE_COLOR,
  },
  watchVideoContainer: {
    height: normalizedHeight(70),
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    backgroundColor: Constants.APP_WHITE_COLOR,
    borderTopWidth: 1,
    borderTopColor: Constants.APP_SEPARATOR_COLOR,
  },
  videoText: {
    fontFamily: Constants.Fonts.MEDIUM,
    fontSize: 13,
    color: Constants.APP_BLACK_COLOR,
    marginLeft: 10,
  },
  productInfoContainer: {
    // marginTop: 5,
    // backgroundColor: Constants.APP_WHITE_COLOR,
    borderTopColor: "rgba(110,110,110,0.2)",
    borderTopWidth: 2,
  },
  productInfoText: {
    fontSize: 16,
    fontFamily: Constants.Fonts.MEDIUM,
    color: Constants.APP_BLACK_COLOR,
    marginTop: 5,
    marginBottom: 10,
    textAlign: "left",
  },
  productCostContainer: {
    flexDirection: "row",
    marginHorizontal: 20,
    // marginVertical: 15,
    marginTop: 10,
    marginBottom: 10,
    alignItems: "center",
  },
  productCost: {
    // flex: 1,
    fontSize: 16,
    fontFamily: Constants.Fonts.BOLD,
    color: Constants.APP_BLACK_COLOR,
  },
  productCostOffer: {
    fontSize: 14,
    fontFamily: Constants.Fonts.REGULAR,
    color: Constants.APP_GRAY_COLOR3,
    marginLeft: 15,
    textDecorationLine: "line-through",
    textDecorationStyle: "solid",
  },
  productCostOfferPercantage: {
    fontSize: 12,
    fontFamily: Constants.Fonts.REGULAR,
    color: Constants.APP_GRAY_COLOR3,
    marginLeft: 15,
  },
  chooseColorContainer: {
    // marginTop: 5,
    backgroundColor: Constants.APP_WHITE_COLOR,
    borderBottomColor: "rgba(110,110,110,0.2)",
    // borderBottomWidth: 2,
    borderTopWidth: 1,
    borderTopColor: "rgba(110,110,110,0.2)",
  },
  sectionTitle: {
    flex: 1,
    fontSize: 14,
    fontFamily: Constants.Fonts.MEDIUM,
    color: Constants.APP_BLACK_COLOR,
    marginLeft: 20,
    marginTop: 10,
    textAlign: "left",
  },
  sizeChart: {
    fontSize: 15,
    fontFamily: Constants.Fonts.REGULAR,
    color: Constants.APP_BLACK_COLOR,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 10,
    textAlign: "left",
  },
  sizeText: {
    fontSize: 13,
    fontFamily: Constants.Fonts.REGULAR,
    color: Constants.APP_WHITE_COLOR,
    marginHorizontal: 10,
  },
  productSizeButton: {
    marginVertical: 7,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    height: 42,
    // width: 42,
    minWidth: 42,
  },
  quantityContainer: {
    flexDirection: "row",
    marginLeft: 20,
    marginVertical: 10,
  },
  quantityButton: {
    width: 21,
    height: 21,
    borderWidth: 1,
    borderColor: Constants.APP_GRAY_COLOR3,
    alignItems: "center",
    justifyContent: "center",
  },
  quantityButtonText: {
    fontSize: 15,
    fontFamily: Constants.Fonts.BOLD,
    color: Constants.APP_GRAY_COLOR3,
  },
  countText: {
    fontSize: 18,
    fontFamily: Constants.Fonts.MEDIUM,
    color: Constants.APP_BLACK_COLOR,
    marginHorizontal: 20,
  },
  productDescription: {
    marginHorizontal: 20,
    marginVertical: 10,
    fontSize: 13,
    fontFamily: Constants.Fonts.REGULAR,
    color: Constants.APP_GRAY_COLOR3,
    lineHeight: 22,
    textAlign: "left",
  },
  bottomButtonContainer: {
    height: normalizedHeight(100),
    width: "100%",
    backgroundColor: Constants.APP_WHITE_COLOR,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  addTocartButton: {
    flex: 1,
    borderRadius: normalizedHeight(54 / 2),
    height: normalizedHeight(54),
    borderWidth: 1,
    marginLeft: 20,
    marginRight: 10,
    borderColor: Constants.APP_THEME_COLOR,
    alignItems: "center",
    justifyContent: "center",
  },
  buyNowButton: {
    flex: 1,
    borderRadius: normalizedHeight(54 / 2),
    height: normalizedHeight(54),
    marginRight: 20,
    marginLeft: 10,
    backgroundColor: Constants.APP_THEME_COLOR,
    alignItems: "center",
    justifyContent: "center",
  },
  addToCartText: {
    fontFamily: Constants.Fonts.REGULAR,
    fontSize: 15,
    color: Constants.APP_THEME_COLOR,
  },
  buyNowText: {
    fontFamily: Constants.Fonts.MEDIUM,
    fontSize: 15,
    color: Constants.APP_WHITE_COLOR,
  },
  sizeChartView: {
    position: "absolute",
    top: 10,
    left: 0,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  sizeChartImageView: {
    width: Constants.SCREEN_WIDTH - 20,
    height: Constants.SCREEN_WIDTH - 20,
  },
  sizeChartContainerView: {
    flex: 1,
    backgroundColor: Constants.APP_TRANSPARENT_COLOR,
    alignItems: "center",
    justifyContent: "center",
  },
  curveView: {
    position: "absolute",
    left: -1,
    right: -1,
    height: 50,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    borderColor: Constants.APP_GRAY_COLOR,
    borderWidth: 1,
    borderBottomColor: Constants.APP_TRANSPARENT_COLOR,
  },
  quantityControlContainer: {
    flexDirection: "row",
    height: 30,
    width: 120,
    alignItems: "center",
    borderColor: Constants.APP_GRAY_COLOR,
  },
  incrementButton: {
    width: "30%",
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  quantityText: {
    // width: "40%",
    width: 30,
    textAlign: "center",
    fontSize: 14,
    height: 50,
    fontFamily: Constants.Fonts.MEDIUM,
    color: Constants.APP_BLACK_COLOR,
  },
  quantityButtonTitle: {
    color: Constants.APP_GREY_TEXT_COLOR,
    fontFamily: Constants.Fonts.REGULAR,
    fontSize: 16,
  },
  child_color_view: {
    flex: 1,
    // margin: 3,
    alignItems: "center",
    flexDirection: "row",
    // paddingLeft: 10,
    paddingHorizontal: 10,
    height: 60,
    // borderBottomWidth: 1,
    borderBottomColor: Constants.APP_BOX_BACKGROUND_GREY,
    // backgroundColor:Constants.APP_BOX_BACKGROUND_GREY
  },
  subDec: {
    fontSize: 12,
    color: Constants.APP_GRAY_COLOR,
    fontFamily: Constants.Fonts.REGULAR,
  },
  subView: {
    flex: 1,
    flexDirection: "row",
  },
  deliveryDescription: {
    fontSize: 12,
    color: Constants.APP_GRAY_COLOR,
    fontFamily: Constants.Fonts.REGULAR,
    lineHeight: 19,
    flex: 1,
    textAlign: "left",
  },
  nonRefundable: {
    fontSize: 14,
    color: Constants.APP_RED_COLOR,
    fontFamily: Constants.Fonts.REGULAR,
    lineHeight: 19,
    flex: 1,
    textAlign: "left",
  },
  offerContainer: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Constants.APP_SEPARATOR_COLOR,
    height: 31,
    width: 120,
    marginVertical: 15,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 20,
  },
  offerText: {
    fontSize: 13,
    color: Constants.APP_GRAY_COLOR,
    fontFamily: Constants.Fonts.MEDIUM,
    lineHeight: 19,
  },
  review: {
    fontSize: 13,
    color: Constants.APP_GRAY_COLOR,
    fontFamily: Constants.Fonts.REGULAR,
    flex: 1,
    height: 35,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: Constants.APP_SEPARATOR_COLOR,
  },
  reviewSubmitButton: {
    width: 72,
    height: 35,
    borderRadius: 5,
    backgroundColor: Constants.APP_THEME_COLOR,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },
  postText: {
    fontSize: 12,
    color: Constants.APP_WHITE_COLOR,
    fontFamily: Constants.Fonts.REGULAR,
  },
  reviewDescription: {
    fontSize: 12,
    color: Constants.APP_GRAY_COLOR,
    fontFamily: Constants.Fonts.REGULAR,
    lineHeight: 20,
    marginHorizontal: 20,
    flex: 1,
    marginBottom: 15,
    textAlign: "left",
  },
  thickSeparator: {
    borderTopColor: "rgba(110,110,110,0.2)",
    borderTopWidth: 2,
  },
  truckContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderColor: Constants.APP_THEME_COLOR,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 5,
  },
  noDescription: {
    fontFamily: Constants.Fonts.REGULAR,
    fontSize: 13,
    color: Constants.APP_GRAY_COLOR3,
    marginHorizontal: 20,
    marginVertical: 10,
    textAlign: "left",
    marginBottom: 20,
  },
  customerReviewText: {
    marginHorizontal: 20,
    marginBottom: 15,
  },
  productColorContainer: {
    width: 42,
    height: 42,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: Constants.APP_GRAY_COLOR2,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  priceContainer: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
  },
  ageGenderContainer: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginTop: 10,
  },
  productQuantityContainer: {
    flexDirection: "row",
    marginHorizontal: 17,
    marginVertical: 20,
  },
  productQuantityPlus: {
    width: "30%",
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  deliveryInfoContainer: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginBottom: 15,
  },
  deliveryDescriptionText: {
    flex: 1,
    marginLeft: 10,
  },
  refundableContainer: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginBottom: 10,
  },
  nonRefundableContainer: { flex: 1, marginLeft: 10 },
  nonRefundableTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    justifyContent: "center",
  },
  offerCodeContainer: {
    marginHorizontal: 15,
    height: 1,
    backgroundColor: Constants.APP_SEPARATOR_COLOR,
  },
  sizeList: {
    marginVertical: 15,
    marginHorizontal: 20,
  },
  reviewTextContainer: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginVertical: 10,
  },
  topTitle: {
    fontFamily: Constants.Fonts.REGULAR,
    fontSize: 15,
    paddingHorizontal: 20,
  },
  genderCategoryUnderLine: {
    backgroundColor: "rgb(249,65,206)",
    marginTop: 5,
    borderRadius: 1.5,
    marginHorizontal: 20,
  },
  readmore: {
    fontFamily: Constants.Fonts.REGULAR,
    fontSize: 14,
    color: "rgb(68,200,86)",
    textAlign: "center",
    marginTop: 5,
    marginBottom: 15,
  },
  videoPlayButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: constants.APP_WHITE_COLOR,
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    top: 10,
    right: 10,
    elevation: 10,
    shadowColor: Constants.APP_GRAY_COLOR,
    shadowOpacity: 0.35,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 5,
    },
  },
  deliveryTitle: {
    fontSize: 13,
    color: constants.APP_BLACK_COLOR,
    fontFamily: constants.Fonts.MEDIUM,
    textAlign: "left",
  },
  deliverySubTitle: {
    fontSize: 12,
    color: constants.APP_BLACK_COLOR,
    fontFamily: constants.Fonts.MEDIUM,
  },
  cost: {
    fontFamily: Constants.Fonts.BOLD,
    fontSize: 11,
    color: Constants.APP_BLACK_COLOR,
    marginStart: 3,
    textAlign: "left",
  },
  offerText2: {
    fontFamily: Constants.Fonts.REGULAR,
    fontSize: 12,
    color: "rgb(174,174,174)",
    textDecorationLine: "line-through",
    marginStart: 3,
    textAlign: "left",
    // marginRight: 20,
    // flex: 1,
  },
  productName: {
    // flex: 1,
    fontFamily: Constants.Fonts.REGULAR,
    fontSize: 12,
    color: Constants.APP_BLACK_COLOR,
    marginTop: 5,
    marginHorizontal: 3,
    textAlign: "left",
    height: 30,
  },
  totalPrice: {
    color: "red",
    textAlign: "center",
    fontFamily: Constants.Fonts.MEDIUM,
    fontSize: 16,
    marginVertical: 10,
  },
  addAllTocartButton: {
    alignItems: "center",
    justifyContent: "center",
    height: 40,
    borderRadius: 5,
    backgroundColor: Constants.APP_THEME_COLOR,
    marginHorizontal: 40,
    marginBottom: 20,
  },
  addAllText: {
    color: Constants.APP_WHITE_COLOR,
    fontSize: 16,
    fontFamily: Constants.Fonts.BOLD,
  },
  selectOption: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: "rgba(110,110,110,0.8)",
    borderRadius: 5,
    marginHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  outOfStockContainer: {
    width: "100%",
    height: 35,
    backgroundColor: "rgba(249,249,249,1)",
    alignItems: "center",
    justifyContent: "center",
  },
  outOfStockText: {
    color: "rgb(181,24,24)",
    fontSize: 16,
    fontFamily: Constants.Fonts.MEDIUM,
    textAlign: "center",
    textAlignVertical: "center",
    alignSelf: "center",
    backgroundColor: "rgba(249,249,249,1)",
    width: "100%",
  },
  overlay: {
    backgroundColor: "rgba(255,255,255, 0.7)",
    position: "absolute",
    top: 0,
    left: 30,
    right: 30,
    bottom: 0,
    elevation: 3,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default styles;

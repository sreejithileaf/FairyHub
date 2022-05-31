import {
  View,
  Text,
  Image,
  StatusBar,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import styles from "./styles";
import Modal from "react-native-modal";
import React, { Component } from "react";
import Images from "../../config/images";
import { showSingleAlert, showSimpleSnackbar } from "../../config/common";
import Constants from "../../config/constants";
import HudView from "../../components/hudView";
import ItemCell from "../../components/itemCell";
import { translate } from "../../config/languageSwitching/index";
import FooterButton from "../../components/FooterButton/FooterButton";
import EmptyDataPlaceholder from "../../components/emptyDataPlaceholder";
import { WebView } from "react-native-webview";
import NavigationHeader1 from "../../components/NavigationHeaders/NavigationHeader1";

var isPaymentUpdating = false;

const ListItem = React.memo(
  ({
    item,
    index,
    productsColors,
    productsSizes,
    addProductToWishList,
    props,
  }) => {
    const orderCell = item.items.map((orderedItem, ind) => {
      let itemData = orderedItem.parent_item
        ? orderedItem.parent_item
        : orderedItem;
      if (itemData) {
        return (
          <View
            style={{
              padding: 20,
              marginTop: 3,
              borderBottomWidth: ind + 1 === item.items.length ? 0 : 3,
              borderBottomColor: Constants.APP_SEPARATOR_COLOR,
            }}
          >
            <ItemCell
              item={itemData}
              addProductToWishList={addProductToWishList}
              index={index}
              productsSizes={productsSizes}
              productsColors={productsColors}
              allowAddOption={true}
              showQuantity={false}
              currency={props.currency}
              itemTotalCost={itemData.row_total}
              orderHistoryDetailsScreen={true}
              appMediaBaseUrl={props.appMediaBaseUrl}
              didTapOnItem={() => {
                props.navigation.push("ProductDetail", {
                  sku: itemData.sku,
                  // isFromCartScreen: true,
                });
              }}
            />
          </View>
        );
      }
    });

    return (
      <View
        style={
          {
            // marginTop: 3,
          }
        }
      >
        {orderCell}
      </View>
    );
  }
);

class OrderHistoryDetailScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orderItem: "",
      deliveryNote: "",
      paymentMethods: [],
      isOpenPaymentOptionView: false,
      checked: 0,
      paymentUrl: "",
      paymentSuccessUrl: "",
      paymentFailedUrl: "",
      isOpenPaymentView: false,
      loaderVisible: false,
    };
  }

  componentDidMount() {
    const orderItem = this.props.navigation.state.params
      ? this.props.navigation.state.params.orderItem
      : "";
    if (orderItem) {
      let deliveryNoteArray = orderItem.status_histories;
      let deliveryNote = "";
      deliveryNoteArray.map((noteDict) => {
        if (
          noteDict.status === "pending" &&
          noteDict.comment &&
          noteDict.comment !== ""
        ) {
          deliveryNote = noteDict.comment;
        }
      });
      this.setState({ orderItem: orderItem, deliveryNote });
    }
  }

  //Footer Sticky Button1 Function
  _didTapOnReFund = () => {
    const { orderItem } = this.state;
    let params = {
      order_id: orderItem.entity_id,
    };
    this.props.orderRefund(params, (status) => {
      if (status) {
        let callback = this.props.navigation.state.params.callback;

        showSingleAlert(translate("refund request sent"), "Ok", () => {
          callback();
          this.props.navigation.goBack();
        });
      }
    });
  };

  //Footer Sticky Button2 Function
  _didTapOnReOrder = () => {
    const { orderItem } = this.state;
    let params = {
      order_id: orderItem.entity_id,
    };
    this.props.reOrderItems(params, (status) => {
      if (status)
        showSimpleSnackbar(translate("Items are added into the cart"));
    });
  };

  //Retry payment
  _didTapOnRetryPayment = () => {
    // this.setState({ isOpenPaymentOptionView: true });

    const { paymentMethods, checked, orderItem } = this.state;
    const { isRTL } = this.props;

    this.props.getPaymentOptions(
      { order_id: orderItem.increment_id },
      (status, options) => {
        if (status) {
          let arr = [];
          options.map((item) => {
            let dict = {
              image: {
                uri: item.ImageUrl,
              },
              paymentMethodId: item.PaymentMethodId,
              title: isRTL ? item.PaymentMethodAr : item.PaymentMethodEn,
            };

            arr.push(dict);
            this.setState({
              paymentMethods: arr,
              isOpenPaymentOptionView: true,
            });
          });
        }
      }
    );
  };

  _didTapOnBackButton = () => {
    this.props.navigation.goBack();
  };

  _getShippingAddress = (orderItem) => {
    return (
      orderItem.billing_address.firstname +
      " " +
      orderItem.billing_address.lastname +
      "\n" +
      orderItem.billing_address.street[0] +
      "\n" +
      orderItem.billing_address.city +
      "\n" +
      orderItem.billing_address.postcode +
      "\nmob: " +
      orderItem.billing_address.telephone
    );
  };

  _getPaymentUrl = () => {
    const { paymentMethods, checked, orderItem } = this.state;
    const { userToken, guestInfo, userInfo, cartID, guestToken } = this.props;

    let selectedPaymentOption = paymentMethods[checked];

    this.setState({ isOpenPaymentOptionView: false });
    let params = {};
    if (userToken.length > 0) {
      params = {
        order_id: orderItem.increment_id,
        PaymentMethodId: selectedPaymentOption.paymentMethodId,
      };
    }
    this.props.getRetryPaymentURL(params, (dict) => {
      if (dict && dict.isCartError) {
        this.props.navigation.navigate("Home");
        return;
      }

      if (dict.entity_id && dict.entity_id !== "") {
        let callback = this.props.navigation.state.params.callback;
        showSingleAlert(translate("Already paid"), "Ok", () => {
          callback();
          this.props.navigation.goBack();
        });
        return;
      }
      if (dict) {
        this.setState({
          paymentUrl: dict.response.Data.PaymentURL,
          paymentSuccessUrl: dict.successurl,
          paymentFailedUrl: dict.failedurl,
        });

        setTimeout(() => {
          this.setState({ isOpenPaymentView: true });
        }, 500);
      }
    });
  };

  _onLoad = (state) => {
    const { paymentSuccessUrl, paymentFailedUrl, orderItem } = this.state;
    if (state.url.indexOf(paymentSuccessUrl) != -1) {
      const { userToken, guestInfo, userInfo, cartID, guestToken } = this.props;

      if (isPaymentUpdating) {
        return;
      }

      isPaymentUpdating = true;

      let regex = /[?&]([^=#]+)=([^&#]*)/g,
        params = {},
        match;
      while ((match = regex.exec(state.url))) {
        params[match[1]] = match[2];
      }
      const { paymentId, Id } = params;

      if (paymentId && Id) {
        this.setState({ isOpenPaymentView: false });

        let params = {};
        if (userToken.length > 0) {
          params = {
            order_id: orderItem.increment_id,
            paymentId: paymentId,
          };
        }
        this.setState({ loaderVisible: false });
        this.props.placeOrderWithPaymentReTry(
          params,
          this._orderPlacedCallback
        );
      } else {
        alert("Payment failed");
        this.setState({ isOpenPaymentView: false });
        this.setState({ loaderVisible: false });
      }
    } else if (state.url.indexOf(paymentFailedUrl) != -1) {
      if (isPaymentUpdating) {
        return;
      }

      isPaymentUpdating = true;

      let regex = /[?&]([^=#]+)=([^&#]*)/g,
        params = {},
        match;
      while ((match = regex.exec(state.url))) {
        params[match[1]] = match[2];
      }
      const { paymentId, Id } = params;

      this.props.getPaymentFailedInfo(
        { paymentId: Id },
        (status, errorInfo) => {
          isPaymentUpdating = false;
          this.setState({ loaderVisible: false });

          this.setState({ isOpenPaymentView: false });
          setTimeout(() => {
            if (errorInfo) {
              showSingleAlert(errorInfo.Error, translate("Ok"), () => {});
            }
          }, 1000);
        }
      );
    }
  };

  _orderPlacedCallback = (status, orderId) => {
    isPaymentUpdating = false;

    if (status) {
      let callback = this.props.navigation.state.params.callback;
      showSingleAlert(translate("Payment success"), "Ok", () => {
        callback();
        this.props.navigation.goBack();
      });
    }
  };

  render() {
    const {
      selectedLanguage,
      userToken,
      productsSizes,
      productsColors,
      isLoading,
      isRTL,
      currency,
    } = this.props;
    const {
      orderItem,
      paymentMethods,
      deliveryNote,
      isOpenPaymentOptionView,
      isOpenPaymentView,
      paymentUrl,
      loaderVisible,
    } = this.state;
    const paymethod =
      orderItem.payment &&
      orderItem.payment.additional_information &&
      orderItem.payment.additional_information.length > 0
        ? orderItem.payment.additional_information[0]
        : "";

    let isCod = paymethod === "Cash On Delivery" ? true : false;
    let paymentInfo = null;

    if (paymethod === "MyFatoorah Payment Gateway") {
    } else if (!isCod && paymethod.length > 0) {
      paymentInfo = JSON.parse(paymethod);
    }

    let isRefundable =
      orderItem.extension_attributes &&
      orderItem.extension_attributes.orders_refundable;
    let status =
      orderItem.status == "refundrequest" ||
      orderItem.status == "closed" ||
      orderItem.status == "canceled";

    if (orderItem.status === "pending") {
      isRefundable = false;
    }

    return (
      <SafeAreaView style={styles.safeContainer}>
        <StatusBar
          barStyle="dark-content"
          hidden={false}
          backgroundColor={Constants.APP_WHITE_COLOR}
        />
        <NavigationHeader1
          title={`Order Number ${orderItem.increment_id}`}
          showBackButton={true}
          didTapOnLeftButton={this._didTapOnBackButton}
          // hideBottomLine
          isRTL={selectedLanguage === "ar" ? true : false}
          hideSearch={true}
        />
        {/* <Text style={styles.titleStyle}>{translate("Order History")}</Text> */}
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.scrollContainer}>
            {orderItem.increment_id && (
              <ListItem
                item={orderItem}
                index={0}
                productsSizes={productsSizes}
                productsColors={productsColors}
                props={this.props}
              />
            )}
            <View style={[styles.underLineStyle, { marginVertical: 2.5 }]} />
            <View style={styles.cardWrapper}>
              <View style={styles.wrapper}>
                <Text style={styles.normalText}>
                  {translate("Cart Total (Before Discounts)")}
                </Text>
                <Text
                  style={
                    ([styles.normalText],
                    {
                      fontFamily: Constants.Fonts.MEDIUM,
                      color: Constants.APP_GRAY_COLOR3,
                    })
                  }
                >
                  {Number(orderItem.subtotal).toFixed(3) +
                    " " +
                    orderItem.order_currency_code}
                </Text>
              </View>
              <View style={styles.wrapper}>
                <Text style={styles.normalText}>
                  {translate("Cart discount")}
                </Text>
                <Text
                  style={
                    ([styles.normalText],
                    {
                      fontFamily: Constants.Fonts.MEDIUM,
                      color: Constants.APP_RED_COLOR,
                    })
                  }
                >
                  {Number(orderItem.discount_amount).toFixed(3) +
                    " " +
                    orderItem.order_currency_code}
                </Text>
              </View>
              <View style={styles.wrapper}>
                <Text style={styles.normalText}>{translate("Shipping")}</Text>
                <Text
                  style={
                    ([styles.normalText],
                    {
                      fontFamily: Constants.Fonts.MEDIUM,
                      color: Constants.APP_GRAY_COLOR3,
                    })
                  }
                >
                  {Number(orderItem.shipping_amount).toFixed(3) +
                    " " +
                    orderItem.order_currency_code}
                </Text>
              </View>
              <View
                style={[
                  styles.underLineStyle,
                  { marginTop: 19.5, marginBottom: 13.5 },
                ]}
              />
              <View
                style={{
                  flexDirection: "row",
                  marginHorizontal: 18,
                  justifyContent: "space-between",
                }}
              >
                <Text style={styles.normalTextBold}>{translate("TOTAL")}</Text>
                <Text style={styles.normalTextBold}>
                  {Number(orderItem.grand_total).toFixed(3) +
                    " " +
                    orderItem.order_currency_code}
                </Text>
              </View>
              <View
                style={[
                  styles.underLineStyle,
                  { marginBottom: 10.5, marginTop: 3.5 },
                ]}
              />
            </View>

            <View style={styles.wrapperColumn}>
              <Text style={styles.largeTextBold}>
                {translate("Personal information")}
              </Text>
              <Text style={styles.addressText}>
                {orderItem &&
                  orderItem.billing_address.firstname +
                    " " +
                    orderItem.billing_address.lastname}
              </Text>
              <Text style={styles.addressText}>
                {orderItem && orderItem.billing_address.email}
              </Text>
            </View>

            <View
              style={[
                styles.underLineStyle,
                { marginBottom: 10.5, marginTop: 17.5 },
              ]}
            />

            <View style={styles.wrapperColumn}>
              <Text style={styles.largeTextBold}>
                {translate("Delivery Address2")}
              </Text>
              <Text style={styles.addressText}>
                {orderItem.billing_address
                  ? this._getShippingAddress(orderItem)
                  : ""}
              </Text>
            </View>
            <View
              style={[
                styles.underLineStyle,
                { marginBottom: 10.5, marginTop: 17.5 },
              ]}
            />

            <View style={styles.wrapperColumn}>
              <Text style={styles.largeTextBold}>
                {translate("Billing Address")}
              </Text>
              <Text style={styles.addressText}>
                {orderItem.billing_address
                  ? this._getShippingAddress(orderItem)
                  : ""}
              </Text>
            </View>

            {deliveryNote !== "" && (
              <View
                style={[
                  styles.underLineStyle,
                  { marginBottom: 10.5, marginTop: 17.5 },
                ]}
              />
            )}

            {deliveryNote !== "" && (
              <View style={styles.wrapperColumn}>
                <Text style={styles.largeTextBold}>
                  {translate("Delivery note")}
                </Text>
                <Text style={styles.addressText}>{deliveryNote}</Text>
              </View>
            )}

            <View
              style={[
                styles.underLineStyle,
                { marginBottom: 10.5, marginTop: 17.5 },
              ]}
            />
            <View style={{ marginHorizontal: 20 }}>
              <Text style={styles.largeTextBold}>
                {orderItem.status === "pending"
                  ? ""
                  : translate("Payment Details")}
              </Text>
              {/* <Text style={[styles.addressText, {}]}>
                {translate("Payment Method") + " - " + paymethod}
              </Text> */}

              {isCod ? (
                <Text style={[styles.addressText, { marginBottom: 20 }]}>
                  {translate("Payment Method") + " - " + paymethod}
                </Text>
              ) : paymentInfo ? (
                <View style={{ marginBottom: 20 }}>
                  <Text style={[styles.addressText, {}]}>
                    {translate("Invoice No") + " : " + paymentInfo.invoiceId}
                  </Text>
                  <Text style={[styles.addressText, {}]}>
                    {translate("Amount") +
                      " : " +
                      Number(orderItem.payment.amount_paid).toFixed(3) +
                      " " +
                      orderItem.order_currency_code}
                  </Text>
                  <Text style={[styles.addressText, {}]}>
                    {translate("Order No") + " : " + orderItem.increment_id}
                  </Text>
                  <Text style={[styles.addressText, {}]}>
                    {translate("Reference No") +
                      " : " +
                      paymentInfo.TransactionId}
                  </Text>
                  <Text style={[styles.addressText, {}]}>
                    {translate("Gateway") + " : " + paymentInfo.paymentGateway}
                  </Text>
                  <Text style={[styles.addressText, {}]}>
                    {translate("Status") + " : " + paymentInfo.invoiceStatus}
                  </Text>
                </View>
              ) : null}
            </View>
          </View>
        </ScrollView>
        {/* <View style={styles.container}>
          <TouchableOpacity
            activeOpacity={constants.ACTIVE_OPACITY}
            style={styles.button2}
          // onPress={onButton2Click}
          >
            <Text style={styles.buttonText2}>{translate("Reorder").toUpperCase()}</Text>
          </TouchableOpacity>
        </View> */}
        {orderItem.status === "pending" ? (
          <FooterButton
            singleButton
            buttonText2={translate("Retry Payment").toUpperCase()}
            onButton2Click={this._didTapOnRetryPayment}
            screenWidth={this.props.screenWidth}
          />
        ) : isRefundable && isRefundable === "1" && !status ? (
          <FooterButton
            buttonText1={translate("Refund").toUpperCase()}
            buttonText2={translate("Reorder").toUpperCase()}
            onButton1Click={this._didTapOnReFund}
            onButton2Click={this._didTapOnReOrder}
            screenWidth={this.props.screenWidth}
          />
        ) : (
          <FooterButton
            singleButton
            buttonText2={translate("Reorder").toUpperCase()}
            onButton2Click={this._didTapOnReOrder}
            screenWidth={this.props.screenWidth}
          />
        )}

        {!orderItem.increment_id && (
          <View style={{ alignSelf: "center" }}>
            <EmptyDataPlaceholder
              titleText={translate("Your order history is empty")}
              descriptionText={""}
              placeHolderImage={Images.noWishlist}
            />
          </View>
        )}

        <Modal
          isVisible={isOpenPaymentOptionView}
          onBackdropPress={() => {
            this.setState({ isOpenPaymentOptionView: false });
          }}
          onBackButtonPress={() => {
            this.setState({ isOpenPaymentOptionView: false });
          }}
          style={{ margin: 0 }}
        >
          <View style={styles.deliveryNoteModalWrapper}>
            <View style={styles.deliveryNoteCardWrapper}>
              <Text style={styles.deliveryNoteText}>
                {translate("Payment Methods")}
              </Text>
              {paymentMethods.length > 0 &&
                paymentMethods.map((item, key) => {
                  return this.state.checked == key ? (
                    <TouchableOpacity
                      key={"ff" + item.title}
                      onPress={() => {
                        // this._didTapOnPaymentMethod(item)
                      }}
                      style={styles.paymentMethodButton}
                      activeOpacity={Constants.ACTIVE_OPACITY}
                    >
                      <Image
                        source={Images.radioChecked3}
                        style={{ width: 20, height: 20 }}
                      />
                      <Text style={[styles.paymentText, { flex: 1 }]}>
                        {item.title}
                      </Text>
                      <Image
                        resizeMode={"contain"}
                        style={{ width: 40, height: 40 }}
                        source={item.image}
                      />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      key={"fff" + item.title}
                      onPress={() => {
                        // this._didTapOnPaymentMethod(item);
                        this.setState({ checked: key });
                      }}
                      style={styles.paymentMethodButton}
                      activeOpacity={Constants.ACTIVE_OPACITY}
                    >
                      <Image
                        source={Images.radioUnchecked2}
                        style={{ width: 20, height: 20 }}
                      />
                      <Text style={[styles.paymentText, { flex: 1 }]}>
                        {item.title}
                      </Text>
                      <Image
                        resizeMode={"contain"}
                        style={{ width: 40, height: 40 }}
                        source={item.image}
                      />
                    </TouchableOpacity>
                  );
                })}

              <View style={styles.pwdSubmitWrapper}>
                <TouchableOpacity
                  onPress={() =>
                    this.setState({ isOpenPaymentOptionView: false })
                  }
                  style={styles.pwdCancelWrapper}
                >
                  <Text style={styles.pwdCancelTxt}>{translate("Cancel")}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    this._getPaymentUrl();
                  }}
                  style={styles.pwdSubmitBtnWrapper}
                >
                  <Text style={styles.pwdSubmitTxt}>{translate("Submit")}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        <Modal
          isVisible={isOpenPaymentView}
          onBackdropPress={() => {
            this.setState({ isOpenPaymentView: false });
          }}
          onBackButtonPress={() => {
            this.setState({ isOpenPaymentView: false });
          }}
          style={{ margin: 0 }}
        >
          <SafeAreaView
            style={{
              margin: 0,
              flex: 1,
              backgroundColor: "rgb(255,255,255)",
            }}
          >
            <NavigationHeader1
              isWishlist={false}
              hideSearch={true}
              title={translate("Payment")}
              showBackButton={true}
              didTapOnLeftButton={() =>
                this.setState({
                  loaderVisible: false,
                  paymentUrl: "",
                  isOpenPaymentView: false,
                })
              }
              isRTL={this.props.isRTL}
            />
            <WebView
              source={{
                uri: paymentUrl,
              }}
              onLoadStart={() => this.setState({ loaderVisible: true })}
              onLoadEnd={() => this.setState({ loaderVisible: false })}
              onNavigationStateChange={this._onLoad}
              onError={(syntheticEvent) => {
                const { nativeEvent } = syntheticEvent;
                this.setState({
                  loaderVisible: false,
                  paymentUrl: "",
                });
                showSingleAlert(translate("API_Failed"), "Ok", () => {
                  this.setState({ isOpenPaymentView: false });
                });
              }}
            />
            {(isLoading || loaderVisible) && <HudView />}
          </SafeAreaView>
        </Modal>
        {(isLoading || loaderVisible) && <HudView />}
      </SafeAreaView>
    );
  }
}

export default OrderHistoryDetailScreen;

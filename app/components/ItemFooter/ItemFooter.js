import moment from "moment";
import styles from "./styles";
import Modal from "react-native-modal";
import Images from "../../config/images";
import React, { Component } from "react";
import Constants from "../../config/constants";
import { Calendar } from "react-native-calendars";
import {Picker} from '@react-native-picker/picker';
import { translate } from "../../config/languageSwitching";
import {
  showAlertWithCallback,
  isEmpty,
  showSingleAlert,
} from "../../config/common";
import { Text, View, Image, TextInput, TouchableOpacity } from "react-native";

export default class ItemFooter extends Component {
  constructor(props) {
    super(props);

    let isSameDayDeliveryAvailable =
      props.data.extension_attributes.delivery_type === "5576" ? true : false;

    this.state = {
      count: this.props.data.qty || 1,
      isSameday: isSameDayDeliveryAvailable,
      newDate: moment(new Date(), "YYYY-MM-DD")
        .add(1, "days")
        .format("YYYY-MM-DD"), //new Date(),
      nowTime: "",
      showDatePicker: false,
      showTimePicker: false,
      completeHolidays: {},
      maxDaysToBook: "",
      markedDates: [],
      deliveryTimeArray: [],
      availableMaxDay: moment(new Date(), "YYYY-MM-DD")
        .add(1, "days")
        .format("YYYY-MM-DD"),
      updatedDeliveryDateTime: {},
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (
      nextProps.deliveryTime.length != prevState.deliveryTimeArray.length &&
      nextProps.availableNextDay != "" &&
      nextProps.availableMaxDay != ""
    ) {
      let dateFrom = "";

      if (nextProps.deliveryTime.length > 0) {
        let item = nextProps.deliveryTime[0];
        let startTime;
        let startStr = item.time_from.substring(0, 2);
        if (Number(startStr) > 12) {
          startTime = Number(startStr) - 12 + ":00 pm";
        } else if (Number(startStr) == 12) {
          startTime = Number(startStr) + ":00 pm";
        } else {
          startTime = Number(startStr) + ":00 am";
        }
        let endTime;
        let endStr = item.time_to.substring(0, 2);
        if (Number(endStr) > 12) {
          endTime = Number(endStr) - 12 + ":00 pm";
        } else if (Number(endStr) == 12) {
          endTime = Number(endStr) + ":00 pm";
        } else {
          endTime = Number(endStr) + ":00 am";
        }
        dateFrom = startTime + " - " + endTime;
      }

      let ff = moment(nextProps.availableNextDay, "YYYY-MM-DD");
      let gg = moment(nextProps.availableMaxDay, "YYYY-MM-DD");
      return {
        deliveryTimeArray: nextProps.deliveryTime,
        nowTime: dateFrom,
        newDate: ff,
        availableMaxDay: gg,
      };
    } else if (
      JSON.stringify(nextProps.updatedDeliveryDateTime) !==
      JSON.stringify(prevState.updatedDeliveryDateTime)
    ) {
      if (
        nextProps.updatedDeliveryDateTime &&
        nextProps.updatedDeliveryDateTime.isSameDay
      ) {
        return {
          updatedDeliveryDateTime: nextProps.updatedDeliveryDateTime,
          // nowTime: "4444",
        };
      } else if (
        nextProps.updatedDeliveryDateTime &&
        nextProps.updatedDeliveryDateTime.time &&
        nextProps.updatedDeliveryDateTime.date
      ) {
        return {
          updatedDeliveryDateTime: nextProps.updatedDeliveryDateTime,
          nowTime: nextProps.updatedDeliveryDateTime.time,
          newDate: nextProps.updatedDeliveryDateTime.date,
        };
      }
    } else return null;
  }

  _enableSameday = () => {
    const {
      data,
      props,
      sameDayDeliveryTime,
      completeHolidays,
      availableNextDay,
    } = this.props;

    const { deliveryTimeArray, nowTime, newDate } = this.state;

    if (this.state.isSameday) {
      showSingleAlert(translate("delivery date and time alert"));
    }

    const { cartList, guestcartList, userToken, guestToken } = props;
    let cartData = userToken.length > 0 ? cartList : guestcartList;

    let deliveryDateString = newDate.dateString
      ? newDate.dateString
      : moment(newDate).format("YYYY-MM-DD");

    if (this.props.itemIndex == 0) {
      this.setState(
        {
          isSameday: !this.state.isSameday,
        },
        () => {
          let cart_item = [];
          let localTime = moment
            .utc(sameDayDeliveryTime)
            .local()
            .format("YYYY-MM-DD HH:mm:ss");
          let isSameDayDeliveryTimeOver = moment().isAfter(localTime);
          let invalidDatesArray = Object.keys(completeHolidays);
          let today = moment(new Date(), "YYYY-MM-DD").format("YYYY-MM-DD");
          let sameDayFiltered = invalidDatesArray.filter(function(dateItem) {
            return today === dateItem;
          });

          if (this.state.isSameday) {
            cartData.map((item) => {
              let isSameDayDelivery =
                item.extension_attributes.delivery_type === "5576";
              let isScheduledDelivery =
                item.extension_attributes.delivery_type === "5615";

              if (sameDayFiltered.length > 0) {
                isSameDayDeliveryTimeOver = true;
              }

              let dict = {};
              if (isSameDayDelivery && !isSameDayDeliveryTimeOver) {
                dict = {
                  item_id: item.item_id,
                  sku: item.sku,
                  delivery: "sameday",
                  time_slot: "",
                };
                cart_item.push(dict);
              } else if (!isScheduledDelivery) {
                dict = {
                  item_id: item.item_id,
                  sku: item.sku,
                  delivery: availableNextDay,
                  time_slot: nowTime,
                };
                cart_item.push(dict);
              }
            });

            let cartDict = {};
            if (userToken.length > 0) {
              cartDict = {
                cart_item: cart_item,
              };
            } else {
              cartDict = {
                cart_item: {
                  quote_id: guestToken,
                  items: cart_item,
                },
              };
            }

            this.props.updateCartDateTime(cartDict);
            this.props.dateTimeUpdated({ type: "sameDayAll", value: true });
          } else {
            cartData.map((item) => {
              let isSameDayDelivery =
                item.extension_attributes.delivery_type === "5576";
              let isScheduledDelivery =
                item.extension_attributes.delivery_type === "5615";

              let dict = {};
              if (!isScheduledDelivery) {
                dict = {
                  item_id: item.item_id,
                  sku: item.sku,
                  // delivery: availableNextDay,
                  // time_slot: this._makeTimeString(deliveryTimeArray[0]),
                  delivery: deliveryDateString,
                  time_slot: nowTime,
                };
                cart_item.push(dict);
              }
            });

            let cartDict = {};
            if (userToken.length > 0) {
              cartDict = {
                cart_item: cart_item,
              };
            } else {
              cartDict = {
                cart_item: {
                  quote_id: guestToken,
                  items: cart_item,
                },
              };
            }

            this.props.updateCartDateTime(cartDict);
            // this.props.dateTimeUpdated({ type: "sameDayAll", value: false }); if()

            this.props.dateTimeUpdated({
              type: "deliveryDateTimeAll",
              date: deliveryDateString,
              time: nowTime,
            });
          }
        }
      );
    } else {
      this.setState(
        {
          isSameday: !this.state.isSameday,
        },
        () => {
          if (this.state.isSameday) {
            let cart_item = [];

            let dict = {
              item_id: data.item_id,
              sku: data.sku,
              delivery: "sameday",
              time_slot: "",
            };

            cart_item.push(dict);

            let cartDict = {};
            if (props.userToken.length > 0) {
              cartDict = {
                cart_item: cart_item,
              };
            } else {
              cartDict = {
                cart_item: {
                  quote_id: props.guestToken,
                  items: cart_item,
                },
              };
            }

            this.props.updateCartDateTime(cartDict);
            this.props.dateTimeUpdated({ type: "sameDaySingle", value: true });
          } else {
            this._didTapOnDoneButton();
          }
        }
      );
    }
  };

  _removeFromCart = (id) => {
    showAlertWithCallback(
      translate("product remove confirmation"),
      translate("Yes"),
      translate("No"),
      () => {
        this.props.removeCart(id);
      },
      null
    );
  };

  PickerView() {
    let { nowTime } = this.state;
    const { deliveryTime } = this.props;
    return (
      <Picker
        selectedValue={nowTime}
        style={{
          height: Constants.IS_ANDROID ? 50 : 200,
          width: Constants.SCREEN_WIDTH - 100,
        }}
        onValueChange={(itemValue, itemIndex) => {
          if (itemValue === this.state.nowTime) return;
          this.setState({ nowTime: itemValue }, () => {
            if (Constants.IS_ANDROID) this._didTapOnDoneButton();
          });
        }}
      >
        {deliveryTime &&
          deliveryTime.length > 0 &&
          deliveryTime.map((item) => {
            let dateFrom = this._makeTimeString(item);
            return (
              <Picker.Item key={dateFrom} label={dateFrom} value={dateFrom} />
            );
          })}
      </Picker>
    );
  }

  _makeTimeString = (item) => {
    let startTime;
    let startStr = item.time_from.substring(0, 2);
    if (Number(startStr) > 12) {
      startTime = Number(startStr) - 12 + ":00 pm";
    } else if (Number(startStr) == 12) {
      startTime = Number(startStr) + ":00 pm";
    } else {
      startTime = Number(startStr) + ":00 am";
    }
    let endTime;
    let endStr = item.time_to.substring(0, 2);
    if (Number(endStr) > 12) {
      endTime = Number(endStr) - 12 + ":00 pm";
    } else if (Number(endStr) == 12) {
      endTime = Number(endStr) + ":00 pm";
    } else {
      endTime = Number(endStr) + ":00 am";
    }
    return startTime + " - " + endTime;
  };

  onDayPress = (day) => {
    const markedDay = {
      [day.dateString]: {
        selected: true,
        selectedColor: Constants.APP_THEME_COLOR,
      },
    };

    this.setState({
      newDate: moment(day.dateString).format("YYYY-MM-DD"),
      markedDates: markedDay,
    });
  };

  _didTapOnDoneButton = () => {
    this.setState({ showTimePicker: false });

    const { data, props } = this.props;
    const { newDate, nowTime } = this.state;

    const { cartList, guestcartList, userToken, guestToken } = props;
    let cartData = userToken.length > 0 ? cartList : guestcartList;

    let deliveryDateString = newDate.dateString
      ? newDate.dateString
      : moment(newDate).format("YYYY-MM-DD");

    let cartDict = {};

    if (this.props.itemIndex == 0) {
      let cart_item = [];

      cartData.map((item) => {
        let isSameDayDelivery =
          item.extension_attributes.delivery_type === "5576";
        let isScheduledDelivery =
          item.extension_attributes.delivery_type === "5615";

        let dict = {};
        if (!isScheduledDelivery) {
          dict = {
            item_id: item.item_id,
            sku: item.sku,
            delivery: deliveryDateString,
            time_slot: nowTime,
          };
          cart_item.push(dict);
        }
      });

      if (userToken.length > 0) {
        cartDict = {
          cart_item: cart_item,
        };
      } else {
        cartDict = {
          cart_item: {
            quote_id: guestToken,
            items: cart_item,
          },
        };
      }
      this.props.dateTimeUpdated({
        type: "deliveryDateTimeAll",
        date: deliveryDateString,
        time: nowTime,
      });
    } else {
      if (props.userToken.length > 0) {
        cartDict = {
          cart_item: [
            {
              item_id: data.item_id,
              sku: data.sku,
              delivery: deliveryDateString,
              time_slot: nowTime,
            },
          ],
        };
      } else {
        cartDict = {
          cart_item: {
            quote_id: props.guestToken,
            items: [
              {
                item_id: data.item_id,
                sku: data.sku,
                delivery: deliveryDateString,
                time_slot: nowTime,
              },
            ],
          },
        };
      }

      this.props.dateTimeUpdated({
        type: "deliveryDateTime",
        date: deliveryDateString,
        time: nowTime,
      });
    }

    this.props.updateCartDateTime(cartDict);
    this.setState({
      showDatePicker: false,
    });
  };

  render() {
    const {
      data,
      currency,
      removeCart,
      navigation,
      holidaysInWeek,
      holidays,
      execptionalHolidays,
      maxDaysToBook,
      completeHolidays,
      sameDayDeliveryTime,
      newDate,
      updatedDeliveryDateTime,
    } = this.props;
    let maxDaysToBookDays = Number(maxDaysToBook);
    const { params } = this.props.navigation.state;
    const { count, nowTime, availableMaxDay } = this.state;
    let currDate = new Date();
    let maxDate = new Date(currDate.setMonth(currDate.getMonth() + 1));
    let todayDate = new Date();

    let isSameDayDelivery = data.extension_attributes.delivery_type === "5576";
    let isScheduledDelivery =
      data.extension_attributes.delivery_type === "5615";

    let localTime = moment
      .utc(sameDayDeliveryTime)
      .local()
      .format("YYYY-MM-DD HH:mm:ss");
    let isSameDayDeliveryTimeOver = moment().isAfter(localTime);

    let isSameday =
      isScheduledDelivery || isSameDayDeliveryTimeOver
        ? false
        : this.state.isSameday;

    let today = moment(new Date(), "YYYY-MM-DD").format("YYYY-MM-DD");
    let invalidDatesArray = Object.keys(completeHolidays);
    let filtered = invalidDatesArray.filter(function(dateItem) {
      return today === dateItem;
    });

    if (!isSameDayDeliveryTimeOver && filtered.length > 0) {
      isSameDayDeliveryTimeOver = true;
      isSameday = false;
    }
    // isSameday = false;

    if (updatedDeliveryDateTime) {
      isSameday = updatedDeliveryDateTime.isSameDay;
    }

    return (
      <View style={{ marginHorizontal: 15, marginTop: 10 }}>
        {isSameDayDelivery && isSameDayDeliveryTimeOver && (
          <View style={[styles.rowN, { paddingTop: 0 }]}>
            <Text
              style={{
                fontFamily: Constants.Fonts.REGULAR,
                fontSize: 15,
                color: "rgb(249,91,91)",
              }}
            >
              {translate("Same day")}
            </Text>
          </View>
        )}
        {isSameDayDelivery && !isSameDayDeliveryTimeOver && (
          <View>
            <View style={styles.row}>
              <TouchableOpacity
                style={styles.checkBoxWrap3}
                activeOpacity={constants.ACTIVE_OPACITY}
                hitSlop={{ top: 5, bottom: 5, left: 10, right: 10 }}
                onPress={() => this._enableSameday()}
              >
                {isSameday ? (
                  <View style={styles.checkboxImg1}>
                    <Image
                      source={Images.tick}
                      style={{
                        height: 10,
                        width: 10,
                        tintColor: Constants.APP_BLACK_COLOR,
                      }}
                    />
                  </View>
                ) : (
                  <View style={styles.unCheckboxImg} />
                )}
                <Text style={styles.semiBoldText3}>
                  {translate("Sameday Delivery")}
                </Text>
              </TouchableOpacity>
            </View>
            {isSameday && (
              // <View style={{ width: 50, height: 50, backgroundColor: "red" }} />
              <Text style={[styles.sameDayDescription, { marginBottom: 10 }]}>
                {translate("This product will be delivered today")}
              </Text>
            )}
          </View>
        )}

        {!isSameday && !isScheduledDelivery && data.extension_attributes && (
          <View style={{ opacity: isSameday ? 0.3 : 1 }}>
            <Text style={styles.dateAndTimeSlot}>
              {translate("Next available slot for delivery")}
            </Text>
            <View style={styles.row}>
              <View style={styles.checkBoxWrap1}>
                <Text style={styles.semiBoldText}>
                  {translate("Delivery Date")}
                </Text>
              </View>
              <View style={styles.checkBoxWrap1}>
                <Text style={styles.semiBoldText2}>
                  {translate("Delivery Time")}
                </Text>
              </View>
            </View>
            <View style={styles.rowNn}>
              <View style={styles.checkBoxWrap2}>
                <TextInput
                  style={[
                    styles.dateInput,
                    { textAlign: this.props.isRTL ? "right" : "left" },
                  ]}
                  value={moment(this.state.newDate).format("DD.MM.YYYY")}
                  onChangeText={(text) => this.setState({ voucherCode: text })}
                />
                <Image
                  source={Images.calender}
                  style={{ position: "absolute", right: 10 }}
                />
                <TouchableOpacity
                  onPress={() => {
                    isSameday
                      ? this.setState({ showDatePicker: false })
                      : this.setState({ showDatePicker: true });
                  }}
                  style={styles.pickerButton}
                />
              </View>
              <View style={{ width: "3%" }} />
              <View style={styles.checkBoxWrap2}>
                <TextInput
                  style={[
                    styles.dateInput,
                    { textAlign: this.props.isRTL ? "right" : "left" },
                  ]}
                  value={nowTime}
                  onChangeText={(text) => this.setState({ voucherCode: text })}
                  // placeholder={translate('Enter Voucher Code')}
                />
                <Image
                  style={{
                    transform: [{ rotate: "90deg" }],
                    right: 20,
                    tintColor: "rgb(112,112,112)",
                  }}
                  source={Images.arrowRight}
                />
                <TouchableOpacity
                  onPress={() => {
                    isSameday
                      ? this.setState({ showTimePicker: false })
                      : this.setState({ showTimePicker: true });
                  }}
                  activeOpacity={0.7}
                  style={styles.pickerButton}
                >
                  {Constants.IS_ANDROID && (
                    <View style={{ position: "absolute" }}>
                      {!isSameday && this.PickerView()}
                    </View>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {isScheduledDelivery && (
          <View style={{ flexDirection: "row" }}>
            <Image
              style={{ tintColor: Constants.APP_GRAY_COLOR3 }}
              source={Images.phone}
            />
            <Text style={styles.scheduledDeliveryText}>
              {translate("schduled_delivery_text")}
            </Text>
          </View>
        )}

        <Modal
          isVisible={this.state.showDatePicker}
          onBackdropPress={() => this.setState({ showDatePicker: false })}
          onBackButtonPress={() => this.setState({ showDatePicker: false })}
        >
          <View
            style={{
              alignSelf: "center",
              backgroundColor: "rgb(255,255,255)",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginHorizontal: 5,
                marginTop: 7,
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  this.setState({ showDatePicker: false });
                }}
                hitSlop={{ left: 20, top: 10, right: 10, bottom: 30 }}
                style={{}}
                style={{
                  backgroundColor: Constants.APP_THEME_COLOR,
                  width: 60,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 5,
                }}
              >
                <Text style={styles.cancelDoneButton}>{"Cancel"}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={this._didTapOnDoneButton}
                hitSlop={{ left: 20, top: 10, right: 10, bottom: 30 }}
                style={{
                  backgroundColor: Constants.APP_THEME_COLOR,
                  width: 60,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 5,
                }}
              >
                <Text style={styles.cancelDoneButton}>{"Done"}</Text>
              </TouchableOpacity>
            </View>

            <View
              style={{
                height: 1,
                backgroundColor: Constants.APP_SEPARATOR_COLOR,
                marginTop: 6,
              }}
            />

            <Calendar
              // testID={testIDs.calendars.FIRST}
              // current={new Date()}
              style={{
                width: Constants.SCREEN_WIDTH - 60,
              }}
              minDate={moment(new Date(), "YYYY-MM-DD")
                .add(1, "days")
                .format("YYYY-MM-DD")}
              // maxDate={moment(new Date(), "YYYY-MM-DD")
              //   .add(500, "days")
              //   .format("YYYY-MM-DD")}
              maxDate={moment(new Date(availableMaxDay), "YYYY-MM-DD").format(
                "YYYY-MM-DD"
              )}
              hideExtraDays
              onDayPress={this.onDayPress}
              markedDates={Object.assign(
                {},
                completeHolidays,
                this.state.markedDates
              )}
              // markedDates={completeHolidays}
              disableAllTouchEventsForDisabledDays
            />
          </View>
        </Modal>

        <Modal
          isVisible={this.state.showTimePicker && !Constants.IS_ANDROID}
          onBackdropPress={() => this.setState({ showTimePicker: false })}
          onBackButtonPress={() => this.setState({ showTimePicker: false })}
        >
          <View
            style={{
              alignSelf: "center",
              backgroundColor: "rgb(255,255,255)",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginHorizontal: 5,
                marginTop: 7,
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  this.setState({ showTimePicker: false });
                }}
                style={{
                  backgroundColor: Constants.APP_THEME_COLOR,
                  width: 60,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 5,
                }}
                hitSlop={{ left: 20, top: 10, right: 10, bottom: 30 }}
              >
                <Text style={styles.cancelDoneButton}>{"Cancel"}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={this._didTapOnDoneButton}
                style={{
                  backgroundColor: Constants.APP_THEME_COLOR,
                  width: 60,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 5,
                }}
                hitSlop={{
                  left: 20,
                  top: 10,
                  right: 10,
                  bottom: 30,
                }}
              >
                <Text style={styles.cancelDoneButton}>{"Done"}</Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                height: 1,
                backgroundColor: Constants.APP_SEPARATOR_COLOR,
                marginTop: 6,
              }}
            />
            {this.PickerView()}
          </View>
        </Modal>
      </View>
    );
  }
}

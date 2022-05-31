/**
 * Created by Jebin for iLeaf Solutions Pvt.Ltd
 * on February 19, 2020
 * ProfileDetailView -
 */

import {
  View,
  Text,
  Image,
  Keyboard,
  StatusBar,
  TextInput,
  FlatList,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import styles from "./styles";
import React, { Component } from "react";
import Images from "../../config/images";
import HudView from "../../components/hudView";
import Constants from "../../config/constants";
import { translate } from "../../config/languageSwitching/index";
import FloatingLabelInput from "../../components/FloatingLabelInput";
import {
  showSingleAlert,
  checkPasswordValid,
  normalizedWidth,
  showAlertWithCallback,
  showSimpleSnackbar,
  checkPhoneNumberValid,
} from "../../config/common";
import NavigationHeader1 from "../../components/NavigationHeaders/NavigationHeader1";
import BottomButton from "../../components/BottomButton";
import { format, addHours } from "date-fns";
import { TextField } from "react-native-material-textfield";
import Modal from "react-native-modal";
import DatePicker from "react-native-date-picker";

class ProfileDetailView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: "",
      lastName: "",
      email: "",
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
      mobile: "",
      isChanged: false,
      required_firstName: true,
      required_lastName: true,
      required_mobile: true,
      gender: [{ id: 1 }, { id: 2 }],
      showDatePicker: false,
      newDate: new Date(),
      checked: -1,
      reminderName: "",
      reminderOccasion: "",
      reminderDate: "",
    };
  }

  componentDidMount() {
    const { userInfo } = this.props;

    let mobileNo = "";

    if (
      userInfo &&
      userInfo.custom_attributes &&
      userInfo.custom_attributes.length > 0
    ) {
      userInfo.custom_attributes.map((obj) => {
        if (obj.attribute_code === "fhmobile_number") {
          mobileNo = obj.value;
        }
      });
    }

    this.setState({
      firstName: userInfo.firstname,
      lastName: userInfo.lastname,
      email: userInfo.email,
      countryCode: "+965",
      // userInfo.custom_attributes
      //   ? userInfo.custom_attributes[0].value
      //   : "+965",
      mobile: mobileNo,
      // userInfo.custom_attributes && userInfo.custom_attributes.length > 1
      //   ? userInfo.custom_attributes[2].value
      //   : "",
    });

    this.props.getEmailReminders(() => {});
  }

  componentDidUpdate() {
    const {
      firstName,
      lastName,
      isChanged,
      oldPassword,
      newPassword,
      confirmPassword,
      mobile,
    } = this.state;
    const { userInfo } = this.props;

    let mobileNo = "";
    if (
      userInfo &&
      userInfo.custom_attributes &&
      userInfo.custom_attributes.length > 0
    ) {
      userInfo.custom_attributes.map((obj) => {
        if (obj.attribute_code === "fhmobile_number") {
          mobileNo = obj.value;
        }
      });
    }

    if (
      firstName !== userInfo.firstname ||
      lastName !== userInfo.lastname ||
      mobile !== mobileNo
    ) {
      if (isChanged) {
        this.setState({ isChanged: false });
      }
    } else {
      if (!isChanged) {
        this.setState({ isChanged: true });
      }
    }
  }

  _profileUpdateCallback = (status) => {
    if (status) {
      showSingleAlert(translate("profile_updated"), translate("Ok"), () => {
        this.props.navigation.goBack();
      });
    } else {
      this.setState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
        isChanged: false,
      });
      this.newPassword.clear();
      this.oldPassword.clear();
      this.confirmPassword.clear();
    }
  };

  _callUpdateApi = () => {
    const { onProfileUpdate } = this.props;
    const { oldPassword, newPassword } = this.state;
    const { firstName, lastName, email, countryCode, mobile } = this.state;

    let userInfo = this.props.userInfo;
    userInfo.firstname = firstName;
    userInfo.lastname = lastName;
    userInfo.email = email;

    let phoneNotFound = false;
    if (userInfo.custom_attributes && userInfo.custom_attributes.length > 1) {
      userInfo.custom_attributes.map((obj) => {
        if (obj.attribute_code === "fhmobile_number") {
          obj.value = mobile;
          phoneNotFound = true;
        } else if (obj.attribute_code === "fhcountry_code") {
          obj.value = countryCode;
          phoneNotFound = true;
        }
      });
    }

    if (!phoneNotFound) {
      let arr = [
        {
          attribute_code: "fhcountry_code",
          value: countryCode,
        },
        {
          attribute_code: "fhmobile_number",
          value: mobile,
        },
      ];
      userInfo["custom_attributes"] = [...arr, ...userInfo.custom_attributes];
    }

    onProfileUpdate(
      userInfo,
      oldPassword,
      newPassword,
      this._profileUpdateCallback
    );
  };

  _didTapOnUpdate = () => {
    Keyboard.dismiss();
    if (this.state.firstName === "") {
      this.setState({
        required_firstName: false,
      });
    } else {
      this.setState({
        required_firstName: true,
      });
    }
    if (this.state.lastName === "") {
      this.setState({
        required_lastName: false,
      });
    } else {
      this.setState({
        required_lastName: true,
      });
    }
    if (this.state.mobile === "") {
      this.setState({
        required_mobile: false,
      });
    } else {
      if (
        !checkPhoneNumberValid(this.state.mobile) ||
        this.state.mobile.length < 8
      ) {
        this.setState({
          required_mobile: false,
        });
      } else {
        this.setState({
          required_mobile: true,
        });
      }
    }
    if (
      this.state.firstName !== "" &&
      this.state.lastName !== "" &&
      this.state.mobile !== "" &&
      checkPhoneNumberValid(this.state.mobile) &&
      this.state.mobile.length == 8
    ) {
      this._callUpdateApi();
    } else {
    }
  };

  _didTapOnDoneButton = () => {
    const { newDate } = this.state;

    this.setState({
      showDatePicker: false,
      newDate: newDate,
      datePicked: true,
    });
  };

  _onRemove = (item) => {
    showAlertWithCallback(
      translate("Are you sure you want to delete this reminder?"),
      translate("Yes"),
      translate("No"),
      () => {
        this.props.removeEmailReminder({ id: item.id }, (status) => {
          if (status)
            showSimpleSnackbar(translate("Reminder deleted successfully"));
        });
      },
      null
    );
  };

  _didAddNewReminder = () => {
    const {
      checked,
      reminderName,
      reminderOccasion,
      reminderDate,
      newDate,
      datePicked,
    } = this.state;

    if (checked < 0 || reminderName === "" || !datePicked) {
      showSingleAlert(translate("Please fill all fields for reminder"));
    } else {
      let params = {
        reminders: [
          {
            name: reminderName,
            occasion: reminderOccasion,
            birthdate: format(newDate, "dd-MM-yyyy"),
            gender: checked == 0 ? "male" : "female",
          },
        ],
      };

      this.props.addNewReminder(params, () => {
        this.setState({
          reminderName: "",
          reminderOccasion: "",
          checked: -1,
          datePicked: false,
        });

        this.nameRef.setValue("");
        this.occasionRef.setValue("");
      });
    }
  };

  _reminderItem = ({ item, index }) => {
    return (
      <View
        style={{
          marginHorizontal: 40,
          marginTop: 20,
          borderBottomColor: Constants.APP_SEPARATOR_COLOR,
          borderBottomWidth: 1,
        }}
      >
        {item.gender === "male" ? (
          <View style={{ flexDirection: "row" }}>
            <Image source={Images.boy} style={{ marginRight: 5 }} />
            {/* <Text style={styles.boyOrGirlText}>{translate("Boy")}</Text> */}
            <Text style={styles.boyOrGirlText}>{item.name}</Text>
            <Text style={styles.dateLabel}>{item.birth_date}</Text>
          </View>
        ) : (
          <View style={{ flexDirection: "row" }}>
            <Image source={Images.girl} style={{ marginRight: 5 }} />
            {/* <Text style={styles.boyOrGirlText}>{translate("Girl")}</Text> */}
            <Text style={styles.boyOrGirlText}>{item.name}</Text>
            <Text style={styles.dateLabel}>{item.birth_date}</Text>
          </View>
        )}
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={styles.occasionLabel}>
            {item.occasion ? translate("Occasion") + " : " + item.occasion : ""}
          </Text>
          <TouchableOpacity
            onPress={() => this._onRemove(item)}
            hitSlop={{ left: 20, top: 20, bottom: 20, right: 20 }}
            style={styles.trashContainer}
          >
            <Image source={Images.trash} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  render() {
    const { selectedLanguage, isLoading, emailReminders } = this.props;
    const { isChanged } = this.state;
    const { isRTL, userInfo } = this.props;
    let currDate = new Date();
    let maxDate = new Date(currDate.setDate(currDate.getDate()));
    return (
      <SafeAreaView style={styles.safeContainer}>
        <StatusBar
          barStyle="dark-content"
          hidden={false}
          backgroundColor={Constants.APP_WHITE_COLOR}
        />
        <NavigationHeader1
          title={translate("Edit Profile")}
          isRTL={isRTL}
          didTapOnLeftButton={() => this.props.navigation.goBack()}
        />
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ paddingHorizontal: 40, paddingVertical: 35 }}>
            <FloatingLabelInput
              label={
                <Text>
                  {translate("First Name")}
                  <Text style={{ color: Constants.APP_RED_COLOR }}>*</Text>
                </Text>
              }
              value={this.state.firstName}
              onSubmitEditing={() => this.lastName.focus()}
              onChangeText={(value) => this.setState({ firstName: value })}
              maxLength={30}
              returnKeyType={"next"}
              style={[
                styles.text_input_style,
                {
                  textAlign: isRTL ? "right" : "left",
                  borderBottomColor:
                    this.state.required_firstName == false
                      ? Constants.APP_RED_COLOR
                      : "#bcbcbc",
                },
              ]}
            />
          </View>
          <View style={{ paddingHorizontal: 40, paddingBottom: 35 }}>
            <FloatingLabelInput
              label={
                <Text>
                  {translate("Last Name")}
                  <Text style={{ color: Constants.APP_RED_COLOR }}>*</Text>
                </Text>
              }
              ref={(input) => (this.lastName = input)}
              // onSubmitEditing={() => this.lastName.blur()}
              onChangeText={(value) => this.setState({ lastName: value })}
              value={this.state.lastName}
              maxLength={30}
              returnKeyType={"next"}
              style={[
                styles.text_input_style,
                {
                  textAlign: isRTL ? "right" : "left",
                  borderBottomColor:
                    this.state.required_lastName == false
                      ? Constants.APP_RED_COLOR
                      : "#bcbcbc",
                },
              ]}
            />
          </View>
          <View style={{ paddingHorizontal: 40, paddingBottom: 35 }}>
            <FloatingLabelInput
              label={translate("Email")}
              ref={(input) => (this.emailInput = input)}
              keyboardType="email-address"
              returnKeyType={"done"}
              editable={false}
              onChangeText={(value) => this.setState({ email: value })}
              value={this.state.email}
              maxLength={30}
              returnKeyType={"next"}
              style={[
                styles.text_input_style,
                {
                  textAlign: isRTL ? "right" : "left",
                  color: "gray",
                  borderBottomColor: "#bcbcbc",
                },
              ]}
            />
          </View>

          {isRTL ? (
            <View style={styles.callingCodeContainer}>
              <View style={{ flex: 1 }}>
                <FloatingLabelInput
                  keyboardType={"phone-pad"}
                  ref={(input) => (this.mobile = input)}
                  onChangeText={(value) => this.setState({ mobile: value })}
                  label={
                    <Text>
                      {translate("Mobile Number")}
                      <Text style={{ color: Constants.APP_RED_COLOR }}>*</Text>
                    </Text>
                  }
                  value={this.state.mobile}
                  ref={(ref) => (this.phoneNoRef = ref)}
                  maxLength={8}
                  // ismobile={true}
                  returnKeyType={"next"}
                  style={[
                    styles.text_input_style,
                    {
                      // textAlign: isRTL ? "right" : "left",
                      borderBottomColor:
                        this.state.required_mobile == false
                          ? Constants.APP_RED_COLOR
                          : "#bcbcbc",
                    },
                  ]}
                />
              </View>
              <View style={{ paddingHorizontal: 15 }} />

              <View
                style={{
                  width: 50,
                  borderBottomWidth: 1,
                  borderBottomColor: "#bcbcbc",
                }}
              >
                <Text style={styles.callingCodeText}>
                  {this.state.countryCode}
                </Text>
              </View>
            </View>
          ) : (
            <View style={styles.callingCodeContainer}>
              <View
                style={{
                  width: 50,
                  borderBottomWidth: 1,
                  borderBottomColor: "#bcbcbc",
                }}
              >
                <Text style={styles.callingCodeText}>
                  {this.state.countryCode}
                </Text>
              </View>
              <View style={{ paddingHorizontal: 15 }} />
              <View style={{ flex: 1 }}>
                <FloatingLabelInput
                  keyboardType={"phone-pad"}
                  ref={(input) => (this.mobile = input)}
                  onChangeText={(value) => this.setState({ mobile: value })}
                  label={
                    <Text>
                      {translate("Mobile Number")}
                      <Text style={{ color: Constants.APP_RED_COLOR }}>*</Text>
                    </Text>
                  }
                  value={this.state.mobile}
                  ref={(ref) => (this.phoneNoRef = ref)}
                  maxLength={8}
                  ismobile={true}
                  returnKeyType={"next"}
                  style={[
                    styles.text_input_style,
                    {
                      textAlign: isRTL ? "right" : "left",
                      borderBottomColor:
                        this.state.required_mobile == false
                          ? Constants.APP_RED_COLOR
                          : "#bcbcbc",
                    },
                  ]}
                />
              </View>
            </View>
          )}

          {/* <View style={styles.buttonContainer}>
            <TouchableOpacity
              disabled={isChanged}
              style={[
                styles.buttonOutlineContainer,
                { opacity: !isChanged ? 1 : 0.7 },
              ]}
              activeOpacity={Constants.activeOpacity}
              onPress={() => {
                this._didTapOnUpdate();
              }}
            >
              <Text style={styles.updateText}>{translate("SAVE CHANGES")}</Text>
            </TouchableOpacity>
          </View> */}
          <View style={{ marginHorizontal: 20, marginBottom: 30 }}>
            <BottomButton
              // disabled={isChanged}
              onButtonClick={() => this._didTapOnUpdate()}
              buttonText={translate("SAVE CHANGES")}
            />
          </View>

          <Text style={styles.emailReminderHeader}>
            {translate("Email reminder")}
          </Text>

          <FlatList data={emailReminders} renderItem={this._reminderItem} />
          <View style={{ marginHorizontal: 40 }}>
            <View
              style={{
                marginTop: 25,
                flexDirection: "row",
              }}
            >
              {this.state.gender.map((data, key) => {
                return this.state.checked == key ? (
                  <TouchableOpacity style={{ flex: 1 }}>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <Image
                        source={Images.radioChecked3}
                        style={{ width: 17, height: 17 }}
                      />
                      {data.id == 1 ? (
                        <Image
                          source={Images.boy}
                          style={{ marginHorizontal: 10 }}
                        />
                      ) : (
                        <Image
                          source={Images.girl}
                          style={{ marginHorizontal: 10 }}
                        />
                      )}
                      <Text
                        style={{
                          fontFamily: Constants.Fonts.REGULAR,
                          color: Constants.APP_GRAY_COLOR,
                          fontSize: 18,
                          left: 5,
                          right: data.id == 1 ? 50 : 33,
                        }}
                      >
                        {data.id == 1 && translate("Boy")}
                        {data.id == 2 && translate("Girl")}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({ checked: key });
                    }}
                    style={{ flex: 1 }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <Image
                        source={Images.radioUnchecked3}
                        style={{ width: 17, height: 17 }}
                      />
                      {data.id == 1 ? (
                        <Image
                          source={Images.boy}
                          style={{ marginHorizontal: 10 }}
                        />
                      ) : (
                        <Image
                          source={Images.girl}
                          style={{ marginHorizontal: 10 }}
                        />
                      )}
                      <Text
                        style={{
                          fontFamily: Constants.Fonts.REGULAR,
                          color: Constants.APP_GRAY_COLOR,
                          fontSize: 18,
                          left: 5,
                          right: data.id == 1 ? 50 : 33,
                        }}
                      >
                        {data.id == 1 && translate("Boy")}
                        {data.id == 2 && translate("Girl")}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
            <View style={{ marginTop: -10 }}>
              <TextField
                ref={(ref) => (this.nameRef = ref)}
                containerStyle={styles.containerStyle}
                labelTextStyle={styles.inpuLabelTextStyle}
                style={{ fontFamily: constants.Fonts.REGULAR }}
                labelFontSize={16}
                fontSize={16}
                textColor={"rgb(91,91,91)"}
                labelOffset={{ x0: 0, y0: 0, x1: 0, y1: -9 }}
                activeLineWidth={1.5}
                lineWidth={1}
                tintColor={"rgb(142, 142, 142)"}
                baseColor={"rgb(193, 193, 193)"}
                autoCorrect={false}
                enablesReturnKeyAutomatically={true}
                onFocus={this.onFocus}
                onChangeText={(txt) => this.setState({ reminderName: txt })}
                returnKeyType="next"
                maxLength={30}
                label={translate("Name")}
                // error={errors.name}
                blurOnSubmit={false}
                formatText={this.formatText}
              />
            </View>

            <View style={{ flexDirection: "row" }}>
              <TextField
                ref={(ref) => (this.occasionRef = ref)}
                containerStyle={styles.containerStyle}
                labelTextStyle={styles.inpuLabelTextStyle}
                style={{
                  fontFamily: constants.Fonts.REGULAR,
                }}
                labelFontSize={16}
                fontSize={16}
                textColor={"rgb(91,91,91)"}
                labelOffset={{ x0: 0, y0: 0, x1: 0, y1: -9 }}
                activeLineWidth={1.5}
                lineWidth={1}
                tintColor={"rgb(142, 142, 142)"}
                baseColor={"rgb(193, 193, 193)"}
                autoCorrect={false}
                enablesReturnKeyAutomatically={true}
                onFocus={this.onFocus}
                onChangeText={(txt) => this.setState({ reminderOccasion: txt })}
                onSubmitEditing={this.onSubmitOccasion}
                returnKeyType="next"
                label={translate("Occasion")}
                maxLength={30}
                blurOnSubmit={false}
                formatText={this.formatSpacing}
              />
              <View style={{ paddingHorizontal: 20 }} />
              <TextField
                ref={this.dateRef}
                editable={false}
                defaultValue={
                  this.state.datePicked
                    ? format(this.state.newDate, "dd-MM-yyyy")
                    : null
                }
                containerStyle={styles.containerStyle}
                labelTextStyle={styles.inpuLabelTextStyle}
                style={{
                  fontFamily: constants.Fonts.REGULAR,
                  color: "rgb(91, 91, 91)",
                }}
                labelFontSize={16}
                fontSize={16}
                textColor={"rgb(91, 91, 91)"}
                labelOffset={{ x0: 0, y0: 0, x1: 0, y1: -9 }}
                activeLineWidth={1.5}
                lineWidth={1}
                tintColor={"rgb(142, 142, 142)"}
                baseColor={"rgb(193, 193, 193)"}
                autoCorrect={false}
                enablesReturnKeyAutomatically={true}
                onFocus={this.onFocus}
                onChangeText={this.onChangeText}
                onSubmitEditing={this.onSubmitDate}
                returnKeyType="next"
                label={translate("Date")}
                // error={errors.date}
                blurOnSubmit={false}
              />
              <TouchableOpacity
                onPress={() => {
                  this.setState({ showDatePicker: true });
                }}
                style={styles.pickerButton}
              />
            </View>

            <View style={{ marginHorizontal: 20, marginBottom: 30 }}>
              <BottomButton
                // disabled={isChanged}
                onButtonClick={this._didAddNewReminder}
                buttonText={"ADD REMINDER"}
              />
            </View>
          </View>
        </ScrollView>
        <Modal
          isVisible={this.state.showDatePicker}
          // onBackdropPress={() => this.setState({ showDatePicker: false })}
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
                  this.setState({ showDatePicker: false, datePicked: false });
                }}
                hitSlop={{ left: 20, top: 10, right: 10, bottom: 30 }}
                style={{}}
              >
                <Text style={styles.cancelDoneButton}>{"Cancel"}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={this._didTapOnDoneButton}
                hitSlop={{ left: 20, top: 10, right: 10, bottom: 30 }}
              >
                <Text style={styles.cancelDoneButton}>{"Done"}</Text>
              </TouchableOpacity>
            </View>
            <DatePicker
              mode="date"
              maximumDate={maxDate}
              date={this.state.newDate}
              onDateChange={(date) =>
                this.setState({ newDate: date, datePicked: true })
              }
            />
          </View>
        </Modal>
        {isLoading && <HudView />}
      </SafeAreaView>
    );
  }
}

export default ProfileDetailView;

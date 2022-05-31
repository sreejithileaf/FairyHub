/**
 * Created by Tinoy for iLeaf Solutions Pvt.Ltd
 * on February 19, 2020
 * RegistrationScreen - RegistrationScreen View
 */

import React, { Component } from "react";
import {
  View,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  TextInput,
  Text,
  Keyboard,
  ScrollView,
  Image,
  FlatList,
} from "react-native";
import styles from "./styles";
import Modal from "react-native-modal";
import { format, addHours } from "date-fns";
import Constants from "../../config/constants";
import DatePicker from "react-native-date-picker";
import { Calendar } from "react-native-calendars";
import LinearGradient from "react-native-linear-gradient";
import { TextField } from "react-native-material-textfield";
import CountryPicker from "react-native-country-picker-modal";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import FloatingLabelInput from "../../components/FloatingLabelInput";
import { translate } from "../../config/languageSwitching/index";
import {
  isEmpty,
  checkEMailValidation,
  checkPasswordValid,
  normalizedWidth,
  checkPhoneNumberValid,
  showAlertWithCallback,
  addEventTracking,
} from "../../config/common";
import Images from "../../config/images";
import HudView from "../../components/hudView";
import RNFetchBlob from "rn-fetch-blob";
import { navigateToHomeScreen } from "../../actions/navigationActions";
import { showSingleAlert } from "../../config/common";
import LoginScreen from "../LoginScreen/LoginScreen";
import BottomButton from "../../components/BottomButton";
import moment from "moment";
import ImageLoader from "react-native-image-progress";
import analytics from "@react-native-firebase/analytics";

class RegistrationScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPwd: "",
      nowDate: new Date(),
      newDate: new Date(),
      datePicked: false,
      showDatePicker: false,
      showClose: true,
      secureTextEntry: true,
      cpSecureTextEntry: true,
      isSignInViewShow: false,
      isShowCountryPicker: false,
      gender: [{ id: 1 }, { id: 2 }],
      checked: -1,
      userInfo: [],
      callingCode: "+965",
      emailReminderArray: [],
    };

    this.onFocus = this.onFocus.bind(this);
    this.onChangeText = this.onChangeText.bind(this);
    this.onSubmitEmail = this.onSubmitEmail.bind(this);
    this.onSubmitMobile = this.onSubmitMobile.bind(this);
    this.onSubmitName = this.onSubmitName.bind(this);
    this.onSubmitOccasion = this.onSubmitOccasion.bind(this);
    this.onSubmitDate = this.onSubmitDate.bind(this);
    this.onSubmitPassword = this.onSubmitPassword.bind(this);
    this.onSubmitLastName = this.onSubmitLastName.bind(this);
    this.onSubmitFirstName = this.onSubmitFirstName.bind(this);
    this.onSubmitConfirmPassword = this.onSubmitPassword.bind(this);

    this.emailRef = this.updateRef.bind(this, "email");
    this.countryCodeRef = this.updateRef.bind(this, "countryCode");
    this.mobileRef = this.updateRef.bind(this, "mobile");
    this.passwordRef = this.updateRef.bind(this, "password");
    this.lastnameRef = this.updateRef.bind(this, "lastname");
    this.nameRef = this.updateRef.bind(this, "name");
    this.occasionRef = this.updateRef.bind(this, "occasion");
    this.dateRef = this.updateRef.bind(this, "date");
    this.firstnameRef = this.updateRef.bind(this, "firstname");
    this.confirmPasswordRef = this.updateRef.bind(this, "confirmPassword");
  }

  componentDidMount() {
    this.keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      this._keyboardDidShow
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      this._keyboardDidHide
    );

    setTimeout(() => {
      this.firstname.focus();
    }, 1000);
  }

  componentWillUnmount() {
    /**
     * cleans up event listener
     */
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  updateRef(name, ref) {
    this[name] = ref;
  }

  onFocus() {
    let { errors = {} } = this.state;
    for (let name in errors) {
      let ref = this[name];
      if (ref && ref.isFocused()) {
        delete errors[name];
      }
    }
    this.setState({ errors });
  }

  onChangeText(text) {
    [
      "email",
      "password",
      "confirmpassword",
      "lastname",
      "firstname",
      "mobile",
      "name",
      "occasion",
      "countryCode",
      "date",
    ]
      .map((name) => ({ name, ref: this[name] }))
      .forEach(({ name, ref }) => {
        if (ref && ref.isFocused()) {
          this.setState({ [name]: text });
        }
      });
  }

  formatText = (text) => {
    return text.replace(/[^a-zA-Z]+/g, "");
  };

  formatSpacing = (text) => {
    return text.replace(/\s/g, "");
  };

  onSubmitFirstName() {
    this.lastname.focus();
  }

  onSubmitLastName() {
    this.email.focus();
  }

  onSubmitEmail() {
    this.mobile.focus();
  }

  onSubmitMobile() {
    this.password.focus();
  }

  onSubmitPassword() {
    this.confirmPassword.focus();
  }

  onSubmitCountryCode() {
    this.countryCode.blur();
  }

  onSubmitConfirmPassword() {
    this.confirmPassword.blur();
  }

  onSubmitName() {
    this.occasion.focus();
  }

  onSubmitOccasion() {
    this.occasion.blur();
  }

  onSubmitDate() {
    this.date.blur();
  }

  renderPlusAccessory() {
    return (
      <Text
        style={{
          fontFamily: constants.Fonts.REGULAR,
          fontSize: 16,
          color: constants.APP_THEME_COLOR,
          marginBottom: 3,
        }}
      >
        +
      </Text>
    );
  }

  _keyboardDidShow() {}

  _keyboardDidHide() {}

  _onSubmit() {
    const { onRegisterUser } = this.props;
    const { emailReminderArray } = this.state;
    let errors = {};
    let isValid = true;
    if (this.state.checked === -1) {
      this.setState({
        checked: null,
      });
    } else {
      this.setState({
        checked: this.state.checked,
      });
    }
    let isReminderValid = true;
    [
      "firstname",
      "lastname",
      "email",
      "countryCode",
      "password",
      "confirmPassword",
      "mobile",
      "name",
      "occasion",
      "date",
    ].forEach((name) => {
      let value = this[name].value();
      if ("firstname" === name && !value) {
        errors[name] = translate("First name required");
        isValid = false;
      }
      if ("lastname" === name && !value) {
        errors[name] = translate("Last name required");
        isValid = false;
      }
      if ("email" === name) {
        if (!value) {
          errors[name] = translate("Email required");
          isValid = false;
        } else if (!checkEMailValidation(value)) {
          errors[name] = translate("Invalid Email");
          isValid = false;
        }
      }
      if ("countryCode" === name && !value) {
        errors[name] = translate("Country Code required");
        isValid = false;
      }
      if ("mobile" === name) {
        if (!value) {
          errors[name] = translate("Mobile number required");
          isValid = false;
        } else if (!checkPhoneNumberValid(value)) {
          errors[name] = translate("Invalid number");
          isValid = false;
        }
      }
      if ("password" === name && !value) {
        errors[name] = translate("Password required");
        isValid = false;
      }
      if ("confirmPassword" === name && !value) {
        errors[name] = translate("Password required");
        isValid = false;
      }

      // if ("name" === name && !value) {
      //   errors[name] = translate("Name required");
      //   isValid = false;
      // }
      // if ("occasion" === name && !value) {
      //   errors[name] = translate("Occasion required");
      //   isValid = false;
      // }
      // if ("date" === name && !value) {
      //   errors[name] = translate("Date required");
      //   isValid = false;
      // }
    });

    if (this["password"].value() !== this["confirmPassword"].value()) {
      showSingleAlert(
        translate(
          "Password mismatch, Please check your password and confirm password"
        )
      );
      return;
    }

    if (
      // emailReminderArray.length == 0 &&
      (this.state.checked !== null && this.state.checked > -1) ||
      this["occasion"].value() !== "" ||
      this["date"].value() !== "" ||
      this["name"].value() !== ""
    ) {
      showSingleAlert(translate("Please tap on 'Add' button to add reminder"));
      return;
    }

    // if (
    // this.state.checked !== null &&
    //   this.state.checked > -1 &&
    //   (this["occasion"].value() === "" ||
    //     this["date"].value() === "" ||
    //     this["name"].value() === "");
    // ) {
    //   isReminderValid = false;
    // }
    // if (
    //   this["occasion"].value() !== "" &&
    //   (this.state.checked === null ||
    //     this["date"].value() === "" ||
    //     this["name"].value() === "")
    // ) {
    //   isReminderValid = false;
    // }
    // if (
    //   this["date"].value() !== "" &&
    //   (this.state.checked === null ||
    //     this["occasion"].value() === "" ||
    //     this["name"].value() === "")
    // ) {
    //   isReminderValid = false;
    // }
    // if (
    //   this["name"].value() !== "" &&
    //   (this.state.checked === null ||
    //     this["occasion"].value() === "" ||
    //     this["date"].value() === "")
    // ) {
    //   isReminderValid = false;
    // }

    // if (!isReminderValid) {
    //   showSingleAlert(translate("Please fill all fields for reminder"));
    //   return;
    // }

    this.setState({ errors });
    if (isValid) {
      if (checkPasswordValid(this["password"].value())) {
        let userInfo = {
          firstName: this["firstname"].value(),
          lastName: this["lastname"].value(),
          email: this["email"].value(),
          password: this["password"].value(),
          countryCode: this["countryCode"].value(),
          mobile: this["mobile"].value(),
          emailReminderArray: emailReminderArray,
        };
        onRegisterUser(userInfo, this.props.isRTL, this._registerCallback);
      } else {
        showSingleAlert(translate("password_invalid"), translate("Ok"), null);
      }
    } else {
    }
  }

  _registerCallback = (status) => {
    const { isSignInViewShow } = this.state;
    if (status) {
      addEventTracking("okfk7b");

      analytics()
        .logSignUp({ method: "" })
        .then((rsp) => {
          console.log("FIREBASE ANALYTICS SIGNUP SUCCESS-----", rsp);
        })
        .catch((error) => {
          console.log("ERROR@@@@", error);
        });

      showSingleAlert(
        translate("registration_complete_success"),
        translate("Ok"),
        () => {
          this.setState({
            isSignInViewShow: true,
            email: this["email"].value(),
          });
        }
      );
    }
  };

  onAccessoryPress(ref) {
    if (ref === "pwd_icon") {
      this.setState(({ secureTextEntry }) => ({
        secureTextEntry: !secureTextEntry,
      }));
    } else {
      this.setState(({ cpSecureTextEntry }) => ({
        cpSecureTextEntry: !cpSecureTextEntry,
      }));
    }
  }

  renderPasswordAccessory(ref) {
    let { secureTextEntry, cpSecureTextEntry } = this.state;
    let iconName;
    if (ref === "pwd_icon") {
      iconName = secureTextEntry ? "visibility-off" : "visibility";
    } else {
      iconName = cpSecureTextEntry ? "visibility-off" : "visibility";
    }
    return (
      <MaterialIcon
        style={{
          paddingStart: 10,
          paddingEnd: 6,
          paddingBottom: 2,
          paddingTop: 16,
        }}
        size={22}
        name={iconName}
        color={TextField.defaultProps.baseColor}
        onPress={this.onAccessoryPress.bind(this, ref)}
        suppressHighlighting={true}
      />
    );
  }

  _didTapOnDoneButton = () => {
    const { newDate } = this.state;

    this.setState({
      showDatePicker: false,
      newDate: newDate,
      datePicked: true,
    });
  };

  _didTapOnAddSmall = () => {
    let emailReminderArray = this.state.emailReminderArray;
    let isReminderValid = true;

    if (
      this["date"].value() === "" &&
      this["name"].value() === "" &&
      // this["occasion"].value() === "" &&
      this.state.checked < 0
    ) {
      isReminderValid = false;
    }
    if (
      this.state.checked > -1 &&
      // this["occasion"].value() === "" ||
      (this["date"].value() === "" || this["name"].value() === "")
    ) {
      isReminderValid = false;
    }
    // if (
    //   this["occasion"].value() !== "" &&
    //   (this.state.checked < 0 ||
    //     this["date"].value() === "" ||
    //     this["name"].value() === "")
    // ) {
    //   isReminderValid = false;
    // }
    if (
      this["date"].value() !== "" &&
      (this.state.checked < 0 ||
        // this["occasion"].value() === "" ||
        this["name"].value() === "")
    ) {
      isReminderValid = false;
    }
    if (
      this["name"].value() !== "" &&
      (this.state.checked < 0 ||
        // this["occasion"].value() === "" ||
        this["date"].value() === "")
    ) {
      isReminderValid = false;
    }

    if (!isReminderValid) {
      showSingleAlert(translate("Please fill all fields for reminder"));
      return;
    }

    let dict = {
      name: this["name"].value(),
      occasion: this["occasion"].value(),
      birthdate: this["date"].value(),
      gender: this.state.checked == 0 ? "male" : "female",
    };

    emailReminderArray.push(dict);
    this.setState({ emailReminderArray }, () => {
      this["name"].setValue("");
      this["occasion"].setValue("");
      // this["date"].setValue("");
      this.setState({
        name: "",
        occasion: "",
        checked: -1,
        datePicked: false,
        newDate: new Date(),
      });
    });
  };

  _reminderItem = ({ item, index }) => {
    return (
      <View
        style={{
          marginHorizontal: 0,
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
            <Text style={styles.dateLabel}>{item.birthdate}</Text>
          </View>
        ) : (
          <View style={{ flexDirection: "row" }}>
            <Image source={Images.girl} style={{ marginRight: 5 }} />
            {/* <Text style={styles.boyOrGirlText}>{translate("Girl")}</Text> */}
            <Text style={styles.boyOrGirlText}>{item.name}</Text>
            <Text style={styles.dateLabel}>{item.birthdate}</Text>
          </View>
        )}
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={styles.occasionLabel}>
            {item.occasion ? translate("Occasion") + " : " + item.occasion : ""}
          </Text>
          <TouchableOpacity
            onPress={() => this._onRemove(item, index)}
            hitSlop={{ left: 20, top: 20, bottom: 20, right: 20 }}
            style={styles.trashContainer}
          >
            <Image source={Images.trash} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  _onRemove = (item, index) => {
    showAlertWithCallback(
      translate("Are you sure you want to delete this reminder?"),
      translate("Yes"),
      translate("No"),
      () => {
        let emailReminderArray = this.state.emailReminderArray;
        emailReminderArray.splice(index, 1);
        this.setState({ emailReminderArray });
      },
      null
    );
  };

  render() {
    const { isLoading, showLogin, appLogoUrl, isRTL } = this.props;
    const {
      secureTextEntry,
      cpSecureTextEntry,
      isSignInViewShow,
      country,
      isShowCountryPicker,
      countryName,
      callingCode,
      errors = {},
      emailReminderArray,
    } = this.state;

    let currDate = new Date();
    let maxDate = new Date(currDate.setDate(currDate.getDate()));
    let todayDate = new Date();

    let dirs = RNFetchBlob.fs.dirs;
    let path = "";
    if (Constants.IS_ANDROID) {
      path = "file:///" + dirs.DocumentDir + "/appLogo.png";
    } else {
      path = dirs.DocumentDir + "/appLogo.png";
    }

    return (
      <SafeAreaView style={styles.safeContainer}>
        <StatusBar backgroundColor={Constants.APP_THEME_DARK_GRAY} />
        <ScrollView
          scrollEventThrottle={16}
          // onScroll={event => {
          //   if (event.nativeEvent.contentOffset.y > 100) {
          //     this.setState({ showClose: false });
          //   } else {
          //     this.setState({ showClose: true });
          //   }
          // }}
        >
          <View style={styles.container}>
            {/* <Text style={styles.welcomText}>{translate("Hello welcome")}</Text> */}
            <ScrollView showsVerticalScrollIndicator={false}>
              {/* <Image
                source={{ uri: appLogoUrl }}
                resizeMode="contain"
                style={styles.logoStyle}
              /> */}
              <ImageLoader
                source={{ uri: path }}
                resizeMode={"contain"}
                defaultSource={Images.logo}
                style={styles.logoStyle}
              />
              <View style={styles.container2}>
                <Text style={styles.heading}>{translate("SIGN UP")}</Text>
                <View style={{ flexDirection: "row" }}>
                  <TextField
                    ref={this.firstnameRef}
                    containerStyle={{
                      marginTop: 8,
                      flex: 1,
                      paddingRight: 20,
                      zIndex: 1000,
                    }}
                    labelTextStyle={styles.inpuLabelTextStyle}
                    style={{ fontFamily: constants.Fonts.REGULAR }}
                    labelFontSize={12}
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
                    onChangeText={this.onChangeText}
                    onSubmitEditing={this.onSubmitFirstName}
                    returnKeyType="next"
                    maxLength={30}
                    label={
                      <Text style={styles.floatLabel}>
                        {translate("First name")}
                        <Text style={{ color: Constants.APP_RED_COLOR }}>
                          *
                        </Text>
                      </Text>
                    }
                    error={errors.firstname}
                    blurOnSubmit={false}
                    // formatText={this.formatText}
                  />
                  {/* <View style={{ paddingHorizontal: 20 }} /> */}
                  <TextField
                    ref={this.lastnameRef}
                    containerStyle={{
                      marginTop: 8,
                      flex: 1,
                      paddingLeft: 20,
                    }}
                    labelTextStyle={styles.inpuLabelTextStyle}
                    style={{ fontFamily: constants.Fonts.REGULAR }}
                    labelFontSize={12}
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
                    onChangeText={this.onChangeText}
                    onSubmitEditing={this.onSubmitLastName}
                    returnKeyType="next"
                    maxLength={30}
                    label={
                      <Text style={styles.floatLabel}>
                        {translate("Last name")}
                        <Text style={{ color: Constants.APP_RED_COLOR }}>
                          *
                        </Text>
                      </Text>
                    }
                    error={errors.lastname}
                    blurOnSubmit={false}
                    // formatText={this.formatText}
                  />
                </View>
                <TextField
                  ref={this.emailRef}
                  containerStyle={styles.containerStyle}
                  labelTextStyle={styles.inpuLabelTextStyle}
                  labelFontSize={12}
                  fontSize={16}
                  textColor={"rgb(91,91,91)"}
                  labelOffset={{ x0: 0, y0: 0, x1: 0, y1: -9 }}
                  activeLineWidth={1.5}
                  lineWidth={1}
                  tintColor={"rgb(142, 142, 142)"}
                  baseColor={"rgb(193, 193, 193)"}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  enablesReturnKeyAutomatically={true}
                  onFocus={this.onFocus}
                  onChangeText={this.onChangeText}
                  onSubmitEditing={this.onSubmitEmail}
                  returnKeyType="next"
                  label={
                    <Text style={styles.floatLabel}>
                      {translate("Email")}
                      <Text style={{ color: Constants.APP_RED_COLOR }}>*</Text>
                    </Text>
                  }
                  error={errors.email}
                  blurOnSubmit={false}
                  formatText={this.formatSpacing}
                />

                {isRTL ? (
                  <View style={{ flexDirection: "row" }}>
                    <TextField
                      ref={this.mobileRef}
                      containerStyle={{ marginTop: 2, flex: 1 }}
                      labelTextStyle={styles.inpuLabelTextStyle}
                      labelFontSize={12}
                      fontSize={16}
                      style={{
                        fontFamily: constants.Fonts.REGULAR,
                        textAlign: "left",
                      }}
                      textColor={"rgb(91,91,91)"}
                      labelOffset={{
                        x0: 0,
                        y0: 0,
                        // x1: this.props.isRTL ? 85 : -85,
                        // y1: -10,
                      }}
                      activeLineWidth={1.5}
                      lineWidth={1}
                      tintColor={"rgb(142, 142, 142)"}
                      baseColor={"rgb(193, 193, 193)"}
                      keyboardType="phone-pad"
                      autoCapitalize="none"
                      maxLength={8}
                      autoCorrect={false}
                      enablesReturnKeyAutomatically={true}
                      onFocus={this.onFocus}
                      onChangeText={this.onChangeText}
                      onSubmitEditing={this.onSubmitMobile}
                      returnKeyType="next"
                      label={
                        <Text style={styles.floatLabel}>
                          {translate("Mobile")}
                          <Text style={{ color: Constants.APP_RED_COLOR }}>
                            *
                          </Text>
                        </Text>
                      }
                      error={errors.mobile}
                      blurOnSubmit={false}
                      formatText={this.formatSpacing}
                    />
                    <View style={{ paddingRight: 30 }} />
                    <TextField
                      ref={this.countryCodeRef}
                      defaultValue={callingCode}
                      editable={false}
                      containerStyle={{ marginTop: 2, width: 55 }}
                      fontFamily={constants.Fonts.REGULAR}
                      labelTextStyle={styles.inpuLabelTextStyle}
                      labelFontSize={12}
                      fontSize={16}
                      style={{
                        color: constants.APP_THEME_COLOR,
                        fontFamily: constants.Fonts.REGULAR,
                        textAlign: "left",
                      }}
                      labelOffset={{ x0: 0, y0: 0, x1: 0, y1: -9 }}
                      activeLineWidth={1.5}
                      lineWidth={1}
                      tintColor={"rgb(142, 142, 142)"}
                      baseColor={"rgb(193, 193, 193)"}
                      autoCapitalize="none"
                      autoCorrect={false}
                      enablesReturnKeyAutomatically={true}
                      onFocus={this.onFocus}
                      onSubmitEditing={this.onSubmitCountryCode}
                      returnKeyType="done"
                      // renderLeftAccessory={this.renderPlusAccessory.bind(this)}
                      error={errors.countryCode}
                    />
                  </View>
                ) : (
                  <View style={{ flexDirection: "row" }}>
                    <TextField
                      ref={this.countryCodeRef}
                      defaultValue={callingCode}
                      editable={false}
                      containerStyle={{ marginTop: 2, width: 55 }}
                      fontFamily={constants.Fonts.REGULAR}
                      style={{ fontFamily: constants.Fonts.REGULAR }}
                      labelTextStyle={styles.inpuLabelTextStyle}
                      labelFontSize={12}
                      fontSize={16}
                      style={{
                        color: constants.APP_THEME_COLOR,
                        fontFamily: constants.Fonts.REGULAR,
                      }}
                      labelOffset={{ x0: 0, y0: 0, x1: 0, y1: -9 }}
                      activeLineWidth={1.5}
                      lineWidth={1}
                      tintColor={"rgb(142, 142, 142)"}
                      baseColor={"rgb(193, 193, 193)"}
                      autoCapitalize="none"
                      autoCorrect={false}
                      enablesReturnKeyAutomatically={true}
                      onFocus={this.onFocus}
                      onSubmitEditing={this.onSubmitCountryCode}
                      returnKeyType="done"
                      // renderLeftAccessory={this.renderPlusAccessory.bind(this)}
                      error={errors.countryCode}
                    />
                    <View style={{ paddingRight: 30 }} />
                    <TextField
                      ref={this.mobileRef}
                      containerStyle={{ marginTop: 2, flex: 1 }}
                      labelTextStyle={styles.inpuLabelTextStyle}
                      labelFontSize={12}
                      fontSize={16}
                      style={{ fontFamily: constants.Fonts.REGULAR }}
                      textColor={"rgb(91,91,91)"}
                      labelOffset={{
                        x0: 0,
                        y0: 0,
                        // x1: this.props.isRTL ? 85 : -85,
                        // y1: -10,
                      }}
                      activeLineWidth={1.5}
                      lineWidth={1}
                      tintColor={"rgb(142, 142, 142)"}
                      baseColor={"rgb(193, 193, 193)"}
                      keyboardType="phone-pad"
                      autoCapitalize="none"
                      maxLength={8}
                      autoCorrect={false}
                      enablesReturnKeyAutomatically={true}
                      onFocus={this.onFocus}
                      onChangeText={this.onChangeText}
                      onSubmitEditing={this.onSubmitMobile}
                      returnKeyType="next"
                      label={
                        <Text style={styles.floatLabel}>
                          {translate("Mobile")}
                          <Text style={{ color: Constants.APP_RED_COLOR }}>
                            *
                          </Text>
                        </Text>
                      }
                      error={errors.mobile}
                      blurOnSubmit={false}
                      formatText={this.formatSpacing}
                    />
                    {/* <TouchableOpacity
                    onPress={() => {
                      // this.setState({ isShowCountryPicker: true });
                    }}
                    style={styles.countryCodeContainer}
                  >
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Text style={styles.countryCodeText}>+{callingCode}</Text>
                    </View>
                  </TouchableOpacity> */}
                  </View>
                )}
                <TextField
                  ref={this.passwordRef}
                  secureTextEntry={secureTextEntry}
                  containerStyle={styles.containerStyle}
                  labelTextStyle={styles.inpuLabelTextStyle}
                  labelFontSize={12}
                  fontSize={16}
                  textColor={"rgb(91,91,91)"}
                  labelOffset={{ x0: 0, y0: 0, x1: 0, y1: -9 }}
                  activeLineWidth={1.5}
                  lineWidth={1}
                  tintColor={"rgb(142, 142, 142)"}
                  baseColor={"rgb(193, 193, 193)"}
                  autoCapitalize="none"
                  autoCorrect={false}
                  enablesReturnKeyAutomatically={true}
                  onFocus={this.onFocus}
                  onChangeText={this.onChangeText}
                  onSubmitEditing={this.onSubmitPassword}
                  renderRightAccessory={this.renderPasswordAccessory.bind(
                    this,
                    "pwd_icon"
                  )}
                  returnKeyType="next"
                  label={
                    <Text style={styles.floatLabel}>
                      {translate("Password")}
                      <Text style={{ color: Constants.APP_RED_COLOR }}>*</Text>
                    </Text>
                  }
                  error={errors.password}
                  // formatText={this.formatSpacing}
                />
                <TextField
                  ref={this.confirmPasswordRef}
                  secureTextEntry={cpSecureTextEntry}
                  containerStyle={styles.containerStyle}
                  labelTextStyle={styles.inpuLabelTextStyle}
                  labelFontSize={12}
                  fontSize={16}
                  textColor={"rgb(91,91,91)"}
                  labelOffset={{ x0: 0, y0: 0, x1: 0, y1: -9 }}
                  activeLineWidth={1.5}
                  lineWidth={1}
                  tintColor={"rgb(142, 142, 142)"}
                  baseColor={"rgb(193, 193, 193)"}
                  autoCapitalize="none"
                  autoCorrect={false}
                  enablesReturnKeyAutomatically={true}
                  onFocus={this.onFocus}
                  onChangeText={this.onChangeText}
                  onSubmitEditing={this.onSubmitConfirmPassword}
                  renderRightAccessory={this.renderPasswordAccessory.bind(
                    this,
                    "cpass_icon"
                  )}
                  returnKeyType="done"
                  label={
                    <Text style={styles.floatLabel}>
                      {translate("Confirm Password")}
                      <Text style={{ color: Constants.APP_RED_COLOR }}>*</Text>
                    </Text>
                  }
                  error={errors.confirmPassword}
                  // formatText={this.formatSpacing}
                />
                <View style={{ marginTop: 30 }}>
                  <Text
                    style={{
                      fontFamily: Constants.Fonts.REGULAR,
                      fontSize: 18,
                      lineHeight: 28,
                      textAlign: "left",
                    }}
                  >
                    {translate("Email reminder")}
                  </Text>
                </View>

                {this.state.emailReminderArray.length > 0 && (
                  <FlatList
                    data={this.state.emailReminderArray}
                    renderItem={this._reminderItem}
                    extraData={this.state}
                  />
                )}

                <View style={{ marginTop: 25, flexDirection: "row" }}>
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
                {/* {this.state.checked == null && (
                  <Text style={styles.messageErrorText}> */}
                {/* {translate("Gender required")} */}
                {/* </Text>
                )} */}
                <View style={{ marginTop: -10 }}>
                  <TextField
                    ref={this.nameRef}
                    containerStyle={styles.containerStyle}
                    labelTextStyle={styles.inpuLabelTextStyle}
                    style={{ fontFamily: constants.Fonts.REGULAR }}
                    labelFontSize={12}
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
                    onChangeText={this.onChangeText}
                    onSubmitEditing={this.onSubmitName}
                    returnKeyType="next"
                    maxLength={30}
                    label={translate("Name")}
                    error={errors.name}
                    blurOnSubmit={false}
                    // formatText={this.formatText}
                  />
                </View>
                <View style={{ flexDirection: "row" }}>
                  <TextField
                    ref={this.occasionRef}
                    containerStyle={styles.containerStyle}
                    labelTextStyle={styles.inpuLabelTextStyle}
                    style={{ fontFamily: constants.Fonts.REGULAR }}
                    labelFontSize={12}
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
                    onChangeText={this.onChangeText}
                    onSubmitEditing={this.onSubmitOccasion}
                    returnKeyType="next"
                    label={translate("Occasion")}
                    maxLength={30}
                    error={errors.occasion}
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
                    labelFontSize={12}
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
                    error={errors.date}
                    blurOnSubmit={false}
                  />
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({ showDatePicker: true });
                    }}
                    style={styles.pickerButton}
                  />
                </View>
                <View style={{ marginVertical: 20, marginBottom: 30 }}>
                  <TouchableOpacity
                    style={styles.addButtonStyle}
                    activeOpacity={0.7}
                    onPress={() => {
                      this._didTapOnAddSmall();
                    }}
                  >
                    <Text style={styles.addText}>{translate("Add Small")}</Text>
                  </TouchableOpacity>
                </View>
                <View style={{ paddingHorizontal: 15 }}>
                  <BottomButton
                    onButtonClick={() => this._onSubmit()}
                    buttonText={translate("SIGN UP")}
                  />
                </View>
                {/* <View style={{ marginHorizontal: -30 }}>
                  <BottomButton
                    onButtonClick={() => this._onSubmit()}
                    buttonText={translate("SIGN UP")}
                  />
                </View> */}

                {showLogin && (
                  <View style={styles.footerContainer}>
                    <Text style={styles.forgotPassword}>
                      {translate("AlreadyHaveAccount")}
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        // this.props.navigation.navigate('RegistrationScreen')

                        const isFromLogin = this.props.isFromLogin;

                        if (isFromLogin) {
                          this.props.didTapOnSign();
                        } else {
                          this.setState({ isSignInViewShow: true });
                        }
                      }}
                    >
                      <Text style={styles.signup}>{translate("Signin")}</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
              <CountryPicker
                {...{
                  withFilter: true,
                  withCountryNameButton: true,
                  withAlphaFilter: true,
                  onSelect: (data) => {
                    this.setState({
                      countryName: data.name,
                      countryCode: data.cca2,
                      callingCode: data.callingCode,
                    });
                    // this.validateInput(data.name, "country");
                  },
                  placeholder: "",
                  onClose: () => {
                    this.setState({ isShowCountryPicker: false });
                  },
                }}
                style={{ width: 0, height: 0 }}
                visible={isShowCountryPicker}
              />
            </ScrollView>
          </View>
        </ScrollView>
        {this.state.showClose && (
          <TouchableOpacity
            onPress={() => {
              this.props.didTapOnclose();
            }}
            style={styles.closeButtonView}
          >
            <Image
              source={Images.close}
              style={{ width: 18, height: 18, tintColor: "rgb(0,0,0)" }}
            />
          </TouchableOpacity>
        )}

        <Modal
          onBackButtonPress={() => this.setState({ isSignInViewShow: false })}
          isVisible={isSignInViewShow}
          style={{ margin: 0 }}
        >
          <View style={{ flex: 1 }}>
            <LoginScreen
              didTapOnclose={() => this.props.didTapOnclose()}
              showLogin={true}
              email={this.state.email}
              onLoginUser={this.props.onLoginUser}
              isLoading={isLoading}
            />
          </View>
        </Modal>

        {isLoading && <HudView />}
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
              // minimumDate={this.state.nowDate}
              maximumDate={maxDate}
              date={this.state.newDate}
              onDateChange={(date) =>
                this.setState({ newDate: date, datePicked: true })
              }
            />
          </View>
        </Modal>
      </SafeAreaView>
    );
  }
}

export default RegistrationScreen;

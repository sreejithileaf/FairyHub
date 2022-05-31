/**
 * Created by iLeaf Solutions Pvt.Ltd
 * on February 19, 2020
 * AddressListView - Address List View will show the Addresses of user.
 */

import {
  View,
  Text,
  Image,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Styles from "./style";
import Images from "../../config/images";
import constants from "../../config/constants";
import Countries from "../../lib/countires.js";
import HudView from "../../components/hudView";
import React, { Component, memo } from "react";
import {
  isEmpty,
  checkEMailValidation,
  checkPasswordValid,
  normalizedWidth,
} from "../../config/common";
import { showSingleAlert } from "../../config/common";
import { TextField } from "react-native-material-textfield";
import { translate } from "../../config/languageSwitching/index";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import EmptyDataPlaceholder from "../../components/emptyDataPlaceholder";
import NavigationHeader1 from "../../components/NavigationHeaders/NavigationHeader1";
import BottomButton from "../../components/BottomButton";

class ChangePasswordScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      secureTextEntry: true,
      password: "",
      oldpwd: "",
      confirmPwd: "",
    };
    this.onFocus = this.onFocus.bind(this);
    this.onChangeText = this.onChangeText.bind(this);
    this.onSubmitPassword = this.onSubmitPassword.bind(this);
    this.onSubmitOldPassword = this.onSubmitOldPassword.bind(this);
    this.onSubmitConfirmPassword = this.onSubmitPassword.bind(this);

    this.passwordRef = this.updateRef.bind(this, "password");
    this.oldpasswordRef = this.updateRef.bind(this, "oldpassword");
    this.confirmPasswordRef = this.updateRef.bind(this, "confirmPassword");
  }

  componentDidMount() {
    const { loginResponse } = this.props;
    this.setState({
      oldpwd: loginResponse.password,
    });
  }

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
    ["password", "oldpassword", "confirmPassword"]
      .map((name) => ({ name, ref: this[name] }))
      .forEach(({ name, ref }) => {
        if (ref && ref.isFocused()) {
          this.setState({ [name]: text });
        }
      });
  }
  onSubmitOldPassword() {
    this.password.focus();
  }

  onSubmitPassword() {
    this.confirmPassword.focus();
  }

  onSubmitConfirmPassword() {
    this.confirmPassword.blur();
  }

  _onSubmit() {
    // const { onRegisterUser } = this.props;
    const { onPasswordUpdate, loginResponse, userInfo } = this.props;
    let errors = {};
    let isValid = true;
    ["password", "oldpassword", "confirmPassword"].forEach((name) => {
      let value = this[name].value();
      if ("oldpassword" === name && !value) {
        errors[name] = translate("Old Password required");
        isValid = false;
      }
      if ("password" === name && !value) {
        errors[name] = translate("New Password required");
        isValid = false;
      }
      if ("confirmPassword" === name && !value) {
        errors[name] = translate("Confirm Password required");
        isValid = false;
      }
    });
    this.setState({ errors });

    if (isValid) {
      if (checkPasswordValid(this["password"].value())) {
        if (this["password"].value() == this["confirmPassword"].value()) {
          onPasswordUpdate(
            this["oldpassword"].value(),
            this["password"].value(),
            this._passwordUpdateCallback
          );
        } else {
          showSingleAlert(
            translate("password_mismatch"),
            translate("Ok"),
            null
          );
        }
      } else {
        showSingleAlert(translate("password_invalid"), translate("Ok"), null);
      }
    }
  }

  _passwordUpdateCallback = (status) => {
    if (status) {
      showSingleAlert(translate("password_updated"), translate("Ok"), () => {
        this.props.navigation.goBack();
      });
    }
  };
  //Header Back Arrow Function
  _didTapOnBackButton = () => {
    this.props.navigation.goBack();
  };

  render() {
    const { secureTextEntry, errors = {} } = this.state;
    const { addressList, isLoading } = this.props;
    return (
      <SafeAreaView style={Styles.container}>
        <NavigationHeader1
          hideBottomLine
          title={translate("Change Password")}
          hideSearch={true}
          showBackButton={true}
          didTapOnLeftButton={this._didTapOnBackButton}
          isRTL={this.props.isRTL}
        />
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={Styles.lockContainer}>
            <Image resizeMode={"cover"} source={Images.lockmain} />
          </View>
          <View style={{ paddingHorizontal: 49, marginTop: 70 }}>
            <TextField
              ref={this.oldpasswordRef}
              secureTextEntry={secureTextEntry}
              containerStyle={Styles.containerStyle}
              labelTextStyle={Styles.inpuLabelTextStyle}
              labelFontSize={16}
              fontSize={16}
              textColor={"rgb(91,91,91)"}
              labelOffset={{ x0: 0, y0: 0, x1: 0, y1: -9 }}
              activeLineWidth={1.5}
              lineWidth={1}
              tintColor={"rgb(142,142,142)"}
              autoCapitalize="none"
              autoCorrect={false}
              enablesReturnKeyAutomatically={true}
              onFocus={this.onFocus}
              onChangeText={this.onChangeText}
              onSubmitEditing={this.onSubmitOldPassword}
              renderRightAccessory={this.renderPasswordAccessory.bind(
                this,
                "pwd_icon"
              )}
              returnKeyType="next"
              label={translate("Current Password")}
              error={errors.oldpassword}
            />
            <TextField
              ref={this.passwordRef}
              secureTextEntry={secureTextEntry}
              containerStyle={Styles.containerStyle}
              labelTextStyle={Styles.inpuLabelTextStyle}
              labelFontSize={16}
              fontSize={16}
              textColor={"rgb(91,91,91)"}
              labelOffset={{ x0: 0, y0: 0, x1: 0, y1: -9 }}
              activeLineWidth={1.5}
              lineWidth={1}
              tintColor={"rgb(142,142,142)"}
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
              label={translate("New Password")}
              error={errors.password}
            />
            <TextField
              ref={this.confirmPasswordRef}
              secureTextEntry={secureTextEntry}
              containerStyle={Styles.containerStyle}
              labelTextStyle={Styles.inpuLabelTextStyle}
              labelFontSize={16}
              fontSize={16}
              textColor={"rgb(91,91,91)"}
              labelOffset={{ x0: 0, y0: 0, x1: 0, y1: -9 }}
              activeLineWidth={1.5}
              lineWidth={1}
              tintColor={"rgb(142,142,142)"}
              autoCapitalize="none"
              autoCorrect={false}
              enablesReturnKeyAutomatically={true}
              onFocus={this.onFocus}
              onChangeText={this.onChangeText}
              onSubmitEditing={this.onSubmitConfirmPassword}
              renderRightAccessory={this.renderPasswordAccessory.bind(
                this,
                "pwd_icon"
              )}
              returnKeyType="done"
              label={translate("Confirm Password")}
              error={errors.confirmPassword}
            />
            <BottomButton
              onButtonClick={() => this._onSubmit()}
              buttonText={translate("Change Password")}
            />
            <View style={{ height: 30 }} />
          </View>
        </ScrollView>
        {isLoading && <HudView />}
      </SafeAreaView>
    );
  }
}

export default ChangePasswordScreen;

/**
 * Created by ILeaf solutions
 * on July 23, 2020
 * RefreshButtonView - App showing refresh button if no network.
 */

import React, { Component } from "react";
import { View, StatusBar, TextInput, Text, Animated } from "react-native";
import Constants from "../config/constants";

export default class FloatingLabelInput extends Component {
  // constructor(props) {
  //   super(props);
  // }
  componentWillMount() {
    this._animatedIsFocused = new Animated.Value(
      this.props.value === "" ? 0 : 1
    );
  }

  componentDidUpdate() {
    Animated.timing(this._animatedIsFocused, {
      toValue: this.state.isFocused || this.props.value !== "" ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }
  state = {
    isFocused: false,
  };

  focus() {
    this.refs.textInput.focus();
  }

  handleFocus = () => {
    if (this.props.onFocus) {
      this.props.onFocus();
    } else {
      this.setState({ isFocused: true });
    }
  };
  handleBlur = () => this.setState({ isFocused: false });
  render() {
    const { label, multiline, ismobile, ...props } = this.props;
    const { isFocused } = this.state;
    const labelStyle = {
      position: "absolute",
      // left: 4,
      left: this._animatedIsFocused.interpolate({
        inputRange: [0, 10],
        outputRange: [1, ismobile ? -790 : 0],
      }),
      top: this._animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: [18, -10],
      }),
      fontSize: this._animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: [20, 14],
      }),
      color: this._animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: ["rgb(193,193,193)", "rgb(193,193,193)"],
      }),
      fontFamily: Constants.Fonts.REGULAR,
      fontSize: 16,
      color: "rgb(193,193,193)",
    };
    return (
      <View style={{ paddingTop: 5 }}>
        <Animated.Text style={labelStyle}>{label}</Animated.Text>
        {multiline ? (
          <TextInput
            {...props}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
            ref={"textInput"}
            blurOnSubmit
          />
        ) : (
          <TextInput
            {...props}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
            ref={"textInput"}
            blurOnSubmit
          />
        )}
      </View>
    );
  }
}

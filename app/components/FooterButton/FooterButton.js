import styles from './styles';
import React, {Component} from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
import constants from '../../config/constants';
// import { TouchableOpacity } from "react-native-gesture-handler";
import {normalizedWidth, normalizedHeight} from '../../config/common';

export default class FooterButton extends Component {
  render() {
    const {
      buttonText1,
      buttonText2,
      onButton1Click,
      onButton2Click,
      singleButton,
      button1TextStyle,
      screenWidth,
    } = this.props;

    let screenWidthVal = screenWidth ? screenWidth : normalizedWidth(180);

    return (
      <View
        style={[
          styles.container,
          {justifyContent: singleButton ? 'center' : 'space-between'},
        ]}>
        {!singleButton && (
          <TouchableOpacity
            activeOpacity={constants.ACTIVE_OPACITY}
            style={[
              styles.button1,
              {
                width: singleButton
                  ? constants.SCREEN_WIDTH - 100
                  : (screenWidthVal - 50) / 2,
              },
            ]}
            onPress={onButton1Click}>
            <Text style={[styles.buttonText1, button1TextStyle]}>
              {buttonText1}
            </Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          activeOpacity={constants.ACTIVE_OPACITY}
          style={[
            styles.button2,
            {
              width: singleButton
                ? constants.SCREEN_WIDTH - 100
                : (screenWidthVal - 50) / 2, //normalizedWidth(180),
            },
          ]}
          onPress={onButton2Click}>
          <Text style={styles.buttonText2}>{buttonText2}</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

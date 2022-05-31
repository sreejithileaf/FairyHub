/**
 * Created by ILeaf solutions
 * on April 08, 2020
 * RefreshButtonView - App showing refresh button if no network.
 */

import React, {Component} from 'react';
import {View, Text, TouchableOpacity, ActivityIndicator} from 'react-native';
import Constants from '../config/constants';
import {translate} from '../config/languageSwitching';

export default class RefreshButtonView extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {styles, parentStyle} = this.props;
    return (
      <View
        style={[
          {
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.3)',
          },
          parentStyle ? parentStyle : null,
        ]}>
        <View
          style={[
            {
              width: '70%',
              //   height: 80,
              backgroundColor: 'white',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 5,
              overflow: 'hidden',
            },
            styles ? styles : null,
          ]}>
          <Text
            style={{
              fontFamily: Constants.Fonts.REGULAR,
              fontSize: 15,
              color: Constants.APP_BLACK_COLOR,
              marginVertical: 20,
              marginHorizontal: 20,
              textAlign: 'center',
            }}>
            {translate(
              'No internet connection, Please restor your internet and try again',
            )}
          </Text>
          <TouchableOpacity
            style={{
              borderWidth: 1,
              borderRadius: 5,
              borderColor: Constants.APP_GRAY_COLOR,
              marginBottom: 10,
            }}
            onPress={() => {
              this.props.didTapOnRefresh();
            }}>
            <Text
              style={{
                ontFamily: Constants.Fonts.REGULAR,
                fontSize: 15,
                color: Constants.APP_BLACK_COLOR,
                marginVertical: 10,
                marginHorizontal: 20,
              }}>
              {'Refresh'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

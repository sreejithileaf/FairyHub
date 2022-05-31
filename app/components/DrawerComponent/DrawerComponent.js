/**
 * Created by Jebin for iLeaf Solutions Pvt.Ltd
 * on February 12, 2020
 * Drawer Component UI
 */

import React, {Component} from 'react';
import {View, SafeAreaView, StatusBar, Text} from 'react-native';
import styles from './styles';

class DrawerComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <SafeAreaView style={styles.safeContainer}>
        <StatusBar backgroundColor="#005776" />
        <View />
      </SafeAreaView>
    );
  }
}

export default DrawerComponent;

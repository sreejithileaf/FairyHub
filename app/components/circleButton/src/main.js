import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  Animated,
  Easing,
  Linking,
} from 'react-native';
import Constants from '../../../config/constants';
import Images from '../../../config/images';
import {showSingleAlert} from '../../../config/common';
import {translate} from '../../../config/languageSwitching/index';

class CircleButton extends Component {
  constructor() {
    super();

    this.state = {
      isClicked: false,
    };

    this.rotateAnimated = new Animated.Value(0);
    this.scaleAnimated = new Animated.Value(0);
    this.bringToBackAnimated = new Animated.Value(0);
    this.bringToLeftAnimated = new Animated.Value(0);
    this.bringToRightAnimated = new Animated.Value(0);
    this.bringToTopAnimated = new Animated.Value(0);
    this.bringToBottomAnimated = new Animated.Value(0);
    this.fadeAnimated = new Animated.Value(0);
    this._buttonTop = this._buttonTop.bind(this);
    this._buttonRight = this._buttonRight.bind(this);
    this._buttonBottom = this._buttonBottom.bind(this);
  }

  componentDidMount() {
    if (this && this.props.refer) this.props.refer(this);
  }

  createAnimation(obj, toValue, duration, easing) {
    return Animated.timing(obj, {
      toValue,
      duration,
      easing: Easing.linear,
    }).start();
  }

  startAnimation = () => {
    this.createAnimation(this.rotateAnimated, 1, 200);
    this.createAnimation(this.scaleAnimated, 1, 200);
    this.createAnimation(this.bringToBackAnimated, 1, 150);
    this.createAnimation(this.bringToLeftAnimated, 1, 200);
    this.createAnimation(this.bringToRightAnimated, 1, 200);
    this.createAnimation(this.bringToTopAnimated, 1, 200);
    this.createAnimation(this.bringToBottomAnimated, 1, 200);
    this.createAnimation(this.fadeAnimated, 1, 200);
  };

  endAnimation = () => {
    this.createAnimation(this.rotateAnimated, 2, 200);
    this.createAnimation(this.scaleAnimated, 0, 200);
    this.createAnimation(this.bringToBackAnimated, 0, 2000);
    this.createAnimation(this.bringToLeftAnimated, 0, 200);
    this.createAnimation(this.bringToRightAnimated, 0, 200);
    this.createAnimation(this.bringToTopAnimated, 0, 200);
    this.createAnimation(this.bringToBottomAnimated, 0, 200);
    this.createAnimation(this.fadeAnimated, 0, 200);
  };

  _buttonCenter = isFromRoot => {
    this.startAnimation();
    this.setState({isClicked: !this.state.isClicked});
    if (isFromRoot) {
      return;
    }
    if (this.state.isClicked) this.endAnimation();

    if (this.state.isClicked) {
      setTimeout(() => {
        this.props.didTapOnClose();
      }, 100);
    }
  };

  _buttonTop = phone => {
    this.setState({isClicked: !this.state.isClicked});
    this.endAnimation();
    this.props.onPressButtonTop();
    // let link = `whatsapp://send?&phone=${phone}`;

    // let link = `sms:${phone}?body=yourMessage`;
    // Linking.canOpenURL(link)
    //   .then(() => {
    //     return Linking.openURL(link);
    //   })
    //   .catch((err) => console.log("message error occurred", err));
    // if (this.state.isClicked) {
    //   setTimeout(() => {
    //     this.props.didTapOnClose();
    //   }, 100);
    // }
  };

  _buttonRight() {
    this.setState({isClicked: !this.state.isClicked});
    this.endAnimation();
    this.props.onPressButtonRight();

    if (this.state.isClicked) {
      setTimeout(() => {
        this.props.didTapOnClose();
      }, 100);
    }
  }

  _buttonBottom = phone => {
    this.setState({isClicked: !this.state.isClicked});
    this.endAnimation();
    this.props.onPressButtonBottom();
    // let link = `whatsapp://send?&phone=${phone}`;
    let link = 'https://wa.me/' + phone;

    Linking.canOpenURL(link)
      .then(supported => {
        if (!supported) {
          showSingleAlert(translate('install_whatsapp'));
        } else {
          return Linking.openURL(link);
        }
      })
      .catch(err => console.log('whatsapp error occurred', err));

    if (this.state.isClicked) {
      setTimeout(() => {
        this.props.didTapOnClose();
      }, 100);
    }
  };
  _buttonLeft = phone => {
    this.setState({isClicked: !this.state.isClicked});
    this.endAnimation();
    this.props.onPressButtonLeft();
    let phoneNumber = '';
    if (Platform.OS === 'android') {
      phoneNumber = `tel:${phone}`;
    } else {
      phoneNumber = `telprompt:${phone}`;
    }
    Linking.canOpenURL(phoneNumber)
      .then(supported => {
        if (!supported) showSingleAlert(translate('Call not supported'));
        else return Linking.openURL(phoneNumber);
      })
      .catch(err => console.log(err));

    if (this.state.isClicked) {
      setTimeout(() => {
        this.props.didTapOnClose();
      }, 100);
    }
  };

  render() {
    const {size, primaryColor, secondaryColor, reachUS} = this.props;

    const styles = StyleSheet.create({
      container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: 48,
        position: 'absolute',
        bottom: reachUS ? 40 : 110,
        right: reachUS ? 30 : 20,
        height: 48,
      },

      buttonWrapper: {
        right: size * 2 - 10,
      },
      buttonLeft: {
        alignItems: 'center',
        justifyContent: 'center',
        width: size - 5,
        height: size - 5,
        borderRadius: 360,
      },
      buttonRight: {
        alignItems: 'center',
        justifyContent: 'center',
        width: size - 5,
        height: size - 5,
        borderRadius: 360,
      },
      buttonCenter: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 50,
        height: 50,
        borderRadius: 360,
      },
      buttonTop: {
        right: -size * 2 + 7,
        alignItems: 'center',
        justifyContent: 'center',
        width: size - 5,
        height: size - 5,
        borderRadius: 360,
      },
      buttonBottom: {
        right: size - 7,
        alignItems: 'center',
        justifyContent: 'center',
        width: size - 5,
        height: size - 5,
        borderRadius: 360,
      },
      text: {
        color: '#EECE69',
        fontWeight: 'bold',
        letterSpacing: 1,
      },
      centerImage: {
        width: 70,
        height: 70,
      },
      childImage: {
        // width: size - 15,
        // height: size - 15,
        height: 60,
        width: 60,
      },
      circle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 360,
      },
    });

    const rotateMe = this.rotateAnimated.interpolate({
      inputRange: [0, 1, 2],
      outputRange: ['0deg', '45deg', '0deg'],
    });

    const scaleMe = this.scaleAnimated.interpolate({
      inputRange: [0, 1],
      outputRange: [size, size * 2.8],
    });

    const bringToBack = this.bringToBackAnimated.interpolate({
      inputRange: [0, 1],
      outputRange: [99, -1],
    });

    const bringMeToLeft = this.bringToLeftAnimated.interpolate({
      inputRange: [0, 1],
      outputRange: [size, -19],
    });

    const bringMeToRight = this.bringToRightAnimated.interpolate({
      inputRange: [0, 1],
      outputRange: [0, size],
    });

    const bringMeToTop = this.bringToTopAnimated.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -45],
    });

    const bringMeToBottom = this.bringToBottomAnimated.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 45],
    });

    const fadeInOut = this.fadeAnimated.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    });

    const phoneNumber = '+96522070777';
    const whatsappNo = '+965 98732422'; //"96598732422";
    const emailAddress = 'someone@example.com';

    return (
      <View style={styles.container}>
        <Animated.View
          style={[styles.circle, {width: scaleMe, height: scaleMe}]}>
          <Animated.View style={{top: bringMeToTop, left: -30}}>
            <TouchableOpacity
              onPress={() => this._buttonTop(phoneNumber)}
              activeOpacity={1}
              style={styles.buttonTop}>
              <Animated.Image
                source={Images.popUpButtonMessage}
                style={[styles.childImage, {opacity: fadeInOut}]}
              />
            </TouchableOpacity>
          </Animated.View>
          <Animated.View style={{left: bringMeToLeft, zIndex: 999}}>
            <TouchableOpacity
              onPress={() => this._buttonLeft(phoneNumber)}
              activeOpacity={1}
              style={styles.buttonLeft}>
              <Animated.Image
                source={Images.popUpButtonCall}
                style={[styles.childImage, {opacity: fadeInOut}]}
              />
            </TouchableOpacity>
          </Animated.View>
          <Animated.View style={{left: bringMeToRight}}>
            <TouchableOpacity
              onPress={this._buttonRight}
              activeOpacity={1}
              style={styles.buttonRight}>
              {/* <Animated.Image
                source={this.props.iconButtonRight}
                style={[styles.childImage, { opacity: fadeInOut }]}
              /> */}
            </TouchableOpacity>
          </Animated.View>
          <Animated.View style={{top: bringMeToBottom, left: -30}}>
            <TouchableOpacity
              onPress={() => this._buttonBottom(whatsappNo)}
              activeOpacity={1}
              style={styles.buttonBottom}>
              <Animated.Image
                source={Images.popUpButtonWhatsApp}
                style={[styles.childImage, {opacity: fadeInOut}]}
              />
            </TouchableOpacity>
          </Animated.View>

          <Animated.View
            style={[styles.buttonWrapper, {transform: [{rotate: rotateMe}]}]}>
            <TouchableOpacity
              onPress={() => this._buttonCenter(false)}
              activeOpacity={1}
              style={[
                styles.buttonCenter,
                {
                  // overflow: "hidden",
                  backgroundColor: Constants.APP_WHITE_COLOR,
                  shadowColor: 'rgba(110,110,110,0.9)',
                  shadowOffset: {
                    width: 0,
                    height: 7,
                  },
                  shadowOpacity: 0.5,
                  shadowRadius: 4.65,
                  elevation: 10,
                },
              ]}>
              <Animated.Image
                source={
                  this.state.isClicked ? Images.close : Images.floatButton
                }
                style={[
                  styles.centerImage,
                  {
                    transform: [
                      {rotate: this.state.isClicked ? '45deg' : '0deg'},
                    ],
                    width: this.state.isClicked ? 15 : 18,
                    height: this.state.isClicked ? 15 : 18,
                    tintColor: Constants.APP_THEME_COLOR,
                    // backgroundColor: this.state.isClicked
                    //   ? Constants.APP_TRANSPARENT_COLOR
                    //   : Constants.APP_THEME_COLOR,
                  },
                ]}
              />
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      </View>
    );
  }
}

CircleButton.defaultProps = {
  size: 40,
  onPressButtonTop: () => {},
  onPressButtonRight: () => {},
  onPressButtonBottom: () => {},
  onPressButtonLeft: () => {},
  primaryColor: '#41727E',
  secondaryColor: '#459186',
};

CircleButton.propTypes = {
  size: PropTypes.number,
  onPressButtonTop: PropTypes.func,
  onPressButtonRight: PropTypes.func,
  onPressButtonBottom: PropTypes.func,
  onPressButtonLeft: PropTypes.func,
  primaryColor: PropTypes.string,
  secondaryColor: PropTypes.string,
};

module.exports = CircleButton;

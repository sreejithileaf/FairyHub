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
  TextInput,
  Linking,
  Platform,
} from 'react-native';
import Styles from './style';
import Images from '../../config/images';
import constants from '../../config/constants';
import HudView from '../../components/hudView';
import React, {Component, memo} from 'react';
import {
  isEmpty,
  checkEMailValidation,
  checkPasswordValid,
  normalizedWidth,
  normalizedHeight,
} from '../../config/common';
import Modal from 'react-native-modal';
import {showSingleAlert} from '../../config/common';
import CircleButton from '../../components/circleButton';
import {TextField, OutlinedTextField} from 'react-native-material-textfield';
import CountryPicker from 'react-native-country-picker-modal';
import {translate} from '../../config/languageSwitching/index';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import EmptyDataPlaceholder from '../../components/emptyDataPlaceholder';
import NavigationHeader1 from '../../components/NavigationHeaders/NavigationHeader1';
import {color} from 'react-native-reanimated';
import styles from './style';
import BottomButton from '../../components/BottomButton';
// import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";

class ReachUsScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isShowCountryPicker: false,
      message: '',
      required: true,
      callingCode: '965',
      isPopUpViewShow: false,
    };
    this.onFocus = this.onFocus.bind(this);
    this.onChangeText = this.onChangeText.bind(this);
    this.onSubmitLastName = this.onSubmitLastName.bind(this);
    this.onSubmitFirstName = this.onSubmitFirstName.bind(this);
    this.onSubmitEmail = this.onSubmitEmail.bind(this);
    this.onSubmitCountryCode = this.onSubmitCountryCode.bind(this);
    this.onSubmitMobile = this.onSubmitMobile.bind(this);
    this.onSubmitReason = this.onSubmitReason.bind(this);
    this.onSubmitMessage = this.onSubmitMessage.bind(this);

    this.lastNameRef = this.updateRef.bind(this, 'lastName');
    this.firstNameRef = this.updateRef.bind(this, 'firstName');
    this.emailRef = this.updateRef.bind(this, 'email');
    this.countryCodeRef = this.updateRef.bind(this, 'countryCode');
    this.mobileRef = this.updateRef.bind(this, 'mobile');
    this.reasonRef = this.updateRef.bind(this, 'reason');
    // this.messageRef = this.updateRef.bind(this, "message");
  }

  componentDidMount() {
    //   var newRegion = {
    //     latitude: 41.068038,
    //     longitude: 29.061824,
    //     latitudeDelta: 0.01,
    //     longitudeDelta: 0.01,
    //  };
    //  this.mapView.animateToRegion(newRegion, 1000);
  }

  didTapOnBackButton = () => {
    this.props.navigation.goBack();
  };

  updateRef(name, ref) {
    this[name] = ref;
  }

  onFocus() {
    let {errors = {}} = this.state;
    for (let name in errors) {
      let ref = this[name];
      if (ref && ref.isFocused()) {
        delete errors[name];
      }
    }
    this.setState({errors});
  }

  onChangeText(text) {
    [
      'firstName',
      'lastName',
      'email',
      'countryCode',
      'mobile',
      'reason',
      // "message",
    ]
      .map(name => ({name, ref: this[name]}))
      .forEach(({name, ref}) => {
        if (ref && ref.isFocused()) {
          this.setState({[name]: text});
        }
      });
  }
  onSubmitFirstName() {
    this.lastName.focus();
  }

  onSubmitLastName() {
    this.email.focus();
  }

  onSubmitEmail() {
    this.onSubmitMobile.focus();
  }

  onSubmitCountryCode() {
    this.countryCode.blur();
  }

  onSubmitMobile() {
    this.reason.focus();
  }

  onSubmitReason() {
    this.message.focus();
  }

  onSubmitMessage() {
    this.message.blur();
  }

  _onSubmit() {
    // const { onRegisterUser } = this.props;
    let errors = {};
    let isValid = true;
    [
      'firstName',
      'lastName',
      'email',
      'countryCode',
      'mobile',
      'reason',
      // "message",
    ].forEach(name => {
      let value = this[name].value();
      if ('firstName' === name && !value) {
        errors[name] = translate('First name required');
        isValid = false;
      }
      if ('lastName' === name && !value) {
        errors[name] = translate('Last name required');
        isValid = false;
      }
      if ('email' === name) {
        if (!value) {
          errors[name] = translate('Email required');
          isValid = false;
        } else if (!checkEMailValidation(value)) {
          errors[name] = translate('Invalid Email');
          isValid = false;
        }
      }
      if ('countryCode' === name && !value) {
        errors[name] = translate('Country Code required');
        isValid = false;
      }
      if ('mobile' === name && !value) {
        errors[name] = translate('Mobile number required');
        isValid = false;
      }
      if ('reason' === name && !value) {
        errors[name] = translate('Reason required');
        isValid = false;
      }
      // if ("message" === name && !value) {
      //   errors[name] = translate("Message required");
      //   isValid = false;
      // }
    });
    if (this.state.message === '') {
      this.setState({
        required: false,
      });
    } else {
      this.setState({
        required: true,
      });
    }
    this.setState({errors});
    if (isValid && this.state.message !== '') {
      this.props.onFeedbackSubmit(
        this['firstName'].value(),
        this['lastName'].value(),
        this['email'].value(),
        this['mobile'].value(),
        this['reason'].value(),
        this.state.message,
        this.callBack,
      );
    }
  }

  callBack = status => {
    if (status) {
      // this.setState({
      //   phone: "",
      //   onMyMind: "",
      // });
      showSingleAlert(
        translate('Message sent succesfully'),
        translate('Ok'),
        () => {
          this.props.navigation.goBack();
        },
      );
    }
  };

  renderPlusAccessory() {
    return (
      <Text
        style={{
          fontFamily: constants.Fonts.REGULAR,
          fontSize: 16,
          color: constants.APP_THEME_COLOR,
          marginBottom: 3,
        }}>
        +
      </Text>
    );
  }

  _openWhatsapp = phone => {
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
  };

  _didTapOnPhoneCall = phone => {
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
  };

  //Header Back Arrow Function
  _didTapOnBackButton = () => {
    this.props.navigation.goBack();
  };

  render() {
    const {
      isShowCountryPicker,
      callingCode,
      isPopUpViewShow,
      errors = {},
    } = this.state;
    const {userInfo, isLoading, isRTL} = this.props;
    const phoneNumber1 = '+96522070777';
    const phoneNumber2 = '+96598732422';
    const whatsappNo = '+965 98732422'; //"96598732422";
    const emailAddress = 'cs@fairyhub.com';

    let mobileNo = '';

    if (
      userInfo &&
      userInfo.custom_attributes &&
      userInfo.custom_attributes.length > 0
    ) {
      userInfo.custom_attributes.map(obj => {
        if (obj.attribute_code === 'fhmobile_number') {
          mobileNo = obj.value;
        }
      });
    }
    return (
      <SafeAreaView style={Styles.container}>
        <NavigationHeader1
          title={translate('Reach Us')}
          hideSearch={true}
          showBackButton={true}
          didTapOnLeftButton={this._didTapOnBackButton}
          isRTL={this.props.isRTL}
        />
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{paddingHorizontal: 40}}>
            <TextField
              ref={this.firstNameRef}
              defaultValue={userInfo ? userInfo.firstname : ''}
              containerStyle={Styles.containerStyle}
              labelTextStyle={Styles.inpuLabelTextStyle}
              labelFontSize={16}
              fontSize={16}
              style={{fontFamily: constants.Fonts.REGULAR}}
              textColor={'rgb(91,91,91)'}
              labelOffset={{x0: 0, y0: 0, x1: 0, y1: -9}}
              activeLineWidth={1.5}
              lineWidth={1}
              tintColor={'rgb(142,142,142)'}
              autoCapitalize="words"
              autoCorrect={false}
              enablesReturnKeyAutomatically={true}
              onFocus={this.onFocus}
              onChangeText={this.onChangeText}
              onSubmitEditing={this.onSubmitFirstName}
              returnKeyType="next"
              label={translate('First Name')}
              error={errors.firstName}
            />
            <TextField
              ref={this.lastNameRef}
              defaultValue={userInfo ? userInfo.lastname : ''}
              containerStyle={Styles.containerStyle}
              labelTextStyle={Styles.inpuLabelTextStyle}
              style={{fontFamily: constants.Fonts.REGULAR}}
              labelFontSize={16}
              fontSize={16}
              textColor={'rgb(91,91,91)'}
              labelOffset={{x0: 0, y0: 0, x1: 0, y1: -9}}
              activeLineWidth={1.5}
              lineWidth={1}
              tintColor={'rgb(142,142,142)'}
              autoCapitalize="words"
              autoCorrect={false}
              enablesReturnKeyAutomatically={true}
              onFocus={this.onFocus}
              onChangeText={this.onChangeText}
              onSubmitEditing={this.onSubmitLastName}
              returnKeyType="next"
              label={translate('Last Name')}
              error={errors.lastName}
            />
            <TextField
              ref={this.emailRef}
              defaultValue={userInfo ? userInfo.email : ''}
              editable={true}
              containerStyle={Styles.containerStyle}
              labelTextStyle={Styles.inpuLabelTextStyle}
              labelFontSize={16}
              fontSize={16}
              style={{fontFamily: constants.Fonts.REGULAR}}
              textColor={'rgb(91,91,91)'}
              labelOffset={{x0: 0, y0: 0, x1: 0, y1: -9}}
              activeLineWidth={1.5}
              lineWidth={1}
              tintColor={'rgb(142,142,142)'}
              autoCapitalize="none"
              keyboardType={'email-address'}
              autoCorrect={false}
              enablesReturnKeyAutomatically={true}
              onFocus={this.onFocus}
              onChangeText={this.onChangeText}
              onSubmitEditing={this.onSubmitEmail}
              returnKeyType="next"
              label={translate('Email')}
              error={errors.email}
            />

            {isRTL ? (
              <View style={{flexDirection: 'row'}}>
                <TextField
                  ref={this.mobileRef}
                  containerStyle={{marginTop: 2, flex: 1}}
                  labelTextStyle={Styles.inpuLabelTextStyle}
                  defaultValue={mobileNo}
                  labelFontSize={16}
                  fontSize={16}
                  style={{
                    fontFamily: constants.Fonts.REGULAR,
                    textAlign: 'left',
                  }}
                  textColor={'rgb(91,91,91)'}
                  labelOffset={{
                    x0: 0,
                    y0: 0,
                    // x1: this.props.isRTL ? 80 : -80,
                    y1: -10,
                  }}
                  activeLineWidth={1.5}
                  lineWidth={1}
                  tintColor={'rgb(142, 142, 142)'}
                  keyboardType="phone-pad"
                  autoCapitalize="none"
                  autoCorrect={false}
                  enablesReturnKeyAutomatically={true}
                  onFocus={this.onFocus}
                  onChangeText={this.onChangeText}
                  onSubmitEditing={this.onSubmitMobile}
                  returnKeyType="next"
                  label={translate('Mobile')}
                  error={errors.mobile}
                  blurOnSubmit={false}
                />

                <View style={{paddingRight: 30}} />
                <TextField
                  ref={this.countryCodeRef}
                  defaultValue={'+965'}
                  editable={false}
                  containerStyle={{marginTop: 2, width: 55}}
                  fontFamily={constants.Fonts.REGULAR}
                  labelTextStyle={Styles.inpuLabelTextStyle}
                  labelFontSize={16}
                  fontSize={16}
                  style={{
                    color: constants.APP_THEME_COLOR,
                    fontFamily: constants.Fonts.REGULAR,
                    textAlign: 'left',
                  }}
                  labelOffset={{x0: 0, y0: 0, x1: 0, y1: -9}}
                  activeLineWidth={1.5}
                  lineWidth={1}
                  tintColor={'rgb(142,142,142)'}
                  autoCapitalize="none"
                  autoCorrect={false}
                  enablesReturnKeyAutomatically={true}
                  onFocus={this.onFocus}
                  onSubmitEditing={this.onSubmitCountryCode}
                  returnKeyType="done"
                  // renderLeftAccessory={this.renderPlusAccessory.bind(this)}
                  error={errors.countryCode}
                />

                {/* <TouchableOpacity
                onPress={() => {
                  // this.setState({ isShowCountryPicker: true });
                }}
                style={Styles.countryCodeContainer}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text style={Styles.countryCodeText}>+{callingCode}</Text>
                </View>
              </TouchableOpacity> */}
              </View>
            ) : (
              <View style={{flexDirection: 'row'}}>
                <TextField
                  ref={this.countryCodeRef}
                  defaultValue={'+965'}
                  editable={false}
                  containerStyle={{marginTop: 2, width: 55}}
                  fontFamily={constants.Fonts.REGULAR}
                  style={{fontFamily: constants.Fonts.REGULAR}}
                  labelTextStyle={Styles.inpuLabelTextStyle}
                  labelFontSize={16}
                  fontSize={16}
                  style={{
                    color: constants.APP_THEME_COLOR,
                    fontFamily: constants.Fonts.REGULAR,
                  }}
                  labelOffset={{x0: 0, y0: 0, x1: 0, y1: -9}}
                  activeLineWidth={1.5}
                  lineWidth={1}
                  tintColor={'rgb(142,142,142)'}
                  autoCapitalize="none"
                  autoCorrect={false}
                  enablesReturnKeyAutomatically={true}
                  onFocus={this.onFocus}
                  onSubmitEditing={this.onSubmitCountryCode}
                  returnKeyType="done"
                  // renderLeftAccessory={this.renderPlusAccessory.bind(this)}
                  error={errors.countryCode}
                />
                <View style={{paddingRight: 30}} />
                <TextField
                  ref={this.mobileRef}
                  containerStyle={{marginTop: 2, flex: 1}}
                  labelTextStyle={Styles.inpuLabelTextStyle}
                  defaultValue={mobileNo}
                  labelFontSize={16}
                  fontSize={16}
                  style={{fontFamily: constants.Fonts.REGULAR}}
                  textColor={'rgb(91,91,91)'}
                  labelOffset={{
                    x0: 0,
                    y0: 0,
                    x1: this.props.isRTL ? 80 : -80,
                    y1: -10,
                  }}
                  activeLineWidth={1.5}
                  lineWidth={1}
                  tintColor={'rgb(142, 142, 142)'}
                  keyboardType="phone-pad"
                  autoCapitalize="none"
                  autoCorrect={false}
                  enablesReturnKeyAutomatically={true}
                  onFocus={this.onFocus}
                  onChangeText={this.onChangeText}
                  onSubmitEditing={this.onSubmitMobile}
                  returnKeyType="next"
                  label={translate('Mobile')}
                  error={errors.mobile}
                  blurOnSubmit={false}
                  maxLength={8}
                />
                {/* <TouchableOpacity
                onPress={() => {
                  // this.setState({ isShowCountryPicker: true });
                }}
                style={Styles.countryCodeContainer}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text style={Styles.countryCodeText}>+{callingCode}</Text>
                </View>
              </TouchableOpacity> */}
              </View>
            )}

            <TextField
              ref={this.reasonRef}
              containerStyle={Styles.containerStyle}
              labelTextStyle={Styles.inpuLabelTextStyle}
              labelFontSize={16}
              fontSize={16}
              style={{fontFamily: constants.Fonts.REGULAR}}
              textColor={'rgb(91,91,91)'}
              labelOffset={{x0: 0, y0: 0, x1: 0, y1: -9}}
              activeLineWidth={1.5}
              lineWidth={1}
              tintColor={'rgb(142,142,142)'}
              autoCapitalize="words"
              autoCorrect={false}
              enablesReturnKeyAutomatically={true}
              onFocus={this.onFocus}
              onChangeText={this.onChangeText}
              onSubmitEditing={this.onSubmitReason}
              returnKeyType="next"
              label={translate('Reason')}
              error={errors.reason}
            />
            <Text
              style={{
                marginTop: 25,
                fontFamily: constants.Fonts.REGULAR,
                fontSize: 14,
                marginBottom: 15,
                color:
                  this.state.required == false ? '#c72324' : 'rgb(193,193,193)',
                textAlign: 'left',
              }}>
              {translate('Message')}
            </Text>
            <TextInput
              ref={input => (this.message = input)}
              onChangeText={value => this.setState({message: value})}
              autoCapitalize="words"
              autoCorrect={false}
              enablesReturnKeyAutomatically={true}
              multiline={true}
              numberOfLines={3}
              maxLength={250}
              returnKeyType={'next'}
              style={{
                borderWidth: 0.7,
                borderColor:
                  this.state.required == false ? '#c51414' : 'rgb(112,112,112)',
                height: normalizedHeight(118),
                textAlignVertical: 'top',
                paddingHorizontal: 10,
                textAlign: this.props.isRTL ? 'right' : 'left',
              }}
            />
            {this.state.required == false && (
              <Text style={styles.messageErrorText}>
                {translate('Message required')}
              </Text>
            )}

            {/* <View style={{ paddingHorizontal: 30, marginTop: 30 }}>
              <TouchableOpacity
                style={[Styles.submitButtonStyle]}
                activeOpacity={0.7}
                onPress={() => {
                  this._onSubmit();
                }}
              >
                <Text style={Styles.submitText}>
                  {translate("Submit").toUpperCase()}
                </Text>
              </TouchableOpacity>
            </View> */}

            <BottomButton
              onButtonClick={() => this._onSubmit()}
              buttonText={translate('Submit').toUpperCase()}
            />

            <View style={{marginTop: 35}}>
              <Text style={styles.contactAddressText}>
                {translate('Contact Address')}
              </Text>
              <Text style={styles.mainAddressText}>
                Fairyhub general trading {'\n'}Al Khaadmi Building {'\n'}Shaeq,{' '}
                {'\n'}Kuwait
              </Text>
              <TouchableOpacity
                style={styles.addressContainer}
                onPress={() =>
                  Linking.openURL(
                    'mailto:cs@fairyhub.com?subject=SendMail&body=Description',
                  )
                }>
                <Image source={Images.mail} />
                <Text style={styles.addressText}>cs@fairyhub.com</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.addressContainer}
                onPress={() => this._didTapOnPhoneCall(phoneNumber1)}>
                <Image source={Images.phone} />
                <Text style={styles.addressText}>+965 22070777</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.addressContainer}
                onPress={() => this._didTapOnPhoneCall(phoneNumber2)}>
                <Image source={Images.phone} />
                <Text style={styles.addressText}>+965 98732422</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.addressContainer}
                onPress={() => this._openWhatsapp(whatsappNo)}>
                <Image source={Images.watsapp} />
                <Text style={styles.addressText}>+965 98732422</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.mapContainer}>
            <TouchableOpacity
              onPress={() => {
                const scheme = Platform.select({
                  ios: 'maps:0,0?q=',
                  android: 'geo:0,0?q=',
                });
                const latLng = `${29.3117},${47.4818}`;
                const label = 'Fairyhub';
                const url = Platform.select({
                  ios: `${scheme}${label}@${latLng}`,
                  android: `${scheme}${latLng}(${label})`,
                });

                Linking.openURL(url);
              }}>
              <Image
                style={styles.mapViewContainer}
                source={
                  constants.IS_ANDROID ? Images.androidMap : Images.iOSMap
                }
              />
            </TouchableOpacity>
            {/* <MapView
              ref={(ref) => {
                this.mapRef = ref;
              }}
              // provider={PROVIDER_GOOGLE}
              style={Styles.mapViewContainer}
              zoomEnabled={true}
              initialRegion={{
                latitude: 29.3117,
                longitude: 47.4818,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
            >
              <Marker
                coordinate={{
                  latitude: 29.3117,
                  longitude: 47.4818,
                }}
              />
            </MapView> */}
          </View>
        </ScrollView>
        {!isPopUpViewShow && (
          <TouchableOpacity
            style={styles.floatingAction}
            onPress={() => {
              this.setState({isPopUpViewShow: true});
              setTimeout(() => {
                this.circleButtonRef &&
                  this.circleButtonRef._buttonCenter(true);
              }, 500);
            }}>
            <Image
              source={Images.floatButton}
              style={{
                width: 18,
                height: 18,
                // transform: [{ rotate: this.props.isRTL ? "180deg" : "0deg" }],
              }}
            />
          </TouchableOpacity>
        )}
        <Modal
          onBackButtonPress={() => this.setState({isPopUpViewShow: false})}
          onBackdropPress={() => this.setState({isPopUpViewShow: false})}
          isVisible={isPopUpViewShow}
          backdropColor={constants.APP_TRANSPARENT_COLOR}
          style={{margin: 0}}
          animationIn={'fadeIn'}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => this.setState({isPopUpViewShow: false})}
            style={{flex: 1, backgroundColor: 'rgba(110,110,110,0.4)'}}>
            {/* <CircleButton
              refer={(ref) => (this.circleButtonRef = ref)}
              size={45}
              reachUS={true}
              didTapOnClose={() => this.setState({ isPopUpViewShow: false })}
            /> */}
            <CircleButton
              refer={ref => (this.circleButtonRef = ref)}
              size={45}
              reachUS={true}
              didTapOnClose={() => this.setState({isPopUpViewShow: false})}
              navigation={this.props.navigation}
              onPressButtonTop={() => {
                this.setState({isPopUpViewShow: false});
                this.props.navigation.navigate('OthersScreen', {
                  heading: translate('Chat with Us'),
                  url: constants.CHAT_TAWK_URL,
                  // "https://tawk.to/chat/5d6e3db677aa790be3322605/1ekoem6kc",
                  // "https://tawk.to/chat/5faa638d0a68960861bd7cc6/default",
                });
              }}
            />
          </TouchableOpacity>
        </Modal>
        {isLoading && <HudView />}
      </SafeAreaView>
    );
  }
}

export default ReachUsScreen;

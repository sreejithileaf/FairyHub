/**
 * Created by Jebin for iLeaf Solutions Pvt.Ltd
 * on February 12, 2020
 * LoginScreen - LoginScreen View
 */

import {
  View,
  Text,
  Image,
  Platform,
  Keyboard,
  StatusBar,
  TextInput,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import {
  isEmpty,
  showSingleAlert,
  checkEMailValidation,
  showAlertWithCallback,
  normalizedWidth,
  normalizedHeight,
  addEventTracking,
} from '../../config/common';
import {statusCodes, GoogleSignin} from '@react-native-google-signin/google-signin';
import appleAuth, {
  AppleButton,
  AppleAuthError,
  AppleAuthRequestScope,
  AppleAuthRealUserStatus,
  AppleAuthCredentialState,
  AppleAuthRequestOperation,
} from '@invertase/react-native-apple-authentication';
import styles from './styles';
import Modal from 'react-native-modal';
import Images from '../../config/images';
import React, {Component} from 'react';
import RNFetchBlob from 'rn-fetch-blob';
import HudView from '../../components/hudView';
import Constants from '../../config/constants';
import {LoginManager} from 'react-native-fbsdk';
import SignUp from '../../screens/RegistrationScreen';
import {TextField} from 'react-native-material-textfield';
import {LoginButton, AccessToken} from 'react-native-fbsdk';
import {translate} from '../../config/languageSwitching/index';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import BottomButton from '../../components/BottomButton';
import ImageLoader from 'react-native-image-progress';
import analytics from '@react-native-firebase/analytics';

class LoginScreen extends Component {
  constructor(props) {
    super(props);

    let isGuestLogin = props.isGuestLogin ? this.props.isGuestLogin : false;

    this.user = null;
    this.state = {
      credentialStateForUser: -1,
      email: '',
      password: '',
      isLogin: !isGuestLogin,
      isSignUpViewShow: false,
      isForgotPasswordShow: false,
      firstName: '',
      lastName: '',
      showClose: true,
      forgotEmail: '',
      forgotEmailError: '',
      isTermsChecked: false,
      secureTextEntry: true,
      showEmailUpdateView: false,
      actualEmail: '',
      actualEmailError: '',
    };

    this.onFocus = this.onFocus.bind(this);
    this.onChangeText = this.onChangeText.bind(this);
    this.onSubmitEmail = this.onSubmitEmail.bind(this);
    this.emailRef = this.updateRef.bind(this, 'email');
    this.passwordRef = this.updateRef.bind(this, 'password');
    this.onAccessoryPress = this.onAccessoryPress.bind(this);
    this.onSubmitPassword = this.onSubmitPassword.bind(this);
    this.onSubmitFirstName = this.onSubmitFirstName.bind(this);
    this.onSubmitLastName = this.onSubmitLastName.bind(this);
    this.onSubmitGuestEmail = this.onSubmitGuestEmail.bind(this);
    this.lastnameRef = this.updateRef.bind(this, 'lastname');
    this.firstnameRef = this.updateRef.bind(this, 'firstname');
    this.guestEmailRef = this.updateRef.bind(this, 'guestEmail');
    this.renderPasswordAccessory = this.renderPasswordAccessory.bind(this);
  }

  componentDidMount() {
    // GoogleSignin.configure();
    console.log('VESRION===', Constants.IOS_VERSION);

    GoogleSignin.configure({
      hostedDomain: '',
      loginHint: '',
      forceConsentPrompt: true,
      accountName: '',
      iosClientId:
        '246798568353-9vopd2lj2jb1hhh4gpu8bvf0t5up972u.apps.googleusercontent.com',
    });

    setTimeout(() => {
      if (this['email']) this['email'].focus();
    }, 1000);
  }

  componentWillUnmount() {}

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
    ['email', 'password', 'lastname', 'firstname', 'guestEmail']
      .map(name => ({name, ref: this[name]}))
      .forEach(({name, ref}) => {
        if (ref && ref.isFocused()) {
          this.setState({[name]: text});
        }
      });
  }

  onSubmitEmail() {
    this.password.focus();
  }

  onSubmitPassword() {
    this.password.blur();
  }

  onSubmitFirstName() {
    this.lastname.focus();
  }

  onSubmitLastName() {
    this.guestEmail.focus();
  }

  onSubmitGuestEmail() {
    this.guestEmail.blur();
  }

  /** FB Login */
  _onFBLoginPress = () => {
    LoginManager.logOut();
    LoginManager.logInWithPermissions(['public_profile', 'email']).then(
      result => {
        console.log('FB LOGIN RESULT===', result);

        if (result.isCancelled) {
          console.log('Login cancelled');
        } else {
          console.log(
            'Login success with permissions: ' +
              result.grantedPermissions.toString(),
          );
          AccessToken.getCurrentAccessToken().then(data => {
            console.log(data.accessToken.toString());

            let token = data.accessToken.toString();

            fetch(
              'https://graph.facebook.com/v2.5/me?fields=email,name,friends&access_token=' +
                token,
            )
              .then(response => response.json())
              .then(userInfo => {
                console.log('DATA RESPONSE ==', userInfo);

                let params = {
                  first_name: userInfo.name,
                  last_name: ' ',
                  email: userInfo.email,
                  media: 'fb',
                  token: token,
                  random_email: '0',
                };

                this.props.socialMediaLogin(params, this._loginCallback);
              })
              .catch(e => {
                console.log('FACEBOOK LOGIN ERROR::', e);
              });
          });
        }
      },
      function (error) {
        console.log('Login fail with error: ' + error);
      },
    );
  };

  /** Google Login */
  _onGoogleLoginPress = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log('userInfo', userInfo);
      let userDict = userInfo.user;

      let params = {
        first_name: userDict.name,
        last_name: ' ', //userDict.familyName,
        email: userDict.email,
        media: 'google',
        token: userInfo.idToken,
        random_email: '0',
      };

      this.props.socialMediaLogin(params, this._loginCallback);
    } catch (error) {
      console.log('ERROR+++++>>>', error);

      console.log('@@@@####$$$$$', this.props.socialMediaLogin);

      console.log('ERROR', error.code);

      console.log('ERRRR', JSON.stringify(error));

      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (f.e. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
    }
  };

  /** Apple Login */
  _onAppleLoginPress = async () => {
    try {
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: AppleAuthRequestOperation.LOGIN,
        requestedScopes: [
          AppleAuthRequestScope.EMAIL,
          AppleAuthRequestScope.FULL_NAME,
        ],
      });

      console.log('appleAuthRequestResponse', appleAuthRequestResponse);

      const {
        user: newUser,
        email,
        nonce,
        identityToken,
        realUserStatus /* etc */,
      } = appleAuthRequestResponse;

      const credentialState = await appleAuth.getCredentialStateForUser(
        appleAuthRequestResponse.user,
      );
      console.log('credentialState====----->>>', credentialState);

      if (credentialState === AppleAuthCredentialState.AUTHORIZED) {
        // alert("SUCCESS");
      }

      this.user = newUser;

      if (identityToken) {
        // e.g. sign in with Firebase Auth using `nonce` & `identityToken`
        console.log(nonce, identityToken);
      } else {
        // no token - failed sign-in?
      }

      if (realUserStatus === AppleAuthRealUserStatus.LIKELY_REAL) {
        console.log("I'm a real person!");
      }

      console.log(`Apple Authentication Completed, ${this.user}, ${email}`);

      if (credentialState === AppleAuthCredentialState.AUTHORIZED) {
        let nameDict = appleAuthRequestResponse.fullName;

        let isActualEmail = true;

        if (
          appleAuthRequestResponse.email &&
          appleAuthRequestResponse.email.indexOf('appleid.com') > -1
        ) {
          isActualEmail = false;
        }

        let params = {
          first_name: nameDict.givenName,
          last_name: nameDict.familyName,
          email: appleAuthRequestResponse.email,
          media: 'apple',
          token: appleAuthRequestResponse.user,
          random_email: isActualEmail ? '0' : '1',
        };

        this.props.socialMediaLogin(params, this._loginCallback);
      }
    } catch (error) {
      if (error.code === AppleAuthError.CANCELED) {
        console.warn('User canceled Apple Sign in.');
      } else {
        // console.error(error);
      }
    }
  };

  _loginCallback = (status, showAlert, loginResponse) => {
    if (status) {
      addEventTracking('wqax3u');

      analytics()
        .logLogin({method: ''})
        .then(rsp => {
          console.log('FIREBASE ANALYTICS LOGIN SUCCESS-----', rsp);
        })
        .catch(error => {
          console.log('ERROR@@@@', error);
        });

      // this.props.didTapOnclose();
      if (loginResponse && loginResponse.length > 0) {
        let userDict = loginResponse[0].customerdetails;
        let email = userDict.customer_email;
        if (userDict.media === 'apple' && email.indexOf('appleid.com') > -1) {
          // this.setState({ showEmailUpdateView: true });
          this.props.didTapOnclose();
        } else {
          // this.setState({ showEmailUpdateView: true });
          this.props.didTapOnclose();
        }
      } else {
        this.props.didTapOnclose();
      }
    } else {
      if (showAlert) {
        showAlertWithCallback(
          'Something went wrong, please login again',
          'Ok',
          'Continue as guest',
          () => {},
          () => {
            this.props.didTapOnclose();
          },
        );
      }
      this.props.userDidLogOut();
      this.password.clear();
    }
  };

  _forgotPasswordCallback = status => {
    if (status) {
      this.setState({forgotEmail: ''});
      showSingleAlert(
        translate('Password reset link sent'),
        translate('Ok'),
        () => this.setState({isForgotPasswordShow: false}),
      );
    }
  };

  _didSubmitForgotPwd = () => {
    const {forgotEmail} = this.state;
    let valid = true;
    if (isEmpty(forgotEmail)) {
      this.setState({forgotEmailError: translate('Email required')});
      valid = false;
    } else {
      this.setState({forgotEmailError: ''});
      if (checkEMailValidation(forgotEmail)) {
        this.setState({forgotEmailError: ''});
      } else {
        this.setState({forgotEmailError: translate('Invalid Email')});
        valid = false;
      }
    }
    if (valid) {
      this.setState({isForgotPasswordShow: false});
      this.props.forgotPassword(forgotEmail, this._forgotPasswordCallback);
    }
  };

  onSubmit() {
    let errors = {};
    let isValid = true;
    ['email', 'password'].forEach(name => {
      let value = this[name].value();
      if ('email' === name) {
        if (!value) {
          errors[name] = translate('Email required');
          isValid = false;
        } else if (!checkEMailValidation(value)) {
          errors[name] = translate('Invalid Email');
          isValid = false;
        }
      }
      if ('password' === name && !value) {
        errors[name] = translate('Password required');
        isValid = false;
      }
    });
    this.setState({errors});
    Keyboard.dismiss();
    if (isValid && this.props.onLoginUser) {
      this.props.onLoginUser(
        this['email'].value(),
        this['password'].value(),
        this._loginCallback,
      );
    }
  }

  onSubmitGuest() {
    let errors = {};
    let isValid = true;
    ['lastname', 'firstname', 'guestEmail'].forEach(name => {
      let value = this[name].value();
      if ('lastname' === name && !value) {
        errors[name] = translate('Last name required');
        isValid = false;
      }
      if ('firstname' === name && !value) {
        errors[name] = translate('First name required');
        isValid = false;
      }
      if ('guestEmail' === name) {
        if (!value) {
          errors[name] = translate('Email required');
          isValid = false;
        } else if (!checkEMailValidation(value)) {
          errors[name] = translate('Invalid Email');
          isValid = false;
        }
      }
    });
    this.setState({errors});

    if (isValid) {
      let params = {
        firstName: this['firstname'].value(),
        lastName: this['lastname'].value(),
        email: this['guestEmail'].value(),
      };
      this.props.updateGuestInfo(params);
      if (this.props.guestInfoAddedCallback) {
        this.props.guestInfoAddedCallback();
      } else {
        this.props.didTapOnclose();
      }
    }
  }

  onAccessoryPress() {
    this.setState(({secureTextEntry}) => ({
      secureTextEntry: !secureTextEntry,
    }));
  }

  renderPasswordAccessory() {
    let {secureTextEntry} = this.state;
    let name = secureTextEntry ? 'visibility-off' : 'visibility';
    return (
      <MaterialIcon
        style={{
          paddingStart: 10,
          paddingEnd: 6,
          paddingBottom: 2,
          paddingTop: 8,
        }}
        size={22}
        name={name}
        color={TextField.defaultProps.baseColor}
        onPress={this.onAccessoryPress}
        suppressHighlighting={true}
      />
    );
  }

  _didTapOnSubmitActualEmail = () => {
    const {actualEmail} = this.state;
    let userInfo = this.props.userInfo;

    let valid = true;
    if (isEmpty(actualEmail)) {
      this.setState({actualEmailError: translate('Email required')});
      valid = false;
    } else {
      this.setState({actualEmailError: ''});
      if (checkEMailValidation(actualEmail)) {
        this.setState({actualEmailError: ''});
      } else {
        this.setState({actualEmailError: translate('Invalid Email')});
        valid = false;
      }
    }

    if (valid && userInfo) {
      userInfo.email = actualEmail;
      this.setState({showEmailUpdateView: false});

      this.props.onProfileUpdate(userInfo, '', '', status => {
        if (status) {
          this.props.didTapOnclose();
        } else {
          this.setState({showEmailUpdateView: true});
        }
      });
    }
  };

  _didTapOnCancelUpdateOfActualEmail = () => {
    showAlertWithCallback(
      translate('email update logout?'),
      translate('Yes'),
      translate('No'),
      () => {
        this.props.userDidLogOut();
        this.setState({showEmailUpdateView: false});
        this.props.didTapOnclose();
      },
      null,
    );
  };

  render() {
    const {
      isSignUpViewShow,
      isForgotPasswordShow,
      forgotEmailError,
      isTermsChecked,
      secureTextEntry,
      errors = {},
      showEmailUpdateView,
      actualEmailError,
    } = this.state;
    const {isLoading, appLogoUrl} = this.props;

    let dirs = RNFetchBlob.fs.dirs;
    let path = '';
    if (Constants.IS_ANDROID) {
      path = 'file:///' + dirs.DocumentDir + '/appLogo.png';
    } else {
      path = dirs.DocumentDir + '/appLogo.png';
    }

    return (
      <SafeAreaView style={styles.safeContainer}>
        <StatusBar backgroundColor={Constants.APP_THEME_DARK_GRAY} />
        <ScrollView
          style={{flex: 1, backgroundColor: Constants.APP_WHITE_COLOR}}
          scrollEventThrottle={16}
          keyboardShouldPersistTaps="handled"
          // onScroll={(event) => {
          //   if (event.nativeEvent.contentOffset.y > 100) {
          //     this.setState({ showClose: false });
          //   } else {
          //     this.setState({ showClose: true });
          //   }
          // }}
        >
          {/* login section */}
          {this.state.isLogin && (
            <View style={styles.container}>
              <ScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled">
                {/* <Image
                  source={{ uri: appLogoUrl }}
                  resizeMode="contain"
                  style={styles.logoStyle}
                /> */}
                <ImageLoader
                  source={{uri: path}}
                  resizeMode={'contain'}
                  defaultSource={Images.logo}
                  style={styles.logoStyle}
                />
                <View style={styles.container2}>
                  <View style={{flexDirection: 'row'}}>
                    <Text
                      style={{
                        fontFamily: Constants.Fonts.BOLD,
                        fontSize: 22,
                        color: Constants.APP_THEME_COLOR,
                        textAlign: 'left',
                        flex: 1,
                      }}>
                      {translate('Login')}
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        this.setState({isLogin: false});

                        setTimeout(() => {
                          if (this['firstname']) this['firstname'].focus();
                        }, 500);
                      }}>
                      <Text
                        style={{
                          fontFamily: Constants.Fonts.BOLD,
                          fontSize: 22,
                          color: Constants.APP_GRAY_COLOR4,
                          textAlign: 'left',
                          flex: 1,
                        }}>
                        {translate('Guest')}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <TextField
                    ref={this.emailRef}
                    defaultValue={this.props.email}
                    containerStyle={styles.containerStyle}
                    labelTextStyle={styles.inpuLabelTextStyle}
                    labelFontSize={12}
                    fontSize={16}
                    textColor={'rgb(91,91,91)'}
                    labelOffset={{x0: 0, y0: 0, x1: 0, y1: -9}}
                    activeLineWidth={1.5}
                    lineWidth={1}
                    tintColor={'rgb(142, 142, 142)'}
                    baseColor={'rgb(193, 193, 193)'}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    enablesReturnKeyAutomatically={true}
                    onFocus={this.onFocus}
                    onChangeText={this.onChangeText}
                    onSubmitEditing={this.onSubmitEmail}
                    returnKeyType="next"
                    label={translate('Email')}
                    error={errors.email}
                    blurOnSubmit={false}
                  />
                  <TextField
                    ref={this.passwordRef}
                    secureTextEntry={secureTextEntry}
                    containerStyle={styles.containerStyle}
                    labelTextStyle={styles.inpuLabelTextStyle}
                    labelFontSize={12}
                    fontSize={16}
                    textColor={'rgb(91,91,91)'}
                    labelOffset={{x0: 0, y0: 0, x1: 0, y1: -9}}
                    activeLineWidth={1.5}
                    lineWidth={1}
                    tintColor={'rgb(142,142,142)'}
                    baseColor={'rgb(193, 193, 193)'}
                    autoCapitalize="none"
                    autoCorrect={false}
                    enablesReturnKeyAutomatically={true}
                    onFocus={this.onFocus}
                    onChangeText={this.onChangeText}
                    onSubmitEditing={this.onSubmitPassword}
                    renderRightAccessory={this.renderPasswordAccessory}
                    returnKeyType="done"
                    label={translate('Password')}
                    error={errors.password}
                  />
                  <TouchableOpacity
                    style={{
                      alignSelf: 'flex-end',
                    }}
                    onPress={() => this.setState({isForgotPasswordShow: true})}>
                    <Text style={styles.forgotPassword}>
                      {translate('Forgot Password')}
                    </Text>
                  </TouchableOpacity>

                  <View style={{paddingHorizontal: 10}}>
                    <BottomButton
                      onButtonClick={() => this.onSubmit()}
                      buttonText={translate('Login')}
                    />
                  </View>

                  <View
                    style={{
                      marginTop: normalizedHeight(30),
                      marginBottom: normalizedHeight(40),
                    }}>
                    <View style={styles.footerContainer}>
                      <View style={styles.line} />
                      <View style={{paddingHorizontal: normalizedWidth(15)}}>
                        <Text style={styles.orText}>{translate('OR')}</Text>
                      </View>
                      <View style={styles.line} />
                    </View>
                  </View>
                  {!Constants.IS_ANDROID && Constants.IOS_VERSION >= 13 && (
                    <TouchableOpacity
                      style={[styles.appleButtonStyle]}
                      activeOpacity={0.7}
                      onPress={() => {
                        this._onAppleLoginPress();
                      }}>
                      <Image source={Images.appleIcon} />
                      <Text style={styles.appleLoginText}>
                        {translate('Sign in with Apple')}
                      </Text>
                    </TouchableOpacity>
                  )}

                  <View
                    style={{
                      flexDirection: 'row',
                      marginTop: !Constants.IS_ANDROID
                        ? normalizedHeight(10)
                        : null,
                    }}>
                    <TouchableOpacity
                      style={[styles.googleButtonStyle]}
                      activeOpacity={0.7}
                      onPress={() => {
                        this._onGoogleLoginPress();
                      }}>
                      <Image
                        source={Images.google}
                        resizeMode="cover"
                        style={{
                          position: 'absolute',
                          top: 15,
                          left: 26,
                        }}
                      />
                      <Text style={styles.googleLoginText}>
                        {translate('Google')}
                      </Text>
                    </TouchableOpacity>
                    <View style={{paddingHorizontal: 5}} />
                    <TouchableOpacity
                      style={[styles.facebookButtonStyle]}
                      activeOpacity={0.7}
                      onPress={() => {
                        this._onFBLoginPress();
                      }}>
                      <Image
                        source={Images.fb}
                        style={{
                          height: 20,
                          width: 10,
                          position: 'absolute',
                          top: 13,
                          left: 30,
                        }}
                      />
                      <Text style={styles.facebookLoginText}>
                        {translate('Facebook')}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.footerContainer2}>
                    <Text style={styles.forgotPassword}>
                      {translate('Dont have an account?')}
                    </Text>
                    <TouchableOpacity
                      onPress={() => this.setState({isSignUpViewShow: true})}>
                      <Text style={styles.signup}>{translate('Signup')}</Text>
                    </TouchableOpacity>
                  </View>
                  <View
                    style={{
                      paddingHorizontal: normalizedWidth(60),
                      marginTop: normalizedHeight(40),
                      marginBottom: normalizedHeight(60),
                    }}
                  />
                </View>
              </ScrollView>
            </View>
          )}

          {/* Guest section */}
          {!this.state.isLogin && (
            <View style={styles.container}>
              {/* <Image
                source={{ uri: appLogoUrl }}
                resizeMode="contain"
                style={styles.logoStyle}
              /> */}
              <ImageLoader
                source={{uri: path}}
                resizeMode={'contain'}
                defaultSource={Images.logo}
                style={styles.logoStyle}
              />
              <View style={styles.container2}>
                <View style={{flexDirection: 'row'}}>
                  <TouchableOpacity
                    onPress={() => {
                      setTimeout(() => {
                        if (this['emailRef']) this['email'].focus();
                      }, 500);
                      this.setState({isLogin: true});
                    }}
                    style={{flex: 1}}>
                    <Text
                      style={{
                        fontFamily: Constants.Fonts.BOLD,
                        fontSize: 22,
                        color: Constants.APP_GRAY_COLOR4,
                        textAlign: 'left',
                      }}>
                      {translate('Login')}
                    </Text>
                  </TouchableOpacity>
                  <Text
                    style={{
                      fontFamily: Constants.Fonts.BOLD,
                      fontSize: 22,
                      color: Constants.APP_THEME_COLOR,
                      textAlign: 'left',
                    }}>
                    {translate('Guest')}
                  </Text>
                </View>
                <TextField
                  ref={this.firstnameRef}
                  containerStyle={styles.containerStyle}
                  labelTextStyle={styles.inpuLabelTextStyle}
                  labelFontSize={12}
                  fontSize={16}
                  textColor={'rgb(91,91,91)'}
                  labelOffset={{x0: 0, y0: 0, x1: 0, y1: -9}}
                  activeLineWidth={1.5}
                  lineWidth={1}
                  tintColor={'rgb(142, 142, 142)'}
                  baseColor={'rgb(193, 193, 193)'}
                  autoCorrect={false}
                  enablesReturnKeyAutomatically={true}
                  onFocus={this.onFocus}
                  onChangeText={this.onChangeText}
                  onSubmitEditing={this.onSubmitFirstName}
                  returnKeyType="next"
                  label={translate('First name')}
                  error={errors.firstname}
                  blurOnSubmit={false}
                />
                <TextField
                  ref={this.lastnameRef}
                  containerStyle={styles.containerStyle}
                  labelTextStyle={styles.inpuLabelTextStyle}
                  labelFontSize={12}
                  fontSize={16}
                  textColor={'rgb(91,91,91)'}
                  labelOffset={{x0: 0, y0: 0, x1: 0, y1: -9}}
                  activeLineWidth={1.5}
                  lineWidth={1}
                  tintColor={'rgb(142, 142, 142)'}
                  baseColor={'rgb(193, 193, 193)'}
                  autoCorrect={false}
                  enablesReturnKeyAutomatically={true}
                  onFocus={this.onFocus}
                  onChangeText={this.onChangeText}
                  onSubmitEditing={this.onSubmitLastName}
                  returnKeyType="next"
                  label={translate('Last name')}
                  error={errors.lastname}
                  blurOnSubmit={false}
                />
                <TextField
                  ref={this.guestEmailRef}
                  containerStyle={styles.containerStyle}
                  labelTextStyle={styles.inpuLabelTextStyle}
                  labelFontSize={12}
                  fontSize={16}
                  textColor={'rgb(91,91,91)'}
                  labelOffset={{x0: 0, y0: 0, x1: 0, y1: -9}}
                  activeLineWidth={1.5}
                  lineWidth={1}
                  tintColor={'rgb(142, 142, 142)'}
                  baseColor={'rgb(193, 193, 193)'}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  enablesReturnKeyAutomatically={true}
                  onFocus={this.onFocus}
                  onChangeText={this.onChangeText}
                  onSubmitEditing={this.onSubmitGuestEmail}
                  returnKeyType="done"
                  label={translate('Email')}
                  error={errors.guestEmail}
                  blurOnSubmit={false}
                />
                <View style={{marginHorizontal: 10, marginTop: 20}}>
                  <BottomButton
                    onButtonClick={() => this.onSubmitGuest()}
                    buttonText={translate('Submit')}
                  />
                </View>
              </View>
              <View style={{height: 100}} />
            </View>
          )}
        </ScrollView>

        {this.state.showClose && (
          <TouchableOpacity
            onPress={() => {
              this.props.didTapOnclose();
            }}
            style={styles.closeButtonView}>
            <Image
              source={Images.close}
              style={{width: 18, height: 18, tintColor: 'rgb(0,0,0)'}}
            />
          </TouchableOpacity>
        )}

        <Modal
          onBackButtonPress={() => this.setState({isSignUpViewShow: false})}
          isVisible={isSignUpViewShow}
          style={{margin: 0}}>
          <View style={{flex: 1}}>
            <SignUp
              didTapOnclose={() => this.props.didTapOnclose()}
              showLogin={true}
              isFromLogin={true}
              didTapOnSign={() => this.setState({isSignUpViewShow: false})}
            />
          </View>
        </Modal>

        <Modal
          isVisible={isForgotPasswordShow}
          //onBackdropPress={() => this.setState({ isForgotPasswordShow: false })}
          backdropOpacity={0.6}
          onBackButtonPress={() =>
            this.setState({isForgotPasswordShow: false})
          }>
          <View style={styles.passwordModalWrapper}>
            <View style={styles.passwordCardWrapper}>
              <Text style={styles.forgotPwdTxt}>
                {translate('Forgot your password?')}
              </Text>
              <View style={styles.inputContainerFull}>
                <TextInput
                  style={styles.forgotPwdinputs}
                  placeholder={translate('Enter your email Address')}
                  keyboardType="email-address"
                  returnKeyType={'done'}
                  onChangeText={value => this.setState({forgotEmail: value})}
                  underlineColorAndroid="transparent"
                />
              </View>
              {forgotEmailError !== '' && (
                <Text style={styles.errorText}>
                  {this.state.forgotEmailError}
                </Text>
              )}
              <View style={styles.pwdSubmitWrapper}>
                <TouchableOpacity
                  onPress={() => this.setState({isForgotPasswordShow: false})}
                  style={styles.pwdCancelWrapper}>
                  <Text style={styles.pwdCancelTxt}>{translate('Cancel')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this._didSubmitForgotPwd()}
                  style={styles.pwdSubmitBtnWrapper}>
                  <Text style={styles.pwdSubmitTxt}>{translate('Submit')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <Modal
          isVisible={showEmailUpdateView}
          //onBackdropPress={() => this.setState({ isForgotPasswordShow: false })}
          backdropOpacity={0.6}
          onBackButtonPress={() => this.setState({showEmailUpdateView: false})}>
          <View style={styles.passwordModalWrapper}>
            <View style={styles.passwordCardWrapper}>
              <Text style={styles.forgotPwdTxt}>
                {translate('Please enter your actual email address')}
              </Text>
              <View style={styles.inputContainerFull}>
                <TextInput
                  style={styles.forgotPwdinputs}
                  placeholder={translate('Enter your email Address')}
                  keyboardType="email-address"
                  returnKeyType={'done'}
                  onChangeText={value => this.setState({actualEmail: value})}
                  underlineColorAndroid="transparent"
                />
              </View>
              {actualEmailError !== '' && (
                <Text style={styles.errorText}>
                  {this.state.actualEmailError}
                </Text>
              )}
              <View style={styles.pwdSubmitWrapper}>
                <TouchableOpacity
                  onPress={this._didTapOnCancelUpdateOfActualEmail}
                  style={styles.pwdCancelWrapper}>
                  <Text style={styles.pwdCancelTxt}>{translate('Cancel')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this._didTapOnSubmitActualEmail()}
                  style={styles.pwdSubmitBtnWrapper}>
                  <Text style={styles.pwdSubmitTxt}>{translate('Submit')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {isLoading && <HudView />}
      </SafeAreaView>
    );
  }
}

export default LoginScreen;

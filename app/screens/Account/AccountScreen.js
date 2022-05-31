/**
 * Created by Nithin for iLeaf Solutions Pvt.Ltd
 * on July 09, 2020
 * AccountScreen - Account Screen view
 */

import {
  Text,
  View,
  Image,
  Switch,
  Linking,
  FlatList,
  Platform,
  UIManager,
  StatusBar,
  ScrollView,
  SafeAreaView,
  LayoutAnimation,
  TouchableOpacity,
} from 'react-native';
import {
  statusCodes,
  GoogleSignin,
} from '@react-native-google-signin/google-signin';
import appleAuth, {
  AppleButton,
  AppleAuthError,
  AppleAuthRequestScope,
  AppleAuthRealUserStatus,
  AppleAuthCredentialState,
  AppleAuthRequestOperation,
} from '@invertase/react-native-apple-authentication';
import styles from './styles';
import HudView from '../../components/hudView';
import Login from '../LoginScreen';
import Modal from 'react-native-modal';
import RNFetchBlob from 'rn-fetch-blob';
import React, {Component} from 'react';
import Images from '../../config/images';
import {I18nManager} from 'react-native';
import RNRestart from 'react-native-restart';
import Constants from '../../config/constants';
import {LoginManager} from 'react-native-fbsdk';
// import {LoginManager} from 'react-native-fbsdk-next';
import SignUp from '../../screens/RegistrationScreen';
import analytics from '@react-native-firebase/analytics';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {LoginButton, AccessToken} from 'react-native-fbsdk';
import {
  showAlertWithCallback,
  showSingleAlert,
  addEventTracking,
} from '../../config/common';
import {translate} from '../../config/languageSwitching/index';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FingerprintScanner from 'react-native-fingerprint-scanner';
import NavigationHeader2 from '../../components/NavigationHeaders/NavigationHeader2';

var isLogoutTapped = false;

class AccountScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoginViewShow: false,
      isRegisterViewShow: false,
      expanded: false,
      indexVal: 0,
      isAPILoading: false,
      menu: [
        {
          id: 2,
          title: 'Contact us',
        },
        {
          id: 3,
          title: 'Change Language',
        },
        {
          id: 5,
          title: 'Others',
        },
      ],
      data: ['English', 'عربى'],
      checked: -1,
      toggle: false,
      isBiometricsAvailable: false,
      keppInTouchVisible: false,
    };
    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  async componentDidMount() {
    if (this.props.selectedLanguage == 'ar') {
      this.setState({checked: 1});
    } else {
      this.setState({checked: 0});
    }

    FingerprintScanner.isSensorAvailable()
      .then(biometryType => {
        let menuList = [
          {
            id: 2,
            title: 'Contact us',
          },
          {
            id: 3,
            title: 'Change Language',
          },
          {id: 4, title: 'Privacy'},
          {
            id: 5,
            title: 'Others',
          },
        ];
        this.setState({isBiometricsAvailable: true, menu: menuList});
      })
      .catch(error => {
        this.setState({isBiometricsAvailable: false});
      });

    GoogleSignin.configure({
      hostedDomain: '',
      loginHint: '',
      forceConsentPrompt: true,
      accountName: '',
      iosClientId:
        '246798568353-9vopd2lj2jb1hhh4gpu8bvf0t5up972u.apps.googleusercontent.com',
    });
  }

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

  toggleExpand = (exp, index) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    if (this.state.expanded) {
      if (this.state.indexVal == index) {
        this.setState({expanded: false});
      } else {
        this.setState({expanded: true, indexVal: index});
      }
    } else {
      this.setState({expanded: true, indexVal: index});
    }
  };

  _onEnglishSelect = () => {
    this._didLanguageChange('en');
  };

  _onArabicSelect = () => {
    this._didLanguageChange('ar');
  };

  _didLanguageChange = lang => {
    const {
      selectedLanguage,
      didChangeLAnguage,
      storesView,
      storeCode,
      storeConfiguration,
    } = this.props;
    if (selectedLanguage === lang) {
      return;
    }

    // let groupId = -1;
    // let newStoreCode = "";
    // if (storesView && storesView.length > 0) {
    //   storesView.map((item) => {
    //     if (item.code === storeCode) {
    //       groupId = item.store_group_id;
    //     }
    //   });
    //   let savedLang = storeCode.slice(-2);
    //   const newLang = savedLang === "en" ? "Arabic" : "English";
    //   storesView.map((item) => {
    //     if (
    //       item.name.toUpperCase() === newLang.toUpperCase() &&
    //       item.store_group_id === groupId
    //     ) {
    //       newStoreCode = item.code;
    //     }
    //   });
    //   this.props.storeCodeUpdated(newStoreCode);
    //   storeConfiguration.map((storeConfigItem) => {
    //     if (storeConfigItem.code === newStoreCode) {
    //       this.props.updateCurrency(
    //         storeConfigItem.default_display_currency_code
    //       );
    //     }
    //   });
    // }

    // this.props.storeCodeUpdated(lang === "ar" ? "arabic" : "default");

    didChangeLAnguage(selectedLanguage === 'ar' ? 'en' : 'ar');

    if (lang === 'ar') {
      I18nManager.forceRTL(true);
    } else {
      I18nManager.forceRTL(false);
    }

    setTimeout(() => {
      RNRestart.Restart();
    }, 1000);
  };

  _didTapOnCart = () => {
    this.props.navigation.navigate('Cart');
  };

  renderMenu = ({item, index}) => {
    const {isBiometricsAvailable} = this.state;
    const {isSocialMediaLogin} = this.props;
    const phoneNumber1 = '+96522070777';
    return (
      <View>
        <TouchableOpacity
          ref={this.accordian}
          style={styles.row}
          // onPress={() => this.toggleExpand()}
          onPress={this.toggleExpand.bind(this, item, index)}>
          {item.id == 1 && (
            <Text style={[styles.title]}>{translate('Your Account')}</Text>
          )}
          {item.id == 2 && (
            <Text style={[styles.title]}>{translate('Contact us')}</Text>
          )}
          {item.id == 3 && (
            <Text style={[styles.title]}>{translate('Change Language')}</Text>
          )}
          {item.id == 5 && (
            <Text style={[styles.title]}>{translate('Others')}</Text>
          )}
          {item.id == 4 && (
            <Text style={[styles.title]}>{translate('Privacy')}</Text>
          )}
          <Image
            source={Images.backButton}
            resizeMode={'contain'}
            style={{
              width: 15,
              height: 15,
              transform: [
                {
                  rotate:
                    this.state.expanded && index === this.state.indexVal
                      ? '90deg'
                      : '270deg',
                },
              ],
            }}
          />
        </TouchableOpacity>
        <View style={styles.parentHr} />
        {this.state.expanded && index === this.state.indexVal && (
          <View style={styles.child}>
            {item.id === 1 && (
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate('Overview')}
                style={styles.itemContainer}>
                <Image source={Images.overview} style={styles.itemLogo} />
                <Text style={styles.itemText}>{translate('Overview')}</Text>
              </TouchableOpacity>
            )}
            {item.id === 1 && (
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate('OrderHistory')}
                style={styles.itemContainer}>
                <Image source={Images.orderHistory} style={styles.itemLogo} />
                <Text style={styles.itemText}>
                  {translate('Order History')}
                </Text>
              </TouchableOpacity>
            )}

{item.id === 1 && (
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate('TrackYourOrder')}
                style={styles.itemContainer}>
                <Image source={Images.trackOrders} style={styles.itemLogo} />
                <Text style={styles.itemText}>
                  {translate('Track Your Order')}
                </Text>
              </TouchableOpacity>
            )}

            {item.id === 1 && (
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate('AddressListScreen');
                }}
                style={styles.itemContainer}>
                <Image source={Images.addressBook} style={styles.itemLogo} />
                <Text style={styles.itemText}>{translate('Address Book')}</Text>
              </TouchableOpacity>
            )}

            
            {item.id === 1 &&
              (isSocialMediaLogin ? (
                <View />
              ) : ( 
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.navigate('ChangePasswordScreen');
                  }}
                  style={styles.itemContainer}>
                  <Image
                    source={Images.changePassword}
                    style={styles.itemLogo}
                  />
                  <Text style={styles.itemText}>
                    {translate('Change Password')}
                  </Text>
                </TouchableOpacity>
              ))}
            {item.id === 1 && (
              <TouchableOpacity
                onPress={() => {
                  if (isLogoutTapped) {
                    return;
                  }

                  isLogoutTapped = true;
                  setTimeout(() => {
                    isLogoutTapped = false;
                  }, 2000);

                  showAlertWithCallback(
                    translate('Are you sure you want to logout?'),
                    translate('Yes'),
                    translate('No'),
                    () => {
                      this.props.userDidLogOut();
                      this.setState({expanded: false});
                      // this.props.navigation.navigate("LoginScreen");
                    },
                    null,
                  );
                }}
                style={styles.itemContainer}>
                <Image source={Images.signOut} style={styles.itemLogo} />
                <Text style={styles.itemText}>{translate('Sign Out')}</Text>
              </TouchableOpacity>
            )}
            {item.id === 2 && (
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate('OthersScreen', {
                    heading: translate('Chat with Us'),
                    url: Constants.CHAT_TAWK_URL,
                    // "https://tawk.to/chat/5d6e3db677aa790be3322605/1ekoem6kc",
                    // "https://tawk.to/chat/5faa638d0a68960861bd7cc6/default",
                  });
                }}
                style={styles.itemContainer}>
                <Image source={Images.chatWithUs} style={styles.itemLogo} />
                <Text style={styles.itemText}>{translate('Chat with Us')}</Text>
              </TouchableOpacity>
            )}
            {item.id === 2 && (
              <TouchableOpacity
                onPress={() => {
                  this._didTapOnPhoneCall(phoneNumber1);
                }}
                style={styles.itemContainer}>
                <Image source={Images.callUs} style={styles.itemLogo} />
                <Text style={styles.itemText}>{translate('Call Us')}</Text>
              </TouchableOpacity>
            )}
            {item.id === 2 && (
              <TouchableOpacity
                onPress={() => {
                  this.setState({keppInTouchVisible: true});
                }}
                style={styles.itemContainer}>
                <Image source={Images.keepInTouch} style={styles.itemLogo} />
                <Text style={styles.itemText}>
                  {translate('Keep in Touch')}
                </Text>
              </TouchableOpacity>
            )}
            {item.id === 2 && (
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate('ReachUsScreen');
                }}
                style={styles.itemContainer}>
                <Image source={Images.reachUs} style={styles.itemLogo} />
                <Text style={styles.itemText}>{translate('Reach Us')}</Text>
              </TouchableOpacity>
            )}
            {item.id === 3 &&
              this.state.data.map((data, key) => {
                return (
                  <View>
                    {this.state.checked == key ? (
                      <TouchableOpacity style={styles.itemContainer}>
                        {data == 'English' ? (
                          <Image
                            source={Images.english}
                            style={styles.itemLogo}
                          />
                        ) : (
                          <Image
                            source={Images.arabic}
                            style={styles.itemLogo}
                          />
                        )}

                        <Text style={styles.itemText}>{data}</Text>
                        <Image
                          style={styles.radioImg}
                          source={Images.radioChecked}
                        />
                        <View style={key == 0 && styles.line2} />
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        style={styles.itemContainer}
                        onPress={() => {
                          this.setState({checked: key});
                          data === 'English'
                            ? this._onEnglishSelect()
                            : this._onArabicSelect();
                        }}>
                        {data == 'English' ? (
                          <Image
                            source={Images.english}
                            style={styles.itemLogo}
                          />
                        ) : (
                          <Image
                            source={Images.arabic}
                            style={styles.itemLogo}
                          />
                        )}
                        <Text style={styles.itemText}>{data}</Text>
                        <Image
                          style={styles.radioImg}
                          source={Images.radioUnchecked2}
                        />
                        <View style={key == 0 && styles.line2} />
                      </TouchableOpacity>
                    )}
                  </View>
                );
              })}

            {item.id === 5 && (
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate('OthersScreen', {
                    heading: translate('About Us'),
                    url: 'https://fairyhub.com/en/mobile/about-us',
                  });
                }}
                style={styles.itemContainer}>
                <Image source={Images.FAQ} style={styles.itemLogo} />
                <Text style={styles.itemText}>{translate('About Us')}</Text>
              </TouchableOpacity>
            )}
            {item.id === 5 && (
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate('OthersScreen', {
                    heading: translate('Our Terms'),
                    url: 'https://fairyhub.com/en/mobile/terms-conditions',
                  });
                }}
                style={styles.itemContainer}>
                <Image source={Images.ourTerms} style={styles.itemLogo} />
                <Text style={styles.itemText}>{translate('Our Terms')}</Text>
              </TouchableOpacity>
            )}
            {item.id === 5 && (
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate('OthersScreen', {
                    heading: translate('Shipment and Delivery Policy'),
                    url: 'https://fairyhub.com/en/mobile/shipment-and-return-policy',
                  });
                }}
                style={styles.itemContainer}>
                <Image source={Images.shipment} style={styles.itemLogo} />
                <Text style={styles.itemText}>
                  {translate('Shipment and Delivery Policy')}
                </Text>
              </TouchableOpacity>
            )}
            {item.id === 5 && (
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate('OthersScreen', {
                    heading: translate('Privacy Policy'),
                    url: 'https://fairyhub.com/en/mobile/privacy-policy',
                  });
                }}
                style={styles.itemContainer}>
                <Image source={Images.privacyPolicy} style={styles.itemLogo} />
                <Text style={styles.itemText}>
                  {translate('Privacy Policy')}
                </Text>
              </TouchableOpacity>
            )}
            {item.id === 5 && (
              <View>
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.navigate('OthersScreen', {
                      heading: translate('FAQ'),
                      url: 'https://fairyhub.com/en/mobile/faqs',
                    });
                  }}
                  style={styles.itemContainer}>
                  <Image source={Images.aboutUs} style={styles.itemLogo} />
                  <Text style={styles.itemText}>{translate('FAQ')}</Text>
                </TouchableOpacity>
                <Text style={styles.version}>
                  {'Version: ' + Constants.APP_VERSION}
                </Text>
                <View style={{height: 30}} />
              </View>
            )}
            {isBiometricsAvailable && item.id === 4 && (
              <View style={styles.itemContainer}>
                <Image source={Images.fingerPrint} style={styles.itemLogo} />
                <Text style={styles.itemText}>{translate('fingerPrint')}</Text>
                <Switch
                  trackColor={{false: 'gray', true: 'rgb(230,230,230)'}}
                  style={{position: 'absolute', right: 20, top: 5}}
                  thumbColor="rgb(64,155,246)"
                  ios_backgroundColor="gray"
                  onValueChange={value =>
                    this.props.onChangeBiometricAuthStatus(value)
                  }
                  value={this.props.enableBiometricAuth}
                />
              </View>
            )}
          </View>
        )}
      </View>
    );
  };

  /** FB Login */
  _onFBLoginPress = () => {
    this.setState({isAPILoading: true});

    LoginManager.logOut();
    LoginManager.logInWithPermissions(['public_profile', 'email']).then(
      result => {
        if (result.isCancelled) {
          console.log('Login cancelled');
          this.setState({isAPILoading: false});
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
                this.setState({isAPILoading: false});
              });
          });
        }
      },
      function (error) {
        console.log('Login fail with error: ' + error);
        this.setState({isAPILoading: false});
      },
    );
  };

  /** Google Login */
  _onGoogleLoginPress = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      this.setState({isAPILoading: true});
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
      this.setState({isAPILoading: false});

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
    this.setState({isAPILoading: true});
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

        console.log('PARAMS======', params);

        this.props.socialMediaLogin(params, this._loginCallback);
      }
    } catch (error) {
      console.log('!!!ERROR', error);
      this.setState({isAPILoading: false});

      if (error.code === AppleAuthError.CANCELED) {
        console.warn('User canceled Apple Sign in.');
      } else {
        // console.error(error);
      }
    }
  };

  _loginCallback = (status, showAlert, loginResponse) => {
    this.setState({isAPILoading: false});

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

      if (loginResponse && loginResponse.length > 0) {
        let userDict = loginResponse[0].customerdetails;
        let email = userDict.customer_email;
        if (userDict.media === 'apple' && email.indexOf('appleid.com') > -1) {
          // this.setState({ showEmailUpdateView: true });
          // this.props.didTapOnclose();
          console.log('--------NOT AN ACTUAL EMAIL----------');
        } else {
          // this.setState({ showEmailUpdateView: true });
          // this.props.didTapOnclose();
        }
      } else {
        // this.props.didTapOnclose();
      }
    } else {
      if (showAlert) {
        showAlertWithCallback(
          'Something went wrong, please login again',
          'Ok',
          'Continue as guest',
          () => {},
          () => {
            // this.props.didTapOnclose();
          },
        );
      }
      this.props.userDidLogOut();
    }
  };
  _didTapOnWhatsapp = () => {
    // let link = `whatsapp://send?&phone=${phone}`;
    let whatsappNumber = '+965 98732422'; //'+96592213401';
    let link = 'https://wa.me/' + whatsappNumber;
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

  _didTapOnOpenFB = () => {
    const fbAppLink =
      Platform.OS === 'ios'
        ? 'fb://profile/2146472888998913'
        : 'fb://page/2146472888998913/';
    const fbPageLink = 'https://www.facebook.com/Fairyhub-2146472888998913/';

    Linking.canOpenURL(fbAppLink).then(supported => {
      console.log('SUPPO', supported);
      if (supported) {
        return Linking.openURL(fbAppLink);
      } else {
        return Linking.openURL(fbPageLink);
      }
    });
  };

  render() {
    const {
      selectedLanguage,
      isRTL,
      userToken,
      userInfo,
      cartArray,
      storeCode,
      appLogoUrl,
      guestToken,
    } = this.props;
    const {
      isAPILoading,
      isLoginViewShow,
      isRegisterViewShow,
      keppInTouchVisible,
    } = this.state;

    let obj = {
      id: 1,
      title: 'Your Account',
    };

    let dirs = RNFetchBlob.fs.dirs;
    let path = '';
    if (Constants.IS_ANDROID) {
      path = 'file:///' + dirs.DocumentDir + '/appLogo.png';
    } else {
      path = dirs.DocumentDir + '/appLogo.png';
    }

    return (
      <SafeAreaView style={styles.safeContainer}>
        <StatusBar
          // barStyle="dark-content"
          hidden={false}
          backgroundColor={Constants.APP_WHITE_COLOR}
          // translucent={true}
        />
        <NavigationHeader2
          hideBottomLine
          didTapOnFlag={this._didTapOnFlag}
          didTapOnCart={this._didTapOnCart}
          isShowFlag={false}
          isDark={false}
          isRTL={isRTL}
          showCart={true}
          hideSearch={true}
          cartItemsCount={cartArray.length}
          appLogoUrl={path}
        />

        <FlatList
          data={[1]}
          style={{flex: 1, backgroundColor: Constants.APP_WHITE_COLOR}}
          renderItem={() => {
            return (
              <View>
                <View style={styles.scrollContainer}>
                  {userToken && userToken.length > 0 && userInfo ? (
                    <View
                      style={styles.userInfoContainer}
                      // onPress={() => this.props.navigation.navigate("ProfileDetails")}
                    >
                      <Image
                        style={styles.profileEdit}
                        source={Images.profileEdit}
                      />
                      <Text style={styles.userNameText}>
                        {userInfo.firstname + ' ' + userInfo.lastname}
                      </Text>
                      <Text style={styles.userEmailText}>{userInfo.email}</Text>
                      <View>
                        <TouchableOpacity
                          style={styles.addButtonStyle}
                          activeOpacity={0.7}
                          onPress={() => {
                            this.props.navigation.navigate('ProfileDetails');
                          }}>
                          <Text style={styles.addText}>
                            {translate('Edit')}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ) : (
                    <View>
                      <View style={styles.noUserContainer}>
                        <TouchableOpacity
                          onPress={() => this.setState({isLoginViewShow: true})}
                          style={styles.buttonLogin}>
                          <Text style={styles.socialName}>
                            {translate('SIGN IN')}
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() =>
                            this.setState({isRegisterViewShow: true})
                          }
                          style={styles.buttonSignup}>
                          <Text
                            style={[
                              styles.socialName,
                              {color: 'rgb(241, 73, 53)'},
                            ]}>
                            {translate('SIGN UP')}
                          </Text>
                        </TouchableOpacity>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginHorizontal: 20,
                          marginBottom: 20,
                        }}>
                        <View style={styles.line2} />
                        <Text style={styles.loginWith}>Or Login With</Text>
                        <View style={styles.line2} />
                      </View>

                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginHorizontal: 20,
                          marginBottom: 20,
                        }}>
                        <TouchableOpacity
                          onPress={this._onFBLoginPress}
                          style={styles.fbStyle}>
                          <Image
                            source={Images.profile_facebook}
                            style={styles.socialIcon}
                            resizeMode={'contain'}
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={this._onGoogleLoginPress}
                          style={styles.googleStyle}>
                          <Image
                            source={Images.profile_google}
                            style={styles.socialIcon}
                            resizeMode={'contain'}
                          />
                        </TouchableOpacity>

                        {!Constants.IS_ANDROID && (
                          <TouchableOpacity
                            onPress={this._onAppleLoginPress}
                            style={styles.appleStyle}>
                            <Image
                              source={Images.profile_apple}
                              style={styles.socialIcon}
                              resizeMode={'contain'}
                            />
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                  )}

                  <View style={[styles.line]} />
                  <FlatList
                    data={
                      userInfo
                        ? [...[obj], ...this.state.menu]
                        : this.state.menu
                    }
                    renderItem={this.renderMenu}
                    keyExtractor={(item, index) => index.toString()}
                  />
                  {guestToken !== '' && userToken == '' && (
                    <TouchableOpacity
                      onPress={() => {
                        if (isLogoutTapped) {
                          return;
                        }

                        isLogoutTapped = true;
                        setTimeout(() => {
                          isLogoutTapped = false;
                        }, 2000);

                        showAlertWithCallback(
                          translate('Are you sure you want to logout?'),
                          translate('Yes'),
                          translate('No'),
                          () => {
                            this.props.userDidLogOut();
                            this.setState({expanded: false});
                            // this.props.navigation.navigate("LoginScreen");
                          },
                          null,
                        );
                      }}
                      style={[
                        styles.itemContainer,
                        {marginLeft: 15, marginTop: 10},
                      ]}>
                      <Image source={Images.signOut} style={styles.itemLogo} />
                      <Text style={styles.itemText}>
                        {translate('Sign Out')}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          }}></FlatList>

        <Modal
          onBackButtonPress={() => this.setState({isLoginViewShow: false})}
          isVisible={isLoginViewShow}
          style={{margin: 0}}>
          <View style={{flex: 1}}>
            <Login
              didTapOnclose={() => this.setState({isLoginViewShow: false})}
            />
          </View>
        </Modal>
        <Modal
          onBackButtonPress={() => this.setState({isRegisterViewShow: false})}
          isVisible={isRegisterViewShow}
          style={{margin: 0}}>
          <View style={{flex: 1}}>
            <SignUp
              didTapOnclose={() => this.setState({isRegisterViewShow: false})}
              showLogin={false}
            />
          </View>
        </Modal>
        <Modal
          isVisible={keppInTouchVisible}
          onBackdropPress={() => this.setState({keppInTouchVisible: false})}
          backdropOpacity={0.6}
          onBackButtonPress={() => this.setState({keppInTouchVisible: false})}>
          <View style={styles.passwordModalWrapper}>
            <View style={styles.passwordCardWrapper}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginVertical: 10,
                }}>
                <Text style={styles.keepInTouchPopUptext}>
                  {translate('Keep in Touch')}
                </Text>
                <TouchableOpacity
                  onPress={() => this.setState({keppInTouchVisible: false})}>
                  <Image source={Images.close} style={styles.popUpClose} />
                </TouchableOpacity>
              </View>

              <View
                style={{
                  height: 60,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginHorizontal: 20,
                }}>
                <TouchableOpacity onPress={this._didTapOnOpenFB}>
                  <Image
                    style={styles.socialMediaIcons}
                    source={Images.facebook}
                  />
                </TouchableOpacity>
                {/* <TouchableOpacity
                  onPress={() =>
                    Linking.openURL('https://twitter.com/fairyhub')
                  }>
                  <Image
                    style={styles.socialMediaIcons}
                    source={Images.twitter}
                  />
                </TouchableOpacity> */}
                {/* <TouchableOpacity
                  onPress={() =>
                    Linking.openURL(
                      'https://plus.google.com/u/0/110134573117564534526',
                    )
                  }>
                  <Image
                    style={styles.socialMediaIcons}
                    source={Images.googlePlus}
                  />
                </TouchableOpacity> */}
                {/* <TouchableOpacity
                  onPress={() =>
                    Linking.openURL('https://in.pinterest.com/fairyhub/')
                  }>
                  <Image
                    style={styles.socialMediaIcons}
                    source={Images.pinterest}
                  />
                </TouchableOpacity> */}
                <TouchableOpacity onPress={this._didTapOnWhatsapp}>
                  <Image
                    style={styles.socialMediaIcons}
                    source={Images.whatsapp}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    Linking.openURL('https://www.instagram.com/fairyhub/')
                  }>
                  <Image
                    style={styles.socialMediaIcons}
                    source={Images.instagram}
                  />
                </TouchableOpacity>
              </View>

              {/* <View style={styles.pwdSubmitWrapper}>
                <TouchableOpacity
                  onPress={() => this.setState({ keppInTouchVisible: false })}
                  style={styles.pwdCancelWrapper}
                >
                  <Text style={styles.pwdCancelTxt}>{translate("Cancel")}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this._didSubmitForgotPwd()}
                  style={styles.pwdSubmitBtnWrapper}
                >
                  <Text style={styles.pwdSubmitTxt}>{translate("Submit")}</Text>
                </TouchableOpacity>
              </View> */}
            </View>
          </View>
        </Modal>
        {isAPILoading && <HudView />}
      </SafeAreaView>
    );
  }
}

export default AccountScreen;

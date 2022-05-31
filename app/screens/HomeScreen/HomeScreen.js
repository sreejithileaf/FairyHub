/**
 * Created by Nithin for iLeaf Solutions Pvt.Ltd
 * on July 14, 2020
 * HomeScreen - HomeScreen view
 */

import {
  View,
  Text,
  Image,
  Alert,
  FlatList,
  Linking,
  StatusBar,
  ScrollView,
  BackHandler,
  SafeAreaView,
  NativeModules,
  ActivityIndicator,
  DeviceEventEmitter,
  PermissionsAndroid,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {
  isEmpty,
  normalizedWidth,
  normalizedHeight,
  showSimpleSnackbar,
  showAlertWithCallback,
} from '../../config/common';
import styles from './styles';
import Login from '../LoginScreen';
import Modal from 'react-native-modal';
import React, {Component} from 'react';
import Images from '../../config/images';
import {I18nManager} from 'react-native';
import RNRestart from 'react-native-restart';
// import HSNZ from "react-native-hsnz-marquee";
import Constants from '../../config/constants';
import HudView from '../../components/hudView';
import ActionSheet from 'react-native-actionsheet';
import ImageLoader from 'react-native-image-progress';
import {showSingleAlert} from '../../config/common';
import ProductCell4 from '../../components/productCell4';
import CircleButton from '../../components/circleButton';
import {translate} from '../../config/languageSwitching/index';
import NavigationHeader2 from '../../components/NavigationHeaders/NavigationHeader2';
import NavigationHeader from '../../components/NavigationHeaders/NavigationHeader1';
import TextTicker from 'react-native-text-ticker';
import RNFetchBlob from 'rn-fetch-blob';
import {WebView} from 'react-native-webview';
import ImageComponent from '../../components/ImageComponent';
// import dynamicLinks from "@react-native-firebase/dynamic-links";
import BrandCell from '../../components/brandCell';
const {width, height} = Dimensions.get('window');
/** Adds Item Component */

const AddsItem = React.memo(({item, index, didSelectAdd, props, state}) => {
  const {isHandset, orientation} = props;

  let isTab = !isHandset && orientation === 'LANDSCAPE';
  let newWidth = isTab
    ? (state.screenWidthOrientation * 50) / 100
    : state.screenWidthOrientation;
  let newHeight = newWidth * 0.663;
  return (
    <TouchableOpacity
      activeOpacity={Constants.ACTIVE_OPACITY}
      activeOpacity={1}
      onPress={() => {
        didSelectAdd(item);
      }}
      style={{
        width: state.screenWidthOrientation,
        height: newHeight,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
      }}>
      {/* <ImageLoader
        source={{ uri: props.appMediaBaseUrl + item.mobile_image }}
        defaultSource={Images.placeHolderProduct}
        resizeMode={"contain"}
        style={{
          width: props.screenWidth,
          // height: normalizedHeight(213),
          height: props.screenWidth * 0.663, //0.5208,
          // height: (props.screenWidth / 1.2) * 0.663, //0.5208,

          backgroundColor: Constants.APP_WHITE_COLOR,
        }}
      /> */}

      <ImageComponent
        source={{
          uri: props.appMediaBaseUrl + item.mobile_image,
        }}
        style={{
          width: newWidth,
          // height: normalizedHeight(213),
          height: newHeight, //0.5208,
          // height: (props.screenWidth / 1.2) * 0.663, //0.5208,
          backgroundColor: Constants.APP_WHITE_COLOR,
        }}
      />
    </TouchableOpacity>
  );
});

/** Catrgory Item Component */
const CategoryItem = React.memo(({item, index, didTapOnItem, end, props}) => {
  return (
    <TouchableOpacity
      activeOpacity={Constants.ACTIVE_OPACITY}
      onPress={() => {
        didTapOnItem(item);
      }}
      style={{
        alignItems: 'center',
        width: normalizedWidth(100),
        marginHorizontal: 7,
        marginVertical: 5,
        marginBottom: 20,
        height: normalizedWidth(props.isHandset ? 120 : 100),
      }}>
      <View style={{borderRadius: 5, overflow: 'hidden'}}>
        {/* <ImageLoader
          source={{ uri: props.appMediaBaseUrl + item.image }}
          resizeMode={"contain"}
          defaultSource={Images.placeHolderProduct}
          style={{
            width:
              Constants.SCREEN_HEIGHT < 660
                ? normalizedWidth(63)
                : normalizedWidth(90),
            height:
              Constants.SCREEN_HEIGHT < 660
                ? normalizedWidth(63)
                : normalizedWidth(90),
            borderRadius: 5,
            borderColor: Constants.APP_GRAY_COLOR,
          }}
        /> */}

        <ImageComponent
          source={{uri: props.appMediaBaseUrl + item.image}}
          style={{
            width:
              Constants.SCREEN_HEIGHT < 660
                ? normalizedWidth(63)
                : normalizedWidth(90),
            height:
              Constants.SCREEN_HEIGHT < 660
                ? normalizedWidth(63)
                : normalizedWidth(90),
            borderRadius: 5,
            borderColor: Constants.APP_GRAY_COLOR,
          }}
        />
      </View>

      {/* {item.name.length > 19 ? (
        <HSNZ
          style={{ width: 100, height: 120 }}
          onEnd={() => {
            end();
          }}
          loop={-1}
          direction={"rtl"}
          autoPlay={true}
          speed={30}
        >
          <Text numberOfLines={1} style={styles.categoryTitle}>
            {item.name}
          </Text>
        </HSNZ>
      ) : (
        <Text style={styles.categoryTitle}>{item.name}</Text>
      )} */}
      <Text style={styles.categoryTitle}>{item.name}</Text>
    </TouchableOpacity>
  );
});

const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
  const paddingToBottom = 20;
  return (
    layoutMeasurement.height + contentOffset.y >=
    contentSize.height - paddingToBottom
  );
};

class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addsArray: [],
      visibleAddIndex: 0,
      selectedAdsIndex: 0,
      isLoginViewShow: false,
      isPopUpViewShow: false,
      adViewShow: false,
      active: 0,
      countryFlag: '',
      bestSellerWishlist: [],
      promotionCategoryArray: [],
      promotionCategoryPageIndex: 1,
      promotionCategoryPageCount: 3,
      isPendingPromotionCategories: true,
      isPromotionCategoryAPICalling: false,
      topBrands: [],
      isShowResetPasswordView: false,
      resetPasswordUrl: '',
      loaderVisible: false,
      screenHeightOrientation: height,
      screenWidthOrientation: width,
    };
  }

  componentDidMount() {
    global.isRTL = this.props.isRTL;
    Dimensions.addEventListener('change', e => {
      const {width, height} = e.window;
      this.setState({
        screenHeightOrientation: height,
        screenWidthOrientation: width,
      });
    });
    this.props.loadHomePage(data => {
      if (data && data.length > 0) {
        let buildVersion = data[2];
        let version = buildVersion.build_version[0];

        let topBrands = [];
        data.map(dta => {
          let dictKeys = Object.keys(dta);
          dictKeys.map(dictKey => {
            if (dictKey === 'brands') {
              topBrands = dta.brands;
            }
          });
        });

        if (topBrands.length > 0) {
          this.setState({topBrands});
        }

        let showPopUpBanner = true;

        let locale;
        if (Constants.IS_ANDROID) {
          locale = NativeModules.I18nManager.localeIdentifier;
        } else {
          locale =
            NativeModules.SettingsManager.settings.AppleLocale ||
            NativeModules.SettingsManager.settings.AppleLanguages[0];
        }

        if (locale === 'ar_KW' && !this.props.isLocalizationSet) {
          showPopUpBanner = false;

          showAlertWithCallback(
            translate('Please_select_your_language'),
            translate('ARABIC'),
            'English',
            () => {
              this.props.updateLocalizationStatus(true);
              this._didLanguageChange('ar');
            },
            () => {
              this.props.updateLocalizationStatus(true);
              showPopUpBanner = true;
            },
          );
        } else {
          if (version.status == 'Update') {
            let versionNo = Constants.IS_ANDROID
              ? version.android_version
              : version.ios_version;
            let substrings = versionNo.split('.');

            if (substrings.length == 3) {
              let isForceUpdate = false;
              let isNormalUpdate = false;

              let existingVersion = Constants.IS_ANDROID
                ? Constants.APP_VERSION_ANDROID
                : Constants.APP_VERSION_IOS;
              let substringsExisting = existingVersion.split('.');

              if (Number(substrings[0]) != Number(substringsExisting[0])) {
                isForceUpdate = true;
              } else if (
                Number(substrings[1]) != Number(substringsExisting[1])
              ) {
                isForceUpdate = true;
              } else if (
                Number(substrings[2]) != Number(substringsExisting[2])
              ) {
                isNormalUpdate = true;
              }

              if (isForceUpdate) {
                showPopUpBanner = false;
                this.props.navigation.navigate('AppUpdateScreen', {
                  message: version.comment,
                  type: 'update',
                });
              } else if (isNormalUpdate) {
                showPopUpBanner = false;
                showAlertWithCallback(
                  'A new version of this app is available, do you want to update?',
                  'Skip',
                  'Update',
                  () => {
                    this.getPopup();
                  },
                  () => {
                    if (Constants.IS_ANDROID) {
                      Linking.canOpenURL(`market://details?id=com.fairyhub.app`)
                        .then(() => {
                          Linking.openURL(
                            `market://details?id=com.fairyhub.app`,
                          );
                        })
                        .catch();
                    } else {
                      Linking.canOpenURL(
                        `itms-apps://itunes.apple.com/us/app/id1422685012?mt=8`,
                      )
                        .then(() => {
                          Linking.openURL(
                            `itms-apps://itunes.apple.com/us/app/id1422685012?mt=8`,
                          );
                        })
                        .catch();
                    }
                  },
                );
              }
            }
          } else if (version.status == 'Maintenance') {
            this.props.navigation.navigate('AppUpdateScreen', {
              message: version.comment,
              type: 'maintenance',
            });
            showPopUpBanner = false;
          } else {
            // this.props.getEnabledAdds((ads) => {
            //   if (!isEmpty(ads) && ads.length > 0) {
            //     setTimeout(() => {
            //       this.setState({ adViewShow: true, addsArray: ads });
            //     }, 5000);
            //   }
            // });
          }
        }

        if (showPopUpBanner) {
          this.getPopup();
        }
      }
    });

    this._getPromotionCategories();

    this._requestPermission();
    this._requestPermissionRead();

    const {bestSellersArray, wishList} = this.props;

    let mArray = [];
    wishList.map(wishItem => {
      mArray.push(wishItem.productId);
    });
    this.setState({bestSellerWishlist: mArray});

    setInterval(() => {
      const {bannerArray} = this.props;
      const {selectedAdsIndex} = this.state;
      const isLastItem = bannerArray.length == selectedAdsIndex;
      this._scrollToIndex(
        selectedAdsIndex,
        bannerArray.length != selectedAdsIndex,
      );
      this.setState({
        selectedAdsIndex:
          bannerArray.length - 1 == selectedAdsIndex ? 0 : selectedAdsIndex + 1,
      });
    }, 2000);

    this.willFocus = this.props.navigation.addListener('willFocus', payload => {
      BackHandler.addEventListener(
        'hardwareBackPress',
        this.handleBackButtonClick,
      );
    });
    this.willBlur = this.props.navigation.addListener('willBlur', payload => {
      BackHandler.removeEventListener(
        'hardwareBackPress',
        this.handleBackButtonClick,
      );
    });

    if (this.props.guestToken !== '' && this.props.userToken == '') {
      this.props.checkGuestSession();
    }
    this.unsubscribe();

    if (global.pushNotificationDict) {
      switch (global.pushNotificationDict.type) {
        case 'product':
          this.props.navigation.navigate('ProductDetail', {
            sku: global.pushNotificationDict.data,
          });
          break;

        case 'category':
          this.props.navigation.navigate('ProductListFromCategory', {
            selectedSubCategoryId: global.pushNotificationDict.data,
            categoryName: '',
            isFromHome: true,
          });
          break;
      }
    } else {
      // console.log("NO PUSH DATA");
    }

    global.pushNotificationDict = null;

    if (Platform.OS === 'android') {
      Linking.getInitialURL().then(url => {
        this.navigate(url);
      });
      Linking.addEventListener('url', this.handleOpenURL);
    } else {
      Linking.addEventListener('url', this.handleOpenURL);
      Linking.getInitialURL().then(url => {
        this.navigate(url);
      });
    }

    DeviceEventEmitter.addListener('PUSH_NOTIFICATION_OPEN', event => {
      this.props.navigation.navigate('Tab');

      setTimeout(() => {
        switch (global.pushNotificationDict.type) {
          case 'product':
            this.props.navigation.navigate('ProductDetail', {
              sku: global.pushNotificationDict.data,
            });
            break;

          case 'category':
            this.props.navigation.navigate('ProductListFromCategory', {
              selectedSubCategoryId: global.pushNotificationDict.data,
              categoryName: '',
              isFromHome: true,
            });
            break;
        }
      }, 500);
    });
  }

  unsubscribe = () => {
    // dynamicLinks().onLink((link) => {
    //   // console.log("link----", link);
    // });
  };

  getPopup = () => {
    this.props.getEnabledAdds(ads => {
      if (!isEmpty(ads) && ads.length > 0) {
        setTimeout(() => {
          this.setState({adViewShow: true, addsArray: ads});
        }, 5000);
      }
    });
  };

  componentWillUnmount() {
    this.willFocus.remove();
    this.willBlur.remove();
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick,
    );
    Linking.removeEventListener('url', this.handleOpenURL);
    this.unsubscribe();
    DeviceEventEmitter.removeListener('PUSH_NOTIFICATION_OPEN');
  }

  _getPromotionCategories = () => {
    const {
      promotionCategoryPageCount,
      promotionCategoryPageIndex,
      isPromotionCategoryAPICalling,
    } = this.state;

    if (isPromotionCategoryAPICalling) {
      return;
    }

    this.setState({isPromotionCategoryAPICalling: true});

    let params = {
      page: promotionCategoryPageIndex,
      limit: promotionCategoryPageCount,
      plimit: '6',
    };
    this.props.getPromotionCategories(params, promotionCategories => {
      this.setState({isPromotionCategoryAPICalling: false});
      if (promotionCategories) {
        const {promotionCategoryArray} = this.state;

        if (promotionCategories.length > 0) {
          let tempArray = [];
          promotionCategories.map(catItem => {
            catItem['isLoading'] = false;
            catItem['pageIndex'] = 2;
            catItem['isLoadMore'] = true;
            tempArray.push(catItem);
          });
          this.setState({
            promotionCategoryArray: [...promotionCategoryArray, ...tempArray],
            isPendingPromotionCategories: true,
            promotionCategoryPageIndex: promotionCategoryPageIndex + 1,
          });
        } else {
          this.setState({isPendingPromotionCategories: false});
        }
      }
    });
  };

  _getPromotionProducts = (data, index) => {
    if (data.isLoading) {
      return;
    }

    if (!data.isLoadMore) {
      return;
    }

    let promotionCategoryArray = this.state.promotionCategoryArray;
    let obj = promotionCategoryArray[index];

    obj.isLoading = true;
    promotionCategoryArray[index] = obj;
    this.setState({promotionCategoryArray: promotionCategoryArray});

    let params = {
      page: data.pageIndex,
      limit: '6',
      category_id: data.category_id,
    };
    this.props.getPromotionProducts(params, (status, products) => {
      if (status && products) {
        let promotionCategoryArray = this.state.promotionCategoryArray;
        let obj = promotionCategoryArray[index];

        obj.isLoading = false;
        obj.isLoadMore = products.length == 0 ? false : true;
        obj.pageIndex = obj.pageIndex + 1;

        if (products.length > 0) obj.products = [...obj.products, ...products];

        promotionCategoryArray[index] = obj;
        this.setState({promotionCategoryArray: promotionCategoryArray});
      } else {
        let promotionCategoryArray = this.state.promotionCategoryArray;
        let obj = promotionCategoryArray[index];
        obj.isLoading = false;
        promotionCategoryArray[index] = obj;
        this.setState({promotionCategoryArray: promotionCategoryArray});
      }
    });
  };

  _requestPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission',
          message: 'App needs access to memory to download the app logo ',
        },
      );
      // if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      //   Alert.alert(
      //     "Permission granted - write",
      //     "Now you can download anything!"
      //   );
      // } else {
      //   Alert.alert(
      //     "Permission Denied!",
      //     "You need to give storage permission to download the file"
      //   );
      // }
    } catch (err) {
      console.warn(err);
    }
  };

  _requestPermissionRead = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission',
          message: 'App needs access to memory to read the app logo ',
        },
      );
      // if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      //   Alert.alert(
      //     "Permission granted-READ",
      //     "Now you can download anything!"
      //   );
      // } else {
      //   Alert.alert(
      //     "Permission Denied!",
      //     "You need to give storage permission to download the file"
      //   );
      // }
    } catch (err) {
      console.warn(err);
    }
  };

  handleOpenURL = event => {
    global.isDeepLinkOpenResetPassword = false;
    global.isDeepLinkOpenAccountConfirm = false;
    this.navigate(event.url);
  };

  navigate = urlTemp => {
    // if (url.length > 0) {
    //   this.setState({ isLoginViewShow: true });
    // }

    const {isRTL} = this.props;

    var url = isRTL ? urlTemp.replace('/en/', '/ar/') : urlTemp;

    //URL TYPE: product detail
    if (url.indexOf('/catalogue/') > -1) {
      let urlKey = url.substring(url.lastIndexOf('/') + 1);
      this.props.navigation.push('ProductDetail', {
        // sku: item.sku,
        urlKey: urlKey,
      });
    }
    //URL TYPE: product listing
    else if (url.indexOf('/product-list?') > -1) {
      let trimmedString = url.substring(url.indexOf('subcategoryId=') + 14);
      if (trimmedString.indexOf('&subcategory=') > -1) {
        trimmedString = trimmedString.substring(
          0,
          trimmedString.indexOf('&subcategory='),
        );
      }
      this.props.navigation.push('ProductListFromCategory', {
        selectedSubCategoryId: trimmedString,
        categoryName: '',
        isFromHome: true,
      });
    } else if (url.indexOf('/createPassword') > -1) {
      if (global.isDeepLinkOpenResetPassword) {
        return;
      }
      this.setState({
        resetPasswordUrl: url,
        isLoginViewShow: false,
        isPopUpViewShow: false,
        adViewShow: false,
      });

      this.props.navigation.navigate('DeepLinkAuthScreen', {
        dataUrl: url,
        title: translate('reset password web view title'),
        type: 'RESET_PASSWORD',
      });
    } else if (url.indexOf('/confirm') > -1) {
      if (global.isDeepLinkOpenAccountConfirm) {
        return;
      }
      this.setState({
        resetPasswordUrl: url,
        isLoginViewShow: false,
        isPopUpViewShow: false,
        adViewShow: false,
      });

      this.props.navigation.navigate('DeepLinkAuthScreen', {
        dataUrl: url,
        title: translate('verify account web view title'),
        type: 'ACCOUNT_VERIFY',
      });
    } else {
      // console.log("%%%%%%%NOT FOUNT DEEPLINK%%%%%");
    }

    // reset password https://web-uat.fairyhub.com/en/createPassword?token=BcdD5D4at318oEDqcRc0o3j27Sxk4MVW
    // confirm account https://web-staging.fairyhub.com/en/confirm/?id=154&key=QDl6XPgvOh5CRWvF1uGn49C8faI42W5l&back_url=
  };

  handleBackButtonClick() {
    BackHandler.exitApp();
    return true;
  }

  _didTapOnFlag = () => {
    this.ActionSheet.show();
  };

  _didTapOnSearch = () => {
    this.props.navigation.navigate('Search');
    // this.props.navigation.navigate('ProductList');
  };

  end = () => {
    // console.log("end of play");
  };

  change = ({nativeEvent}) => {
    const slide = Math.ceil(
      nativeEvent.contentOffset.x / nativeEvent.layoutMeasurement.width,
    );
    if (slide !== this.state.active) {
      this.setState({active: slide});
    }
  };

  _ItemLoadMore() {}

  _didTapOnCart = () => {
    this.props.navigation.navigate('Cart');
  };

  _onViewableItemsChanged = ({viewableItems, changed}) => {
    if (viewableItems.length > 0)
      this.setState({
        visibleAddIndex: viewableItems[0].index,
        selectedAdsIndex: viewableItems[0].index,
      });
  };

  _getItemLayout = (data, index) => ({
    length: this.props.bannerArray.length,
    offset:
      this.props.orientation === 'LANDSCAPE'
        ? this.state.screenWidthOrientation * index
        : this.props.screenWidth * index,
    index,
  });

  _scrollToIndex = (index, animated) => {
    if (index < this.props.bannerArray.length && this.addsFlatListRef)
      this.addsFlatListRef.scrollToIndex({animated: animated, index: index});
  };

  addToBestSellerWishlistState = productId => {
    this.setState(prevState => ({
      bestSellerWishlist: [...prevState.bestSellerWishlist, productId],
    }));
  };

  removeFromBestSellerWishlistState = productId => {
    this.setState(prevState => ({
      bestSellerWishlist: prevState.bestSellerWishlist.filter(
        item => item !== productId,
      ),
    }));
  };

  _didTapOnLikeButton = (likeValue, productId) => {
    const {userToken, onDislikeTap, onLikeTap} = this.props;
    if (userToken.length > 0) {
      if (likeValue) {
        this.removeFromBestSellerWishlistState(productId);
        onDislikeTap(productId, status => {
          if (status) {
            showSimpleSnackbar(translate('Item removed from wishlist'));
          } else {
            this.addToBestSellerWishlistState(productId);
          }
        });
      } else {
        this.addToBestSellerWishlistState(productId);
        onLikeTap(productId, status => {
          if (status) {
            showSimpleSnackbar(translate('Item added to wishlist'));
          } else {
            this.removeFromBestSellerWishlistState(productId);
          }
        });
      }
    } else {
      showAlertWithCallback(
        translate('user_not_login'),
        translate('Login'),
        translate('Cancel'),
        () => {
          this.setState({isLoginViewShow: true});
        },
        null,
      );
    }
  };

  _didLanguageChange = lang => {
    const {selectedLanguage, didChangeLAnguage} = this.props;
    if (selectedLanguage === lang) {
      return;
    }

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

  _didSelectAdsItem = item => {
    const {categoryList} = this.props;
    this.setState({adViewShow: false});

    console.log('DDD', item);

    switch (item.banner_type) {
      case 'category_id':
        // const selectedCategory = categoryList.filter((category) => {
        //   return category.id == item.banner_type_value;
        // });

        // if (selectedCategory.length === 0) {
        //   // showSingleAlert("No product found in this category", "OK");
        // } else {
        //   this.props.navigation.navigate("ProductListFromCategory", {
        //     selectedSubCategoryId: item.banner_type_value,
        //     categoryName: selectedCategory[0].title,
        //     isFromHome: true,
        //   });
        // }

        this.props.navigation.navigate('ProductListFromCategory', {
          selectedSubCategoryId: item.banner_type_value,
          // selectedCategory[0].id,
          categoryName: '', // selectedCategory[0].title,
          isFromHome: true,
        });

        break;

      case 'product_sku':
        this.props.navigation.navigate('ProductDetail', {
          sku: item.banner_type_value,
        });
        break;

      case 'external_url':
        console.log('DDD');
        Linking.openURL(item.banner_type_value);
        break;

      default:
      // Alert.alert("PRODUCT TYPE NOT FOUND");
    }
  };

  _didTapOnAddToCart = productDetails => {
    const {userToken, guestToken, quoteID, cartArray} = this.props;

    let sku = productDetails.child
      ? productDetails.child.sku
      : productDetails.sku;

    if (cartArray.length >= Constants.MAX_CART_SIZE) {
      showSingleAlert(
        translate('cart count exceeds1') +
          Constants.MAX_CART_SIZE +
          translate('cart count exceeds2'),
      );
      return;
    }

    let isProductInCart = false;
    let cartProductInfo;
    if (cartArray.length > 0) {
      cartArray.map(item => {
        if (sku === item.sku) {
          isProductInCart = true;
          cartProductInfo = item;
        }
      });
    }

    if (isProductInCart) {
      let cartProductCount = cartProductInfo.qty;
      if (cartProductCount + 1 > Constants.MAX_PRODUCT_COUNT) {
        showSingleAlert(translate('product count max in detail screen'));
        return;
      }
    }

    if (userToken) {
      let colorId = '';
      let sizeId = '';
      let product_option = null;

      if (productDetails.child && productDetails.child.attributes) {
        let attributes = productDetails.child.attributes;
        colorId = attributes.color.attribute_value;
        sizeId = attributes.size.attribute_value;

        let optionArray = [];

        if (colorId) {
          optionArray.push({option_id: '93', option_value: colorId});
        }
        if (sizeId) {
          optionArray.push({
            option_id: '142',
            option_value: sizeId,
          });
        }

        product_option = {
          extension_attributes: {
            configurable_item_options: optionArray,
          },
        };
      }

      let params = {
        cart_item: {
          quote_id: quoteID,
          sku: sku,
          qty: 1,
        },
      };

      if (product_option) {
        params.cart_item['product_option'] = product_option;
      }

      this.props.addPtoCartForLoggedUser(params, (status, message) =>
        this._userAddedPtoCartCallback(status, message),
      );
    } else if (guestToken) {
      let colorId = '';
      let sizeId = '';
      let product_option = null;

      if (productDetails.child && productDetails.child.attributes) {
        let attributes = productDetails.child.attributes;
        colorId = attributes.color.attribute_value;
        sizeId = attributes.size.attribute_value;

        let optionArray = [];

        if (colorId) {
          optionArray.push({option_id: '93', option_value: colorId});
        }
        if (sizeId) {
          optionArray.push({
            option_id: '142',
            option_value: sizeId,
          });
        }

        product_option = {
          extension_attributes: {
            configurable_item_options: optionArray,
          },
        };
      }

      let params = {
        cart_item: {
          quote_id: guestToken,
          sku: sku,
          qty: 1,
        },
      };

      if (product_option) {
        params.cart_item['product_option'] = product_option;
      }

      this.props.guestAddToCart(params, status =>
        this._guestAddToCartCallback(status),
      );
    } else {
      this.props.createGuestCart(status =>
        this._createGuestCartCallback(status, productDetails),
      );
    }
  };

  _createGuestCartCallback = (status, productDetails) => {
    setTimeout(() => {
      if (status) this._didTapOnAddToCart(productDetails);
    }, 500);
  };

  _userAddedPtoCartCallback = (status, message) => {
    if (status) {
      showSimpleSnackbar(translate('Product added to cart'));
    } else {
      showSingleAlert(message);
    }
  };

  _guestAddToCartCallback = (status, message) => {
    if (status) {
      showSimpleSnackbar(translate('Product added to cart'));
    } else {
      showSingleAlert(message);
    }
  };

  _getStatusItems = (category_id, sku) => {
    // let params = {
    //   category_id: category_id,
    //   product_id: sku,
    // };
    // this.props.getStatusItems(params, (data) => {
    //   this.props.navigation.navigate("StatusView", {
    //     productList: data,
    //     sku: sku,
    //     didTapOnProduct: (product) => {
    //       this.props.navigation.navigate("ProductDetail", {
    //         sku: product.sku,
    //         category_id: category_id,
    //       });
    //     },
    //   });
    // });

    this.props.navigation.navigate('StatusView', {
      sku: sku,
      category_id: category_id,
      didTapOnProduct: product => {
        this.props.navigation.navigate('ProductDetail', {
          sku: product.sku,
        });
      },
    });
  };

  _onLoad = state => {
    if (state.url.indexOf('/login') > -1) {
      this.setState({isShowResetPasswordView: false, resetPasswordUrl: ''});
      setTimeout(() => {
        this.setState({isLoginViewShow: true});
      }, 500);
    }
  };

  render() {
    const {
      visibleAddIndex,
      isLoginViewShow,
      adViewShow,
      bestSellerWishlist,
      isPopUpViewShow,
      promotionCategoryArray,
      isPendingPromotionCategories,
      isPromotionCategoryAPICalling,
      topBrands,
    } = this.state;
    const {
      topCategoryArray,
      bannerArray,
      loader,
      newProductsArray,
      topSalesArray,
      bestSellersArray,
      categoryList,
      currency,
      storeCode,
      cartArray,
      wishList,
      isRTL,
      isHandset,
      appMediaBaseUrl,
      appLogoUrl,
    } = this.props;

    let wishListArray = [];
    wishList.map(wishItem => {
      wishListArray.push(wishItem.productId);
    });

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
          barStyle="dark-content"
          hidden={false}
          backgroundColor={Constants.APP_WHITE_COLOR}
          // translucent={true}
        />
        <NavigationHeader2
          isRTL={this.props.isRTL}
          didTapOnFlag={this._didTapOnFlag}
          didTapOnSearch={this._didTapOnSearch}
          didTapOnCart={this._didTapOnCart}
          isShowFlag={true}
          isDark={false}
          showCart={true}
          countryFlag={isRTL ? Images.flags.ukFlag : Images.flags.kuwait}
          cartItemsCount={cartArray.length}
          isRTL={isRTL}
          appLogoUrl={path}
        />
        {loader ? (
          <HudView />
        ) : (
          <ScrollView
            style={{flex: 1, backgroundColor: 'rgb(248,248,248)'}}
            onScroll={({nativeEvent}) => {
              if (isCloseToBottom(nativeEvent)) {
                if (isPendingPromotionCategories) {
                  this._getPromotionCategories();
                }
              }
            }}
            scrollEventThrottle={400}>
            <View style={styles.container}>
              {bannerArray != '' && (
                <View
                  style={{
                    // height: normalizedHeight(213),
                    // overflow: "hidden",
                    marginTop: 3,
                  }}>
                  <FlatList
                    horizontal
                    pagingEnabled
                    ref={ref => {
                      this.addsFlatListRef = ref;
                    }}
                    style={{
                      marginVertical: 0,
                      backgroundColor: Constants.APP_BLACK_COLOR,
                    }}
                    keyExtractor={(item, index) => index.toString()}
                    contentContainerStyle={{alignSelf: 'flex-start'}}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    data={bannerArray}
                    onViewableItemsChanged={this._onViewableItemsChanged}
                    viewabilityConfig={{
                      itemVisiblePercentThreshold: 100,
                    }}
                    getItemLayout={this._getItemLayout}
                    renderItem={({item, index}) => (
                      <View>
                        <AddsItem
                          item={item}
                          index={index}
                          props={this.props}
                          state={this.state}
                          didSelectAdd={item => {
                            switch (item.type) {
                              case 'category':
                                const selectedCategory = categoryList.filter(
                                  category => {
                                    return category.id == item.value;
                                  },
                                );

                                // if (selectedCategory.length === 0) {
                                //   showSingleAlert(
                                //     "No product found in this category",
                                //     "OK"
                                //   );
                                // } else {
                                this.props.navigation.navigate(
                                  'ProductListFromCategory',
                                  {
                                    selectedSubCategoryId: item.value,
                                    // selectedCategory[0].id,
                                    categoryName: '', // selectedCategory[0].title,
                                    isFromHome: true,
                                  },
                                );
                                // }
                                break;

                              case 'product':
                                this.props.navigation.navigate(
                                  'ProductDetail',
                                  {
                                    sku: item.value,
                                  },
                                );
                                break;

                              case 'external':
                                Linking.openURL(item.value);
                                break;

                              default:
                                Alert.alert('PRODUCT TYPE NOT FOUND');
                            }
                          }}
                        />
                      </View>
                    )}
                  />
                  <View style={styles.pagerContainer}>
                    {bannerArray.map((item, index) => (
                      <View
                        style={[
                          styles.pagerItem,
                          {
                            backgroundColor:
                              index == visibleAddIndex
                                ? Constants.APP_WHITE_COLOR
                                : 'rgba(255,255,255,0.3)',
                          },
                        ]}
                      />
                    ))}
                  </View>
                </View>
              )}

              {topCategoryArray != '' && (
                <View
                  style={
                    topBrands.length > 0
                      ? styles.topCategoryStles
                      : styles.categoryListContainer
                  }>
                  <FlatList
                    // style={{ height: 120 }}
                    horizontal
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    data={topCategoryArray}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({item, index}) => (
                      <CategoryItem
                        item={item}
                        index={index}
                        end={this.end}
                        props={this.props}
                        didTapOnItem={item => {
                          this.props.navigation.navigate(
                            'ProductListFromCategory',
                            {
                              selectedSubCategoryId: item.entity_id,
                              categoryName: item.name,
                              isFromHome: true,
                            },
                          );
                        }}
                      />
                    )}
                  />
                </View>
              )}

              {topBrands && topBrands.length > 0 && (
                <View
                  // style={{
                  //   backgroundColor: "white",
                  //   marginTop: 20,
                  //   paddingBottom: 20,
                  // }}

                  style={[styles.categoryListContainer, {}]}>
                  <View
                    style={{
                      height: 30,
                      justifyContent: 'center',
                    }}>
                    <Text style={styles.sectionTitle}>
                      {translate('Top Brands')}
                    </Text>
                  </View>
                  <FlatList
                    horizontal
                    contentContainerStyle={{alignSelf: 'flex-start'}}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    data={topBrands}
                    // extraData={bestSellerWishlist}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({item, index}) => {
                      return (
                        <BrandCell
                          data={item}
                          index={index}
                          appMediaBaseUrl={appMediaBaseUrl}
                          didTapOnBrand={() => {
                            this.props.navigation.navigate(
                              'ProductResultCategory',
                              {
                                searchText: '',
                                isFromHome: true,
                                brandId: item.id,
                              },
                            );
                          }}
                        />
                      );
                    }}
                  />
                  <View style={{height: 10}} />
                </View>
              )}

              {promotionCategoryArray.map((val, i) => {
                return (
                  <View>
                    <TouchableOpacity
                      activeOpacity={1}
                      onPress={() => {
                        this.props.navigation.navigate(
                          'ProductListFromCategory',
                          {
                            selectedSubCategoryId: val.category_id,
                            categoryName: val.title,
                            isFromHome: true,
                          },
                        );
                      }}>
                      <View
                        style={{
                          height: 50,
                          alignItems: 'center',
                          marginTop: 10,
                          flexDirection: 'row',
                        }}>
                        <Text style={[styles.sectionTitle, {flex: 1}]}>
                          {val.title.toUpperCase()}
                        </Text>
                        <View
                          style={{
                            width: 75,
                            height: 22,
                            backgroundColor: Constants.APP_THEME_COLOR,
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 11,
                            marginRight: 10,
                          }}>
                          <Text style={styles.viewAll}>
                            {translate('View all')}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                    <FlatList
                      horizontal
                      contentContainerStyle={{alignSelf: 'flex-start'}}
                      showsVerticalScrollIndicator={false}
                      showsHorizontalScrollIndicator={false}
                      data={val.products}
                      // extraData={bestSellerWishlist}
                      keyExtractor={(item, index) => index.toString()}
                      renderItem={({item, index}) => {
                        let likeValue = false;
                        if (wishListArray.includes(item.entity_id)) {
                          likeValue = true;
                        }
                        return (
                          <View style={{flexDirection: 'row'}}>
                            <View
                              style={{
                                width: isHandset ? normalizedWidth(180) : 300, //normalizedWidth(180),
                                marginLeft: index == 0 ? 10 : 0,
                                marginRight:
                                  index + 1 == val.products.length ? 10 : 0,
                                // flexDirection: "row",
                              }}>
                              <ProductCell4
                                data={item}
                                index={index}
                                screenWidth={Constants.SCREEN_WIDTH}
                                numOfColumns={isHandset ? 2 : 3}
                                currency={currency}
                                likeActive={likeValue}
                                appMediaBaseUrl={appMediaBaseUrl}
                                didTapOnLikeButton={() => {
                                  this._didTapOnLikeButton(
                                    likeValue,
                                    item.entity_id,
                                  );
                                }}
                                totalItemsCount={val.length}
                                isHandset={isHandset}
                                didTapOnVideo={item => {
                                  this._getStatusItems(
                                    val.category_id,
                                    item.sku,
                                  );
                                }}
                                didSelectAdd={item => {
                                  this.props.navigation.navigate(
                                    'ProductDetail',
                                    {
                                      sku: item.sku,
                                    },
                                  );

                                  // this.props.navigation.navigate(
                                  //   "ProductDetail",
                                  //   {
                                  //     // sku: item.sku,
                                  //     urlKey: "elari-kids-smart-4g-watch-black",
                                  //   }
                                  // );
                                }}
                                didTapOnAddToCart={() => {
                                  this._didTapOnAddToCart(item);
                                }}
                              />
                            </View>
                            {val.isLoading && index + 1 == val.products.length && (
                              <View
                                style={{
                                  marginRight: 80,
                                  justifyContent: 'center',
                                  // alignItems: "center",
                                  height: isHandset
                                    ? 260
                                    : normalizedHeight(isHandset ? 380 : 300),
                                }}>
                                <ActivityIndicator />
                              </View>
                            )}
                          </View>
                        );
                      }}
                      onEndReached={() => {
                        this._getPromotionProducts(val, i);
                      }}
                      onEndReachedThreshold={0.5}
                    />
                  </View>
                );
              })}

              {/* {!isPendingPromotionCategories && topBrands.length > 0 && (
                <View
                  style={{
                    backgroundColor: "white",
                    marginTop: 20,
                    paddingBottom: 20,
                  }}
                >
                  <View
                    style={{
                      height: 30,
                      justifyContent: "center",
                      marginTop: 10,
                    }}
                  >
                    <Text style={styles.sectionTitle}>
                      {translate("Top Brands")}
                    </Text>
                  </View>
                  <FlatList
                    horizontal
                    contentContainerStyle={{ alignSelf: "flex-start" }}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    data={topBrands}
                    // extraData={bestSellerWishlist}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item, index }) => {
                      return (
                        <BrandCell
                          data={item}
                          index={index}
                          appMediaBaseUrl={appMediaBaseUrl}
                          didTapOnBrand={() => {
                            this.props.navigation.navigate(
                              "ProductResultCategory",
                              {
                                searchText: "",
                                isFromHome: true,
                                brandId: item.id,
                              }
                            );
                          }}
                        />
                      );
                    }}
                  />
                </View>
              )} */}
              {isPromotionCategoryAPICalling && (
                <View style={{width: '100%', height: 50, marginTop: 10}}>
                  <ActivityIndicator />
                </View>
              )}
              <View style={{height: 20}} />
            </View>
          </ScrollView>
        )}
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
          onBackButtonPress={() => this.setState({isPopUpViewShow: false})}
          onBackdropPress={() => this.setState({isPopUpViewShow: false})}
          isVisible={isPopUpViewShow}
          backdropColor={Constants.APP_TRANSPARENT_COLOR}
          style={{margin: 0}}
          animationIn={'fadeIn'}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => this.setState({isPopUpViewShow: false})}
            style={{flex: 1, backgroundColor: 'rgba(110,110,110,0.4)'}}>
            <CircleButton
              refer={ref => (this.circleButtonRef = ref)}
              size={45}
              didTapOnClose={() => this.setState({isPopUpViewShow: false})}
              onPressButtonTop={() => {
                this.setState({isPopUpViewShow: false});
                this.props.navigation.navigate('OthersScreen', {
                  heading: translate('Chat with Us'),
                  url: Constants.CHAT_TAWK_URL,
                  // "https://tawk.to/chat/5d6e3db677aa790be3322605/1ekoem6kc",
                  // "https://tawk.to/chat/5faa638d0a68960861bd7cc6/default",
                });
              }}
            />
          </TouchableOpacity>
        </Modal>
        <Modal
          onBackButtonPress={() => this.setState({adViewShow: false})}
          isVisible={adViewShow}
          style={{margin: 0, alignItems: 'center', justifyContent: 'center'}}>
          <View
            style={{
              flex: 1,
              // backgroundColor: "rgba(0,0,0,0.3)",
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <View
              style={{
                backgroundColor: 'white',
                borderRadius: 10,
                // padding: 10,
                // margin: 20,
                // height: normalizedHeight(600),
                // width: normalizedHeight(600) * 0.62,
                height: (Constants.SCREEN_WIDTH - 40) / 0.62,
                width: Constants.SCREEN_WIDTH - 40,
              }}>
              <FlatList
                data={this.state.addsArray}
                horizontal
                pagingEnabled
                onScroll={this.change}
                showsHorizontalScrollIndicator={false}
                // style={{ margin: 10 }}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item, index}) => (
                  <TouchableOpacity
                    onPress={() => this._didSelectAdsItem(item)}
                    style={{
                      justifyContent: 'center',
                      borderRadius: 10,
                      overflow: 'hidden',
                    }}>
                    <ImageLoader
                      key={index}
                      source={{
                        uri: appMediaBaseUrl + item.banner_image_mobile,
                      }}
                      defaultSource={Images.placeHolderProduct}
                      resizeMode={'cover'}
                      style={{
                        // width: normalizedHeight(708) * 0.62, //this.props.screenWidth - 80,
                        // height: normalizedHeight(708), //isHandset ? normalizedHeight(708) : 400,
                        // width: normalizedHeight(600) * 0.62,
                        // height: normalizedHeight(600),
                        height: (Constants.SCREEN_WIDTH - 40) / 0.62,
                        width: Constants.SCREEN_WIDTH - 40,
                        // backgroundColor: "red",
                        borderRadius: 10,
                      }}
                    />
                  </TouchableOpacity>
                )}
              />
              <TouchableOpacity
                onPress={() => {
                  this.setState({adViewShow: false});
                }}
                style={styles.closeButtonView}>
                <Image
                  style={{tintColor: 'black'}}
                  source={Images.close}
                  resizeMode={'cover'}
                />
              </TouchableOpacity>
              {this.state.addsArray.length > 1 && (
                <View style={styles.paginationContainer}>
                  {this.state.addsArray.map((i, k) => (
                    <Image
                      source={Images.radioUnchecked3}
                      style={[
                        styles.paginationImage,
                        {
                          tintColor:
                            k == this.state.active
                              ? Constants.APP_THEME_COLOR
                              : null,
                        },
                      ]}
                    />
                  ))}
                </View>
              )}
            </View>
          </View>
        </Modal>

        <Modal
          isVisible={this.state.isShowResetPasswordView}
          onBackdropPress={() => {
            this.setState({isShowResetPasswordView: false});
          }}
          onBackButtonPress={() => {
            this.setState({isShowResetPasswordView: false});
          }}
          style={{margin: 0}}>
          <SafeAreaView
            style={{
              margin: 0,
              flex: 1,
              backgroundColor: 'rgb(255,255,255)',
            }}>
            <NavigationHeader
              isWishlist={false}
              hideSearch={true}
              title={translate('reset password web view title')}
              showBackButton={true}
              didTapOnLeftButton={() => {
                this.setState({
                  loaderVisible: false,
                  isShowResetPasswordView: false,
                });
              }}
              isRTL={this.props.isRTL}
            />
            <WebView
              ref={c => (this._webview = c)}
              source={{
                uri: this.state.resetPasswordUrl,
              }}
              onLoadStart={() => this.setState({loaderVisible: true})}
              onLoadEnd={() => {
                this.setState({loaderVisible: false});
                if (this._webview) {
                  setTimeout(() => {
                    const run2 = `
                document.getElementsByTagName('header')[0].style.display="none";
                document.getElementsByTagName('footer')[0].style.display="none";
                document.getElementsByClassName('main-content')[0].style.padding="0px";
                document.getElementsByClassName('tawk-min-container')[0].style.display="none";
                `;
                    this._webview && this._webview.injectJavaScript(run2);
                  }, 5000);
                }
              }}
              onNavigationStateChange={this._onLoad}
              onError={syntheticEvent => {
                const {nativeEvent} = syntheticEvent;
                this.setState({
                  loaderVisible: false,
                  resetPasswordUrl: '',
                });
                showSingleAlert(translate('API_Failed'), 'Ok', () => {
                  this.setState({isShowResetPasswordView: false});
                });
              }}
              // injectedJavaScript={jsCode}
              javaScriptEnabledAndroid={true}
              injectedJavaScript={`document.body.style.backgroundColor = 'blue';
              true;`}
            />
            {this.state.loaderVisible && <HudView />}
          </SafeAreaView>
        </Modal>

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
        <ActionSheet
          ref={o => (this.ActionSheet = o)}
          title={translate('Select your language')}
          options={['English', translate('ARABIC'), translate('Cancel')]}
          cancelButtonIndex={2}
          // destructiveButtonIndex={2}
          tintColor={Constants.APP_THEME_COLOR}
          onPress={index => {
            switch (index) {
              case 0: {
                this._didLanguageChange('en');
                break;
              }
              case 1: {
                this._didLanguageChange('ar');
                break;
              }
            }
          }}
        />
      </SafeAreaView>
    );
  }
}

export default HomeScreen;

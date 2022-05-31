/**
 * Created by Jebin for iLeaf Solutions Pvt.Ltd
 * on February 12, 2020
 * Navigation - Navigation methods
 */

import {Image, View, Text} from 'react-native';
import React, {Component} from 'react';

/** Navigation Classes */
import {
  createAppContainer,
  createSwitchNavigator,
  createCompatNavigatorFactory,
} from '@react-navigation/compat';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

/** Screens */
import Account from '../screens/Account';
import AddAddressScreen from '../screens/AddAddress';
import AddressListScreen from '../screens/AddressList';
import TrackYourOrder from '../screens/TrackYourOrder';
import ChangePasswordScreen from '../screens/ChangePassword';
import OthersScreen from '../screens/OthersScreen';
import Balloon from '../screens/Balloon';
import ReachUsScreen from '../screens/ReachUs';
import Categories from '../screens/Categories';
import Cart from '../screens/CartScreen';
// import Cart from '../screens/Cart';
import Chat from '../screens/Chat';
import Search from '../screens/Search';
import WishList from '../screens/WishList';
import Overview from '../screens/Overview';
import ContactUs from '../screens/ContactUs';
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import GiftWrapScreen from '../screens/GiftWrapScreen';
import ProfileDetails from '../screens/ProfileDetails';
import VideoPlayer from '../screens/VideoPlayerScreen';
import OrderHistory from '../screens/OrderHistory';
import OrderCompletion from '../screens/OrderCompletion';
import OrderHistoryDetail from '../screens/OrderHistoryDetail';
import CountrySelection from '../screens/CountrySelection';
import RegistrationScreen from '../screens/RegistrationScreen';
import ProductList from '../screens/ProductList';
import ProductDetail from '../screens/ProductDetail';
import ProductListFromCategory from '../screens/ProductListFromCategory';
import FilterScreen from '../screens/Filter';
import PreLoaderScreen from '../screens/PreLoaderScreen';
import Checkout from '../screens/Checkout';
import ProductReview from '../screens/ProductReview';
import GuestAddAddress from '../screens/GuestAddAddress';
import BiometricAuth from '../screens/BiometricAuth';
import ProductResultCategory from '../screens/ProductResultCategory';
import AppUpdateScreen from '../screens/AppUpdateScreen';
import StatusView from '../screens/StatusView';
import DeepLinkAuthScreen from '../screens/DeepLinkAuthScreen';

/** Others */
import Images from '../config/images';
import Constants from '../config/constants';
import {translate} from '../config/languageSwitching';
import constants from '../config/constants';

const LoginStack = createCompatNavigatorFactory(createStackNavigator)(
  {
    LoginScreen: LoginScreen,
    RegistrationScreen: RegistrationScreen,
  },
  {
    //initialRouteName: 'RegistrationScreen',
    //initialRouteName: 'LoginScreen',
    navigationOptions: {
      gesturesEnabled: false,
    },
    headerMode: 'none',
  },
);

const TabNavigator = createBottomTabNavigator();

const HomeStack = createCompatNavigatorFactory(createStackNavigator)(
  {
    Home: HomeScreen,
    Search: Search,
    ProductList: ProductList,
    // FilterScreen: FilterScreen,
    ProductListFromCategory,
    ProductResultCategory,
  },
  {headerMode: 'none'},
);

const CategoriesStack = createCompatNavigatorFactory(createStackNavigator)(
  {
    Categories,
    Search,
    ProductListFromCategory,
    ProductResultCategory,
  },
  {headerMode: 'none'},
);

const WishListStack = createCompatNavigatorFactory(createStackNavigator)(
  {
    WishList,
    Search,
    ProductResultCategory,
  },
  {headerMode: 'none'},
);

function Tab() {
  return (
    <TabNavigator.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          var iconName;
          switch (route.name) {
            case translate('Home'):
              iconName = Images.home;
              break;
            case translate('CATEGORIES'):
              iconName = Images.categoriesNew;
              break;
            case translate('WISHLIST'):
              iconName = Images.wishlist;
              break;
            default:
              iconName = Images.account;
              break;
          }
          return focused ? (
            <View
              style={{
                marginBottom: 30,
                width: Constants.SCREEN_WIDTH / 4,
                alignItems: 'center',
              }}>
              <View
                style={{
                  padding: 10,
                  borderWidth: 2,
                  borderColor: constants.APP_WHITE_COLOR,
                  borderRadius: 25,
                  // borderBottomWidth: 3,
                  // marginBottom: 30,
                  backgroundColor: constants.APP_THEME_COLOR,
                  width: 50,
                  height: 50,
                  alignItems: 'center',
                  justifyContent: 'center',

                  elevation: 10,
                  shadowColor: Constants.APP_DARK_BLACK_COLOR,
                  shadowOpacity: 0.35,
                  shadowRadius: 5,
                }}>
                <Image
                  source={iconName}
                  resizeMode={'contain'}
                  style={{
                    width: 20,
                    height: 20,
                    tintColor: constants.APP_WHITE_COLOR,
                  }}
                />
              </View>
              <Text
                style={{
                  fontFamily: Constants.Fonts.REGULAR,
                  color: Constants.APP_THEME_COLOR,
                  marginTop: 5,
                  fontSize: 12,
                }}>
                {route.name}
              </Text>
            </View>
          ) : (
            <Image
              source={iconName}
              resizeMode={'contain'}
              style={{
                width: 20,
                height: 20,
                tintColor: constants.APP_GRAY_COLOR4,
              }}
            />
          );
        },
      })}
      tabBarOptions={{
        showLabel: false,
        style: {
          backgroundColor: constants.APP_WHITE_COLOR,
          elevation: 10,
          shadowColor: Constants.APP_DARK_BLACK_COLOR,
          shadowOpacity: 0.35,
          shadowRadius: 10,
          borderTopWidth: 0,
        },
        activeTintColor: constants.APP_THEME_COLOR,
        inactiveTintColor: constants.APP_WHITE_COLOR,
        keyboardHidesTabBar: true,
      }}>
      <TabNavigator.Screen name={translate('Home')} component={HomeStack} />
      <TabNavigator.Screen
        name={translate('CATEGORIES')}
        // component={AddressStack}
        component={CategoriesStack}
      />
      <TabNavigator.Screen
        name={translate('WISHLIST')}
        component={WishListStack}
      />
      <TabNavigator.Screen name={translate('ACCOUNT')} component={Account} />
    </TabNavigator.Navigator>
  );
}

const TabStack = createCompatNavigatorFactory(createStackNavigator)(
  {
    Tab,
    Cart,
    ProductDetail,
    Checkout,
    ProfileDetails,
    FilterScreen,
    VideoPlayer,
    CountrySelection,
    AddressListScreen,
    TrackYourOrder,
    ChangePasswordScreen,
    OthersScreen,
    ReachUsScreen,
    GiftWrapScreen,
    Balloon,
    Overview,
    AddAddressScreen,
    GuestAddAddress,
    ContactUs,
    OrderHistory,
    OrderCompletion,
    OrderHistoryDetail,
    Chat,
    // ProductListFromCategory,
    ProductReview,
    StatusView,
  },
  {
    headerMode: 'none',
    navigationOptions: {
      // swipeEnabled: false,
    },
  },
);

const SwitchNavigator = createSwitchNavigator(
  {
    PreLoaderScreen: PreLoaderScreen,
    HomeScreen: HomeScreen,
    LoginScreen: LoginStack,
    Tab: TabStack,
    BiometricAuth: BiometricAuth,
    AppUpdateScreen: AppUpdateScreen,
    DeepLinkAuthScreen: DeepLinkAuthScreen,
  },
  {headerMode: 'none', initialRouteName: 'PreLoaderScreen'},
);

function App() {
  return (
    <NavigationContainer>
      <SwitchNavigator />
    </NavigationContainer>
  );
}

export default App;

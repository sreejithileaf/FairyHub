/**
 * Created by Jebin for iLeaf Solutions Pvt.Ltd
 * on February 12, 2020
 * HomeScreen - HomeScreen container
 */

import {connect} from 'react-redux';
import HomeScreen from './HomeScreen';
import React, {Component} from 'react';
import * as appActions from '../../actions/appActions';
import * as homeAction from '../../actions/homeAction';
import * as loginActions from '../../actions/loginActions';
import * as guestActions from '../../actions/guestActions';
import * as cartActions from '../../actions/cartActions';

class HomeScreenContainer extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {}

  render() {
    return <HomeScreen {...this.props} />;
  }
}

function mapStateToProps(state) {
  return {
    screenWidth: state.appReducer.screenWidth,
    screenHeight: state.appReducer.screenHeight,
    selectedLanguage: state.appReducer.selectedLanguage,
    userToken: state.appReducer.userToken,
    guestToken: state.appReducer.guestToken,
    quoteID: state.loginReducer.cartID,
    currency: state.appReducer.currency,
    appMediaBaseUrl: state.appReducer.appMediaBaseUrl,
    categoryList: state.categoryListReducer.category_list,
    isRTL: state.appReducer.selectedLanguage === 'ar' ? true : false,
    bannerArray: state.homeReducer.banner_array || [],
    topCategoryArray: state.homeReducer.topCategory_array || [],
    promotionCategoryArray: state.homeReducer.promotionCategory_array || [],
    topSalesArray: state.homeReducer.topSales_array || [],
    bestSellersArray: state.homeReducer.bestSellers_array || [],
    newProductsArray: state.homeReducer.newProducts_array || [],
    addsArray: state.homeReducer.add_array || [],
    appLogoUrl: state.appReducer.appLogo || '',
    loader: state.loadingReducer.isHomeScreenLoading,
    storeCode: state.appReducer.storeCode,
    cartArray:
      state.appReducer.userToken.length > 0
        ? state.cartReducer.cartArray
        : state.cartReducer.guestCartArray,
    wishList: state.loginReducer.wishList || [],
    isHandset: state.appReducer.isHandset,
    isLocalizationSet: state.appReducer.isLocalizationSet,
    orientation: state.appReducer.orientation,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getPromotionCategories: (params, callback) => {
      dispatch(homeAction.getPromotionCategories(params, callback));
    },
    getPromotionProducts: (params, callback) => {
      dispatch(homeAction.getPromotionProducts(params, callback));
    },
    didChangeLAnguage: language => {
      dispatch(appActions.onChangeLanguage(language));
    },
    loadHomePage: callback => {
      dispatch(homeAction.homeRequest(callback));
    },
    getEnabledAdds: callback => {
      dispatch(homeAction.homeAddRequest(callback));
    },
    onLikeTap: (productId, likeCallback) => {
      dispatch(loginActions.addItemToWishlist(productId, likeCallback));
    },
    onDislikeTap: (productId, removeCallback) => {
      dispatch(loginActions.removeItemFromWishlist(productId, removeCallback));
    },
    createGuestCart: createGuestCartCallback => {
      dispatch(guestActions.createGuestCart(createGuestCartCallback));
    },
    guestAddToCart: (params, guestAddToCartCallback) => {
      dispatch(guestActions.guestAddToCart(params, guestAddToCartCallback));
    },
    addPtoCartForLoggedUser: (params, callBack) => {
      dispatch(cartActions.addProductToCartLoggedUser(params, callBack));
    },
    checkGuestSession: () => {
      dispatch(guestActions.checkGuestSession());
    },
    getStatusItems: (params, callBack) => {
      dispatch(homeAction.getStatusItems(params, callBack));
    },
    updateLocalizationStatus: status => {
      dispatch(appActions.updateAppLocalizationStatus(status));
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(HomeScreenContainer);

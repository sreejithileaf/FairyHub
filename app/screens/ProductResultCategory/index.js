/**
 * Created by Jebin for iLeaf Solutions Pvt.Ltd
 * on February 12, 2020
 * ProductList - ProductList container
 */

import { connect } from "react-redux";
import ProductResultCategoryScreen from "./ProductResultCategory";
import React, { Component } from "react";
import * as appActions from "../../actions/appActions";
import * as loginActions from "../../actions/loginActions";
import * as productsActions from "../../actions/productsActions";
import * as searchActions from "../../actions/searchActions";
import * as filterActions from "../../actions/filterResultAction";
import * as guestActions from "../../actions/guestActions";
import * as cartActions from "../../actions/cartActions";

class ProductResultCategoryContainer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <ProductResultCategoryScreen {...this.props} />;
  }
}

function mapStateToProps(state) {
  return {
    selectedLanguage: state.appReducer.selectedLanguage,
    isLoading: state.loadingReducer.isLoading,
    appMediaBaseUrl: state.appReducer.appMediaBaseUrl,
    isLoadingProductList: state.loadingReducer.isLoadingProductList,
    currency: state.appReducer.currency,
    isRTL: state.appReducer.selectedLanguage === "ar" ? true : false,
    screenWidth: state.appReducer.screenWidth,
    screenHeight: state.appReducer.screenHeight,
    isHandset: state.appReducer.isHandset,
    orientation: state.appReducer.orientation,
    guestToken: state.appReducer.guestToken,
    quoteID: state.loginReducer.cartID,
    productsDeliveryTypes: state.appReducer.productsDeliveryTypes,
    selectedFilters: state.filterListReducer.selectedFilters,
    categoryList: state.categoryListReducer.category_list,
    productsListFromHome: state.productsListReducer.productsListOnCategory1,
    productsListFromCategory:
      state.productListFromCategoryReducer.productsListOnCategory1,

    cartArray:
      state.appReducer.userToken.length > 0
        ? state.cartReducer.cartArray
        : state.cartReducer.guestCartArray,
    wishList: state.loginReducer.wishList,
    userToken: state.appReducer.userToken,
    filterArray: state.filterListReducer.filter_list,
    filterCategoryId: state.filterListReducer.filterCategoryId,
    appLogoUrl: state.appReducer.appLogo || "",
  };
}

function mapDispatchToProps(dispatch) {
  return {
    didChangeLAnguage: (language) => {
      dispatch(appActions.onChangeLanguage(language));
    },
    clearCategoryProducts: () => {
      dispatch(productsActions.clearCategoryProducts());
    },
    clearFilters: () => {
      dispatch(filterActions.resetFilters());
    },
    onSearchTextChangeResult: (searchText, callback) => {
      dispatch(searchActions.onSearchTextChangeResult(searchText, callback));
    },
    getCategoryProductsList: (
      pageIndex,
      pageCount,
      categoryType,
      categoryId,
      filterparams,
      getCategoryProductsListCallback,
      isFromHome
    ) => {
      dispatch(
        productsActions.getCategoryProductsList(
          pageIndex,
          pageCount,
          categoryType,
          categoryId,
          filterparams,
          getCategoryProductsListCallback,
          isFromHome
        )
      );
    },
    onLikeTap: (productId, likeCallback) => {
      dispatch(loginActions.addItemToWishlist(productId, likeCallback));
    },
    onDislikeTap: (productId, removeCallback) => {
      dispatch(loginActions.removeItemFromWishlist(productId, removeCallback));
    },
    createGuestCart: (createGuestCartCallback) => {
      dispatch(guestActions.createGuestCart(createGuestCartCallback));
    },
    guestAddToCart: (params, guestAddToCartCallback) => {
      dispatch(guestActions.guestAddToCart(params, guestAddToCartCallback));
    },
    addPtoCartForLoggedUser: (params, callBack) => {
      dispatch(cartActions.addProductToCartLoggedUser(params, callBack));
    },
    fetchFilterList: (id, callback) => {
      dispatch(filterActions.loadFilterRequest(id, callback));
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProductResultCategoryContainer);

/**
 * Created by Jebin for iLeaf Solutions Pvt.Ltd
 * on February 12, 2020
 * ProductList - ProductList container
 */

import { connect } from "react-redux";
import ProductListScreen from "./ProductList";
import React, { Component } from "react";
import * as appActions from "../../actions/appActions";
import * as loginActions from "../../actions/loginActions";
import * as productsActions from "../../actions/productsActions";
import * as filterActions from "../../actions/filterResultAction";

class ProductListContainer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <ProductListScreen {...this.props} />;
  }
}

function mapStateToProps(state) {
  return {
    selectedLanguage: state.appReducer.selectedLanguage,
    isLoading: state.loadingReducer.isLoading,
    isLoadingProductList: state.loadingReducer.isLoadingProductList,
    currency: state.appReducer.currency,
    isRTL: state.appReducer.selectedLanguage === "ar" ? true : false,
    screenWidth: state.appReducer.screenWidth,
    screenHeight: state.appReducer.screenHeight,
    orientation: state.appReducer.orientation,
    isHandset: state.appReducer.isHandset,
    selectedFilters: state.filterListReducer.selectedFilters,
    categoryList: state.categoryListReducer.category_list,
    productsListOnCategory1: state.productsListReducer.productsListOnCategory1,
    appMediaBaseUrl: state.appReducer.appMediaBaseUrl,
    cartArray:
      state.appReducer.userToken.length > 0
        ? state.cartReducer.cartArray
        : state.cartReducer.guestCartArray,
    wishList: state.loginReducer.wishList,
    userToken: state.appReducer.userToken,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    clearCategoryProducts: () => {
      dispatch(productsActions.clearCategoryProducts());
    },
    clearFilters: () => {
      dispatch(filterActions.resetFilters());
    },
    getCategoryProductsList: (
      pageIndex,
      pageCount,
      categoryType,
      categoryId,
      filterparams,
      getCategoryProductsListCallback
    ) => {
      dispatch(
        productsActions.getCategoryProductsList(
          pageIndex,
          pageCount,
          categoryType,
          categoryId,
          filterparams,
          getCategoryProductsListCallback,
          true
        )
      );
    },
    onLikeTap: (productId, likeCallback) => {
      dispatch(loginActions.addItemToWishlist(productId, likeCallback));
    },
    onDislikeTap: (productId, removeCallback) => {
      dispatch(loginActions.removeItemFromWishlist(productId, removeCallback));
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProductListContainer);

/**
 * Created by Shijesh for iLeaf Solutions Pvt.Ltd
 * on September 9, 2020
 * ProductReviewContainer -
 */

import { connect } from "react-redux";
import React, { Component } from "react";
import ProductReviewView from "./ProductReviewView";
import * as productsActions from "../../actions/productsActions";

class ProductReviewContainer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <ProductReviewView {...this.props} />;
  }
}

function mapStateToProps(state) {
  return {
    isNetworkAvailable: state.appReducer.isNetworkAvailable,
    isLoading: state.loadingReducer.isLoading,
    selectedLanguage: state.appReducer.selectedLanguage,
    userToken: state.appReducer.userToken,
    quoteID: state.loginReducer.cartID,
    guestToken: state.appReducer.guestToken,
    isHandset: state.appReducer.isHandset,
    isRTL: state.appReducer.selectedLanguage === "ar" ? true : false,
    screenWidth: state.appReducer.screenWidth,
    screenHeight: state.appReducer.screenHeight,
    orientation: state.appReducer.orientation,
    userInfo: state.loginReducer.userInfo,
    reviewList: state.productDetailReducer.reviewList,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    postUserReview: (reviewDict, reviewAddCallback) => {
      dispatch(productsActions.postUserReview(reviewDict, reviewAddCallback));
    },
    getUserReviews: (skuId) => {
      dispatch(productsActions.getUserReviews(skuId));
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProductReviewContainer);

/**
 * Created by Shijesh for iLeaf Solutions Pvt.Ltd
 * on September 9, 2020
 * ProductReviewView - Product review are shown here
 */

import {
  Text,
  View,
  StatusBar,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  TextInput,
  Keyboard,
} from "react-native";
import Moment from "moment";
import styles from "./styles";
import Login from "../LoginScreen";
import Modal from "react-native-modal";
import React, { Component } from "react";
import Constants from "../../config/constants";
import HudView from "../../components/hudView";
import { showSingleAlert } from "../../config/common";
import { translate } from "../../config/languageSwitching/index";
import { showAlertWithCallback } from "../../config/common";
import NavigationHeader1 from "../../components/NavigationHeaders/NavigationHeader1";

class ProductReviewView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reviewText: "",
      isLoginViewShow: false,
      productDetails: null,
    };
  }

  componentDidMount() {
    const { navigation } = this.props;
    const productDetails = navigation.getParam("productDetails");
    this.props.getUserReviews(productDetails.sku);
  }

  _didTapOnTextInput = () => {
    const { userToken } = this.props;
    if (userToken.length > 0) {
    } else {
      Keyboard.dismiss();
      showAlertWithCallback(
        translate("user_not_login"),
        translate("Login"),
        translate("Cancel"),
        () => {
          this.setState({ isLoginViewShow: true });
        },
        () => {
          // this._textInput.blur();
        }
      );
    }
  };

  _didTapOnPostbutton = () => {
    const { userToken, userInfo, navigation } = this.props;
    const { reviewText } = this.state;
    const productDetails = navigation.getParam("productDetails");

    if (userToken.length > 0) {
      if (reviewText.trim() === "") {
        showSingleAlert("Please enter a review.");
        this.setState({ reviewText: "" });
      } else {
        Keyboard.dismiss();
        //API CALL
        let nickname = userInfo.firstname + userInfo.lastname;
        let reviewDict = {
          review: {
            title: "Title",
            detail: reviewText.trim(),
            nickname: nickname,
            customer_id: userInfo.id ? userInfo.id : null,
            ratings: [
              {
                rating_name: "Rating",
                value: 2,
              },
            ],
            review_entity: "product",
            review_status: 2,
            entity_pk_value: parseInt(productDetails.entity_id),
          },
        };

        this.props.postUserReview(reviewDict, this._didAddReviewCallback);
      }
    } else {
      showAlertWithCallback(
        translate("user_not_login"),
        translate("Login"),
        translate("Cancel"),
        () => {
          this.setState({ isLoginViewShow: true });
        },
        () => {
          this._textInput.blur();
        }
      );
    }
  };

  _didAddReviewCallback = (status) => {
    const { navigation } = this.props;
    const productDetails = navigation.getParam("productDetails");
    if (status) {
      this.props.getUserReviews(productDetails.sku);
      showSingleAlert(translate("review_description"));
      this.setState({ reviewText: "" });
    }
  };

  _renderItem = ({ item, index }) => {
    var testDateUtc = Moment.utc(item.created_at);
    var localDate = Moment(testDateUtc).local();
    return (
      <View style={styles.flatSubContainer}>
        <View style={styles.nameTimeContainer}>
          <Text style={styles.usernameText}>{item.nickname}</Text>
          <Text style={styles.reviewTimeText}>{localDate.fromNow()}</Text>
        </View>
        <Text style={styles.reviewDescText}>{item.detail}</Text>
      </View>
    );
  };

  render() {
    const { isLoading, isRTL, reviewList } = this.props;
    const { reviewText, isLoginViewShow } = this.state;
    return (
      <SafeAreaView style={styles.safeContainer}>
        <StatusBar
          barStyle="dark-content"
          hidden={false}
          backgroundColor={Constants.APP_WHITE_COLOR}
        />
        <NavigationHeader1
          title={translate("Customer Reviews")}
          isRTL={isRTL}
          didTapOnLeftButton={() => this.props.navigation.goBack()}
        />
        <View style={styles.container}>
          <View style={styles.subContainer}>
            <TextInput
              ref={(component) => (this._textInput = component)}
              value={reviewText}
              onChangeText={(text) => this.setState({ reviewText: text })}
              style={styles.review}
              placeholder={"Enter a review"}
              onFocus={this._didTapOnTextInput}
            />
            <TouchableOpacity
              style={styles.reviewSubmitButton}
              onPress={this._didTapOnPostbutton}
            >
              <Text style={styles.postText}>{translate("post")}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.flatListContainer}>
            <FlatList
              data={reviewList}
              extraData={this.props}
              renderItem={this._renderItem}
              showsVerticalScrollIndicator={false}
              style={{ marginBottom: 60 }}
              ListEmptyComponent={() => {
                return (
                  <View
                    style={{
                      alignItems: "center",
                      justifyContent: "center",
                      flex: 1,
                    }}
                  >
                    <Text style={styles.reviewDescription}>
                      {translate("reviewDescription")}
                    </Text>
                  </View>
                );
              }}
            />
          </View>
        </View>
        <Modal
          onBackButtonPress={() => this.setState({ isLoginViewShow: false })}
          isVisible={isLoginViewShow}
          style={{ margin: 0 }}
        >
          <View style={{ flex: 1 }}>
            <Login
              didTapOnclose={() => {
                this.setState({
                  isLoginViewShow: false,
                });

                // setTimeout(() => {
                //   if (userToken.length > 0) {
                //     this._didTapOnAddToCart(true);
                //   } else {
                //     if (!this.props.guestInfo) {
                //     } else {
                //       this._didTapOnAddToCart(true);
                //     }
                //   }
                // }, 500);
              }}
            />
          </View>
        </Modal>
        {isLoading && <HudView />}
      </SafeAreaView>
    );
  }
}

export default ProductReviewView;

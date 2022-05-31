/**
 * Created by Jebin for iLeaf Solutions Pvt.Ltd
 * on February 19, 2020
 * WishListView - User selected items list out here
 */
import {
  View,
  Text,
  Image,
  StatusBar,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import {
  DataProvider,
  LayoutProvider,
  RecyclerListView,
} from "recyclerlistview";
import {
  normalizedHeight,
  normalizedWidth,
  showSingleAlert,
  showSimpleSnackbar,
  showAlertWithCallback,
} from "../../config/common";
import styles from "./styles";
import Login from "../LoginScreen";
import Modal from "react-native-modal";
import RNFetchBlob from "rn-fetch-blob";
import React, { Component } from "react";
import Images from "../../config/images";
import { I18nManager } from "react-native";
import RNRestart from "react-native-restart";
import Constants from "../../config/constants";
import HudView from "../../components/hudView";
import ActionSheet from "react-native-actionsheet";
import ProductCell from "../../components/productCell";
import CircleButton from "../../components/circleButton";
import { translate } from "../../config/languageSwitching/index";
import EmptyDataPlaceholder from "../../components/emptyDataPlaceholder";
import NavigationHeader2 from "../../components/NavigationHeaders/NavigationHeader2";

const ViewTypes = {
  FULL: 0,
  HALF_LEFT: 1,
  HALF_RIGHT: 2,
};

let dataProvider = new DataProvider((r1, r2) => {
  return r1 !== r2;
});

class WishListView extends Component {
  constructor(props) {
    super(props);

    let dataProvider = new DataProvider((r1, r2) => {
      return r1 !== r2;
    });

    this._layoutProvider = new LayoutProvider(
      (index) => {
        return ViewTypes.FULL;
      },
      (type, dim) => {
        dim.width = (props.screenWidth - 40) / 3; //(Constants.SCREEN_WIDTH - 41) / 2; //width / 2.01;
        dim.height = 380; //normalizedHeight(420);
      }
    );

    this.state = {
      showLoader: false,
      pageIndex: 0,
      isAPILoading: false,
      isLoginViewShow: false,
      isPopUpViewShow: false,
    };
  }

  componentDidMount() {}

  componentWillUnmount() {}

  _didTapOnSearch = () => {
    this.props.navigation.navigate("Search");
  };

  _didTapOnCart = () => {
    this.props.navigation.navigate("Cart");
  };

  _removeCallback = (status) => {
    if (status) {
      showSimpleSnackbar(translate("Item removed from wishlist"));
    }
  };

  onRemoveCalled = (productId) => {
    showAlertWithCallback(
      translate("remove from wishlist?"),
      translate("Yes"),
      translate("No"),
      () => this.props.onRemoveTap(productId, this._removeCallback),
      null
    );
  };

  _didTapOnFlag = () => {
    this.ActionSheet.show();
  };

  _didLanguageChange = (lang) => {
    const { selectedLanguage, didChangeLAnguage } = this.props;
    if (selectedLanguage === lang) {
      return;
    }

    didChangeLAnguage(selectedLanguage === "ar" ? "en" : "ar");

    if (lang === "ar") {
      I18nManager.forceRTL(true);
    } else {
      I18nManager.forceRTL(false);
    }

    setTimeout(() => {
      RNRestart.Restart();
    }, 1000);
  };

  _didTapOnAddToCart = (productDetails) => {
    const { userToken, guestToken, quoteID, cartArray } = this.props;

    let sku = productDetails.child
      ? productDetails.child.sku
      : productDetails.sku;

    if (cartArray.length >= Constants.MAX_CART_SIZE) {
      showSingleAlert(
        translate("cart count exceeds1") +
          Constants.MAX_CART_SIZE +
          translate("cart count exceeds2")
      );
      return;
    }

    let isProductInCart = false;
    let cartProductInfo;
    if (cartArray.length > 0) {
      cartArray.map((item) => {
        if (sku === item.sku) {
          isProductInCart = true;
          cartProductInfo = item;
        }
      });
    }

    if (isProductInCart) {
      let cartProductCount = cartProductInfo.qty;
      if (cartProductCount + 1 > Constants.MAX_PRODUCT_COUNT) {
        showSingleAlert(translate("product count max in detail screen"));
        return;
      }
    }

    if (userToken) {
      let colorId = "";
      let sizeId = "";
      let product_option = null;

      if (productDetails.child && productDetails.child.attributes) {
        let attributes = productDetails.child.attributes;
        colorId = attributes.color.attribute_value;
        sizeId = attributes.size.attribute_value;

        let optionArray = [];

        if (colorId) {
          optionArray.push({ option_id: "93", option_value: colorId });
        }
        if (sizeId) {
          optionArray.push({
            option_id: "142",
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
        params.cart_item["product_option"] = product_option;
      }

      this.props.addPtoCartForLoggedUser(params, (status, message) =>
        this._userAddedPtoCartCallback(status, message)
      );
    } else if (guestToken) {
      let colorId = "";
      let sizeId = "";
      let product_option = null;

      if (productDetails.child && productDetails.child.attributes) {
        let attributes = productDetails.child.attributes;
        colorId = attributes.color.attribute_value;
        sizeId = attributes.size.attribute_value;

        let optionArray = [];

        if (colorId) {
          optionArray.push({ option_id: "93", option_value: colorId });
        }
        if (sizeId) {
          optionArray.push({
            option_id: "142",
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
        params.cart_item["product_option"] = product_option;
      }

      this.props.guestAddToCart(params, (status) =>
        this._guestAddToCartCallback(status)
      );
    } else {
      this.props.createGuestCart((status) =>
        this._createGuestCartCallback(status, productDetails)
      );
    }
  };

  _userAddedPtoCartCallback = (status, message) => {
    if (status) {
      showSimpleSnackbar(translate("Product added to cart"));
    } else {
      showSingleAlert(message);
    }
  };

  render() {
    const { isShowBottomLoader, isLoginViewShow, isPopUpViewShow } = this.state;
    const {
      selectedLanguage,
      screenWidth,
      screenHeight,
      orientation,
      currency,
      userToken,
      cartArray,
      wishList,
      isHandset,
      isRTL,
      isLoading,
      appMediaBaseUrl,
      appLogoUrl,
    } = this.props;
    let numOfColums = isHandset ? 2 : 3; //screenWidth > 410 ? 3 : 2;
    let cellWidth = (this.props.screenWidth - 32) / numOfColums;

    let dirs = RNFetchBlob.fs.dirs;
    let path = "";
    if (Constants.IS_ANDROID) {
      path = "file:///" + dirs.DocumentDir + "/appLogo.png";
    } else {
      path = dirs.DocumentDir + "/appLogo.png";
    }

    let subComponent = null;
    if (userToken && userToken.length > 0) {
      if (wishList && wishList.length > 0) {
        // show wishlist
        subComponent = (
          <View style={{ flex: 1, backgroundColor: "rgb(248,248,248)" }}>
            {/* <Text style={styles.titleStyle}>{translate("Wishlist")}</Text> */}
            <RecyclerListView
              style={{
                // paddingTop: 12,
                // paddingHorizontal: 18,
                marginHorizontal: 14,

                backgroundColor: "rgb(248,248,248)",
                // height: normalizedHeight(1000),
              }}
              layoutProvider={
                new LayoutProvider(
                  (index) => {
                    return ViewTypes.FULL;
                  },
                  (type, dim, index) => {
                    dim.width = cellWidth; //(Constants.SCREEN_WIDTH - 41) / 2; //width / 2.01;
                    dim.height = isHandset
                      ? index == 0 || index == 1
                        ? 270 + 20
                        : 270
                      : normalizedHeight(
                          isHandset
                            ? 400
                            : index == 0 || index == 1 || index == 2
                            ? 320 + 20
                            : 320
                        );
                    // dim.height = normalizedHeight(isHandset ? 400 : 320);
                  }
                )
              }
              //dataProvider={this.state.dataProvider}
              dataProvider={dataProvider.cloneWithRows(wishList)}
              canChangeSize={true}
              rowRenderer={(param1, data, index) => {
                data.name = data.productName;
                data.finalPrice = data.price;
                return (
                  <View
                    style={{
                      marginTop:
                        isHandset && (index == 0 || index == 1)
                          ? 20
                          : !isHandset &&
                            (index == 0 || index == 1 || index == 2)
                          ? 20
                          : 0,
                    }}
                  >
                    <ProductCell
                      data={data}
                      index={index}
                      screenWidth={screenWidth}
                      numOfColumns={numOfColums}
                      currency={currency}
                      likeActive={true}
                      appMediaBaseUrl={appMediaBaseUrl}
                      didTapOnLikeButton={() => {
                        this.onRemoveCalled(data.productId);
                      }}
                      didSelectAdd={(item) =>
                        this.props.navigation.navigate("ProductDetail", {
                          sku: item.sku,
                        })
                      }
                      didTapOnAddToCart={() => {
                        this._didTapOnAddToCart(data);
                      }}
                    />
                  </View>
                );
              }}
              renderAheadDistance={250}
            />
          </View>
        );
      } else {
        // no wishlist
        subComponent = (
          <EmptyDataPlaceholder
            titleText={translate("Your wishlist is empty")}
            descriptionText={translate("wish_list_empty_placeholder")}
            placeHolderImage={Images.noWishlist}
            buttonText={null}
          />
        );
      }
    } else {
      // show login
      subComponent = (
        <View style={{ flex: 1 }}>
          <EmptyDataPlaceholder
            titleText={translate("wishlist not found")}
            descriptionText={""}
            placeHolderImage={Images.noWishlist}
          />
          <View style={styles.bottomContainer}>
            <Text style={styles.loginContentText}>
              {translate("Login below to see your wishlist")}
            </Text>
            <TouchableOpacity
              onPress={() => {
                this.setState({ isLoginViewShow: true });
              }}
              style={styles.buttonLogin}
            >
              <Text style={styles.socialName}>{translate("Login")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return (
      <SafeAreaView style={styles.safeContainer}>
        <StatusBar
          // barStyle="light-content"
          hidden={false}
          backgroundColor={Constants.APP_WHITE_COLOR}
          // translucent={true}
        />
        <View style={{ flex: 1, backgroundColor: Constants.APP_WHITE_COLOR }}>
          <NavigationHeader2
            // hideSearch
            hideBottomLine
            // title={translate("WishList")}
            didTapOnSearch={this._didTapOnSearch}
            didTapOnCart={this._didTapOnCart}
            didTapOnFlag={this._didTapOnFlag}
            isShowFlag={true}
            isDark={false}
            showCart={true}
            cartItemsCount={cartArray.length}
            countryFlag={isRTL ? Images.flags.ukFlag : Images.flags.kuwait}
            isRTL={isRTL}
            appLogoUrl={path}
          />
          {subComponent}
        </View>
        {!isPopUpViewShow && (
          <TouchableOpacity
            style={styles.floatingAction}
            onPress={() => {
              this.setState({ isPopUpViewShow: true });
              setTimeout(() => {
                this.circleButtonRef &&
                  this.circleButtonRef._buttonCenter(true);
              }, 500);
            }}
          >
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
          onBackButtonPress={() => this.setState({ isPopUpViewShow: false })}
          onBackdropPress={() => this.setState({ isPopUpViewShow: false })}
          isVisible={isPopUpViewShow}
          backdropColor={Constants.APP_TRANSPARENT_COLOR}
          style={{ margin: 0 }}
          animationIn={"fadeIn"}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => this.setState({ isPopUpViewShow: false })}
            style={{ flex: 1, backgroundColor: "rgba(110,110,110,0.4)" }}
          >
            <CircleButton
              refer={(ref) => (this.circleButtonRef = ref)}
              size={45}
              didTapOnClose={() => this.setState({ isPopUpViewShow: false })}
              onPressButtonTop={() => {
                this.setState({ isPopUpViewShow: false });
                this.props.navigation.navigate("OthersScreen", {
                  heading: translate("Chat with Us"),
                  url: Constants.CHAT_TAWK_URL,
                  // "https://tawk.to/chat/5d6e3db677aa790be3322605/1ekoem6kc",
                  // "https://tawk.to/chat/5faa638d0a68960861bd7cc6/default",
                });
              }}
            />
          </TouchableOpacity>
        </Modal>
        <Modal
          onBackButtonPress={() => this.setState({ isLoginViewShow: false })}
          isVisible={isLoginViewShow}
          style={{ margin: 0 }}
        >
          <View style={{ flex: 1 }}>
            <Login
              didTapOnclose={() => this.setState({ isLoginViewShow: false })}
            />
          </View>
        </Modal>
        {this.state.showLoader && <HudView />}
        <ActionSheet
          ref={(o) => (this.ActionSheet = o)}
          title={translate("Select your language")}
          options={["English", translate("ARABIC"), translate("Cancel")]}
          cancelButtonIndex={2}
          // destructiveButtonIndex={2}
          tintColor={Constants.APP_THEME_COLOR}
          onPress={(index) => {
            switch (index) {
              case 0: {
                this._didLanguageChange("en");
                break;
              }
              case 1: {
                this._didLanguageChange("ar");
                break;
              }
            }
          }}
        />
        {isLoading && <HudView />}
      </SafeAreaView>
    );
  }
}

export default WishListView;

/**
 * Created by Jebin for iLeaf Solutions Pvt.Ltd
 * on July 27, 2020
 * ProductDetailView - Product details are shown here
 */

import {
  Text,
  View,
  Image,
  Keyboard,
  FlatList,
  UIManager,
  TextInput,
  StatusBar,
  Dimensions,
  ScrollView,
  SafeAreaView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import styles from './styles';
import {WebView} from 'react-native-webview';
import moment from 'moment';

import Login from '../LoginScreen';
import Share from 'react-native-share';
import Modal from 'react-native-modal';
import React, {Component} from 'react';
import Images from '../../config/images';
import HTMLView from 'react-native-htmlview';
import Constants from '../../config/constants';
import HudView from '../../components/hudView';
// import ImageView from "react-native-image-view";
import ImageView from 'react-native-image-viewing';

import NetInfo from '@react-native-community/netinfo';
import {showSingleAlert, addEventTracking} from '../../config/common';
import ImageLoader from 'react-native-image-progress';
import ProductCell from '../../components/productCell';
import {translate} from '../../config/languageSwitching/index';
import RefreshButtonView from '../../components/RefreshButtonView';
import FooterButton from '../../components/FooterButton/FooterButton';
import {normalizedHeight, normalizedWidth} from '../../config/common';
import EmptyDataPlaceholder from '../../components/emptyDataPlaceholder';
import {showSimpleSnackbar, showAlertWithCallback} from '../../config/common';
import NavigationHeader2 from '../../components/NavigationHeaders/NavigationHeader2';
import constants from '../../config/constants';
import ImageComponent from '../../components/ImageComponent';
import analytics from '@react-native-firebase/analytics';

let videoUrl = '';

/** Product Image Component */
const ProductImageItem = React.memo(({item, index, didTapOnItem, props}) => {
  let itemImage = {uri: props.appMediaBaseUrl + item};

  return (
    <TouchableOpacity
      activeOpacity={Constants.ACTIVE_OPACITY}
      onPress={() => {
        didTapOnItem(item, index);
      }}
      style={{alignItems: 'center'}}>
      <View style={{backgroundColor: Constants.APP_WHITE_COLOR}}>
        {/* <ImageLoader
          source={itemImage}
          resizeMode={"contain"}
          style={{
            width: props.screenWidth,
            height: normalizedHeight(557),
          }}
        /> */}

        <ImageComponent
          source={itemImage}
          style={{
            width: props.screenWidth,
            height: normalizedHeight(557),
          }}
        />
      </View>
    </TouchableOpacity>
  );
});

/** Product Color Item Component */
const ColorItem = React.memo(
  ({
    item,
    index,
    didTapOnItem,
    selectedColorIndex,
    props,
    numberOfColumnsOfColorsCell,
  }) => {
    let attributeDict = item.attributes;
    let colorDicts = attributeDict.color;
    let attributeValue = colorDicts.attribute_value;
    let colorCodeValue = 'white';
    let productsColors = props.productsColors;
    let filterdproductsColors = productsColors.filter(obj => {
      return obj.value === String(attributeValue);
    });
    let colorDict =
      filterdproductsColors && filterdproductsColors.length > 0
        ? filterdproductsColors[0]
        : null;
    colorCodeValue = colorDict.label.split('_')[1];

    return (
      <TouchableOpacity
        activeOpacity={Constants.ACTIVE_OPACITY}
        onPress={() => {
          didTapOnItem(item, index);
        }}
        style={{
          alignItems: 'center',
          width: props.screenWidth / 5,
        }}>
        <View style={styles.child_color_view}>
          <View
            style={[
              styles.productColorContainer,
              {backgroundColor: '#' + colorCodeValue},
            ]}>
            {selectedColorIndex == index ? (
              <Image source={Images.whiteTick} style={[styles.checkbox_icon]} />
            ) : null}
          </View>
        </View>
      </TouchableOpacity>
    );
  },
);

/** Product Size Item Component */
const SizeItem = React.memo(
  ({item, index, didTapOnItem, selectedSizeIndex, props}) => {
    let attributeDict = item.attributes;
    let sizeDicts = attributeDict.size;
    let attributeValue = sizeDicts.attribute_value;
    let productsSizes = props.productsSizes;
    let filterdProductsAgeGroups = productsSizes.filter(obj => {
      return obj.value === String(attributeValue);
    });
    let sizeDict =
      filterdProductsAgeGroups && filterdProductsAgeGroups.length > 0
        ? filterdProductsAgeGroups[0]
        : null;
    let size = sizeDict ? sizeDict.label : '';

    return (
      <TouchableOpacity
        activeOpacity={Constants.ACTIVE_OPACITY}
        onPress={() => {
          didTapOnItem(item, index);
        }}
        style={{
          alignItems: 'center',
          width: (props.screenWidth - 40) / 4,
        }}>
        <View
          style={[
            styles.productSizeButton,
            {
              backgroundColor:
                selectedSizeIndex == index
                  ? Constants.APP_THEME_COLOR
                  : Constants.APP_GRAY_COLOR,
            },
          ]}>
          <Text style={styles.sizeText}>{size}</Text>
        </View>
      </TouchableOpacity>
    );
  },
);

class ProductDetailView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      productImagesArray: [],
      visibleImageIndex: 0,
      selectedSizeIndex: 0,
      productCount: 1,
      selectedColorIndex: 0,
      isLoginViewShow: false,
      productDetails: null,
      isLiked: false,
      sizeArray: [],
      colorArray: [],
      selectedProductDict: null,
      isProductGetAPICalling: false,
      isSizeChartShow: false,
      modalVisible: false,
      isImageViewVisible: false,
      imagePopUpArray: [],
      ipmagePopUpIndex: 0,
      isRefreshing: false,
      noInterNetView: false,
      reviewText: '',
      isAPIFailed: false,
      relatedProducts: [],
      selectedGenderIndex: 0,
      // videoUrl: "",
      vimio_video_url: '',
      isExpanded: false,
      productReviews: [],
      boughtTogetherProducts: [],
      selectedTogetherProducts: [],
      togetherProductTotal: 0,
      isTapOnAddAllItemToCart: false,
    };
    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  componentDidMount() {
    videoUrl = '';
    // const sku = "A1752";
    // const sku = "DP40APVC";
    const sku = this.props.navigation.state.params
      ? this.props.navigation.state.params.sku
      : '';

    const urlKey = this.props.navigation.state.params
      ? this.props.navigation.state.params.urlKey
      : '';

    // this.setState({ sku: sku });
    // const sku = "null";
    // const sku = "24053-1"; //"ART-NEON-80-A4-P";

    if (sku) {
      this.unsubscribe = NetInfo.addEventListener(state => {
        let networkStatus = state.isConnected;
        if (networkStatus) {
          this.props.getProductDetail(sku, this._productDetailsCallback);

          setTimeout(() => {
            this.props.getRelatedProductDetail(
              sku,
              this._relatedproductDetailsCallback,
            );
          }, 1000);

          setTimeout(() => {
            this.props.getBoughtTogetherProducts(
              sku,
              this._getBoughtTogetherProductsCallback,
            );
          }, 2000);

          this.props.getUserReviews(sku, data => {
            this.setState({productReviews: data});
          });
          this.setState({isProductGetAPICalling: true});
          this.setState({noInterNetView: false});
        } else {
          this.setState({noInterNetView: true});
          this.setState({isProductGetAPICalling: false});
        }
      });
    } else if (urlKey) {
      this.unsubscribe = NetInfo.addEventListener(state => {
        let networkStatus = state.isConnected;
        if (networkStatus) {
          this.props.getProductDetailWithURLKey(urlKey, data => {
            this._productDetailsCallback(data);
            this.props.getRelatedProductDetail(
              data.gendersku,
              this._relatedproductDetailsCallback,
            );
            this.props.getUserReviews(data.sku, data => {
              this.setState({productReviews: data});
            });
            this.props.getBoughtTogetherProducts(
              data.sku,
              this._getBoughtTogetherProductsCallback,
            );
          });

          this.setState({isProductGetAPICalling: true});
          this.setState({noInterNetView: false});
        } else {
          this.setState({noInterNetView: true});
          this.setState({isProductGetAPICalling: false});
        }
      });
    } else {
      this.setState({isAPIFailed: true});
    }
  }

  _onProductView = async () => {
    const sku = this.props.navigation.state.params
      ? this.props.navigation.state.params.sku
      : '';
    // await analytics().logEvent("product_view", {
    //   id: sku,
    // });

    // console.log("FFFF");
    // let resp = await analytics().logAddToCart();
    // console.log("^^^^^^^^^^^^^^^^^^^^^^^", resp);

    analytics()
      .logEvent('Product_detail', {id: sku})
      .then(rsp => {
        console.log('VIEW PRODUCT DETAIL SUCCESS-----', rsp);
      })
      .catch(error => {
        console.log('ERROR@@@@', error);
      });
  };

  _productDetailsCallback = productDetails => {
    addEventTracking('faxmbl');
    this._onProductView();

    if (productDetails) {
      let imageDict = productDetails.image;
      let imageGallery = imageDict ? imageDict.gallery : null;
      let productImagesArray = imageGallery ? imageGallery.images : [];

      this.props.addToRecentlyViewed(productDetails);

      this.setState({
        productDetails,
        productImagesArray,
        isProductGetAPICalling: false,
        isAPIFailed: false,
        vimio_video_url: productDetails.video_url
          ? productDetails.video_url
          : '',
      });
      this.props.wishList.map(item => {
        if (
          productDetails.entity_id &&
          item.productId === productDetails.entity_id.toString()
        ) {
          this.setState({isLiked: true});
        }
      });

      let children = productDetails.children ? productDetails.children : [];

      if (children.length > 0) {
        const newSizeArray2 = [];
        const newColorArray2 = [];
        children.forEach(obj => {
          if (
            !newSizeArray2.some(
              o =>
                o.attributes.size.attribute_value ===
                obj.attributes.size.attribute_value,
            )
          ) {
            if (obj.attributes.size.attribute_value)
              newSizeArray2.push({...obj});
          }

          if (
            !newColorArray2.some(
              o =>
                o.attributes.color.attribute_value ===
                obj.attributes.color.attribute_value,
            )
          ) {
            if (obj.attributes.color.attribute_value)
              newColorArray2.push({...obj});
          }
        });

        let selectedProductDict = children[0];
        this.setState(
          {
            sizeArray: newSizeArray2,
            colorArray: newColorArray2,
            selectedProductDict,
          },
          () => {
            this._didSelectVarient(selectedProductDict, 0);
          },
        );
      } else {
        let selectedProductDict = {
          specifications: productDetails.specifications,
          sku: productDetails.sku,
          price: productDetails.regularPrice,
          name: productDetails.name,
          image: productDetails.image,
          finalPrice: productDetails.finalPrice,
          is_in_stock: productDetails.is_in_stock,
          qty: productDetails.qty,
        };
        this.setState(
          {
            sizeArray: [],
            colorArray: [],
            selectedProductDict,
          },
          () => {
            this._didSelectVarient(selectedProductDict, 0);
          },
        );
      }
    } else {
      this.setState({isAPIFailed: true});
    }
  };

  _relatedproductDetailsCallback = relatedproductDetails => {
    this.setState({relatedProducts: relatedproductDetails});
  };

  _getBoughtTogetherProductsCallback = products => {
    let total = 0;
    products.map(data => {
      total = total + data.finalPrice;
    });

    this.setState({
      boughtTogetherProducts: products,
      selectedTogetherProducts: JSON.parse(JSON.stringify(products)),
      togetherProductTotal:
        total +
        (this.state.selectedProductDict
          ? this.state.selectedProductDict.finalPrice
          : 0),
    });
  };

  _didPullToRefresh = () => {
    const {isNetworkAvailable} = this.props;
    this.setState({isRefreshing: true});

    setTimeout(() => {
      this.setState({isRefreshing: false});
    }, 1000);
    if (!isNetworkAvailable) {
      showSingleAlert(translate('No internet connection'));
      return;
    }

    const sku = this.props.navigation.state.params
      ? this.props.navigation.state.params.sku
      : '';

    const urlKey = this.props.navigation.state.params
      ? this.props.navigation.state.params.urlKey
      : '';

    if (sku) {
      this.props.getProductDetail(sku, this._productDetailsCallback);
      this.props.getRelatedProductDetail(
        sku,
        this._relatedproductDetailsCallback,
      );

      this.props.getBoughtTogetherProducts(
        sku,
        this._getBoughtTogetherProductsCallback,
      );

      this.setState({isProductGetAPICalling: true});
    } else if (urlKey) {
      this.props.getProductDetailWithURLKey(urlKey, data => {
        this._productDetailsCallback(data);
      });
    } else {
    }
  };

  _didTapOnCart = () => {
    this.props.navigation.navigate('Cart');
  };

  _didTapOnBackButton = () => {
    this.props.navigation.goBack();
  };

  _didTapOnShare = () => {
    const {productDetails} = this.state;
    const url = productDetails.shareurl;
    const title = global.isRTL ? Constants.APP_NAME_ARABIC : Constants.APP_NAME;
    const message = productDetails.name;

    addEventTracking('c4p6vb');

    analytics()
      .logShare({
        content_type: url,
        item_id: title,
        method: '',
      })
      .then(rsp => {
        console.log('ANALYTICS SHARE SUCCESS-----', rsp);
      })
      .catch(error => {
        console.log('ERROR@@@@', error);
      });

    const options = Platform.select({
      ios: {
        activityItemSources: [
          {
            placeholderItem: {type: 'url', content: url},
            item: {
              default: {type: 'url', content: url},
            },
            subject: {
              default: title,
            },
            linkMetadata: {originalUrl: url, url, title},
          },
          {
            placeholderItem: {type: 'text', content: message},
            item: {
              default: {type: 'text', content: message},
              message: null, // Specify no text to share via Messages app.
            },
          },
        ],
      },
      default: {
        title,
        subject: title,
        message: `${message} ${url}`,
      },
    });
    Share.open(options);
  };

  _onViewableItemsChanged = ({viewableItems, changed}) => {
    if (viewableItems.length > 0)
      this.setState({
        visibleImageIndex: viewableItems[0].index,
      });
  };

  _didChangeGenderCategory = selectedGenderIndexVal => {
    const {selectedGenderIndex} = this.state;

    if (selectedGenderIndex === selectedGenderIndexVal) return;
    this.setState({selectedGenderIndex: selectedGenderIndexVal});

    // let filter = this.state.filterParams;
    // let filterParams = {};

    // switch (selectedGenderIndexVal) {
    //   case 0:
    //     filterParams["gender"] = []; // All
    //     break;
    //   case 1:
    //     filterParams["gender"] = [5508]; // Boys
    //     break;
    //   case 2:
    //     filterParams["gender"] = [5509]; // Girls
    //     break;
    // }

    // if (filter.filter_attributes) {
    //   filter.filter_attributes = filterParams;
    // } else {
    //   filter["filter_attributes"] = filterParams;
    // }

    // console.log("FILTER PARAMS==", filter);

    // this.setState(
    //   {
    //     selectedAgeIndex: 0,
    //     filterParams: filter,
    //     pageIndexCategory1: 0,
    //     isAPICalledCategory1: false,
    //   },
    //   () => {
    //     this._getProductListData(selectedSubCategoryId, true);
    //   }
    // );
  };

  _didTapOnDecrement = () => {
    const {productCount} = this.state;
    if (productCount > 1) {
      this.setState({productCount: productCount - 1});
    }
  };

  _didTapOnIncrement = () => {
    const {productCount, selectedProductDict} = this.state;

    if (productCount >= selectedProductDict.qty) {
      return;
    }
    this.setState({productCount: productCount + 1});
  };

  _didTapOnAddToCart = isBuyNow => {
    const {userToken, guestToken, quoteID, cartArray} = this.props;
    const {
      productCount,
      productDetails,
      selectedColorIndex,
      selectedSizeIndex,
      selectedProductDict,
    } = this.state;

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
        if (
          (selectedProductDict && selectedProductDict.sku === item.sku) ||
          productDetails.sku === item.sku
        ) {
          isProductInCart = true;
          cartProductInfo = item;
        }
      });
    }

    if (isProductInCart) {
      let cartProductCount = cartProductInfo.qty;
      if (cartProductCount + productCount > Constants.MAX_PRODUCT_COUNT) {
        showSingleAlert(translate('product count max in detail screen'));
        return;
      }
    }

    let isOutOfStock = false;
    if (selectedProductDict && selectedProductDict.is_in_stock) {
      isOutOfStock = !selectedProductDict.is_in_stock;
    }

    if (selectedProductDict.qty <= 0) {
      isOutOfStock = true;
    }

    if (isOutOfStock) {
      showSingleAlert(
        translate('Out of stock description') + ' ' + translate('Out of stock'),
      );
      return;
    }

    if (isProductInCart) {
      let guestparams = {
        cart_item: {
          sku: productDetails.sku,
          qty: cartProductInfo.qty + productCount,
          quote_id: userToken === '' ? guestToken : quoteID,
          item_id: cartProductInfo.item_id,
        },
      };

      if (userToken === '') {
        this.props.updateGuestCart(
          cartProductInfo.item_id,
          (status, message) => {
            if (status) {
              this._userAddedPtoCartCallback(status, isBuyNow);
            } else {
              showSingleAlert(message, 'Ok', () => {
                // this.props.getProuctsInCart();
              });
            }
          },
          guestparams,
          0,
        );
      } else {
        this.props.updateUserCart(
          guestparams,
          (status, message) => {
            if (status) {
              this._userAddedPtoCartCallback(status, isBuyNow);
            } else {
              showSingleAlert(message, 'Ok', () => {
                // this.props.getProuctsInCart();
              });
            }
          },
          cartProductInfo.item_id,
        );
      }
    } else {
      if (userToken) {
        let colorId = '';
        let sizeId = '';
        let product_option = null;

        if (selectedProductDict && selectedProductDict.attributes) {
          let attributes = selectedProductDict.attributes;
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
            sku: productDetails.sku,
            qty: productCount,
          },
        };

        if (product_option) {
          params.cart_item['product_option'] = product_option;
        }

        this.props.addPtoCartForLoggedUser(
          params,
          false,
          (status, responseMessage) => {
            if (status) {
              this._userAddedPtoCartCallback(status, isBuyNow);
            } else {
              if (responseMessage) {
                showSingleAlert(responseMessage);
              } else {
                this.setState({isAPIFailed: true});
              }
            }
          },
        );
      } else if (guestToken) {
        let colorId = '';
        let sizeId = '';
        let color_code = '';
        let product_option = null;

        if (selectedProductDict && selectedProductDict.attributes) {
          let attributes = selectedProductDict.attributes;
          colorId = attributes.color.attribute_value;
          sizeId = attributes.size.attribute_value;
          let specifications = selectedProductDict.specifications;
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

          if (
            specifications &&
            specifications.gender &&
            specifications.gender.attribute_value
          ) {
            let info = specifications.gender;
            optionArray.push({
              option_id: info.attribute_id,
              option_value: info.attribute_value,
            });
          }

          if (color_code) {
            optionArray.push({
              option_id: '163',
              option_value: color_code,
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
            sku: productDetails.sku,
            qty: productCount,
          },
        };

        if (product_option) {
          params.cart_item['product_option'] = product_option;
        }

        this.props.guestAddToCart(params, false, (status, responseMessage) => {
          if (status) {
            this._guestAddToCartCallback(status, isBuyNow);
          } else {
            if (responseMessage) {
              showSingleAlert(responseMessage);
            } else {
              this.setState({isAPIFailed: true});
            }
          }
        });
      } else {
        this.props.createGuestCart(status =>
          this._createGuestCartCallback(status, isBuyNow),
        );
      }
    }
  };

  _addAllItemsToCart = () => {
    const {userToken, guestToken, quoteID, cartArray, guestQuoteId} =
      this.props;
    const {
      productCount,
      productDetails,
      selectedColorIndex,
      selectedSizeIndex,
      selectedProductDict,
      selectedTogetherProducts,
    } = this.state;

    if (cartArray.length >= Constants.MAX_CART_SIZE) {
      showSingleAlert(
        translate('cart count exceeds1') +
          Constants.MAX_CART_SIZE +
          translate('cart count exceeds2'),
      );
      return;
    }

    let cartItemExistsAndItsMaxReached = false;
    let itemOutOfStock = false;
    selectedTogetherProducts.map(item => {
      /**Check whether the Product's maximum count reached or not */
      let isProductInCart = false;
      let cartProductInfo;
      if (cartArray.length > 0) {
        cartArray.map(item => {
          if (item && item.sku === item.sku) {
            isProductInCart = true;
            cartProductInfo = item;
          }
        });
      }

      if (isProductInCart) {
        let cartProductCount = cartProductInfo.qty;
        if (cartProductCount + productCount > Constants.MAX_PRODUCT_COUNT) {
          // showSingleAlert(translate("product count max in detail screen"));
          cartItemExistsAndItsMaxReached = true;
          return;
        }
      }

      /**Check whether the product is out of stock or not */
      let isOutOfStock = false;
      if (item && item.is_in_stock) {
        isOutOfStock = !item.is_in_stock;
      }

      if (item.qty <= 0) {
        isOutOfStock = true;
      }

      if (isOutOfStock) {
        // showSingleAlert(
        //   translate("Out of stock description") +
        //     " " +
        //     translate("Out of stock")
        // );
        itemOutOfStock = true;
        return;
      }
    });

    if (cartItemExistsAndItsMaxReached) {
      showSingleAlert(translate('product count max in detail screen'));
      return;
    }

    if (itemOutOfStock) {
      showSingleAlert(
        translate('Out of stock description') + ' ' + translate('Out of stock'),
      );
      return;
    }

    // this._reccurvieFunction(0);

    let items = [];
    selectedTogetherProducts.map(productItem => {
      items.push({sku: productItem.sku, qty: 1});
    });

    let params =
      userToken.length > 0
        ? {items: items}
        : {quote_id: guestQuoteId, items: items};

    this.props.addExtraProductsToCart(params, () => {});
  };

  // _reccurvieFunction = (index) => {
  //   const { userToken, guestToken, quoteID, cartArray } = this.props;
  //   const { selectedTogetherProducts } = this.state;

  //   if (selectedTogetherProducts.length <= index) {
  //     this.props.getProuctsInCart();
  //     return;
  //   }

  //   let item = selectedTogetherProducts[index];

  //   let isProductInCart = false;
  //   let cartProductInfo;
  //   if (cartArray.length > 0) {
  //     cartArray.map((obj) => {
  //       if (obj && obj.sku === item.sku) {
  //         isProductInCart = true;
  //         cartProductInfo = obj;
  //       }
  //     });
  //   }

  //   if (isProductInCart) {
  //     let guestparams = {
  //       cart_item: {
  //         sku: item.sku,
  //         qty: cartProductInfo.qty + 1,
  //         quote_id: userToken === "" ? guestToken : quoteID,
  //         item_id: cartProductInfo.item_id,
  //       },
  //     };

  //     if (userToken === "") {
  //       this.props.updateGuestCart(
  //         cartProductInfo.item_id,
  //         (status, message) => {
  //           if (status) {
  //             this._reccurvieFunction(index + 1);
  //           } else {
  //             showSingleAlert(message, "Ok", () => {});
  //           }
  //         },
  //         guestparams,
  //         0
  //       );
  //     } else {
  //       this.props.updateUserCart(
  //         guestparams,
  //         (status, message) => {
  //           if (status) {
  //             this._reccurvieFunction(index + 1);
  //           } else {
  //             showSingleAlert(message, "Ok", () => {});
  //           }
  //         },
  //         cartProductInfo.item_id
  //       );
  //     }
  //   } else {
  //     if (userToken) {
  //       let params = {
  //         cart_item: {
  //           quote_id: quoteID,
  //           sku: item.sku,
  //           qty: 1,
  //         },
  //       };

  //       this.props.addPtoCartForLoggedUser(
  //         params,
  //         true,
  //         (status, responseMessage) => {
  //           if (status) {
  //             this._reccurvieFunction(index + 1);
  //           } else {
  //             if (responseMessage) {
  //               showSingleAlert(responseMessage);
  //             } else {
  //               this.setState({ isAPIFailed: true });
  //             }
  //           }
  //         }
  //       );
  //     } else if (guestToken) {
  //       let params = {
  //         cart_item: {
  //           quote_id: guestToken,
  //           sku: item.sku,
  //           qty: 1,
  //         },
  //       };

  //       console.log("GUESTTTTTTTTTTTTTTTTTTTTTTTTTTT");
  //       this.props.guestAddToCart(params, true, (status, responseMessage) => {
  //         if (status) {
  //           this._reccurvieFunction(index + 1);
  //         } else {
  //           if (responseMessage) {
  //             showSingleAlert(responseMessage);
  //           } else {
  //             this.setState({ isAPIFailed: true });
  //           }
  //         }
  //       });
  //     } else {
  //       this.props.createGuestCart((status) => this._reccurvieFunction(0));
  //     }
  //   }
  // };

  _createGuestCartCallback = (status, isBuyNow) => {
    setTimeout(() => {
      if (status) this._didTapOnAddToCart(isBuyNow);
    }, 500);
  };

  _userAddedPtoCartCallback = (status, isBuyNow) => {
    addEventTracking('2pgsk2');

    analytics()
      .logAddToCart()
      .then(rsp => {
        console.log('FIREBASE ADD TO CART ADD TO CART SUCCESS-----', rsp);
      })
      .catch(error => {
        console.log('ERROR@@@@', error);
      });

    if (isBuyNow) {
      this._didTapOnCart();
      // this.props.getTotalCost((totalCostDict) => {
      //   console.log("totalCostDict", totalCostDict);
      //   this.props.navigation.navigate("Checkout", {
      //     totalCost: totalCostDict,
      //     isFromProductDetail: true,
      //   });
      // });
    } else {
      if (status) {
        showSimpleSnackbar(translate('Product added to cart'));
      }
      if (this.state.isTapOnAddAllItemToCart) {
        this.setState({isTapOnAddAllItemToCart: false});
        this._addAllItemsToCart();
      }
    }
  };

  _guestAddToCartCallback = (status, isBuyNow) => {
    addEventTracking('2pgsk2');

    analytics()
      .logAddToCart()
      .then(rsp => {
        console.log('SUCCESS-----', rsp);
      })
      .catch(error => {
        console.log('ERROR@@@@', error);
      });

    if (isBuyNow) {
      this._didTapOnCart();
      // this.props.getTotalCost((totalCostDict) => {
      //   const { guestAddressList } = this.props;
      //   if (guestAddressList.length > 0) {
      //     this.props.navigation.navigate("Checkout", {
      //       totalCost: totalCostDict,
      //       isFromProductDetail: true,
      //     });
      //   } else {
      //     this.props.navigation.navigate("GuestAddAddress", {
      //       details: {},
      //       isFromCheckOutScreen: true,
      //       isFromProductsDetailScreen: true,
      //       totalCost: totalCostDict,
      //     });
      //   }
      // });
    } else {
      if (status) {
        showSimpleSnackbar(translate('Product added to cart'));
      }

      if (this.state.isTapOnAddAllItemToCart) {
        this.setState({isTapOnAddAllItemToCart: false});
        this._addAllItemsToCart();
      }
    }
  };

  _didTapOnNotifyMe = () => {
    const {productDetails} = this.state;
    const {onDislikeTap, onLikeTap, userToken} = this.props;
    if (userToken.length > 0) {
      this.props.notifyMe({product_id: productDetails.entity_id}, status => {
        if (status) {
          showSingleAlert(translate('notify me success'), 'Ok', () => {
            this.props.navigation.goBack();
          });
        }
      });
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

  _didTapOnBuyNow = () => {
    // this._didTapOnCart();
    this._didTapOnAddToCart(true);
    // const { selectedProductDict } = this.state;
    // const { userToken, guestInfo, cartArray } = this.props;

    // let isOutOfStock = false;
    // if (selectedProductDict && selectedProductDict.is_in_stock) {
    //   isOutOfStock = !selectedProductDict.is_in_stock;
    // }

    // if (isOutOfStock) {
    //   showSingleAlert(
    //     translate("Out of stock description") + " " + translate("Out of stock")
    //   );
    //   return;
    // }

    // if (cartArray.length >= Constants.MAX_CART_SIZE) {
    //   showSingleAlert(
    //     translate("cart count exceeds1") +
    //       Constants.MAX_CART_SIZE +
    //       translate("cart count exceeds2")
    //   );
    //   return;
    // }

    // if (userToken.length > 0) {
    //   this._didTapOnAddToCart(true);
    // } else {
    //   if (!guestInfo) {
    //     this.setState({ isLoginViewShow: true });
    //   } else {
    //     this._didTapOnAddToCart(true);
    //   }
    // }
  };

  _didTapOnLikeButton = productId => {
    const {userToken, onLikeTap, onDislikeTap} = this.props;
    if (userToken.length > 0) {
      if (this.state.isLiked) {
        onDislikeTap(productId, status => {
          if (status) {
            showSimpleSnackbar(translate('Item removed from wishlist'));
            this.setState({isLiked: false});
          } else {
            this.setState({isLiked: true});
          }
        });

        this.setState({isLiked: false});
      } else {
        onLikeTap(productId, status => {
          if (status) {
            showSimpleSnackbar(translate('Item added to wishlist'));
            this.setState({isLiked: true});
          } else {
            this.setState({isLiked: false});
          }
        });
        this.setState({isLiked: true});
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

  _didTapOnLikeButtonOfRelatedProduct = (isLiked, data) => {
    const {onDislikeTap, onLikeTap, userToken} = this.props;
    if (userToken.length > 0) {
      if (isLiked) {
        onDislikeTap(data.entity_id, status => {
          if (status) {
            showSimpleSnackbar(translate('Item removed from wishlist'));
          }
        });
      } else {
        onLikeTap(data.entity_id, status => {
          if (status) {
            showSimpleSnackbar(translate('Item added to wishlist'));
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

  _openVideoPlayer = item => {
    this.props.navigation.navigate('VideoPlayer', {vimeoUrl: item});
  };

  _didSelectVarient = (item, index) => {
    const {
      sizeArray,
      colorArray,
      productDetails,
      selectedSizeIndex,
      selectedColorIndex,
      selectedTogetherProducts,
    } = this.state;
    let children = productDetails.children ? productDetails.children : [];
    let isItemAvailable = false;
    let sizeObj = sizeArray.length > 0 ? sizeArray[selectedSizeIndex] : null;
    let colorObj =
      colorArray.length > 0 ? colorArray[selectedColorIndex] : null;
    let selectedProductItem;

    children.map((i, j) => {
      if (sizeObj && colorObj) {
        if (
          sizeObj &&
          colorObj &&
          i.attributes.size.attribute_value ===
            sizeObj.attributes.size.attribute_value &&
          i.attributes.color.attribute_value ===
            colorObj.attributes.color.attribute_value
        ) {
          isItemAvailable = true;
          selectedProductItem = i;
        }
      } else if (
        sizeObj &&
        i.attributes.size.attribute_value ===
          sizeObj.attributes.size.attribute_value
      ) {
        isItemAvailable = true;
        selectedProductItem = i;
      } else if (
        colorObj &&
        i.attributes.color.attribute_value ===
          colorObj.attributes.color.attribute_value
      ) {
        isItemAvailable = true;
        selectedProductItem = i;
      }
    });

    if (isItemAvailable) {
      let imageDict = selectedProductItem.image;
      let imageGallery = imageDict ? imageDict.gallery : null;
      let productImagesArray = imageGallery ? imageGallery.images : [];

      let total = 0;
      if (selectedTogetherProducts.length > 0)
        this.state.selectedTogetherProducts.map(data => {
          total = total + data.finalPrice;
        });

      this.setState({
        selectedProductDict: selectedProductItem,
        productImagesArray,
        togetherProductTotal: total + selectedProductItem.finalPrice,
      });
    }
  };

  _didTapOnSizeChart = () => {
    this.setState({isSizeChartShow: true});
  };

  _didSelectProductImage = (item, index) => {
    const {productImagesArray} = this.state;
    const {appMediaBaseUrl} = this.props;
    let popUpImagearray = [];
    productImagesArray.map(item => {
      let dict = {
        uri: appMediaBaseUrl + item,
      };
      popUpImagearray.push(dict);
    });

    this.setState({
      isImageViewVisible: true,
      ipmagePopUpIndex: index,
      imagePopUpArray: popUpImagearray,
    });
  };

  _didTapOnTextInput = () => {
    const {userToken} = this.props;
    if (userToken.length > 0) {
    } else {
      Keyboard.dismiss();

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

  _didTapOnPostbutton = () => {
    const {userToken, userInfo} = this.props;
    const {reviewText, productDetails} = this.state;

    if (userToken.length > 0) {
      if (reviewText.trim() === '') {
        showSingleAlert('Please enter a review.');
        this.setState({reviewText: ''});
      } else {
        //API CALL
        let nickname = userInfo.firstname + userInfo.lastname;
        let reviewDict = {
          review: {
            title: 'Title',
            detail: reviewText.trim(),
            nickname: nickname,
            customer_id: userInfo.id ? userInfo.id : null,
            ratings: [
              {
                rating_name: 'Rating',
                value: 2,
              },
            ],
            review_entity: 'product',
            review_status: 2,
            entity_pk_value: parseInt(productDetails.entity_id),
          },
        };

        this.props.postUserReview(reviewDict, this._didAddReviewCallback);
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

  onReloadClick = () => {
    this._didPullToRefresh();
  };

  _didAddReviewCallback = reviewDetails => {
    showSingleAlert(translate('review_description'));
    this.setState({reviewText: ''});
  };

  _didTapOnAddToCartRelated = productDetails => {
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

      this.props.addPtoCartForLoggedUser(
        params,
        false,
        (status, responseMessage) => {
          if (status) {
            this._userAddedPtoCartCallback(status, false);
          } else {
            if (responseMessage) {
              showSingleAlert(responseMessage);
            } else {
              this.setState({isAPIFailed: true});
            }
          }
        },
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

      this.props.guestAddToCart(params, false, (status, responseMessage) => {
        if (status) {
          this._guestAddToCartCallback(status, false);
        } else {
          if (responseMessage) {
            showSingleAlert(responseMessage);
          } else {
            this.setState({isAPIFailed: true});
          }
        }
      });
    } else {
      this.props.createGuestCart(status =>
        this._createGuestCartCallback(status, productDetails),
      );
    }
  };

  _renderHTMLNode = (node, index, siblings, parent, defaultRenderer) => {
    if (node.name == 'iframe') {
      const a = node.attribs;
      const iframeHtml = `<iframe src="${a.src}"></iframe>`;
      // this.setState({ htmlVideoInfo: node.attribs });
      // this.setState({
      //   videoUrl: "https:" + a.src,
      // });
      videoUrl = 'https:' + a.src;

      return null;
      // return <View>{/* <WebView source={{ html: iframeHtml }} /> */}</View>;
    }
  };

  _didUpdateOption = item => {
    const {selectedProductDict} = this.state;
    let selectedTogetherProducts = this.state.selectedTogetherProducts;

    let index = -1;
    selectedTogetherProducts.map((data, i) => {
      if (data.sku === item.sku) {
        index = i;
      }
    });

    if (index >= 0) {
      selectedTogetherProducts.splice(index, 1);
    } else {
      selectedTogetherProducts.push(item);
    }

    let total = 0;
    selectedTogetherProducts.map(data => {
      total = total + data.finalPrice;
    });

    this.setState({
      selectedTogetherProducts: selectedTogetherProducts,
      togetherProductTotal: total + selectedProductDict.finalPrice,
    });
  };

  renderBoughtTogetherItems = ({item, index}) => {
    const {currency} = this.props;
    const {selectedTogetherProducts} = this.state;
    let actualPrice = item.price;
    let finalPrice = item.finalPrice;

    let obj = selectedTogetherProducts.find(i => i.sku === item.sku);

    let percentage = ((actualPrice - finalPrice) / actualPrice) * 100;
    percentage = Number(percentage.toFixed(1));

    let imageUrl = index == 0 ? item.image.main : item.image;
    return (
      <View
        style={{
          flex: 1,
          marginTop: 10,
        }}>
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            flex: 1,
          }}
          onPress={() => {
            if (index != 0)
              this.props.navigation.push('ProductDetail', {
                sku: item.sku,
              });
          }}>
          <TouchableOpacity
            hitSlop={{top: 20, left: 20, right: 20, bottom: 20}}
            onPress={() => {
              if (index == 0) {
                return;
              } else this._didUpdateOption(item);
            }}
            style={[
              styles.selectOption,
              {
                borderColor:
                  index == 0
                    ? 'rgba(110,110,110,0.5)'
                    : 'rgba(110,110,110,0.8)',
              },
            ]}>
            {index == 0 ? (
              <Image
                style={{tintColor: 'rgba(110,110,110,0.5)'}}
                source={Images.tickCheck}
              />
            ) : obj ? (
              <Image source={Images.tickCheck} />
            ) : null}
          </TouchableOpacity>

          <View>
            <ImageComponent
              key={index + 'ff'}
              source={{
                uri: this.props.appMediaBaseUrl + imageUrl,
              }}
              style={{
                // width: 100, //(screenWidth - 32) / numOfColumns, //(Constants.SCREEN_WIDTH - 50) / 2,
                height: normalizedHeight(100),
                width: normalizedHeight(80),
              }}
            />
            {!item.is_in_stock && (
              <View
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text style={styles.outOfStockText}>
                  {translate('Out of stock')}
                </Text>
              </View>
            )}
          </View>

          <View
            style={{
              marginHorizontal: 10,
              justifyContent: 'center',
              flex: 1,
            }}>
            <Text numberOfLines={2} style={[styles.productName]}>
              {item.name}
            </Text>
            <View
              style={{
                marginVertical: 10,
                // height: 30,
              }}>
              <Text style={[styles.cost]}>
                {Number(item.finalPrice).toFixed(3) + ' ' + currency}
              </Text>
              {percentage > 0 && (
                <Text style={styles.offerText2}>
                  {Number(actualPrice).toFixed(3) + ' ' + currency}
                </Text>
              )}
            </View>
          </View>
        </TouchableOpacity>

        {index !== this.state.boughtTogetherProducts.length ? (
          <Text
            style={{
              marginLeft: normalizedHeight(80) / 2 + 60,
              fontSize: 16,
              marginVertical: 10,
            }}>
            +
          </Text>
        ) : (
          <View style={{height: 20}} />
        )}
      </View>
    );
  };

  render() {
    const {
      isRTL,
      isLoading,
      isHandset,
      currency,
      cartArray,
      userToken,
      isNetworkAvailable,
      productsBrands,
      productsAges,
      productsAgeGroups,
      productsGenders,
      productsDeliveryTypes,
      wishList,
      recentlyViewedProducts,
      appMediaBaseUrl,
      appLogoUrl,
    } = this.props;
    const {
      productDetails,
      productCount,
      productImagesArray,
      visibleImageIndex,
      selectedSizeIndex,
      selectedColorIndex,
      isLoginViewShow,
      sizeArray,
      colorArray,
      selectedProductDict,
      isProductGetAPICalling,
      isSizeChartShow,
      modalVisible,
      isImageViewVisible,
      ipmagePopUpIndex,
      imagePopUpArray,
      isRefreshing,
      noInterNetView,
      reviewText,
      isAPIFailed,
      relatedProducts,
      selectedGenderIndex,
      // videoUrl,
      htmlVideoInfo,
      vimio_video_url,
      isExpanded,
      productReviews,
      boughtTogetherProducts,
      togetherProductTotal,
    } = this.state;

    let numberOfColumnsOfColorsCell = 5;
    let productdescription = '';
    let hasVideo = false;
    let productName = '';
    let productFinalPrice = '';
    let productActualPrice = '';
    let productId = '';
    let percentage = 0;
    let videoDict = null;
    let outOfStock = false;
    let UPC = '';
    let brandLabel = '';
    let ageLabel = '';
    let genderLabel = '';
    let sameDayDelivery = false;
    let isRefundable = '';
    let sameDayDeliveryString = '';
    let deliveryTypeAvailable = false;

    if (productDetails) {
      productId = productDetails.entity_id;
      productName = productDetails.name;
      productFinalPrice = productDetails.finalPrice;
      productActualPrice = productDetails.regularPrice;
      percentage = Math.floor(
        ((productActualPrice - productFinalPrice) / productActualPrice) * 100,
      );

      productdescription = productDetails.description;
      let productMediaarray = productDetails.image;
      let gallery = productMediaarray.gallery;

      if (gallery && gallery.videos && gallery.videos.length > 0) {
        hasVideo = true;
        videoDict = gallery.videos[0];
      }
    }

    if (selectedProductDict) {
      productName = selectedProductDict.name;
      productFinalPrice = selectedProductDict.finalPrice;
      productActualPrice = selectedProductDict.price;
      UPC = selectedProductDict.sku;

      if (selectedProductDict.specifications) {
        let brand = selectedProductDict.specifications.brand
          ? selectedProductDict.specifications.brand
          : null;
        if (brand) {
          let brandDict = productsBrands.filter(obj => {
            return obj.value === String(brand.attribute_value);
          });
          brandLabel = brandDict.length > 0 ? brandDict[0].label : '';
        }

        let age = selectedProductDict.specifications.age_range
          ? selectedProductDict.specifications.age_range
          : null;

        if (age && age.attribute_value) {
          let dataArray = age.attribute_value.split(',');

          if (dataArray.length > 0) {
            dataArray.map(itm => {
              let ageDict = productsAgeGroups.filter(obj => {
                return obj.value === String(itm);
              });
              let ageLabelTmp = ageDict.length > 0 ? ageDict[0].label : '';
              ageLabel = ageLabel + ', ' + ageLabelTmp;
            });
          } else {
            let ageDict = productsAgeGroups.filter(obj => {
              return obj.value === String(age.attribute_value);
            });
            ageLabel = ageDict.length > 0 ? ageDict[0].label : '';
          }
        }

        let gender = selectedProductDict.specifications.gender
          ? selectedProductDict.specifications.gender
          : null;
        if (gender) {
          let genderDict = productsGenders.filter(obj => {
            return obj.value === String(gender.attribute_value);
          });
          genderLabel = genderDict.length > 0 ? genderDict[0].label : '';
        }

        let deliveryType = selectedProductDict.specifications.deliverytype
          ? selectedProductDict.specifications.deliverytype
          : null;

        if (deliveryType && deliveryType.attribute_value === '5576') {
          sameDayDelivery = true;

          deliveryTypeAvailable = true;
          if (deliveryType.time_same_day) {
            let localTime = moment
              .utc(deliveryType.time_same_day)
              .local()
              .format('hh:mm a');

            sameDayDeliveryString = translate('delivery description');
            sameDayDeliveryString = sameDayDeliveryString.replace(
              '5',
              localTime,
            );
          } else {
            sameDayDeliveryString = translate('delivery description');
          }
        } else if (deliveryType && deliveryType.attribute_value === '5615') {
          deliveryTypeAvailable = true;
          sameDayDeliveryString = translate('scheduledDelivery');
        }

        let refundable = selectedProductDict.specifications.refundable
          ? selectedProductDict.specifications.refundable
          : null;

        if (refundable.attribute_value === '5599') {
          isRefundable = 'YES';
        } else if (refundable.attribute_value === '5600') {
          isRefundable = 'NO';
        } else {
          isRefundable = '';
        }
      }

      percentage = Math.floor(
        ((productActualPrice - productFinalPrice) / productActualPrice) * 100,
      );
      outOfStock = !selectedProductDict.is_in_stock;

      if (selectedProductDict.qty <= 0) {
        outOfStock = true;
      }
    }

    let screenWidth = Dimensions.get('window').width;
    let numOfColums = isHandset ? 2 : 3;
    let cellWidth = (screenWidth - 32) / numOfColums;

    let wishListArray = [];
    wishList.map(wishItem => {
      wishListArray.push(wishItem.productId);
    });

    let discountLabel = '';
    if (productDetails && productDetails.rule_discount) {
      if (productDetails.rule_type === 'by_percent') {
        discountLabel = productDetails.rule_discount + '% OFF!';
      } else {
        discountLabel =
          Number(productDetails.rule_discount).toFixed(3) + ' KWD OFF!';
      }
      // discountLabel = productDetails.rule_name;
    }

    return (
      <SafeAreaView style={styles.safeContainer}>
        <StatusBar
          barStyle="dark-content"
          hidden={false}
          backgroundColor={Constants.APP_WHITE_COLOR}
        />
        <NavigationHeader2
          didTapOnCart={this._didTapOnCart}
          showBackButton={true}
          didTapOnBackButton={this._didTapOnBackButton}
          didTapOnShare={this._didTapOnShare}
          isRTL={isRTL}
          showShare={true}
          hideSearch={true}
          showCart={true}
          cartItemsCount={cartArray.length}
          appLogoUrl={appLogoUrl}
        />
        {noInterNetView ? (
          <View style={{flex: 1, backgroundColor: Constants.APP_WHITE_COLOR}}>
            {!isNetworkAvailable && (
              <RefreshButtonView
                didTapOnRefresh={() => {
                  if (!isNetworkAvailable) {
                    showSingleAlert(translate('No internet connection'));
                  }
                }}
              />
            )}
          </View>
        ) : isAPIFailed ? (
          <EmptyDataPlaceholder
            titleText={translate('api_error')}
            descriptionText={translate('api_error_data')}
            placeHolderImage={Images.apiError}
            buttonText={translate('Reload')}
            didTapOnButton={this.onReloadClick}
          />
        ) : (
          <View style={{flex: 1, marginTop: 1}}>
            <FlatList
              refreshControl={
                <RefreshControl
                  refreshing={isRefreshing}
                  onRefresh={this._didPullToRefresh}
                />
              }
              data={[1]}
              renderItem={() => {
                return (
                  <View>
                    {isProductGetAPICalling ? (
                      <View />
                    ) : (
                      <View style={styles.scrollContainer}>
                        <View>
                          <FlatList
                            listKey={'PRODUCT_IMAGES'}
                            horizontal
                            pagingEnabled
                            showsVerticalScrollIndicator={false}
                            showsHorizontalScrollIndicator={false}
                            data={productImagesArray}
                            keyExtractor={(item, index) => index.toString()}
                            onViewableItemsChanged={
                              this._onViewableItemsChanged
                            }
                            viewabilityConfig={{
                              itemVisiblePercentThreshold: 50,
                            }}
                            renderItem={({item, index}) => (
                              <ProductImageItem
                                item={item}
                                index={index}
                                props={this.props}
                                didTapOnItem={(item, index) => {
                                  this._didSelectProductImage(item, index);
                                }}
                              />
                            )}
                          />

                          {productImagesArray && productImagesArray.length > 1 && (
                            <View
                              style={[
                                styles.pagerContainer,
                                {
                                  transform: [
                                    {rotate: isRTL ? '180deg' : '0deg'},
                                  ],
                                },
                              ]}>
                              {productImagesArray.map((item, index) => (
                                <View
                                  style={[
                                    styles.pagerItem,
                                    {
                                      width: 18,
                                      backgroundColor:
                                        index == visibleImageIndex
                                          ? Constants.APP_THEME_COLOR
                                          : 'rgba(246,155,32,0.35)',
                                    },
                                  ]}
                                />
                              ))}
                            </View>
                          )}
                          {vimio_video_url.length > 0 && (
                            <TouchableOpacity
                              activeOpacity={Constants.ACTIVE_OPACITY}
                              style={styles.videoPlayButton}
                              onPress={() =>
                                this._openVideoPlayer(vimio_video_url)
                              }>
                              <Image
                                source={Images.playIcon}
                                style={{
                                  width: 40,
                                  height: 40,
                                  tintColor: constants.APP_THEME_COLOR,
                                }}
                              />
                            </TouchableOpacity>
                          )}
                        </View>
                        {/* {vimio_video_url.length > 0 && (
                    <TouchableOpacity
                      activeOpacity={Constants.ACTIVE_OPACITY}
                      style={styles.watchVideoContainer}
                      onPress={() => this._openVideoPlayer(vimio_video_url)}
                    >
                      <Image
                        source={Images.videoPlay}
                        style={{ width: 15, height: 15 }}
                      />
                      <Text style={styles.videoText}>
                        {translate("WATCH VIDEO")}
                      </Text>
                    </TouchableOpacity>
                  )} */}

                        {colorArray.length > 0 && (
                          <View style={styles.chooseColorContainer}>
                            <Text style={styles.sectionTitle}>
                              {translate('COLORS')}
                            </Text>
                            <FlatList
                              listKey={'PRODUCT_COLORS'}
                              style={{marginVertical: 10}}
                              showsVerticalScrollIndicator={false}
                              showsHorizontalScrollIndicator={false}
                              numColumns={numberOfColumnsOfColorsCell}
                              data={colorArray}
                              keyExtractor={(item, index) => index.toString()}
                              renderItem={({item, index}) => (
                                <ColorItem
                                  item={item}
                                  index={index}
                                  props={this.props}
                                  numberOfColumnsOfColorsCell={
                                    numberOfColumnsOfColorsCell
                                  }
                                  selectedColorIndex={selectedColorIndex}
                                  didTapOnItem={(item, index) => {
                                    this.setState(
                                      {
                                        selectedColorIndex: index,
                                        visibleImageIndex: 0,
                                      },
                                      () => {
                                        this._didSelectVarient(item, index);
                                      },
                                    );
                                  }}
                                />
                              )}
                            />
                          </View>
                        )}
                        {sizeArray.length > 0 && (
                          <View style={styles.chooseColorContainer}>
                            <View>
                              <View style={{flexDirection: 'row'}}>
                                <Text style={styles.sectionTitle}>
                                  {translate('Sizes')}
                                </Text>
                              </View>

                              <FlatList
                                listKey={'PRODUCT_SIZES'}
                                style={styles.sizeList}
                                contentContainerStyle={{
                                  justifyContent: 'center',
                                }}
                                showsVerticalScrollIndicator={false}
                                showsHorizontalScrollIndicator={false}
                                numColumns={4}
                                keyExtractor={(item, index) => index.toString()}
                                data={sizeArray}
                                renderItem={({item, index}) => (
                                  <SizeItem
                                    item={item}
                                    index={index}
                                    props={this.props}
                                    selectedSizeIndex={selectedSizeIndex}
                                    didTapOnItem={(item, index) => {
                                      this.setState(
                                        {
                                          selectedSizeIndex: index,
                                          visibleImageIndex: 0,
                                        },
                                        () => {
                                          this._didSelectVarient(item, index);
                                        },
                                      );
                                    }}
                                  />
                                )}
                              />
                            </View>
                          </View>
                        )}

                        <View style={styles.productInfoContainer}>
                          <View style={styles.productCostContainer}>
                            <View style={{flex: 1}}>
                              <Text style={[styles.productInfoText]}>
                                {productName}
                              </Text>
                              <View style={styles.priceContainer}>
                                <Text style={styles.productCost}>
                                  {Number(productFinalPrice).toFixed(3) +
                                    ' ' +
                                    currency}
                                </Text>
                                {percentage !== 0 && (
                                  <Text style={styles.productCostOffer}>
                                    {Number(productActualPrice).toFixed(3) +
                                      ' ' +
                                      currency}
                                  </Text>
                                )}
                              </View>
                            </View>
                            <TouchableOpacity
                              onPress={() => {
                                this._didTapOnLikeButton(productId);
                              }}
                              hitSlop={{
                                top: 20,
                                bottom: 20,
                                left: 50,
                                right: 50,
                              }}
                              style={styles.wishListContainer}>
                              <Image
                                source={
                                  this.state.isLiked
                                    ? Images.likeButtonWithShade
                                    : Images.unLikeImageWithShade
                                }
                                resizeMode={'contain'}
                                style={[styles.likeButtonImage]}
                              />
                            </TouchableOpacity>
                          </View>

                          <View
                            style={{
                              flexDirection: 'row',
                              marginHorizontal: 20,
                            }}>
                            <View style={styles.subView}>
                              <Text style={styles.subDec}>
                                {translate('UPC') + ' : '}
                              </Text>
                              <Text style={styles.subDec}>{UPC}</Text>
                            </View>
                            <View style={styles.subView}>
                              <Text style={styles.subDec}>
                                {translate('Brand') + ' : '}
                              </Text>
                              <Text style={styles.subDec}>{brandLabel}</Text>
                            </View>
                          </View>
                          <View style={styles.ageGenderContainer}>
                            <View style={styles.subView}>
                              <Text style={styles.subDec}>
                                {translate('Age') + ' : '}
                              </Text>
                              <Text style={styles.subDec}>{ageLabel}</Text>
                            </View>
                            <View style={styles.subView}>
                              <Text style={styles.subDec}>
                                {translate('GENDER') + ' : '}
                              </Text>
                              <Text style={styles.subDec}>{genderLabel}</Text>
                            </View>
                          </View>

                          <View style={styles.productQuantityContainer}>
                            <View style={styles.quantityControlContainer}>
                              <TouchableOpacity
                                onPress={this._didTapOnDecrement}
                                style={styles.incrementButton}>
                                <Image source={Images.productDetailMinus} />
                              </TouchableOpacity>
                              <TextInput
                                style={styles.quantityText}
                                value={productCount.toString()}
                              />
                              <TouchableOpacity
                                onPress={this._didTapOnIncrement}
                                style={styles.productQuantityPlus}>
                                <Image source={Images.productDetailPlus} />
                              </TouchableOpacity>
                            </View>
                          </View>

                          {deliveryTypeAvailable && (
                            <View style={styles.deliveryInfoContainer}>
                              <View style={styles.truckContainer}>
                                <Image
                                  style={{
                                    tintColor: Constants.APP_THEME_COLOR,
                                  }}
                                  source={
                                    sameDayDelivery
                                      ? Images.productTruck2
                                      : Images.calender
                                  }
                                />
                              </View>
                              <View style={styles.deliveryDescriptionText}>
                                <Text style={styles.deliveryTitle}>
                                  {translate('Delivery')}

                                  {sameDayDelivery && (
                                    <Text style={styles.deliverySubTitle}>
                                      {' - '}
                                      {translate('Same day title')}
                                    </Text>
                                  )}
                                </Text>
                                <Text style={styles.deliveryDescription}>
                                  {sameDayDeliveryString}
                                </Text>
                              </View>
                            </View>
                          )}
                          {isRefundable === 'NO' && (
                            <View style={styles.refundableContainer}>
                              <View
                                style={[
                                  styles.truckContainer,
                                  {
                                    borderColor:
                                      Constants.APP_TRANSPARENT_COLOR,
                                  },
                                ]}
                              />
                              <View style={styles.nonRefundableContainer}>
                                <View style={styles.nonRefundableTextContainer}>
                                  <Text style={styles.nonRefundable}>
                                    {translate('Non Refundable')}
                                  </Text>
                                </View>
                              </View>
                            </View>
                          )}
                        </View>
                        {discountLabel !== '' && (
                          <View>
                            <View style={styles.offerCodeContainer} />
                            <View style={styles.offerContainer}>
                              <Text style={styles.offerText}>
                                {discountLabel}
                              </Text>
                            </View>
                          </View>
                        )}

                        {/* <View style={styles.thickSeparator} /> */}

                        {/* {colorArray.length > 0 && (
                    <View style={styles.chooseColorContainer}>
                      <Text style={styles.sectionTitle}>
                        {translate("COLORS")}
                      </Text>
                      <FlatList
                        style={{ marginVertical: 10 }}
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                        numColumns={numberOfColumnsOfColorsCell}
                        data={colorArray}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item, index }) => (
                          <ColorItem
                            item={item}
                            index={index}
                            props={this.props}
                            numberOfColumnsOfColorsCell={
                              numberOfColumnsOfColorsCell
                            }
                            selectedColorIndex={selectedColorIndex}
                            didTapOnItem={(item, index) => {
                              this.setState(
                                {
                                  selectedColorIndex: index,
                                  visibleImageIndex: 0,
                                },
                                () => {
                                  this._didSelectVarient(item, index);
                                }
                              );
                            }}
                          />
                        )}
                      />
                    </View>
                  )}
                  <View style={styles.chooseColorContainer}>
                    {sizeArray.length > 0 && (
                      <View>
                        <View style={{ flexDirection: "row" }}>
                          <Text style={styles.sectionTitle}>
                            {translate("Sizes")}
                          </Text>
                        </View>

                        <FlatList
                          style={styles.sizeList}
                          contentContainerStyle={{
                            justifyContent: "center",
                          }}
                          showsVerticalScrollIndicator={false}
                          showsHorizontalScrollIndicator={false}
                          numColumns={4}
                          keyExtractor={(item, index) => index.toString()}
                          data={sizeArray}
                          renderItem={({ item, index }) => (
                            <SizeItem
                              item={item}
                              index={index}
                              props={this.props}
                              selectedSizeIndex={selectedSizeIndex}
                              didTapOnItem={(item, index) => {
                                this.setState(
                                  {
                                    selectedSizeIndex: index,
                                    visibleImageIndex: 0,
                                  },
                                  () => {
                                    this._didSelectVarient(item, index);
                                  }
                                );
                              }}
                            />
                          )}
                        />
                      </View>
                    )}
                  </View> */}

                        <View
                          style={[
                            styles.chooseColorContainer,
                            {borderBottomWidth: 0},
                          ]}>
                          <View
                            style={{
                              height: 50,
                              width: '100%',
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}>
                            <TouchableOpacity
                              hitSlop={{
                                left: 10,
                                top: 10,
                                bottom: 10,
                                right: 10,
                              }}
                              onPress={() => this._didChangeGenderCategory(0)}>
                              <Text
                                style={[
                                  styles.topTitle,
                                  {
                                    color:
                                      selectedGenderIndex == 0
                                        ? Constants.APP_THEME_COLOR
                                        : Constants.APP_BLACK_COLOR,
                                  },
                                ]}>
                                {translate('Details')}
                              </Text>
                              <View
                                style={[
                                  styles.genderCategoryUnderLine,
                                  {
                                    height: selectedGenderIndex == 0 ? 2 : 0,
                                    backgroundColor: Constants.APP_THEME_COLOR,
                                  },
                                ]}
                              />
                            </TouchableOpacity>
                            <TouchableOpacity
                              hitSlop={{
                                left: 10,
                                top: 10,
                                bottom: 10,
                                right: 10,
                              }}
                              onPress={() => this._didChangeGenderCategory(1)}>
                              <Text
                                style={[
                                  styles.topTitle,
                                  {
                                    color:
                                      selectedGenderIndex == 1
                                        ? Constants.APP_THEME_COLOR
                                        : Constants.APP_BLACK_COLOR,
                                  },
                                ]}>
                                {translate('Info and Care')}
                              </Text>
                              <View
                                style={[
                                  styles.genderCategoryUnderLine,
                                  {
                                    height: selectedGenderIndex == 1 ? 2 : 0,
                                    backgroundColor: Constants.APP_THEME_COLOR,
                                  },
                                ]}
                              />
                            </TouchableOpacity>
                            <TouchableOpacity
                              hitSlop={{
                                left: 10,
                                top: 10,
                                bottom: 10,
                                right: 10,
                              }}
                              onPress={() => this._didChangeGenderCategory(2)}>
                              <Text
                                style={[
                                  styles.topTitle,
                                  {
                                    color:
                                      selectedGenderIndex == 2
                                        ? Constants.APP_THEME_COLOR
                                        : Constants.APP_BLACK_COLOR,
                                  },
                                ]}>
                                {translate('Brand')}
                              </Text>
                              <View
                                style={[
                                  styles.genderCategoryUnderLine,
                                  {
                                    height: selectedGenderIndex == 2 ? 2 : 0,
                                    backgroundColor: Constants.APP_THEME_COLOR,
                                  },
                                ]}
                              />
                            </TouchableOpacity>
                          </View>
                          {selectedGenderIndex == 0 &&
                            (productdescription &&
                            productdescription.length > 0 ? (
                              <View>
                                <HTMLView
                                  value={productdescription}
                                  style={styles.productDescription}
                                  renderNode={this._renderHTMLNode}
                                  nodeComponentProps={{
                                    numberOfLines: isExpanded ? 0 : 3,
                                  }}
                                />
                                {productdescription.length > 100 && (
                                  <TouchableOpacity
                                    onPress={() =>
                                      this.setState({isExpanded: !isExpanded})
                                    }>
                                    <Text style={styles.readmore}>
                                      {isExpanded
                                        ? translate('Hide')
                                        : translate('Read more')}
                                    </Text>
                                  </TouchableOpacity>
                                )}
                                {videoUrl.length > 0 && (
                                  <WebView
                                    source={{
                                      html: `<iframe width="100%" height="100%" src="${videoUrl}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>`,
                                    }}
                                    style={{
                                      width: '100%',
                                      height: normalizedHeight(300),
                                    }}
                                  />
                                )}
                              </View>
                            ) : (
                              <Text style={styles.noDescription}>
                                {translate('No details found')}
                              </Text>
                            ))}
                          {selectedGenderIndex == 1 &&
                            (productDetails.info_care &&
                            productDetails.info_care.length > 0 ? (
                              <HTMLView
                                value={productDetails.info_care}
                                style={styles.productDescription}
                              />
                            ) : (
                              <Text style={styles.noDescription}>
                                {translate('No info found')}
                              </Text>
                            ))}
                          {selectedGenderIndex == 2 &&
                            (productDetails.brand_description &&
                            productDetails.brand_description.length > 0 ? (
                              <HTMLView
                                value={productDetails.brand_description}
                                style={styles.productDescription}
                              />
                            ) : (
                              <Text style={styles.noDescription}>
                                {translate('No brand found')}
                              </Text>
                            ))}
                        </View>
                        <View style={styles.thickSeparator} />
                        <View>
                          <Text style={styles.sectionTitle}>
                            {translate('Customer Reviews')}
                          </Text>
                          <View style={styles.reviewTextContainer}>
                            <TextInput
                              value={reviewText}
                              onChangeText={text =>
                                this.setState({reviewText: text})
                              }
                              style={styles.review}
                              onFocus={this._didTapOnTextInput}
                            />
                            <TouchableOpacity
                              style={styles.reviewSubmitButton}
                              onPress={this._didTapOnPostbutton}>
                              <Text style={styles.postText}>
                                {translate('post')}
                              </Text>
                            </TouchableOpacity>
                          </View>
                          <View style={{height: 10}} />

                          {productReviews.length > 0 ? (
                            <TouchableOpacity
                              style={styles.customerReviewText}
                              hitSlop={{
                                top: 20,
                                bottom: 20,
                                left: 50,
                                right: 50,
                              }}
                              onPress={() => {
                                this.props.navigation.navigate(
                                  'ProductReview',
                                  {
                                    productDetails: productDetails,
                                  },
                                );
                              }}>
                              <Text
                                style={[
                                  styles.postText,
                                  {
                                    fontSize: 16,
                                    color: Constants.APP_BLACK_COLOR,
                                    textDecorationLine: 'underline',
                                    textAlign: 'left',
                                  },
                                ]}>
                                {'View customer reviews'}
                              </Text>
                            </TouchableOpacity>
                          ) : (
                            <Text style={styles.reviewDescription}>
                              {translate('reviewDescription')}
                            </Text>
                          )}
                        </View>

                        {boughtTogetherProducts.length > 0 && (
                          <View style={styles.thickSeparator} />
                        )}

                        {selectedProductDict &&
                          boughtTogetherProducts.length > 0 && (
                            <View style={{backgroundColor: 'rgb(249,249,249)'}}>
                              <Text style={styles.sectionTitle}>
                                {translate('Frequently bought together')}
                              </Text>
                              <View
                                style={{
                                  marginHorizontal: 20,
                                  backgroundColor: 'white',
                                  borderRadius: 10,
                                  marginVertical: 10,
                                  marginTop: 20,
                                }}>
                                <FlatList
                                  listKey={'PRODUCT_TOGETHER_ITEMS'}
                                  renderItem={this.renderBoughtTogetherItems}
                                  data={[
                                    ...[selectedProductDict],
                                    ...boughtTogetherProducts,
                                  ]}
                                  extraData={this.state}
                                />
                                <View
                                  style={{
                                    height: 1,
                                    backgroundColor: 'rgba(110,110,110,0.2)',
                                  }}
                                />

                                <Text style={styles.totalPrice}>
                                  {translate('Total Price') +
                                    ' : ' +
                                    togetherProductTotal.toFixed(2) +
                                    ' ' +
                                    currency}
                                </Text>

                                <TouchableOpacity
                                  onPress={() => {
                                    // this._addAllItemsToCart();
                                    this.setState(
                                      {isTapOnAddAllItemToCart: true},
                                      () => {
                                        this._didTapOnAddToCart(false);
                                      },
                                    );
                                  }}
                                  style={styles.addAllTocartButton}>
                                  <Text style={styles.addAllText}>
                                    {translate('Add all to cart')}
                                  </Text>
                                </TouchableOpacity>
                              </View>
                            </View>
                          )}

                        {relatedProducts.length > 0 && (
                          <View style={styles.thickSeparator} />
                        )}
                        {relatedProducts.length > 0 && (
                          <View style={{backgroundColor: 'rgb(249,249,249)'}}>
                            <Text style={styles.sectionTitle}>
                              {translate('Related Products')}
                            </Text>
                            <FlatList
                              horizontal
                              style={{marginTop: 10}}
                              contentContainerStyle={{alignSelf: 'flex-start'}}
                              showsVerticalScrollIndicator={false}
                              showsHorizontalScrollIndicator={false}
                              data={relatedProducts}
                              keyExtractor={(item, index) => index.toString()}
                              renderItem={({item, index}) => {
                                let likeValue = false;
                                if (wishListArray.includes(item.entity_id)) {
                                  likeValue = true;
                                }
                                return (
                                  <View
                                    style={{
                                      width: cellWidth,
                                      marginVertical: 5,
                                      marginLeft: index == 0 ? 20 : 0,
                                      marginRight:
                                        index == relatedProducts.length - 1
                                          ? 20
                                          : 0,
                                    }}>
                                    <ProductCell
                                      data={item}
                                      index={index}
                                      screenWidth={screenWidth}
                                      numOfColumns={numOfColums}
                                      currency={currency}
                                      likeActive={likeValue}
                                      productsDeliveryTypes={
                                        productsDeliveryTypes
                                      }
                                      didTapOnLikeButton={value => {
                                        this._didTapOnLikeButtonOfRelatedProduct(
                                          value,
                                          item,
                                        );
                                      }}
                                      didSelectAdd={item => {
                                        this.props.navigation.push(
                                          'ProductDetail',
                                          {
                                            sku: item.sku,
                                          },
                                        );
                                      }}
                                      didTapOnAddToCart={() => {
                                        this._didTapOnAddToCartRelated(item);
                                      }}
                                      appMediaBaseUrl={appMediaBaseUrl}
                                    />
                                  </View>
                                );
                              }}
                            />
                          </View>
                        )}

                        {recentlyViewedProducts.length > 0 && (
                          <View style={styles.thickSeparator} />
                        )}
                        {recentlyViewedProducts.length > 1 &&
                          productDetails !== null && (
                            <View style={{backgroundColor: 'rgb(249,249,249)'}}>
                              <Text style={styles.sectionTitle}>
                                {translate('Recently viewd')}
                              </Text>
                              <FlatList
                                horizontal
                                style={{marginTop: 10}}
                                contentContainerStyle={{
                                  alignSelf: 'flex-start',
                                }}
                                showsVerticalScrollIndicator={false}
                                showsHorizontalScrollIndicator={false}
                                data={recentlyViewedProducts}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({item, index}) => {
                                  let likeValue = false;
                                  if (wishListArray.includes(item.entity_id)) {
                                    likeValue = true;
                                  }

                                  if (item.sku === productDetails.sku) {
                                    return (
                                      <View
                                        style={{
                                          marginLeft: index == 0 ? 20 : 0,
                                        }}
                                      />
                                    );
                                  } else {
                                    return (
                                      <View
                                        style={{
                                          width: cellWidth,
                                          marginVertical: 5,
                                          marginLeft: index == 0 ? 20 : 0,
                                          marginRight:
                                            index ==
                                            recentlyViewedProducts.length - 1
                                              ? 20
                                              : 0,
                                        }}>
                                        <ProductCell
                                          data={item}
                                          index={index}
                                          screenWidth={screenWidth}
                                          numOfColumns={numOfColums}
                                          currency={currency}
                                          likeActive={likeValue}
                                          appMediaBaseUrl={appMediaBaseUrl}
                                          productsDeliveryTypes={
                                            productsDeliveryTypes
                                          }
                                          didTapOnLikeButton={value => {
                                            this._didTapOnLikeButtonOfRelatedProduct(
                                              value,
                                              item,
                                            );
                                          }}
                                          didSelectAdd={item => {
                                            this.props.navigation.push(
                                              'ProductDetail',
                                              {
                                                sku: item.sku,
                                              },
                                            );
                                          }}
                                          didTapOnAddToCart={() => {
                                            this._didTapOnAddToCartRelated(
                                              item,
                                            );
                                          }}
                                        />
                                      </View>
                                    );
                                  }
                                }}
                              />
                            </View>
                          )}
                        <View style={{height: 10}} />
                      </View>
                    )}
                  </View>
                );
              }}></FlatList>

            {this.props.navigation.state.params.isFromCartScreen ? (
              <View />
            ) : isProductGetAPICalling ? (
              <View />
            ) : outOfStock ? (
              <FooterButton
                buttonText1={translate('OUT OF STOCK').toUpperCase()}
                buttonText2={translate('NOTIFY ME').toUpperCase()}
                onButton1Click={() => {}}
                onButton2Click={this._didTapOnNotifyMe}
                button1TextStyle={{color: 'rgb(249,91,91)'}}
                screenWidth={this.props.screenWidth}
              />
            ) : (
              <FooterButton
                buttonText1={translate('ADD TO CART').toUpperCase()}
                buttonText2={translate('BUY NOW').toUpperCase()}
                onButton1Click={() => this._didTapOnAddToCart(false)}
                onButton2Click={this._didTapOnBuyNow}
                screenWidth={this.props.screenWidth}
              />
            )}
          </View>
        )}
        <Modal
          onBackButtonPress={() => this.setState({isLoginViewShow: false})}
          isVisible={isLoginViewShow}
          style={{margin: 0}}>
          <View style={{flex: 1}}>
            <Login
              didTapOnclose={() => {
                this.setState({
                  isLoginViewShow: false,
                });

                setTimeout(() => {
                  if (userToken.length > 0) {
                    this._didTapOnAddToCart(true);
                  } else {
                    if (!this.props.guestInfo) {
                    } else {
                      this._didTapOnAddToCart(true);
                    }
                  }
                }, 500);
              }}
            />
          </View>
        </Modal>

        <Modal
          onBackButtonPress={() => this.setState({modalVisible: false})}
          isVisible={modalVisible}
          style={{margin: 0}}>
          <View style={{flex: 1}}>
            <Login
              isGuestLogin={true}
              didTapOnclose={() => this.setState({modalVisible: false})}
              guestInfoAddedCallback={() => {
                this.setState({modalVisible: false});
                this._didTapOnAddToCart(true);
              }}
            />
          </View>
        </Modal>

        <ImageView
          glideAlways
          images={imagePopUpArray}
          imageIndex={ipmagePopUpIndex}
          animationType="fade"
          visible={isImageViewVisible}
          // renderFooter={this.renderFooter}
          onRequestClose={() => this.setState({isImageViewVisible: false})}
          onImageIndexChange={index => {
            // console.log(index);
          }}
        />

        {isLoading && <HudView />}
      </SafeAreaView>
    );
  }
}

export default ProductDetailView;

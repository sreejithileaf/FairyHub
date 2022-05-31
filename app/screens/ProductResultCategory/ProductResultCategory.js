/**
 * Created by Jebin for iLeaf Solutions Pvt.Ltd
 * on February 25, 2020
 * ProductResultCategory - Products list based on the category
 */

import {
  Text,
  View,
  Image,
  FlatList,
  StatusBar,
  Dimensions,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import {
  RecyclerListView,
  DataProvider,
  LayoutProvider,
} from "recyclerlistview";
import React from "react";
import {
  normalizedHeight,
  normalizedWidth,
  showSimpleSnackbar,
  showAlertWithCallback,
} from "../../config/common";
import styles from "./styles";
import Login from "../LoginScreen";
import Modal from "react-native-modal";
import Images from "../../config/images";
import Constants from "../../config/constants";
import HudView from "../../components/hudView";
import ContextHelper from "../../lib/ContextHelper";
import CircleButton from "../../components/circleButton";
import commonStyles from "../../config/commonStyles";
import { showSingleAlert } from "../../config/common";
import NetInfo from "@react-native-community/netinfo";
import ProductCell from "../../components/productCell";
import { translate } from "../../config/languageSwitching";
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

const all = [
  { id: 0, age: "All" },
  { id: 1, age: "3-6" },
  { id: 2, age: "7-10" },
  { id: 3, age: "11-15" },
];
const boys = [
  { id: 0, age: "All" },
  { id: 1, age: "3-6" },
  { id: 2, age: "7-10" },
  { id: 3, age: "11-15" },
];
const girls = [
  { id: 0, age: "All" },
  { id: 1, age: "3-6" },
  { id: 2, age: "7-10" },
  { id: 3, age: "11-15" },
];

class ProductResultCategory extends React.Component {
  constructor(props) {
    super(props);
    this._layoutProvider = new LayoutProvider(
      (index) => {
        return ViewTypes.FULL;
      },
      (type, dim) => {
        dim.width = (Constants.SCREEN_WIDTH - 41) / 2; //width / 2.01;
        dim.height = normalizedHeight(420);
      }
    );

    this.state = {
      dataProvider: dataProvider.cloneWithRows(this._generateArray(0)),
      selectedSubCategoryId: "",
      index: 0, //selectedSubCategoryIndex,
      setIndex: 0,
      isLoginViewShow: false,
      routes: [],
      filterParams: {},
      wishlistItems: [],
      resultCallback: [],
      // parent_id: subCategories.length > 0 ? subCategories[0].id : "",
      selectedGenderIndex: 0,
      selectedAgeIndex: 0,
      pageIndexCategory1: 0,
      isAPILoadingCategory1: false,
      isLoadMoreCategory1: true,
      isAPICalledCategory1: false,
      isFilterApplied: false,
      isFromHome: props.navigation.state.params.isFromHome,
      isGenderAvailable: false,
      ageGroupArray: [],
      isPopUpViewShow: false,
    };

    this._parentContextProvider = new ContextHelper("PARENT");
  }

  _generateArray(n) {
    let arr = [];
    return arr;
  }

  componentDidMount() {
    const selectedSubCategoryId = this.props.navigation.state.params
      .selectedSubCategoryId
      ? this.props.navigation.state.params.selectedSubCategoryId
      : 0;

    this.setState({ selectedSubCategoryId: selectedSubCategoryId }, () => {
      this.unsubscribe = NetInfo.addEventListener((state) => {
        let networkStatus = state.isConnected;
        if (networkStatus) {
          this._getProductListData(selectedSubCategoryId, true);
        }
      });
    });

    // this.props.onSearchTextChangeResult(
    //   this.props.navigation.state.params.searchText,
    //   this._searchResultCallback
    // );

    const { wishList } = this.props;
    let mArray = [];
    wishList.map((item) => {
      mArray.push(item.productId);
    });
    this.setState({ wishlistItems: mArray });

    const { filterCategoryId, filterArray } = this.props;
    if (filterCategoryId.categoryid !== selectedSubCategoryId) {
      // this.props.fetchFilterList(
      //   { categoryid: selectedSubCategoryId },
      //   (filterArray) => {
      //     this._updateHeaderViewData(filterArray);
      //   }
      // );
    } else {
      this._updateHeaderViewData(filterArray);
    }
  }

  _searchResultCallback = (resultCallback) => {
    // console.log("resultCallback:",resultCallback);
    if (resultCallback) {
      this.setState({ resultCallback });
    }
  };

  _updateHeaderViewData = (filterArray) => {
    let isGenderAvailable = false;
    let ageGroupArray = [];
    if (filterArray.length > 0) {
      filterArray.map((dict) => {
        if (dict.key === "gender") {
          isGenderAvailable = true;
        }
        if (dict.key === "age") {
          ageGroupArray = dict.keys;
        }
      });
    }
    this.setState({ isGenderAvailable, ageGroupArray });
  };

  _didTapOnBackButton = () => {
    this.props.clearCategoryProducts();
    this.props.navigation.goBack();
  };

  _didTapOnSearch = () => {
    this.props.navigation.navigate("Search");
  };

  _didTapOnCart = () => {
    this.props.navigation.navigate("Cart");
  };

  _didTapOnFilter = () => {
    const { selectedSubCategoryId, filterParams } = this.state;
    this.props.navigation.navigate("FilterScreen", {
      didTapOnApplyFilter: this._didTapOnApplyFilter,
      category_id: selectedSubCategoryId,
      filterParams: filterParams,
    });
  };

  _didTapOnClearButton = () => {
    const { selectedSubCategoryId } = this.state;
    this.setState(
      {
        pageIndexCategory1: 0,
        isAPILoadingCategory1: false,
        isLoadMoreCategory1: true,
        isAPICalledCategory1: false,
        isFilterApplied: false,
        filterParams: {},
        selectedGenderIndex: 0,
        selectedAgeIndex: 0,
      },
      () => {
        this._getProductListData(selectedSubCategoryId, true);
      }
    );
  };

  _didTapOnApplyFilter = (params) => {
    const { selectedSubCategoryId } = this.state;
    this.props.clearCategoryProducts();
    this.setState(
      {
        isFilterApplied: true,
        filterParams: params,
        pageIndexCategory1: 0,
        isAPILoadingCategory1: false,
        isLoadMoreCategory1: true,
        isAPICalledCategory1: false,
        selectedGenderIndex: 0,
        selectedAgeIndex: 0,
      },
      () => this._getProductListData(selectedSubCategoryId, true)
    );
  };

  _loadMoreProductsInCategory = () => {
    let index = 1;

    const { pageIndexCategory1 } = this.state;

    let pageIndex = this.state["pageIndexCategory" + index];

    let isAPILoading = this.state["isAPILoadingCategory1"];
    let isLoadMore = this.state.isLoadMoreCategory1;
    if (isAPILoading) return;
    if (!isLoadMore) return;

    let isFromHome = this.props.navigation.state.params.isFromHome;

    let params = {
      key: this.props.navigation.state.params.searchText,
      page: pageIndex + 1,
      page_size: Constants.PRODUCTS_PAGE_COUNT,
      sort_field: "name",
      sort_order: "desc",
    };

    if (isFromHome) {
      const brandId = this.props.navigation.state.params.brandId;
      params["filter_attributes"] = { brand: [brandId] };
    }

    this.props.onSearchTextChangeResult(params, (data) => {
      this._getCategoryProductsListCallback(data, 1);
    });

    let dict = {};
    dict["isAPILoadingCategory1"] = true;
    this.setState(dict);

    // const { filterParams, isFromHome } = this.state;
    // let categoryId = this.state.selectedSubCategoryId;
    // let index = 1;
    // let pageIndex = this.state["pageIndexCategory" + index];
    // let isAPILoading = this.state["isAPILoadingCategory" + index];
    // let isLoadMore = this.state["isLoadMoreCategory" + index];
    // if (isAPILoading) return;
    // if (!isLoadMore) return;
    // this.props.getCategoryProductsList(
    //   pageIndex + 1,
    //   Constants.PRODUCTS_PAGE_COUNT,
    //   "categoryType" + index,
    //   categoryId,
    //   filterParams,
    //   (status, isLoadMore) => {
    //     this._getCategoryProductsListCallback(status, index, isLoadMore);
    //   },
    //   isFromHome
    // );
    // let dict = {};
    // dict["isAPILoadingCategory" + index] = true;
    // this.setState(dict);
  };

  _getCategoryProductsListCallback = (obj, index) => {
    const { resultCallback } = this.state;

    let isLoadMore =
      obj.total_count > [...resultCallback, ...obj.products].length
        ? true
        : false;

    let dict = {};
    let pageIndex = this.state["pageIndexCategory" + index];
    let newIndex = pageIndex + 1;
    dict["pageIndexCategory" + index] = newIndex;
    dict["isAPILoadingCategory1"] = false;
    dict["isLoadMoreCategory1"] = isLoadMore;
    dict["isAPICalledCategory" + index] = true;
    this.setState(dict);

    this.setState({ resultCallback: [...resultCallback, ...obj.products] });
  };

  addToWishlistState = (productId) => {
    this.setState((prevState) => ({
      wishlistItems: [...prevState.wishlistItems, productId],
    }));
  };

  removeFromWishlistState = (productId) => {
    this.setState((prevState) => ({
      wishlistItems: prevState.wishlistItems.filter(
        (item) => item !== productId
      ),
    }));
  };

  _didTapOnLikeButton = (isLiked, data) => {
    const { onDislikeTap, onLikeTap, userToken } = this.props;
    if (userToken.length > 0) {
      if (isLiked) {
        this.removeFromWishlistState(data.entity_id);
        onDislikeTap(data.entity_id, (status) => {
          if (status) {
            showSimpleSnackbar(translate("Item removed from wishlist"));
          } else {
            this.addToWishlistState(data.entity_id);
          }
        });
      } else {
        this.addToWishlistState(data.entity_id);
        onLikeTap(data.entity_id, (status) => {
          if (status) {
            showSimpleSnackbar(translate("Item added to wishlist"));
          } else {
            this.removeFromWishlistState(data.entity_id);
          }
        });
      }
    } else {
      showAlertWithCallback(
        translate("user_not_login"),
        translate("Login"),
        translate("Cancel"),
        () => {
          this.setState({ isLoginViewShow: true });
        },
        null
      );
    }
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

      this.props.guestAddToCart(params, (status, message) =>
        this._guestAddToCartCallback(status, message)
      );
    } else {
      this.props.createGuestCart((status) =>
        this._createGuestCartCallback(status, productDetails)
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
      showSimpleSnackbar(translate("Product added to cart"));
    } else {
      showSingleAlert(message);
    }
  };

  _guestAddToCartCallback = (status, message) => {
    if (status) {
      showSimpleSnackbar(translate("Product added to cart"));
    } else {
      showSingleAlert(message);
    }
  };

  _renderScene = () => {
    const { wishlistItems, isFromHome } = this.state;
    const {
      // screenWidth,
      currency,
      isLoadingProductList,
      selectedFilters,
      productsDeliveryTypes,
      appMediaBaseUrl,
    } = this.props;

    let screenWidth = Dimensions.get("window").width;
    let indexVal = 1;
    // let isShowBottomLoader = this.state["isAPILoadingCategory" + indexVal];
    let isShowBottomLoader = this.state.isAPILoadingCategory1;

    const {
      productsListFromHome,
      productsListFromCategory,
      isHandset,
    } = this.props;

    const { resultCallback } = this.state;

    const productsList = resultCallback;
    // isFromHome
    //   ? productsListFromHome
    //   : productsListFromCategory;

    let dataListArray = [];
    let isDataEmpty = true;

    switch (0) {
      case 0:
        dataListArray = dataProvider.cloneWithRows(productsList);
        isDataEmpty = productsList.length == 0;
        break;
    }

    let numOfColums = isHandset ? 2 : 3;
    let cellWidth = (screenWidth - 32) / numOfColums;
    if (
      isDataEmpty &&
      !isLoadingProductList &&
      Object.keys(selectedFilters).length > 0
    ) {
      return (
        <EmptyDataPlaceholder
          titleText={translate("No matching product found")}
          descriptionText={translate("Check your filter options and try again")}
          placeHolderImage={Images.emptyFilterResult}
        />
      );
    }
    if (isDataEmpty && !isLoadingProductList) {
      return (
        <EmptyDataPlaceholder
          titleText={translate("Empty")}
          descriptionText={translate("error_data")}
          placeHolderImage={Images.emptyProduct}
          buttonText={translate("Reload")}
          didTapOnButton={null}
        />
      );
    }

    if (isLoadingProductList && !isShowBottomLoader) {
      return <View />; // <HudView />;
    }

    return (
      <View style={{ flex: 1, backgroundColor: "rgb(248,248,248)" }}>
        <RecyclerListView
          style={{
            // paddingTop: 20,
            //paddingHorizontal: 14,
            marginHorizontal: 14,
            backgroundColor: "rgb(248,248,248)",
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
                        ? 310 + 20
                        : 310
                    );
                // dim.height = normalizedHeight(isHandset ? 400 : 320);
              }
            )
          }
          // keyExtractor={(item, index) => index.toString()}
          contextProvider={this._parentContextProvider}
          dataProvider={dataListArray}
          canChangeSize={true}
          extendedState={wishlistItems}
          rowRenderer={(param1, data, index) => {
            let likeValue = false;
            if (wishlistItems.includes(data.entity_id)) {
              likeValue = true;
            }
            return (
              <View
                style={{
                  marginTop:
                    isHandset && (index == 0 || index == 1)
                      ? 20
                      : !isHandset && (index == 0 || index == 1 || index == 2)
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
                  likeActive={likeValue}
                  productsDeliveryTypes={productsDeliveryTypes}
                  didTapOnLikeButton={(value) => {
                    this._didTapOnLikeButton(value, data);
                  }}
                  forsearch={true}
                  appMediaBaseUrl={appMediaBaseUrl}
                  didSelectAdd={(item) =>
                    this.props.navigation.navigate("ProductDetail", {
                      sku: item.sku,
                    })
                  }
                  didTapOnAddToCart={() => {
                    this._didTapOnAddToCart(data);
                  }}
                  didTapOnVideoPlay={(video_url) => {
                    this.props.navigation.navigate("VideoPlayer", {
                      vimeoUrl: video_url,
                    });
                  }}
                />
              </View>
            );
          }}
          renderAheadDistance={250}
          onEndReached={() => {
            this._loadMoreProductsInCategory();
          }}
          onEndReachedThreshold={0.5}
          // disableRecycling={true}
          // itemAnimator={'shift'}
        />

        {isShowBottomLoader && (
          <View
            style={{
              width: "100%",
              height: 50,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ActivityIndicator />
          </View>
        )}
      </View>
    );
  };

  _getProductListData = (selectedSubCategoryId, isFromFilterApply) => {
    const { pageIndexCategory1 } = this.state;

    let isFromHome = this.props.navigation.state.params.isFromHome;

    let params = {
      key: this.props.navigation.state.params.searchText,
      page: pageIndexCategory1,
      page_size: Constants.PRODUCTS_PAGE_COUNT,
      sort_field: "name",
      sort_order: "desc",
    };

    if (isFromHome) {
      const brandId = this.props.navigation.state.params.brandId;
      params["filter_attributes"] = { brand: [brandId] };
    }

    this.props.onSearchTextChangeResult(params, (data) => {
      this._getCategoryProductsListCallback(data, 1);
    });
  };

  _didChangeGenderCategory = (selectedGenderIndexVal) => {
    const { selectedSubCategoryId, selectedGenderIndex } = this.state;

    if (selectedGenderIndex === selectedGenderIndexVal) return;
    this.setState({ selectedGenderIndex: selectedGenderIndexVal });

    let filter = this.state.filterParams;
    let filterParams = filter.filter_attributes ? filter.filter_attributes : {};

    switch (selectedGenderIndexVal) {
      case 0:
        filterParams["gender"] = []; // All
        break;
      case 1:
        filterParams["gender"] = [5508]; // Boys
        break;
      case 2:
        filterParams["gender"] = [5509]; // Girls
        break;
    }

    if (filter.filter_attributes) {
      filter.filter_attributes = filterParams;
    } else {
      filter["filter_attributes"] = filterParams;
    }

    this.setState(
      {
        selectedAgeIndex: 0,
        filterParams: filter,
        pageIndexCategory1: 0,
        isAPICalledCategory1: false,
      },
      () => {
        this._getProductListData(selectedSubCategoryId, true);
      }
    );
  };

  _didChangeAgeCategory = (selectedAgeIndexVal) => {
    const {
      selectedAgeIndex,
      selectedSubCategoryId,
      ageGroupArray,
    } = this.state;
    if (selectedAgeIndexVal === selectedAgeIndex) return;
    this.setState({ selectedAgeIndex: selectedAgeIndexVal });
    //TODO: API call when change the age tab

    let filter = this.state.filterParams;
    let filterParams = filter.filter_attributes ? filter.filter_attributes : {};

    if (selectedAgeIndexVal == 0) {
      filterParams["age_range"] = [];
    } else {
      let selectedAgeDict = ageGroupArray[selectedAgeIndexVal - 1];
      filterParams["age_range"] = [selectedAgeDict.value];
    }

    // switch (selectedAgeIndexVal) {
    //   case 0:
    //     filterParams["age"] = []; // all
    //     break;
    //   case 1:
    //     filterParams["age"] = [5563]; // 3+
    //     break;
    //   case 2:
    //     filterParams["age"] = [5565]; // 7+
    //     break;
    //   case 3:
    //     filterParams["age"] = [5566]; // 9+
    //     break;
    // }

    if (filter.filter_attributes) {
      filter.filter_attributes = {
        ...filter.filter_attributes,
        ...filterParams,
      };
    } else {
      filter["filter_attributes"] = filterParams;
    }

    this.setState(
      {
        filterParams: filter,
        pageIndexCategory1: 0,
        isAPICalledCategory1: false,
      },
      () => {
        this._getProductListData(selectedSubCategoryId, true);
      }
    );
  };

  _renderGenderRanges = ({ item, index }, genderType, totalItemsCount) => {
    const { selectedAgeIndex } = this.state;

    let genderImage_3_6 = "";
    let genderImage_7_10 = "";
    let genderImage_11_15 = "";
    let activeSelectedColor = Constants.APP_THEME_COLOR;

    switch (genderType) {
      case "all":
        genderImage_3_6 = Images.filterGenderAll;
        genderImage_7_10 = Images.filterGenderAll;
        genderImage_11_15 = Images.filterGenderAll;
        activeSelectedColor = Constants.APP_THEME_COLOR;
        break;
      case "boys":
        genderImage_3_6 = Images.boy_3_6;
        genderImage_7_10 = Images.boy_7_10;
        genderImage_11_15 = Images.boy_11_13;
        activeSelectedColor = Constants.APP_COLOR_BOY;
        break;
      case "girls":
        genderImage_3_6 = Images.girl_3_6;
        genderImage_7_10 = Images.girl_7_10;
        genderImage_11_15 = Images.girl_11_13;
        activeSelectedColor = Constants.APP_COLOR_GIRL;
        break;
    }

    return (
      <TouchableOpacity
        hitSlop={{ left: 10, top: 10, bottom: 10, right: 10 }}
        style={[
          styles.genderContainer,
          {
            backgroundColor:
              selectedAgeIndex == index
                ? activeSelectedColor
                : "rgb(243,243,243)",
            marginRight: totalItemsCount - 1 == index ? 20 : 0,
          },
        ]}
        onPress={() => this._didChangeAgeCategory(index)}
      >
        {index == 0 && (
          <Text
            style={[
              styles.genderRangeText,
              {
                marginLeft: 0,
                color:
                  selectedAgeIndex == index
                    ? Constants.APP_WHITE_COLOR
                    : Constants.APP_BLACK_COLOR,
              },
            ]}
          >
            {translate("ALL")}
          </Text>
        )}
        {index !== 0 && (
          <View style={styles.genderCell}>
            <View style={styles.genderImageContainer}>
              <Image source={genderImage_3_6} style={styles.genderIcon} />
            </View>
            <Text
              style={[
                styles.genderRangeText,
                {
                  color:
                    selectedAgeIndex == index
                      ? Constants.APP_WHITE_COLOR
                      : Constants.APP_BLACK_COLOR,
                },
              ]}
            >
              {item.display}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  // _renderGenderRanges = ({ item, index }, genderType) => {
  //   const { selectedAgeIndex } = this.state;

  //   let genderImage_3_6 = "";
  //   let genderImage_7_10 = "";
  //   let genderImage_11_15 = "";
  //   let activeSelectedColor = Constants.APP_THEME_COLOR;

  //   switch (genderType) {
  //     case "all":
  //       genderImage_3_6 = Images.filterGenderAll;
  //       genderImage_7_10 = Images.filterGenderAll;
  //       genderImage_11_15 = Images.filterGenderAll;
  //       activeSelectedColor = Constants.APP_THEME_COLOR;
  //       break;
  //     case "boys":
  //       genderImage_3_6 = Images.boy_3_6;
  //       genderImage_7_10 = Images.boy_7_10;
  //       genderImage_11_15 = Images.boy_11_15;
  //       activeSelectedColor = Constants.APP_COLOR_BOY;
  //       break;
  //     case "girls":
  //       genderImage_3_6 = Images.girl_3_6;
  //       genderImage_7_10 = Images.girl_7_10;
  //       genderImage_11_15 = Images.girl_11_15;
  //       activeSelectedColor = Constants.APP_COLOR_GIRL;
  //       break;
  //   }

  //   return (
  //     <TouchableOpacity
  //       hitSlop={{ left: 10, top: 10, bottom: 10, right: 10 }}
  //       style={[
  //         styles.genderContainer,
  //         {
  //           backgroundColor:
  //             selectedAgeIndex == index
  //               ? activeSelectedColor
  //               : "rgb(243,243,243)",
  //           marginRight: all.length - 1 == index ? 20 : 0,
  //         },
  //       ]}
  //       onPress={() => this._didChangeAgeCategory(index)}
  //     >
  //       {item.id == 0 && (
  //         <Text
  //           style={[
  //             styles.genderRangeText,
  //             {
  //               marginLeft: 0,
  //               color:
  //                 selectedAgeIndex == index
  //                   ? Constants.APP_WHITE_COLOR
  //                   : Constants.APP_BLACK_COLOR,
  //             },
  //           ]}
  //         >
  //           {translate("ALL")}
  //         </Text>
  //       )}
  //       {item.id == 1 && (
  //         <View style={styles.genderCell}>
  //           <View style={styles.genderImageContainer}>
  //             <Image source={genderImage_3_6} style={styles.genderIcon} />
  //           </View>
  //           <Text
  //             style={[
  //               styles.genderRangeText,
  //               {
  //                 color:
  //                   selectedAgeIndex == index
  //                     ? Constants.APP_WHITE_COLOR
  //                     : Constants.APP_BLACK_COLOR,
  //               },
  //             ]}
  //           >
  //             {item.age}
  //           </Text>
  //         </View>
  //       )}
  //       {item.id == 2 && (
  //         <View style={styles.genderCell}>
  //           <View style={styles.genderImageContainer}>
  //             <Image source={genderImage_7_10} style={styles.genderIcon} />
  //           </View>
  //           <Text
  //             style={[
  //               styles.genderRangeText,
  //               {
  //                 color:
  //                   selectedAgeIndex == index
  //                     ? Constants.APP_WHITE_COLOR
  //                     : Constants.APP_BLACK_COLOR,
  //               },
  //             ]}
  //           >
  //             {item.age}
  //           </Text>
  //         </View>
  //       )}
  //       {item.id == 3 && (
  //         <View style={styles.genderCell}>
  //           <View style={styles.genderImageContainer}>
  //             <Image source={genderImage_11_15} style={styles.genderIcon} />
  //           </View>
  //           <Text
  //             style={[
  //               styles.genderRangeText,
  //               {
  //                 color:
  //                   selectedAgeIndex == index
  //                     ? Constants.APP_WHITE_COLOR
  //                     : Constants.APP_BLACK_COLOR,
  //               },
  //             ]}
  //           >
  //             {item.age}
  //           </Text>
  //         </View>
  //       )}
  //     </TouchableOpacity>
  //   );
  // };

  render() {
    const {
      index,
      routes,
      setIndex,
      parent_id,
      isFilterApplied,
      isLoginViewShow,
      selectedGenderIndex,
      isAPICalledCategory1,
      selectedAgeIndex,
      isFromHome,
      isGenderAvailable,
      ageGroupArray,
      isPopUpViewShow,
      filterParams,
    } = this.state;
    const {
      isRTL,
      isLoadingProductList,
      cartArray,
      selectedFilters,
      productsListFromHome,
      productsListFromCategory,
      appLogoUrl,
    } = this.props;
    const { categoryName } = this.props.navigation.state.params;

    const { resultCallback } = this.state;

    const productsList = resultCallback;
    // const productsList =
    // isFromHome
    //   ? productsListFromHome
    //   : productsListFromCategory;

    // let isAPICalled = this.state["isAPICalledCategory" + (index + 1)];

    let genderRangeArray = [];
    let genderType = "all";
    switch (selectedGenderIndex) {
      case 0:
        genderRangeArray = all;
        genderType = "all";
        break;
      case 1:
        genderRangeArray = boys;
        genderType = "boys";
        break;
      case 2:
        genderRangeArray = girls;
        genderType = "girls";
        break;
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
          didTapOnSearch={this._didTapOnSearch}
          didTapOnCart={this._didTapOnCart}
          showBackButton={true}
          showFilter={false}
          didTapOnBackButton={this._didTapOnBackButton}
          hideBottomLine={true}
          isRTL={isRTL}
          showCart={true}
          cartItemsCount={cartArray.length}
          isFilterApplied={selectedFilters}
          // title={categoryName}
          appLogoUrl={appLogoUrl}
        />

        {/* {isGenderAvailable && (
          <View style={styles.superTitleContainer}>
            <TouchableOpacity
              hitSlop={{ left: 10, top: 10, bottom: 10, right: 10 }}
              onPress={() => this._didChangeGenderCategory(0)}
            >
              <Text style={styles.topTitle}>
                {translate("ALL").toUpperCase()}
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
              hitSlop={{ left: 10, top: 10, bottom: 10, right: 10 }}
              onPress={() => this._didChangeGenderCategory(1)}
            >
              <Text style={styles.topTitle}>
                {translate("BOYS").toUpperCase()}
              </Text>
              <View
                style={[
                  styles.genderCategoryUnderLine,
                  {
                    height: selectedGenderIndex == 1 ? 2 : 0,
                    backgroundColor: Constants.APP_COLOR_BOY,
                  },
                ]}
              />
            </TouchableOpacity>
            <TouchableOpacity
              hitSlop={{ left: 10, top: 10, bottom: 10, right: 10 }}
              onPress={() => this._didChangeGenderCategory(2)}
            >
              <Text style={styles.topTitle}>
                {translate("GIRLS").toUpperCase()}
              </Text>
              <View
                style={[
                  styles.genderCategoryUnderLine,
                  {
                    height: selectedGenderIndex == 2 ? 2 : 0,
                    backgroundColor: Constants.APP_COLOR_GIRL,
                  },
                ]}
              />
            </TouchableOpacity>
            <View style={{ flex: 1 }} />

            {(productsList.length > 0 ||
              Object.keys(filterParams).length > 0) && (
              <TouchableOpacity
                onPress={this._didTapOnFilter}
                style={styles.filterContainer2}
              >
                <Image source={Images.filter} />
                <Text style={styles.filterText}>
                  {translate("Filter").toUpperCase()}
                </Text>
              </TouchableOpacity>
            )}

            {isFilterApplied && (
              <TouchableOpacity
                hitSlop={{ left: 10, top: 10, bottom: 10, right: 10 }}
                onPress={this._didTapOnClearButton}
                style={styles.clearButton2}
              >
                <Image
                  style={{
                    width: 15,
                    height: 15,
                    tintColor: Constants.APP_GRAY_COLOR3,
                  }}
                  source={Images.close}
                />
              </TouchableOpacity>
            )}
          </View>
        )}
        {ageGroupArray.length > 0 && (
          <View style={{ paddingBottom: 10 }}>
            <FlatList
              data={[...["all"], ...ageGroupArray]}
              // data={genderRangeArray}
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ marginTop: 10 }}
              keyExtractor={(item, index) => index.toString()}
              renderItem={(item) =>
                this._renderGenderRanges(
                  item,
                  genderType,
                  ageGroupArray.length + 1
                )
              }
            />
          </View>
        )} */}
        <View style={{ flex: 1 }}>
          <View
            style={{
              borderBottomWidth: 0.5,
              borderBottomColor: Constants.APP_GRAY_COLOR4,
              shadowColor: constants.APP_GRAY_COLOR,
              shadowOffset: {
                width: 0,
                height: -5,
              },
              shadowOpacity: 0.25,
              // elevation: 8,
              // marginBottom: 10,
            }}
          />
          {productsList.length > 0 ? (
            this._renderScene()
          ) : isLoadingProductList ? (
            <View />
          ) : (
            <EmptyDataPlaceholder
              titleText={translate("Empty")}
              descriptionText={translate("error_data")}
              placeHolderImage={Images.emptyProduct}
              buttonText={translate("Reload")}
              didTapOnButton={null}
            />
          )}
        </View>

        {/* {isFilterApplied && (
          <TouchableOpacity
            hitSlop={{ left: 10, top: 10, bottom: 10, right: 10 }}
            onPress={this._didTapOnClearButton}
            style={[styles.filterContainer, { bottom: 90 }]}
          >
            <Text style={styles.clearButtonText}>
              {translate("Clear").toUpperCase()}
            </Text>
          </TouchableOpacity>
        )} */}

        {/* {productsList.length > 0 && (
          <TouchableOpacity
            onPress={this._didTapOnFilter}
            style={styles.filterContainer}
          >
            <Image source={Images.filter} />
            <Text style={styles.filterText}>
              {translate("Filter").toUpperCase()}
            </Text>
          </TouchableOpacity>
        )} */}

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
        >
          <View style={{ flex: 1 }}>
            <Login
              didTapOnclose={() => this.setState({ isLoginViewShow: false })}
            />
          </View>
        </Modal>

        {isLoadingProductList && !isAPICalledCategory1 && <HudView />}
      </SafeAreaView>
    );
  }
}

export default ProductResultCategory;

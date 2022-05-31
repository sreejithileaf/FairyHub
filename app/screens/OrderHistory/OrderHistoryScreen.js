import {
  Text,
  View,
  FlatList,
  StatusBar,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";  
import moment from "moment";
import styles from "./styles";
import React, { Component } from "react";
import Images from "../../config/images";
import { isEmpty } from "../../config/common";
import Constants from "../../config/constants";
import HudView from "../../components/hudView";
import ItemCell from "../../components/itemCell";
import { translate } from "../../config/languageSwitching/index";
import EmptyDataPlaceholder from "../../components/emptyDataPlaceholder";
import NavigationHeader1 from "../../components/NavigationHeaders/NavigationHeader1";

const ListItem = React.memo(
  ({
    item,
    index,
    productsColors,
    productsSizes,
    addProductToWishList,
    didTapOnItem,
    props,
  }) => {
    const orderCell = item.items.map((orderedItem, ind) => {
      let itemData = orderedItem.parent_item
        ? orderedItem.parent_item
        : orderedItem;

      if (itemData) {
        return (
          <View>
            <View
              style={{
                // backgroundColor: Constants.APP_WHITE_COLOR,
                marginHorizontal: 20,
              }}
            >
              <ItemCell
                item={itemData}
                addProductToWishList={addProductToWishList}
                index={index}
                productsSizes={productsSizes}
                productsColors={productsColors}
                allowAddOption={true}
                showQuantity={false}
                currency={props.currency}
                itemTotalCost={itemData.row_total}
                appMediaBaseUrl={props.appMediaBaseUrl}
                orderHistoryDetailsScreen={true}
                didTapOnItem={() => {
                  props.navigation.push("ProductDetail", {
                    sku: itemData.sku,
                    // isFromCartScreen: true,
                  });
                }}
              />
            </View>
            {ind + 1 !== item.items.length && (
              <View style={[styles.underLineStyle]} />
            )}
          </View>
        );
      }
    });

    let status = item.status.charAt(0).toUpperCase() + item.status.slice(1);
    let color = "green";

    if (item.status === "refundrequest") {
      status = "Refund in Process";
    }

    switch (status) {
      case "Pending":
        color = "blue";
        break;
      case "Processing":
        color = "black";
        break;
      case "Refund in Process":
        color = Constants.APP_THEME_DARK_GRAY;
        break;

      default:
        break;
    }
    return (
      <TouchableOpacity
        activeOpacity={Constants.ACTIVE_OPACITY}
        onPress={() => {
          didTapOnItem(item, index);
        }}
        style={styles.order_detailContainer}
      >
        <View style={styles.order_noContainer}>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View style={{ flexDirection: "row" }}>
              <Text style={styles.orderNumberText}>
                {translate("Order Number")}
              </Text>
              <Text style={styles.orderNumberText}> {item.increment_id}</Text>
            </View>
          </View>

          <View style={styles.dateContainer}>
            {/* <Text style={styles.orderNumberText}>{translate("DELIVERY BY")}</Text>
					<Text>{" : "}</Text> */}
            <Text
              style={[
                styles.deliveryStatusText,
                {
                  color: "rgb(154,154,154)",
                },
              ]}
            >
              {moment(item.created_at).format("DD.MM.YYYY")}
            </Text>
          </View>
        </View>
        {/* <TouchableOpacity style={styles.recorderButton}>
          <Text style={styles.recorderButtonText}>{translate("Recorder")}</Text>
        </TouchableOpacity> */}
        <View style={styles.statusButton}>
          <Text style={[styles.recorderButtonText, { color }]}>{status}</Text>
        </View>
        <View style={[styles.line]} />
        {orderCell}
        <View style={[styles.line2]} />
      </TouchableOpacity>
    );
  }
);

class OrderHistoryScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orderList: "",
      pageIndex: 1,
      isPendingData: true,
    };
  }

  componentDidMount() {
    this._updateOrderHistory();
  }

  _didTapOnBackButton = () => {
    this.props.navigation.goBack();
  };

  _updateOrderHistory = () => {
    const { pageIndex, isPendingData, orderList } = this.state;

    let params = {
      pageIndex: pageIndex,
      pageSize: 5, //Constants.PRODUCTS_PAGE_COUNT,
    };
    this.props.getOrderHistory(params, (response) => {

      console.log(
        'orderdatas',
        response.items,
      );
      response.items.map((orderedItem) => {
        let arr = [];
        arr = orderedItem.items.filter((subItem) => {
          return (
            subItem.product_type === "simple" ||
            subItem.product_type === "virtual"
          );
        });
        orderedItem.items = arr; 
      });

      let dataArray = [];

      if (pageIndex == 1) {
        dataArray = response.items;
      } else {
        dataArray = [...orderList, ...response.items];
      }

      let isPendingData = false;
      if (response.total_count > dataArray.length) {
        isPendingData = true;
      }

      this.setState({
        orderList: dataArray,
        isPendingData,
        pageIndex: pageIndex + 1,
      });
    });
  };

  _didTapOnListItem = (item, index) => {
    this.props.navigation.navigate("OrderHistoryDetail", {
      orderItem: item,
      callback: () => {
        this.setState({ pageIndex: 1 }, () => {
          this._updateOrderHistory();
        });
      },
    });
  };

  _loadMore = () => {
    const { isPendingData } = this.state;
    if (isPendingData) this._updateOrderHistory();
  };

  render() {
    const {
      selectedLanguage,
      cartArray,
      guestCartArray,
      userToken,
      productsSizes,
      productsColors,
      isLoading,
      isRTL,
      currency,
    } = this.props;
    const { orderList } = this.state;
    const isUserLoggedIn = isEmpty(userToken);
    return (
      <SafeAreaView style={styles.safeContainer}>
        <StatusBar
          barStyle="dark-content"
          hidden={false}
          backgroundColor={Constants.APP_WHITE_COLOR}
        />
        <NavigationHeader1
          title={translate("Order History")}
          showBackButton={true}
          didTapOnLeftButton={this._didTapOnBackButton}
          isRTL={selectedLanguage === "ar" ? true : false}
          hideSearch={true}
        />

        {/* <Text style={styles.titleStyle}>{translate("Order History")}</Text> */}
        {/* <ScrollView
          showsVerticalScrollIndicator={false}
          // style={{ backgroundColor: Constants.APP_WHITE_COLOR }}
        > */}
        <View style={styles.scrollContainer}>
          {orderList.length > 0 && (
            <FlatList
              style={{
                backgroundColor: Constants.APP_TRANSPARENT_COLOR,
                marginTop: 15,
              }}
              data={orderList}
              extraData={this.props}
              renderItem={({ item, index }) => (
                <ListItem
                  item={item}
                  index={index}
                  productsSizes={productsSizes}
                  productsColors={productsColors}
                  didTapOnItem={() => this._didTapOnListItem(item, index)}
                  props={this.props}
                />
              )}
              onEndReached={this._loadMore}
              onEndReachedThreshold={0.5}
            />
          )}
        </View>
        {/* </ScrollView> */}
        {!isLoading && orderList.length == 0 && (
          <View style={{ alignSelf: "center" }}>
            <EmptyDataPlaceholder
              titleText={translate("Your order history is empty")}
              descriptionText={translate("order_history_empty_placeholder")}
              placeHolderImage={Images.noWishlist}
            />
          </View>
        )}
        {isLoading && <HudView />}
      </SafeAreaView>
    );
  }
}

export default OrderHistoryScreen;

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
import { isEmpty, showSimpleSnackbar } from "../../config/common";
import Constants from "../../config/constants";
import Countries from "../../lib/countires.js";
import HudView from "../../components/hudView";
import ItemCell from "../../components/itemCell";
import { translate } from "../../config/languageSwitching/index";
import EmptyDataPlaceholder from "../../components/emptyDataPlaceholder";
import NavigationHeader1 from "../../components/NavigationHeaders/NavigationHeader1";

const AdressListComponent = React.memo(({ item, props, index }) => {
  // return <View style={{ width: 100, height: 50, backgroundColor: "red" }} />;
  let a = item.default_billing;
  let b = item.default_shipping;
  const countryName = Countries[item.country_id].name.common;
  return (
    <View>
      {a && b ? (
        <View style={{ marginHorizontal: 20, flexDirection: "row" }}>
          <Text style={styles.addressText}>
            {translate("Default delivery address")}
          </Text>
          <Text style={styles.addressText}>|</Text>
          <Text style={styles.addressText}>
            {translate("Default billing address")}
          </Text>
        </View>
      ) : a ? (
        <View style={{ marginHorizontal: 20, flexDirection: "row" }}>
          <Text style={styles.addressText}>
            {translate("Default billing address")}
          </Text>
        </View>
      ) : b ? (
        <View style={{ marginHorizontal: 20, flexDirection: "row" }}>
          <Text style={styles.addressText}>
            {translate("Default delivery address")}
          </Text>
        </View>
      ) : (
        <View />
      )}

      {/* <View style={Styles.addressCardContainer}> */}

      <View
        style={{
          flexDirection: "row",
          flex: 1,
          marginHorizontal: 20,
          borderRadius: 5,
          marginTop: 10,
        }}
      >
        <View>
          <Text
            style={{
              color: "#787878",
              fontFamily: constants.Fonts.REGULAR,
              marginBottom: 3,
              textAlign: "left",
            }}
          >
            {item.street[0]}
          </Text>
          {item.street[1] ? (
            <Text
              style={{
                color: "#787878",
                fontFamily: constants.Fonts.REGULAR,
                marginBottom: 3,
                textAlign: "left",
              }}
            >
              {item.street[1]}
            </Text>
          ) : null}
          {item.street[2] ? (
            <Text
              style={{
                color: "#787878",
                fontFamily: constants.Fonts.REGULAR,
                marginBottom: 3,
              }}
            >
              {item.street[2]}
            </Text>
          ) : null}
          <Text
            style={{
              color: "#787878",
              fontFamily: constants.Fonts.REGULAR,
            }}
          >
            {item.city}
            {", "}
            {/* {CountryData[0].full_name_english} */}
            {countryName}
          </Text>
          <View style={{ marginVertical: 5 }}>
            <Text
              style={{
                color: "#787878",
                textAlign: "left",
                fontFamily: constants.Fonts.REGULAR,
              }}
            >
              {item.telephone}
            </Text>
          </View>
        </View>
      </View>
      {/* </View> */}
      <View style={[styles.underLineStyle, { marginTop: 9.5 }]} />
    </View>
  );
});

const ListItem = React.memo(
  ({
    item,
    index,
    productsColors,
    productsSizes,
    addProductToWishList,
    didTapOnItem,
    didTapOnReOrderItem,
    props,
  }) => {
    let dateString = moment(item.created_at).format("DD.MM.YYYY");
    return (
      <TouchableOpacity
        activeOpacity={Constants.ACTIVE_OPACITY}
        onPress={() => {
          didTapOnItem(item, index);
        }}
        style={styles.contactContainer}
      >
        <Text style={styles.dateText}>{dateString}</Text>
        <Text style={styles.idText}>{item.increment_id}</Text>
        <TouchableOpacity
          style={styles.recorderButton}
          onPress={() => didTapOnReOrderItem(item)}
        >
          <Text style={styles.recorderButtonText}>{translate("Reorder")}</Text>
        </TouchableOpacity>
        <View style={[styles.line]} />
      </TouchableOpacity>
    );
  }
);

class Overview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orderList: "",
    };
  }

  componentDidMount() {
    let params = {
      pageIndex: 0,
      pageSize: 3, //Constants.PRODUCTS_PAGE_COUNT,
    };

    this.props.getOrderHistory(params, (response) => {
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

      let ooo = response.items;
      if (response.items.length > 3) {
        let orderHistoryLength = response.items.length;
        ooo = [
          ...[ooo[orderHistoryLength - 3]],
          ...[ooo[orderHistoryLength - 2]],
          ...[ooo[orderHistoryLength - 1]],
        ];
      }

      this.setState({ orderList: ooo });
    });
  }

  _didTapOnBackButton = () => {
    this.props.navigation.goBack();
  };

  _didTapOnListItem = (item, index) => {
    this.props.navigation.navigate("OrderHistoryDetail", {
      orderItem: item,
      callback: () => {
        let params = {
          pageIndex: 0,
          pageSize: 3, //Constants.PRODUCTS_PAGE_COUNT,
        };

        this.props.getOrderHistory(params, (response) => {
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

          let ooo = response.items;
          if (response.items.length > 3) {
            let orderHistoryLength = response.items.length;
            ooo = [
              ...[ooo[orderHistoryLength - 3]],
              ...[ooo[orderHistoryLength - 2]],
              ...[ooo[orderHistoryLength - 1]],
            ];
          }

          this.setState({ orderList: ooo });
        });
      },
    });
  };

  _didTapOnReOrderItem = (item) => {
    let params = {
      order_id: item.entity_id,
    };
    this.props.reOrderItems(params, (status) => {
      if (status)
        showSimpleSnackbar(translate("Items are added into the cart"));
    });
  };

  render() {
    const {
      selectedLanguage,
      cartArray,
      guestCartArray,
      userToken,
      userInfo,
      productsSizes,
      productsColors,
      isLoading,
      isRTL,
      currency,
      addressList,
    } = this.props;
    const { orderList } = this.state;
    const isUserLoggedIn = isEmpty(userToken);

    let mobileNo = "";
    if (
      userInfo &&
      userInfo.custom_attributes &&
      userInfo.custom_attributes.length > 0
    ) {
      userInfo.custom_attributes.map((obj) => {
        if (obj.attribute_code === "fhmobile_number") {
          mobileNo = obj.value;
        }
      });
    }

    return (
      <SafeAreaView style={styles.safeContainer}>
        <StatusBar
          barStyle="dark-content"
          hidden={false}
          backgroundColor={Constants.APP_WHITE_COLOR}
        />
        <NavigationHeader1
          title={translate("Overview")}
          showBackButton={true}
          didTapOnLeftButton={this._didTapOnBackButton}
          isRTL={selectedLanguage === "ar" ? true : false}
          hideSearch={true}
        />

        {/* <Text style={styles.titleStyle}>{translate("Order History")}</Text> */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          // style={{ backgroundColor: Constants.APP_WHITE_COLOR }}
        >
          <View style={styles.headingContainers}>
            <Text style={styles.mainheading}>
              {translate("Contact information")}
            </Text>
          </View>
          <View style={{ flexDirection: "row", paddingHorizontal: 20 }}>
            <Text style={styles.contactContentText}>{translate("Name")} :</Text>
            <Text style={styles.contactContentText}>{userInfo.firstname}</Text>
            <Text style={styles.contactContentText}>{userInfo.lastname}</Text>
          </View>
          <View style={{ flexDirection: "row", paddingHorizontal: 20 }}>
            <Text style={styles.contactContentText}>
              {translate("Email Address")} :
            </Text>
            <Text style={styles.contactContentText}>{userInfo.email}</Text>
          </View>
          <View style={{ flexDirection: "row", paddingHorizontal: 20 }}>
            <Text style={styles.contactContentText}>
              {translate("Phone Number")} :
            </Text>
            <Text style={styles.contactContentText}>{"+965 " + mobileNo}</Text>
          </View>

          <View style={styles.headingContainers1}>
            <Text style={styles.mainheading}>{translate("Order History")}</Text>
          </View>
          <View style={{ flexDirection: "row", paddingHorizontal: 20 }}>
            <Text style={styles.orderSize}>{translate("Your")}</Text>
            <Text style={styles.orderSize}>
              {orderList.length > 3 ? "3" : orderList.length}
            </Text>
            <Text style={styles.orderSize}>
              {translate("most recent orders")}
            </Text>
          </View>

          <View style={styles.scrollContainer}>
            {orderList.length > 0 && (
              <FlatList
                style={{ backgroundColor: Constants.APP_TRANSPARENT_COLOR }}
                data={orderList}
                extraData={this.props}
                renderItem={({ item, index }) => (
                  <ListItem
                    item={item}
                    index={index}
                    productsSizes={productsSizes}
                    productsColors={productsColors}
                    didTapOnItem={() => this._didTapOnListItem(item, index)}
                    didTapOnReOrderItem={() => this._didTapOnReOrderItem(item)}
                    props={this.props}
                    orderList={orderList}
                  />
                )}
              />
            )}
          </View>
          <View style={styles.headingContainers2}>
            <Text style={styles.mainheading}>{translate("Address Book")}</Text>
          </View>
          {addressList && addressList.length == 0 ? (
            <View style={{ flex: 1, marginTop: 25 }}>
              <Text
                style={{
                  fontFamily: Constants.Fonts.REGULAR,
                  fontSize: 14,
                  color: "rgb(112,112,112)",
                  textAlign: "center",
                }}
              >
                {translate("Your address list is empty")}
              </Text>
            </View>
          ) : (
            <View
              style={{ flex: 1, backgroundColor: constants.APP_WHITE_COLOR }}
            >
              <FlatList
                data={addressList}
                style={{ flex: 1 }}
                renderItem={({ item, index }) => (
                  <View>
                    <AdressListComponent
                      // list={addressList}
                      item={item}
                      index={index}
                      props={this.props}
                    />
                  </View>
                )}
                extraData={this.props}
                keyExtractor={(item, index) => index.toString()}
              />
            </View>
          )}
        </ScrollView>
        {isLoading && <HudView />}
      </SafeAreaView>
    );
  }
}

export default Overview;

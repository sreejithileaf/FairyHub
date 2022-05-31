/**
 * Created by iLeaf Solutions Pvt.Ltd
 * on February 19, 2020
 * AddressListView - Address List View will show the Addresses of user.
 */

import {
  View,
  Text,
  Image,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import Styles from "./style";
import Images from "../../config/images";
import constants from "../../config/constants";
import Countries from "../../lib/countires.js";
import HudView from "../../components/hudView";
import React, { Component, memo } from "react";
import { showAlertWithCallback } from "../../config/common";
import { translate } from "../../config/languageSwitching/index";
import EmptyDataPlaceholder from "../../components/emptyDataPlaceholder";
import NavigationHeader1 from "../../components/NavigationHeaders/NavigationHeader2";
import styles from "./style";

class AddressListScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      defaultAddress: false,
      deliveryAddress: false,
    };
  }

  newDefaultAddress = (selectedIndex) => {
    let addressListArray = this.props.addressList;
    addressListArray.map((item) => {
      item["default_billing"] = false;
    });

    let addressDict = addressListArray[selectedIndex];
    addressDict["default_billing"] = true;
    addressListArray[selectedIndex] = addressDict;

    let userInfo = this.props.userInfo;
    userInfo["addresses"] = addressListArray;
    this.props.editAddressUser({ customer: userInfo }, () => {
      // console.log("SUCCESS");
      // console.log("addressListArray:", addressListArray);
    });
  };

  newDefaultShipmentAddress = (selectedIndex) => {
    let addressListArray = this.props.addressList;
    addressListArray.map((item) => {
      item["default_shipping"] = false;
    });

    let addressDict = addressListArray[selectedIndex];
    addressDict["default_shipping"] = true;
    addressListArray[selectedIndex] = addressDict;

    let userInfo = this.props.userInfo;
    userInfo["addresses"] = addressListArray;
    this.props.editAddressUser({ customer: userInfo }, () => {
      // console.log("SUCCESS");
      // console.log("addressListArray:", addressListArray);
    });

    if (this.props.cartList.length > 0)
      this._setShippingAddress(addressDict, addressDict);
  };

  _setShippingAddress = (deliveryAddressDict, billingAddressDict) => {
    const { userToken, guestInfo, userInfo } = this.props;
    let email = userToken.length > 0 ? userInfo.email : guestInfo.email;
    let params = {
      addressInformation: {
        shippingAddress: {
          country_id: deliveryAddressDict.country_id,
          street: deliveryAddressDict.street,
          company: deliveryAddressDict.company,
          telephone: deliveryAddressDict.telephone,
          postcode: deliveryAddressDict.postcode,
          city: deliveryAddressDict.city,
          firstname: deliveryAddressDict.firstname,
          lastname: deliveryAddressDict.lastname,
          email: email,
          region_id: deliveryAddressDict.region.region_id,
          // sameAsBilling: 1,
        },
        billingAddress: {
          country_id: billingAddressDict.country_id,
          street: billingAddressDict.street,
          company: billingAddressDict.company,
          telephone: billingAddressDict.telephone,
          postcode: billingAddressDict.postcode,
          city: billingAddressDict.city,
          firstname: billingAddressDict.firstname,
          lastname: billingAddressDict.lastname,
          email: email,
          region_id: billingAddressDict.region.region_id,
        },
        shipping_method_code: "flatrate",
        shipping_carrier_code: "flatrate",
      },
    };
    this.props.setShipmentInfo(params, () => {
      //
    });
  };

  removeAddressFromList = (selectedIndex) => {
    let addressArray = this.props.addressList;
    let selectedAddressDict = addressArray[selectedIndex];
    showAlertWithCallback(
      translate("removeAddress"),
      translate("Yes"),
      translate("No"),
      () => {
        this.props.removeAddress(selectedAddressDict.id, selectedIndex);
      },
      null
    );
  };

  didTapOnBackButton = () => {
    let didSelectUserUpdateAddress = this.props.navigation.state.params
      ? this.props.navigation.state.params.didSelectUserUpdateAddress
      : null;
    if (didSelectUserUpdateAddress) {
      didSelectUserUpdateAddress();
    }
    this.props.navigation.goBack();
  };

  didTapOnAddAddressButton = () => {
    this.props.navigation.push("AddAddressScreen", {
      details: {},
    });
  };

  render() {
    const { addressList, isLoading } = this.props;
    return (
      <SafeAreaView style={Styles.container}>
        <NavigationHeader1
          hideBottomLine
          hideSearch={true}
          showAddAddress
          didTapOnAddAddressButton={this.didTapOnAddAddressButton}
          title={translate("Address Book")}
          showBackButton={true}
          didTapOnBackButton={this.didTapOnBackButton}
          isRTL={this.props.isRTL}
          // RightButtonComponent1
        />
        {addressList && addressList.length == 0 ? (
          <View style={{ flex: 1 }}>
            <EmptyDataPlaceholder
              titleText={translate("Your address list is empty")}
              descriptionText={translate(
                "Please add your Billing/Shipping address"
              )}
              placeHolderImage={Images.addressEmpty}
              imageStyle={{ width: 100, height: 100, marginBottom: 30 }}
            />
          </View>
        ) : (
          <View style={{ flex: 1, backgroundColor: constants.APP_WHITE_COLOR }}>
            <View
              style={{
                backgroundColor: "rgba(217,217,217,0.2)",
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: constants.Fonts.REGULAR,
                  marginLeft: 20,
                  marginTop: 13,
                  marginBottom: 12,
                  color: constants.APP_GRAY_COLOR,
                  textAlign: "left",
                }}
              >
                {translate("You can edit, delete or add a new address here")}
              </Text>
            </View>
            <FlatList
              data={addressList}
              style={{ flex: 1 }}
              renderItem={({ item, index }) => (
                <View>
                  <AdressListComponent
                    setDefaultAddress={this.newDefaultAddress}
                    setDefaultShipmentAddress={this.newDefaultShipmentAddress}
                    removeAddressFromList={this.removeAddressFromList}
                    list={addressList}
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

        {isLoading && <HudView />}
      </SafeAreaView>
    );
  }
}

/** Value Deals Item Component */
const AdressListComponent = memo(
  ({
    item,
    props,
    index,
    setDefaultAddress,
    setDefaultShipmentAddress,
    removeAddressFromList,
    list,
  }) => {
    // let a = item.default_billing;
    let a = item.default_billing ? item.default_billing : false;
    let b = item.default_shipping ? item.default_shipping : false;
    const onChoose = (selectedIndex) => {
      setDefaultAddress(selectedIndex);
    };
    const onChooseShipment = (selectedIndex) => {
      setDefaultShipmentAddress(selectedIndex);
    };
    const countryName = Countries[item.country_id].name.common;
    const removeAddress = (selectedIndex) => {
      removeAddressFromList(selectedIndex);
    };

    // return <View style={{ width: 100, height: 50, backgroundColor: "red" }} />;

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
        <TouchableOpacity
          style={Styles.addressCardContainer}
          activeOpacity={1}
          onPress={() => {
            // let didSelectUserUpdateAddress = props.navigation.state.params
            //   ? props.navigation.state.params.didSelectUserUpdateAddress
            //   : null;
            // if (didSelectUserUpdateAddress) {
            //   didSelectUserUpdateAddress();
            //   props.navigation.goBack();
            // }
          }}
        >
          {/* <View style={Styles.addressCardContainer}> */}

          <View style={[Styles.card_name_row]}>
            <View style={{ marginRight: 20 }}>
              <Text
                style={{
                  color: "#787878",
                  fontFamily: constants.Fonts.REGULAR,
                  marginBottom: 3,
                  textAlign: "left",
                }}
              >
                {item.firstname +
                  " " +
                  (item.lastname === "address" ? "" : item.lastname)}
              </Text>
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
            </View>
          </View>
          <View style={{ marginVertical: 5, marginHorizontal: 20 }}>
            <Text
              style={{
                color: "#787878",
                textAlign: "left",
                fontFamily: constants.Fonts.REGULAR,
              }}
            >
              {"+965 " + item.telephone}
            </Text>
          </View>
          <TouchableOpacity
            hitSlop={{ left: 20, right: 20, top: 20, bottom: 20 }}
            onPress={() => {
              props.navigation.push("AddAddressScreen", {
                details: item,
                edit: true,
              });
            }}
            style={Styles.btn_bottom_touchable_style}
          >
            <Image
              source={Images.editIcon}
              style={{
                height: 13,
                width: 13,
              }}
            />
          </TouchableOpacity>
          {/* </View> */}
          <TouchableOpacity
            onPress={() => removeAddress(index)}
            hitSlop={{ left: 20, top: 20, bottom: 20, right: 20 }}
            style={{
              position: "absolute",
              right: 15,
              top: 45,
              backgroundColor: "rgba(217,217,217,0.15)",
              borderRadius: 3,
              height: 22,
              width: 22,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image source={Images.addressRemove} />
          </TouchableOpacity>

          {!a && !b ? (
            <View style={Styles.bottomButtonContainer}>
              <TouchableOpacity
                style={Styles.bottomButton1Container}
                onPress={() => {
                  if (!a) onChoose(index);
                }}
              >
                <Text style={Styles.bottomButtonText}>
                  {translate("SET AS DEFAULT BILLING ADDRESS")}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ flex: 1 }}
                onPress={() => {
                  if (!b) onChooseShipment(index);
                }}
              >
                <Text style={Styles.bottomButtonText}>
                  {translate("SET AS DEFAULT DELIVERY ADDRESS")}
                </Text>
              </TouchableOpacity>
            </View>
          ) : !a ? (
            <View style={Styles.bottomButtonContainer}>
              <TouchableOpacity
                style={{
                  borderRightWidth: !a ? 0 : 1,
                  borderColor: constants.APP_SEPARATOR_COLOR,
                  flex: 1,
                }}
                onPress={() => {
                  if (!a) onChoose(index);
                }}
              >
                <Text style={Styles.bottomButtonText}>
                  {translate("SET AS DEFAULT BILLING ADDRESS")}
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            !b && (
              <View style={Styles.bottomButtonContainer}>
                <TouchableOpacity
                  style={{ flex: 1 }}
                  onPress={() => {
                    if (!b) onChooseShipment(index);
                  }}
                >
                  <Text style={Styles.bottomButtonText}>
                    {translate("SET AS DEFAULT DELIVERY ADDRESS")}
                  </Text>
                </TouchableOpacity>
              </View>
            )
          )}
          {a && b && (
            <View style={[Styles.underLineStyle, { marginTop: 9.5 }]} />
          )}
        </TouchableOpacity>
      </View>
    );
  }
);

export default AddressListScreen;

/**
 * Created by iLeaf Solutions Pvt.Ltd
 * on May 20, 2022
 * Track Your Orders - User can see orders status
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
import TrackOrderListView from '../../components/TrackOrderListView'

const DATA = [];

class TrackYourOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orderList: "",
      pageIndex: 1,
      isPendingData: true,
    };
  }

  // getData() {
  //   return [
  //     {
  //       key: 1, title: 'Albert Einstein',
  //       description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore',

  //     },
  //     {
  //       key: 2,
  //       title: 'Isaac newton',
  //       description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore',

  //     },
  //     {
  //       key: 1, title: 'Albert Einstein',
  //       description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore',

  //     },
  //   ]
  // }

  didTapOnBackButton = () => {
    this.props.navigation.goBack();
  };

  _didTapOnCart = () => {
    this.props.navigation.navigate("Cart");
  };


  componentDidMount() {
    this.getOrderTracking();
  }

  getOrderTracking = () => {

    const { orderList } = this.state;

      let params = {
      id: 11318
      // pageIndex: pageIndex,
      // pageSize: 5, 
    };

    this.props.getOrderTrackingHistory(params, (response) => {
      console.log(
        'ordertrackingdatas:---@@@@@@',
        response[0].result
      );
      let dataArray = [];
      dataArray = response[0].result
      dataArray.reverse()
      this.setState({
        orderList: dataArray,        
      });

    });
  };

  render() {
    const { orderList } = this.state;
    const { addressList, isLoading } = this.props;
    return (
      <SafeAreaView style={Styles.container}>
        <NavigationHeader1
          hideBottomLine
          hideSearch={true}
          showCart={true}
          didTapOnCart={this._didTapOnCart}
          title={translate("Track Your Order")}
          showBackButton={true}
          didTapOnBackButton={this.didTapOnBackButton}
          isRTL={this.props.isRTL}
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
                backgroundColor: constants.APP_DARKBLUE_COLOR,
              }}
            >
              <Text
                style={{
                  fontSize: 13,
                  fontFamily: constants.Fonts.REGULAR,
                  marginLeft: 20,
                  marginTop: 13,
                  marginBottom: 12,
                  color: constants.APP_WHITE_COLOR,
                  textAlign: "left",
                }}
              >
                {"Invoice Number : 11318"}
              </Text>
            </View>

            <SafeAreaView style={styles.listContainer}>

              <TrackOrderListView
                itemList={orderList}
              />
              {/* <FlatList
                 data={DATA} 
                renderItem={this.renderItem}
                keyExtractor={item => item.id}
              /> */}
            </SafeAreaView>

            <View style={[Styles.underLineStyle, { marginTop: 35, marginBottom: 20 }]} />

            <FlatList
              data={addressList}
              style={{ flex: 1 }}
              renderItem={({ item }) => (
                <View>
                  <AdressListComponent
                    list={addressList}
                    item={item}
                    props={this.props}
                  />
                </View>
              )}
              extraData={this.props}
              keyExtractor={(index) => index.toString()}
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
    item
  }) => {

    const countryName = Countries[item.country_id].name.common;

    return (
      <View>
        {
          <View style={{ marginHorizontal: 20, flexDirection: "row" }}>
            <Image
              source={Images.homeAddress}
              style={{
                height: 13, width: 13, marginTop: 12,
              }}
            />
            <Text style={styles.addressText}>
              {translate("Address Info")}
            </Text>
          </View>
        }

        <TouchableOpacity
          style={Styles.addressCardContainer}
          activeOpacity={1}
          onPress={() => {
          }}
        >

          <View style={[Styles.card_name_row]}>
            <View style={{ marginRight: 20 }}>

              <Text
                style={{
                  color: "#787878",
                  fontFamily: constants.Fonts.REGULAR,
                  marginBottom: 3,
                  textAlign: "left",
                  marginLeft: 35
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
                    marginLeft: 35
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
                    marginLeft: 35
                  }}
                >
                  {item.street[2]}
                </Text>
              ) : null}
              <Text
                style={{
                  color: "#787878",
                  fontFamily: constants.Fonts.REGULAR,
                  marginLeft: 35
                }}
              >
                {item.city}
                {", "}
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
                marginLeft: 35
              }}
            >
              {item.telephone}
            </Text>
          </View>


        </TouchableOpacity>
      </View>
    );
  }
);

export default TrackYourOrder;

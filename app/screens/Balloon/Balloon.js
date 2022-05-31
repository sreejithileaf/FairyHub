/**
 * Created by iLeaf Solutions Pvt.Ltd
 * on February 19, 2020
 * Add Ballons - Add or edit Balloons.
 */

import {
  View,
  Text,
  Image,
  FlatList,
  TextInput,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import Styles from "./style";
import Modal from "react-native-modal";
import Images from "../../config/images";
import constants from "../../config/constants";
import HudView from "../../components/hudView";
import React, { Component, memo } from "react";
import Constants from "../../config/constants";
import ImageLoader from "react-native-image-progress";
import { translate } from "../../config/languageSwitching/index";
import FooterButton from "../../components/FooterButton/FooterButton";
import { normalizedHeight, showSingleAlert } from "../../config/common";
import NavigationHeader1 from "../../components/NavigationHeaders/NavigationHeader1";

const PAGE_COUNT = 5;

/** Selected Balloon Component */
const SelectedBalloon = React.memo(
  ({
    item,
    index,
    _OnIncreament,
    _OnDecreament,
    _OnRemove,
    length,
    currency,
    props,
  }) => {
    return (
      <View>
        <View style={Styles.selectedBalloonContainer}>
          <View style={Styles.balloonImg2}>
            <ImageLoader
              source={{
                uri: props.appMediaBaseUrl + item.image,
              }}
              resizeMode={"contain"}
              style={{
                width: 43,
                height: 43,
              }}
              defaultSource={Images.placeHolderProduct}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={Styles.priceText2}>
              {translate("Type") + " : " + item.balloonType}
            </Text>

            <Text style={Styles.priceText2}>
              {translate("Unit Price") +
                " : " +
                item.balloonPrice.toFixed(3) +
                currency}
            </Text>

            <Text style={Styles.priceText2}>
              {translate("Gross Total") +
                " : " +
                (item.quantity * item.balloonPrice).toFixed(3) +
                currency}
            </Text>
          </View>
          <View style={Styles.increamentWrap}>
            <TouchableOpacity
              onPress={() => _OnDecreament(item, index)}
              hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
            >
              <Image source={Images.decrement} style={Styles.plusIcon} />
            </TouchableOpacity>
            <TextInput
              style={Styles.countNum}
              value={item.quantity && item.quantity.toString()}
            />
            <TouchableOpacity
              onPress={() => _OnIncreament(item, index)}
              hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
            >
              <Image source={Images.increment} style={Styles.plusIcon} />
            </TouchableOpacity>
          </View>
        </View>
        {length - 1 !== index && <View style={Styles.underLineStyle2} />}
        {length - 1 == index && (
          <View
            style={{
              height: 20,
              backgroundColor: "white",
            }}
          >
            <View style={[Styles.underLineStyle]} />
          </View>
        )}
      </View>
    );
  }
);

class Balloon extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedBalloons: [],
      selectedBalloonsTemp: [],
      isShowBalloonPopUp: false,
      selectedBalloonOption: "",
      selectedBalloonDict: null,
      availableBalloonsInState: [],
    };
  }

  componentDidMount() {
    // let param = { addon_type: "5650" };
    let param = { addon_type: "balloon" };
    this.props.getAvailableBalloons(param, (status) => {
      if (!status) return;
      const { parentDict } = this.props.navigation.state.params;

      setTimeout(() => {
        const { cartAddOnsArray, availableBalloons } = this.props;

        let availableNow = [];
        availableBalloons.map((dataItems) => {
          let newObj = { ...dataItems };
          let productArray = [...dataItems.products];

          // newObj["isLoading"] = false;
          newObj["pageIndex"] = 1;
          newObj["isLoadMore"] =
            productArray.length < PAGE_COUNT ? false : true;

          newObj.products = productArray.slice(0, PAGE_COUNT);
          availableNow.push(newObj);
        });

        this.setState({ availableBalloonsInState: availableNow });

        let selectedBalloonsArray = [];
        if (cartAddOnsArray.length > 0) {
          cartAddOnsArray.map((item) => {
            let dataArray =
              item.extension_attributes.custom_options &&
              item.extension_attributes.custom_options.length > 0
                ? item.extension_attributes.custom_options
                : [];

            let parentSKU = "";
            let balloonType = "Non Inflated";
            dataArray.map((itm) => {
              let dt = JSON.parse(itm);
              let keys = Object.keys(dt);

              if (keys[0] === "parent_sku") {
                parentSKU = dt.parent_sku.value;
              } else if (keys[0] === "inflated") {
                balloonType = dt.inflated.value ? "Inflated" : "Non Inflated";
              }
            });

            if (parentDict.sku === parentSKU) {
              if (
                item.extension_attributes &&
                item.extension_attributes.addons
              ) {
                let val = item.extension_attributes.addons;
                if (val === "5650") {
                  // var tmp = availableBalloons.filter((bal) => {
                  //   return item.sku === bal.sku;
                  // });
                  var tmp = [];
                  availableBalloons.map((subItems) => {
                    let tmp2 = subItems.products.filter((bal) => {
                      return item.sku === bal.sku;
                    });

                    tmp = tmp2.length > 0 ? tmp2 : tmp;
                  });

                  let gg = [];
                  if (tmp.length > 0)
                    tmp.map((dt) => {
                      let balloonPrice =
                        balloonType === "Inflated"
                          ? Number(dt.options.inflated.price) +
                            Number(dt.finalPrice)
                          : Number(dt.finalPrice);

                      let newDict = {
                        ...dt,
                        ...{
                          selected: true,
                          quantity: item.qty,
                          balloonType: balloonType,
                          balloonPrice: balloonPrice,
                        },
                      };
                      gg.push(newDict);
                    });

                  if (tmp.length > 0) {
                    selectedBalloonsArray = [...selectedBalloonsArray, ...gg];
                  }
                }
              }
            }
          });
        }

        this.setState({
          selectedBalloons: selectedBalloonsArray,
          selectedBalloonsTemp: JSON.parse(
            JSON.stringify(selectedBalloonsArray)
          ),
        });
      }, 500);
    });
  }

  _OnIncreament = (item, index) => {
    const selectedBalloons = this.state.selectedBalloons;
    selectedBalloons[index].quantity += 1;
    this.setState({ selectedBalloons });
  };

  _OnDecreament = (item, index) => {
    const selectedBalloons = this.state.selectedBalloons;

    if (selectedBalloons[index].quantity == 1) {
      selectedBalloons[index].selected = false;
      this.setState({
        selectedBalloons: selectedBalloons.filter((_, i) => i !== index),
      });
    } else {
      selectedBalloons[index].quantity -= 1;
      this.setState({ selectedBalloons });
    }
  };

  validateInput = (text) => {
    this.setState({ textLength: text.length });
  };

  //Header Back Arrow Function
  _didTapOnBackButton = () => {
    this.props.navigation.goBack();
  };

  insertBalloon = () => {
    const {
      selectedBalloonDict,
      selectedBalloonOption,
      selectedBalloons,
    } = this.state;

    if (selectedBalloonOption == "") {
      showSingleAlert(translate("Please select any option"));
      return;
    }

    let lastPrice = 0;
    if (selectedBalloonOption === "Inflated") {
      let inflatedPriceDict =
        selectedBalloonDict.options && selectedBalloonDict.options.inflated;
      lastPrice = inflatedPriceDict
        ? Number(inflatedPriceDict.price) +
          Number(selectedBalloonDict.finalPrice)
        : 0;
    } else if (selectedBalloonOption === "Non Inflated") {
      lastPrice = Number(selectedBalloonDict.finalPrice);
    }

    let tempDict = {
      ...selectedBalloonDict,
      ...{
        selected: true,
        quantity: 1,
        balloonType: selectedBalloonOption,
        balloonPrice: lastPrice,
      },
    };

    let isFound = false;
    let newSelectedBalloons = [];
    selectedBalloons.map((item) => {
      if (
        item.sku === selectedBalloonDict.sku &&
        item.balloonType === selectedBalloonOption
      ) {
        item.quantity = item.quantity + 1;
        isFound = true;
      }
      newSelectedBalloons.push(item);
    });

    if (!isFound) {
      newSelectedBalloons = selectedBalloons.concat(tempDict);
    }

    this.setState(
      {
        selectedBalloons: newSelectedBalloons,
      },
      () => {
        this.setState({
          isShowBalloonPopUp: false,
          selectedBalloonDict: null,
          selectedBalloonOption: "",
        });
      }
    );
  };

  //Reset Function
  _handleClear = () => {
    this.setState({
      selectedBalloons: [],
      isShowBalloonPopUp: false,
      selectedBalloonOption: "",
      selectedBalloonDict: null,
    });
  };

  _renderBalloons = ({ item, index }, productArray) => {
    const { selectedBalloons, availableBalloonsInState } = this.state;
    const {
      isLoading,
      currency,
      availableBalloons,
      appMediaBaseUrl,
    } = this.props;

    let inflatedPriceDict = item.options && item.options.inflated;
    let inflatedPrice = inflatedPriceDict
      ? (Number(inflatedPriceDict.price) + Number(item.finalPrice)).toFixed(3)
      : "";

    let percentage =
      ((item.price - Number(item.finalPrice)) / item.price) * 100;
    percentage = Number(percentage.toFixed(1));

    let isInStock = item.is_in_stock;

    return (
      <View
        style={{
          marginTop: 20,
          marginLeft: 15,
          marginRight: index + 1 == productArray.length ? 15 : 0,
          elevation: 10,
          shadowColor: Constants.APP_GRAY_COLOR,
          shadowOpacity: 0.35,
          shadowRadius: 5,
          shadowOffset: {
            width: 0,
            height: 5,
          },
        }}
      >
        <View style={Styles.balloonImg}>
          <ImageLoader
            source={{
              uri: appMediaBaseUrl + item.image,
            }}
            resizeMode={"contain"}
            style={{
              width: 165,
              height: 165,
            }}
            defaultSource={Images.placeHolderProduct}
          />
          {percentage > 0 && (
            <View
              style={{
                position: "absolute",
                width: 50,
                height: 20,
                left: 5,
                top: 5,
                backgroundColor: "rgb(139, 197, 81)",
                borderRadius: 2,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  color: Constants.APP_WHITE_COLOR,
                  fontFamily: Constants.Fonts.REGULAR,
                  fontSize: 9,
                }}
              >
                {percentage + " % OFF"}
              </Text>
            </View>
          )}
        </View>
        <View style={Styles.radioButtonContainer}>
          <View style={Styles.priceView}>
            <Text style={Styles.inflated}>{translate("Inflated")}</Text>
            <Text style={Styles.priceText}>
              {inflatedPrice}
              {currency}
            </Text>
          </View>

          <View style={Styles.priceView}>
            <Text style={Styles.inflated}>{translate("Non inflated")}</Text>
            <Text style={Styles.priceText}>
              {Number(item.finalPrice).toFixed(3)}
              {currency}
            </Text>
          </View>

          <TouchableOpacity
            style={Styles.buttonContainer}
            key={item.entity_id}
            onPress={() => {
              this.setState({ selectedBalloonDict: item }, () =>
                this.setState({ isShowBalloonPopUp: true })
              );
            }}
          >
            <Text style={Styles.buttonText}>{translate("Add") + "  "}</Text>
            <Image
              source={Images.addressRemove}
              resizeMode={"center"}
              style={{
                transform: [{ rotate: "45deg" }],
              }}
            />
          </TouchableOpacity>
        </View>

        {!isInStock && (
          <View style={Styles.overlay}>
            <View style={Styles.outOfStockContainer}>
              <Text style={Styles.outOfStockText}>
                {translate("Out of stock")}
              </Text>
            </View>
          </View>
        )}
      </View>
    );
  };

  _handleSave = () => {
    const { userToken, cartId, quoteID, cartAddOnsArray } = this.props;
    const { selectedBalloons, selectedBalloonsTemp } = this.state;
    const {
      parentDict,
      didBalloonsUpdated,
    } = this.props.navigation.state.params;

    if (
      JSON.stringify(selectedBalloons) === JSON.stringify(selectedBalloonsTemp)
    ) {
      this.props.navigation.pop();
      return;
    }

    let products = [];

    if (cartAddOnsArray.length > 0) {
      cartAddOnsArray.map((item) => {
        let dataArray =
          item.extension_attributes.custom_options &&
          item.extension_attributes.custom_options.length > 0
            ? item.extension_attributes.custom_options
            : [];

        let parentSKU = "";
        dataArray.map((itm) => {
          let dt = JSON.parse(itm);
          let keys = Object.keys(dt);
          if (keys[0] === "parent_sku") {
            parentSKU = dt.parent_sku.value;
          }
        });

        if (parentDict.sku === parentSKU) {
          if (item.extension_attributes && item.extension_attributes.addons) {
            let val = item.extension_attributes.addons;
            if (val === "5651") {
              let productOptions = [];
              dataArray.map((itm) => {
                let dt = JSON.parse(itm);
                let keys = Object.keys(dt);
                let subDict = dt[keys[0]];

                productOptions.push({
                  option_id: subDict.id,
                  option_value: subDict.value,
                });
              });

              let dict = {
                sku: item.sku,
                qty: item.qty,
                product_option: productOptions,
              };

              products.push(dict);
            }
          }
        }
      });
    }

    selectedBalloons.map((item, index) => {
      let productOptions = [
        {
          option_id: item.options.parent_name.id,
          option_value: parentDict.name,
        },
        {
          option_id: item.options.parent_sku.id,
          option_value: parentDict.sku,
        },
      ];

      if (item.balloonType === "Inflated") {
        productOptions.push({
          option_id: item.options.inflated.id,
          option_value: "yes",
        });
      }

      let dict = {
        sku: item.sku,
        qty: item.quantity,
        product_option: productOptions,
      };

      products.push(dict);
    });

    let params = {
      cart_item: {
        quote_id: userToken.length > 0 ? cartId : quoteID,
        parent_sku: parentDict.sku,
        products: products,
      },
    };

    this.props.addBalloons(params, (status) => {
      if (status) {
        let message =
          selectedBalloons.length === selectedBalloonsTemp.length
            ? translate("Balloons updated for") + ' "' + parentDict.name + '"'
            : selectedBalloons.length === 0
            ? translate("Balloons updated for") + ' "' + parentDict.name + '"'
            : translate("Balloons added for") + ' "' + parentDict.name + '"';
        showSingleAlert(message, translate("Ok"), () => {
          this.props.navigation.pop();
          didBalloonsUpdated();
        });
      }
    });
  };

  _getMoreAddOns = (balloonItem, catIndex) => {
    const { availableBalloonsInState } = this.state;
    const { isLoading, currency, availableBalloons } = this.props;

    if (balloonItem.isLoading) {
      return;
    }

    if (!balloonItem.isLoadMore) {
      return;
    }

    let dataItems = availableBalloons[catIndex];
    let newObj = { ...dataItems };
    let productArray = [...dataItems.products];

    let pageIndex = balloonItem.pageIndex;

    let newProductArray = productArray.slice(
      PAGE_COUNT * pageIndex,
      PAGE_COUNT * (pageIndex + 1)
    );

    newObj["isLoading"] = false;
    newObj["pageIndex"] = 1 + pageIndex;
    newObj["isLoadMore"] = newProductArray.length < PAGE_COUNT ? false : true;

    newObj.products = [...balloonItem.products, ...newProductArray];

    availableBalloonsInState[catIndex] = newObj;

    this.setState({ availableBalloonsInState });
  };

  render() {
    const {
      selectedBalloons,
      isShowBalloonPopUp,
      selectedBalloonOption,
      availableBalloonsInState,
    } = this.state;
    const { params } = this.props.navigation.state;
    let totalPrice = 0;
    selectedBalloons.forEach((item) => {
      totalPrice += item.quantity * item.balloonPrice;
    });
    const { isLoading, currency, availableBalloons } = this.props;
    return (
      <SafeAreaView style={Styles.container}>
        <NavigationHeader1
          // hideBottomLine
          title={translate("Select Balloon")}
          hideSearch={true}
          showBackButton={true}
          didTapOnLeftButton={this._didTapOnBackButton}
          isRTL={this.props.isRTL}
          extraStyle={{
            shadowColor: Constants.APP_SEPARATOR_COLOR,
            shadowOffset: {
              width: 0,
              height: 20,
            },
            shadowOpacity: 0.5,
            shadowRadius: 20,
            marginBottom: 5,
            elevation: 9,
          }}
        />
        <ScrollView
          style={{ backgroundColor: "rgb(249,249,249)" }}
          showsVerticalScrollIndicator={false}
        >
          {availableBalloonsInState.length > 0 &&
            availableBalloonsInState.map((balloonItem, indexVal) => {
              return (
                <View>
                  <Text style={Styles.sectionTitle}>
                    {balloonItem.category}
                  </Text>
                  <FlatList
                    data={balloonItem.products}
                    renderItem={({ item, index }) =>
                      this._renderBalloons(
                        { item, index },
                        balloonItem.products
                      )
                    }
                    keyExtractor={(item, index) => index.toString()}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    onEndReached={() => {
                      this._getMoreAddOns(balloonItem, indexVal);
                    }}
                    onEndReachedThreshold={0.5}
                  />
                </View>
              );
            })}

          {selectedBalloons != "" ? (
            <View>
              <FlatList
                data={selectedBalloons}
                style={{
                  backgroundColor: constants.APP_WHITE_COLOR,
                  marginTop: 20,
                }}
                renderItem={({ item, index }) => (
                  <SelectedBalloon
                    item={item}
                    index={index}
                    _OnIncreament={() => this._OnIncreament(item, index)}
                    _OnDecreament={() => this._OnDecreament(item, index)}
                    _OnRemove={() => this._OnRemove(item, index)}
                    length={selectedBalloons.length}
                    currency={currency}
                    props={this.props}
                  />
                )}
                keyExtractor={(item) => item.id + item.name}
                horizontal={false}
                showsVerticalScrollIndicator={false}
              />
              <View style={{ backgroundColor: constants.APP_WHITE_COLOR }}>
                <View
                  style={{
                    flexDirection: "row",
                    marginHorizontal: 20,
                    marginVertical: 15,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: constants.Fonts.BOLD,
                      fontSize: 18,
                      paddingHorizontal: 5,
                    }}
                  >
                    {translate("TOTAL COST")}
                  </Text>
                  <Text
                    style={{
                      fontFamily: constants.Fonts.BOLD,
                      fontSize: 18,
                      paddingHorizontal: 5,
                    }}
                  >
                    :
                  </Text>
                  <Text
                    style={{
                      fontFamily: constants.Fonts.BOLD,
                      fontSize: 18,
                      position: "absolute",
                      right: 10,
                    }}
                  >
                    {totalPrice.toFixed(3) + currency}
                  </Text>
                </View>
                <View style={{ height: 20, backgroundColor: "white" }}>
                  <View style={Styles.underLineStyle} />
                </View>
                <View
                  style={{
                    height: 20,
                    backgroundColor: "white",
                    width: "100%",
                  }}
                />
              </View>
            </View>
          ) : (
            <View style={{ height: normalizedHeight(200) }} />
          )}
        </ScrollView>
        <FooterButton
          buttonText1={translate("Clear").toUpperCase()}
          buttonText2={translate("SAVE")}
          onButton1Click={this._handleClear}
          onButton2Click={this._handleSave}
          screenWidth={this.props.screenWidth}
        />
        <Modal
          isVisible={isShowBalloonPopUp}
          onBackdropPress={() => this.setState({ isShowBalloonPopUp: false })}
          backdropOpacity={0.6}
          onBackButtonPress={() => this.setState({ isShowBalloonPopUp: false })}
        >
          <View style={Styles.cardModalWrapper}>
            <View style={Styles.cardWrapper}>
              <View style={Styles.closeContainer}>
                <Text style={Styles.selectText}>
                  {translate("Select Option")}
                </Text>
                <TouchableOpacity
                  onPress={() => this.setState({ isShowBalloonPopUp: false })}
                  style={Styles.closeButtonView}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Image source={Images.close} style={Styles.closeButton} />
                </TouchableOpacity>
              </View>
              <View style={Styles.optionContainer}>
                <TouchableOpacity
                  style={Styles.inflatedButton}
                  onPress={() =>
                    this.setState({ selectedBalloonOption: "Inflated" })
                  }
                >
                  <Image
                    source={Images.ckeckbox_dot}
                    style={
                      selectedBalloonOption == "Inflated"
                        ? Styles.checkBoxIconSelected
                        : Styles.checkBoxIcon
                    }
                  />
                  <Text style={Styles.inflated}>{translate("Inflated")}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={Styles.inflatedButton}
                  onPress={() =>
                    this.setState({ selectedBalloonOption: "Non Inflated" })
                  }
                >
                  <Image
                    source={Images.ckeckbox_dot}
                    style={
                      selectedBalloonOption == "Non Inflated"
                        ? Styles.checkBoxIconSelected
                        : Styles.checkBoxIcon
                    }
                  />
                  <Text style={Styles.inflated}>
                    {translate("Non inflated")}
                  </Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={[Styles.popUpAddButton]}
                activeOpacity={0.7}
                onPress={this.insertBalloon}
              >
                <Text style={Styles.popUpSubmitText}>{translate("Add")}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        {isLoading && <HudView />}
      </SafeAreaView>
    );
  }
}

export default Balloon;

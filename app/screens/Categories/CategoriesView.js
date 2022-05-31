/**
 * Created by Nithin for iLeaf Solutions Pvt.Ltd
 * on July 14, 2020
 * CategoriesView - Categories and subcategories list
 */

import {
  Text,
  View,
  Image,
  Platform,
  UIManager,
  StatusBar,
  Dimensions,
  SafeAreaView,
  TouchableOpacity,
  LayoutAnimation,
  ActivityIndicator,
  ImageBackground,
} from "react-native";
import styles from "./styles";
import RNFetchBlob from "rn-fetch-blob";
import Modal from "react-native-modal";
import Images from "../../config/images";
import React, { Component } from "react";
import { I18nManager } from "react-native";
import RNRestart from "react-native-restart";
import Constants from "../../config/constants";
import ActionSheet from "react-native-actionsheet";
import ImageLoader from "react-native-image-progress";
import { FlatList } from "react-native-gesture-handler";
import CircleButton from "../../components/circleButton";
import { translate } from "../../config/languageSwitching/index";
import { normalizedHeight, normalizedWidth } from "../../config/common";
import NavigationHeader2 from "../../components/NavigationHeaders/NavigationHeader2";
import FastImage from "react-native-fast-image";
import ImageComponent from "../../components/ImageComponent";

const isPotrait = () => {
  const { width, height } = Dimensions.get("window");
  return height >= width;
};

class CategoriesView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      renderSubCategories: [],
      selectedTitle: "",
      mainCategoryIndex: 0,
      orientation: isPotrait() ? "potrait" : "landscape",
      headerCategories:
        props.categoryLists.length > 0 ? props.categoryLists : [],
      expanded: false,
      indexVal: -1,
      isPopUpViewShow: false,
    };

    Dimensions.addEventListener("change", () => {
      this.setState({ orientation: isPotrait() ? "potrait" : "landScape" });
    });
    if (Platform.OS === "android") {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  _didTapOnSearch = () => {
    this.props.navigation.navigate("Search");
  };

  _didTapOnCart = () => {
    this.props.navigation.navigate("Cart");
  };

  didTapOnItem = (item, selectedindex) => {
    this.state.headerCategories.map((item, index) => {
      if (index === selectedindex) {
        item.selected = true;
      } else {
        item.selected = false;
      }
      return item;
    });
    this.setState({
      renderSubCategories: item.subCategories,
      selectedTitle: item.title,
      expanded: false,
      mainCategoryIndex: selectedindex,
    });
  };

  componentDidMount() {
    this.state.headerCategories.map((item, index) => {
      if (index === 0) {
        item.selected = true;
      } else {
        item.selected = false;
      }
      item.isImageLoaded = false;
      return item;
    });
    if (this.state.headerCategories.lenth > 0) {
      this.setState({
        renderSubCategories: this.state.headerCategories[0].subCategories || [],
        selectedTitle: this.state.headerCategories[0].title || "",
      });
    }
    this.didTapOnItem(this.state.headerCategories[0], 0);
  }

  /*Toggling functionality of the Accordion */
  toggleExpand = (exp, index) => {
    console.log("----ITEM", exp);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    if (this.state.expanded) {
      if (this.state.indexVal == index) {
        this.setState({ expanded: false });
      } else {
        this.setState({ expanded: true, indexVal: index });
      }
    } else {
      this.setState({ expanded: true, indexVal: index });
    }
  };

  renderSubCategories = ({ item, index }) => {
    const { appMediaBaseUrl } = this.props;
    return (
      <View
        style={{
          paddingTop: normalizedWidth(20),
          backgroundColor: "white",
        }}
      >
        <TouchableOpacity
          style={{ justifyContent: "center" }}
          // onPress={() => this.navigateProductDetail(index)}

          onPress={() => {
            if (item.children_data && item.children_data.length > 0) {
              this.toggleExpand(item, index);
            } else {
              let catId = "";
              let categoryName = "";
              let subCategories = [];
              if (index == 0) {
                const { headerCategories, mainCategoryIndex } = this.state;
                let selectedMainCategory = headerCategories[mainCategoryIndex];
                catId = selectedMainCategory.id;
                categoryName = "All " + selectedMainCategory.title;
                subCategories = selectedMainCategory.subCategories;
              } else {
                catId = item.id;
                categoryName = item.name;
              }

              this.props.navigation.navigate("ProductListFromCategory", {
                selectedSubCategoryId: catId,
                categoryName: categoryName,
                selectedSubCategories: subCategories,
                isFromHome: false,
              });
            }
          }}
        >
          <View style={styles.subcategoryItemContainer}>
            <ImageLoader
              source={{
                uri: appMediaBaseUrl + item.image,
              }}
              style={{ width: 35, height: 35 }}
              defaultSource={Images.cat_def}
              indicator={() => <View style={{ width: 0, height: 0 }} />}
            />

            {/* <ImageComponent
              source={{
                uri: appMediaBaseUrl + item.image,
              }}
              style={{ width: 35, height: 35 }}
              defaultSource={Images.cat_def}
              hideLoader
            /> */}

            <Text style={styles.subcategoryItemText}>
              {index == 0 ? "All " + this.state.selectedTitle : item.name}
            </Text>
          </View>
          <View style={[styles.line]} />
          <View style={styles.subcategorymainItemContainer}>
            {item.children_data && item.children_data.length > 0 && (
              <Image
                source={
                  this.state.expanded && index === this.state.indexVal
                    ? Images.arrowUp
                    : Images.arrowDown
                }
              />
            )}
          </View>
          {this.state.expanded &&
            index === this.state.indexVal &&
            item.children_data && (
              <View>
                <View style={{ paddingLeft: 15 }}>
                  <TouchableOpacity
                    style={{
                      marginTop: normalizedWidth(10),
                      flexDirection: "row",
                    }}
                    onPress={() => this.navigateProductDetail(item, true)}
                  >
                    {/* <ImageLoader
                      source={{
                        uri: appMediaBaseUrl + item.image,
                      }}
                      style={{ width: 30, height: 30 }}
                      defaultSource={Images.cat_def}
                      indicator={() => <View style={{ width: 0, height: 0 }} />}
                    /> */}

                    <ImageComponent
                      source={{
                        uri: appMediaBaseUrl + item.image,
                      }}
                      style={{ width: 30, height: 30 }}
                      defaultSource={Images.cat_def}
                      hideLoader
                    />

                    <Text style={styles.subcategoryText}>
                      {"All " + item.name}
                    </Text>
                  </TouchableOpacity>
                  <View style={styles.line2} />
                </View>
                {item.children_data.map((data, key) => {
                  return (
                    <View
                      style={{
                        paddingLeft: 15,
                        flex: 1,
                        // backgroundColor: "red",
                      }}
                    >
                      <TouchableOpacity
                        style={{
                          marginTop: normalizedWidth(10),
                          flexDirection: "row",
                        }}
                        onPress={() => this.navigateProductDetail(data, false)}
                      >
                        {/* <ImageLoader
                          source={{
                            uri: appMediaBaseUrl + data.image,
                          }}
                          style={{ width: 30, height: 30 }}
                          defaultSource={Images.cat_def}
                          indicator={() => (
                            <View style={{ width: 0, height: 0 }} />
                          )}
                        /> */}
                        <ImageComponent
                          source={{
                            uri: appMediaBaseUrl + data.image,
                          }}
                          style={{ width: 30, height: 30 }}
                          defaultSource={Images.cat_def}
                          hideLoader
                        />

                        <Text style={styles.subcategoryText}>{data.name}</Text>
                      </TouchableOpacity>
                      <View style={styles.line2} />
                    </View>
                  );
                })}
              </View>
            )}
        </TouchableOpacity>
      </View>
    );
  };

  navigateProductDetail = (data, isAll) => {
    console.log("DDDD", data);
    this.props.navigation.navigate("ProductListFromCategory", {
      selectedSubCategoryId: data.id,
      categoryName: isAll ? "All " + data.name : data.name,
    });
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

  render() {
    const {
      renderSubCategories,
      headerCategories,
      isPopUpViewShow,
    } = this.state;
    const { cartArray, isRTL, appMediaBaseUrl, appLogoUrl } = this.props;

    let dirs = RNFetchBlob.fs.dirs;
    let path = "";
    if (Constants.IS_ANDROID) {
      path = "file:///" + dirs.DocumentDir + "/appLogo.png";
    } else {
      path = dirs.DocumentDir + "/appLogo.png";
    }

    return (
      <SafeAreaView style={styles.safeContainer}>
        <StatusBar hidden={false} backgroundColor={Constants.APP_WHITE_COLOR} />
        <NavigationHeader2
          // didTapOnFlag={this._didTapOnFlag}
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

        <View style={styles.main_container}>
          <View style={styles.category_container}>
            <FlatList
              horizontal={false}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              data={headerCategories}
              keyExtractor={(item, index) => index.toString()}
              extraData={this.state}
              style={{
                // paddingBottom: 150,
                flex: 1,
              }}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  activeOpacity={Constants.ACTIVE_OPACITY}
                  onPress={() => this.didTapOnItem(item, index)}
                  style={
                    {
                      // alignItems: "center",
                    }
                  }
                >
                  <View style={{ flexDirection: "row" }}>
                    <View
                      style={{
                        marginTop: 25,
                        // marginBottom:
                        //   index == headerCategories.length - 1 ? 50 : 0,
                      }}
                    >
                      {/* {item.selected ? (
                        <View>
                          <Image
                            source={{
                              uri: appMediaBaseUrl + item.image_click,
                            }}
                            style={[
                              styles.category_img_container,
                              {
                                // tintColor: headerCategories[index].isImageLoaded
                                //   ? Constants.APP_THEME_COLOR
                                //   : null, //Constants.APP_THEME_COLOR,
                              },
                              {
                                alignItems: "center",
                                justifyContent: "center",
                              },
                            ]}
                            defaultSource={Images.placeHolderProduct}
                            onLoad={() => {
                              this.state.headerCategories[
                                index
                              ].isImageLoaded = true;
                              this.setState({ headerCategories });
                            }}
                          />
                          {headerCategories[index].isImageLoaded ? null : (
                            <View
                              style={[
                                styles.category_img_container,
                                {
                                  position: "absolute",
                                  alignItems: "center",
                                  justifyContent: "center",
                                },
                              ]}
                            >
                              <ActivityIndicator />
                            </View>
                          )}
                        </View>
                      ) : (
                        <ImageLoader
                          source={{
                            uri: appMediaBaseUrl + item.home_image,
                          }}
                          style={styles.category_img_container}
                          defaultSource={Images.placeHolderProduct}
                          onLoad={() => {
                            this.state.headerCategories[
                              index
                            ].isImageLoaded = true;
                          }}
                        />
                      )} */}

                      <ImageComponent
                        source={{
                          uri: item.selected
                            ? appMediaBaseUrl + item.image_click
                            : appMediaBaseUrl + item.home_image,
                        }}
                        style={styles.category_img_container}
                      />
                    </View>
                    {item.selected ? (
                      <View style={styles.category_item_selected} />
                    ) : (
                      <View style={styles.category_item_not_selected} />
                    )}
                  </View>
                  <Text
                    style={{
                      flex: 1,
                      width: normalizedWidth(82),
                      textAlign: "center",
                      fontSize: 13,
                      marginTop: 5,
                      fontFamily: Constants.Fonts.REGULAR,
                      marginBottom:
                        index == headerCategories.length - 1 ? 50 : 0,
                    }}
                  >
                    {item.title}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>

          <View style={styles.subcategory_container}>
            <Text style={styles.categoryTitleText}>
              {this.state.selectedTitle}
            </Text>

            <View
              style={{
                marginTop: normalizedWidth(50),
                flex: 1,
              }}
            >
              <FlatList
                style={{ flex: 1, marginBottom: 30 }}
                data={[...[{ name: "" }], ...renderSubCategories]}
                showsVerticalScrollIndicator={false}
                extraData={this.state}
                renderItem={this.renderSubCategories}
                keyExtractor={(item, index) => index.toString()}
              />
            </View>
          </View>
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
      </SafeAreaView>
    );
  }
}

export default CategoriesView;

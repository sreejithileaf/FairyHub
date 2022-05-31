/**
 * Created by iLeaf Solutions Pvt.Ltd
 * on February 19, 2020
 * GiftWraperView - Add or delete giftwraper
 */

import {
  View,
  Text,
  Image,
  FlatList,
  TextInput,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import Styles from './style';
import Modal from 'react-native-modal';
import Images from '../../config/images';
import constants from '../../config/constants';
import Constants from '../../config/constants';
import HudView from '../../components/hudView';
import React, {Component, memo} from 'react';
import ImageLoader from 'react-native-image-progress';
import {Picker} from '@react-native-picker/picker';
import RNPickerSelect from 'react-native-picker-select';
import {translate} from '../../config/languageSwitching/index';
import FooterButton from '../../components/FooterButton/FooterButton';
import {showAlertWithCallback, showSingleAlert} from '../../config/common';
import NavigationHeader1 from '../../components/NavigationHeaders/NavigationHeader1';

const PAGE_COUNT = 5;

/** Selected Wrapper Component */
const SelectedWrapper = React.memo(
  ({
    item,
    index,
    _OnRemove,
    _OnEdit,
    length,
    currency,
    fontFamilyList,
    props,
  }) => {
    let fontFamily = Constants.Fonts.GIFT_WRAPPER_CAIRO;
    switch (item.favData) {
      case 'Cairo':
        fontFamily = Constants.Fonts.GIFT_WRAPPER_CAIRO;
        break;
      case 'comic-sans':
        fontFamily = Constants.Fonts.GIFT_WRAPPER_COMIC_SANS;
        break;
      case 'Palace Script MT':
        fontFamily = Constants.Fonts.GIFT_WRAPPER_PALACE_SCRIPT;
        break;
      case 'SegoeUI-Light':
        fontFamily = Constants.Fonts.GIFT_WRAPPER_SEGOE;
        break;
    }

    return (
      <TouchableOpacity activeOpacity={1} onPress={() => _OnEdit(item, index)}>
        <View style={Styles.selectedBalloonContainer}>
          <View style={Styles.balloonImg2}>
            <ImageLoader
              source={{
                uri: props.appMediaBaseUrl + item.image,
              }}
              resizeMode={'contain'}
              defaultSource={Images.placeHolderProduct}
              style={{
                width: 43,
                height: 43,
              }}
            />
          </View>
          <View style={{flex: 1}}>
            <Text style={Styles.messageText3}>
              {translate('no_of_products') + ' : '} {item.quantity}
            </Text>
            {item.message && item.message.length > 0 ? (
              <Text style={Styles.priceText1}>
                <Text style={Styles.messageText2}>
                  {translate('Message') + ' : '}
                </Text>
                <Text style={{fontFamily: fontFamily}}>{item.message}</Text>
              </Text>
            ) : (
              <View />
            )}
            <View style={{flexDirection: 'row'}}>
              <Text style={Styles.priceText2}>
                {translate('Gross Total') + '  '}
                {Number(item.price).toFixed(3) + currency}
              </Text>
              <TouchableOpacity
                onPress={() => _OnRemove(item, index)}
                hitSlop={{left: 20, top: 20, bottom: 20, right: 20}}
                style={Styles.trashContainer}>
                <Image source={Images.trash} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {length - 1 !== index && <View style={Styles.underLineStyle2} />}
        {length - 1 == index && (
          <View
            style={{
              height: 20,
              backgroundColor: 'white',
            }}>
            <View style={[Styles.underLineStyle]} />
          </View>
        )}
      </TouchableOpacity>
    );
  },
);

class GiftWrapScreen extends Component {
  constructor(props) {
    super(props);
    this.inputRefs = {};
    this.state = {
      selectedItem: -1,
      selectedWrappers: [],
      selectedWrappersTemp: [],
      favData: 'Cairo',
      fontFamilyList: [
        {
          label: 'Cairo',
          value: Constants.Fonts.GIFT_WRAPPER_CAIRO,
        },
        {
          label: 'comic-sans',
          value: Constants.Fonts.GIFT_WRAPPER_COMIC_SANS,
        },
        {
          label: 'Palace Script MT',
          value: Constants.Fonts.GIFT_WRAPPER_PALACE_SCRIPT,
        },
        {
          label: 'SegoeUI-Light',
          value: Constants.Fonts.GIFT_WRAPPER_SEGOE,
        },
      ],
      selectedFontFamily: Constants.Fonts.GIFT_WRAPPER_CAIRO,
      cardVal: ' ',
      qty: 0,
      maxVal: 200,
      textLength: 0,
      textMessage: '',
      quantity: 1,
      isForgotPasswordShow: false,
      isIncrement: false,
      availableGiftwrappersInState: [],
      selectedCategoryIndex: -1,
    };
  }

  componentDidMount() {
    const {params} = this.props.navigation.state;
    // let param = { addon_type: "5651" };
    let param = {addon_type: 'wrapper'};
    this.props.getAvailableGiftwrap(param, status => {
      if (!status) return;

      setTimeout(() => {
        const {parentDict} = this.props.navigation.state.params;
        const {cartAddOnsArray, availableGiftwraps} = this.props;

        let availableNow = [];
        availableGiftwraps.map(dataItems => {
          let newObj = {...dataItems};
          let productArray = [...dataItems.products];

          // newObj["isLoading"] = false;
          newObj['pageIndex'] = 1;
          newObj['isLoadMore'] =
            productArray.length < PAGE_COUNT ? false : true;

          newObj.products = productArray.slice(0, PAGE_COUNT);
          availableNow.push(newObj);
        });

        this.setState({availableGiftwrappersInState: availableNow});

        let totalWraps = 0;

        let selectedGiftWrapsArray = [];
        if (cartAddOnsArray.length > 0) {
          cartAddOnsArray.map(item => {
            let dataArray =
              item.extension_attributes.custom_options &&
              item.extension_attributes.custom_options.length > 0
                ? item.extension_attributes.custom_options
                : [];

            let parentSKU = '';
            let message = '';
            let font = '';
            let no_of_items = '';
            dataArray.map(itm => {
              let dt = JSON.parse(itm);
              let keys = Object.keys(dt);
              if (keys[0] === 'parent_sku') {
                parentSKU = dt.parent_sku.value;
              } else if (keys[0] === 'message') {
                message = dt.message.value;
              } else if (keys[0] === 'font') {
                font = dt.font.value;
              } else if (keys[0] === 'no_of_items') {
                no_of_items = dt.no_of_items.value;
              }
            });

            if (parentDict.sku === parentSKU) {
              if (
                item.extension_attributes &&
                item.extension_attributes.addons
              ) {
                totalWraps = totalWraps + Number(no_of_items);

                let val = item.extension_attributes.addons;
                if (val === '5651') {
                  // var tmp = availableGiftwraps.filter((bal) => {
                  //   return item.sku === bal.sku;
                  // });

                  var tmp = [];
                  availableGiftwraps.map(subItems => {
                    let tmp2 = subItems.products.filter(bal => {
                      return item.sku === bal.sku;
                    });

                    tmp = tmp2.length > 0 ? tmp2 : tmp;
                  });

                  let gg = [];
                  if (tmp.length > 0)
                    tmp.map(dt => {
                      let newDict = {
                        ...dt,
                        ...{
                          selected: true,
                          quantity: no_of_items,
                          message: message,
                          textLength: message.length,
                          favData: font,
                        },
                      };
                      gg.push(newDict);
                    });

                  if (tmp.length > 0) {
                    selectedGiftWrapsArray = [...selectedGiftWrapsArray, ...gg];
                  }
                }
              }
            }
          });
        }
        this.setState({
          selectedWrappers: selectedGiftWrapsArray,
          selectedWrappersTemp: JSON.parse(
            JSON.stringify(selectedGiftWrapsArray),
          ),
          qty: params.qty - totalWraps,
        });
      }, 500);
    });
  }

  _OnRemove = (item, index) => {
    let selectedWrappers = [...this.state.selectedWrappers];
    selectedWrappers[index].selected = false;
    selectedWrappers = selectedWrappers.filter((_, i) => i !== index);

    showAlertWithCallback(
      translate('removeWrapper'),
      translate('Yes'),
      translate('No'),
      () => {
        this.setState({
          selectedWrappers,
          qty: this.state.qty + Number(item.quantity),
        });
      },
      null,
    );
  };

  _OnEdit = (item, index) => {
    this.setState({
      isForgotPasswordShow: true,
      isEdit: true,
      selectedItem: index,
      textMessage: item.message,
      favData: item.favData,
      textLength: item.textLength,
      quantity: item.quantity,
    });
  };

  _OnIncreament = () => {
    if (this.state.qty > 1) {
      this.state.quantity += 1;
      this.setState({quantity: this.state.quantity, qty: this.state.qty - 1});
    }
  };

  _OnDecreament = () => {
    if (this.state.quantity !== 1) {
      this.state.quantity -= 1;
      this.setState({quantity: this.state.quantity, qty: this.state.qty + 1});
    }
  };

  onSubmit = () => {
    const {isRTL, isLoading, availableGiftwraps} = this.props;
    const {availableGiftwrappersInState} = this.state;

    if (!this.state.isEdit) {
      if (this.state.favData) {
        let selectedCategory =
          availableGiftwrappersInState[this.state.selectedCategoryIndex];

        let selectedItem = selectedCategory.products[this.state.selectedItem];

        let newWrapperItem = Object.assign(
          {
            message: this.state.textMessage,
            textLength: this.state.textLength,
            favData: this.state.favData,
            quantity: this.state.quantity,
          },
          selectedItem,
        );
        let newSelectedWrappers = this.state.selectedWrappers;
        newSelectedWrappers.push(newWrapperItem);
        this.setState({
          selectedWrappers: newSelectedWrappers,
          isForgotPasswordShow: false,
          qty: this.state.qty - 1,
          textMessage: '',
          textLength: 0,
          quantity: 1,
        });
      } else {
      }
    } else {
      let selectedItem = this.state.selectedWrappers[this.state.selectedItem];
      selectedItem.message = this.state.textMessage;
      selectedItem.textLength = this.state.textLength;
      selectedItem.favData = this.state.favData;
      selectedItem.quantity = this.state.quantity;
      let newSelectedWrappers = this.state.selectedWrappers;
      newSelectedWrappers[this.state.selectedItem] = selectedItem;
      this.setState({
        selectedWrappers: newSelectedWrappers,
        isForgotPasswordShow: false,
        textMessage: '',
        textLength: 0,
      });
    }
  };

  //Reset Function
  _handleClear = () => {
    const {params} = this.props.navigation.state;
    this.setState({
      qty: params.qty,
    });

    this.setState({
      selectedWrappers: [],
      favData: 'Cairo',
      selectedFontFamily: Constants.Fonts.GIFT_WRAPPER_CAIRO,
    });
  };

  _handleSave = () => {
    const {userToken, cartId, quoteID, cartAddOnsArray} = this.props;
    const {selectedWrappers, selectedWrappersTemp} = this.state;

    const {parentDict, didGiftWrapUpdated} = this.props.navigation.state.params;

    if (
      JSON.stringify(selectedWrappers) === JSON.stringify(selectedWrappersTemp)
    ) {
      this.props.navigation.pop();
      return;
    }

    let products = [];

    if (cartAddOnsArray.length > 0) {
      cartAddOnsArray.map(item => {
        let dataArray =
          item.extension_attributes.custom_options &&
          item.extension_attributes.custom_options.length > 0
            ? item.extension_attributes.custom_options
            : [];

        let parentSKU = '';
        dataArray.map(itm => {
          let dt = JSON.parse(itm);
          let keys = Object.keys(dt);
          if (keys[0] === 'parent_sku') {
            parentSKU = dt.parent_sku.value;
          }
        });

        if (parentDict.sku === parentSKU) {
          if (item.extension_attributes && item.extension_attributes.addons) {
            let val = item.extension_attributes.addons;
            if (val === '5650') {
              let productOptions = [];
              dataArray.map(itm => {
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

    selectedWrappers.map((item, index) => {
      let productOptions = [
        {
          option_id: item.options.font.id,
          option_value: item.favData,
        },
        {
          option_id: item.options.message.id,
          option_value: item.message,
        },
        {
          option_id: item.options.no_of_items.id,
          option_value: item.quantity,
        },
        {
          option_id: item.options.parent_name.id,
          option_value: parentDict.name,
        },
        {
          option_id: item.options.parent_sku.id,
          option_value: parentDict.sku,
        },
      ];
      let dict = {
        sku: item.sku,
        qty: 1,
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

    this.props.addGiftWraps(params, status => {
      if (status) {
        // let message =
        //   products.length === 0
        //     ? 'GiftWraps updated for "' + parentDict.name + '"'
        //     : 'GiftWraps added for "' + parentDict.name + '"';

        let message =
          selectedWrappers.length === selectedWrappersTemp.length
            ? translate('GiftWraps updated for') + ' "' + parentDict.name + '"'
            : selectedWrappers.length === 0
            ? translate('GiftWraps updated for') + ' "' + parentDict.name + '"'
            : translate('GiftWraps_added_for') + ' "' + parentDict.name + '"';
        showSingleAlert(message, translate('Ok'), () => {
          this.props.navigation.pop();
          didGiftWrapUpdated();
        });
      }
    });
  };

  validateInput = text => {
    this.setState({textLength: text.length, textMessage: text});
  };

  //Header Back Arrow Function
  _didTapOnBackButton = () => {
    this.props.navigation.goBack();
  };

  showInsertModal = (index, indexVal) => {
    this.setState({
      selectedFontFamily: Constants.Fonts.GIFT_WRAPPER_CAIRO,
      isEdit: false,
      isForgotPasswordShow: true,
      selectedItem: index,
      selectedCategoryIndex: indexVal,
      favData: this.state.fontFamilyList[0].value,
    });
  };

  renderAvailableGiftwraps = ({item, index}, productArray, indexVal) => {
    const {availableGiftwraps, currency, appMediaBaseUrl} = this.props;
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
        }}>
        <View style={Styles.balloonImg}>
          <ImageLoader
            source={{
              uri: appMediaBaseUrl + item.image,
            }}
            resizeMode={'contain'}
            style={{
              width: 165,
              height: 165,
            }}
            defaultSource={Images.placeHolderProduct}
          />
          {percentage > 0 && (
            <View
              style={{
                position: 'absolute',
                width: 50,
                height: 20,
                left: 5,
                top: 5,
                backgroundColor: 'rgb(139, 197, 81)',
                borderRadius: 2,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  color: Constants.APP_WHITE_COLOR,
                  fontFamily: Constants.Fonts.REGULAR,
                  fontSize: 9,
                }}>
                {percentage + ' % OFF'}
              </Text>
            </View>
          )}
        </View>
        <View style={Styles.radioButtonContainer}>
          <Text style={Styles.priceText}>
            {Number(item.price).toFixed(3) + currency}
          </Text>
          <TouchableOpacity
            style={Styles.buttonContainer}
            key={item.id}
            onPress={() => {
              if (this.state.qty <= 0) {
                showSingleAlert(translate('giftwrap_MAX'));
              } else {
                // this.state.qty >= 0
                //   ? this.showInsertModal.bind(this, index)
                //   : null;
                this.showInsertModal(index, indexVal);
              }
            }}>
            <Text style={Styles.buttonText}>{translate('Add')}</Text>
            <Image
              source={Images.addressRemove}
              resizeMode={'center'}
              style={{
                transform: [{rotate: '45deg'}],
              }}
            />
          </TouchableOpacity>
        </View>
        {!isInStock && (
          <View style={Styles.overlay}>
            <View style={Styles.outOfStockContainer}>
              <Text style={Styles.outOfStockText}>
                {translate('Out of stock')}
              </Text>
            </View>
          </View>
        )}
      </View>
    );
  };

  _getMoreAddOns = (balloonItem, catIndex) => {
    const {availableGiftwrappersInState} = this.state;
    const {isLoading, currency, availableGiftwraps} = this.props;

    if (balloonItem.isLoading) {
      return;
    }

    if (!balloonItem.isLoadMore) {
      return;
    }

    let dataItems = availableGiftwraps[catIndex];
    let newObj = {...dataItems};
    let productArray = [...dataItems.products];

    let pageIndex = balloonItem.pageIndex;

    let newProductArray = productArray.slice(
      PAGE_COUNT * pageIndex,
      PAGE_COUNT * (pageIndex + 1),
    );

    newObj['isLoading'] = false;
    newObj['pageIndex'] = 1 + pageIndex;
    newObj['isLoadMore'] = newProductArray.length < PAGE_COUNT ? false : true;

    newObj.products = [...balloonItem.products, ...newProductArray];

    availableGiftwrappersInState[catIndex] = newObj;

    this.setState({availableGiftwrappersInState});
  };

  render() {
    const {
      isForgotPasswordShow,
      selectedFontFamily,
      fontFamilyList,
      availableGiftwrappersInState,
    } = this.state;
    const {isRTL, isLoading, availableGiftwraps, currency} = this.props;
    const {selectedWrappers} = this.state;
    const {params} = this.props.navigation.state;
    let totalPrice = 0;
    selectedWrappers.forEach(item => {
      totalPrice += item.price;
    });
    return (
      <SafeAreaView style={Styles.container}>
        <NavigationHeader1
          // hideBottomLine
          title={translate('Select Wrapper')}
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
          style={{backgroundColor: 'rgb(249,249,249)', flex: 1}}
          showsVerticalScrollIndicator={false}>
          <View style={{flex: 1}}>
            {/* <FlatList
            data={availableGiftwraps}
            renderItem={this.renderAvailableGiftwraps}
            keyExtractor={(item) => item.id + item.name}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
          /> */}
            {availableGiftwrappersInState.length > 0 &&
              availableGiftwrappersInState.map((balloonItem, indexVal) => {
                return (
                  <View>
                    <Text style={Styles.sectionTitle}>
                      {balloonItem.category}
                    </Text>
                    <FlatList
                      data={balloonItem.products}
                      renderItem={({item, index}) =>
                        this.renderAvailableGiftwraps(
                          {item, index},
                          balloonItem.products,
                          indexVal,
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
            {/* <View style={Styles.underLineStyle2} /> */}
            <View style={{height: 20}}>
              <Text style={Styles.remainingItem}>
                {this.state.qty}{' '}
                {this.state.qty != 1
                  ? translate('items remaining')
                  : translate('item remaining')}
              </Text>
            </View>
            {selectedWrappers != '' ? (
              <View>
                <FlatList
                  data={selectedWrappers}
                  style={{
                    backgroundColor: constants.APP_WHITE_COLOR,
                    marginTop: 30,
                  }}
                  renderItem={({item, index}) => (
                    <SelectedWrapper
                      item={item}
                      index={index}
                      _OnRemove={() => this._OnRemove(item, index)}
                      _OnEdit={() => {
                        //this._OnEdit(item, index)}
                      }}
                      length={selectedWrappers.length}
                      currency={currency}
                      fontFamilyList={fontFamilyList}
                      props={this.props}
                    />
                  )}
                  keyExtractor={item => item.id + item.name}
                  horizontal={false}
                  showsVerticalScrollIndicator={false}
                />
                <View style={{backgroundColor: constants.APP_WHITE_COLOR}}>
                  <View style={Styles.totalCostContainer}>
                    <Text style={Styles.totalCostText}>
                      {translate('TOTAL COST') + ' :'}
                    </Text>

                    <Text style={Styles.totalPriceText}>
                      {totalPrice.toFixed(3) + currency}
                    </Text>
                  </View>
                  <View style={{height: 20, backgroundColor: 'white'}}>
                    <View style={Styles.underLineStyle} />
                  </View>
                  <View
                    style={{
                      height: 20,
                      backgroundColor: 'white',
                      width: '100%',
                    }}
                  />
                </View>
              </View>
            ) : null}
          </View>
        </ScrollView>
        <FooterButton
          buttonText1={translate('Clear').toUpperCase()}
          buttonText2={translate('SAVE')}
          onButton1Click={this._handleClear}
          onButton2Click={this._handleSave}
          screenWidth={this.props.screenWidth}
        />
        <Modal
          isVisible={isForgotPasswordShow}
          onBackdropPress={() =>
            this.setState({
              isForgotPasswordShow: false,
              quantity: 1,
              qty: this.props.navigation.state.params.qty,
            })
          }
          backdropOpacity={0.6}
          onBackButtonPress={() =>
            this.setState({isForgotPasswordShow: false})
          }>
          <View style={Styles.cardModalWrapper}>
            <View style={Styles.cardWrapper}>
              <View style={{flexDirection: 'row'}}>
                <Text style={Styles.cardText}>{translate('CARD')}</Text>

                <TouchableOpacity
                  onPress={() => this.setState({isForgotPasswordShow: false})}
                  style={Styles.closeButtonView}
                  hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
                  <Image
                    source={Images.modalClose}
                    style={{width: 15, height: 15}}
                  />
                </TouchableOpacity>
              </View>
              <View style={Styles.underLineStyle1} />
              {this.props.navigation.state.params.qty > 1 ||
              this.state.qty > 1 ? (
                <View style={Styles.noOfProductsContainer}>
                  <Text style={Styles.noOfWraps}>
                    {translate('no_of_products')}
                  </Text>
                  <View style={Styles.increamentWrap}>
                    <TouchableOpacity
                      onPress={() => this._OnDecreament()}
                      hitSlop={{top: 5, bottom: 5, left: 5, right: 5}}
                      style={Styles.decrementContainer}>
                      <Text style={Styles.decrementText}>|</Text>
                    </TouchableOpacity>
                    <TextInput
                      style={Styles.countNum}
                      value={
                        this.state.quantity && this.state.quantity.toString()
                      }
                    />
                    <TouchableOpacity
                      onPress={() => this._OnIncreament()}
                      hitSlop={{top: 5, bottom: 5, left: 5, right: 5}}
                      style={Styles.incrementContainer}>
                      <Text style={Styles.incrementText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <View style={{paddingTop: 20}} />
              )}
              <View
                style={{
                  borderWidth: 1,
                  borderColor: 'gray',
                  marginHorizontal: 20,
                  borderRadius: 5,
                  // alignItems: 'center',
                  justifyContent: 'center',
                }}>
                {Constants.IS_ANDROID && (
                  <Text
                    style={{
                      position: 'absolute',
                      fontFamily: this.state.selectedFontFamily,
                      fontSize: 14,
                      marginHorizontal: 10,
                    }}>
                    {this.state.selectedFontFamily}
                  </Text>
                )}
                <Picker
                  ref={el => {
                    this.inputRefs.picker = el;
                  }}
                  // style={{
                  //   ...(isRTL ? pickerSelectStyles1 : pickerSelectStyles),
                  // }}
                  selectedValue={this.state.selectedFontFamily}
                  onValueChange={(itemValue, index) =>
                    this.setState({
                      favData: fontFamilyList[index].label,
                      selectedFontFamily: itemValue,
                    })
                  }>
                  {this.state.fontFamilyList.map(it => (
                    <Picker.Item label={it.label} value={it.value} />
                  ))}
                  {/* <Picker.Item label="Java" value="java" />
                <Picker.Item label="JavaScript" value="js" /> */}
                </Picker>
              </View>

              {/* <RNPickerSelect
                // placeholder={{
                //   label: "Select a data...",
                //   value: null,
                // }}
                placeholder={{}}
                items={this.state.fontFamilyList}
                onValueChange={(value, index) => {
                  this.setState({
                    favData: fontFamilyList[index].label,
                    selectedFontFamily: value,
                  });
                }}
                onUpArrow={() => {
                  // this.inputRefs.name.focus();
                }}
                onDownArrow={() => {
                  // this.inputRefs.picker2.togglePicker();
                }}
                style={{
                  ...(isRTL ? pickerSelectStyles1 : pickerSelectStyles),
                }}
                textInputProps={{ fontFamily: selectedFontFamily }}
                // value={this.state.favData}
                ref={(el) => {
                  this.inputRefs.picker = el;
                }}
                useNativeAndroidPickerStyle={false} //android only
                hideIcon={true}
                Icon={() => {
                  return (
                    <Image
                      style={{
                        transform: [{ rotate: "90deg" }],
                        position: "absolute",
                        right: 35,
                        top: 17,
                      }}
                      tintColor={constants.APP_GRAY_COLOR}
                      source={Images.arrowRight}
                    />
                  );
                }}
              /> */}
              <View
                style={{
                  marginHorizontal: 20,
                  marginTop: 20,
                }}>
                <TextInput
                  value={this.state.textMessage}
                  multiline={true}
                  numberOfLines={4}
                  onChangeText={text => {
                    this.validateInput(text);
                  }}
                  placeholder={translate('message')}
                  ref={input => {
                    this.textInput = input;
                  }}
                  maxLength={200}
                  returnKeyType={'next'}
                  style={[
                    Styles.text_input_style_textarea,
                    {
                      textAlign: isRTL ? 'right' : 'left',
                      fontFamily: selectedFontFamily,
                    },
                  ]}
                />
                <Text style={Styles.lettermax}>
                  {this.state.maxVal - this.state.textLength}{' '}
                  {translate('letters maximum')}
                </Text>
              </View>
              <View style={{paddingHorizontal: 100}}>
                <TouchableOpacity
                  style={[Styles.submitButtonStyle]}
                  activeOpacity={0.7}
                  onPress={() => {
                    this.onSubmit();
                  }}>
                  <Text style={Styles.submitText}>{translate('SAVE')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        {isLoading && <HudView />}
      </SafeAreaView>
    );
  }
}

export default GiftWrapScreen;

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontFamily: constants.Fonts.REGULAR,
    fontSize: 16,
    paddingTop: 13,
    paddingHorizontal: 15,
    paddingBottom: 12,
    borderWidth: 1,
    borderColor: 'rgb(154,154,154)',
    borderRadius: 4,
    backgroundColor: 'white',
    color: 'rgb(109,109,109)',
    marginHorizontal: 20,
    textAlign: 'left',
  },
  inputAndroid: {
    fontFamily: constants.Fonts.REGULAR,
    fontSize: 16,
    paddingTop: 13,
    paddingHorizontal: 15,
    paddingBottom: 12,
    borderWidth: 1,
    borderColor: 'rgb(154,154,154)',
    borderRadius: 4,
    backgroundColor: 'white',
    color: 'rgb(109,109,109)',
    marginHorizontal: 20,
    textAlign: 'left',
  },
});

const pickerSelectStyles1 = StyleSheet.create({
  inputIOS: {
    fontFamily: constants.Fonts.REGULAR,
    fontSize: 16,
    paddingTop: 13,
    paddingHorizontal: 15,
    paddingBottom: 12,
    borderWidth: 1,
    borderColor: 'rgb(154,154,154)',
    borderRadius: 4,
    backgroundColor: 'white',
    color: 'rgb(109,109,109)',
    marginHorizontal: 20,
    textAlign: 'right',
  },
  inputAndroid: {
    fontFamily: constants.Fonts.REGULAR,
    fontSize: 16,
    paddingTop: 13,
    paddingHorizontal: 15,
    paddingBottom: 12,
    borderWidth: 1,
    borderColor: 'rgb(154,154,154)',
    borderRadius: 4,
    backgroundColor: 'white',
    color: 'rgb(109,109,109)',
    marginHorizontal: 20,
    textAlign: 'right',
  },
});

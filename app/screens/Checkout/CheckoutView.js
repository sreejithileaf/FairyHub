/**
 * Created by Jebin for iLeaf Solutions Pvt.Ltd
 * on March 18, 2020
 * Checkout - Handles all checkout operation with UI
 */

import {
  View,
  Text,
  Image,
  FlatList,
  AppState,
  TextInput,
  BackHandler,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import moment from 'moment';
import styles from './styles';
import Modal from 'react-native-modal';
import Images from '../../config/images';
import HudView from '../../components/hudView';
import Constants from '../../config/constants';
import React, {Component, memo} from 'react';
import {WebView} from 'react-native-webview';
import CartCard from '../../components/CartCard/CartCard';
import {ScrollView} from 'react-native-gesture-handler';
import ItemFooter from '../../components/ItemFooter/ItemFooter';
import {translate} from '../../config/languageSwitching/index';
import FooterButton from '../../components/FooterButton/FooterButton';
import {
  showSingleAlert,
  showAlertWithCallback,
  addEventTracking,
  addRevenueTracking,
} from '../../config/common';
import NavigationHeader1 from '../../components/NavigationHeaders/NavigationHeader2';
import NavigationHeader from '../../components/NavigationHeaders/NavigationHeader1';
import analytics from '@react-native-firebase/analytics';
import * as Sentry from '@sentry/react-native';
import PaymentScreen from './PaymentScreen';

var isPaymentUpdating = false;
var retryCount = 0;
var isMyFatoorahPaymentUpdating = false;

const CategoryCell = memo(
  ({
    item,
    index,
    addProductToWishList,
    currency,
    totalCost,
    isRTL,
    navigation,
    productsAges,
    productsAgeGroups,
    productsBrands,
    productsGenders,
    deliveryTime,
    holidaysInWeek,
    holidays,
    execptionalHolidays,
    maxDaysToBook,
    completeHolidays,
    newDate,
    updateCartDateTime,
    sameDayDeliveryTime,
    availableNextDay,
    availableMaxDay,
    props,
    updatedDeliveryDateTime,
    updateDeliveryDateTime,
  }) => {
    return (
      <View key={index + 'chkotVw'} style={styles.itemContainer}>
        <CartCard
          isFromCheckout={true}
          key={index + 'chkot'}
          data={item}
          currency={currency}
          productsAges={productsAges}
          productsAgeGroups={productsAgeGroups}
          productsBrands={productsBrands}
          productsGenders={productsGenders}
          cartAddOnsArray={props.cartAddOnsArray}
          navigation={navigation}
          appMediaBaseUrl={props.appMediaBaseUrl}
          didTapOnItem={() =>
            props.navigation.push('ProductDetail', {
              sku: item.sku,
              isFromCartScreen: true,
            })
          }
        />
        {item.product_type !== 'virtual' ? (
          <ItemFooter
            key={index + 'chkotFooter'}
            data={item}
            navigation={navigation}
            isRTL={isRTL}
            deliveryTime={deliveryTime}
            holidaysInWeek={holidaysInWeek}
            holidays={holidays}
            execptionalHolidays={execptionalHolidays}
            maxDaysToBook={maxDaysToBook}
            sameDayDeliveryTime={sameDayDeliveryTime}
            completeHolidays={completeHolidays}
            newDate={newDate}
            updateCartDateTime={updateCartDateTime}
            availableNextDay={availableNextDay}
            availableMaxDay={availableMaxDay}
            props={props}
            itemIndex={index}
            updatedDeliveryDateTime={
              updatedDeliveryDateTime && updatedDeliveryDateTime[index]
            }
            dateTimeUpdated={info => {
              updateDeliveryDateTime(info, index);
            }}
          />
        ) : (
          <View style={{height: 5}} />
        )}
      </View>
    );
  },
);

class CheckoutView extends Component {
  constructor(props) {
    super(props);
    let isFromProductDetail = props.navigation.state.params.isFromProductDetail;

    this.state = {
      deliveryAddressDict: {},
      billingAddressDict: {},
      totalCostDict: null,
      nowDate: new Date(),
      newDate: moment().format('DD-MM-YYYY'),
      voucherCode: '',
      isVoucherApplied: false,
      mCartList: '',
      mGuestcartList: '',
      paymentMethods: [],
      checked: -1,
      totalCostBeforeDiscount: 0,
      totalCostAfterDiscount: 0,
      cartTotalDiscount: 0,
      deliveryTimeArray: [],
      holidaysInWeek: [],
      holidays: {},
      execptionalHolidays: [],
      maxDaysToBook: '',
      completeHolidays: {},
      isFromProductDetail,
      shippingAmount: 0,
      sameDayDeliveryTime: '',
      availableNextDay: '',
      availableMaxDay: '',
      isOpenPaymentView: false,
      paymentUrl: '',
      loaderVisible: false,
      paymentSuccessUrl: '',
      paymentFailedUrl: '',
      appState: AppState.currentState,
      timeToGoBackground: new Date(),
      isDeliveryNoteViewShow: false,
      deliveryNoteInState: '',
      deliveryNoteTemp: '',
      updatedDeliveryDateTime: {},
      orderId: '',
      isAddOnsIncluded: false,
      isShowPaymentView: false,
      savedCardInfo: null,
      guestTokenTemp: '',

      paymentParams: null,
      myFatoorahSessionID: '',
      isMyFatoorahPaymentView: false,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    // console.log("========nxt===============", nextProps.cartTotals);
    // console.log("==========prv=============", prevState.totalCostDict);

    // let grandTotlaFilterResultNew = nextProps.cartTotals.total_segments.filter(
    //   (obj) => {
    //     return obj.code === "grand_total";
    //   }
    // );
    // let grandTotlaFilterResultOld = prevState.totalCostDict
    //   ? prevState.totalCostDict.total_segments.filter((obj) => {
    //       return obj.code === "grand_total";
    //     })
    //   : [];

    if (nextProps.cartTotals) {
      // grandTotlaFilterResultOld.length == 0 ||
      // grandTotlaFilterResultNew[0].value != grandTotlaFilterResultOld[0].value
      const {userToken, cartList, guestcartList} = nextProps;
      let totalCostDict = nextProps.cartTotals;
      let totalCostBeforeDiscount = 0;
      let totalCostAfterDiscount = 0;
      let cartTotalDiscount = 0;
      let shippingAmount = 0;
      let isVoucherApplied = false;
      let voucherCode = '';

      if (totalCostDict && totalCostDict.total_segments) {
        let subTotalFilterResult = totalCostDict.total_segments.filter(obj => {
          return obj.code === 'subtotal';
        });
        totalCostBeforeDiscount =
          subTotalFilterResult.length > 0 ? subTotalFilterResult[0].value : 0;

        let grandTotlaFilterResult = totalCostDict.total_segments.filter(
          obj => {
            return obj.code === 'grand_total';
          },
        );
        totalCostAfterDiscount =
          grandTotlaFilterResult.length > 0
            ? grandTotlaFilterResult[0].value
            : 0;

        let cartTotlaFilterResult = totalCostDict.total_segments.filter(obj => {
          return obj.code === 'discount';
        });

        cartTotalDiscount =
          cartTotlaFilterResult.length > 0 ? cartTotlaFilterResult[0].value : 0;

        let shippingFilterResult = totalCostDict.total_segments.filter(obj => {
          return obj.code === 'shipping';
        });
        shippingAmount =
          shippingFilterResult.length > 0 ? shippingFilterResult[0].value : 0;

        const cartData = userToken.length > 0 ? cartList : guestcartList;

        cartData.map(cartItem => {
          let offerAmount = 0;
          let finalPrice = cartItem.price;
          let actualPrice = cartItem.extension_attributes.original_price;
          offerAmount = (actualPrice - finalPrice) * cartItem.qty;
          totalCostBeforeDiscount = totalCostBeforeDiscount + offerAmount;
        });

        totalCostBeforeDiscount = Number(totalCostBeforeDiscount).toFixed(3);
      }

      if (
        totalCostDict &&
        totalCostDict.extension_attributes &&
        totalCostDict.extension_attributes.discounts &&
        totalCostDict.extension_attributes.discounts.length > 0
      ) {
        let discountArray = totalCostDict.extension_attributes.discounts;
        let dt = JSON.parse(discountArray[0]);
        if (dt && dt.code) {
          voucherCode = dt.code && dt.code[0].code;
          isVoucherApplied = true;
        }
      }

      return {
        totalCostDict: nextProps.cartTotals,
        totalCostWithoutDiscount: totalCostDict.base_grand_total,
        totalCostBeforeDiscount,
        totalCostAfterDiscount,
        cartTotalDiscount,
        shippingAmount,
        isVoucherApplied,
        // voucherCode,
      };
    } else return null;
  }

  componentDidMount() {
    const {
      addressList,
      cartList,
      userToken,
      guestcartList,
      guestToken,
      cartID,
    } = this.props;
    this._updateAddressInfo();
    this.setState({mCartList: cartList});
    this.setState({mGuestcartList: guestcartList});
    this.props.getDeliveryDateAndTIme(this._getDeliveryDateCallback);

    this.setState({guestTokenTemp: guestToken});

    addEventTracking('giwvka');

    analytics()
      .logEvent('checkout_screen')
      .then(rsp => {
        console.log('VIEW CHECKOUT SCREEN SUCCESS-----', rsp);
      })
      .catch(error => {
        console.log('ERROR@@@@', error);
      });

    AppState.addEventListener('change', this._handleAppStateChange);

    if (this.props.cartAddOnsArray.length > 0) {
      this.setState({isAddOnsIncluded: true});
    }

    // this.backHandler = BackHandler.addEventListener(
    //   "hardwareBackPress",
    //   this.backAction
    // );
    console.log('UPD', isMyFatoorahPaymentUpdating);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
    // this.backHandler.remove();
  }

  // backAction = () => {
  //   return true;
  // };

  _handleAppStateChange = nextAppState => {
    if (nextAppState === 'background' || nextAppState === 'inactive') {
      this.setState({timeToGoBackground: new Date()});
    }

    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      const ONE_HOUR = 1000 * 60 * 60;
      if (new Date() - this.state.timeToGoBackground > ONE_HOUR) {
        this.props.navigation.navigate('Home');
      }
    }
    this.setState({appState: nextAppState});
  };

  _updateAddressInfo = () => {
    const {addressList, userToken, guestAddressList} = this.props;
    let defaultBillingAddress = null;
    let defaultShippingAddress = null;

    if (addressList && addressList.length > 0) {
      addressList.map(item => {
        if (item.default_billing) {
          defaultBillingAddress = item;
        }
        if (item.default_shipping) {
          defaultShippingAddress = item;
        }
      });
    } else {
      guestAddressList.map(item => {
        if (item.default_billing) {
          defaultBillingAddress = item;
        }
        if (item.default_shipping) {
          defaultShippingAddress = item;
        }
      });
    }

    this.setState(
      {
        deliveryAddressDict: defaultShippingAddress,
        billingAddressDict: defaultBillingAddress,
      },
      () => {
        if (defaultShippingAddress && defaultBillingAddress) {
          this._setShippingAddress();
        }
      },
    );
  };

  _getDeliveryDateCallback = (status, response) => {
    if (status) {
      let exceptionalHolidays = [];
      let completeHolidays = {};
      let timeArray =
        response && response.length > 0 ? response[1].delivery_times : [];
      this.setState({
        deliveryTimeArray: timeArray,
        holidays: response[2].holidays,
        holidaysInWeek: response[0].general.config.days_week,
        maxDaysToBook: response[0].general.config.max_days,
        sameDayDeliveryTime: response[0].general.config.time_same_day,
        dateIntervals: response[0].general.config.dintervals,
      });

      const exceptHoliday = response[3].workingdays;
      let aaa = {
        ...this.getDisabledDates(),
        ...this.getHolidayDates(),
      };

      if (exceptHoliday.length > 0) {
        exceptHoliday.map(days => {
          let workDates = `${days.year}-${String(days.month).padStart(
            2,
            '0',
          )}-${String(days.day).padStart(2, '0')}`;
          exceptionalHolidays.push(workDates);
        });
        exceptionalHolidays.map(holi => {
          delete aaa[holi];
        });
      }

      this.setState({completeHolidays: aaa}, () => {
        this._updateDateAndTime();
      });
    } else {
      this.props.navigation.goBack();
    }
  };

  _updateDateAndTime = () => {
    const {cartList, guestcartList, userToken, guestToken} = this.props;
    const {
      completeHolidays,
      deliveryTimeArray,
      sameDayDeliveryTime,
      maxDaysToBook,
    } = this.state;
    let cartData = userToken.length > 0 ? cartList : guestcartList;

    let invalidDatesArray = Object.keys(completeHolidays);

    var filtered = [];
    let increment = 1;
    let availableNextDay = '';
    do {
      availableNextDay = moment(new Date(), 'YYYY-MM-DD')
        .add(increment, 'days')
        .format('YYYY-MM-DD');
      filtered = invalidDatesArray.filter(function (dateItem) {
        return availableNextDay === dateItem;
      });
      increment++;
    } while (filtered.length !== 0);

    let maxDay = moment(new Date(), 'YYYY-MM-DD')
      .add(maxDaysToBook, 'days')
      .format('YYYY-MM-DD');
    this.setState({availableNextDay, availableMaxDay: maxDay});

    let cart_item = [];
    cartData.map(item => {
      let isSameDayDelivery =
        item.extension_attributes.delivery_type === '5576';
      let isScheduledDelivery =
        item.extension_attributes.delivery_type === '5615';

      let localTime = moment
        .utc(sameDayDeliveryTime)
        .local()
        .format('YYYY-MM-DD HH:mm:ss');
      let isSameDayDeliveryTimeOver = moment().isAfter(localTime);

      let today = moment(new Date(), 'YYYY-MM-DD').format('YYYY-MM-DD');
      let sameDayFiltered = invalidDatesArray.filter(function (dateItem) {
        return today === dateItem;
      });

      if (sameDayFiltered.length > 0) {
        isSameDayDeliveryTimeOver = true;
      }

      let dict = {};
      if (isSameDayDelivery && !isSameDayDeliveryTimeOver) {
        dict = {
          item_id: item.item_id,
          sku: item.sku,
          delivery: 'sameday',
          time_slot: '',
        };
        cart_item.push(dict);
      } else if (!isScheduledDelivery) {
        dict = {
          item_id: item.item_id,
          sku: item.sku,
          delivery: availableNextDay,
          time_slot: this._makeTimeString(deliveryTimeArray[0]),
        };
        cart_item.push(dict);
      }
    });

    let cartDict = {};
    if (userToken.length > 0) {
      cartDict = {
        cart_item: cart_item,
      };
    } else {
      cartDict = {
        cart_item: {
          quote_id: guestToken,
          items: cart_item,
        },
      };
    }

    if (cart_item.length == 0) return;
    this.props.updateCartDateTime(cartDict);
  };

  getDisabledDates = () => {
    const {maxDaysToBook} = this.state;
    const current_year = moment().format('YYYY');
    let d1 = new Date();
    let d2 = new Date(Number(current_year) + 1, 0, 31);
    let disabledDates = {};
    if (d1 > d2) return false;
    let date = d1;
    let holiday_week = this.state.holidaysInWeek;
    let maxDay = moment(new Date(), 'YYYY-MM-DD').add(maxDaysToBook, 'days');

    while (date < d2 && date <= maxDay) {
      if (
        date.getDay() === holiday_week[0] ||
        date.getDay() === holiday_week[1] ||
        date.getDay() === holiday_week[2] ||
        date.getDay() === holiday_week[3]
      )
        disabledDates[moment(date).format('YYYY-MM-DD')] = {disabled: true};
      date.setDate(date.getDate() + 1);
    }

    let dateIntervals = this.state.dateIntervals;
    dateIntervals.map(item => {
      let fromDateDict = item.from;
      let toDateDict = item.to;
      let fromDate = '';
      let toDate = '';

      if (fromDateDict.year === '0' && fromDateDict.month !== '0') {
        fromDate = `${current_year}-${String(fromDateDict.month).padStart(
          2,
          '0',
        )}-${String(fromDateDict.day).padStart(2, '0')}`;
      } else if (item.year === '0' && item.month === '0') {
      } else {
        fromDate = `${fromDateDict.year}-${String(fromDateDict.month).padStart(
          2,
          '0',
        )}-${String(fromDateDict.day).padStart(2, '0')}`;
      }

      if (toDateDict.year === '0' && toDateDict.month !== '0') {
        toDate = `${current_year}-${String(toDateDict.month).padStart(
          2,
          '0',
        )}-${String(toDateDict.day).padStart(2, '0')}`;
      } else if (item.year === '0' && item.month === '0') {
      } else {
        toDate = `${toDateDict.year}-${String(toDateDict.month).padStart(
          2,
          '0',
        )}-${String(toDateDict.day).padStart(2, '0')}`;
      }

      var now = moment(fromDate),
        dates = [];
      while (now.isSameOrBefore(moment(toDate))) {
        dates.push(now.format('YYYY-MM-DD'));
        if (now <= maxDay) {
          disabledDates[now.format('YYYY-MM-DD')] = {disabled: true};
        }
        now.add(1, 'days');
      }
    });
    return disabledDates;
  };

  getHolidayDates = () => {
    let completeMonths = [];
    let disabledDates = {};
    let currentYear = moment().format('YYYY');
    let holDate;
    if (this.state.holidays.length > 0) {
      this.state.holidays.map(item => {
        if (item.year === '0' && item.month !== '0') {
          holDate = `${currentYear}-${String(item.month).padStart(
            2,
            '0',
          )}-${String(item.day).padStart(2, '0')}`;
          if (moment(holDate) > moment()) completeMonths.push(holDate);
          let nextYear = Number(currentYear) + 1;
          let holDate2 = `${nextYear}-${String(item.month).padStart(
            2,
            '0',
          )}-${String(item.day).padStart(2, '0')}`;
          completeMonths.push(holDate2);
        } else if (item.year === '0' && item.month === '0') {
          for (let i = 1; i < 13; i++) {
            holDate = `${currentYear}-${String(i).padStart(2, '0')}-${String(
              item.day,
            ).padStart(2, '0')}`;
            if (moment(holDate) > moment()) completeMonths.push(holDate);
          }
          let nextYear = Number(currentYear) + 1;
          for (let i = 1; i < 2; i++) {
            let holDate3 = `${nextYear}-${String(i).padStart(2, '0')}-${String(
              item.day,
            ).padStart(2, '0')}`;
            completeMonths.push(holDate3);
          }
        } else {
          holDate = `${item.year}-${String(item.month).padStart(
            2,
            '0',
          )}-${String(item.day).padStart(2, '0')}`;
          if (moment(holDate) > moment()) completeMonths.push(holDate);
        }
      });
      completeMonths.map(months => {
        disabledDates[months] = {disabled: true};
      });

      return disabledDates;
    }
  };

  _commonTotalPriceUpdate = () => {
    this.props.getTotalCost(totalCostDict => {});
  };

  _changeGuestAddress = address => {
    this.props.navigation.push('GuestAddAddress', {
      details: address,
      edit: true,
      isGuestUser: true,
      guestAddressUpdateCallback: () => this._updateAddressInfo(),
    });
  };

  _makeTimeString = item => {
    let startTime;
    let startStr = item.time_from.substring(0, 2);
    if (Number(startStr) > 12) {
      startTime = Number(startStr) - 12 + ':00 pm';
    } else if (Number(startStr) == 12) {
      startTime = Number(startStr) + ':00 pm';
    } else {
      startTime = Number(startStr) + ':00 am';
    }
    let endTime;
    let endStr = item.time_to.substring(0, 2);
    if (Number(endStr) > 12) {
      endTime = Number(endStr) - 12 + ':00 pm';
    } else if (Number(endStr) == 12) {
      endTime = Number(endStr) + ':00 pm';
    } else {
      endTime = Number(endStr) + ':00 am';
    }
    return startTime + ' - ' + endTime;
  };

  _didTapOnAddAddress = () => {
    const {userToken} = this.props;
    if (userToken.length > 0) {
      this.props.navigation.navigate('AddressListScreen', {
        didSelectUserUpdateAddress: this._didSelectUserUpdateAddress,
      });
    } else {
      this.props.navigation.navigate('AddAddressScreen', {
        details: this.state.deliveryAddressDict,
        isFromGuestCheckout: true,
        addAddressCallback: this._addAddressCallback,
      });
    }
  };

  _addAddressCallback = deliveryAddressDict => {
    this.setState({deliveryAddressDict}, () => {
      this._setShippingAddress();
    });
  };

  _didSelectUserUpdateAddress = () => {
    this._updateAddressInfo();
  };

  _setShippingAddress = () => {
    const {deliveryAddressDict, billingAddressDict} = this.state;
    const {userToken, guestInfo, userInfo} = this.props;
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
        shipping_method_code: 'flatrate',
        shipping_carrier_code: 'flatrate',
      },
    };
    this.props.setShipmentInfo(params, this._setShippingAddressCallback);
  };

  _setShippingAddressCallback = (status, responseData, savedCard) => {
    const {userToken, guestInfo, isRTL, cartID, guestToken} = this.props;
    if (status) {
      const paymentMethodsArray = responseData.payment_methods;

      if (paymentMethodsArray.length > 0) {
        this.setState({
          paymentMethods: paymentMethodsArray,
          checked: 0,
          savedCardInfo: savedCard,
        });
      } else {
        showSingleAlert(translate('API_Failed'), translate('Ok'), () => {
          this.props.navigation.goBack();
        });
      }
    } else {
      showSingleAlert(translate('shipping address error'));
    }
  };

  _didTapOnPaymentMethod = item => {
    //TODO: payment tap
  };

  _didOpenCompletionPage = orderId => {
    const {
      deliveryAddressDict,
      billingAddressDict,
      totalCostDict,
      mCartList,
      mGuestcartList,
      shippingAmount,
    } = this.state;
    const {userToken} = this.props;
    let itemArray = userToken.length > 0 ? mCartList : mGuestcartList;

    this.props.navigation.navigate('OrderCompletion', {
      deliveryAddressDict: deliveryAddressDict,
      billingAddressDict: billingAddressDict,
      totalCostDict: totalCostDict,
      itemArray: itemArray,
      shippingAmount: shippingAmount,
      paymentMode: 'Cash on delivery',
      orderId: orderId,
    });
  };

  _didTapOnPlaceOrder = () => {
    const {
      deliveryAddressDict,
      checked,
      paymentMethods,
      billingAddressDict,
      deliveryNoteInState,
      myFatoorahSessionID,
      isMyFatoorahPaymentView,
    } = this.state;
    const {
      userToken,
      guestInfo,
      userInfo,
      cartID,
      guestToken,
      guestcartList,
      cartList,
    } = this.props;
    isMyFatoorahPaymentUpdating = false;
    let cartData = userToken.length > 0 ? cartList : guestcartList;

    // this._didOpenCompletionPage(11085); //51//54//372//363
    // return;

    let isAnyOutOfStock = false;
    cartData.map(cartItem => {
      let extension_attributes = cartItem.extension_attributes;

      if (
        extension_attributes &&
        ((extension_attributes.qty && Number(extension_attributes.qty) <= 0) ||
          (extension_attributes.is_in_stock &&
            Number(extension_attributes.is_in_stock) !== 1))
      ) {
        isAnyOutOfStock = true;
      }
    });

    if (isAnyOutOfStock) {
      showSingleAlert(
        translate('one or mpre products are out of stock place order'),
      );
      return;
    }

    if (!deliveryAddressDict) {
      showSingleAlert(translate('Please add your address'));
      return;
    }

    if (!billingAddressDict) {
      showSingleAlert(translate('Please add your billing address'));
      return;
    }

    if (checked < 0) {
      showSingleAlert(translate('Please select any payment method'));
      return;
    }

    this.props.getProuctsInCart(response => {
      let cartData = response; //userToken.length > 0 ? cartList : guestcartList;

      let isAnyOutOfStock = false;
      let requestedQuantityNotAvailable = false;
      cartData.map(cartItem => {
        let extension_attributes = cartItem.extension_attributes;
        if (
          extension_attributes &&
          ((extension_attributes.qty &&
            Number(extension_attributes.qty) <= 0) ||
            (extension_attributes.is_in_stock &&
              Number(extension_attributes.is_in_stock) !== 1))
        ) {
          isAnyOutOfStock = true;
        } else if (
          extension_attributes &&
          extension_attributes.qty &&
          Number(extension_attributes.qty) < cartItem.qty
        ) {
          requestedQuantityNotAvailable = true;
        }
      });

      if (isAnyOutOfStock) {
        showSingleAlert(translate('one or mpre products are out of stock'));
        setTimeout(() => {
          this.props.navigation.navigate('Cart');
        }, 500);
        return;
      }

      if (requestedQuantityNotAvailable) {
        showSingleAlert(translate('req qty not available'));
        setTimeout(() => {
          this.props.navigation.navigate('Cart');
        }, 500);
        return;
      }

      let paymentOption = paymentMethods[checked];
      if (paymentOption.paymentMethodId === 'cashondelivery') {
        // {
        //   paymentMethod: { method: paymentOption.paymentMethodId },
        // },
        let params = {
          quote_id: userToken.length > 0 ? cartID : guestToken,
          method: paymentOption.paymentMethodId,
          reference: Constants.IS_ANDROID ? 'android' : 'ios',
          order_comment: deliveryNoteInState,
        };

        this.props.placeOrderWithCOD(params, this._orderPlacedCallback);
      } else if (paymentOption.IsEmbeddedSupported === false) {
        this._getPaymentUrl(paymentOption);
      } else {
        // this.setState({isShowPaymentView: true});

        let params = {
          quote_id: userToken.length > 0 ? cartID : guestToken,
        };
        this.props.createMyFatoorahSession(params, (status, dict) => {
          console.log('callback', dict);
          if (dict && dict.isCartError) {
            this.props.navigation.navigate('Home');
            return;
          }
          if (dict && dict.SessionId) {
            console.log('SESSION ID ', dict);
            this.setState({
              myFatoorahSessionID: dict.SessionId,
              isMyFatoorahPaymentView: true,
            });
          }
        });
      }
    });
  };

  _orderPlacedCallback = (status, orderId) => {
    const {paymentMethods, checked} = this.state;
    isPaymentUpdating = false;
    let paymentOption = paymentMethods[checked];
    if (status) {
      showSingleAlert(
        translate('Order placed Successfully'),
        translate('Ok'),
        () => {
          this._didOpenCompletionPage(orderId);
        },
      );
    } else {
      if (retryCount < 3) {
        retryCount++;
        showSingleAlert('Retry', translate('Ok'), () => {
          if (this.state.paymentParams) {
            let params = this.state.paymentParams;
            this.props.placeOrderWithPayment(
              params,
              paymentOption.IsEmbeddedSupported,
              this._orderPlacedCallback,
            );
          }
        });
      } else {
        showSingleAlert(
          translate('Error in payment process'),
          translate('Ok'),
          () => {
            this.props.navigation.navigate('Home');
          },
        );
      }
    }
  };

  _didTapOnEditOrderContent = () => {
    this.props.navigation.goBack();
  };

  _didTapOnApplyVoucher = () => {
    const {voucherCode, isVoucherApplied} = this.state;
    if (isVoucherApplied) return;
    if (voucherCode === '') {
      showSingleAlert(translate('voucher code empty'));
      return;
    }
    this.props.applyVoucher(voucherCode, (status, message) => {
      if (status) {
        showSingleAlert(translate('Voucher applied successfully'));
        this.setState({isVoucherApplied: true});
        this._commonTotalPriceUpdate();
      } else {
        //showSingleAlert(translate("Invalid Voucher"));
        showSingleAlert(message);
        this.setState({voucherCode: '', isVoucherApplied: false});
      }
    });
  };

  didTapOnHomeButton = () => {
    this.props.navigation.navigate('Home');
  };

  didTapOnBackButton = () => {
    const isFromAddAddress =
      this.props.navigation.state.params.isFromAddAddress;
    const isFromProductsDetailScreen =
      this.props.navigation.state.params.isFromProductsDetailScreen;
    if (isFromAddAddress) {
      isFromProductsDetailScreen
        ? this.props.navigation.navigate('ProductDetail')
        : this.props.navigation.navigate('Cart');
    } else {
      this.props.navigation.goBack();
    }
  };

  _didTapOnEditOrderContent = () => {
    const {isFromProductDetail} = this.state;

    if (isFromProductDetail) {
      this.props.navigation.navigate('Cart', {
        isFromCheckout: true,
        checkoutCallback: () => {
          this._commonTotalPriceUpdate();
        },
      });
    } else {
      this.props.navigation.pop();
    }
  };

  _getPaymentUrl = (selectedPaymentOption, newParams) => {
    const {userToken, guestInfo, userInfo, cartID, guestToken} = this.props;
    const {deliveryNoteInState} = this.state;
    let params = {};
    if (userToken.length > 0) {
      params = {
        quote_id: cartID,
        PaymentMethodId: selectedPaymentOption.paymentMethodId,
      };
    } else {
      params = {
        quote_id: guestToken,
        PaymentMethodId: selectedPaymentOption.paymentMethodId,
      };
    }
    this.props.getPaymentURL(params, dict => {
      if (dict && dict.isCartError) {
        this.props.navigation.navigate('Home');
        return;
      }
      console.log('SUCCESS AND FAILED URLS', dict);
      if (dict) {
        let newPaymentSuccessUrl = dict.successurl.replace('/en/', '/'); //removing unwanted string from calback url
        newPaymentSuccessUrl = newPaymentSuccessUrl.replace('/ar/', '/');
        console.log('URL1***', newPaymentSuccessUrl);
        let newPaymentFailedUrl = dict.failedurl.replace('/en/', '/'); //removing unwanted string from calback url
        newPaymentFailedUrl = newPaymentFailedUrl.replace('/ar/', '/');
        console.log('URL2***', newPaymentFailedUrl);
        this.setState({
          paymentUrl: dict.response.Data.PaymentURL,
          paymentSuccessUrl: newPaymentSuccessUrl, //dict.successurl,
          paymentFailedUrl: newPaymentFailedUrl, //dict.failedurl,
          orderId: dict.order_id,
        });

        setTimeout(() => {
          this.setState({isOpenPaymentView: true});
        }, 500);
      }
    });

    /*OLD*/
    // const {userToken, guestInfo, userInfo, cartID, guestToken} = this.props;
    // const {deliveryNoteInState} = this.state;
    // let params = {};
    // if (userToken.length > 0) {
    //   params = {
    //     quote_id: cartID,
    //     PaymentMethodId: selectedPaymentOption.paymentMethodId,
    //     reference: Constants.IS_ANDROID ? 'android' : 'ios',
    //     order_comment: deliveryNoteInState,
    //   };

    //   params = {...params, ...newParams};
    // } else {
    //   params = {
    //     quote_id: guestToken,
    //     PaymentMethodId: selectedPaymentOption.paymentMethodId,
    //     reference: Constants.IS_ANDROID ? 'android' : 'ios',
    //     order_comment: deliveryNoteInState,
    //   };
    //   params = {...params, ...newParams};
    // }
    // this.props.getPaymentURL(params, dict => {
    //   if (dict && dict.isCartError) {
    //     this.props.navigation.navigate('Home');
    //     return;
    //   }
    //   if (dict) {
    //     this.setState({
    //       // paymentUrl: dict.response.Data.PaymentURL,
    //       // paymentSuccessUrl: dict.successurl,
    //       // paymentFailedUrl: dict.failedurl,
    //       // orderId: dict.order_id,
    //       paymentUrl: dict.PaymentURL,
    //       paymentSuccessUrl: dict.successurl,
    //       paymentFailedUrl: dict.failedurl,
    //     });

    //     setTimeout(() => {
    //       this.setState({isOpenPaymentView: true});
    //     }, 500);
    //   }
    // });
  };

  _onLoadMyFatoorahPayment = state => {
    const {
      paymentSuccessUrl,
      paymentFailedUrl,
      deliveryNoteInState,
      totalCostDict,
      guestTokenTemp,
      myFatoorahSessionID,
      checked,
    } = this.state;
    const {guestToken, quote_id, userToken, cartID} = this.props;
    let myFatoorahPaymentSuccessUrl = Constants.MYFATOORAH_PAYMENT_SUCCESS_URL;

    let myFatoorahPaymentFailUrl = Constants.MYFATOORAH_PAYMENT_FAIL_URL;
    let myFatoorahCancelUrl = Constants.MYFATOORAH_CANCEL_URL;

    // if (isMyFatoorahPaymentUpdating) {
    //   console.log('REPEAT!!!!!!!!!!!!!!!', state);
    //   return;
    // }
    console.log('STATE CHANGE-------', state);
    if (state.url.includes(myFatoorahPaymentSuccessUrl)) {
      console.log('SUCCESS -------', state);

      if (isMyFatoorahPaymentUpdating) {
        console.log('IF', state);
        return;
      }
      isMyFatoorahPaymentUpdating = true;

      let params = {
        quote_id: userToken.length > 0 ? cartID : guestToken,
        SessionId: myFatoorahSessionID,
        reference: Constants.IS_ANDROID ? 'android' : 'ios',
        order_comment: deliveryNoteInState,
      };

      this.props.processMyFatoorahSession(params, (status, dict) => {
        isMyFatoorahPaymentUpdating = false;
        console.log('MY FATOORAH', dict);
        if (dict) {
          this.setState({
            paymentUrl: dict.PaymentURL,
            paymentSuccessUrl: dict.successurl,
            paymentFailedUrl: dict.failedurl,
            isMyFatoorahPaymentView: false,
          });
          setTimeout(() => {
            this.setState({isOpenPaymentView: true});
          }, 500);
        }
      });
    } else if (state.url.includes(myFatoorahPaymentFailUrl)) {
      console.log('FAIL PAY OPTIN-------', state);
      // if (isMyFatoorahPaymentUpdating) {
      //   return;
      // }
      isMyFatoorahPaymentUpdating = false;
      this.setState({isMyFatoorahPaymentView: false, loaderVisible: false});
    } else if (state.url.includes(myFatoorahCancelUrl)) {
      console.log('CANCEL-------', state);
      isMyFatoorahPaymentUpdating = false;
      this.setState({
        isMyFatoorahPaymentView: false,
        loaderVisible: false,
      });
    } else {
      console.log('hereee in else');
    }
  };
  _onLoad = state => {
    const {
      paymentSuccessUrl,
      paymentFailedUrl,
      deliveryNoteInState,
      totalCostDict,
      guestTokenTemp,
      paymentMethods,
      checked,
    } = this.state;

    if (isPaymentUpdating) {
      console.log('REPEAT!!!!!!!!!!!!!!!');
      return;
    }

    console.log('SUCCESS URL ', paymentSuccessUrl);
    console.log('FAILED URL ', paymentFailedUrl);

    console.log('STATEEEEEE----->>>>', state);
    let trimmedUrl = state.url.replace('/en/', '/');
    trimmedUrl = trimmedUrl.replace('/ar/', '/');
    // if (state.url.indexOf(paymentSuccessUrl) != -1) {
    if (trimmedUrl.includes(paymentSuccessUrl)) {
      const {userToken, guestInfo, userInfo, cartID, guestToken} = this.props;

      console.log('SUCCESS PAY OPTIN-------', state);

      if (isPaymentUpdating) {
        return;
      }

      isPaymentUpdating = true;

      let regex = /[?&]([^=#]+)=([^&#]*)/g,
        params = {},
        match;
      while ((match = regex.exec(trimmedUrl))) {
        params[match[1]] = match[2];
      }
      const {paymentId, Id} = params;

      if (paymentId && Id) {
        this.setState({isOpenPaymentView: false});

        addRevenueTracking(
          'flzww8',
          Number(totalCostDict.grand_total).toFixed(3),
        );

        let paymentOption = paymentMethods[checked];
        let params = {};
        if (userToken.length > 0) {
          params = {
            quote_id: cartID,
            paymentId: paymentId,
            id: Id,
            reference: Constants.IS_ANDROID ? 'android' : 'ios',
            order_comment: deliveryNoteInState,
          };
        } else {
          params = {
            quote_id: guestTokenTemp,
            paymentId: paymentId,
            id: Id,
            reference: Constants.IS_ANDROID ? 'android' : 'ios',
            order_comment: deliveryNoteInState,
          };
        }

        setTimeout(() => {
          this.setState({loaderVisible: false});
          this.props.placeOrderWithPayment(
            params,
            paymentOption.IsEmbeddedSupported,
            this._orderPlacedCallback,
          );
        }, 3000);

        this.setState({paymentParams: params});
      } else {
        alert('Payment failed');
        this.setState({isOpenPaymentView: false});
        this.setState({loaderVisible: false});
        setTimeout(() => {
          this.errorInPayment();
        }, 500);
      }
    } else if (trimmedUrl.includes(paymentFailedUrl)) {
      // else if (state.url.indexOf(paymentFailedUrl) != -1) {
      if (isPaymentUpdating) {
        return;
      }

      isPaymentUpdating = true;

      let regex = /[?&]([^=#]+)=([^&#]*)/g,
        params = {},
        match;
      while ((match = regex.exec(trimmedUrl))) {
        params[match[1]] = match[2];
      }
      const {paymentId, Id} = params;

      console.log('PARAMS===FAILED====PAYMENT============', paymentId, Id);

      this.props.getPaymentFailedInfo({paymentId: Id}, (status, errorInfo) => {
        this.setState({loaderVisible: false});
        isPaymentUpdating = false;

        this.setState({isOpenPaymentView: false});
        setTimeout(() => {
          if (errorInfo) {
            showSingleAlert(errorInfo.Error, translate('Ok'), () => {
              this.props.getProuctsInCart(response => {});
              // let params = {order_id: this.state.orderId};
              // this.props.retainCart(params, (status, errorData) => {
              //   let outOfStockCount = errorData.length;
              //   if (!status) {
              //     // showSingleAlert(errorMessage, translate("Ok"), () => {
              //     //   this.props.navigation.navigate("Home");
              //     // });
              //     if (outOfStockCount > 0) {
              //       showSingleAlert(
              //         translate('items_of_cart_not_available'),
              //         translate('Ok'),
              //         () => {
              //           this._commonTotalPriceUpdate();
              //           setTimeout(() => {
              //             this.props.navigation.navigate('Cart');
              //           }, 500);
              //         },
              //       );
              //     } else {
              //       showSingleAlert(
              //         translate('API_Failed'),
              //         translate('Ok'),
              //         () => {
              //           this._commonTotalPriceUpdate();
              //           this.props.navigation.navigate('Home');
              //         },
              //       );
              //     }
              //   } else {
              //     if (outOfStockCount > 0) {
              //       showSingleAlert(
              //         translate('items_of_cart_not_available'),
              //         translate('Ok'),
              //         () => {
              //           this._commonTotalPriceUpdate();
              //           if (this.state.isAddOnsIncluded)
              //             showSingleAlert(
              //               translate(
              //                 'You have to add the balloons/wraps again',
              //               ),
              //             );
              //           setTimeout(() => {
              //             this.props.navigation.navigate('Cart');
              //           }, 500);
              //         },
              //       );
              //     } else {
              //       this._commonTotalPriceUpdate();
              //       if (this.state.isAddOnsIncluded)
              //         showSingleAlert(
              //           translate('You have to add the balloons/wraps again'),
              //         );
              //       setTimeout(() => {
              //         this.props.navigation.navigate('Cart');
              //       }, 500);
              //     }
              //   }
              // });
            });
          }
        }, 1000);
      });

      // showSingleAlert(translate("API_Failed"), translate("Ok"), () => {
      //   this.setState({ isOpenPaymentView: false });
      // });
    }
  };

  errorInPayment = () => {
    const {userToken, guestInfo, userInfo, cartID, guestToken} = this.props;

    // showSingleAlert(
    //   userToken.length > 0
    //     ? translate("Order is pending, please got to order history and confirm")
    //     : translate("guest order cancel message"),
    //   translate("Ok"),
    //   () => {
    //     this.props.navigation.navigate("Home");
    //   }
    // );

    let params = {order_id: this.state.orderId};
    this.props.retainCart(params, (status, errorData) => {
      let outOfStockCount = errorData.length;

      if (!status) {
        // showSingleAlert(errorMessage, translate("Ok"), () => {
        //   this.props.navigation.navigate("Home");
        // });

        if (outOfStockCount > 0) {
          showSingleAlert(
            translate('items_of_cart_not_available'),
            translate('Ok'),
            () => {
              this._commonTotalPriceUpdate();
              setTimeout(() => {
                this.props.navigation.navigate('Cart');
              }, 500);
            },
          );
        } else {
          showSingleAlert(translate('API_Failed'), translate('Ok'), () => {
            this._commonTotalPriceUpdate();
            this.props.navigation.navigate('Home');
          });
        }
      } else {
        if (outOfStockCount > 0) {
          showSingleAlert(
            translate('items_of_cart_not_available'),
            translate('Ok'),
            () => {
              this._commonTotalPriceUpdate();
              if (this.state.isAddOnsIncluded)
                showSingleAlert(
                  translate('You have to add the balloons/wraps again'),
                );
              setTimeout(() => {
                this.props.navigation.navigate('Cart');
              }, 500);
            },
          );
        } else {
          this._commonTotalPriceUpdate();
          if (this.state.isAddOnsIncluded)
            showSingleAlert(
              translate('You have to add the balloons/wraps again'),
            );
          setTimeout(() => {
            this.props.navigation.navigate('Cart');
          }, 500);
        }
      }
    });
  };

  _didSubmiDeliveryNote = () => {
    const {deliveryNoteInState, deliveryNoteTemp} = this.state;
    this.setState({
      deliveryNoteInState: deliveryNoteTemp,
      isDeliveryNoteViewShow: false,
    });
  };

  _deleteDeliveryNote = () => {
    const {deliveryNoteInState} = this.state;

    showAlertWithCallback(
      translate('removeDeliveryNote'),
      translate('Yes'),
      translate('No'),
      () => {
        this.setState(
          {deliveryNoteInState: '', deliveryNoteTemp: ''},
          () => {},
        );
      },
      null,
    );
  };

  _updateDeliveryDateTime = (data, index) => {
    const {guestcartList, cartList, userToken} = this.props;
    let updatedDeliveryDateTime = this.state.updatedDeliveryDateTime;
    if (data.type == 'sameDayAll') {
      let cartData = userToken.length > 0 ? cartList : guestcartList;
      cartData.map((item, index) => {
        let sub = {
          isSameDay: data.value,
          date: '',
          time: '',
        };

        let isScheduledDelivery =
          item.extension_attributes.delivery_type === '5615';

        if (!isScheduledDelivery) {
          updatedDeliveryDateTime[index] = sub;
        }
      });
    } else if (data.type == 'sameDaySingle') {
      let sub = {
        isSameDay: data.value,
        date: '',
        time: '',
      };
      updatedDeliveryDateTime[index] = sub;
    } else if (data.type == 'deliveryDateTime') {
      let sub = {
        isSameDay: false,
        date: data.date,
        time: data.time,
      };
      updatedDeliveryDateTime[index] = sub;
    } else if (data.type === 'deliveryDateTimeAll') {
      let cartData = userToken.length > 0 ? cartList : guestcartList;
      cartData.map((item, index) => {
        let sub = {
          isSameDay: false,
          date: data.date,
          time: data.time,
        };

        let isScheduledDelivery =
          item.extension_attributes.delivery_type === '5615';

        if (!isScheduledDelivery) {
          updatedDeliveryDateTime[index] = sub;
        }
      });
    }

    this.setState({updatedDeliveryDateTime});
  };

  render() {
    const {
      isRTL,
      isLoading,
      guestcartList,
      cartList,
      userToken,
      currency,
      productsAges,
      productsAgeGroups,
      productsBrands,
      productsGenders,
      updateCartDateTime,
      guestToken,
    } = this.props;

    const {
      deliveryAddressDict,
      billingAddressDict,
      totalCostDict,
      voucherCode,
      isVoucherApplied,
      paymentMethods,
      totalCostBeforeDiscount,
      deliveryTimeArray,
      holidaysInWeek,
      holidays,
      execptionalHolidays,
      maxDaysToBook,
      completeHolidays,
      newDate,
      shippingAmount,
      cartTotalDiscount,
      sameDayDeliveryTime,
      availableNextDay,
      availableMaxDay,
      totalCostAfterDiscount,
      isOpenPaymentView,
      paymentUrl,
      loaderVisible,
      isDeliveryNoteViewShow,
      deliveryNoteInState,
      deliveryNoteTemp,
      updatedDeliveryDateTime,
      isShowPaymentView,
      checked,
      savedCardInfo,
      isMyFatoorahPaymentView,
      myFatoorahSessionID,
    } = this.state;

    let itemArray = userToken.length > 0 ? cartList : guestcartList;
    let newStreetAddress = '';
    let newStreetAddress2 = '';
    let isAddressAvailable = false;
    if (deliveryAddressDict && deliveryAddressDict.firstname) {
      // newStreetAddress =
      //   deliveryAddressDict.street.length > 0
      //     ? deliveryAddressDict.street[0]
      //     : "";

      if (deliveryAddressDict.street.length > 0) {
        deliveryAddressDict.street.map(addData => {
          if (newStreetAddress == '') {
            newStreetAddress = addData;
          } else {
            newStreetAddress = newStreetAddress + ' ' + addData;
          }
        });
      }

      isAddressAvailable = true;
    }
    if (billingAddressDict && billingAddressDict.firstname) {
      // newStreetAddress2 =
      //   billingAddressDict.street.length > 0
      //     ? billingAddressDict.street[0]
      //     : "";
      if (billingAddressDict.street.length > 0) {
        billingAddressDict.street.map(addData2 => {
          if (newStreetAddress2 === '') {
            newStreetAddress2 = addData2;
          } else {
            newStreetAddress2 = newStreetAddress2 + ' ' + addData2;
          }
        });
      }
    }
    const cartData = userToken.length > 0 ? cartList : guestcartList;

    // let myFathoraPaymentUrl=  Constants.MYFATOORAH_PAYMENT_URL + myFatoorahSessionID;
    let myFathoraPaymentUrl = '';
    if (totalCostDict && myFatoorahSessionID !== '') {
      myFathoraPaymentUrl =
        Constants.MYFATOORAH_PAYMENT_URL +
        myFatoorahSessionID +
        '&totalAmount=' +
        Number(totalCostDict.grand_total).toFixed(3) +
        '&shippingAmount=' +
        Number(shippingAmount).toFixed(3);
    }

    console.log('MYFATHORA PAYMENT URL----', myFathoraPaymentUrl);

    return (
      <SafeAreaView style={styles.safeContainer}>
        <NavigationHeader1
          hideBottomLine
          hideSearch={true}
          showHome
          didTapOnHomeButton={this.didTapOnHomeButton}
          title={translate('Checkout')}
          showBackButton={true}
          didTapOnBackButton={this.didTapOnBackButton}
          isRTL={this.props.isRTL}
        />

        <FlatList
          data={[1]}
          styl={styles.listContainer}
          renderItem={() => {
            return (
              <View>
                <View styl={styles.listContainer}>
                  <FlatList
                    style={styles.itemList}
                    data={itemArray}
                    keyExtractor={(item, index) => index.toString()}
                    extraData={itemArray}
                    renderItem={({item, index}) => (
                      <View key={index + '22'}>
                        <CategoryCell
                          item={item}
                          index={index}
                          currency={currency}
                          totalCost={totalCostDict}
                          isRTL={this.props.isRTL}
                          navigation={this.props.navigation}
                          productsAges={productsAges}
                          productsAgeGroups={productsAgeGroups}
                          productsBrands={productsBrands}
                          productsGenders={productsGenders}
                          deliveryTime={deliveryTimeArray}
                          holidaysInWeek={holidaysInWeek}
                          holidays={holidays}
                          execptionalHolidays={execptionalHolidays}
                          maxDaysToBook={maxDaysToBook}
                          sameDayDeliveryTime={sameDayDeliveryTime}
                          completeHolidays={completeHolidays}
                          newDate={newDate}
                          updateCartDateTime={updateCartDateTime}
                          props={this.props}
                          availableNextDay={availableNextDay}
                          availableMaxDay={availableMaxDay}
                          updatedDeliveryDateTime={updatedDeliveryDateTime}
                          updateDeliveryDateTime={this._updateDeliveryDateTime}
                        />
                        <View style={styles.lineView} />
                      </View>
                    )}
                  />

                  <View style={styles.itemCellContainer}>
                    <View style={{marginHorizontal: 20}}>
                      <Text style={styles.voucherTitle}>
                        {translate('Add Voucher code')}
                      </Text>
                      <View
                        style={{
                          flexDirection: 'row',
                          marginBottom: isVoucherApplied ? 10 : 25,
                          marginTop: 10,
                        }}>
                        <TextInput
                          style={[
                            styles.voucherInput,
                            {textAlign: isRTL ? 'right' : 'left'},
                          ]}
                          value={voucherCode}
                          editable={!isVoucherApplied}
                          onChangeText={text =>
                            this.setState({voucherCode: text})
                          }
                          placeholder={translate('Enter Voucher Code')}
                        />
                        <TouchableOpacity
                          style={[
                            styles.applyButton,
                            {
                              backgroundColor: isVoucherApplied
                                ? 'green'
                                : Constants.APP_THEME_COLOR,
                            },
                          ]}
                          onPress={this._didTapOnApplyVoucher}>
                          {isVoucherApplied ? (
                            <Text
                              style={[
                                styles.applyText,
                                {color: Constants.APP_WHITE_COLOR},
                              ]}>
                              {translate('Applied')}
                            </Text>
                          ) : (
                            <Text style={styles.applyText}>
                              {translate('Apply')}
                            </Text>
                          )}
                        </TouchableOpacity>
                      </View>
                      {isVoucherApplied && (
                        <View style={styles.removeVoucher}>
                          <TouchableOpacity
                            activeOpacity={constants.ACTIVE_OPACITY}
                            style={styles.removeWrap}
                            hitSlop={{
                              top: 20,
                              left: 20,
                              right: 20,
                              bottom: 20,
                            }}
                            onPress={() => {
                              showAlertWithCallback(
                                translate('removeVoucher'),
                                translate('Yes'),
                                translate('No'),
                                () => {
                                  this.props.removeAppliedVoucher(status => {
                                    if (status) this._commonTotalPriceUpdate();
                                  });
                                },
                                null,
                              );
                            }}>
                            <Text style={styles.removeText}>
                              {translate('Remove CAPITAL')}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  </View>
                  <View style={styles.lineView2} />
                  {paymentMethods.length > 0 && (
                    <View style={styles.itemCellContainer}>
                      <View style={{marginHorizontal: 20}}>
                        <Text style={styles.addVoucherCode}>
                          {translate('Payment Methods')}
                        </Text>
                        {paymentMethods.map((item, key) => {
                          return this.state.checked == key ? (
                            <TouchableOpacity
                              key={'ff' + item.title}
                              onPress={() => this._didTapOnPaymentMethod(item)}
                              style={styles.paymentMethodButton}
                              activeOpacity={Constants.ACTIVE_OPACITY}>
                              <Image
                                source={Images.radioChecked3}
                                style={{width: 20, height: 20}}
                              />
                              <Text style={[styles.paymentText, {flex: 1}]}>
                                {item.title}
                              </Text>
                              <Image
                                resizeMode={'contain'}
                                style={{width: 40, height: 40}}
                                source={item.image}
                              />
                            </TouchableOpacity>
                          ) : (
                            <TouchableOpacity
                              key={'fff' + item.title}
                              onPress={() => {
                                this._didTapOnPaymentMethod(item);
                                this.setState({checked: key});
                              }}
                              style={styles.paymentMethodButton}
                              activeOpacity={Constants.ACTIVE_OPACITY}>
                              <Image
                                source={Images.radioUnchecked2}
                                style={{width: 20, height: 20}}
                              />
                              <Text style={[styles.paymentText, {flex: 1}]}>
                                {item.title}
                              </Text>
                              <Image
                                resizeMode={'contain'}
                                style={{width: 40, height: 40}}
                                source={item.image}
                              />
                            </TouchableOpacity>
                          );
                        })}
                        <View style={{height: 10}} />
                      </View>
                    </View>
                  )}

                  <View style={styles.lineView} />
                  <View style={styles.shippingAndTotal}>
                    <View style={styles.itemCellContainer}>
                      <View style={{marginHorizontal: 20}}>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                          }}>
                          <Text style={[styles.addVoucherCode, {flex: 1}]}>
                            {translate('Delivery Address')}
                          </Text>
                        </View>

                        {isAddressAvailable ? (
                          <View>
                            <Text style={styles.addressText}>
                              {deliveryAddressDict.firstname +
                                ' ' +
                                deliveryAddressDict.lastname}
                            </Text>
                            <Text style={styles.addressText}>
                              {newStreetAddress}
                            </Text>
                            <Text style={styles.addressText}>
                              {deliveryAddressDict.city +
                                ' ' +
                                deliveryAddressDict.postcode}
                            </Text>
                            <Text style={styles.addressText}>
                              {'+965 ' + deliveryAddressDict.telephone}
                            </Text>
                            {isAddressAvailable && (
                              <TouchableOpacity
                                onPress={
                                  userToken.length > 0
                                    ? this._didTapOnAddAddress
                                    : () =>
                                        this._changeGuestAddress(
                                          deliveryAddressDict,
                                        )
                                }
                                hitSlop={{
                                  left: 10,
                                  right: 10,
                                  top: 10,
                                  bottom: 10,
                                }}
                                style={styles.changeAddressButton}>
                                <Text style={styles.changeAddressButtonText}>
                                  {translate('Change Address')}
                                </Text>
                              </TouchableOpacity>
                            )}
                          </View>
                        ) : (
                          <TouchableOpacity
                            onPress={this._didTapOnAddAddress}
                            style={styles.addAddressButton}>
                            <Text style={styles.addAddressButtonText}>
                              {translate('Add Delivery Address')}
                            </Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>

                    {deliveryNoteInState !== '' ? (
                      <View style={styles.itemCellContainer}>
                        <TouchableOpacity
                          onPress={() =>
                            this.setState({isDeliveryNoteViewShow: true})
                          }
                          style={{marginHorizontal: 20}}>
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}>
                            <Text style={[styles.addVoucherCode1, {flex: 1}]}>
                              {translate('Delivery Notes')} :{' '}
                              <Text style={styles.addVoucherCode2}>
                                {deliveryNoteInState}
                              </Text>
                            </Text>
                            <TouchableOpacity
                              onPress={this._deleteDeliveryNote}
                              hitSlop={{
                                left: 30,
                                top: 20,
                                right: 20,
                                bottom: 20,
                              }}>
                              <Image source={Images.trash} />
                            </TouchableOpacity>
                          </View>
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <View style={{marginHorizontal: 20, marginTop: 20}}>
                        <TouchableOpacity
                          onPress={() =>
                            this.setState({isDeliveryNoteViewShow: true})
                          }
                          style={styles.addAddressButton}>
                          <Text style={styles.addAddressButtonText}>
                            {translate('Add Delivery Note')}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    )}

                    <View style={styles.itemCellContainer}>
                      <View style={{marginHorizontal: 20}}>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                          }}>
                          <Text style={[styles.addVoucherCode, {flex: 1}]}>
                            {translate('Billing Address')}
                          </Text>
                        </View>
                        {billingAddressDict ? (
                          <View>
                            <Text style={styles.addressText}>
                              {billingAddressDict.firstname +
                                ' ' +
                                billingAddressDict.lastname}
                            </Text>
                            <Text style={styles.addressText}>
                              {newStreetAddress2}
                            </Text>
                            <Text style={styles.addressText}>
                              {billingAddressDict.city +
                                ' ' +
                                billingAddressDict.postcode}
                            </Text>
                            <Text style={styles.addressText}>
                              {'+965 ' + billingAddressDict.telephone}
                            </Text>
                            <TouchableOpacity
                              onPress={
                                userToken.length > 0
                                  ? this._didTapOnAddAddress
                                  : () =>
                                      this._changeGuestAddress(
                                        billingAddressDict,
                                      )
                              }
                              hitSlop={{
                                left: 10,
                                right: 10,
                                top: 10,
                                bottom: 10,
                              }}
                              style={styles.changeAddressButton}>
                              <Text style={styles.changeAddressButtonText}>
                                {translate('Change Address')}
                              </Text>
                            </TouchableOpacity>
                          </View>
                        ) : (
                          <TouchableOpacity
                            onPress={this._didTapOnAddAddress}
                            style={styles.addAddressButton}>
                            <Text style={styles.addAddressButtonText}>
                              {translate('Add Billing Address')}
                            </Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                    <View style={styles.separatorView3} />
                    <View style={styles.itemCellContainer}>
                      <View style={{marginHorizontal: 20}}>
                        <View style={{flexDirection: 'row'}}>
                          <Text style={styles.titleLabel}>
                            {translate('Cart Total (Before Discounts)')}
                          </Text>
                          <Text style={styles.titleValueLabel}>
                            {totalCostBeforeDiscount + ' ' + currency}
                          </Text>
                        </View>

                        {cartData.map((item, i) => {
                          let percentage;
                          let finalPrice = item.price;
                          let actualPrice =
                            item.extension_attributes.original_price;
                          percentage =
                            ((actualPrice - finalPrice) / actualPrice) * 100;
                          percentage = Number(percentage.toFixed(1));
                          if (percentage > 0)
                            return (
                              <View key={'off' + i} style={styles.TotalRow}>
                                <Text style={styles.TotalLabel}>
                                  {translate('item') +
                                    ' ' +
                                    Number(i + 1) +
                                    ', ' +
                                    percentage +
                                    '% ' +
                                    translate('Off') +
                                    (item.qty > 1
                                      ? ' ( ' + item.qty + ' nos. )'
                                      : '')}
                                </Text>
                                <Text style={styles.TotalValuesRed}>
                                  {'-' +
                                    Number(
                                      (actualPrice - finalPrice) * item.qty,
                                    ).toFixed(3) +
                                    ' ' +
                                    currency}
                                </Text>
                              </View>
                            );
                        })}

                        {cartTotalDiscount != 0 && (
                          <View style={styles.TotalRow}>
                            <Text style={styles.TotalLabel}>
                              {isVoucherApplied
                                ? translate('Cart discount include voucher')
                                : translate('Cart discount')}
                            </Text>
                            <Text style={styles.TotalValuesRed}>
                              {Number(cartTotalDiscount).toFixed(3) +
                                ' ' +
                                currency}
                            </Text>
                          </View>
                        )}

                        {shippingAmount ? (
                          <View style={{flexDirection: 'row'}}>
                            <Text style={styles.titleLabel}>
                              {translate('Local Shipping')}
                            </Text>
                            <Text style={styles.titleValueLabel}>
                              {Number(shippingAmount).toFixed(3) +
                                ' ' +
                                currency}
                            </Text>
                          </View>
                        ) : (
                          <View />
                        )}

                        {/* {shippingAmount && (
                    <View style={{ flexDirection: "row" }}>
                      <Text style={styles.titleLabel}>
                        {translate("Local Shipping")}
                      </Text>
                      <Text style={styles.titleValueLabel}>
                        {shippingAmount.toFixed(3) + " " + currency}
                      </Text>
                    </View>
                  )} */}

                        <View style={{flexDirection: 'row', marginBottom: 5}}>
                          <Text style={styles.titleLabel}>
                            {translate('Cart Total (After Discounts)')}
                          </Text>
                          <Text style={styles.titleValueLabel}>
                            {Number(totalCostAfterDiscount).toFixed(3) +
                              ' ' +
                              currency}
                          </Text>
                        </View>
                        <View style={styles.separatorView2} />
                        <View style={styles.totalViewContainer}>
                          <Text style={[styles.titleLabel, styles.totalTitle]}>
                            {translate('TOTAL')}
                          </Text>
                          <Text
                            style={[styles.titleLabel, styles.grandTotalText]}>
                            {Number(totalCostDict.grand_total).toFixed(3) +
                              ' ' +
                              currency}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            );
          }}></FlatList>

        <FooterButton
          buttonText1={translate('Edit Order Content').toUpperCase()}
          buttonText2={translate('PLACE ORDER')}
          onButton1Click={this._didTapOnEditOrderContent}
          onButton2Click={this._didTapOnPlaceOrder}
          screenWidth={this.props.screenWidth}
        />
        <Modal
          isVisible={isMyFatoorahPaymentView}
          onBackdropPress={() => {
            this.setState({isMyFatoorahPaymentView: false});
          }}
          onBackButtonPress={() => {
            this.setState({isMyFatoorahPaymentView: false});
          }}
          backdropOpacity={0.6}
          style={{margin: 0}}>
          <View style={styles.deliveryNoteModalWrapper}>
            <View
              style={{
                backgroundColor: 'white',
                height: '80%',
                width: '100%',
                borderTopLeftRadius: 30,
                borderTopRightRadius: 30,
                overflow: 'hidden',
              }}>
              <SafeAreaView
                style={{
                  margin: 0,
                  flex: 1,
                  backgroundColor: 'rgb(255,255,255)',
                }}>
                <NavigationHeader
                  isWishlist={false}
                  hideSearch={true}
                  title={translate('Payment')}
                  showBackButton={true}
                  didTapOnLeftButton={() => {
                    this.setState({
                      loaderVisible: false,
                      paymentUrl: '',
                      isMyFatoorahPaymentView: false,
                    });
                  }}
                  isRTL={this.props.isRTL}
                />
                <WebView
                  source={{
                    uri: myFathoraPaymentUrl,
                  }}
                  onLoadStart={() => this.setState({loaderVisible: true})}
                  onLoadEnd={() => this.setState({loaderVisible: false})}
                  onNavigationStateChange={this._onLoadMyFatoorahPayment}
                  onError={syntheticEvent => {
                    const {nativeEvent} = syntheticEvent;
                    console.log('-------WebView error: ', nativeEvent);
                    this.setState({
                      loaderVisible: false,
                      paymentUrl: '',
                    });
                    showSingleAlert(translate('API_Failed'), 'Ok', () => {
                      this.setState({isMyFatoorahPaymentView: false});
                    });
                  }}
                  javaScriptEnabled={true}
                  domStorageEnabled={true}
                />
                {(isLoading || loaderVisible) && <HudView />}
              </SafeAreaView>
            </View>
          </View>
        </Modal>
        <Modal
          isVisible={isOpenPaymentView}
          onBackdropPress={() => {
            setTimeout(() => {
              this.errorInPayment();
            }, 500);
            this.setState({isOpenPaymentView: false});
          }}
          onBackButtonPress={() => {
            setTimeout(() => {
              this.errorInPayment();
            }, 500);
            this.setState({isOpenPaymentView: false});
          }}
          style={{margin: 0}}>
          <SafeAreaView
            style={{
              margin: 0,
              flex: 1,
              backgroundColor: 'rgb(255,255,255)',
            }}>
            <NavigationHeader
              isWishlist={false}
              hideSearch={true}
              title={translate('Payment')}
              showBackButton={true}
              didTapOnLeftButton={() => {
                this.setState({
                  loaderVisible: false,
                  paymentUrl: '',
                  isOpenPaymentView: false,
                });

                setTimeout(() => {
                  this.errorInPayment();
                }, 500);
              }}
              isRTL={this.props.isRTL}
            />
            <WebView
              source={{
                uri: paymentUrl,
              }}
              onLoadStart={() => this.setState({loaderVisible: true})}
              onLoadEnd={() => this.setState({loaderVisible: false})}
              onNavigationStateChange={this._onLoad}
              onError={syntheticEvent => {
                const {nativeEvent} = syntheticEvent;
                console.log('-------WebView error: ', nativeEvent);
                this.setState({
                  loaderVisible: false,
                  paymentUrl: '',
                });
                showSingleAlert(translate('API_Failed'), 'Ok', () => {
                  this.setState({isOpenPaymentView: false});
                  setTimeout(() => {
                    this.errorInPayment();
                  }, 500);

                  let data = {
                    userType: userToken.length > 0 ? 'Logged User' : 'Guest',
                    userToken: userToken.length > 0 ? userToken : guestToken,
                    message: 'Payent screen loading error',
                    api: '',
                  };
                  Sentry.captureMessage(JSON.stringify(data));
                });
              }}
            />
            {(isLoading || loaderVisible) && <HudView />}
          </SafeAreaView>
        </Modal>
        <Modal
          isVisible={isDeliveryNoteViewShow}
          //onBackdropPress={() => this.setState({ isDeliveryNoteViewShow: false })}
          backdropOpacity={0.6}
          onBackButtonPress={() =>
            this.setState({isDeliveryNoteViewShow: false})
          }>
          {/* <ScrollView style={{ flex: 1 }}> */}
          <View style={styles.deliveryNoteModalWrapper}>
            <View style={styles.deliveryNoteCardWrapper}>
              <Text style={styles.deliveryNoteText}>
                {translate('Enter your delivery note')}
              </Text>
              <View style={styles.inputContainerFull}>
                <TextInput
                  multiline
                  style={styles.deliveryNoteInputs}
                  placeholder={translate('Delivery note')}
                  returnKeyType={'done'}
                  onChangeText={value =>
                    this.setState({deliveryNoteTemp: value})
                  }
                  underlineColorAndroid="transparent"
                  value={deliveryNoteTemp}
                  maxLength={200}
                />
              </View>

              <View style={styles.pwdSubmitWrapper}>
                <TouchableOpacity
                  onPress={() => this.setState({isDeliveryNoteViewShow: false})}
                  style={styles.pwdCancelWrapper}>
                  <Text style={styles.pwdCancelTxt}>{translate('Cancel')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    if (deliveryNoteTemp == '') {
                      showSingleAlert(
                        translate('Please enter your delivery note'),
                      );
                      return;
                    }
                    this._didSubmiDeliveryNote();
                  }}
                  style={styles.pwdSubmitBtnWrapper}>
                  <Text style={styles.pwdSubmitTxt}>{translate('Submit')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          {/* </ScrollView> */}
        </Modal>
        <Modal
          isVisible={isShowPaymentView}
          //onBackdropPress={() => this.setState({ isDeliveryNoteViewShow: false })}
          backdropOpacity={0.6}
          onBackButtonPress={() =>
            this.setState({isDeliveryNoteViewShow: false})
          }>
          {/* <ScrollView style={{ flex: 1 }}> */}
          <View style={styles.deliveryNoteModalWrapper}>
            <PaymentScreen
              shippingAmount={shippingAmount ? shippingAmount : 0}
              currency={currency}
              cartTotal={totalCostDict.grand_total}
              screenWidth={this.props.screenWidth}
              savedCardInfo={savedCardInfo}
              didTapOnPay={params => {
                let paymentOption = paymentMethods[checked];
                this._getPaymentUrl(paymentOption, params);
              }}
              didTapOnClose={() => {
                this.setState({isShowPaymentView: false});
              }}></PaymentScreen>
          </View>
        </Modal>
        {(isLoading || loaderVisible) && <HudView />}
      </SafeAreaView>
    );
  }
}

export default CheckoutView;

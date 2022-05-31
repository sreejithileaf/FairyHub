/**
 * Created by ARUN for iLeaf Solutions Pvt.Ltd
 * on MARCH 3, 2020
 * Filter Fetch - handles all datas of filters for different categories
 */

import { getAllFilters } from "../api/apiMethods";
import filterArray from "../lib/filterManipulation";
import { put, call, select } from "redux-saga/effects";
import { translate } from "../config/languageSwitching";
import { showSingleAlert, isEmpty } from "../config/common";
import * as loadingActions from "../actions/loadingActions";
import * as filterResultAction from "../actions/filterResultAction";

// Our worker Saga that logins the user
export function* getFilterDetails(action) {
  let final_array = [];
  let age_array = [];
  let gender_array = [];
  let category_array = [];
  let brand_array = [];
  let character_array = [];
  let theme_array = [];
  let color_array = [];

  const {
    isNetworkAvailable,
    adminToken,
    storeCode,

    productsAgeGroups,
    productsAges,
    productsGenders,
    productsBrands,
    productsColors,
    productsDeliveryTypes,
    productsRefundable,
    productsSizes,
  } = yield select((state) => state.appReducer);

  if (!isNetworkAvailable) {
    showSingleAlert(translate("No internet connection"));
    return;
  }

  yield put(loadingActions.enableLoader());
  try {
    const response = yield call(
      getAllFilters,
      action.categoryid,
      storeCode,
      adminToken
    );

    console.log("FILTER OPTIONS RESPONSE", response);

    if (response.length > 0) {
      age_array = response[0].age_range ? response[0].age_range : [];
      gender_array = response[0].gender ? response[0].gender : [];
      category_array = response[0].cat ? response[0].cat : [];
      brand_array = response[0].brand ? response[0].brand : [];
      character_array = response[0].character ? response[0].character : [];
      theme_array = response[0].theme ? response[0].theme : [];
      color_array = response[0].color ? response[0].color : [];

      const isAvailableBalloons = response[0].available_balloons ? true : false;
      const isAvailableGiftwrap = response[0].available_giftwrap ? true : false;
      const is_discountable = response[0].is_discountable ? true : false;
      const isFreeDelivery = response[0].free_delivery ? true : false;
      const isDeliveryAppointment = response[0].delivery_appointment
        ? true
        : false;
      const isSameDayDelivery = response[0].delivery_type ? true : false;

      // for Gender
      if (!isEmpty(gender_array)) {
        const gender_obj = {
          key: "gender",
          keys: gender_array,
        };
        final_array.push(gender_obj);
      }

      // for Sort
      final_array.push({
        key: "sortOrder",
        keys: [
          { title: "Latest Arrivals", value: "new" },
          { title: "Most Popular", value: "pop" },
          { title: "Price Low to High", value: "asc" },
          { title: "Price High to Low", value: "desc" },
        ],
      });

      // for Age
      if (!isEmpty(age_array)) {
        const age_obj = {
          key: "age",
          keys: age_array,
        };
        final_array.push(age_obj);
      }

      // for Characters
      if (!isEmpty(character_array)) {
        const character_obj = {
          key: "characters",
          keys: character_array,
        };
        final_array.push(character_obj);
      }

      // for Category
      if (!isEmpty(category_array)) {
        const category_obj = {
          key: "category",
          keys: category_array,
        };
        final_array.push(category_obj);
      }

      // for Balloons
      if (isAvailableBalloons) {
        const ballons_obj = {
          key: "balloons",
          keys: [true, false],
        };
        final_array.push(ballons_obj);
      }

      // for Giftwrap
      if (isAvailableGiftwrap) {
        const giftwrap_obj = {
          key: "giftwrap",
          keys: [true, false],
        };
        final_array.push(giftwrap_obj);
      }

      // for Discount
      if (is_discountable) {
        const discount_obj = {
          key: "discount",
          keys: [true, false],
        };
        final_array.push(discount_obj);
      }

      // for Free delivery
      if (isFreeDelivery) {
        const freeDelivery_obj = {
          key: "freeDelivery",
          keys: [true, false],
        };
        final_array.push(freeDelivery_obj);
      }

      // for Delivery appointmnet
      if (isDeliveryAppointment) {
        const deliveryAppointment_obj = {
          key: "deliveryAppointmnet",
          keys: [true, false],
        };
        final_array.push(deliveryAppointment_obj);
      }

      // for same day delivery
      if (isSameDayDelivery) {
        const sameDayDelivery_obj = {
          key: "sameDayDelivery",
          keys: [true, false],
        };
        final_array.push(sameDayDelivery_obj);
      }

      // for Theme
      if (!isEmpty(theme_array)) {
        const theme_obj = {
          key: "theme",
          keys: theme_array,
        };
        final_array.push(theme_obj);
      }

      // for Brands
      if (!isEmpty(brand_array)) {
        const brand_obj = {
          key: "brands",
          keys: brand_array,
        };
        final_array.push(brand_obj);
      }

      // for Colors
      if (!isEmpty(color_array)) {
        const color_obj = {
          key: "color",
          keys: color_array,
        };
        final_array.push(color_obj);
      }
    } else {
      //for price
      final_array.push({ title: "Price", price_from: "", price_to: "" });

      //for discount
      final_array.push({ title: "Discount" });
    }
    yield put(
      filterResultAction.loadFilterList(final_array, action.categoryid)
    );
    if (action.callback) {
      action.callback(final_array);
    }
    yield put(loadingActions.disableLoader({}));
  } catch (error) {
    console.log("API ERROR!!!!", error);
    yield put(filterResultAction.loadFilterFailure());
    yield put(loadingActions.disableLoader({}));
  }
}

/**
 * Created by Jebin for iLeaf Solutions Pvt.Ltd
 * on February 12, 2020
 * Reducer index - Combine reducers
 */

import * as appReducer from './appReducer';
import * as loginReducer from './loginReducer';
import * as loadingReducer from './loadingReducer';
import * as categoryListReducer from './categoryListReducer';
import * as productsListReducer from './productsListReducer';
import * as searchHistoryReducer from './searchHistoryReducer';
import * as productDetailReducer from './productDetailReducer';
import * as filterListReducer from './filterListReducer';
import * as homeReducer from './homeReducer';
import * as productListFromCategoryReducer from './productListFromCategoryReducer';
import * as searchResultReducer from './searchResultReducer';
import * as cartReducer from './cartReducer';
import * as addAddressReducer from './addAddressReducer';

export default Object.assign(
  appReducer,
  loginReducer,
  loadingReducer,
  productsListReducer,
  searchHistoryReducer,
  categoryListReducer,
  productDetailReducer,
  filterListReducer,
  addAddressReducer,
  productListFromCategoryReducer,
  homeReducer,
  searchResultReducer,
  cartReducer,
);

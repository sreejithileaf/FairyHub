/**
 * Created by Jebin for iLeaf Solutions Pvt.Ltd
 * on February 12, 2020
 * Action -  index class for actions
 */

import * as loginActions from './loginActions';
import * as navigationActions from './loginActions';
import * as homeAction from './homeAction';
import * as filterResultActions from './filterResultAction';
import * as countrySelectionActions from './countrySelectionActions';
import * as addAddressAction from './addAddressAction';
import * as cartActions from './cartActions';
import * as productsActions from './productsActions';

export const ActionCreators = Object.assign(
  {},
  loginActions,
  navigationActions,
  filterResultActions,
  countrySelectionActions,
  homeAction,
  addAddressAction,
  cartActions,
  productsActions
);

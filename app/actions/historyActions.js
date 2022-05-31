/**
 * Created by Jebin for iLeaf Solutions Pvt.Ltd
 * on February 18, 2020
 * History Actions -  Actions for History data updations
 */

import * as types from './types';

export function updateSearchHistory(newList) {
  return {
    type: types.UPDATE_SEARCH_HISTORY,
    newList,
  };
}




/**
 * Created by Jebin for iLeaf Solutions Pvt.Ltd
 * on February 18, 2020
 * Search Container -
 */

import {connect} from 'react-redux';
import React, {Component} from 'react';
import SearchView from './SearchView';
import * as appActions from '../../actions/appActions';
import * as searchActions from '../../actions/searchActions';
import * as historyActions from '../../actions/historyActions';

class AccountContainer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <SearchView {...this.props} />;
  }
}

function mapStateToProps(state) {
  return {
    isLoading: state.loadingReducer.isLoading,
    selectedLanguage: state.appReducer.selectedLanguage,
    isRTL: state.appReducer.selectedLanguage === 'ar' ? true : false,
    searchHistoryarray: state.searchHistoryReducer.searchHistoryarray,
    screenWidth: state.appReducer.screenWidth,
    screenHeight: state.appReducer.screenHeight,
    orientation: state.appReducer.orientation,
    searchResultArray: state.searchResultReducer.searchResultArray,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    didChangeLAnguage: language => {
      dispatch(appActions.onChangeLanguage(language));
    },
    updateSearchHistory: newList => {
      dispatch(historyActions.updateSearchHistory(newList));
    },
    onSearchTextChange: searchText => {
      dispatch(searchActions.onSearchTextChange(searchText));
    },
    clearSearchResult: () => {
      dispatch(searchActions.clearSearchResult());
    },
    getTopSearches:(callback)=>{
      dispatch(searchActions.getTopSearches(callback));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountContainer);

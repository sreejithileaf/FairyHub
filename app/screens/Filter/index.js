/**
 * Created by Arun for iLeaf Solutions Pvt.Ltd
 * on February 26, 2020
 * FilterContainer - FilterScreen container
 */

import { connect } from "react-redux";
import React, { Component } from "react";
import FilterScreen from "./FilterScreen";
import * as filterActions from "../../actions/filterResultAction";

class FilterContainer extends Component {
  componentDidMount() {
    // let categoryID = {categoryid:'33'};
    // const { category_id } = this.props.navigation.state.params;
    // const { filterArray, filterCategoryId } = this.props;
    // if (filterCategoryId.categoryid !== category_id) {
    //   this.props.fetchFilterList({ categoryid: category_id });
    // }
  }

  render() {
    return <FilterScreen {...this.props} />;
  }
}

function mapStateToProps(state) {
  return {
    selectedLanguage: state.appReducer.selectedLanguage,
    filterArray: state.filterListReducer.filter_list,
    filterCategoryId: state.filterListReducer.filterCategoryId,
    selectedFilters: state.filterListReducer.selectedFilters,
    isLoading: state.loadingReducer.isLoading,
    currency: state.appReducer.currency,
    isRTL: state.appReducer.selectedLanguage === "ar" ? true : false,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    // didChangeLAnguage: language => {
    //   dispatch(appActions.onChangeLanguage(language));
    // },
    clearSelectedFilters: () => {
      dispatch(filterActions.clearSelectedFilters());
    },
    updateFilters: (filters) => {
      dispatch(filterActions.updateFilters(filters));
    },
    // fetchFilterList: (id) => {
    //   dispatch(filterActions.loadFilterRequest(id));
    // },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FilterContainer);

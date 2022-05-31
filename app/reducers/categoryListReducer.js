import * as types from "../actions/types";
import createReducer from "../lib/createReducer";

const initialState = {
  category_list: [],
};

export const categoryListReducer = createReducer(initialState, {
  [types.GET_ALL_CATEGORIES_RESPONSE](state, action) {
    let categoryList = [];

    if (action.response && typeof action.response === "object") {
      const { children_data: mainArray } = action.response;
      categoryList = mainArray.map((item) => ({
        id: item.id || 0,
        parent_id: item.parent_id || 0,
        title: item.name || "",
        is_active: item.is_active || false,
        home_image: item.image || "", //item.home_page_slider_image || "",
        image_click: item.image_click || "",
        subCategories: item.children_data || [],
      }));
    }
    if (categoryList.length > 0) {
      // categoryList.shift()
    }
    // // categoryList.children_data.slice(0,1);
    // console.log("action.response",categoryList.children_data.slice(0,1));

    return { ...state, category_list: categoryList };
  },
});

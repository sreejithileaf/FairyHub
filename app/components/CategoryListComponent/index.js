import React, { useState, useCallback } from "react";
import {
  View,
  Dimensions,
  Image,
  FlatList,
  Text,
  TouchableOpacity,
} from "react-native";

const devicewidth = Dimensions.get("screen").width / 3 - 8;

const renderItem = ({ item, index }) => {
  return (
    <TouchableOpacity>
      <View
        style={{
          width: devicewidth,
          margin: 1,
          justifyContent: "center",
          alignItems: "center",
          height: 120,
        }}
      >
        <Image
          style={{ height: 70, width: 70, borderRadius: 60 }}
          source={{ uri: item.images }}
        />
        <Text style={{ flex: 1, textAlign: "center" }}>{item.title}</Text>
      </View>
    </TouchableOpacity>
  );
};

function keyExtractor(item, index) {
  return item + index;
}

export default function CategoryListComponent(props) {
  const [categories, setCategories] = useState(props.categoryList);
  const renderItemCall = useCallback(({ item, index }) =>
    renderItem({ item, index })
  );
  return (
    <View style={{ flex: 1 }}>
      <FlatList
        columnWrapperStyle={{ justifyContent: "space-between" }}
        extraData={categories}
        contentContainerStyle={{ flex: 1, padding: 10 }}
        numColumns={3}
        data={categories} // data is a constant values in the File scope.
        renderItem={renderItemCall}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
}

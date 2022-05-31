import React, { useState } from "react";
import FastImage from "react-native-fast-image";
import { Image, ImageBackground, View, ActivityIndicator } from "react-native";
import Images from "../config/images";

export default function ImageComponent(props) {
  const [loading, setLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <FastImage
      // key={Math.floor(Math.random())}
      style={props.style}
      source={props.source}
      onLoadStart={() => {
        setLoading(true);
      }}
      onLoadEnd={() => {
        setLoading(false);
      }}
      onError={() => {
        setImageError(true);
      }}
      resizeMode={FastImage.resizeMode.contain}
    >
      {loading || imageError ? (
        <ImageBackground
          style={[
            props.style,
            { alignItems: "center", justifyContent: "center" },
          ]}
          source={
            props.defaultSource
              ? props.defaultSource
              : Images.placeHolderProduct
          }
        >
          {props.hideLoader || imageError ? <View /> : <ActivityIndicator />}
        </ImageBackground>
      ) : (
        <View />
      )}
    </FastImage>
  );
}

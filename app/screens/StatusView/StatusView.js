/**
 * Created by Jebin for iLeaf Solutions Pvt.Ltd
 * on March 26, 2021
 * WishListView - User selected items list out here
 */
import {
  View,
  Text,
  Image,
  StatusBar,
  Dimensions,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import {
  DataProvider,
  LayoutProvider,
  RecyclerListView,
} from "recyclerlistview";
import {
  normalizedHeight,
  normalizedWidth,
  showSingleAlert,
  showSimpleSnackbar,
  showAlertWithCallback,
} from "../../config/common";
import styles from "./styles";
import Video from "react-native-video";
import * as Progress from "react-native-progress";

import React, { Component } from "react";
import Images from "../../config/images";
import Constants from "../../config/constants";
import { translate } from "../../config/languageSwitching/index";

const imageViewTime = 5 * 1000;

const { width, height } = Dimensions.get("window");

class StatusView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeIndex: 0,
      activeUrl: "",
      activeMediaType: "",
      activeVideoProgress: 0,
      isPaused: false,
      activeProduct: null,
      videoArray: [],
      errorInVideo: false,
      loading: true,
      isImagePaused: false,
    };
  }

  componentDidMount() {
    // const { activeIndex, videoArray } = this.state;
    // let activeMediaDict = videoArray[activeIndex];

    // let loading = false;

    // if (activeMediaDict.status_video_type == "image") {
    //   this.imageLoader();
    // } else {
    //   loading = true;
    // }

    // this.setState({
    //   activeUrl: activeMediaDict.status_video,
    //   activeMediaType: activeMediaDict.status_video_type,
    //   activeProduct: activeMediaDict,
    //   loading,
    // });
    this._getStatusItems();
  }

  _getStatusItems = () => {
    let currentSKU = this.props.navigation.state.params.sku;
    let category_id = this.props.navigation.state.params.category_id;

    let params = {
      category_id: category_id,
      product_id: currentSKU,
    };
    this.props.getStatusItems(params, (data) => {
      if (data.length > 0) {
        let index = 0;
        data.map((ff, i) => {
          if (ff.sku === currentSKU) {
            index = i;
          }
        });

        let activeObj = data[index];

        let loading = false;

        if (activeObj.status_video_type == "image") {
          this.imageLoader();
        } else {
          loading = true;
        }

        this.setState({
          activeIndex: index,
          activeUrl: activeObj.status_video,
          activeMediaType: activeObj.status_video_type,
          activeVideoProgress: 0,
          isPaused: false,
          activeProduct: activeObj,
          videoArray: data,
          errorInVideo: false,
          loading: loading,
          isImagePaused: false,
        });
      }
    });
  };

  componentWillUnmount() {
    clearInterval(this.myInterval);
  }

  getNextMedia = () => {
    const { videoArray, activeIndex } = this.state;

    clearInterval(this.myInterval);

    if (activeIndex == videoArray.length - 1) {
      clearInterval(this.myInterval);
      this.props.navigation.pop();
      return;
    }

    let activeMediaDict = videoArray[activeIndex + 1];
    let loading = false;

    if (activeMediaDict.status_video_type == "image") {
      this.imageLoader();
    } else {
      loading = true;
    }

    this.setState({
      activeIndex: activeIndex + 1,
      activeUrl: activeMediaDict.status_video,
      activeMediaType: activeMediaDict.status_video_type,
      activeVideoProgress: 0,
      errorInVideo: false,
      activeProduct: activeMediaDict,
      loading,
    });
  };

  getPreviousMedia = () => {
    const { videoArray, activeIndex } = this.state;

    clearInterval(this.myInterval);

    let activeMediaDict = videoArray[activeIndex - 1];
    let loading = false;

    if (activeMediaDict.status_video_type == "image") {
      this.imageLoader();
    } else {
      loading = true;
    }

    this.setState({
      activeIndex: activeIndex - 1,
      activeUrl: activeMediaDict.status_video,
      activeMediaType: activeMediaDict.status_video_type,
      activeVideoProgress: 0,
      errorInVideo: false,
      activeProduct: activeMediaDict,
      loading,
    });
  };

  imageLoader = () => {
    let counter = 0;
    clearInterval(this.myInterval);

    this.myInterval = setInterval(() => {
      if (this.state.isPaused) {
        return;
      }
      if (counter >= imageViewTime) {
        clearInterval(this.myInterval);
        this.getNextMedia();
      } else {
        counter = counter + 50;
        let progress = (counter * 100) / imageViewTime;
        this.setState({
          activeVideoProgress: progress / 100,
        });
      }
    }, 50);
  };

  render() {
    const {
      activeVideoProgress,
      activeIndex,
      activeProduct,
      videoArray,
      activeUrl,
      errorInVideo,
      loading,
      activeMediaType,
    } = this.state;
    const { appMediaBaseUrl } = this.props;

    if (videoArray.length == 0) {
      return (
        <SafeAreaView
          style={[
            styles.safeContainer,
            { alignItems: "center", justifyContent: "center" },
          ]}
        >
          <ActivityIndicator />
        </SafeAreaView>
      );
    }

    return (
      <SafeAreaView style={styles.safeContainer}>
        <View style={{ flexDirection: "row" }}>
          {videoArray.map((vid, index) => {
            return (
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: 20,
                }}
              >
                <Progress.Bar
                  color={"white"}
                  unfilledColor={"gray"}
                  borderWidth={0}
                  style={{ height: 3 }}
                  progress={
                    index == activeIndex
                      ? activeVideoProgress
                      : index < activeIndex
                      ? 1
                      : 0
                  }
                  width={width / videoArray.length - 5}
                />
              </View>
            );
          })}
        </View>

        {activeMediaType == "image" ? (
          <Image
            source={{ uri: activeUrl }}
            style={{
              overflow: "hidden",
              position: "absolute",
              top: 100,
              right: 0,
              bottom: 100,
              left: 0,
            }}
          />
        ) : (
          <Video
            // {...this.props}
            ref={(videoPlayer) => (this.player = videoPlayer)}
            // resizeMode={this.state.resizeMode}
            // volume={this.state.volume}
            paused={this.state.isPaused}
            // muted={this.state.muted}
            // rate={this.state.rate}
            // onLoadStart={this.events.onLoadStart}
            onProgress={(data) => {
              let progress = (data.currentTime * 100) / data.seekableDuration;
              this.setState({ activeVideoProgress: progress / 100 });
            }}
            onError={() => {
              this.setState({ errorInVideo: true, loading: false });
            }}
            onLoad={() => this.setState({ loading: false })}
            onEnd={() => {
              if (activeIndex == videoArray.length - 1) {
                clearInterval(this.myInterval);
                this.props.navigation.pop();
                return;
              }

              this.getNextMedia();
            }}
            style={{
              // overflow: "hidden",
              position: "absolute",
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
            }}
            source={{ uri: activeUrl }}
          />
        )}

        {errorInVideo ? (
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={styles.errorText}>{"Error in video"}</Text>
          </View>
        ) : loading ? (
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ActivityIndicator />
          </View>
        ) : null}

        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            flexDirection: "row",
          }}
        >
          <TouchableOpacity
            activeOpacity={0}
            style={{
              flex: 1,
              backgroundColor: "rgba(250,250,250,0)",
            }}
            // onPressIn={() => {
            //   this.setState({isPaused: true});
            // }}
            onPressOut={() => {
              this.setState({ isPaused: false });
            }}
            onLongPress={() => {
              this.setState({ isPaused: true });
            }}
            onPress={() => {
              if (activeIndex == 0) {
                return;
              }
              this.getPreviousMedia();
            }}
          />
          <TouchableOpacity
            activeOpacity={0}
            style={{
              flex: 1,
              backgroundColor: "rgba(250,250,250,0)",
            }}
            onPressOut={() => {
              this.setState({ isPaused: false });
            }}
            onLongPress={() => {
              this.setState({ isPaused: true });
            }}
            onPress={() => {
              if (activeIndex == videoArray.length - 1) {
                clearInterval(this.myInterval);
                this.props.navigation.pop();
                return;
              }
              this.getNextMedia();
            }}
          />
        </View>

        <View
          style={{
            height: 40,
            flexDirection: "row",
            alignItems: "center",
            marginHorizontal: 20,
            marginRight: 10,
            marginTop: 10,
          }}
        >
          <Text style={{ color: "white", flex: 1, textAlign: "left" }}>
            {activeProduct.name}
          </Text>
          <TouchableOpacity
            onPress={() => {
              clearInterval(this.myInterval);
              this.props.navigation.pop();
            }}
            style={{
              width: 40,
              height: 40,
              alignItems: "center",
              justifyContent: "center",
            }}
            hitSlop={{ top: 10, left: 10, bottom: 10, right: 10 }}
          >
            <Image source={Images.close} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => {
            this.setState({ isPaused: true });
            clearInterval(this.myInterval);
            this.props.navigation.pop();
            this.props.navigation.state.params.didTapOnProduct(activeProduct);
          }}
          style={{
            position: "absolute",
            bottom: 100,
            left: 20,
            right: 20,
            height: 80,
            backgroundColor: "white",
            borderRadius: 10,
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          <Image
            style={{ width: 40, height: 40, borderRadius: 20, marginLeft: 10 }}
            source={{
              uri: appMediaBaseUrl + activeProduct.thumbnail,
            }}
          />
          <View
            style={{ marginHorizontal: 10, flex: 1, justifyContent: "center" }}
          >
            <Text
              style={{
                fontSize: 14,
                fontFamily: Constants.Fonts.BOLD,
                textAlign: "left",
              }}
            >
              {Number(activeProduct.price).toFixed(3) + " KWD"}
            </Text>
            <Text
              numberOfLines={2}
              style={{
                fontSize: 13,
                fontFamily: Constants.Fonts.REGULAR,
                color: "rgba(110, 110, 110, 1)",
                marginTop: 5,
                textAlign: "left",
              }}
            >
              {activeProduct.name}
            </Text>
          </View>
          {/* <Image style={{ marginRight: 20 }} source={Images.arrowRight} /> */}

          <View
            style={{
              width: 100,
              height: 26,
              backgroundColor: Constants.APP_THEME_COLOR,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 13,
              marginRight: 10,
            }}
          >
            <Text style={styles.viewProductText}>
              {translate("View Product")}
            </Text>
          </View>
        </TouchableOpacity>

        {/* {isLoading && <HudView />} */}
      </SafeAreaView>
    );
  }
}

export default StatusView;

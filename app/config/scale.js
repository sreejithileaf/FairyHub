import {Dimensions} from 'react-native';
const {width,height} = Dimensions.get("window");

const baseHeight = 350;
const baseWidth = 680;

const scale = size => {
    const newScale = width/baseWidth * size;
    return newScale;
};
const verticalScale = size => { return height/baseHeight * size};
const moderateScale = (size, factor=0.5) => { return size + (scale(size)-size)*factor};

export {scale,verticalScale,moderateScale};
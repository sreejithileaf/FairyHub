/**
 * Created by Jebin for iLeaf Solutions Pvt.Ltd
 * on February 19, 2020
 * VideoPlayerContainer -
 */

import {connect} from 'react-redux';
import React, {Component} from 'react';
import VideoPlayerView from './VideoPlayerView';
import * as appActions from '../../actions/appActions';

class VideoPlayerContainer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <VideoPlayerView {...this.props} />;
  }
}

function mapStateToProps(state) {
  return {
    selectedLanguage: state.appReducer.selectedLanguage,
    screenWidth: state.appReducer.screenWidth,
    screenHeight: state.appReducer.screenHeight,
    orientation: state.appReducer.orientation,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    didChangeLAnguage: language => {
      dispatch(appActions.onChangeLanguage(language));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(VideoPlayerContainer);

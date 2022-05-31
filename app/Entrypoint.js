/**
 * Created by Jebin for iLeaf Solutions
 * on February 12, 2020
 * Entrypoint - Everthing starts from the entrypoint.
 */

import Navigator from './navigation';
import {Provider} from 'react-redux';
import React, {Component} from 'react';
import DeviceInfo from 'react-native-device-info';
import Orientation from 'react-native-orientation';
import configureStore from './store/configureStore';
import {PersistGate} from 'redux-persist/es/integration/react';
import {
  ActivityIndicator,
  Text,
  TextInput,
  DeviceEventEmitter,
} from 'react-native';
import OneSignal from 'react-native-onesignal';
import {Adjust, AdjustEvent, AdjustConfig} from 'react-native-adjust';
import Constants from './config/constants';
import * as Sentry from '@sentry/react-native';

const {persistor, store} = configureStore();

export default class Entrypoint extends Component {
  constructor(props) {
    super(props);

    const adjustConfig = new AdjustConfig(
      'jesswnmzxxc0',
      Constants.ADJUST_MODE,
      // AdjustConfig.EnvironmentSandbox
    );
    Adjust.create(adjustConfig);

    //Remove this method to stop OneSignal Debugging
    OneSignal.setLogLevel(6, 0);

    // // Replace 'YOUR_ONESIGNAL_APP_ID' with your OneSignal App ID.
    // OneSignal.init(Constants.ONE_SIGNAL_APP_ID, {
    //   kOSSettingsKeyAutoPrompt: false,
    //   kOSSettingsKeyInAppLaunchURL: false,
    //   kOSSettingsKeyInFocusDisplayOption: 2,
    // });

    OneSignal.setAppId(Constants.ONE_SIGNAL_APP_ID);

    // OneSignal.inFocusDisplaying(2); // Controls what should happen if a notification is received while the app is open. 2 means that the notification will go directly to the device's notification center.

    // The promptForPushNotifications function code will show the iOS push notification prompt. We recommend removing the following code and instead using an In-App Message to prompt for notification permission (See step below)
    OneSignal.promptForPushNotificationsWithUserResponse(
      this.myiOSPromptCallback,
    );

    // OneSignal.addEventListener('received', this.onReceived);
    // OneSignal.addEventListener('opened', this.onOpened);
    // OneSignal.addEventListener('ids', this.onIds);

    //Method for handling notifications received while app in foreground
    OneSignal.setNotificationWillShowInForegroundHandler(
      notificationReceivedEvent => {
        console.log(
          'OneSignal: notification will show in foreground:',
          notificationReceivedEvent,
        );
        let notification = notificationReceivedEvent.getNotification();
        console.log('notification: ', notification);
        const data = notification.additionalData;
        console.log('additionalData: ', data);
        // Complete with null means don't show a notification.
        notificationReceivedEvent.complete(notification);
      },
    );

    //Method for handling notifications opened
    OneSignal.setNotificationOpenedHandler(notification => {
      console.log('OneSignal: notification opened:', notification);
      global.pushNotificationDict = notification.notification.additionalData;

      DeviceEventEmitter.emit(
        'PUSH_NOTIFICATION_OPEN',
        notification.notification.additionalData,
      );
    });

    Text.defaultProps = Text.defaultProps || {};
    Text.defaultProps.allowFontScaling = false;
    TextInput.defaultProps = TextInput.defaultProps || {};
    TextInput.defaultProps.allowFontScaling = false;

    Sentry.init({
      dsn: 'https://5cea68a932d1418185813a15bb4c14aa@o516954.ingest.sentry.io/5707389',
      debug: true,
      environment: 'production',
    });
  }

  componentDidMount() {
    console.disableYellowBox = true;
    let type = DeviceInfo.getDeviceType();
    if (type === 'Handset') {
      Orientation.lockToPortrait();
    }

    global.pushNotificationDict = null;
    global.isDeepLinkOpenResetPassword = false;
    global.isDeepLinkOpenAccountConfirm = false;
    global.isRTL = false;
  }

  componentWillUnmount() {
    // OneSignal.removeEventListener('received', this.onReceived);
    // OneSignal.removeEventListener('opened', this.onOpened);
    // OneSignal.removeEventListener('ids', this.onIds);
    Adjust.componentWillUnmount();
  }

  onReceived(notification) {
    // console.log("Notification received: ", notification);
  }

  // onOpened(openResult) {
  //   global.pushNotificationDict =
  //     openResult.notification.payload.additionalData;

  //   DeviceEventEmitter.emit(
  //     'PUSH_NOTIFICATION_OPEN',
  //     openResult.notification.payload.additionalData,
  //   );
  // }

  onIds(device) {
    console.log('Device info: ', device);
  }

  myiOSPromptCallback(permission) {
    console.log('=========permission=======', permission);
    // do something with permission value
  }

  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={<ActivityIndicator />} persistor={persistor}>
          <Navigator />
        </PersistGate>
      </Provider>
    );
  }
}

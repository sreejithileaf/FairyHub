/**
 * Created by Jebin for ILeaf Solutions Pvt. Ltd.
 * on February 12, 2020
 * Constants - Constant data of the App.
 */

import {Dimensions, Platform} from 'react-native';
const {width, height} = Dimensions.get('window');
import {Adjust, AdjustEvent, AdjustConfig} from 'react-native-adjust';

const mode = 'UAT'; //Change here  for converting "STAGING" or "UAT" or "DEV" or "PRE-LIVE"
let baseUrl = '';
let twakUrl = '';
let adjustMode = '';
let oneSignalAppId = '';
let adminToken = '';
let myFatoorahPaymentUrl = '';

switch (mode) {
  case 'STAGING':
    baseUrl = 'https://admin-staging.fairyhub.com';
    twakUrl = 'https://tawk.to/chat/5faa638d0a68960861bd7cc6/default';
    adjustMode = AdjustConfig.EnvironmentSandbox;
    oneSignalAppId = '45c8cf23-833f-4fb0-b37e-6a4133deb399';
    adminToken = '75bpvontn560cgkdjhk816e5gyvooopz';
    myFatoorahPaymentUrl = 'https://web-uat.fairyhub.com/en/myfatoorah?token=';
    myFatoorahPaymentSuccessUrl =
      'https://web-uat.fairyhub.com/en/myfatoorah-success';
    myFatoorahPaymentFailUrl =
      'https://web-uat.fairyhub.com/en/myfatoorah-error';
    myFatoorahCancelUrl = 'https://web-uat.fairyhub.com/myfatoorah-cancel';
    break;
  case 'UAT':
    baseUrl = 'https://api-uat.fairyhub.com';
    twakUrl = 'https://tawk.to/chat/5faa638d0a68960861bd7cc6/default';
    adjustMode = AdjustConfig.EnvironmentSandbox;
    oneSignalAppId = '45c8cf23-833f-4fb0-b37e-6a4133deb399';
    adminToken = '75bpvontn560cgkdjhk816e5gyvooopz';
    myFatoorahPaymentUrl = 'https://web-uat.fairyhub.com/en/myfatoorah?token=';
    myFatoorahPaymentSuccessUrl =
      'https://web-uat.fairyhub.com/en/myfatoorah-success';
    myFatoorahPaymentFailUrl =
      'https://web-uat.fairyhub.com/en/myfatoorah-error';
    myFatoorahCancelUrl = 'https://web-uat.fairyhub.com/myfatoorah-cancel';
    break;
  case 'DEV':
    baseUrl = 'https://api-dev.fairyhub.com';
    twakUrl = 'https://tawk.to/chat/5faa638d0a68960861bd7cc6/default';
    adjustMode = AdjustConfig.EnvironmentSandbox;
    oneSignalAppId = '45c8cf23-833f-4fb0-b37e-6a4133deb399';
    adminToken = '75bpvontn560cgkdjhk816e5gyvooopz';
    myFatoorahPaymentUrl = 'https://web-uat.fairyhub.com/en/myfatoorah?token=';
    myFatoorahPaymentSuccessUrl =
      'https://web-uat.fairyhub.com/en/myfatoorah-success';
    myFatoorahPaymentFailUrl =
      'https://web-uat.fairyhub.com/en/myfatoorah-error';
    myFatoorahCancelUrl = 'https://web-uat.fairyhub.com/myfatoorah-cancel';
    break;
  case 'PRE-LIVE':
    baseUrl = 'https://api-prelive.fairyhub.com';
    twakUrl = 'https://tawk.to/chat/5d6e3db677aa790be3322605/1ekoem6kc';
    adjustMode = AdjustConfig.EnvironmentProduction;
    oneSignalAppId = 'ff3b463a-61d4-4408-9823-5f73c5e86ad4';
    adminToken = '4i4uqguo3gydvqi9javxgq1i3qvlart4';
    myFatoorahPaymentUrl = 'https://www.fairyhub.com/en/myfatoorah2?token=';
    myFatoorahPaymentSuccessUrl =
      'https://www.fairyhub.com/en/myfatoorah-success';
    myFatoorahPaymentFailUrl = 'https://www.fairyhub.com/en/myfatoorah-error';
    myFatoorahCancelUrl = 'https://www.fairyhub.com/en/myfatoorah-cancel';
    break;
}

export default constants = {
  APP_NAME: 'Fairyhub',
  APP_NAME_ARABIC: 'فيري هب',

  APP_BASE_URL: baseUrl,
  APP_S3_BASE_URL: 'https://elogics-media.s3-eu-west-1.amazonaws.com/',
  CHAT_TAWK_URL: twakUrl,
  ADJUST_MODE: adjustMode,
  ONE_SIGNAL_APP_ID: oneSignalAppId,

  ADMIN_TOKEN: adminToken,
  MYFATOORAH_PAYMENT_URL: myFatoorahPaymentUrl,
  MYFATOORAH_PAYMENT_SUCCESS_URL: myFatoorahPaymentSuccessUrl,
  MYFATOORAH_PAYMENT_FAIL_URL: myFatoorahPaymentFailUrl,
  MYFATOORAH_CANCEL_URL: myFatoorahCancelUrl,

  APP_VERSION: Platform.OS === 'ios' ? '2.6.1' : '1.6.1',

  APP_VERSION_IOS: '2.6.1',
  APP_VERSION_ANDROID: '1.6.1',

  APP_BASE_HEIGHT: 896,
  APP_BASE_WIDTH: 414,

  Fonts: {
    LEXENDREGULAR: Platform.OS === 'ios' ? 'LexendDeca_regular' : 'LexendDeca_regular',
    LEXENDBOLD: Platform.OS === 'ios' ? 'LexendDeca_Bold' : 'LexendDeca_Bold',
    LEXENDMEDIUM: Platform.OS === 'ios' ? 'LexendDeca_Medium' : 'LexendDeca_Medium',
    LEXENDLIGHT: Platform.OS === 'ios' ? 'LexendDeca_Light' : 'LexendDeca_Light',
    LEXENDEXTRALIGHT: Platform.OS === 'ios' ? 'LexendDeca_ExtraLight' : 'LexendDeca_ExtraLight',
    SPACEGROTESKMEDIUM: Platform.OS === 'ios' ? 'SpaceGrotesk_Medium' : 'SpaceGrotesk_Medium',

    BOLD: Platform.OS === 'ios' ? 'lato-bold' : 'lato_bold',
    LIGHT: Platform.OS === 'ios' ? 'Roboto-Light' : 'Roboto_Light',
    MEDIUM: Platform.OS === 'ios' ? 'lato-medium' : 'lato_medium',
    REGULAR: Platform.OS === 'ios' ? 'lato-regular' : 'lato_regular',
    GIFT_WRAPPER_CAIRO: Platform.OS === 'ios' ? 'Cairo' : 'Cairo',
    GIFT_WRAPPER_COMIC_SANS:
      Platform.OS === 'ios' ? 'ComicSansMS' : 'comic_sans',
    GIFT_WRAPPER_PALACE_SCRIPT:
      Platform.OS === 'ios' ? 'PalaceScriptMT' : 'PalaceScriptMT',
    GIFT_WRAPPER_SEGOE:
      Platform.OS === 'ios' ? 'SegoeUI-Light' : 'segoeUI_Light',
    MYRIAD: Platform.OS === 'ios' ? 'MyriadPro-Bold' : 'Myriad-Bold',
  },

  PRIVACY_POLICY_URL: '',
  TERMS_AND_CONDITIONS_URL: '',

  APP_DARKBLUE_COLOR: 'rgb(20,68,147)',
  APP_THEME_COLOR: 'rgb(246,155,32)',
  APP_THEME_COLOR2: 'rgb(246,125,32)',
  APP_GRAY_COLOR: 'rgb(109,109,109)',
  APP_GRAY_COLOR2: 'rgb(241,243,246)',
  APP_GRAY_COLOR3: 'rgb(120,120,120)',
  APP_GRAY_COLOR4: 'rgb(217,217,217)',
  APP_GRAY_COLOR5: 'rgb(105, 113, 128)',
  APP_GRAY_COLOR6: 'rgb(40, 48, 63)',
  APP_WHITE_COLOR: '#FFFFFF',
  APP_TEXT_PINK_COLOR: 'rgb(203,39,100)',
  APP_BLACK_COLOR: '#000000', //"#282828",
  APP_THEME_DARK_GRAY: 'rgb(26, 26, 24)',
  APP_THEME_DARK_YELLOW: 'rgb(207, 155, 61)',
  APP_SEPARATOR_COLOR: '#E7E6E6',
  APP_GREY_TEXT_COLOR: 'rgb(104,108,126)',
  APP_BOX_BACKGROUND_GREY: 'rgb(244,246,248)',
  APP_RED_COLOR: 'rgb(249,91,91)',
  APP_RED_COLOR2: 'rgb(219, 71, 61)',
  APP_BLUE_COLOR: '#0894FD',
  APP_TRANSPARENT_COLOR: 'transparent',
  APP_OUT_OF_STOCK_TEXT: '#b51818',
  APP_BACKGROUND_WHITE: 'rgb(245,245,245)',
  APP_GREEN_COLOR: 'rgb(68,200,86)',
  APP_COLOR_GIRL: 'rgb(251,132,173)',
  APP_COLOR_BOY: '#0D86FF',

  SCREEN_WIDTH: width,
  SCREEN_HEIGHT: height,

  ACTIVE_OPACITY: 0.7,

  PRODUCTS_PAGE_COUNT: 20,

  IS_ANDROID: Platform.OS === 'ios' ? false : true,

  IOS_VERSION: parseInt(Platform.Version, 10),

  MAX_PRODUCT_COUNT: 20,
  MAX_CART_SIZE: 20,
};

/**
 * Created by Jebin for ILeaf Solutions Pvt. Ltd.
 * on February 12, 2020
 * LanguageSwitching - Handles language switching operations.
 */

import * as RNLocalize from 'react-native-localize';
import i18n from 'i18n-js';
import memoize from 'lodash.memoize';
import {I18nManager} from 'react-native';

export function setI18nConfig() {
  // fallback if no available language fits
  const fallback = {languageTag: 'en', isRTL: false};

  const {languageTag, isRTL} =
    RNLocalize.findBestAvailableLanguage(Object.keys(translationGetters)) ||
    fallback;

  // clear translation cache
  translate.cache.clear();
  // update layout direction
  I18nManager.forceRTL(isRTL);
  // set i18n-js config
  i18n.translations = {[languageTag]: translationGetters[languageTag]()};
  i18n.locale = languageTag;
}

export function setI18nConfigSecondTime(selectedLanguage) {
  // fallback if no available language fits

  const fallback =
    selectedLanguage == 'ar'
      ? {languageTag: 'ar', isRTL: true}
      : {languageTag: 'en', isRTL: false};

  const {languageTag, isRTL} = fallback;

  // clear translation cache
  translate.cache.clear();
  // update layout direction
  I18nManager.forceRTL(isRTL);
  // set i18n-js config
  i18n.translations = {[languageTag]: translationGetters[languageTag]()};
  i18n.locale = languageTag;
}

export const translationGetters = {
  en: () => require('./en.json'),
  ar: () => require('./ar.json'),
};

export const translate = memoize(
  (key, config) => i18n.t(key, config),
  (key, config) => (config ? key + JSON.stringify(config) : key),
);

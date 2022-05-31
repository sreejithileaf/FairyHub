/**
 * Created by Jebin for ILeaf Solutions Pvt. Ltd.
 * on February 12, 2020
 * CommonStyles - App common styles.
 */

import Constants from '../config/constants';

export default commonStyles = {
  buttonStyle: {
    borderRadius: 5,
    backgroundColor: 'red',
  },
  noDataFoundContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  noDataFoundText: {
    fontSize: 14,
    fontFamily: Constants.Fonts.REGULAR,
    color: Constants.APP_GRAY_COLOR3,
    marginVertical: 20,
  },
};

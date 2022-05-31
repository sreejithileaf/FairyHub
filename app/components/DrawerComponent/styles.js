import {StyleSheet} from 'react-native';
import AppStyles from '../../config/styles';

const styles = StyleSheet.create({
  safeContainer: {flex: 1, backgroundColor: '#005776'},
  container: {
    justifyContent: 'space-evenly',
    flex: 1,
    marginLeft: 10,
  },
  text: {fontSize: 14, color: AppStyles.color.COLOR_WHITE},
});

export default styles;

import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Constants from '../config/constants';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        padding: 10,
        marginLeft:16,
        marginRight:16,
        marginTop: 5,
        marginBottom: 5,       
        backgroundColor: '#FFF',
        
    },
   
    container_text: {
        flex: 1,
        flexDirection: 'column',
        marginLeft: 10,
        justifyContent: 'center',
    },
    status: { 
        color: Constants.APP_BLACK_COLOR,
        fontFamily: Constants.Fonts.REGULAR,
        fontWeight: 'bold',
        fontSize: 14,
    },
    description: {
        color: Constants.APP_GRAY_COLOR,
        fontFamily: Constants.Fonts.REGULAR,       
        fontSize: 12,
        marginTop: 5
    },
    dates: {
        color: Constants.APP_GRAY_COLOR,
        fontFamily: Constants.Fonts.REGULAR,       
        fontSize: 11,
        marginTop: 5
    },
   
});
const TrackOrderRow = ({ status, description, dates }) => (
    <View style={styles.container}>      
        <View style={styles.container_text}>
            <Text style={styles.status}>
                {status}
            </Text>
            <Text style={styles.description}>
                {description}
            </Text>
            <Text style={styles.dates}>
                {dates}
            </Text>
        </View>
    </View>
);
export default TrackOrderRow;
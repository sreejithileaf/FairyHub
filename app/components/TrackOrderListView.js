import React from 'react';
import { View, ListView, FlatList, StyleSheet, Text } from 'react-native';
import TrackOrderRow from './TrackOrderRow';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});



const TrackOrderListView = ({ itemList }) => (
    
    <View style={styles.container}>
        <FlatList
                data={itemList}
                renderItem={({ item }) => <TrackOrderRow
                    status={item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    description={item.comment}  
                    dates={item.date}                    
                />}
            />

    </View>
);

export default TrackOrderListView;
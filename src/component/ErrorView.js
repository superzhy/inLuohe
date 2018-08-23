import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    ActivityIndicator
} from 'react-native';

import EvilIcons from "react-native-vector-icons/EvilIcons"

export const  ErrorView= (props) => {
    return (
        <View style={styles.container}>
            <Text>接口返回数据错误</Text>
        </View>
    );
};



const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
});



// export default  LoadingToast;



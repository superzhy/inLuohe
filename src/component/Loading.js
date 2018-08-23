import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    ActivityIndicator
} from 'react-native';

import EvilIcons from "react-native-vector-icons/EvilIcons"

export const  LoadingView= (props) => {
    return (
        <View style={styles.container}>
            {/*<ActivityIndicator*/}
                {/*animating={true}*/}
                {/*color='red'*/}
                {/*size="large"*/}
            {/*/>*/}

            <Image source={require('../images/icon/luo.png')}  style={{width:52,height:60}}/>
            <Text style={{color:'#666',marginTop:20}}>拼命加载中</Text>
        </View>
    );
};

export const  LoadingToast= (props) => {
    return (
        <Text>11</Text>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        // flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
});



// export default  LoadingToast;



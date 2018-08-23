import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Image,
    TextInput,
    TouchableOpacity
} from 'react-native';

import EvilIcons from "react-native-vector-icons/EvilIcons"

const ColumnTitle = (props) => {
    const {title,arrow=true} = props;
    return (
        <View style={styles.columnTitle}>
            <View style={styles.columnTitleCont}>
                <View style={{height:2,backgroundColor:'red',width:100,alignSelf:'center'}}/>
                <View style={styles.columnTitle_text}>
                    <Text style={{fontSize:15,textAlign:'center',backgroundColor:"#fff"}}>{title}</Text>
                </View>
            </View>
            {
               arrow && <EvilIcons name="chevron-right" size={30} color="#333"/>
            }

        </View>
    )
}

const styles = StyleSheet.create({
    columnTitle: {
        height: 40,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal:15,
        backgroundColor:'#fff'
    },
    columnTitleCont:{
        flex:1,
        position:"relative",
        height:20,
        justifyContent:'center'
    },
    columnTitle_text:{
        minWidth:60,
        height:20,
        left:0,
        top:0,
        right:0,
        bottom:0,
        justifyContent:'center',
        alignItems:'center',
        position: 'absolute',

        backgroundColor:"transparent"
    },
});


export default  ColumnTitle;



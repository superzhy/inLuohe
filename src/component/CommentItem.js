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
import {setDate} from '../utils/DateUtil'

const CommentItem = (props) => {
    const {data} = props;
    return (
        <View style={styles.container}>
            <Image source={{uri:data.head_img}} style={styles.userImg}/>
            <View style={{flex:1,paddingTop:10,marginLeft:5,}}>
                <View style={styles.userInfo}>
                    <Text style={styles.userInfo_text}>{data.u_name}</Text>
                    {/*<TouchableOpacity style={styles.likes}>*/}
                        {/*<Text style={styles.userInfo_text}>100</Text>*/}
                    {/*</TouchableOpacity>*/}
                </View>

                <Text style={styles.comment_cont} numberOfLines={3}>
                    {
                        data.content
                    }
                </Text>

                <Text style={styles.time}>{setDate(data.created_at)}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        flexDirection:'row',
        paddingVertical:23/2,
        borderBottomWidth:1,
        borderColor:'#eee'
    },
    userImg:{
        width:40,
        height:40,
        borderRadius:20,
        backgroundColor:'#ddd'
    },
    userInfo:{
        flexDirection:'row',
        justifyContent:'space-between'
    },
    userInfo_text:{
        fontSize:24/2,
        lineHeight:33/2,
        color:'#999'
    },

    //点赞
    likes:{
        flexDirection:'row',
    },
    comment_cont:{
        marginTop:5,
        fontSize:28/2,
        lineHeight:40/2,
        color:'#333'
    },
    time:{
        marginTop:10,
        fontSize:20/2,
        lineHeight:28/2,
        color:'#999'
    }
});


export default  CommentItem;



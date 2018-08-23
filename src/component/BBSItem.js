import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Image,
    TextInput,
    TouchableOpacity,
    Dimensions,
    FlatList
} from 'react-native';

import Icon from "react-native-vector-icons/Ionicons"
import EvilIcons from "react-native-vector-icons/EvilIcons"
import {setDate} from '../utils/DateUtil'



//本地资讯item
export default class BBSItem extends Component {


    render() {
        const {data,goDetails} = this.props;
        console.log(goDetails)
        return (
            <TouchableOpacity style={styles.container} onPress={()=>{goDetails(data.id)}}>
                <View style={{flex:1}}>
                    <Text style={styles.title} numberOfLines={data.image?1:2}>{data.title}</Text>
                    <View style={styles.info}>
                        <Image source={{uri:data.head_img}} style={{width:22,height:22,borderRadius:11,backgroundColor:'#ddd'}}/>
                        <Text style={styles.userName} numberOfLines={1}>{data.u_name}</Text>
                        <Text style={styles.time}>{setDate(data.created_at)}</Text>
                    </View>
                </View>
                {
                    data.imgs && <Image source={{uri:data.imgs}} style={styles.img}/>
                }
            </TouchableOpacity>
        );
    }
}

const ScreenWidht = Dimensions.get('window').width;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection:'row',
        alignItems:'center',
        paddingVertical:25/2,
        borderBottomWidth:1,
        borderColor:"#eee"
    },
    title:{
        fontSize:28/2,
        lineHeight:40/2
    },
    info:{
        marginTop:5,
        flexDirection:'row',
        alignItems:'center'
    },
    userName:{
        marginHorizontal:6,
        width:180/2,
        fontSize:24/2,
        lineHeight:33/2,
        color:'#666'
    },
    time:{
        fontSize:20/2,
        lineHeight:28/2,
        color:'#999'
    },
    img:{
        width:70,
        height:50,
        backgroundColor:'#ddd'
    }
});
import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Image,
    TextInput,
    TouchableOpacity,
    Dimensions
} from 'react-native';

import Icon from "react-native-vector-icons/Ionicons"
import {setDate} from '../utils/DateUtil'

//本地资讯item
export default class LocalNewItem extends Component {


    render() {
        const {openPage,data} = this.props;
        console.log(data);
        return (
            <TouchableOpacity style={styles.container} activeOpacity={0.9} onPress={()=>{openPage()}}>
                <Image source={{uri:data.cover}} style={styles.img}/>
                <View style={styles.cont}>
                    {/*标题*/}
                    <View style={styles.title}>
                        <Text
                            styl={styles.title_text}
                            numberOfLines={2}
                        >
                            {data.title}
                        </Text>
                    </View>
                    {/* 底部*/}
                    <View style={styles.bottom}>
                        <Text style={styles.date}>{setDate(data.created_at)}</Text>
                        <Icon name='ios-arrow-round-forward' size={20} color='#999'/>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}

const ScreenWidht = Dimensions.get('window').width;
const styles = StyleSheet.create({
    container: {
        width:ScreenWidht-30,
        paddingVertical:15,
        flexDirection:'row',
        backgroundColor:'#fff',
        borderBottomWidth:1,
        borderStyle:'solid',
        borderColor:'#eee'
    },
    img:{
        width:100,
        height:70,
    },
    cont:{
        marginLeft:10,
        flex:1,
    },
    title:{
      height:85/2
    },
    title_text:{
        fontSize:14,
        lineHeight:20,
    },
    bottom:{
        marginTop:29/2,
        flexDirection:"row",
        justifyContent:'space-between',
    },
    date:{
        fontSize:10,
        lineHeight:14,
        color:'#999'
    }

});
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


//本地资讯item
export default class MallItem extends Component {


    render() {
        const {index,onPress,data} = this.props
        return (
            <TouchableOpacity style={[styles.container, (index + 1) % 2 === 0 && {marginLeft: 5}]} activeOpacity={0.9} onPress={onPress}>
                <Image source={{uri:data.cover}}  style={styles.itemImg}/>
                <View style={styles.itemCont}>
                    <Text numberOfLines={2} style={styles.itemTitle}>{data.name}</Text>
                    <View style={styles.middle}>
                        <Text style={styles.middle_text}>市场价￥{data.market_price}</Text>
                        <Text style={styles.middle_text}>月销{data.sale_num}</Text>
                    </View>
                    <View style={styles.bottom}>
                        <Text style={styles.presentPrice}>￥{data.shop_price}</Text>
                        <TouchableOpacity style={styles.payBtn}>
                            <Text style={{fontSize:10,lineHeight:14,color:'#fff'}}>去购买</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}

const ScreenWidht = Dimensions.get('window').width;
const itemWidth = (ScreenWidht - 5) / 2;
const itemHeight = itemWidth / 0.660;
const styles = StyleSheet.create({
    container: {
        marginTop: 5,
        width: itemWidth,
        height: itemHeight,
        backgroundColor: '#fff',
    },
    itemImg:{
        width:itemWidth,
        height:itemWidth
    },
    itemCont:{
        paddingHorizontal:25/2,
    },
    itemTitle:{
        fontSize:26/2,
        lineHeight:37/2
    },
    middle:{
        marginTop:23/2,
        flexDirection:'row',
        justifyContent:'space-between'
    },
    middle_text:{
        fontSize:20/2,
        lineHeight:28/2,
        color:'#999'
    },
    bottom:{
        marginTop:9/2,
        flexDirection:'row',
        justifyContent:'space-between'
    },
    presentPrice:{
        fontSize:26/2,
        lineHeight:37/2,
        color:'#FF5C60'
    },
    payBtn:{
        width:98/2,
        height:30/2,
        alignItems:'center',
        justifyContent:'center',
        borderRadius:30/2/2,
        backgroundColor:'#ff5c60'
    }

});
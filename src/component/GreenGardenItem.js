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
export default class GreenGardenItem extends Component {


    render() {
        const {openPage,data} = this.props
        return (
            <TouchableOpacity style={styles.container} activeOpacity={0.9} onPress={() => {
                openPage()
            }}>
                <Image source={{uri:data.cover}} style={styles.img}/>
                <View style={styles.cont}>
                    {/*标题*/}
                    <Text
                        style={styles.title_text}
                        numberOfLines={1}
                    >
                        {data.name}
                    </Text>
                    <Text style={styles.oldPrice}>市场价：¥{data.market_price}</Text>
                    {/* 底部*/}
                    <View style={styles.bottom}>
                        <Text style={styles.nowPrice}>店铺售价：¥{data.shop_price}</Text>
                        <Text style={styles.num}>已售{data.sale_num}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}

const ScreenWidht = Dimensions.get('window').width;
const styles = StyleSheet.create({
    container: {
        width: ScreenWidht - 30,
        paddingVertical: 15,
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderStyle: 'solid',
        borderColor: '#eee'
    },
    img: {
        width: 100,
        height: 70,
    },
    cont: {
        marginLeft: 10,
        flex: 1,
    },
    title_text: {
        fontSize: 14,
        lineHeight: 20,
    },
    oldPrice: {
        marginVertical:16/2,
        fontSize: 10,
        lineHeight: 14,
        color: "#999"
    },
    bottom: {
        flexDirection: "row",
        justifyContent: 'space-between',
        alignItems:'center'
    },
    nowPrice: {
        fontSize: 13,
        lineHeight: 37/2,
        color: '#FF5C60'
    },
    num:{
        fontSize:10,
        lineHeight:14,
        color:"#999"
    }

});
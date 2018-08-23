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
    Button
} from 'react-native';

import Icon from "react-native-vector-icons/Ionicons"
import EvilIcons from "react-native-vector-icons/EvilIcons"



class SetNumber extends React.Component {
    render() {
        return (
            <View style={{flexDirection:'row',alignItems:'center'}}>
                <TouchableOpacity style={{width:30,height:25,backgroundColor:'#f5f5f5',justifyContent:'center',alignItems:'center'}}>
                    <Text style={{color:'#cbcbcb'}}>-</Text>
                </TouchableOpacity>
                <View style={{paddingHorizontal:10,height:25,backgroundColor:'#f5f5f5',justifyContent:'center',alignItems:'center',marginHorizontal:3}}>
                    <Text style={{color:'#333'}}>1</Text>
                </View>
                <TouchableOpacity style={{width:30,height:25,backgroundColor:'#f5f5f5',justifyContent:'center',alignItems:'center'}}>
                    <Text style={{color:'#cbcbcb'}}>+</Text>
                </TouchableOpacity>
            </View>
        );
    }
}


export default class GoodsComment extends Component {


    render() {
        const {close,data} = this.props;
        // console.log(data);
        return (
            <View style={styles.container}>
                <View style={styles.wrap}>
                    {/*关闭按钮*/}
                    <View style={{alignItems:'flex-end',paddingTop:15}}>
                        <TouchableOpacity style={{width:17,height:17}} onPress={()=>{close()}}>
                            <Image source={require('../images/icon/close.png')} style={{width:17,height:17}} />
                        </TouchableOpacity>
                    </View>

                    {/* 图片 */}
                    <Image source={{uri:data.cover}} style={{marginVertical:15,width:200,height:200,alignSelf:'center',backgroundColor:'#ddd'}}/>
                    <Text style={styles.basic_text}>￥{data.shop_price}</Text>
                    <Text style={[styles.basic_text,{color:'#333'}]}>库存{data.product_stock}份</Text>


                    {/*地址*/}
                    {/*<View style={styles.address}>*/}
                        {/*<View>*/}
                            {/*<View style={{flexDirection:'row'}}>*/}
                                {/*<Text style={{fontSize:15,lineHeight:21}}>配送区域</Text>*/}
                                {/*<Text style={{fontSize:12,lineHeight:21,color:'#3f3f3f'}}>(配送区域可能会影响库存，请正确选择)</Text>*/}
                            {/*</View>*/}
                            {/*<View style={{flexDirection:'row',alignItems:'center'}}>*/}
                                {/*<Icon name='ios-pin-outline' size={25} color='#333'/>*/}
                                {/*<Text style={styles.addressCont} numberOfLines={1}>漯河市 源汇区 人民路123号</Text>*/}
                            {/*</View>*/}
                        {/*</View>*/}
                        {/*<Icon name='ios-arrow-forward-outline' size={25} color='#333'/>*/}
                    {/*</View>*/}


                    {/*数量*/}

                    <View style={styles.number}>
                        <View style={{flexDirection:'row',alignItems:'flex-end'}}>
                            <Text style={{fontSize:15,lineHeight:21}}>购买数量</Text>
                        </View>

                        <SetNumber/>
                    </View>

                    <TouchableOpacity style={styles.okBtn}>
                        <Text style={{color:'#fff'}}>确定</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const ScreenWidht = Dimensions.get('window').width;
const styles = StyleSheet.create({
    container: {
        flex:1,
        justifyContent:'flex-end',
        backgroundColor:'rgba(0,0,0,.3)',
    },
    wrap:{
        paddingHorizontal:15,
        height:980/2,
        backgroundColor:'#fff'
    },


    basic_text:{
        fontSize:14,
        lineHeight:20,
        textAlign:'center',
        color:'#FF5C60'
    },

    address:{
        marginTop:12,
        paddingVertical:20,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        borderWidth:1,
        borderStyle:'solid',
        borderColor:'#eee',
        borderLeftWidth:0,
        borderRightWidth:0,
    },
    commonTitle:{
        flexDirection:'row'
    },
    addressCont:{
        marginLeft:10,
        fontSize:15,
        lineHeight:21,
        color:'#333'
    },
    number:{
        marginTop:20,
        flexDirection:'row',
        justifyContent:'space-between'
    },
    okBtn:{
        marginTop:50,
        height:45,
        justifyContent:'center',
        alignItems:'center',
        borderRadius:5,
        backgroundColor:'#FF5C60'
    }


});
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
import OrderComment from "../pages/OrderComment";

//本地资讯item
export default class OrderItem extends Component {


    /**
     * 订单状态
     * @private
     */
    _renderOrderStatus(_status){
        // return <Text style={{color:'#FF5C60'}}>待付款</Text>
        switch (_status){
            case 'P':
                return <Text style={{color:'#FF5C60'}}>待付款</Text>;
               break;
            case 'Y':
                return <Text style={{color:'#FF5C60'}}>待发货</Text>;
                break;
            case 'F':
                return <Text style={{color:'#FF5C60'}}>待收货</Text>;
                break;
            case 'W':
                return <Text style={{color:'#FF5C60'}}>待评价</Text>;
                break;
                case 'C':
                return <Text style={{color:'#FF5C60'}}>已取消</Text>;
                break;
        }
    }


    /**
     * 生成底部选项
     */
    _renderOptions(_status,_id){
        const {goPage,update,toPay} = this.props;

        console.log(goPage);
        switch (_status){
            case 'P':
                return (
                    <View style={styles.options}>
                        <TouchableOpacity style={styles.optionsItem} onPress={()=>{
                            update(_id,_status)
                        }}>
                            <Text style={[styles.options_text,{}]}>取消订单</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.optionsItem,{borderColor:'#ff5c60'}]} onPress={()=>{
                            toPay(_id)
                        }}>
                            <Text style={[styles.options_text,{color:'#ff5c60'}]}>付款</Text>
                        </TouchableOpacity>
                    </View>
                );
                break;
            case 'Y':
                return;
                break;
            case 'F':
                return(
                    <View style={styles.options}>
                        <TouchableOpacity style={[styles.optionsItem,{borderColor:'#ff5c60'}]} onPress={()=>{
                            goPage('OrderTrack',_id,_status)
                        }}>
                            <Text style={[styles.options_text,{color:'#ff5c60'}]}>查看物流</Text>
                        </TouchableOpacity>
                    </View>
                );
                break;
            case 'W':
                return(
                    <View style={styles.options}>
                        <TouchableOpacity style={[styles.optionsItem,{borderColor:'#ff5c60'}]} onPress={()=>{
                            goPage('OrderComment',_id,_status)
                        }}>
                            <Text style={[styles.options_text,{color:'#ff5c60'}]}>去评价</Text>
                        </TouchableOpacity>
                    </View>
                )
                break;
        }
        return
    }
    render() {
        const {data} = this.props;
        console.log(data);
        return (
            <View style={styles.container} activeOpacity={0.9} onPress={()=>{}}>
                <View style={styles.top}>
                    <Text>编号</Text>
                    {
                        this._renderOrderStatus(data.status)
                    }
                </View>


                <View style={styles.goods}>
                    <Image source={{uri:data.product.cover}} style={styles.goodsImg}/>
                    <View style={{flex:1,paddingTop:5,}}>
                        <Text style={styles.goodsName_text} numberOfLines={2}>{data.product.name}</Text>

                        <View style={styles.spec}>
                            {
                                data.spec.map((item,index)=>{
                                    return <Text key={index} style={styles.spec_text}>{item.cat_name}:{item.item_name}</Text>
                                })
                            }
                        </View>

                        <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                            <Text style={styles.price}>¥{data.price}</Text>
                            <Text style={styles.number}>x{data.buy_num}</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.totalPrice}>
                    <Text style={styles.totalPrice_Text}>共{data.buy_num}件商品</Text>
                    <Text style={styles.totalPrice_Text}>小计：¥{data.total_price}</Text>
                </View>



                {/*生成底部选项*/}
                {
                    this._renderOptions(data.status,data.id)
                }
            </View>
        );
    }
}

const ScreenWidht = Dimensions.get('window').width;
const styles = StyleSheet.create({
    container: {
        marginBottom:10,
        width:ScreenWidht,
        backgroundColor:'#fff',
    },
    top:{
        paddingHorizontal:15,
        height:40,
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        backgroundColor:'#fff'
    },
    goods:{
        paddingHorizontal:15,
        flexDirection:'row',
        backgroundColor:'#f8f8f8',
    },
    goodsImg:{
        marginRight:10,
        width:90,
        height:90,
        backgroundColor:'#ddd'
    },
    goodsName_text:{
        fontSize:24/2,
        lineHeight:33/2,
    },
    spec:{
      marginTop:5,
    },
    spec_text:{
        fontSize:10,
        lineHeight:28/2,
        color:'#999'
    },
    price:{
        fontSize:24/2,
        lineHeight:33/2,
        color:"#FF5C60"
    },
    number:{
        fontSize:10,
        lineHeight:28/2,
        color:'#000'
    },
    totalPrice:{
        height:40,
        paddingHorizontal:15,
        flex:1,
        flexDirection:"row",
        justifyContent:'flex-end',
        alignItems:'center'
    },

    totalPrice_Text:{
        fontSize:26/2,
        lineHeight:37/2,
    },
    options:{
        paddingHorizontal:15,
        height:40,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'flex-end',
        borderWidth:.5,
        borderColor:'#eee',
    },
    optionsItem:{
        marginLeft:10,
        width:150/2,
        height:50/2,
        alignItems:'center',
        justifyContent:'center',
        borderWidth:1,
        borderColor:'#666',
        borderRadius:25/2,
    },
    options_text:{
        fontSize:10,
        lineHeight:28/2,
        color:'#666'
    }
});
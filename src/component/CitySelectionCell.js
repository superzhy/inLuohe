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


//城市精选item
export default class CitySelectionCell extends Component {

    state = {
        secureTextEntry: true,
        countDown: true,
        count: 60,
        likesActive:this.props.likesActive
    };

    /**
     *@desc 点赞选中
     */
    _likes=(likes)=>{

        this.setState({
            likesActive:true
        });
        likes()
    };

    render() {
        const {likesActive} = this.state;
        const {likes,openPage,data} = this.props;
        return (
            <TouchableOpacity style={styles.container} activeOpacity={0.9} onPress={()=>{openPage()}}>
                {/*<Image source={require('../images/csjx_img1.png')} style={styles.img}/>*/}
                <Image source={{uri:data.cover}} style={styles.img}/>
                <View style={styles.info}>

                    {/* 店铺*/}
                   <View style={styles.shop}>
                       <View style={styles.shopMain}>
                           <Image source={{uri:data.shop_img}} style={{height:23,width:23,borderRadius:23/2}}/>
                           <Text style={{fontSize:15,lineHeight:21,marginLeft:10}}>{data.m_name}</Text>
                       </View>
                       {
                           <View style={styles.score} activeOpacity={0.8} onPress={()=>{this._likes(likes)}}>
                               <Icon name={'ios-eye-outline'} size={20} color={"#999"}/>
                               <Text style={[{fontSize:15,lineHeight:15,marginLeft:5,},likesActive?{color:'#FF5C60'}:{color:'#999'}]}>{data.visit_num}</Text>
                           </View>
                       }

                   </View>

                    {/* 内容*/}
                    <Text style={styles.content_text} numberOfLines={2}>
                        {data.title}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    }
}

const {height, width} = Dimensions.get('window');
const styles = StyleSheet.create({
    container: {
        flex: 1,
        width:width-30,
        backgroundColor:'#fff',
        borderRadius:5,
    },
    img:{
        width:width-30,
        height:(width-30)/2.3
    },
    info:{
        paddingHorizontal:10,
        paddingVertical:13
    },
    shop:{
        flexDirection:'row',
        justifyContent:'space-between',
    },
    shopMain:{
        flex:1,
        flexDirection:'row',
        alignItems:'center'
    },
    score:{
        position:'relative',
        zIndex:1,
        flexDirection:'row',
        alignItems:'center'
    },
    content_text:{
        marginTop:10,
        fontSize:12,
        lineHeight:16.5,
        color:'#999'
    }

});
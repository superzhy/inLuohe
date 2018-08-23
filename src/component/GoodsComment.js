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
import EvilIcons from "react-native-vector-icons/EvilIcons"


//本地资讯item
export default class GoodsComment extends Component {
    /**
     *@desc 设置用户名字格式
     *@param {string} name
     */
    _setName(name) {
        const first = name.substr(0, 1);
        const last = name.substr(-1);
        return first + '****' + last
    };


    /**
     *@desc 生成评论图片
     *@param {array} _ImgList
     */
    _renderCommentImg(_ImgList){
        return _ImgList.map((item,index)=>{
            return <Image key={index} source={{uri:item}} style={[styles.imgItem,(index+1)%3===0&&{marginRight:0}]} activeOpacity={0.6}>

            </Image>
        })
    };


    render() {
        const {data,goComment} = this.props;
        return (
            <View style={styles.container}>
                <View style={styles.title}>
                    <Text style={styles.title_text}>
                        商品评价({data.length})
                    </Text>
                    <TouchableOpacity style={[styles.row, {alignItems: 'flex-end'}]} activeOpacity={0.6} onPress={()=>{goComment()}}>
                        <Text style={[styles.title_text, {color: '#FF5C60'}]}>查看全部</Text>
                        <EvilIcons name='chevron-right' size={25} color='#FF5C60'/>
                    </TouchableOpacity>
                </View>

                {/* 关键字 */}
                {/*<View style={styles.Keyword}>*/}
                    {/*<View style={styles.KeywordItem}>*/}
                        {/*<Text style={styles.KeywordItem_text}>口感不错</Text>*/}
                    {/*</View>*/}
                    {/*<View style={styles.KeywordItem}>*/}
                        {/*<Text style={styles.KeywordItem_text}>口感不错</Text>*/}
                    {/*</View>*/}
                    {/*<View style={styles.KeywordItem}>*/}
                        {/*<Text style={styles.KeywordItem_text}>口感不错</Text>*/}
                    {/*</View>*/}
                    {/*<View style={styles.KeywordItem}>*/}
                        {/*<Text style={styles.KeywordItem_text}>口感不错</Text>*/}
                    {/*</View>*/}
                {/*</View>*/}

                {/* 评论项 */}
                <View style={styles.content}>

                    {/*<View style={styles.commentItem}>*/}
                        {/*<View style={styles.commentHead}>*/}
                            {/*<View style={styles.row}>*/}
                                {/*<View style={{width: 22, height: 22, backgroundColor: '#ddd'}}/>*/}
                                {/*<Text style={styles.userName}>{this._setName('辅导时间了飞机上的')}</Text>*/}
                                {/*<View style={styles.userTime}>*/}
                                    {/*<Text style={{fontSize: 10, lineHeight: 14, color: '#FFE1B0'}}>已加入80天</Text>*/}
                                {/*</View>*/}
                            {/*</View>*/}

                            {/*<Text style={styles.commentTime}>2018-06-08</Text>*/}
                        {/*</View>*/}

                        {/*/!* 评论内容 *!/*/}
                        {/*<View style={{marginTop:10,}}>*/}
                            {/*<Text style={styles.commentContent_text} numberOfLines={3}>*/}
                                {/*买了很多水果，因为家人都很喜欢吃，苹果脆脆的，很甜，水分很足，就是个头不大。*/}
                            {/*</Text>*/}
                        {/*</View>*/}
                    {/*</View>*/}

                    {
                        data&&data.map((item,index)=>{
                            console.log(index)
                            if(index<=1){
                                return (
                                    <View key={index} style={styles.commentItem}>
                                        <View style={styles.commentHead}>
                                            <View style={styles.row}>
                                                <Image source={{uri:item.head_img}} style={{width: 22, height: 22, backgroundColor: '#ddd'}}/>
                                                <Text style={styles.userName}>{this._setName(item.u_name)}</Text>
                                                <View style={styles.userTime}>
                                                    <Text style={{fontSize: 10, lineHeight: 14, color: '#FFE1B0'}}>已加入{item.join_day}天</Text>
                                                </View>
                                            </View>

                                            <Text style={styles.commentTime}>2018-06-08</Text>
                                        </View>

                                        {/* 评论内容 */}
                                        <View style={{marginTop:10,}}>
                                            <Text style={styles.commentContent_text} numberOfLines={3}>
                                                {item.value}
                                            </Text>

                                            <View style={{flexDirection:'row',flexWrap:'wrap',marginTop:10}}>
                                                {
                                                    //生成评论图片
                                                    this._renderCommentImg(item.img)
                                                }
                                            </View>
                                        </View>
                                    </View>
                                )
                            }


                        })
                    }

                </View>
            </View>
        );
    }
}

const ScreenWidht = Dimensions.get('window').width;
const styles = StyleSheet.create({
    container: {
        marginTop: 10,
        backgroundColor: '#fff',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    title: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 15,
        paddingHorizontal: 15,
        alignItems: 'center'
    },
    title_text: {
        fontSize: 26 / 2,
        height: 37 / 2
    },
    Keyword: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 15,
    },
    KeywordItem: {
        marginLeft: 10,
        paddingHorizontal: 9,
        paddingVertical: 3,
        borderRadius: 10,
        backgroundColor: '#FFDFE0'
    },
    KeywordItem_text: {
        fontSize: 26 / 2,
        lineHeight: 37 / 2,
        color: '#333333',
    },


    //评论样式
    content: {
        paddingHorizontal: 15,
    },
    commentItem: {
        paddingVertical: 15,
        borderBottomWidth:1,
        borderStyle:'solid',
        borderColor:'#EEE'
    },

    //评论头部样式
    commentHead: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    userName: {
        paddingHorizontal: 3,
        fontSize: 12,
        lineHeight: 18,
        color: '#999'
    },
    userTime: {
        paddingHorizontal: 5,
        paddingVertical: 3,
        borderRadius: 5,
        backgroundColor: '#483F37'
    },
    commentTime:{
        fontSize:10,
        lineHeight:14,
        color:'#999'
    },


    //评论详情
    commentContent_text:{
        fontSize:26/2,
        lineHeight:37/2,
        color:'#333'
    },

    imgItem:{
        width:(ScreenWidht-30-6)/3,
        height:(ScreenWidht-30-6)/3,
        backgroundColor:'#ddd',
        marginRight:3},
});
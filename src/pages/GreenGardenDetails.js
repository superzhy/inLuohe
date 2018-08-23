import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    FlatList,
    StatusBar,
    Image,
    ScrollView,
    Dimensions,
    Modal,
    TouchableOpacity,
    WebView, AsyncStorage
} from 'react-native';
import Carousel from 'react-native-snap-carousel';
import EvilIcons from "react-native-vector-icons/EvilIcons"
import GoodsComment from '../component/GoodsComment'
import GoodsModal from '../component/GoodsModal'
import ImageSlider from '../component/ImageSlider'
import WebCont from '../component/WebCont';

import ColumnTitle from '../component/ColumnTitle'


import {LoadingView} from '../component/Loading';
import {ErrorView} from '../component/ErrorView';
import {fetchRequest} from "../utils/FetchUtil";

export default class GreenGardenDetails extends Component {
    static navigationOptions = ({navigation, screenProps}) => {
        return ({
            header: null,

        })
    };



    constructor(props) {
        super(props);
        this.state = {
            activeSlide: 1,
            headerShow: false,
            modalVisible:false,
            LocalPosition: '',
            // url: 'androidamap://route?sid=BGVIS1&slat=39.98871&slon=116.43234&sname=对外经贸大学&did=BGVIS2&dlat=40.055878&dlon=116.307854&dname=北京&dev=0&m=0&t=2',
            url: 'baidumap://map/direction?origin=中关村&destination=五道口&mode=driving&region=北京',

            isLoading: true,
            //网络请求状态
            error: false,
            errorInfo: "",
            data: [], //列表数据
            isRefreshing: false,//下拉控制,
            height_webview: 500,
            commentData:''
        };
    }


    componentDidMount() {
        let id = this.props.navigation.state.params.id;
        this.id = id;
        this.fetchData(id);
        this.fetchComment(id);
    };

    /**
     * 获取数据
     */
    fetchData(_id) {
        let params = {
            product_id: _id
        };
        fetchRequest('green_manor/detail', 'POST', params).then((res) => {
            console.log(res);
            console.log(res.code)
            if (res.code == 1) {
                this.setState({
                    data: res.results,
                    isLoading: false,
                })
            }
        }).catch((err) => {
            console.log(err);
            //请求失败
            this.setState({
                error: true,
                errorInfo: ''
            });
        })
    }


    /**
     * 获取评论
     */
    fetchComment(_id){
        let params = {
            product_id: _id,
            type:'manor',
        };
        fetchRequest('comment/listing', 'POST', params).then((res) => {
            console.log(res);
            console.log(res.code)
            if(res.code==1){
                this.setState({
                    commentData:res.results
                })
            }
        }).catch((err) => {
            console.log(err);
            //请求失败
            this.setState({
                error: true,
                errorInfo: ''
            });
        })
    }

    /**
     * 生成主界面
     */
    renderData(){
        const {headerShow,data,commentData} = this.state;
        return (
            <View style={styles.container}>
                <StatusBar

                    backgroundColor='transparent'

                    translucent={true}

                    barStyle={headerShow ? "dark-content" : "light-content"}

                    animated={true}

                />
                {
                    <View ref={(e) => this._refHeader = e} style={styles.header}>
                        <View style={{height: 40, justifyContent: 'center'}}>
                            <TouchableOpacity style={{width:40,height:40}} onPress={()=>{this.props.navigation.goBack()}}>
                                <EvilIcons name='chevron-left' size={40} color={headerShow ? "#222" : "#fff"}/>
                            </TouchableOpacity>
                        </View>
                        <View style={{
                            flexDirection: 'row',
                            paddingBottom: 25 / 2,
                            backgroundColor: 'white',
                            justifyContent: 'center'
                        }}>
                            <Text style={styles.headerNav_text}>商品</Text>
                            <Text style={[{paddingHorizontal: 72}, styles.headerNav_text]}>评价</Text>
                            <Text style={styles.headerNav_text}>详情</Text>
                        </View>
                    </View>
                }


                <ScrollView
                    onScroll={this._onScroll}
                    scrollEventThrottle={10}
                    style={styles.Scroll}
                >
                    {/*商品*/}
                    <View style={styles.goodsWrap}>
                        <View style={styles.goodsImg}>
                            <ImageSlider height={width / 1.63} width={width} data={data.carousel}/>
                        </View>
                        {/*商品信息*/}
                        <View style={styles.goodsInfo}>
                            <View style={{flexDirection: 'row', alignItems: 'center', paddingVertical: 15,}}>
                                <Text style={styles.goodsTitle}>{data.name}</Text>
                                <Text style={styles.sales}>已售{data.sale_num}</Text>
                            </View>
                            <Text style={styles.originalPrice}>市场价：¥{data.market_price}</Text>
                            <View style={{flexDirection: 'row', alignItems: 'center', paddingVertical: 10}}>
                                <Text style={styles.realPrice}>店铺售价：¥{data.shop_price}</Text>
                                <Text style={styles.stock}>库存{data.product_stock}份</Text>
                            </View>
                        </View>
                    </View>

                    {/*商品评论*/}
                    <GoodsComment data={commentData} goComment={()=>{
                        this.props.navigation.navigate('Comment',{id:this.id,type:'manor'})
                    }}/>


                    {/*店铺*/}
                    {/*<View style={styles.shop}>*/}
                        {/*<Image source={{uri:data.shop_img}} style={{width:width/7.5,height:width/7.5,borderRadius:4,}}/>*/}
                        {/*<Text style={styles.shopName}>{data.m_name}</Text>*/}
                        {/*<TouchableOpacity style={styles.goShop} activeOpacity={0.6}>*/}
                            {/*<Text style={styles.goShop_text}>进店逛逛</Text>*/}
                        {/*</TouchableOpacity>*/}
                    {/*</View>*/}




                    {/*详情*/}
                    <View style={styles.details}>
                        <ColumnTitle title='商家详情' arrow={false}/>
                        <WebCont content={data.desc}/>
                    </View>
                </ScrollView>
                <View style={styles.footer}>
                    {/*<TouchableOpacity style={styles.footerGoShop}>*/}
                        {/*<View style={{width:20,height:18,backgroundColor:'#ddd'}}/>*/}
                        {/*<Text style={{fontSize:24/2,lineHeight:33/2,color:'#333'}}>进入商店</Text>*/}
                    {/*</TouchableOpacity>     */}
                    <TouchableOpacity style={styles.footerPay} onPress={()=>{this._payTouch()}}>
                        <Text style={{color:'#fff'}}>立即购买</Text>
                    </TouchableOpacity>
                </View>

                {/*购买弹窗*/}
                <Modal
                    style={{backgroundColor:'red'}}
                    animationType={"slide"}
                    transparent={true}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {}}
                >
                    <GoodsModal close={()=>{this.setState({modalVisible:false})}}  data={data}/>
                </Modal>
            </View>
        );
    }


    /**
     *@desc 滑动更改header显示
     *@param event
     *@return {null}
     */
    _onScroll = (event) => {
        let Y = event.nativeEvent.contentOffset.y;
        console.log(Y);
        if (Y < 100) {
            st = Y * 0.01;
            this.setState({
                headerShow: false
            })
        } else {
            st = 1;
            this.setState({
                headerShow: true
            })
        }
        this._refHeader.setNativeProps({
            opacity: st
        })
    };

    /**
     *@desc 生成商品图
     */
    _payTouch(){

        AsyncStorage.getItem('userInfo', (error, result) => {
            if (!error) {
                if(result){
                   this._goPay()
                }else{
                    this.props.navigation.navigate('LoginModal')
                }
            }
        });
    }

    _goPay(){
        const {data} = this.state;
        // this.setState({modalVisible:true})
        let goodsInfo={
            price:data.shop_price,
            stock: data.product_stock,
            sukid: '',
            goodsId:data.id,
            goodsImg:data.cover,
            goodsName:data.name,
            goodsNum:1,
            goodsSpec:[],
        };

        // console.log(goodsInfo)

        this.props.navigation.navigate('OrderPay',{goodsInfo:goodsInfo})
    }

    render() {
        //第一次加载等待的view
        if (this.state.isLoading && !this.state.error) {
            return <LoadingView/>
        } else if (this.state.error) {
            //请求失败view
            return <ErrorView/>
        }
        //加载数据
        return this.renderData();
    }
}


const {height, width} = Dimensions.get('window');
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        position: 'relative'
    },
    header: {
        opacity: 0,
        backgroundColor: "#fff",
        height: 60,
        paddingTop: 20,
        position: "absolute",
        left: 0,
        right: 0,
        zIndex: 2
    },
    headerNav_text: {
        fontSize: 12,
        lineHeight: 33 / 2,
        color: '#333'
    },
    Scroll: {
        flex: 1,
        backgroundColor: '#ddd',
    },
    //头部商品
    goodsImg: {
        width: width,
        height: width / 1.63,
        position: 'relative'
    },
    Pagination: {
        position: 'absolute',
        right: 20,
        bottom: 10,
        width: 53,
        height: 18,
        backgroundColor: 'rgba(0,0,0,.6)',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 9
    },
    goodsInfo: {
        paddingHorizontal: 15,
        backgroundColor: '#fff',
    },
    goodsTitle: {
        flex: 1,
        fontSize: 15,
        lineHeight: 21,
    },
    sales: {
        fontSize: 10,
        lineHeight: 14,
        color: '#999'
    },
    originalPrice: {
        fontSize: 10,
        lineHeight: 14,
        color: '#999'
    },
    realPrice: {
        flex: 1,
        fontSize: 15,
        lineHeight: 21,
        fontFamily: "PingFangSC-Regular",
        color: "#FF5C60"
    },
    stock: {
        fontSize: 12,
        lineHeight: 33 / 2,
        fontFamily: "PingFangSC-Regular",
        color: "#FF5C60",
    },


    //店铺
    shop: {
        marginTop: 15,
        padding: 15,
        flexDirection:'row',
        alignItems:'center',
        backgroundColor: '#fff'
    },
    shopName:{
        marginLeft:10,
        flex:1,
        fontSize:26/2,
        lineHeight:37/2,
        color:"#333"
    },
    goShop:{
        paddingHorizontal:10,
        paddingVertical:5,
        borderRadius:15,
        backgroundColor:"#FF5C60",
    },
    goShop_text:{
        fontSize:26/2,
        lineHeight:37/2,
        color:'#fff'
    },


    //底部
    footer:{
        height:44,
        flexDirection:'row',
        backgroundColor:'#fff'
    },
    footerGoShop:{
        height:44,
        width:150/2,
        alignItems:'center',
        justifyContent:'center'
    },
    footerPay:{
        height:44,
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#FF5C60',
    }
});

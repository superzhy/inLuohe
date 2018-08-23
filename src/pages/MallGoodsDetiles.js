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
import MallGoodsModal from '../component/MallGoodsModal'
import ImageSlider from '../component/ImageSlider'
import WebCont from '../component/WebCont';

import Toast from '../component/Toast'

import ColumnTitle from '../component/ColumnTitle'
import {LoadingView} from '../component/Loading';
import {ErrorView} from '../component/ErrorView';
import {fetchRequest} from "../utils/FetchUtil";

export default class MallGoodsDetiles extends Component {
    static navigationOptions = ({navigation, screenProps}) => {
        return ({
            header: null,
        })
    };


    constructor(props) {
        super(props);
        this.id='';
        this.state = {
            activeSlide: 1,
            headerShow: false,
            modalVisible: false,
            isLoading: true,
            //网络请求状态
            error: false,
            errorInfo: "",
            data: [], //列表数据
            isRefreshing: false,//下拉控制,
            height_webview: 500,
            commentData:""
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
        fetchRequest('product/detail', 'POST', params).then((res) => {
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
            type:'mall',
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
     *生成主界面
     */
    renderData() {
        const {headerShow, data,commentData} = this.state;
        return (
            <View style={styles.container}>
                <StatusBar

                    backgroundColor='rgba(0,0,0,.5)'

                    translucent={true}

                    barStyle={headerShow ? "dark-content" : "light-content"}

                    animated={true}

                />
                {
                    <View ref={(e) => this._refHeader = e} style={styles.header}>
                        <View style={{height: 40, justifyContent: 'center'}}>
                            <TouchableOpacity style={{width: 40, height: 40}} onPress={() => {
                                this.props.navigation.goBack()
                            }}>
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
                            <ImageSlider height={width / 1.63} width={width} data={data.product.carousel}/>
                        </View>

                        {/*商品信息*/}
                        <View style={styles.goodsInfo}>
                            <View style={{flexDirection: 'row', alignItems: 'center', paddingVertical: 15,}}>
                                <Text style={styles.goodsTitle}>{data.product.name}</Text>
                                <Text style={styles.sales}>已售{data.product.sale_num}</Text>
                            </View>
                            <Text style={styles.originalPrice}>市场价：¥{data.product.market_price}</Text>
                            <View style={{flexDirection: 'row', alignItems: 'center', paddingVertical: 10}}>
                                <Text style={styles.realPrice}>店铺售价：¥{data.product.shop_price}</Text>
                                <Text style={styles.stock}>库存{data.product.product_stock}份</Text>
                            </View>
                        </View>
                    </View>

                    {/*商品评论*/}
                    <GoodsComment data={commentData} goComment={()=>{
                        this.props.navigation.navigate('Comment',{id:this.id,type:'mall'})
                    }}/>


                    {/*店铺*/}
                    {/*<View style={styles.shop}>*/}
                        {/*<Image source={require('../images/Rectangle.png')}*/}
                               {/*style={{width: width / 7.5, height: width / 7.5}}/>*/}
                        {/*<Text style={styles.shopName}>甜蜜蜜果蔬店</Text>*/}
                        {/*<TouchableOpacity style={styles.goShop} activeOpacity={0.6}>*/}
                            {/*<Text style={styles.goShop_text}>进店逛逛</Text>*/}
                        {/*</TouchableOpacity>*/}
                    {/*</View>*/}

                    {/*商城详情*/}
                    <ColumnTitle title='商家详情' arrow={false}/>

                    <WebCont content={data.product.desc}/>
                </ScrollView>
                <View style={styles.footer}>
                    <TouchableOpacity style={styles.footerPay} onPress={() => {
                        this._payTouch()

                    }}>
                        <Text style={{color: '#fff'}}>立即购买</Text>
                    </TouchableOpacity>
                </View>

                {/*购买弹窗*/}
                <Modal
                    style={{flex:1}}
                    animationType="slide"
                    transparent={true}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {
                        this.setState({
                            modalVisible: false
                        })
                    }}
                >
                    <MallGoodsModal
                        data={this.state.data}
                        close={() => {
                            this.setState({modalVisible: false})
                        }}
                        goPay={(goodsInfo) => {
                            console.log(goodsInfo)
                            this.props.navigation.navigate('OrderPay',{goodsInfo:goodsInfo})
                            // alert(1)
                        }}/>
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
     *点击立即购买
     */
    _payTouch() {
        const {data} = this.state;
        AsyncStorage.getItem('userInfo', (error, result) => {
            if (!error) {
                // console.log(result);
                if (result) {

                    if(data.specs_name.length===0){
                        let goodsInfo={
                            price:data.product.shop_price,
                            stock: 11,
                            sukid: '',
                            goodsId:data.product.id,
                            goodsImg:data.product.cover,
                            goodsName:data.product.name,
                            goodsNum:1,
                            goodsSpec:[],
                        };

                        // console.log(goodsInfo)

                        this.props.navigation.navigate('OrderPay',{goodsInfo:goodsInfo})
                    }else{
                        this.setState({modalVisible: true})
                    }
                } else {
                    this.props.navigation.navigate('LoginModal')
                }
            }
        });
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
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff'
    },
    shopName: {
        marginLeft: 10,
        flex: 1,
        fontSize: 26 / 2,
        lineHeight: 37 / 2,
        color: "#333"
    },
    goShop: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 15,
        backgroundColor: "#FF5C60",
    },
    goShop_text: {
        fontSize: 26 / 2,
        lineHeight: 37 / 2,
        color: '#fff'
    },


    //底部
    footer: {
        height: 44,
        flexDirection: 'row',
        backgroundColor: '#fff'
    },
    footerGoShop: {
        height: 44,
        width: 150 / 2,
        alignItems: 'center',
        justifyContent: 'center'
    },
    footerPay: {
        height: 44,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FF5C60',
    }
});

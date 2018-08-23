import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    ScrollView,
    TextInput,
    Dimensions,
    Image,
    SafeAreaView,
    StatusBar,
    TouchableOpacity,
    ActivityIndicator,
    FlatList
} from 'react-native';


import BBSHeader from '../component/BBSHeader'
import BBSItem from '../component/BBSItem'
import SetNumber from '../component/SetNumber';
import Alipay from '../utils/Alipay'
import Toast from "../component/Toast";
import {fetchRequest} from "../utils/FetchUtil";
import {LoadingView} from '../component/Loading';
import {ErrorView} from '../component/ErrorView';

export default class OrderPay extends Component {
    static navigationOptions = ({navigation, screenProps}) => {
        return ({
            headerTitle: '确认订单',
        })
    };


    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            //网络请求状态
            error: false,
            errorInfo: "",
            address: '',
            goodsInfo: [],
        }
    }

    componentWillMount(){
        this.fetchData();
        let goodsInfo = this.props.navigation.state.params.goodsInfo;
        this.setState({
            goodsInfo: goodsInfo,
            goodsNum:goodsInfo.goodsNum
        })

    }

    // componentDidMount() {
    //     this.fetchData();
    //     let goodsInfo = this.props.navigation.state.params.goodsInfo;
    //     this.setState({
    //         goodsInfo: goodsInfo
    //     })
    //
    // };


    /**
     * 获取数据
     */
    fetchData() {
        fetchRequest('user/address/default', 'POST',).then((res) => {
            console.log(res);
            console.log(res.code)
            if (res.code == 1) {
                this.setState({
                    address: res.results,
                    isLoading: false,
                });
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
     * 显示主界面
     * @returns {*}
     */
    renderData() {
        const {goodsInfo, address,goodsNum} = this.state;
        console.log(goodsInfo);
        return (
            <SafeAreaView style={{flex: 1}}>
                <StatusBar
                    backgroundColor='white'
                    translucent={false}
                    barStyle="dark-content"
                    // animated={true}
                />
                <View style={{flex: 1, backgroundColor: '#f8f8f8'}}>
                    {/*地址*/}
                    {
                        address ? <TouchableOpacity
                                style={styles.Address}
                                onPress={()=>{
                                    this._selectAddress()
                                }}
                            >
                                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                    <Text style={styles.Address_text}>{address.name}</Text>
                                    <Text style={styles.Address_text}>{address.phone}</Text>
                                </View>
                                <View style={{marginTop: 15 / 2}}>
                                    <Text
                                        style={styles.Address_text}>{address.province + address.city + address.area + address.street}</Text>
                                </View>
                            </TouchableOpacity> :
                            <TouchableOpacity style={{height: 40, justifyContent: 'center', backgroundColor: '#fff'}}  onPress={()=>{
                                this._selectAddress()
                            }}>
                                <Text>暂无地址，点击添加地址</Text>
                            </TouchableOpacity>
                    }
                    {/*商品信息*/}
                    <View style={styles.goods}>
                        <View style={styles.goodsInfo}>
                            <Image source={{uri: goodsInfo.goodsImg}} style={styles.goodsImg}/>
                            <View style={{flex: 1, marginLeft: 10,}}>
                                <Text style={styles.goodsName_text}>{goodsInfo.goodsName}</Text>
                                <View style={styles.spec}>
                                    {
                                        goodsInfo.goodsSpec && goodsInfo.goodsSpec.map((item, index) => {
                                            return (
                                                <Text key={index} style={{color: '#666', fontSize: 12}}>{item}</Text>
                                            )
                                        })
                                    }
                                </View>
                                <View style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}>
                                    <Text style={styles.goodsPrice_text}>¥{goodsInfo.price}</Text>
                                    <Text style={styles.number_text}>x{goodsInfo.goodsNum}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.totalPrice}>
                            <SetNumber selectNum={this.state.goodsNum} add={this.addNumber.bind(this)} reduce={this.reduceNumber.bind(this)}/>
                            <Text>共{goodsNum}件商品 小计：<Text
                                style={styles.goodsPrice_text}>¥{(goodsNum * goodsInfo.price).toFixed(2)}</Text></Text>
                        </View>
                    </View>
                </View>

                <View style={styles.footer}>
                    <View style={styles.footerItem}>
                        <Text>合计:¥{(goodsNum * goodsInfo.price).toFixed(2)}</Text>
                    </View>
                    <TouchableOpacity style={styles.payBtn} onPress={()=>{this._createOrder()}}>
                        <Text style={{color: '#fff'}}>立即支付</Text>
                    </TouchableOpacity>
                </View>


                <Toast ref="toast"/>
            </SafeAreaView>
        )

    }

    /**
     * 选择地址
     * @private
     */
    _selectAddress(){
        this.props.navigation.navigate('Address',{fnSelect:(data)=>{
                // alert(1)
                this.setState({
                    address:data
                })
            }})
    }


    /**
     * 数量加
     */
    addNumber(){
        const {goodsInfo} = this.state;
        let goodsNum = this.state.goodsNum;
        if ((++goodsNum) > goodsInfo.stock) {
            this.refs.toast.show(`商品最多选择${goodsInfo.stock}件商品`, 3000);
        } else {
            this.setState({
                goodsNum: goodsNum
            })
        }
    }

    /**
     * 数量减
     */
    reduceNumber(){
        let goodsNum = this.state.goodsNum;
        if ((--goodsNum) < 1) {
            this.refs.toast.show(`商品最少选择1件商品`, 3000);
        } else {
            this.setState({
                goodsNum: goodsNum
            })
        }
    }




    /**
     * 创建订单
     * @private
     */
    _createOrder(){
        const {address,goodsInfo,goodsNum} = this.state;
        if(address){
            // fetchRequest()


            let params={
                address_id:address.id,
                product_id:goodsInfo.goodsId,
                sukid:goodsInfo.sukid,
                buy_num:goodsNum
            };
            console.log(params)
            this.refs.toast.show('加载中');
            fetchRequest('order/create','POST',params).then((res) => {
                console.log(res);
                console.log(res.code)
                if (res.code === 1) {
                    this.refs.toast.show(res.message,3000);
                    this._pay(res.results)
                }
            }).catch((err) => {
                console.log(err);
                //请求失败
                this.setState({
                    error: true,
                    errorInfo: ''
                });
            })
        }else{
            this.refs.toast.show('选择地址',3000);
        }
    };


    /**
     * 支付
     * @param data
     * @private
     */
    _pay(data){
        Alipay.pay(data).then((res)=>{
            console.log(res);
            if(res){
                if(res.resultStatus==="9000"){
                    this.refs.toast.show('支付成功',3000);
                }else{
                    this.refs.toast.show('支付失败',3000);
                }
            }
        })
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
        backgroundColor: '#fff'
    },

    Address: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        backgroundColor: '#fff'
    },
    Address_text: {
        fontSize: 24 / 2,
        lineHeight: 33 / 2,
        fontFamily: "PingFangSC-Regular",
        color: '#2A2A2A',
    },

    goods: {
        marginTop: 10,

    },
    goodsInfo: {
        paddingHorizontal: 15,
        paddingTop: 15,
        paddingBottom: 5,
        flexDirection: 'row',
        backgroundColor: '#fff'
    },
    goodsImg: {
        width: 80,
        height: 80,
        backgroundColor: '#ddd'
    },
    goodsName_text: {
        fontSize: 14,
        lineHeight: 33 / 2,
        color: '#666'
    },
    spec: {
        marginTop: 5,
    },
    spec_text: {
        fontSize: 12,
        lineHeight: 16,
        color: '#888'
    },
    goodsPrice_text: {
        fontSize: 14,
        lineHeight: 33 / 2,
        color: '#fd5256'
    },
    number_text: {
        fontSize: 12,
        color: '#999'
    },
    totalPrice: {
        height: 40,
        paddingHorizontal: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        borderColor: '#eee',
        backgroundColor: '#fff'
    },
    footer: {
        height: 46,
        flexDirection: 'row',
        borderTopWidth: 1,
        borderColor: '#eee',
        backgroundColor: '#fff'
    },
    footerItem: {
        flex: 6,
        marginRight: 10,
        alignItems: "flex-end",
        justifyContent: 'center'
    },
    payBtn: {
        flex: 5,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fd5256'
    }
});

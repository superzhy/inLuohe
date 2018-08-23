import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    ScrollView,
    SafeAreaView,
    FlatList, Dimensions, StatusBar
} from 'react-native';

import Carousel, {Pagination} from 'react-native-snap-carousel';
import ScrollableTabView, {ScrollableTabBar} from 'react-native-scrollable-tab-view';
import LocalNewItem from '../component/LocalNewItem';
import {fetchRequest} from "../utils/FetchUtil";
import {ErrorView} from '../component/ErrorView';
import {LoadingView} from '../component/Loading';

import OrderItem from '../component/OrderItem'
import Toast from "../component/Toast";
import Alipay from "../utils/Alipay";

export default class Order extends Component {
    constructor(props) {
        super(props);
        this.status='';
        this.state = {
            listLoading: true,
            titleList: ['全部', '待付款', '待发货', '待收货', '待评价'],
            dataArray: [0, 1, 2, 3],
            showFoot: 0, // 控制foot， 0：隐藏footer  1：已加载完成,没有更多数据   2 ：显示加载中
            isRefreshing: false,//下拉控制
            initialPage:0
        }
    }

    componentWillMount(){
        let type = this.props.navigation.state.params.status;
        this.setState({
            initialPage:type
        });
    }
    componentDidMount() {
        this._navListener = this.props.navigation.addListener('didFocus', () => {
            StatusBar.setBarStyle('dark-content');
            // (Platform.OS === 'android') && StatusBar.setTranslucent(true);
            (Platform.OS === 'android') && StatusBar.setBackgroundColor('#fff');
        });

        let type = this.props.navigation.state.params.status;
        let status;
        switch (type) {
            case 0:
                status = '';
                break;
            case 1:
                status = 'P';
                break;
            case 2:
                status = 'Y';
                break;
            case 3:
                status = 'F';
                break;
            case 4:
                status = 'W';
                break;
            default :
                status = ''

        }

        this.fetchList(status)



    }


    /**
     * 获取订单数据
     * @param _status
     */
    fetchList(_status) {
        let params = {
            status: _status
        };
        fetchRequest('order/listing', 'POST', params).then((res) => {
            console.log(res);
            console.log(res.code)
            if (res.code == 1) {
                this.setState({
                    dataArray: res.results,
                    listLoading: false,
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
     * 生成子项
     * @param _item
     * @param _index
     * @private
     */
    _renderItem(_item, _index) {
        return (
            <View key={_index} tabLabel={_item} style={{flex: 1}}>
                {
                    // (this.state.listLoading&&!this.state.error) ?
                    //     <LoadingView/> :
                    //     <FlatList
                    //         style={[{backgroundColor: '#f8f8f8', flex: 1}]}
                    //         data={this.state.dataArray}
                    //         keyExtractor={(item, index) => index.toString()}
                    //         renderItem={this._renderOrderItem.bind(this)}
                    //     />

                    this._renderLoading()
                }
            </View>
        )
    }

    /**
     * loading
     * @private
     */
    _renderLoading() {
        //第一次加载等待的view
        if (this.state.listLoading && !this.state.error) {
            return <LoadingView/>
        } else if (this.state.error) {
            //请求失败view
            return <ErrorView/>
        }
        //加载数据
        return (
            <FlatList
                style={[{backgroundColor: '#f8f8f8', flex: 1}]}
                data={this.state.dataArray}
                keyExtractor={(item, index) => index.toString()}
                renderItem={this._renderOrderItem.bind(this)}
                ListEmptyComponent={()=>{
                    return <Text style={{marginTop:'40%',color:"#666",textAlign:'center'}}>无数据</Text>
                }}
            />
        )
    }


    /**
     * 生成订单每一项
     * @param item
     * @private
     */
    _renderOrderItem(item) {
        return <OrderItem
            data={item.item}
            goPage={(page,id,status)=>{this.goPage(page,id,status)}}
            update={(id,status)=>{this.update(id,status)}}
            toPay ={(id)=>{this.toPay(id)}}
        />
    }


    goPage(page,id,status){
        this.props.navigation.navigate(page,{
            id:id,refirsh: () => {
                this.fetchList(status)
            }
        })
        // alert(page)
    }

    /**
     * 更改订单
     */
    update(id,status){
        let params = {
            status: 'C',
            order_id:id
        };
        fetchRequest('order/update', 'POST', params).then((res) => {
            console.log(res);
            console.log(res.code)
            if (res.code == 1) {
                this.refs.toast.show(res.message,3000);
                this.fetchList(this.status)
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
     * 去支付
     */
    toPay(id){
        fetchRequest(`payment/alipay/${id}`, 'GET').then((res) => {
            console.log(res);
            console.log(res.code)
            if (res.code == 1) {
                Alipay.pay(res.results).then((res)=>{
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
        }).catch((err) => {
            console.log(err);
            //请求失败
            this.setState({
                error: true,
                errorInfo: ''
            });
        })
    }


    render() {
        return (
            <SafeAreaView style={{flex: 1}}>
                {/*<ScrollableTabView*/}
                {/*initialPage={0}*/}
                {/*tabBarUnderlineStyle={{backgroundColor:'transparent'}}*/}
                {/*scrollWithoutAnimation={true}*/}

                {/*renderTabBar={()=><ScrollableTabBar*/}
                {/*underlineColor='#ce3d3a'*/}
                {/*activeTextColor='#ff5c60'*/}
                {/*inactiveTextColor='#666'*/}
                {/*underlineHeight={0}*/}
                {/*textStyle={{ fontSize: 14 }}*/}
                {/*backgroundColor='#f8f8f8'*/}
                {/*tabStyle={{paddingLeft:10,paddingRight:10,height:40,}}*/}
                {/*style={{height:40}}*/}
                {/*/>}*/}

                {/*// onChangeTab={(res)=>{*/}
                {/*//     console.log(res)*/}
                {/*//     // this.setState({*/}
                {/*//     //     listLoading: true,*/}
                {/*//     // });*/}
                {/*//     // this.fetchList(this.state.titleArray[res.i].id)*/}
                {/*// }}*/}
                {/*>*/}
                {/*{*/}
                {/*this.state.titleList.map((item,index)=>{*/}
                {/*return this._renderItem(item,index)*/}
                {/*})*/}
                {/*}*/}
                {/*</ScrollableTabView>*/}

                <ScrollableTabView
                    initialPage={this.state.initialPage}

                    tabBarUnderlineStyle={{backgroundColor: 'transparent'}}
                    scrollWithoutAnimation={true}

                    renderTabBar={() => <ScrollableTabBar
                        underlineColor='#ce3d3a'
                        activeTextColor='#ff5c60'
                        inactiveTextColor='#666'
                        underlineHeight={0}
                        textStyle={{fontSize: 14}}
                        backgroundColor='#f8f8f8'
                        tabStyle={{paddingLeft: 10, paddingRight: 10, height: 40,}}
                        style={{height: 40}}
                    />}

                    onChangeTab={(res) => {
                        this.setState({
                            listLoading: true
                        });

                        let status = '';
                        switch (res.i) {
                            case 0:
                                status = '';
                                break;
                            case 1:
                                status = 'P';
                                break;
                            case 2:
                                status = 'Y';
                                break;
                            case 3:
                                status = 'F';
                                break;
                            case 4:
                                status = 'W';
                                break;
                            default :
                                status = ''

                        }
                        this.status=status
                        this.fetchList(status)
                    }}
                >
                    {
                        this.state.titleList.map((item, index) => {
                            return this._renderItem(item, index)
                        })
                    }
                </ScrollableTabView>

                <Toast ref="toast"/>

            </SafeAreaView>
        )
    }

}

const ScreenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    navBar: {
        height: 40,
        backgroundColor: '#f7f7f7'
    }
});

/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Dimensions,
    TouchableOpacity,
    ActivityIndicator,
    FlatList, AsyncStorage
} from 'react-native';
import MallItem from '../component/MallItem';
import ImageSlider from '../component/ImageSlider'

import {ErrorView} from '../component/ErrorView';
import {LoadingView} from '../component/Loading';
import {fetchRequest} from "../utils/FetchUtil";

let pageNo = 1;//当前第几页
let totalPage = 1;//总的页数
export default class BrowseRecommend extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            //网络请求状态
            error: false,
            errorInfo: "",
            data:[], //列表数据
            bannerData:[],
            showFoot: 0, // 控制foot， 0：隐藏footer  1：已加载完成,没有更多数据   2 ：显示加载中
            isRefreshing: false,//下拉控制
        }
    }


    // state = {
    //     List: [],
    //     refreshing: false,
    //     ready: false,
    // };
    // refreshing = false;

    componentDidMount() {
        this._fetchData()
        this._fetchBanner();
    }


    /**
     *@desc 获取数据
     *@return
     */
    _fetchData() {
        fetchRequest('product/listing', 'GET')
            .then(res => {
                //请求成功
                if (res.code == 1) {

                    this.setState({
                        //复制数据源
                        data:res.results,
                        isLoading: false,
                    });
                }

            })
            .catch((err) => {
                console.log(err);
                //请求失败
                this.setState({
                    error: true,
                    errorInfo: ''
                })
            })
    };


    /**
     * 获取头部轮播
     * @private
     */
    _fetchBanner(){
        fetchRequest('mall/carousel/listing', 'GET')
            .then(res => {
                //请求成功
                if (res.code == 1) {

                    this.setState({
                        //复制数据源
                        bannerData:res.results,
                        isLoading: false,
                    });
                }

            })
            .catch((err) => {
                console.log(err);
                //请求失败
                this.setState({
                    error: true,
                    errorInfo: ''
                })
            })
    }


    /**
     * 主数据页
     * @private
     */
    renderData = () => {
        const {dataArray, isRefreshing} = this.state;
        return (
            <FlatList
                // onRefresh={() => {
                //     pageNo=1;
                //     this._fetchData(1)
                // }}
                // refreshing={isRefreshing}
                keyExtractor={(item,index) => index.toString()}
                data={this.state.data}
                renderItem={this._renderItemView}
                ListHeaderComponent={this._renderHeader.bind(this)}
                ListFooterComponent={this._renderFooter.bind(this)}
                // onEndReached={this._onEndReached.bind(this)}
                onEndReachedThreshold={1}
                numColumns={2}
            />
        )

    };

    /**
     * 生成每一项
     * @param item
     * @returns {*}
     * @private
     */
    _renderItemView=({item,index})=>{
        console.log(item)
        return <MallItem index={index} data={item} onPress={()=>{this.props.navigation.navigate('MallGoodsDetiles',{id:item.id})}}/>
    };


    /**
     * 生成头部
     * @returns {*}
     * @private
     */
    _renderHeader=()=>{
        return (
            <ImageSlider height={screenWidth/2.5} width={screenWidth} data={this.state.bannerData.imgs}/>
        )
    };

    /**
     * 生成列表底部
     * @returns {*}
     * @private
     */
    _renderFooter(){
        if (this.state.showFoot === 1) {
            return (
                <View style={{height:30,alignItems:'center',justifyContent:'flex-start',}}>
                    <Text style={{color:'#999999',fontSize:14,marginTop:5,marginBottom:5,}}>
                        没有更多数据了
                    </Text>
                </View>
            );
        } else if(this.state.showFoot === 2) {
            return (
                <View style={styles.footer}>
                    <ActivityIndicator />
                    <Text>正在加载更多数据...</Text>
                </View>
            );
        } else if(this.state.showFoot === 0){
            return (
                <View style={styles.footer}>
                    <Text></Text>
                </View>
            );
        }
    }

    /**
     * 上拉加载
     * @private
     */
    _onEndReached=()=>{
        //如果是正在加载中或没有更多数据了，则返回
        if(this.state.showFoot !==0 ){
            return ;
        }
        //如果当前页大于或等于总页数，那就是到最后一页了，返回
        if((pageNo!==1) && (pageNo>=totalPage)){
            return;
        } else {
            pageNo++;
        }
        //底部显示正在加载更多数据
        this.setState({showFoot:2});
        //获取数据
        this._fetchData( pageNo);
    };




    render() {
        //第一次加载等待的view
        if (this.state.isLoading && !this.state.error) {
            return <LoadingView/>;
        } else if (this.state.error) {
            //请求失败view
            return <ErrorView/>;
        }
        //加载数据
        return this.renderData();
    }
}

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f8f8',
    },
    loading: {
        marginTop: 100,
    },
    footer:{
        flexDirection:'row',
        height:24,
        justifyContent:'center',
        alignItems:'center',
        marginBottom:10,
    },
});

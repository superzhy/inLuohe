import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    ScrollView,
    SafeAreaView,
    FlatList, Dimensions
} from 'react-native';

import Carousel , { Pagination } from 'react-native-snap-carousel';
import ScrollableTabView,{ ScrollableTabBar } from 'react-native-scrollable-tab-view';
import LocalNewItem from '../component/LocalNewItem';
import {fetchRequest} from "../utils/FetchUtil";
import {ErrorView} from '../component/ErrorView';
import {LoadingView} from '../component/Loading';

export default class Mine extends Component {

    // state={
    //     activeSlide:0,
    //     titleList:['要闻','科学','民生','搞笑','妙招',]
    // };

    constructor(props) {
        super(props);
        this.state = {
            activeSlide:0,
            isLoading: true,
            listLoading:true,
            //网络请求状态
            error: false,
            errorInfo: "",
            titleArray:[],
            dataArray: [], //列表数据
            showFoot: 0, // 控制foot， 0：隐藏footer  1：已加载完成,没有更多数据   2 ：显示加载中
            isRefreshing: false,//下拉控制
        }
    }

    componentDidMount(){
        this.fetchData();
        this.fetchList(5)
    }


    /**
     * 获取数据
     */
    fetchData(){

        let that = this;
        fetchRequest('news/category/listing','GET').then((res)=>{
            if(res.code==1){
                this.setState({
                    titleArray:res.results,
                    isLoading: false,
                })
            }
        }).catch((err)=>{
            console.log(err);
            //请求失败
            that.setState({
                error: true,
                errorInfo:''
            });
        })
    }


    fetchList(_id){
        let params = {
            category_id: _id
        };
        fetchRequest('news/content/listing','POST',params).then((res)=>{
            console.log(res);
            console.log(res.code)
            if(res.code==1){
                this.setState({
                    dataArray:res.results,
                    listLoading: false,
                });

                // setTimeout(()=>{
                //   this.setState({
                //
                //   })
                // },500)
            }
        }).catch((err)=>{
            console.log(err);
            //请求失败
            this.setState({
                error: true,
                errorInfo:''
            });
        })
    }


    /**
     *@desc 生成每一类新闻项
     */
    _renderItem(item,index){
        return (
            <View key={index} tabLabel={item.name} style={{flex:1}}>
                {
                    this.state.listLoading?
                        <LoadingView/>:
                        <FlatList
                            style={[{backgroundColor:'#fff',flex:1,paddingHorizontal:15}]}
                            data={this.state.dataArray}
                            keyExtractor={(item,index)=>index.toString()}
                            renderItem={({item}) => <LocalNewItem data={item} openPage={()=>{this._openDetails(item.id)}}/>}
                        />
                }
            </View>
        )

    }


    _openDetails=(_id)=>{
        this.props.navigation.navigate('LocalNewsDetails',{id:_id})
    };



    /**
     * 生成主界面
     */
    renderData(){
        return (
            <SafeAreaView style={styles.container}>
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
                    {/*onChangeTab={(res)=>{*/}
                        {/*console.log(res)*/}
                        {/*// this.setState({*/}
                        {/*//     listLoading: true,*/}
                        {/*// });*/}
                        {/*// this.fetchList(this.state.titleArray[res.i].id)*/}
                    {/*}}*/}
                {/*>*/}
                    {/*{*/}
                        {/*this.state.titleArray.map((item,index)=>{*/}
                            {/*return this._renderItem(item,index)*/}
                        {/*})*/}
                    {/*}*/}
                {/*</ScrollableTabView>*/}



                <ScrollableTabView
                    initialPage={0}

                    tabBarUnderlineStyle={{backgroundColor:'transparent'}}
                    scrollWithoutAnimation={true}

                    renderTabBar={()=><ScrollableTabBar
                        underlineColor='#ce3d3a'
                        activeTextColor='#ff5c60'
                        inactiveTextColor='#666'
                        underlineHeight={0}
                        textStyle={{ fontSize: 14 }}
                        backgroundColor='#f8f8f8'
                        tabStyle={{paddingLeft:10,paddingRight:10,height:40,}}
                        style={{height:40}}
                    />}

                    onChangeTab={(res) => {
                        // alert(res.i)
                        this.setState({
                            listLoading:true
                        })
                        this.fetchList(this.state.titleArray[res.i].id)}
                    }
                >
                    {
                        this.state.titleArray.map((item, index) => {
                            return this._renderItem(item, index)
                        })
                    }
                </ScrollableTabView>
            </SafeAreaView>

        )
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

const ScreenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    navBar:{
        height:40,
        backgroundColor:'#f7f7f7'
    }
});

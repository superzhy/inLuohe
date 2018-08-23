import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    FlatList
} from 'react-native';
import GreenGardenItem from "../component/GreenGardenItem"
import {fetchRequest} from "../utils/FetchUtil";
import {ErrorView} from '../component/ErrorView';
import {LoadingView} from '../component/Loading';

export default class GreenGarden extends Component {


    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            //网络请求状态
            error: false,
            errorInfo: "",
            dataArray: [], //列表数据
            showFoot: 0, // 控制foot， 0：隐藏footer  1：已加载完成,没有更多数据   2 ：显示加载中
            isRefreshing: false,//下拉控制
        }
    }


    componentDidMount(){
        this.fetchData()
    }


    /**
     * 获取数据
     */
    fetchData(){

        let that = this;
        fetchRequest('green_manor/listing','GET').then((res)=>{
            console.log(res);
            console.log(res.code)
            if(res.code==1){
                this.setState({
                    dataArray:res.results,
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


    /**
     * 生成主界面
     * @returns {*}
     */
    renderData(){
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.wrap}>
                    <FlatList
                        style={styles.list}
                        data={this.state.dataArray}
                        // extraData={this.state}
                        keyExtractor={(item,index) => String(index)}
                        renderItem={({item})=>{
                            return this._renderItem(item)
                        }}
                    />
                </View>
            </SafeAreaView>
        );
    }

    /**
     * 主界面子项
     * @param item
     * @returns {*}
     * @private
     */
    _renderItem=(item)=>{

        return <GreenGardenItem data={item} openPage={()=>this._openDetails(item.id)}/>
    };


    /**
     *@desc 打开详情
     */
    _openDetails=(_id)=>{
        this.props.navigation.navigate('GreenGardenDetails',{id:_id})
    };



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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
        backgroundColor: '#fff',
    },
    wrap:{
        flex:1,
        backgroundColor:'#f7f7f7'

    },
    list:{
        paddingHorizontal:15,
        backgroundColor:'#fff'
    }
});

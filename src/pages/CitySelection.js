import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    FlatList, StatusBar
} from 'react-native';
import CitySelectionCell from "../component/CitySelectionCell";
import {ErrorView} from '../component/ErrorView';
import {LoadingView} from '../component/Loading';
import {fetchRequest} from "../utils/FetchUtil";

export default class CitySelection extends Component {



    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            //网络请求状态
            error: false,
            errorInfo: "",
            dataArray: [],
            showFoot: 0, // 控制foot， 0：隐藏footer  1：已加载完成,没有更多数据   2 ：显示加载中
            isRefreshing: false,//下拉控制
            likesActive:false
        }
    }


    _likes=()=>{
        alert(1)
    };



    componentDidMount() {
        this.fetchData();
        this._navListener = this.props.navigation.addListener('didFocus', () => {
            StatusBar.setBarStyle('dark-content');
            (Platform.OS === 'android') && StatusBar.setTranslucent(false);
            (Platform.OS === 'android') && StatusBar.setBackgroundColor('#fff');
        });
    }

    componentWillUnmount() {
        this._navListener.remove();
    }

    /**
     * 获取数据
     */
    fetchData(){

        let that = this;
        fetchRequest('city_boutique/listing','GET').then((res)=>{
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
                <View style={styles.header}>
                    <Text>城市精选</Text>
                </View>
                <View style={styles.wrap}>
                    <FlatList
                        style={styles.list}
                        data={this.state.dataArray}
                        // extraData={this.state}
                        keyExtractor={(item) => String(item)}
                        renderItem={this._renderItem.bind(this)}
                    />
                </View>
            </SafeAreaView>
        );
    }

    /**
     * 主界面子项
     * @param item {Object} 每一项数据
     * @returns {*}
     * @private
     */
    _renderItem=(item)=>{

        return <View style={{marginTop:10}}>
            <CitySelectionCell data={item.item} likes={()=>this._likes()} likesActive={this.state.likesActive} openPage={()=>this._openDetails(item.item.id)}/>
        </View>
    };


    /**
     *@desc 打开详情
     */
    _openDetails=(_id)=>{
        this.props.navigation.navigate('CitySelectionDetails',{id:_id})
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

    header:{
        height:44,
        justifyContent:"center",
        alignItems:'center',
        borderBottomWidth:1,
        borderStyle:'solid',
        borderColor:'#ddd',
        backgroundColor:'#fff'
    },
    wrap:{
        flex:1,
        backgroundColor:'#f7f7f7'

    },
    list:{
        paddingHorizontal:15,

    }
});

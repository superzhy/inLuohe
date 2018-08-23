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


import {fetchRequest} from "../utils/FetchUtil";
import {LoadingView} from '../component/Loading';
import {ErrorView} from '../component/ErrorView';

export default class Home extends Component {
    static navigationOptions = ({navigation, screenProps}) => {
        return ({
            headerTitle: '漯河BBS',
        })
    };


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


            headerData:[]
        }
    }



    componentDidMount() {
        this.fetchData();
    };


    /**
     * 获取数据
     */
    fetchData(){
        fetchRequest('forum/category/listing','GET',).then((res)=>{
            console.log(res);
            console.log(res.code)
            if(res.code==1){
                this.setState({
                    headerData:res.results,
                    isLoading: false,
                });
                this.fetchList(res.results[0].id)
            }
        }).catch((err)=>{   ``
            console.log(err);
            //请求失败
            this.setState({
                error: true,
                errorInfo:''
            });
        })
    }

    /**
     * 获取list
     * @param _id
     */
    fetchList(_id){
       const params={
           category_id:_id
       };
        fetchRequest('forum/content/listing','POST',params).then((res)=>{
            console.log(res);
            console.log(res.code)
            if(res.code==1){
                this.setState({
                    dataArray:res.results,
                    isLoading: false,
                });
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
     *@desc渲染主界面
     */
    renderData(){
        return  <SafeAreaView style={styles.container}>
                    <FlatList
                        keyExtractor={(item,index) => index.toString()}
                        data={this.state.dataArray}
                        renderItem={this._renderItemView.bind(this)}
                        ListHeaderComponent={this._renderHeader.bind(this)}
                        ListFooterComponent={this._renderFooter.bind(this)}
                        ListEmptyComponent={<Text style={{marginTop:'50%',textAlign:'center'}}>无数据</Text>}
                        // onEndReached={this._onEndReached.bind(this)}
                        onEndReachedThreshold={1}
                        numColumns={1}
                    />
        </SafeAreaView>
    }



    /**
     *@desc生成每一项
     */
    _renderItemView(_item){
        return (
            <View style={{paddingHorizontal:15}}>
                <BBSItem data={_item.item} goDetails={(id)=>{this._goDetails(id)}} />
            </View>
        )
    }


    /**
     *@desc生成头部组件
     */
    _renderHeader(){
        return <BBSHeader data={this.state.headerData} goClassify={(index,title,id)=>{this._goClassify(index,title,id)}}/>
    }


    /**
     *@desc生成底部组件
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
     *@desc跳转分类
     */
    _goClassify(_index,_title,_id){
       this.props.navigation.navigate('BBSClassify',{title:_title,id:_id})
    }

    /**
     *@desc 跳转详情
     */
    _goDetails(_id){
       this.props.navigation.navigate('BBSDetails',{id:_id})
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
});

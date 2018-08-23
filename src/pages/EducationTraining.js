import React, {Component} from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    LayoutAnimation,
    Image,
    Linking,
    StatusBar,
    ImageBackground
} from 'react-native';
import EvilIcons from "react-native-vector-icons/EvilIcons"
import {fetchRequest} from '../utils/FetchUtil'
import {LoadingView} from '../component/Loading';
import {ErrorView} from '../component/ErrorView';

export default class FoldList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            //网络请求状态
            error: false,
            errorInfo: "",
            dataArray: [{title: '英语培训'}, {title: '琴棋书画'}, {title: '体育运动'}, {title: '舞蹈'}, {title: '模特影视'}],
            showFoot: 0, // 控制foot， 0：隐藏footer  1：已加载完成,没有更多数据   2 ：显示加载中
            isRefreshing: false,//下拉控制
        }
    }


    componentDidMount() {
        this.fetchData()
    };


    /**
     * 获取数据
     */
    fetchData(){

        let that = this;
        fetchRequest('training/category/listing','GET').then((res)=>{
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
     * 渲染主界面
     * @returns {*}
     */
    renderData(){
        // 数据
        let data = this.state.dataArray;


        return (
            <View style={styles.bgView}>
                <StatusBar

                    backgroundColor='white'

                    translucent={false}

                    barStyle="dark-content"
                    animated={true}

                />
                <FlatList
                    style={styles.flatList}
                    ref={(flatList) => (this.flatList = flatList)}
                    keyExtractor={(item, index) => index.toString()}
                    data={data}
                    renderItem={this._renderItem}
                />
            </View>
        );
    }


    /**
     * 渲染界面自组件
     * @param item {Object} 每一项数据
     * @returns {*}
     */
    _renderItem = (item) => {
        return (
            <View style={styles.listItemWrap}>
                <TouchableOpacity style={styles.listItemTouch} activeOpacity={0.6} onPress={()=>{
                    this.props.navigation.navigate('CourseList',{title:item.item.name,id:item.item.id})
                }}>
                    <ImageBackground source={{uri:item.item.icon}} style={styles.listItemTouch} />
                </TouchableOpacity>
            </View>
        )
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

const width = Dimensions.get('window').width;

const styles = StyleSheet.create({

    bgView: {
        flex: 1
    },

    flatList: {
        flex: 1,
        backgroundColor:'#fff'
    },
    listItemWrap: {
        marginTop:10,
        paddingHorizontal: 15,
        backgroundColor: '#fff'
    },
    listItemTouch: {
        height:(width-30)/3.45,
        borderRadius:4,
        backgroundColor:'#ddd',
    },
    listItemTitle:{
        fontSize:20,
        color:'#fff'
    }
});
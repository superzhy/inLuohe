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
    StatusBar,
    SafeAreaView
} from 'react-native';
import EvilIcons from "react-native-vector-icons/EvilIcons"
import CourseDetails from "./CourseDetails";
import {fetchRequest} from "../utils/FetchUtil";
import {LoadingView} from '../component/Loading';
import {ErrorView} from '../component/ErrorView';



export default class CourseList extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: navigation.getParam('title', '课程列表'),
        };
    };


    //state
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


    componentDidMount() {
        let id = this.props.navigation.state.params.id;
        this.fetchData(id);
    };


    /**
     * 获取数据
     */
    fetchData(_id){
        let params={
            category_id:_id
        };
        fetchRequest('training/course/listing','POST',params).then((res)=>{
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
            this.setState({
                error: true,
                errorInfo:''
            });
        })
    }



    /**
     * 渲染主界面
     * @returns {*}
     */
    renderData=()=>{
        // 数据
        let data = this.state.dataArray;
        return (
            <SafeAreaView style={styles.bgView}>
                <StatusBar

                    backgroundColor='white'

                    translucent={false}

                    barStyle="dark-content"
                    // animated={true}

                />
                <FlatList
                    style={styles.flatList}
                    ref={(flatList) => (this.flatList = flatList)}
                    numColumns={2}
                    keyExtractor={(item, index) => index.toString()}
                    data={data}
                    renderItem={this._renderItem}
                    ListEmptyComponent={this._renderNull}
                />
            </SafeAreaView>
        );
    };


    /**
     * 渲染子组件
     * @param item {Object} 每一项数据
     * @returns {*}
     */
    _renderItem = (item) => {
        return (
            <TouchableOpacity style={styles.listItemWrap} activeOpacity={.8} onPress={()=>{this.props.navigation.navigate('CourseDetails',{id:item.item.id})}}>
                <Image roundAsCircle={true} source={{uri:item.item.cover}} style={styles.listItemImg}/>
                <Text style={styles.listItemTitle} numberOfLines={1}>{item.item.name}</Text>
                <Text style={styles.originalPrice}>¥{item.item.price}</Text>
                <Text style={styles.presentPrice}>¥{item.item.discount_price}</Text>
            </TouchableOpacity>
        )
    };

    /**
     * 渲染空组件
     * @private
     */
    _renderNull(){
        return (
            <View style={{marginTop:'50%',alignItems:'center',justifyContent:'center'}}>
                <Text>没有数据</Text>
            </View>
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

const width = Dimensions.get('window').width;
const heightW = Dimensions.get('window').height;
const itemWidth  = (width-45)/2;
const styles = StyleSheet.create({

    bgView: {
        flex: 1
    },

    flatList: {
        flex: 1,
        backgroundColor:'#f8f8f8'
    },
    listItemWrap: {
        overflow:'hidden',
        marginLeft:15,
        marginTop:15,
        width:itemWidth,
        height:itemWidth/0.905,
        alignItems:'center',
        borderRadius:5,
        backgroundColor:'#fff'
    },
    listItemImg:{
        width:itemWidth,
        height:itemWidth/1.34,
    },
    listItemTitle:{
        marginTop:5,
        fontSize:12,
        lineHeight:33/2,
        color:'#000'
    },
    originalPrice:{
        fontSize:9,
        lineHeight:25/2,
        color:'#999',
        textDecorationLine:'line-through'
    },
    presentPrice:{
        color:'#FF5C60'
    }

});
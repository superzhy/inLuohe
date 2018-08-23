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
        };
    };


    //state
    constructor(props) {
        super(props);
        this.id='';
        this.type='';
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
        let type = this.props.navigation.state.params.type;
        this.id = id;
        this.type = type;
        this.fetchData(id,type);
    };


    /**
     * 获取数据
     */
    fetchData(_id,_type){
        let params = {
            product_id: _id,
            type:_type,
        };
        fetchRequest('comment/listing','POST',params).then((res)=>{
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
     * 下拉刷新
     * @private
     */
    _onRefresh(){
        this.fetchData(this.id,this.type)
    }

    /**
     * 渲染主界面
     * @returns {*}
     */
    renderData=()=>{
        // 数据
        let data = this.state.dataArray;
        const {isRefreshing} = this.state
        return (
            <SafeAreaView style={styles.bgView}>
                <StatusBar

                    backgroundColor='white'

                    translucent={false}

                    barStyle="dark-content"
                    // animated={true}

                />
                <FlatList
                    onRefresh={this._onRefresh.bind(this)}
                    refreshing={isRefreshing}
                    style={styles.flatList}
                    ref={(flatList) => (this.flatList = flatList)}
                    numColumns={1}
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
    _renderItem = (_item) => {
        let item = _item.item;
        return (
            <View key={_item.index} style={styles.commentItem}>
                <View style={styles.commentHead}>
                    <View style={styles.row}>
                        <Image source={{uri:item.head_img}} style={{width: 22, height: 22, backgroundColor: '#ddd'}}/>
                        <Text style={styles.userName}>{this._setName(item.u_name)}</Text>
                        <View style={styles.userTime}>
                            <Text style={{fontSize: 10, lineHeight: 14, color: '#FFE1B0'}}>已加入{item.join_day}天</Text>
                        </View>
                    </View>

                    <Text style={styles.commentTime}>2018-06-08</Text>
                </View>

                {/* 评论内容 */}
                <View style={{marginTop:10,}}>
                    <Text style={styles.commentContent_text} numberOfLines={3}>
                        {item.value}
                    </Text>

                    <View style={{flexDirection:'row',flexWrap:'wrap',marginTop:10}}>
                        {
                            //生成评论图片
                            this._renderCommentImg(item.img)
                        }
                    </View>
                </View>
            </View>
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

    /**
     *@desc 设置用户名字格式
     *@param {string} name
     */
    _setName(name) {
        const first = name.substr(0, 1);
        const last = name.substr(-1);
        return first + '****' + last
    };


    /**
     *@desc 生成评论图片
     *@param {array} _ImgList
     */
    _renderCommentImg(_ImgList){
        return _ImgList.map((item,index)=>{
            return <Image key={index} source={{uri:item}} style={[styles.imgItem,(index+1)%3===0&&{marginRight:0}]} activeOpacity={0.6}>

            </Image>
        })
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
        backgroundColor:'#f8f8f8'
    },



    //评论样式
    content: {
        paddingHorizontal: 15,
    },
    commentItem: {
        paddingVertical: 15,
        paddingHorizontal:15,
        borderBottomWidth:1,
        borderStyle:'solid',
        borderColor:'#EEE',
        backgroundColor:'#fff'
    },

    //评论头部样式
    commentHead: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    userName: {
        paddingHorizontal: 3,
        fontSize: 12,
        lineHeight: 18,
        color: '#999'
    },
    userTime: {
        paddingHorizontal: 5,
        paddingVertical: 3,
        borderRadius: 5,
        backgroundColor: '#483F37'
    },
    commentTime:{
        fontSize:10,
        lineHeight:14,
        color:'#999'
    },


    //评论详情
    commentContent_text:{
        fontSize:26/2,
        lineHeight:37/2,
        color:'#333'
    },

    imgItem:{
        width:(width-30-6)/3,
        height:(width-30-6)/3,
        backgroundColor:'#ddd',
        marginRight:3},

});
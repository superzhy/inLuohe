import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    Animated,
    Easing,
    View,
    Text,
    Dimensions,
    SafeAreaView,
    ScrollView,
    WebView,
    StatusBar,
    TextInput,
    Modal,
    TouchableOpacity, AsyncStorage
} from 'react-native';
// import Dimensions from 'Dimensions';
import ColumnTitle from '../component/ColumnTitle';
import CommentItem from '../component/CommentItem';
import WebCont from '../component/WebCont';
import Toast from "../component/Toast";

import {LoadingView} from '../component/Loading';
import {ErrorView} from '../component/ErrorView';
import {fetchRequest} from "../utils/FetchUtil";






export default class extends Component {

    constructor(props) {
        super(props);
        this.id = '';
        this.commentY='',
        this.state = {
            modalVisible:false,
            isLoading: true,
            //网络请求状态
            error: false,
            errorInfo: "",
            data: [], //列表数据
            comment:[],
            isRefreshing: false,//下拉控制,
            height_webview: 0,
            osAndroid:(Platform.OS === 'ios') ? false : true,
            height:'',

            commentValue:''
        };
    }


    componentDidMount() {
        let id = this.props.navigation.state.params.id;
        this.id = id;
        this.fetchData(id);
        this.fetchComment(id);
    };

    /**
     * 获取数据
     */
    fetchData(_id) {
        let params = {
            news_id: _id
        };
        fetchRequest('news/content/detail', 'POST', params).then((res) => {
            console.log(res);
            console.log(res.code)
            if (res.code == 1) {
                this.setState({
                    data: res.results,
                    isLoading: false,
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


    /**
     * 获取评论
     */
    fetchComment(_id) {
        const params = {
            news_id: _id
        };
        fetchRequest('news/comment/listing', 'POST', params).then((res) => {
            console.log(res);
            if (res.code == 1) {
                this.setState({
                    comment: res.results,
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


    _closeModal(){
      this.setState({
          modalVisible:false,
      })
    };




    /**
     * 生成主界面
     * @returns {*}
     */
    renderData(){
        const {data,comment} = this.state;
        return(
            <SafeAreaView style={styles.container}>
                <StatusBar

                    backgroundColor='white'

                    translucent={false}

                    barStyle="dark-content"
                    animated={true}

                />

                <ScrollView style={{flex:1}} ref={(view) => { this.myScrollView = view; }}>
                    <View style={styles.title}>
                        <Text style={{fontSize:34/2,lineHeight:48/2,fontFamily:'PingFangSC-Medium'}} numberOfLines={2}>{data.title}</Text>
                    </View>
                    {/*内容详情*/}
                    <WebCont content={data.content}/>

                    {/*评论*/}
                    <View style={styles.comment} onLayout={event=>{this.commentY = event.nativeEvent.layout.y}}>
                        <ColumnTitle title={'评论'} arrow={false}/>
                        {
                            comment.length>0?comment.map((item, index) => {
                                return <CommentItem key={index} data={item}/>
                            }):<Text style={{textAlign:'center'}}>无评论</Text>
                        }
                    </View>
                </ScrollView>


                <View style={styles.footer}>
                    <TouchableOpacity style={styles.inputBtn} onPress={()=>{

                        this._toComment()
                    }}>
                        <Text>写评论</Text>
                    </TouchableOpacity>
                </View>


                <Modal
                    animationType={"slide"}
                    transparent={true}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {this._closeModal()}}
                >
                    <TouchableOpacity style={{flex:1,backgroundColor:'transparent'}} onPress={()=>this._closeModal()} />
                    <View style={styles.modalCont}>
                        <TextInput
                            style={styles.input}
                            autoFocus={true}
                            placeholder='输入评论内容'
                            placeholderTextColor='#999999'
                            underlineColorAndroid='transparent' //设置下划线背景色透明 达到去掉下划线的效果
                            onChangeText={(text)=>{
                                this.setState({
                                    commentValue:text
                                })
                            }}
                        />

                        <Text style={{paddingHorizontal:10,textAlign:'center'}} onPress={()=>{
                            this._submitComment()
                        }}>确定</Text>
                    </View>
                </Modal>
                <Toast ref="toast"/>
            </SafeAreaView>

        );
    }


    /**
     * 去评论
     * @private
     */
    _toComment(){
        AsyncStorage.getItem('userInfo', (error, result) => {
            if (!error) {
                console.log(result);
                if(result){
                    this.setState({modalVisible:true})
                }else{
                    this.props.navigation.navigate('LoginModal')
                }
            }
        });
    }

    /**
     * 提交评论
     * @private
     */
    _submitComment(){
        const {commentValue} =this.state;
        let params={
            news_id:this.id,
            content:this.state.commentValue
        };
        if(commentValue){
            fetchRequest('news/comment/create','POST',params).then((res)=>{
                console.log(res);
                console.log(res.code);
                this.setState({modalVisible:false})
                if(res.code==1){
                    this.refs.toast.show(res.message,3000);
                    this.myScrollView.scrollTo({ x:0, y: this.commentY, animated: true});
                    this.fetchComment(this.id)
                }
            }).catch((err)=>{
                console.log(err);
                //请求失败
                this.setState({
                    error: true,
                    errorInfo:''
                });
            })
        }else{
            alert('填写内容')
        }
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

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor:'#fff'
    },

    title:{
        marginVertical:20,
        alignItems:'center',
    },

    comment:{
        paddingHorizontal:15,
    },

    footer:{
        flexDirection:'row',
        alignItems:'center',
        paddingHorizontal:15,
        height:94/2,
        borderTopWidth:1,
        borderStyle:'solid',
        borderColor:'#ddd',
        backgroundColor:"#fff"
    },
    inputGroup:{

    },

    inputBtn:{
        paddingLeft:10,
        flex:1,
        height:54/2,
        justifyContent:'center',
        backgroundColor:'#f8f8f8',
        borderWidth:1,
        borderStyle:'solid',
        borderColor:'#eee',
    },
    modalCont:{
        padding:15,
        flexDirection:'row',
        alignItems:'center',
        backgroundColor:'#fff',
    },

    input:{
        padding:5,
        flex:1,
        borderWidth:1,
        borderStyle:'solid',
        borderColor:'#ddd',
        backgroundColor:'#f8f8f8',
    }
});
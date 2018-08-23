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
    SafeAreaView, AsyncStorage,
    StatusBar,
    TouchableOpacity,
    FlatList,
    Modal
} from 'react-native';

import ColumnTitle from '../component/ColumnTitle'
import Icon from "react-native-vector-icons/Ionicons"
import CommentItem from '../component/CommentItem'
import {setDate} from '../utils/DateUtil'
import Toast from "../component/Toast";

import {fetchRequest} from "../utils/FetchUtil";
import {LoadingView} from '../component/Loading';
import {ErrorView} from '../component/ErrorView';

export default class BBSDetails extends Component {
    static navigationOptions = ({navigation, screenProps}) => {
        return ({
            title: '',
            headerRight: <Text style={{fontSize: 16, fontWeight: 'bold'}}>...</Text>,
        })
    };


    constructor(props) {
        super(props);
        this.id = '';
        this.commentY = '',
            this.imageH = [],
            this.state = {
                isLoading: true,
                //网络请求状态
                error: false,
                errorInfo: "",
                data: '',
                comment: [],
                isRefreshing: false,//下拉控制
                modalVisible: false,
                commentValue: ''
            }
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
        const params = {
            forum_id: _id
        };
        fetchRequest('forum/content/detail', 'POST', params).then((res) => {
            console.log(res);
            if (res.code == 1) {
                this.setState({
                    data: res.results,
                    isLoading: false,
                    isRefreshing: false
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
     * 获取数据
     */
    fetchComment(_id) {
        const params = {
            forum_id: _id
        };
        fetchRequest('forum/reply/listing', 'POST', params).then((res) => {
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


    /**
     *@desc渲染主界面
     */
    renderData() {
        const {data, comment} = this.state;
        return (
            <SafeAreaView style={styles.container}>

                <ScrollView style={{flex: 1, paddingHorizontal: 15,}} ref={(view) => {
                    this.myScrollView = view;
                }}>
                    <Text style={styles.title_text} numberOfLines={2}>{data.title}</Text>

                    <View style={styles.userInfo}>
                        <Image source={{uri: data.head_img}} style={styles.userImg}/>
                        <View>
                            <Text style={styles.userName_text}>{data.u_name}</Text>
                            <Text style={styles.date_text}>{setDate(data.created_at)}</Text>
                        </View>
                    </View>

                    <View style={styles.cont}>
                        <Text style={styles.cont_text}>{data.content}</Text>

                        {
                            // data.imgs.map((item,index)=>{
                            //     console.log(this)
                            //     return <Image
                            //         key={index}
                            //         source={{uri:item}}
                            //         style={{height:200}}
                            //     />
                            // })
                            // console.log(data.imgs)

                            data.imgs&&data.imgs.map((item, index) => {
                                return (
                                    <Image key={index} source={{uri:item}} style={{height:200}}/>
                                )
                            })

                        }
                    </View>


                    {/*评论*/}
                    <View style={styles.comment} onLayout={event => {
                        this.commentY = event.nativeEvent.layout.y
                    }}>
                        <ColumnTitle title={'评论'} arrow={false}/>

                        {
                            comment.length > 0 && comment.map((item, index) => {
                                return <CommentItem key={index} data={item}/>
                            })
                        }
                    </View>
                </ScrollView>

                {/*底部*/}
                <View style={styles.footer}>
                    <TouchableOpacity style={styles.inputBtn} onPress={() => {
                        this._toComment()
                    }}>
                        <Text>写评论</Text>
                    </TouchableOpacity>

                    <View style={styles.footerOption}>
                        <TouchableOpacity style={styles.footerOptionTouch}>
                            <Image source={require('../images/icon/icon_bbs_pinglun.png')}
                                   style={{width: 39 / 2, height: 36 / 2}}/>
                            <View style={styles.footerOptionBadge}>
                                {/*<Text style={{fontSize: 7, lineHeight: 10, color: '#fff',}}>11</Text>*/}
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.footerOptionTouch} onPress={()=>{
                            this.refs.toast.show('点赞成功 ', 3000);
                        }}>
                            <Image source={require('../images/icon/icon_bbs_dianzan1.png')}
                                   style={{width: 35 / 2, height: 36 / 2}}/>
                            <View style={styles.footerOptionBadge}>
                                {/*<Text style={{fontSize: 7, lineHeight: 10, color: '#fff',}}>11</Text>*/}
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>


                <Modal
                    animationType={"slide"}
                    transparent={true}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {
                        this._closeModal()
                    }}
                >
                    <TouchableOpacity style={{flex: 1, backgroundColor: 'transparent'}}
                                      onPress={() => this._closeModal()}/>
                    <View style={styles.modalCont}>
                        <TextInput
                            style={styles.input}
                            autoFocus={true}
                            placeholder='输入评论内容'
                            placeholderTextColor='#999999'
                            underlineColorAndroid='transparent' //设置下划线背景色透明 达到去掉下划线的效果
                            onChangeText={(text) => {
                                this.setState({
                                    commentValue: text
                                })
                            }}
                        />
                        <Text style={{paddingHorizontal: 10, textAlign: 'center'}} onPress={() => {
                            this._submitComment()
                        }}>确定</Text>
                    </View>
                </Modal>
                <Toast ref="toast"/>
            </SafeAreaView>
        )
    }

    /**
     *@desc关闭输入框
     */
    _closeModal() {
        this.setState({
            modalVisible: false,
        })
    }


    /**
     * 去评论
     * @private
     */
    _toComment() {
        AsyncStorage.getItem('userInfo', (error, result) => {
            if (!error) {
                console.log(result);
                if (result) {
                    this.setState({modalVisible: true})
                } else {
                    this.props.navigation.navigate('LoginModal')
                }
            }
        });
    }

    /**
     * 提交评论
     * @private
     */
    _submitComment() {
        const {commentValue} = this.state;
        let params = {
            forum_id: this.id,
            content: this.state.commentValue
        };
        if (commentValue) {
            fetchRequest('forum/reply/create', 'POST', params).then((res) => {
                console.log(res);
                console.log(res.code);
                this.setState({modalVisible: false})
                if (res.code == 1) {
                    this.refs.toast.show(res.message, 3000);
                    this.myScrollView.scrollTo({x: 0, y: this.commentY, animated: true});
                    this.fetchComment(this.id)
                }
            }).catch((err) => {
                console.log(err);
                //请求失败
                this.setState({
                    error: true,
                    errorInfo: ''
                });
            })
        } else {
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
const windowW = Dimensions.get('window').width;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative',
        backgroundColor: '#fff'
    },
    title_text: {
        marginTop: 15,
        fontSize: 34 / 2,
        lineHeight: 48 / 2,
    },
    userInfo: {
        marginTop: 12,
        flexDirection: 'row',
        alignItems: 'center'
    },
    userImg: {
        marginRight: 5,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#ddd',
    },
    userName_text: {
        fontSize: 24 / 2,
        lineHeight: 33 / 2,
        color: '#666'
    },
    date_text: {
        fontSize: 20 / 2,
        lineHeight: 28 / 2,
        color: '#999'
    },

    cont: {
        marginTop: 20,
    },
    cont_text: {
        fontSize: 28 / 2,
        lineHeight: 50 / 2,
        color: '#333'
    },

    comment: {
        marginTop: 30,
        borderTopWidth: 1,
        borderColor: '#eee'
    },

    footer: {
        height: 44,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        borderTopWidth: 1,
        borderColor: '#eee',
        backgroundColor: '#fff'
    },
    inputBtn: {
        marginRight: 10,
        flex: 7,
        justifyContent: 'center',
        height: 54 / 2,
        borderRadius: 5,
        backgroundColor: '#f8f8f8',
    },
    footerOption: {
        flex: 3,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    footerOptionTouch: {
        height: 44,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
    },
    footerOptionBadge: {
        position: 'absolute',
        top: 8,
        right: 8,
        paddingHorizontal: 5,
        borderRadius: 4,
        backgroundColor: 'red'
    },
    modalCont: {
        padding: 15,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
    },

    input: {
        padding: 5,
        flex: 1,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#ddd',
        backgroundColor: '#f8f8f8',
    }
});

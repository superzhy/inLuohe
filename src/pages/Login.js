import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    Image,
    StatusBar,
    AsyncStorage,
    DeviceEventEmitter,
    Alert,
    BackHandler
} from 'react-native';


//引用自定义组件
import InputGroup from "../component/InputGroup";
import Toast from "../component/Toast";
import {setToken} from "../utils/FetchUtil";
import {fetchRequest} from "../utils/FetchUtil";

import *as wechat from 'react-native-wechat'
export default class Login extends Component {
    state = {
        inputReady: false,
        userName: '',
        pwd: ''
    };

    componentDidMount() {
        this._navListener = this.props.navigation.addListener('didFocus', () => {
            StatusBar.setBarStyle('dark-content');
            // (Platform.OS === 'android') && StatusBar.setTranslucent(true);
            (Platform.OS === 'android') && StatusBar.setBackgroundColor('#fff');
        });
        wechat.registerApp('wx275f425f5a9786bb')
    }
    componentWillUnmount() {
        this._navListener.remove();
        let refirsh=this.props.navigation.getParam('refirsh','');
        if(refirsh){
            refirsh();
        }

    }



    /**
     *@desc input更改验证
     */
    _inputChange() {
        let userName = this.state.userName,
            pwd = this.state.pwd;

        console.log('userName' + userName);
        console.log(pwd);
        if (userName && pwd) {
            this.setState({
                inputReady: true
            })
        } else {
            this.setState({
                inputReady: false
            })
        }
    };


    /**
     *@desc 提交服务器验证
     */
    _submit() {
        let params = {
            username:this.state.userName,
            password:this.state.pwd
        };
        fetchRequest('user/login','POST',params).then((res)=>{
            console.log(res);
            console.log(res.code)
            if(res.code===1){
                // this.setState({
                //     headerData:res.results,
                //     isLoading: false,
                // });
                this.refs.toast.show(res.message,3000);
                let userInfo = res.results;
                setToken(res.results.token);
                AsyncStorage.setItem('userInfo',JSON.stringify(userInfo));

                setTimeout(()=>{
                    this.props.navigation.goBack();
                },1000)
            }else if(res.code===-1){
                this.refs.toast.show(res.message,3000);
            }else if(res.code===-2){
                this.refs.toast.show(res.message[0],3000);
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
     * 微信登录
     */
    wxLogin(){
        let scope = 'snsapi_userinfo';
        let state = 'wechat_sdk_demo';
        //判断微信是否安装
        wechat.isWXAppInstalled()
            .then((isInstalled) => {
                if (isInstalled) {
                    //发送授权请求
                    wechat.sendAuthRequest(scope, state)
                        .then(responseCode => {
                            //返回code码，通过code获取access_token
                            console.log(responseCode)
                            // this.getAccessToken(responseCode.code);

                            this.wxLoginSumbit(responseCode.code)
                        })
                        .catch(err => {
                            Alert.alert('登录授权发生错误：', err.message, [
                                {text: '确定'}
                            ]);
                        })
                } else {
                    Platform.OS == 'ios' ?
                        Alert.alert('没有安装微信', '是否安装微信？', [
                            {text: '取消'},
                            {text: '确定', onPress: () => this.installWechat()}
                        ]) :
                        Alert.alert('没有安装微信', '请先安装微信客户端在进行登录', [
                            {text: '确定'}
                        ])
                }
                // console.log(isInstalled)
            })
    };


    wxLoginSumbit(code){
        console.log(code)
        let params = {
            code:code
        };
        fetchRequest('user/wx/login','POST',params).then((res)=>{
            console.log(res);
            console.log(res.code)
            if(res.code===1){
                // this.setState({
                //     headerData:res.results,
                //     isLoading: false,
                // });
                this.refs.toast.show(res.message,3000);
                let userInfo = res.results;
                setToken(res.results.token);
                AsyncStorage.setItem('userInfo',JSON.stringify(userInfo));

                setTimeout(()=>{
                    this.props.navigation.goBack();
                },1000)
            }else if(res.code===-1){
                this.refs.toast.show(res.message,3000);
            }else if(res.code===-2){
                this.refs.toast.show(res.message[0],3000);
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

    render() {
        const {inputReady} = this.state;
        return (
            <View style={styles.container}>
                <StatusBar

                backgroundColor='white'

                translucent={false}

                barStyle="dark-content"
                // animated={true}

                />
                <ScrollView style={{flex: 1, paddingHorizontal: 15,position:'relative'}}>
                    <View style={styles.title}>
                        <Text style={styles.title_text}>手机快速登录</Text>
                    </View>
                    {/*登录框*/}
                    <View style={styles.inputBox}>
                        <InputGroup placeholder='请输入手机号' icon={require('../images/icon/phone.png')}  iconStyle={{width:13.5,height:17}} getValue={(text) => {
                            console.log(text);
                            this.setState({
                                userName: text
                            }, () => {
                                this._inputChange()
                            });


                        }}/>
                        <InputGroup
                            placeholder='请输入密码' icon={require('../images/icon/password.png')} style={{marginTop: 32}} iconStyle={{width:15,height:17}} pwd={true} rightType='eye'
                            getValue={(text) => {
                                this.setState({
                                    pwd: text
                                }, () => {
                                    this._inputChange()
                                });

                            }}/>
                    </View>

                    {/*按钮*/}
                    {
                        inputReady ?
                            <TouchableOpacity style={[styles.btn, {backgroundColor: "#FF5C60"}]} onPress={() => {
                                this._submit()
                            }}>
                                <Text style={{color: '#fff'}}>登录</Text>
                            </TouchableOpacity> :
                            <View style={styles.btn}>
                                <Text style={{color: '#aaa'}}>登录</Text>
                            </View>
                    }

                    {/*其他选项*/}
                    <View style={styles.otherLink}>
                        <Text style={styles.otherLink_text} onPress={()=>{this.props.navigation.navigate('Register')}}>手机快速注册</Text>
                        <Text style={styles.otherLink_text} onPress={()=>{this.props.navigation.navigate('ForgetPwd')}}>忘记密码</Text>
                    </View>
                    {/*其他登录*/}
                    <View style={styles.otherLoginType}>
                        <View style={{height: 20}}>
                            <Text style={styles.otherLoginType_tit_text}>其他登录方式</Text>
                        </View>
                        <View style={styles.otherType_link}>
                            <TouchableOpacity onPress={()=>{
                                this.wxLogin()
                            }}>
                                <Image source={require('../images/icon/wechat.png')} style={{width: 49, height: 49}}/>
                            </TouchableOpacity>
                            {/*<TouchableOpacity>*/}
                                {/*<Image source={require('../images/icon/qq.png')} style={{width: 49, height: 49}}/>*/}
                            {/*</TouchableOpacity>*/}
                            {/*<TouchableOpacity>*/}
                                {/*<Image source={require('../images/icon/microblog.png')} style={{width: 49, height: 49}}/>*/}
                            {/*</TouchableOpacity>*/}
                        </View>
                    </View>
                </ScrollView>
                <Toast ref="toast"/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
        backgroundColor: '#fff',
    },
    title: {
        marginTop: 30,
        borderLeftWidth: 7,
        borderStyle: 'solid',
        borderColor: '#FF5C60'
    },
    title_text: {
        marginLeft: 10,
        fontSize: 18,
        lineHeight: 25
    },
    inputBox: {
        marginTop: 45,
        flex: 1
    },
    btn: {
        marginTop: 47.5,
        flex: 1,
        height: 45,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4,
        backgroundColor: "#C7C7C7"
    },
    otherLink: {
        marginTop: 20,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    otherLink_text: {
        color: '#FF5C60'
    },
    otherLoginType: {
       marginTop:100,
    },

    otherLoginType_tit_text: {
        fontSize: 14,
        lineHeight: 20,
        textAlign:'center',
        color: '#333'
    },

    otherType_link: {
        marginTop: 15,
        paddingHorizontal: 30,
        flexDirection: "row",
        justifyContent: 'space-around'
    }
});

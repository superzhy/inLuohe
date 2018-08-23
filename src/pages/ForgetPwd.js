import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    Image,
} from 'react-native';


//引用自定义组件
import InputGroup from "../component/InputGroup";
import Toast from "../component/Toast";

import {fetchRequest} from "../utils/FetchUtil";


export default class Register extends Component {
    state = {
        inputReady: false,
        userName: '',
        pwd: '',
        ConfirmPwd:'',
        VerificationCode:''
    };

    /**
     *@desc input更改验证
     */

    _inputChange() {
        // let userName = this.state.userName,
        //     pwd = this.state.pwd;
        const {userName,pwd,ConfirmPwd,VerificationCode} = this.state;

        console.log('userName' + userName);
        console.log(pwd);
        if (userName && pwd&&ConfirmPwd&&VerificationCode) {
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
        const {userName,pwd,ConfirmPwd,VerificationCode} = this.state;
        if(pwd.length<6){
            // alert('密码必须大于6位')
            this.refs.toast.show('密码必须大于6位!',3000);
        }else if(pwd!==ConfirmPwd){
            this.refs.toast.show('两次密码不一致!',3000);
        }else {
            let params = {
                phone:userName,
                password:ConfirmPwd,
                code:VerificationCode
            };
            fetchRequest('user/forget','POST',params).then((res)=>{
                console.log(res);
                console.log(res.code)
                if(res.code===1){
                    // this.setState({
                    //     headerData:res.results,
                    //     isLoading: false,
                    // });
                    this.refs.toast.show(res.message,3000);
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
    }



    /**
     *获取验证码
     */
    getCode(){
        const {userName} = this.state;
        if(userName){
            if(/^[1][0-9]{10}$/.test(userName)){
                this.fetchCode(userName);
                return true
            }else {
                this.refs.toast.show('填写正确手机号',3000);
                return false
            }
        }else{
            this.refs.toast.show('填写用户名',3000);
            return false
        }
    };

    /**
     *请求验证码
     */
    fetchCode(userName){
        let params={
            phone:userName
        };
        fetchRequest('user/forget/code','POST',params).then((res)=>{
            console.log(res);
            if(res.code===1){
                this.refs.toast.show(res.message,3000);
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
                <ScrollView style={{flex: 1, paddingHorizontal: 15, position: 'relative'}}>

                    {/*输入框*/}
                    <View style={styles.inputBox}>
                        <InputGroup
                            placeholder='请输入手机号' icon={require('../images/icon/phone.png')}
                            iconStyle={{width: 13.5, height: 17}} rightType='countdown'
                            getCode={()=>{
                                return this.getCode()
                            }}
                            getValue={(text) => {
                                console.log(text);
                                this.setState({
                                    userName: text
                                }, () => {
                                    this._inputChange()
                                });


                            }}/>
                        <InputGroup
                            placeholder='请输入验证码' icon={require('../images/icon/verification_code.png')}
                            style={{marginTop: 32}} iconStyle={{width: 15, height: 17}}
                            getValue={(text) => {
                                this.setState({
                                    VerificationCode: text
                                }, () => {
                                    this._inputChange()
                                });

                            }}/>
                        <InputGroup
                            placeholder='请输入密码' icon={require('../images/icon/password.png')} style={{marginTop: 32}}
                            iconStyle={{width: 15, height: 17}} pwd={true} rightType='eye'
                            getValue={(text) => {
                                this.setState({
                                    pwd: text
                                }, () => {
                                    this._inputChange()
                                });

                            }}/>
                        <InputGroup
                            placeholder='请输入确认密码' icon={require('../images/icon/password.png')} style={{marginTop: 32}}
                            iconStyle={{width: 15, height: 17}} pwd={true} rightType='eye'
                            getValue={(text) => {
                                this.setState({
                                    ConfirmPwd: text
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
                                <Text style={{color: '#fff'}}>注册</Text>
                            </TouchableOpacity> :
                            <View style={styles.btn}>
                                <Text style={{color: '#aaa'}}>注册</Text>
                            </View>
                    }

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
        marginTop: 100,
    },

    otherLoginType_tit_text: {
        fontSize: 14,
        lineHeight: 20,
        textAlign: 'center',
        color: '#333'
    },

    otherType_link: {
        marginTop: 15,
        paddingHorizontal: 30,
        flexDirection: "row",
        justifyContent: 'space-around'
    }
});

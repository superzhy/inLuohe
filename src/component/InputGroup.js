import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Image,
    TextInput,
    TouchableOpacity
} from 'react-native';
import Icon from "react-native-vector-icons/Ionicons"

export default class InputGroup extends Component {


    state = {
        secureTextEntry: true,
        countDown: true,
        count: 60
    };

    /**
     *@desc界面卸载
     */
    componentWillUnmount() {
        //清除定时器
        clearInterval(this.timer);
    }

    /**
     *@desc 切换密码显示
     */
    _changeType() {
        this.setState({
            secureTextEntry: !this.state.secureTextEntry,
        })
    };


    /**
     *@desc倒计时
     */
    _countDown() {

        this.setState({
            countDown: false,
        });
        this.timer = setInterval(() => {
            const {count} = this.state;
            if (count === 0) {
                this.setState({
                    countDown: true,
                    count: 60
                })
                return clearInterval(this.timer);
            }
            this.setState({
                countDown: false,
                count: count - 1,
            });
        }, 1000);
    }

    /**
     *@desc 右侧显示类型
     */
    _showRight(_rightType, _getCode) {
        const {count, countDown} = this.state;
        switch (_rightType) {
            case 'eye':
                return (
                    <TouchableOpacity onPress={() => {
                        this._changeType()
                    }}>
                        <Icon name='ios-eye-outline' size={25}/>
                    </TouchableOpacity>
                );
            case 'countdown':
                return (
                    countDown ? <TouchableOpacity style={styles.countDown} onPress={() => {
                            _getCode()&&this._countDown();
                        }}>
                            <Text style={{fontSize: 14, color: '#999'}}>获取验证码</Text>
                        </TouchableOpacity> :
                        <Text style={{fontSize: 14, color: '#999'}}>{count}秒后重新获取</Text>
                );
        }

    }

    render() {
        const {style, iconStyle, icon = require('../images/icon/phone.png'), rightType = '', placeholder = '输入内容', pwd = false, getValue, getCode} = this.props;
        return (
            <View style={[styles.container, style]}>
                <View style={styles.icon}>
                    <Image source={icon} style={iconStyle}/>
                </View>
                <TextInput
                    style={styles.input}
                    placeholder={placeholder}
                    placeholderTextColor='#999999'
                    underlineColorAndroid='transparent' //设置下划线背景色透明 达到去掉下划线的效果
                    secureTextEntry={pwd && this.state.secureTextEntry}
                    onChangeText={(text) => {
                        getValue(text)
                    }}
                />
                {
                    this._showRight(rightType, getCode)
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderStyle: "solid",
        borderColor: '#eee'
    },
    icon: {
        marginRight: 9,
        width: 24,
        height: 17.5,
        borderRightWidth: 1,
        borderStyle: 'solid',
        borderColor: '#FF5C60'
    },
    input: {
        flex: 1,
        fontSize: 14,
        // lineHeight: 25,
        height: 25,
        padding: 0
    },
    countDown: {
        width: 85,
        height: 24,
        borderWidth: 1,
        borderStyle: 'solid',
        borderRadius: 4,
        borderColor: '#999999',
        alignItems: 'center',
        justifyContent: 'center'
    }
});
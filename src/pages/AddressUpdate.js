import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    FlatList,
    StatusBar,
    Image,
    ScrollView,
    Dimensions,
    TouchableOpacity,
    TextInput
} from 'react-native';

import Picker from 'react-native-picker'
import Icon from "react-native-vector-icons/Ionicons"
import cityJson from '../city'
import Toast from "../component/Toast";
import {LoadingView} from '../component/Loading';
import {ErrorView} from '../component/ErrorView';
import {fetchRequest} from "../utils/FetchUtil";

export default class AddressUpdate extends Component {
    static navigationOptions = ({navigation, screenProps}) => {
        // return ({
        //     header: null,
        // })
    };


    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            isDefault: false,
            btnStatus: false,
            name: '',
            phone: '',
            cityValue: '',
            city: '',
            address: '',
        };
    }


    componentDidMount() {
        let id = this.props.navigation.state.params.id;
        this.id = id;
        this.fetchData(id);
    };

    componentWillUnmount() {
        let refirsh = this.props.navigation.getParam('refirsh', '');
        if (refirsh) {
            refirsh();
        }
    }


    /**
     * 获取数据
     */
    fetchData(_id) {
        let params = {
            address_id: _id
        };
        fetchRequest('user/address/detail', 'POST', params).then((res) => {
            console.log(res);
            console.log(res.code)
            if (res.code == 1) {
                this.setState({
                    data: res.results,
                    cityValue: res.results.province + res.results.city + res.results.area,
                    name: res.results.name,
                    phone: res.results.phone,
                    address: res.results.street,
                    city:[res.results.province,res.results.city,res.results.area],
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
     * 显示城市选择器
     */
    showPicker = () => {
        let data = [
            {
                "北京": [
                    {
                        '北京': [
                            "东城区",
                            "西城区",
                            "崇文区",
                            "宣武区",
                            "朝阳区",
                            "丰台区",
                            "石景山区",
                            "海淀区",
                            "门头沟区",
                            "房山区",
                            "通州区",
                            "顺义区",
                            "昌平区",
                            "大兴区",
                            "平谷区",
                            "怀柔区",
                            "密云县",
                            "延庆县",
                            "其他"
                        ]
                    }
                ]
            }
        ];


        Picker.init({
            pickerData: data,
            selectedValue: [59],
            pickerCancelBtnText: '关闭',
            pickerConfirmBtnText: '确定',
            pickerTitleText: '城市选择',
            onPickerConfirm: data => {
                console.log(data);

                this.setState({
                    cityValue: data[0] + ' ' + data[1] + ' ' + data[2],
                    city: data
                })
                this.changeStatus();
            },
            onPickerCancel: data => {
                console.log(data);
            },
            onPickerSelect: data => {
                console.log(data);
            }
        });


        Picker.show();
    };



    /**
     * 提交数据
     */
    _submit() {
        const {name, phone, address, city,isDefault} = this.state
        let params = {
            address_id:this.id,
            name: name,
            phone: phone,
            province: city[0],
            city: city[1],
            area: city[2],
            street: address,
            is_default:isDefault
        };
        fetchRequest('user/address/update', 'POST', params).then((res) => {
            console.log(res);
            console.log(res.code)
            if (res.code === 1) {
                this.refs.toast.show(res.message, 3000);
                setTimeout(() => {
                    this.props.navigation.goBack();
                }, 1000)
            } else if (res.code === -1) {
                this.refs.toast.show(res.message, 3000);
            } else if (res.code === -2) {
                this.refs.toast.show(res.message[0], 3000);
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
     *生成主界面
     */
    renderData() {
        return (
            <SafeAreaView>
                <View style={styles.inputBox}>
                    <View style={styles.group}>
                        <View style={styles.inputTitle}>
                            <Text>收货人:</Text>
                        </View>
                        <View style={{marginLeft: 15, flex: 1}}>
                            <View style={[styles.inputGroup, {borderBottomWidth: 1, borderColor: '#eee'}]}>
                                <TextInput
                                    style={styles.input}
                                    placeholder={'输入收货人姓名'}
                                    placeholderTextColor='#999999'
                                    underlineColorAndroid='transparent' //设置下划线背景色透明 达到去掉下划线的效果
                                    onChangeText={(text) => {
                                        this.setState({
                                            name: text
                                        })

                                    }}
                                    value={this.state.name}
                                />
                            </View>
                            <View style={styles.inputGroup}>
                                <TextInput
                                    style={styles.input}
                                    placeholder={'输入联系电话'}
                                    placeholderTextColor='#999999'
                                    underlineColorAndroid='transparent' //设置下划线背景色透明 达到去掉下划线的效果
                                    onChangeText={(text) => {
                                        this.setState({
                                            phone: text
                                        })
                                    }}
                                    value={this.state.phone}
                                />
                            </View>
                        </View>
                    </View>

                    <View style={[styles.group, {borderTopWidth: 1, borderColor: '#eee'}]}>
                        <View style={styles.inputTitle}>
                            <Text>所在地区:</Text>
                        </View>
                        <View style={{marginLeft: 15, flex: 1}}>
                            <TouchableOpacity
                                style={[styles.inputGroup, {borderBottomWidth: 1, borderColor: '#eee'}]}
                                onPress={() => {
                                    this.showPicker()
                                }}
                            >
                                <TextInput
                                    style={styles.input}
                                    placeholder={'选择省市区'}
                                    placeholderTextColor='#999999'
                                    underlineColorAndroid='transparent' //设置下划线背景色透明 达到去掉下划线的效果
                                    editable={false}
                                    value={this.state.cityValue}
                                />
                            </TouchableOpacity>
                            <View style={styles.inputGroup}>
                                <TextInput
                                    style={styles.input}
                                    placeholder={'输入详细街道信息'}
                                    placeholderTextColor='#999999'
                                    underlineColorAndroid='transparent' //设置下划线背景色透明 达到去掉下划线的效果
                                    onChangeText={(text) => {
                                        this.setState({
                                            address: text
                                        })
                                    }}
                                    value={this.state.address}
                                />
                            </View>
                        </View>
                    </View>
                </View>

                {/*设置默认*/}
                <TouchableOpacity
                    style={styles.setDefault}
                    activeOpacity={0.6}
                    onPress={() => {
                        this.setState({
                            isDefault: !this.state.isDefault
                        })
                    }}
                >
                    <Text>设为默认</Text>
                    {
                        this.state.isDefault ? <Icon name='ios-checkmark-circle' size={25} color='#FF5C60'/>
                            : <Icon name='ios-checkmark-circle-outline' size={25}/>
                    }
                </TouchableOpacity>


                {/*按钮*/}
                <TouchableOpacity
                    style={[styles.submitBtn]}
                    activeOpacity={0.6}
                    onPress={() => {
                        this._submit()
                    }}
                >
                    <Text style={{color: '#fff'}}>保存</Text>
                </TouchableOpacity>

                <Toast ref="toast"/>
            </SafeAreaView>
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


const {height, width} = Dimensions.get('window');
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        position: 'relative'
    },
    inputBox: {
        paddingHorizontal: 15,
        backgroundColor: '#fff'
    },
    group: {
        flexDirection: 'row'
    },
    inputTitle: {
        width: 70,
        height: 78 / 2,
        justifyContent: 'center'
    },
    inputGroup: {
        // flex:1,
        height: 78 / 2,
        justifyContent: 'center'
    },
    input: {
        flex: 1,
    },

    setDefault: {
        marginTop: 10,
        paddingHorizontal: 15,
        height: 40,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "space-between",
        backgroundColor: '#fff',
    },
    submitBtn: {
        marginTop: 50,
        width: width - 30,
        height: (width - 30) / 7.666,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',

        borderRadius: 5,
        backgroundColor: "#FF5C60"
    }
});

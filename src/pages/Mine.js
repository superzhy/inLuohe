import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    StatusBar,
    Text,
    View,
    Image,
    TouchableOpacity,
    ImageBackground, Dimensions,
    AsyncStorage
} from 'react-native';


import Icon from "react-native-vector-icons/Ionicons"
import EvilIcons from "react-native-vector-icons/EvilIcons"

export default class Mine extends Component {
    static navigationOptions = ({navigation, screenProps}) => ({

        tabBarOnPress(e) {
            // e.jumpToIndex(3);
            e.navigation.navigate('Mine')
            navigation.state.params.fetchData()
        }

    });

    componentDidMount() {
        this._navListener = this.props.navigation.addListener('didFocus', () => {
            StatusBar.setBarStyle('light-content');
            // (Platform.OS === 'android') && StatusBar.setTranslucent(true);
            (Platform.OS === 'android') && StatusBar.setBackgroundColor('#bc8d3f');
        });

        this.props.navigation.setParams({
            fetchData: () => this.refirsh()
        });

        //判断是否登录
        this.refirsh()
    }

    componentWillUnmount() {
        this._navListener.remove();
    }


    constructor(props) {
        super(props);
        this.state = {
            menu: [{title: '我的优惠券', url: require('../images/icon/youhui.png')}],
            userInfo: ''
        }
    }

    /**
     * 获取信息
     **/
    refirsh() {
       AsyncStorage.getItem('userInfo', (error, result) => {
           console.log(error);
            if (!error) {
                console.log(result);
                this.setState({
                    userInfo:JSON.parse(result)
                })
            }
        });
    }


    /**
     *跳转订单页面
     */
    goOrder(type){
        if(this.state.userInfo){
            this.props.navigation.navigate('Order',{status:type});
            // alert('已经登录')
            // switch (type){
            //     case 0:
            //         // alert(type);
            //         this.props.navigation.navigate('Order',{status:type});
            //         break;
            //     case 1:
            //         // alert(type);
            //         this.props.navigation.navigate('Order',{status:type});
            //         break;
            //     case 2:
            //         // alert(type);
            //         this.props.navigation.navigate('Order',{status:type});
            //         break;
            //     case 3:
            //         // alert(type);
            //         this.props.navigation.navigate('Order',{status:type});
            //         break;
            //     case 4:
            //         // alert(type);
            //         this.props.navigation.navigate('Order',{status:type});
            //         break;
            // }
        }else{
            this.props.navigation.navigate('LoginModal', {
                refirsh: () => {
                    this.refirsh()
                }
            })
        }
    };


    /**
     * 菜单项点击
     */
    menuTouch(type){
        if(this.state.userInfo){
            // alert(type)
            switch (type){
                case 'Address':
                    this.props.navigation.navigate('Address');
                    break;
            }
        }else{
            this.props.navigation.navigate('LoginModal', {
                refirsh: () => {
                    this.refirsh()
                }
            })
        }
    }

    render() {
        const {navigation} = this.props;
        const {userInfo} = this.state;
        return (
            <View style={styles.container}>
                {/*<StatusBar*/}

                {/*backgroundColor='white'*/}

                {/*translucent={true}*/}

                {/*barStyle="light-content"*/}
                {/*// animated={true}*/}

                {/*/>*/}
                {/*头部*/}
                <View style={styles.header}>
                    <TouchableOpacity style={{marginRight: 10, width: 25, height: 25, alignSelf: 'flex-end'}} onPress={()=>{
                        this.props.navigation.navigate('Setting',{
                            refirsh: () => {
                                this.refirsh()
                            }
                        })
                    }}>
                        <Icon name='ios-settings-outline' size={25} color='#fff'/>
                    </TouchableOpacity>


                    {
                        userInfo ?
                            <View style={styles.userInfo}>
                                <Image source={{uri:userInfo.head_img}} style={styles.userPhoto}/>
                                <Text style={styles.userName_text}>{userInfo.nickname}</Text>
                                <EvilIcons name='chevron-right' size={35} color='#fff'/>
                            </View> :
                            <TouchableOpacity style={styles.userInfo} onPress={() => {
                                this.props.navigation.navigate('LoginModal', {
                                    refirsh: () => {
                                        this.refirsh()
                                    }
                                })
                            }}>
                                <View style={[styles.userPhoto,{backgroundColor:'#ddd'}]}/>
                                <Text style={styles.userName_text}>请登录</Text>
                                <EvilIcons name='chevron-right' size={35} color='#fff'/>
                            </TouchableOpacity>
                    }

                </View>

                {/*订单*/}
                <View style={styles.order}>
                    <TouchableOpacity style={styles.myOrder} onPress={()=>{this.goOrder(0)}}>
                        <Image source={require('../images/icon/dingdan.png')}
                               style={{width: 26.2 / 2, height: 28 / 2}}/>
                        <Text style={{marginLeft: 5, flex: 1, fontSize: 14,}}>我的订单</Text>
                        <EvilIcons name='chevron-right' size={35} color='#000'/>
                    </TouchableOpacity>
                    <View style={styles.orderList}>
                        <TouchableOpacity style={styles.orderListItem} onPress={()=>{this.goOrder(1)}}>
                            <Image source={require('../images/icon/daifukuan.png')}
                                   style={{width: 37 / 2, height: 44 / 2}}/>
                            <Text style={styles.orderListItem_text}>待付款</Text>
                        </TouchableOpacity>
                        <View style={styles.orderListItemLine}/>
                        <TouchableOpacity style={styles.orderListItem} onPress={()=>{this.goOrder(2)}}>
                            <Image source={require('../images/icon/daifahuo.png')}
                                   style={{width: 49 / 2, height: 44 / 2}}/>
                            <Text style={styles.orderListItem_text}>待发货</Text>
                        </TouchableOpacity>
                        <View style={styles.orderListItemLine}/>
                        <TouchableOpacity style={styles.orderListItem} onPress={()=>{this.goOrder(3)}}>
                            <Image source={require('../images/icon/daishouhuo.png')}
                                   style={{width: 55 / 2, height: 44 / 2}}/>
                            <Text style={styles.orderListItem_text}>待收货</Text>
                        </TouchableOpacity>
                        <View style={styles.orderListItemLine}/>
                        <TouchableOpacity style={styles.orderListItem} onPress={()=>{this.goOrder(4)}}>
                            <Image source={require('../images/icon/daipingjia.png')}
                                   style={{width: 46 / 2, height: 44 / 2}}/>
                            <Text style={styles.orderListItem_text}>待评价</Text>
                        </TouchableOpacity>
                    </View>
                </View>


                {/*菜单*/}
                <View style={styles.menu}>
                    <TouchableOpacity style={styles.menuItem} onPress={()=>{this.menuTouch('coupon')}}>
                        <Image source={require('../images/icon/youhui.png')} style={{width: 62 / 2, height: 44 / 2}}/>
                        <Text style={styles.menuItem_text}>我的优惠券</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={()=>{this.menuTouch('Address')}}
                    >
                        <Image source={require('../images/icon/dizhi.png')} style={{width: 35 / 2, height: 44 / 2}}/>
                        <Text style={styles.menuItem_text}>地址管理</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuItem} onPress={()=>{this.menuTouch('feedback')}}>
                        <Image source={require('../images/icon/xiaoxi.png')} style={{width: 47 / 2, height: 44 / 2}}/>
                        <Text style={styles.menuItem_text}>用户反馈</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}
const {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
        backgroundColor: '#F8f8f8',
    },

    header: {
        width: width,
        height: width / 2.5,
        paddingTop: Platform.OS === "ios" ? 40 : 20,
        paddingHorizontal: 15,
        backgroundColor: '#bc8d3f'
    },
    userInfo: {
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    userName_text: {
        flex: 1,
        fontSize: 14,
        lineHeight: 33 / 2,
        color: '#fff'

    },
    userPhoto: {
        marginRight: 10,
        width: 50,
        height: 50,
        borderRadius: 25,
    },

    order: {
        backgroundColor: '#fff'
    },
    //订单
    myOrder: {
        paddingHorizontal: 15,
        height: 40,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: '#eee'
    },
    orderList: {
        paddingVertical: 10,
        flexDirection: 'row',
        alignItems: 'center'
    },
    orderListItem: {
        flex: 1,
        alignItems: 'center'
    },
    orderListItem_text: {marginTop: 3, fontSize: 14, lineHeight: 20, color: '#666'},
    orderListItemLine: {
        height: 30,
        width: 1,
        backgroundColor: '#eee'
    },

    //菜单
    menu: {
        marginTop: 10,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between'
    },
    menuItem: {
        marginBottom: 1,
        width: (width - 1) / 2,
        height: (width - 1) / 2 / 1.785,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff'
    },
    menuItem_text: {
        marginTop: 5,
        fontSize: 28 / 2,
        lineHeight: 20,
        color: '#666'
    }
});

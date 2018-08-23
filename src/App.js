/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Image
} from 'react-native';

import {
    StackNavigator,
    createStackNavigator,
    createBottomTabNavigator
} from 'react-navigation';
import Icon from "react-native-vector-icons/Ionicons"


//引入界面
import HomeScreen from './pages/Home'
import CitySelectionScreen from './pages/CitySelection'
import CitySelectionDetails from './pages/CitySelectionDetails'
import CouponScreen from './pages/Coupon'
import MineScreen from './pages/Mine'
import LoginScreen from './pages/Login'
import RegisterScreen from './pages/Register'
import ForgetPwdScreen from './pages/ForgetPwd'
import LocalNewsDetails from './pages/LocalNewsDetails'
import LocalNews from './pages/LocalNews'
import GreenGarden from './pages/GreenGarden'
import GreenGardenDetails from './pages/GreenGardenDetails'
import ViolationQuery from './pages/ViolationQuery'
import ViolationQueryDetails from './pages/ViolationQueryDetails'
import CommonPhone from './pages/CommonPhone'
import EducationTraining from './pages/EducationTraining'
import CourseList from './pages/CourseList'
import CourseDetails from './pages/CourseDetails'
import Mall from './pages/Mall'
import MallGoodsDetiles from './pages/MallGoodsDetiles'
import BBS from './pages/BBS'
import BBSClassify from './pages/BBSClassify'
import BBSRelease from './pages/BBSRelease'
import BBSDetails from './pages/BBSDetails'

import Comment from './pages/Comment'
import Setting from './pages/Setting'
//办事指南
import WorkGuide from './pages/WorkGuide'
import WorkGuideList from './pages/WorkGuideList'
import WorkGuideDetails from './pages/WorkGuideDetails'
//收货地址
import Address from './pages/Address'
import AddressOfAdd from './pages/AddressOfAdd'
import AddressUpdate from './pages/AddressUpdate'
import AddressManagement from './pages/AddressManagement'

//订单
import OrderPay from './pages/OrderPay'
import Order from './pages/Order'
import OrderComment from './pages/OrderComment'
import OrderTrack from './pages/OrderTrack'

const MainTab = createBottomTabNavigator({
    Home: HomeScreen,
    CitySelection: CitySelectionScreen,
    Coupon: CouponScreen,
    Mine: MineScreen,
}, {

    lazy:false,
    navigationOptions: ({navigation}) => ({
        tabBarLabel: ({focused, tintColor}) => {
            const {routeName} = navigation.state;
            let tabName;
            if (routeName === 'Home') {
                tabName = '首页'
            } else if (routeName === 'CitySelection') {
                tabName = '城市精选'
            } else if (routeName === 'Coupon') {
                tabName = '优惠券'
            } else if (routeName === 'Mine') {
                tabName = '我的'
            }
            return <Text style={{fontSize: 12, textAlign: 'center', color: tintColor}}>{tabName}</Text>
        },
        tabBarIcon: ({focused, tintColor}) => {
            const {routeName} = navigation.state;
            // let iconName;
            // if (routeName === 'Home') {
            //     iconName = `ios-home${focused ? '' : '-outline'}`
            // } else if (routeName === 'CitySelection') {
            //     iconName = `ios-add${focused ? '' : '-outline'}`
            // } else if (routeName === 'Coupon') {
            //     iconName = `ios-add${focused ? '' : '-outline'}`
            // } else if (routeName === 'Mine') {
            //     iconName = `ios-add${focused ? '' : '-outline'}`
            // }
            // return <Icon name={iconName} size={25} color={tintColor}/>;


            let iconUrl;
            if (routeName === 'Home') {
                iconUrl=require('./images/icon/home_a.png')
            } else if (routeName === 'CitySelection') {
                iconUrl=require('./images/icon/city_a.png')
            } else if (routeName === 'Coupon') {
                iconUrl=require('./images/icon/quan_a.png')
            } else if (routeName === 'Mine') {
                iconUrl=require('./images/icon/me_a.png')
            }
            return <Image source={iconUrl} style={[{width:35,height:35},{tintColor: tintColor}]} />

        },
        tabBarOptions: {
            activeTintColor: 'tomato',
            inactiveTintColor: 'gray',
            style: {backgroundColor: '#fff'}
        },
    }),
});



//主路由
const MainStack = StackNavigator({
    MainTab: {
        screen: MainTab,
        navigationOptions: {
            header: null
            // title:'首页'
        }
    },
    CitySelectionDetails:{
        screen:CitySelectionDetails,
        navigationOptions: {
            header: null
            // title:'首页'
        }
    },

    LocalNews: {
        screen: LocalNews,
        navigationOptions:{
            headerTitle:'本地资讯',
        }
    },
    LocalNewsDetails: {
        screen: LocalNewsDetails,
        navigationOptions:{
            headerTitle:'本地资讯',
        }
    },
    GreenGarden: {
        screen: GreenGarden,
        navigationOptions:{
            headerTitle:'绿色庄园',
        }
    },
    GreenGardenDetails: {
        screen: GreenGardenDetails,
        navigationOptions:{
        }
    },
    ViolationQuery: {
        screen: ViolationQuery,
        navigationOptions:{
            headerTitle:'违章查询',
        }
    },
    ViolationQueryDetails: {
        screen: ViolationQueryDetails,
        navigationOptions:{
            headerTitle:'查询结果',
        }
    },
    CommonPhone: {
        screen: CommonPhone,
        navigationOptions:{
            headerTitle:'常用电话',
        }
    },
    EducationTraining: {
        screen: EducationTraining,
        navigationOptions:{
            headerTitle:'课程分类',
        }
    },
    CourseList: {
        screen: CourseList,
    },
    CourseDetails: {
        screen: CourseDetails,
    },
    Mall: {
        screen: Mall,
    },
    MallGoodsDetiles: {
        screen: MallGoodsDetiles,
    },
    BBS: {
        screen: BBS,
    },
    BBSClassify: {
        screen: BBSClassify,
    },
    BBSDetails: {
        screen: BBSDetails,
    },
    WorkGuide: {
        screen: WorkGuide,
    },WorkGuideList: {
        screen: WorkGuideList,
    },
    WorkGuideDetails: {
        screen: WorkGuideDetails,
    },
    Address: {
        screen: Address,
        navigationOptions:{
            headerTitle:'收货地址',
        }
    },
    AddressOfAdd: {
        screen: AddressOfAdd,
        navigationOptions:{
            headerTitle:'添加新地址',
        }
    },
    AddressUpdate: {
        screen: AddressUpdate,
        navigationOptions:{
            headerTitle:'更新地址',
        }
    },
    AddressManagement: {
        screen: AddressManagement,
        navigationOptions:{
            headerTitle:'管理地址',
        }
    },
    OrderPay: {
        screen: OrderPay,
    },
    Order: {
        screen:Order,
        navigationOptions:{
            headerTitle:'订单',
        }
    },
    OrderComment: {
        screen:OrderComment,
        navigationOptions:{
            headerTitle:'发表评论',
        }
    },
    OrderTrack: {
        screen:OrderTrack,
        navigationOptions:{
            headerTitle:'订单追踪',
        }
    },
    Comment: {
        screen:Comment,
        navigationOptions:{
            headerTitle:'评论',
        }
    },
    Setting: {
        screen:Setting,
        navigationOptions:{
            headerTitle:'设置',
        }
    }
}, {
    mode: 'card',
    headerMode:'screen',
    navigationOptions:({navigation, screenProps})=>({

        headerStyle: {
            paddingHorizontal:15,
            backgroundColor: '#FFF',
            elevation: 0,
            borderBottomWidth: .5,
            borderColor:'#eee',
            height:44,
        },
        headerTitle:null,
        headerBackTitle: null,
        headerTintColor: 'black',
        headerTitleStyle: {
            fontWeight: 'normal',
            alignSelf:'center',
            flex: 1,
            textAlign:'center'
        },
        headerBackImage:()=>{
            return <Icon name="ios-arrow-back-outline" size={35} color="black" />
        },
        headerRight: <View/>,
    }),
});


export default Stack = createStackNavigator(
    {
        Main: {
            screen: MainStack,
            navigationOptions: {
                header: null
                // title:'首页'
            }
        },
        BBSRelease:{
            screen:BBSRelease,
            navigationOptions: {
                // header: null
            }
        },
        LoginModal: {
            screen: LoginScreen,
            navigationOptions:{
                headerTitle:'登录',
                // headerStyle:{
                //   paddingHorizontal:15,
                //     // elevation: 0
                // },
                headerBackImage:()=>{
                    return <Icon name='ios-close' size={35} color='black'/>;
                }
            }
        },
        Register: {
            screen: RegisterScreen,
            navigationOptions:{
                headerTitle:'手机快速注册',
            }
        },
        ForgetPwd: {
            screen: ForgetPwdScreen,
            navigationOptions:{
                headerTitle:'找回密码',
            }
        }

    },
    {
        mode: 'modal',
        // headerMode: 'none',
        navigationOptions:({navigation, screenProps})=>({

            headerStyle: {
                paddingHorizontal:15,
                backgroundColor: '#FFF',
                elevation: 0,
                borderBottomWidth: .5,
                borderColor:'#eee',
                height:44,
            },
            headerTitle:null,
            headerBackTitle: null,
            headerTintColor: 'black',
            headerTitleStyle: {
                fontWeight: 'normal',
                alignSelf:'center',
                flex: 1,
                textAlign:'center'
            },
            headerBackImage:()=>{
                return <Icon name="ios-arrow-back-outline" size={35} color="black" />
            },
            headerRight: <View/>,
        }),
    }
)




import React, {Component} from 'react';
import {
    Platform,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    Image,
    StatusBar,
    ScrollView,
    Linking,
    WebView
} from 'react-native';

import Geolocation from 'Geolocation';  //要引用定位连接，否则会提示找不到对象，很多资料都没说到这一点。

import Icon from "react-native-vector-icons/Ionicons"
import EvilIcons from "react-native-vector-icons/EvilIcons"
import ImageSlider from '../component/ImageSlider'
import WebCont from '../component/WebCont';

import ColumnTitle from '../component/ColumnTitle'
import {fetchRequest} from "../utils/FetchUtil";

import {LoadingView} from '../component/Loading';
import {ErrorView} from '../component/ErrorView';
import Toast from "../component/Toast";


export default class CourseDetails extends Component {
    static navigationOptions = ({navigation}) => {
        //课程详情
        return {
            header: null
        };
    };


    constructor(props) {
        super(props);
        this.state = {
            headerShow: true,
            LocalPosition: '',
            // url: 'androidamap://route?sid=BGVIS1&slat=39.98871&slon=116.43234&sname=对外经贸大学&did=BGVIS2&dlat=40.055878&dlon=116.307854&dname=北京&dev=0&m=0&t=2',
            url: 'baidumap://map/direction?origin=中关村&destination=五道口&mode=driving&region=北京',

            isLoading: true,
            //网络请求状态
            error: false,
            errorInfo: "",
            data: [], //列表数据
            isRefreshing: false,//下拉控制,
            height_webview: 500,
        };
    }


    componentDidMount() {
        let id = this.props.navigation.state.params.id;
        this.fetchData(id);
    };

    /**
     * 获取数据
     */
    fetchData(_id) {
        let params = {
            course_id: _id
        };
        fetchRequest('training/course/detail', 'POST', params).then((res) => {
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
     *渲染主界面
     */
    renderData() {
        const {data} = this.state;
        return (
            <View style={styles.container}>
                <StatusBar

                    backgroundColor='#ddd'

                    // translucent={true}

                    barStyle={"dark-content"}

                    // animated={true}

                />
                <View ref={(e) => this._refHeader = e} style={[styles.header1]}>
                    <EvilIcons name='chevron-left' size={40} color='#222' onPress={() => {
                        this.props.navigation.goBack()
                    }}/>
                </View>


                {/*主内容*/}
                <ScrollView
                    onScroll={this._onScroll.bind(this)}
                    style={styles.wrap}
                >

                    {/*头部轮播信息*/}
                    <ImageSlider height={width / 1.63} width={width} data={data.carousel}/>
                    <View style={styles.courseInfo}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Text style={styles.courseTitle_text} numberOfLines={1}>{data.name}</Text>
                            <Text style={styles.originalPrice}>¥{data.price}</Text>
                            <Text style={styles.presentPrice}>¥{data.discount_price}</Text>
                        </View>

                        <Text style={styles.courseInfo_Text}>开班日期：{data.date}</Text>
                        <Text style={styles.courseInfo_Text} numberOfLines={1}>上课地址：{data.address}</Text>
                    </View>


                    <View style={styles.content}>
                        {/*商铺*/}
                        <View style={styles.shop}>
                            <View style={styles.shopIcon}><Image source={require('../images/csjx_logo1.png')}
                                                                 style={{width: 44, height: 44}}/></View>

                            <Text style={styles.shopName}>{data.m_name}</Text>
                            <Text
                                style={styles.shopDesc}>{data.desc}</Text>
                            {/*<Image source={require('../images/icon/phone1.png')}*/}
                                   {/*style={{width: 30, height: 30, marginVertical: 15, alignSelf: 'center'}}/>*/}
                            {/*<Text*/}
                                {/*style={styles.shopAddress}>上海市南京路</Text>*/}
                        </View>
                    </View>

                    {/*详情*/}
                    <View style={styles.details}>
                        <ColumnTitle title='商家详情' arrow={false}/>
                        <WebCont content={data.content}/>
                    </View>
                </ScrollView>

                <View style={styles.footer}>
                    <TouchableOpacity style={styles.itemBtn} onPress={() => {
                        this.GetGeolocation()
                    }}>
                        <Icon name='ios-paper-plane-outline' size={23} color='#333'/>
                        <Text style={{fontSize: 12, lineHeight: 33 / 2}}>导航</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.submitBtn} onPress={()=>{
                        return Linking.openURL(`tel:${data.phone}`)
                    }}>
                        <Text style={{color: '#fff'}}>报名咨询</Text>
                    </TouchableOpacity>
                </View>
                <Toast ref="toast"/>
            </View>
        );
    }


    /**
     *@desc 滑动更改header显示
     *@param event
     *@return {null}
     */
    _onScroll = (event) => {
        let Y = event.nativeEvent.contentOffset.y;
        console.log(Y);
        if (Y < 100) {
            st = Y * 0.01;
            this.setState({
                headerShow: true
            })
        } else {
            st = 1;
            this.setState({
                headerShow: false
            })
        }
        this._refHeader.setNativeProps({
            opacity: st
        })
    };

    /**
     * 获取定位
     * @constructor
     */
    GetGeolocation = () => {
        const {data} = this.state;
        let location = data.location.split(',')

        Geolocation.getCurrentPosition(val => {
            // let ValInfo = "速度：" + val.coords.speed +
            //     "\n经度：" + val.coords.longitude +
            //     "\n纬度：" + val.coords.latitude +
            //     "\n准确度：" + val.coords.accuracy +
            //     "\n行进方向：" + val.coords.heading +
            //     "\n海拔：" + val.coords.altitude +
            //     "\n海拔准确度：" + val.coords.altitudeAccuracy +
            //     "\n时间戳：" + val.timestamp;
            //

            let start = {
                lon: val.coords.longitude,
                lat: val.coords.latitude,
                name: '我的位置'
            };

            let end = {
                lon: location[0],
                lat: location[1],
                name: data.m_name
            };

            console.log(start)
            console.log(end)
            this.setState({
                start,
                end
            });

            let url = `androidamap://route?sid=BGVIS1&slat=${start.lat}1&slon=${start.lon}4&sname=${start.name}&did=BGVIS2&dlat=${end.lat}&dlon=${end.lon}&dname=${end.name}&dev=0&m=0&t=2`;
            Linking.canOpenURL(url).then(supported => {
                if (supported) {
                    Linking.openURL(url);
                } else {
                    // console.log('无法打开该URI: ' + this.props.url);
                    this.refs.toast.show('无法打开高德地图', 3000);
                }
            })
        }, val => {
            let ValInfo = '获取坐标失败：' + val;
            this.setState({LocalPosition: ValInfo});
        });
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
    container: {
        flex: 1,
        position: 'relative',
    },
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 99,
        paddingTop: 20,
        width: width,
        height: 60,
        justifyContent: 'center',
        backgroundColor: "transparent"
    },
    header1: {
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 99,
        paddingTop: (Platform.OS === 'ios') ? 20 : 0,
        width: width,
        height: 60,
        opacity: 0,

        justifyContent: 'center',
        backgroundColor: "#fff"
    },
    wrap: {
        flex: 1,
        backgroundColor: '#ddd'
    },


    //课程信息
    courseInfo: {
        paddingHorizontal: 15,
        paddingVertical: 10,
        backgroundColor: "#fff"
    },
    courseTitle_text: {
        fontFamily: 'PingFangSC-Regular',
        flex: 1,
        fontSize: 30 / 2,
        lineHeight: 42 / 2,
    },


    originalPrice: {
        marginLeft: 10,
        fontSize: 18 / 2,
        lineHeight: 25 / 2,
        color: '#999'
    },
    presentPrice: {
        marginLeft: 10,
        fontSize: 15,
        lineHeight: 21,
        color: '#FF5C60'
    },
    courseInfo_Text: {
        marginTop: 5,
        fontFamily: 'PingFangSC-Regular',
        fontSize: 12,
        lineHeight: 33 / 2,
        color: '#666'
    },

    //店铺
    content: {
        marginTop: 20,
        backgroundColor: '#fff'
    },
    shop: {
        width: width - 30,
        paddingVertical: 20,
        alignSelf: 'center',
        borderBottomWidth: 1,
        borderStyle: 'solid',
        borderColor: '#eee',
    },
    shopIcon: {
        alignSelf: 'center',
        width: 46,
        height: 46,
        // borderRadius:50,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#fff'
    },
    shopName: {
        marginTop: 10,
        textAlign: 'center'
    },
    shopDesc: {
        width: width / 1.470,
        alignSelf: 'center',
        marginTop: 10,
        fontSize: 12,
        lineHeight: 16.5,
        textAlign: 'center',
        color: '#666'
    },
    shopAddress: {
        width: width / 1.470,
        alignSelf: 'center',
        fontSize: 14,
        lineHeight: 20,
        textAlign: 'center'
    },

    //详情图
    details: {
        // height: 800,
        // backgroundColor: 'pink'
    },

    footer: {
        height: 44,
        flexDirection: 'row'
    },

    itemBtn: {
        height: 44,
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#fff'
    },
    submitBtn: {
        height: 44,
        flex: 4,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: '#FF5C60'
    }
});
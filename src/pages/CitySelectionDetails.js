import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    FlatList,
    Image,
    StatusBar,
    TouchableOpacity,
    ScrollView, Dimensions,
    Modal, WebView, Linking
} from 'react-native';

import Geolocation from 'Geolocation';  //要引用定位连接，否则会提示找不到对象，很多资料都没说到这一点。


import EvilIcons from "react-native-vector-icons/EvilIcons"
import Icon from "react-native-vector-icons/Ionicons"
import SafeAreaViewPlus from '../component/SafeAreaViewPlus'
import ImageSlider from '../component/ImageSlider'
import ColumnTitle from '../component/ColumnTitle';
import ReserveModal from '../component/ReserveModal'
import WebCont from '../component/WebCont';
import {fetchRequest} from "../utils/FetchUtil";

import {LoadingView} from '../component/Loading';
import {ErrorView} from '../component/ErrorView';
import Toast from "../component/Toast";


export default class CitySelectionDetails extends Component {
    navigationOptions: {
        // header: null
    };


    constructor(props) {
        super(props);
        this.state = {
            headerShow: false,
            modalVisible: false,
            LocalPosition: '',
            url: 'androidamap://route?sid=BGVIS1&slat=39.98871&slon=116.43234&sname=对外经贸大学&did=BGVIS2&dlat=40.055878&dlon=116.307854&dname=北京&dev=0&m=0&t=2',
            // url: 'baidumap://map/direction?origin=中关村&destination=五道口&mode=driving&region=北京',

            isLoading: true,
            //网络请求状态
            error: false,
            errorInfo: "",
            data: [], //列表数据
            isRefreshing: false,//下拉控制,
            height_webview: 500,
            praise: 0,
            isLikes: false,
            start: ""
        };
    }

    state = {};
    _likes = () => {
        alert(1)

    };


    componentDidMount() {
        let id = this.props.navigation.state.params.id;
        this.id = id
        this.fetchData(id);
    };

    /**
     * 获取数据
     */
    fetchData(_id) {
        let params = {
            boutique_id: _id
        };
        fetchRequest('city_boutique/detail', 'POST', params).then((res) => {
            console.log(res);
            console.log(res.code)
            if (res.code == 1) {
                this.setState({
                    data: res.results,
                    praise: res.results.praise,
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
     *生成主界面
     */
    renderData() {
        const {headerShow, data, isLikes} = this.state;
        return (
            <SafeAreaViewPlus style={styles.container} topColor={'#fff'} bottomColor={'red'} bottomInset={true}>
                <StatusBar

                    backgroundColor='transparent'

                    translucent={true}

                    barStyle={headerShow ? "dark-content" : "light-content"}

                    animated={true}

                />
                <View style={[styles.header, headerShow ? {
                    backgroundColor: "#fff",
                    borderBottomWidth: 1,
                    borderStyle: 'solid',
                    borderColor: '#ddd',
                } : {}]}>
                    <EvilIcons name='chevron-left' size={40} color={headerShow ? "#222" : "#fff"} onPress={() => {
                        this.props.navigation.goBack()
                    }}/>
                </View>
                <ScrollView
                    style={styles.wrap}
                    onScroll={(event) => {
                        let scrollY = event.nativeEvent.contentOffset.y;
                        console.log(event.nativeEvent.contentOffset.y)

                        if (scrollY > 150) {
                            this.setState({
                                headerShow: true
                            })
                        } else {
                            this.setState({
                                headerShow: false
                            })
                        }
                    }}
                >
                    <View style={{position: "relative"}}>
                        <View style={styles.banner}>
                            {/*<Image source={require('../images/csjx_img1.png')} style={{height: 230}}/>*/}
                            <ImageSlider height={width / 1.63} width={width} data={data.carousel}/>
                        </View>
                        {/* 主内容 */}
                        <View style={styles.content}>
                            <View style={styles.shop}>
                                <View style={styles.shopIcon}>
                                    <Image source={{uri: data.shop_img}}
                                           style={{width: 44, height: 44, borderRadius: 22,}}/>
                                </View>
                                <Text style={styles.shopName}>{data.m_name}</Text>
                                <Text
                                    style={styles.shopDesc}>{data.title}</Text>
                                <TouchableOpacity onPress={() => {
                                    // alert(111)
                                    return Linking.openURL(`tel:${data.phone}`)
                                }}>
                                    <Image source={require('../images/icon/phone1.png')}
                                           style={{width: 30, height: 30, marginVertical: 15, alignSelf: 'center'}}/>
                                </TouchableOpacity>
                                <Text
                                    style={styles.shopAddress}>{data.address}</Text>
                            </View>

                            {/*详情*/}
                            <View style={styles.details}>
                                <ColumnTitle title='商家详情' arrow={false}/>
                                <WebCont content={data.content}/>
                            </View>
                        </View>
                    </View>
                </ScrollView>

                {/* 底部选项 */}
                <View style={styles.bottomOption}>
                    <View style={{flex: 1, flexDirection: 'row',}}>
                        <TouchableOpacity
                            style={[styles.otherBtn, {
                                borderRightWidth: 1,
                                borderStyle: 'solid',
                                borderColor: '#eee',
                            }]}
                            onPress={() => {
                                if (!isLikes) {
                                    this.setState({
                                        praise: ++this.state.praise,
                                        isLikes: true
                                    })

                                    let params = {
                                        boutique_id: this.id
                                    };
                                    fetchRequest('city_boutique/praise', 'POST', params).then((res) => {
                                        console.log(res);
                                        console.log(res.code)
                                        if (res.code == 1) {
                                            this.refs.toast.show(res.message, 3000);
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

                            }}
                        >
                            <Icon name={isLikes ? 'ios-heart' : 'ios-heart-outline'} size={25}
                                  color={isLikes ? '#ff5c60' : "#999"}/>
                            <Text style={{fontSize: 12, color: "#999",}}>赞{this.state.praise}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.otherBtn} onPress={() => {
                            this.Location();
                        }}>
                            <Icon name='ios-paper-plane-outline' size={25} color="#999"/>
                            <Text style={{fontSize: 12, color: "#999"}}>导航</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={styles.reserveBtn} activeOpacity={0.8} onPress={() => {
                        this.setState({modalVisible: true})
                    }}>
                        <Text style={{fontSize: 14, color: '#fff'}}>立即预约</Text>
                    </TouchableOpacity>
                </View>

                {/* 预约弹窗 */}
                <Modal
                    animationType={"slide"}
                    transparent={true}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {
                    }}
                >
                    <View style={{flex: 1}}/>
                    <ReserveModal close={() => this.setState({modalVisible: false})} id={this.id}/>
                </Modal>
                <Toast ref="toast"/>

            </SafeAreaViewPlus>
        );
    }

    /**
     * 定位导航
     * @constructor
     */
    Location() {
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
        backgroundColor: 'transparent',
        position: 'relative'
    },
    wrap: {
        flex: 1,
        backgroundColor: '#fff',
        position: 'relative'
    },

    header: {
        width: width,
        // height: (Platform.OS === 'ios') ? 64 : 44,
        // paddingTop: (Platform.OS === 'ios') ? 20 : 0,
        height: 64,
        paddingTop: 20,
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 1000,
        justifyContent: "center",
        backgroundColor: 'transparent',
    },
    banner: {
        height: 230,
        backgroundColor: '#ddd',
        overflow: 'visible'
    },
    list: {
        paddingHorizontal: 15,

    },

    //底部选项
    bottomOption: {
        height: 44,
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderStyle: 'solid',
        borderColor: '#ddd',
    },
    reserveBtn: {
        width: width / 1.659,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FF5C60'
    },
    otherBtn: {
        flex: 1,
        alignItems: 'center'
    },


    //内容
    content: {
        // position: 'absolute',
        // left: 0,
        // top: 208,
        zIndex: 99,
        width: width,
        // height: 500,
        // backgroundColor:'#fff'
    },


    shop: {
        width: width - 30,
        paddingBottom: 20,
        alignSelf: 'center',
        borderBottomWidth: 1,
        borderStyle: 'solid',
        borderColor: '#eee'
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
        // height:800,
        // backgroundColor:'pink'
    },
    //modal
    ModalContainer: {
        height: 467,
        backgroundColor: '#fff'
    }
});

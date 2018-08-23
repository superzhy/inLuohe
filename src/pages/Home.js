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
    SafeAreaView,
    StatusBar,
    TouchableOpacity,
    ImageBackground,
    BackHandler,
    ToastAndroid
} from 'react-native';


import Icon from "react-native-vector-icons/Ionicons"
import EvilIcons from "react-native-vector-icons/EvilIcons"
import Carousel from 'react-native-snap-carousel';
import Swiper from 'react-native-swiper'

import ColumnTitle from '../component/ColumnTitle'
import ColumnCont from '../component/ColumnCont'
import {ErrorView} from '../component/ErrorView';
import {LoadingView} from '../component/Loading';
import {fetchRequest} from "../utils/FetchUtil";



export default class Home extends Component {
    state = {
        navBar: [{icon: require('../images/icon/home/lszy.png'), title: '绿色庄园'},
            {icon: require('../images/icon/home/fjsj.png'), title: '办事指南'},
            {icon: require('../images/icon/home/bbs.png'), title: '漯河BBS'},
            {icon: require('../images/icon/home/bdzx.png'), title: '本地资讯'},
            {icon: require('../images/icon/home/jypx.png'), title: '教育培训'},
            {icon: require('../images/icon/home/cydh.png'), title: '常用电话'},
            {icon: require('../images/icon/home/bdsj.png'), title: '本地商家'},
            {icon: require('../images/icon/home/wzcx.png'), title: '违章查询'}],
        list: [1, 2, 3, 4],
        isLoading: true,
        dataArray:'',
        error: false,
        errorInfo: "",
    };



    componentDidMount() {
        this.fetchData();
        this._navListener = this.props.navigation.addListener('didFocus', () => {
            StatusBar.setBarStyle('dark-content');
            (Platform.OS === 'android') && StatusBar.setTranslucent(false);
            (Platform.OS === 'android') && StatusBar.setBackgroundColor('#fff');
        });
    }

    componentWillUnmount() {
        this._navListener.remove();
    }


    /**
     * 获取数据
     */
    fetchData(){

        let that = this;
        fetchRequest('index/listing','GET').then((res)=>{
            console.log(res);
            console.log(res.code)
            if(res.code==1){
                this.setState({
                    dataArray:res.results,
                    isLoading: false,
                })
            }
        }).catch((err)=>{
            console.log(err);
            //请求失败
            that.setState({
                error: true,
                errorInfo:''
            });
        })
    }

    /**
     * 渲染主内容
     * @returns {*}
     */
    renderMain(){
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


    /**
     * 生成主界面
     */
    renderData(){
        const {navBar, list,dataArray} = this.state;
        return (
            <ScrollView style={{flex: 1,backgroundColor:'#f8f8f8'}}>
                <View style={styles.banner}>
                    <Carousel
                        ref={()=>{}}
                        data={dataArray.banner}
                        renderItem={this._renderItem}
                        sliderWidth={width}
                        layout={'default'}
                        itemWidth={width-30}
                        loop={true}
                        inactiveSlideScale={1}
                        inactiveSlideOpacity={0.8}
                        pageInfo={true}
                        autoplay={true}
                    />
                </View>

                {/*功能导航*/}
                <View style={styles.navBar}>
                    {
                        navBar.map((item, index) => {
                            return this._navBar(item, index)
                        })
                    }
                </View>

                {/*活动banner*/}
                <View style={styles.activity}>
                    <Image source={require('../images/advertising.png')} style={styles.activityBanner}/>
                </View>

                {/*新闻*/}
                <View style={styles.news}>
                    <Text style={{color:'#FF5C60',marginRight:10}}>今日关注:</Text>
                    {/*<Carousel*/}
                        {/*style={{backgroundColor:'red'}}*/}
                        {/*ref={()=>{}}*/}
                        {/*data={dataArray.news}*/}
                        {/*// sliderWidth={width-60}*/}
                        {/*// itemWidth={width-60}*/}
                        {/*sliderHeight={40}*/}
                        {/*itemHeight={40}*/}
                        {/*renderItem={this._renderNewsItem.bind(this)}*/}
                        {/*vertical={true}*/}
                        {/*layout={'default'}*/}
                        {/*inactiveSlideScale={1}*/}
                        {/*inactiveSlideOpacity={1}*/}
                        {/*autoplay={true}*/}
                        {/*autoplayDelay={100}*/}
                        {/*autoplayInterval={200}*/}
                        {/*loop={true}*/}
                        {/*lockScrollWhileSnapping={true}*/}
                    {/*/>*/}
                    <Swiper
                        horizontal={false}
                        height={40}
                        loop={true}
                        autoplay={true}
                        showsPagination={false}
                    >
                        {
                            dataArray.news.map((item,index)=>{
                                return (
                                    <TouchableOpacity
                                        key={index}
                                        style={styles.newsItem}
                                        onPress={()=>{
                                            this.props.navigation.navigate('LocalNewsDetails',{id:item.id})
                                        }}
                                    >
                                        <Text numberOfLines={1}>{item.title}</Text>
                                    </TouchableOpacity>
                                )
                            })
                        }
                    </Swiper>
                    <EvilIcons name="chevron-right" size={30} color="#333"/>
                </View>

                {/*栏目*/}
                <View style={styles.column}>
                    <ColumnTitle title={'绿色庄园'}/>
                    <ColumnCont data={dataArray.green_manor} goDetails={(id)=>{this.props.navigation.navigate('GreenGardenDetails',{id:id})}}/>
                </View>

                <View style={styles.column}>
                    <ColumnTitle title={'城市精选'}/>
                    <ColumnCont data={dataArray.boutiques} goDetails={(id)=>{this.props.navigation.navigate('CitySelectionDetails',{id:id})}}/>
                </View>

                <View style={styles.column}>
                    <ColumnTitle title={'漯河BBS'}/>
                    <View style={styles.columnCont}>
                        {/*<View style={styles.columnTop}/>*/}
                        <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                            {
                                dataArray.bbs.map((item, index) => {
                                    return (
                                        <TouchableOpacity key={index}
                                                          style={[styles.columnItem, (index % 2 === 0) ? {marginRight: 10} : {}]}
                                                          onPress={()=>{
                                                              this.props.navigation.navigate('BBSDetails',{id:item.forum_id})
                                                          }}
                                        >
                                            <Image source={{uri:item.img}} style={[styles.columnItem]}/>
                                        </TouchableOpacity>
                                    )
                                })
                            }
                        </View>
                    </View>
                </View>
            </ScrollView>
        )
    }

    /**
     * 生成新闻子项
     * @private
     */
    _renderNewsItem({item,index}){
        return (
            <TouchableOpacity
                style={styles.newsItem}
                onPress={()=>{
                    this.props.navigation.navigate('LocalNewsDetails',{id:item.id})
                }}
            >
                <Text>{item.title}</Text>
            </TouchableOpacity>
        )
    }

    /**
     *@desc  生成Nav导航
     */
    _navBar(_item, _index) {
        let url = _item.icon;
        console.log(url);
        return <TouchableOpacity key={_index} style={[styles.navItem, _index > 3 ? {marginTop: 15,} : {}]}  onPress={()=>this._navBarTo(_index)} activeOpacity={0.8}>
            <Image style={{width: 30, height: 30,}} source={_item.icon}/>
            <Text style={styles.navTit}>{_item.title}</Text>
        </TouchableOpacity>
    };

    /**
     *@desc Nav导航跳转
     */
    _navBarTo(_index){

        switch (_index){
            case 0:
                this.props.navigation.navigate('GreenGarden')
                break;
            case 1:
                this.props.navigation.navigate('WorkGuide')
                break;
            case 2:
                this.props.navigation.navigate('BBS')
                break;
            case 3:
                this.props.navigation.navigate('LocalNews')
                break;
            case 4:
                this.props.navigation.navigate('EducationTraining')
                break;
            case 5:
                this.props.navigation.navigate('CommonPhone')
                break;
            case 6:
                this.props.navigation.navigate('Mall')
                break;
            case 7:
                this.props.navigation.navigate('ViolationQuery')
                break;

        }
    }

    /**
     *@desc 轮播图子项
     */
    _renderItem ({item, index}) {
        return (
            <View style={[{backgroundColor:'#ccc',height:(width-30)/2.029,marginHorizontal:5},Platform.OS==='ios'?{}:{marginHorizontal:5}]}>
                {/*<Text>{item.pic}</Text>*/}
                <ImageBackground source={{uri:item.pic}} style={{flex:1,height:(width-30)/2.029}}>

                </ImageBackground>
            </View>
        );
    }



    render() {
        return (
            <SafeAreaView style={styles.container}>
                <StatusBar
                    backgroundColor='white'
                    translucent={false}
                    barStyle="dark-content"
                    animated={true}
                />
                {/*头部搜索框*/}
                <View style={styles.header}>
                    <View style={styles.inputGroup}>
                        <Icon name='ios-search-outline' size={25} color="#ddd"/>
                        <TextInput style={styles.searchInput} placeholder='输入内容'
                                   underlineColorAndroid="transparent"/>
                    </View>
                    <View style={{marginLeft: 15}}>
                        <Icon name='ios-notifications-outline' size={25} color='black'/>
                    </View>
                </View>
                {
                    //渲染主内容
                    this.renderMain()
                }
            </SafeAreaView>
        );
    }
}
const {height, width} = Dimensions.get('window');
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },

    header: {
        paddingHorizontal: 15,
        height: 44,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    inputGroup: {
        paddingLeft: 10,
        flex: 1,
        height: 30,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#ddd',
        borderRadius: 15,
    },
    searchInput: {
        flex: 1,
        padding: 0,
        paddingHorizontal: 10,
        height: 30,

    },

    banner: {
        flex: 1,
        paddingTop: 15,
        height: 185,
        backgroundColor: '#f7f7f7'
    },

    listViewStyle: {
        // 改变主轴的方向
        flexDirection: 'row',
        // 多行显示
        flexWrap: 'wrap',
        // 侧轴方向
        alignItems: 'center', // 必须设置,否则换行不起作用
    },


    //NavBar样式
    navBar: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingTop: 20,
        paddingBottom: 20,
        backgroundColor: "#fff"
    },
    navItem: {
        width: width / 4,
        alignItems: 'center'
    },
    navTit: {
        marginTop: 10,
        fontSize: 12,
        lineHeight: 16.5,
    },

    //活动
    activity: {
        padding: 15,
        backgroundColor: "#f8f8f8"
    },
    activityBanner: {
        width: width - 30,
        height: (width - 30) / 3.45,
        alignSelf: 'center',
        backgroundColor: '#ddd',
    },
    //新闻
    news: {
        paddingHorizontal: 15,
        height: 40,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff'
    },
    newsItem:{
      height:40,
      flexDirection:'row',
      alignItems:'center'
    },


    //栏目
    column: {
        marginTop: 10,
        paddingBottom:10,
        backgroundColor: '#fff'
    },

    columnList: {
        flex: 1,
        minHeight: 142,
        backgroundColor: '#ddd'
    },
    columnCont: {
        paddingHorizontal: 15,
        paddingBottom: 50
    },
    columnTop: {
        flex: 1,
        height: (width - 30) / 3.45,
        backgroundColor: '#ddd'
    },
    columnItem: {
        marginTop: 5,
        width: (width - 40) / 2,
        height: (width - 40) / 2 / 1.675,
        backgroundColor: '#ddd'
    }
});

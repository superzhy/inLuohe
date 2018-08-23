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
    FlatList
} from 'react-native';


import Icon from "react-native-vector-icons/Ionicons"
import EvilIcons from "react-native-vector-icons/EvilIcons"

import {fetchRequest} from "../utils/FetchUtil";
import {LoadingView} from '../component/Loading';
import {ErrorView} from '../component/ErrorView';


export default class BBSRelease extends Component {
    static navigationOptions = ({navigation, screenProps}) => {
        return ({
            title: '地址',
            headerRight: <TouchableOpacity
                onPress={navigation.getParam('submit')}
            >
                <Text>管理</Text>
            </TouchableOpacity>,
            headerStyle: {
                paddingHorizontal: 15,
                backgroundColor: '#FFF',
                elevation: 0,
                borderBottomWidth: 0.5,
            },
        })
    };

    //state
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            //网络请求状态
            error: false,
            errorInfo: "",
            dataArray: [1,2,3,4], //列表数据
            showFoot: 0, // 控制foot， 0：隐藏footer  1：已加载完成,没有更多数据   2 ：显示加载中
            isRefreshing: false,//下拉控制
        }
    }


    componentDidMount() {
        this.props.navigation.setParams({ submit: this._management.bind(this)});
        this._navListener = this.props.navigation.addListener('didFocus', () => {
            StatusBar.setBarStyle('dark-content');
            (Platform.OS === 'android') && StatusBar.setTranslucent(false);
            (Platform.OS === 'android') && StatusBar.setBackgroundColor('#fff');
        });


        let fnSelect=this.props.navigation.getParam('fnSelect','');
        this.fnSelect = fnSelect;
        this.fetchData();
    };

    componentWillUnmount() {
        this._navListener.remove();
    }

    /**
     * 跳转管理界面
     * @private
     */
    _management(){

        this.props.navigation.navigate('AddressManagement', {
            refirsh: () => {
                this.setState({
                    isLoading: true,
                });
                this.fetchData();
            }
        })
        // this.props.navigation.navigate('AddressManagement')
    }
    /**
     * 获取数据
     */
    fetchData(){
        fetchRequest('user/address/listing','POST',).then((res)=>{
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
            this.setState({
                error: true,
                errorInfo:''
            });
        })
    }



    /**
     * 渲染主界面
     * @returns {*}
     */
    renderData=()=>{
        // 数据
        let data = this.state.dataArray;
        return (
            <SafeAreaView style={styles.container}>
                <StatusBar
                    backgroundColor='white'
                    translucent={false}
                    barStyle="dark-content"
                    // animated={true}
                />
                <FlatList
                    style={styles.flatList}
                    ref={(flatList) => (this.flatList = flatList)}
                    numColumns={1}
                    keyExtractor={(item, index) => index.toString()}
                    data={data}
                    renderItem={this._renderItem}
                    ListEmptyComponent={this._renderNull}
                />


                <TouchableOpacity style={styles.submitBtn} activeOpacity={0.6} onPress={()=>{
                    this.props.navigation.navigate('AddressOfAdd', {
                        refirsh: () => {
                            this.setState({
                                isLoading: true,
                            });
                            this.fetchData();
                        }
                    })
                }}>
                    <Text style={{color:"#fff"}}>添加地址</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    };


    /**
     * 渲染子组件
     * @param item {Object} 每一项数据
     * @returns {*}
     */
    _renderItem = (item) => {
        return (
            <TouchableOpacity style={styles.item} onPress={()=>{
                console.log(item.index);
                console.log(item.item);
                if(this.fnSelect){
                    this.fnSelect(item.item);
                    this.props.navigation.goBack();
                }
                // this.fnSelect&&this.fnSelect();
            }}>
                <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                    <Text style={styles.item_text}>{item.item.name}</Text>
                    <Text style={styles.item_text}>{item.item.phone}</Text>
                </View>

                <View style={{marginTop:15/2}}>
                    <Text style={styles.item_text}>{item.item.is_default=='Y' && <Text style={{color:'#FF5C60'}}>[默认]</Text>}{item.item.province+item.item.city+item.item.area+item.item.street}</Text>
                </View>
            </TouchableOpacity>
        )
    };

    /**
     * 渲染空组件
     * @private
     */
    _renderNull(){
        return (
            <View style={{marginTop:20,alignItems:'center',justifyContent:'center'}}>
                <Text>没有数据</Text>
            </View>
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
const imgWidht = (width-30-10)/3;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    flatList:{
        flex:1,
    },
    item:{
        paddingHorizontal:15,
        paddingVertical:10,
        flex:1,
        borderBottomWidth:1,
        borderColor:'#eee',
        backgroundColor:'#fff'
    },
    item_text:{
        fontSize:24/2,
        lineHeight:33/2,
        fontFamily:"PingFangSC-Regular",
        color:'#2A2A2A',
    },

    submitBtn:{
        marginVertical:10,
        width:width-30,
        height:(width-30)/7.666,
        alignSelf:'center',
        alignItems:'center',
        justifyContent:'center',

        borderRadius:5,
        backgroundColor:"#FF5C60"
    }
});

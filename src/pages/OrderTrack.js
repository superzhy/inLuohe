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

import {fetchRequest} from "../utils/FetchUtil";
import {LoadingView} from '../component/Loading';
import {ErrorView} from '../component/ErrorView';


export default class BBSRelease extends Component {
    static navigationOptions = ({navigation, screenProps}) => {
        return
    };

    //state
    constructor(props) {
        super(props);
        this.id='';
        this.state = {
            isLoading: true,
            //网络请求状态
            error: false,
            errorInfo: "",
            data:'', //列表数据
        }
    }


    componentDidMount() {
        let id = this.props.navigation.state.params.id;
        this.id = id;
        this.fetchData(id);
    };

    /**
     * 获取数据
     */
    fetchData(id) {
        let params={
            order_id:id,
        }
        fetchRequest('order/express','POST',params).then((res)=>{
            console.log(res);
            console.log(res.code)
            if(res.code==1){
                this.setState({
                    data:res.results,
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
    renderData = () => {
        // 数据
        let data = this.state.data;
        return (
            <SafeAreaView style={styles.container}>
                <StatusBar
                    backgroundColor='white'
                    translucent={false}
                    barStyle="dark-content"
                    // animated={true}
                />
                <ScrollView>
                    <View style={styles.expressInfo}>
                        <Text style={styles.expressInfo_text}>订单编号：<Text style={{color:'#000'}}>{data.express_no}</Text></Text>
                        <Text style={styles.expressInfo_text}>配送物流：<Text style={{color:'#000'}}>{data.express_name}</Text></Text>
                    </View>

                    <View style={styles.expressCont}>
                        {
                            data.list.map((item,index)=>{
                                return this.renderItem(item,index)
                            })
                        }
                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    };

    /**
     * 生成每一项
     */
    renderItem(item,index){
        const {data} = this.state;
        return (
            <View key={index} style={styles.expressContItem}>
                <View style={{width:30,alignItems:'center',}}>
                    <View style={[styles.itemIcon,index==0&&{backgroundColor:'#FF5C60',borderWidth:2,borderColor:'#FFC7C9'}]}/>
                    {
                        (index+1)<data.list.length&&<View style={styles.line}/>
                    }
                </View>
                <View style={[{flex:1,marginLeft:10,paddingVertical:5,borderBottomWidth:1,borderColor:'#eee'},(index+1)===data.list.length&&{borderBottomWidth:0}]}>
                    <Text style={[styles.itemCont,index==0&&{color:"#ff5c60"}]}>{item.context}</Text>
                    <Text style={[styles.itemTime,index==0&&{color:"#ff5c60"}]}>{item.time}</Text>
                </View>
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
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8'
    },
    expressInfo: {
        paddingHorizontal:15,
        height:130/2,
        justifyContent:'center',
        borderBottomWidth:1,
        borderColor:'#eee',
        backgroundColor: '#fff',
    },
    expressInfo_text: {
        fontSize: 26 / 2,
        lineHeight: 37 / 2,
        color: "#666"
    },

    expressContItem:{
        paddingHorizontal:15,

        flexDirection:'row',
        backgroundColor:'#fff'
    },

    expressCont:{
        paddingVertical:10,
        backgroundColor:'#fff'
    },


    itemIcon:{
        width:10,
        height:10,
        borderRadius:5,
        backgroundColor:'#ddd',
    },
    line:{
        flex:1,
        width:1,
        backgroundColor:'#ddd'
    },
    itemCont:{
        fontSize: 26 / 2,
        lineHeight: 37 / 2,
    },
    itemTime:{
        marginTop:5,
        fontSize:24/2,
        lineHeight:33/2,
    }
});

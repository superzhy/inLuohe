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
import Toast from "../component/Toast";
import {fetchRequest} from "../utils/FetchUtil";
import {LoadingView} from '../component/Loading';
import {ErrorView} from '../component/ErrorView';


export default class BBSRelease extends Component {
    static navigationOptions = ({navigation, screenProps}) => {

    };

    //state
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            //网络请求状态
            error: false,
            errorInfo: "",
            dataArray: [{default:true}, {}, {},{}], //列表数据
            showFoot: 0, // 控制foot， 0：隐藏footer  1：已加载完成,没有更多数据   2 ：显示加载中
            isRefreshing: false,//下拉控制
        }
    }


    componentDidMount() {
        this.fetchData();
    };


    componentWillUnmount() {
        let refirsh=this.props.navigation.getParam('refirsh','');
        if(refirsh){
            refirsh();
        }
    }

    /**
     * 获取数据
     */
    fetchData(){
        fetchRequest('user/address/listing','POST',).then((res)=>{
            console.log(res);
            if(res.code==1){

                let dataArray = res.results;

                for(let i=0;i<dataArray.length;i++){
                    if(dataArray[i].is_default=='Y'){
                        console.log(i)
                        dataArray[i].default=true
                    }
                }

                console.log(dataArray);

                this.setState({
                    isLoading:false,
                    dataArray
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
                    extraData={this.state}
                    renderItem={this._renderItem}
                    ListEmptyComponent={this._renderNull}
                />


                <TouchableOpacity style={styles.submitBtn} activeOpacity={0.6} onPress={()=>{
                    this.props.navigation.navigate('AddressOfAdd',{
                        refirsh: () => {
                            this.setState({
                                isLoading: true,
                            });
                            this.fetchData();
                        }
                    })
                }}>
                    <Text style={{color: "#fff"}}>添加地址</Text>
                </TouchableOpacity>
                <Toast ref="toast"/>
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
            <View style={styles.item}>
                <View style={styles.itemInfo}>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                        <Text style={styles.item_text}>{item.item.name}</Text>
                        <Text style={styles.item_text}>{item.item.phone}</Text>
                    </View>

                    <View style={{marginTop: 15 / 2}}>
                        <Text style={styles.item_text}>{item.item.province+item.item.city+item.item.area+item.item.street}</Text>
                    </View>
                </View>

                <View style={styles.itemOption}>
                    <TouchableOpacity
                        style={[styles.optionSubItem,{flex:1}]}
                        activeOpacity={0.6}
                        onPress={()=>{
                            this._defaultAddress(item.index,item.item.id)
                        }}
                    >
                        {
                            item.item.default?<Icon name='ios-checkmark-circle' size={20} color='#FF5C60'/>:
                             <Icon name='ios-checkmark-circle-outline' size={20} color='#999999'/>
                        }
                        <Text style={styles.optionSubItem_text}>默认地址</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.optionSubItem,{marginRight:10}]} onPress={()=>{
                        // alert(1);
                        this.props.navigation.navigate('AddressUpdate',{id:item.item.id,refirsh: () => {
                                this.setState({
                                    isLoading: true,
                                });
                                this.fetchData();
                            }})
                    }}>
                        <Icon name='ios-create-outline' size={20} color='#999999'/>
                        <Text style={styles.optionSubItem_text}>编辑</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.optionSubItem} onPress={()=>{this._delete(item.item.id)}}>
                        <Icon name='ios-trash-outline' size={20} color='#999999'/>
                        <Text style={styles.optionSubItem_text}>删除</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    };

    /**
     * 渲染空组件
     * @private
     */
    _renderNull() {
        return (
            <View style={{marginTop: '50%', alignItems: 'center', justifyContent: 'center'}}>
                <Text>没有数据</Text>
            </View>
        )
    }


    /**
     * 设置默认地址
     * @private
     */
    _defaultAddress(_index,_id){
        let addressArray = this.state.dataArray;
        for(let i=0;i<addressArray.length;i++){
            addressArray[i].default=false;
            if(i==_index){
                addressArray[_index].default=true;
            }
        }

        this.setState({
            dataArray:addressArray
        })
        console.log(addressArray)

        let params={
            address_id:_id,
            is_default:'Y'
        };
        this.refs.toast.show('更新数据中');
        fetchRequest('user/address/update','POST',params).then((res)=>{
            console.log(res);
            console.log(res.code);
            if(res.code==1){
                // this.setState({
                //     dataArray:res.results,
                //     isLoading: false,
                // });
                this.refs.toast.show(res.message,3000);
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
     * 删除地址
     * @private
     */
    _delete(_id){
        let params={
            address_id:_id,
        };
        fetchRequest('user/address/delete','POST',params).then((res)=>{
            console.log(res);
            console.log(res.code);
            if(res.code==1){
                // this.setState({
                //     dataArray:res.results,
                //     isLoading: false,
                // });
                this.refs.toast.show(res.message,3000);
                this.fetchData();
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
const imgWidht = (width - 30 - 10) / 3;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8'
    },
    flatList: {
        flex: 1,
    },
    item: {
        marginBottom: 5,
        flex: 1,
        backgroundColor: '#fff'
    },
    item_text: {
        fontSize: 24 / 2,
        lineHeight: 33 / 2,
        fontFamily: "PingFangSC-Regular",
        color: '#2A2A2A',
    },
    itemInfo: {
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderColor: '#eee',
    },
    itemOption: {
        paddingHorizontal:15,
        flexDirection: 'row',
        alignItems:'center',
        height: 40,
    },

    optionSubItem:{
        flexDirection:'row',
        alignItems:'center'
    },
    optionSubItem_text:{
        marginLeft:3,
        fontSize:24/2,
        lineHeight:33/2,
        color:'#999',
    },
    submitBtn: {
        marginVertical: 10,
        width: width - 30,
        height: (width - 30) / 7.666,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',

        borderRadius: 5,
        backgroundColor: "#FF5C60"
    }
});

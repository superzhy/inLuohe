import React, {Component} from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    LayoutAnimation,
    Image,
    Linking
} from 'react-native';
import EvilIcons from "react-native-vector-icons/EvilIcons"
import {fetchRequest} from "../utils/FetchUtil";
import {ErrorView} from '../component/ErrorView';
import {LoadingView} from '../component/Loading';

export default class FoldList extends Component {
    constructor(props) {
        super(props);
        // 记录点击
        this.state = {
            isLoading: true,
            //网络请求状态
            error: false,
            errorInfo: "",
            isSelect: 0,
            subItemData: [{title: '中国移动', phone: 10086}, {title: '中国联通', phone: 10010}, {title: '中国电信', phone: 10000}],
            dataArray:[],
            show: false,
        }
    }

    componentDidMount(){
        this.fetchData()
    }


    /**
     * 获取数据
     */
    fetchData(){

        let that = this;
        fetchRequest('tel/listing','GET').then((res)=>{
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
     * 生成主界面
     * @returns {*}
     */
    renderData() {
        // 数据
        let data = this.state.dataArray;


        return (
            <View style={styles.bgView}>
                <FlatList
                    style={styles.flatList}
                    extraData={this.state}
                    ref={(flatList) => (this.flatList = flatList)}
                    keyExtractor={(item, index) => index.toString()}
                    data={data}
                    renderItem={this.renderItem}
                />
            </View>
        );
    }


    /**
     *@desc header点击
     */
    itemTap(_index) {

        console.log(_index);
        // 点击的item如果是同一个, 就置为初始状态-1, 也就是折叠的状态
        let select = _index;
        if (this.state.isSelect === _index) {
            select = -1;
        }

        LayoutAnimation.easeInEaseOut();
        this.setState({
            isSelect: select,
            show: true,
        })
    }

    // 渲染FlatList的item
    renderItem = (item) => {
        return (
            <View style={styles.listItemWrap}>
                <TouchableOpacity
                    style={styles.listItemTouch}
                    activeOpacity={0.6}
                    onPress={() => {
                        this.itemTap(item.index)
                    }}
                >
                    <Text>{item.item.name}</Text>
                    {
                        this.state.isSelect === item.index ? <EvilIcons name='chevron-up' size={30} color="#333"/>
                            : <EvilIcons name='chevron-down' size={30} color="#333"/>


                    }
                </TouchableOpacity>


                {this.state.isSelect === item.index ?
                    <View>
                        {
                            item.item.content.map((subItem, subItemIndex) => {
                                return (
                                    <TouchableOpacity
                                        key={subItemIndex}
                                        style={styles.listSubItemTouch}
                                        onPress={() => {
                                            return Linking.openURL(`tel:${subItem.tel}`)
                                        }}
                                    >
                                        <View style={{flexDirection: 'row'}}>
                                            <Text style={{color: '#999'}}>
                                                {subItem.name}
                                            </Text>
                                            <Text style={{color: '#FF5C60'}}>
                                                {subItem.tel}
                                            </Text>
                                        </View>

                                        <Image source={require('../images/icon/icon_cydh_phone.png')}
                                               style={{width: 73 / 2, height: 22}}/>
                                    </TouchableOpacity>

                                )
                            })
                        }
                    </View> : null}
            </View>
        )
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

    bgView: {
        flex: 1
    },

    flatList: {
        flex: 1
    },
    listItemWrap: {
        paddingHorizontal: 15,
        backgroundColor: '#fff'
    },
    listItemTouch: {
        height: 40,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderColor: '#eee'
    },

    listSubItemTouch: {
        paddingHorizontal: 15,
        height: 40,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderColor: '#eee'
    },
});
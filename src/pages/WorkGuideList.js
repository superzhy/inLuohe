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

export default class WorkGuideList extends Component {
    static navigationOptions = ({ navigation }) => {
        //课程详情
        return {
            headerTitle: '政府办事指南'
        };
    };


    constructor(props){
        super(props);
        // 记录点击
        this.state = {
            isLoading: true,
            //网络请求状态
            error: false,
            errorInfo: "",
            dataArray:[],
            isSelect: 0,
            subItemData:[{title: '独生子女'},{title: '结婚证'},{title: '养老保险'},{title: '离婚证'},],
            show:false,
        }
    }


    componentDidMount(){
        let id = this.props.navigation.state.params.id;
        this.fetchData(id);
    }


    /**
     * 获取数据
     */
    fetchData(_id){
        let params={
            category_id:_id
        };
        fetchRequest('guide/items/listing','POST',params).then((res)=>{
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
     * 生成主界面
     * @returns {*}
     */
    renderData(){
        return (
            <View style={styles.bgView}>
                <FlatList
                    style={styles.flatList}
                    ref={(flatList) => (this.flatList = flatList)}
                    keyExtractor={(item, index) => index.toString()}
                    data={this.state.dataArray}
                    extraData={this.state}
                    renderItem={this.renderItem}
                />
            </View>
        );
    }



    /**
     *@desc header点击
     */
    itemTap(_index){
        // 点击的item如果是同一个, 就置为初始状态-1, 也就是折叠的状态
        let select = _index;
        if (this.state.isSelect === _index){
            select = -1;
        }

        // 就这一句话就有动画效果了, 神奇不... , 对LayoutAnimation不熟悉的可以看上一篇文章.
        LayoutAnimation.easeInEaseOut();
        this.setState({
            isSelect: select,
            show:true,
        })
    }

    // 渲染FlatList的item
    renderItem = (item) => {
        return (
            <View style={styles.listItemWrap}>
                <TouchableOpacity
                    style={styles.listItemTouch}
                    activeOpacity={0.6}
                    onPress={() => {this.itemTap(item.index)}}
                >
                    <Text>{item.item.name}</Text>
                    {
                        this.state.isSelect===item.index?<EvilIcons name='chevron-up' size={30} color="#333" />
                            :<EvilIcons name='chevron-down' size={30} color="#333" />
                    }
                </TouchableOpacity>


                {this.state.isSelect === item.index ?
                    <View>
                        {
                            item.item.items.map((subItem, subItemIndex) => {
                                return (
                                    <TouchableOpacity
                                        key={subItemIndex}
                                        style={styles.listSubItemTouch}
                                        onPress={()=>{
                                            this.props.navigation.navigate('WorkGuideDetails',{title:subItem.items_name,id:subItem.items_id})
                                        }}
                                    >
                                        <Text style={{color:'#666'}}>
                                            {subItem.items_name}
                                        </Text>
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
        flexDirection:'row',
        alignItems:'center',
        justifyContent: 'space-between',
        borderBottomWidth:1,
        borderColor:'#eee'
    },

    listSubItemTouch:{
        paddingHorizontal:15,
        height:40,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        borderBottomWidth:1,
        borderColor:'#eee'
    },
});
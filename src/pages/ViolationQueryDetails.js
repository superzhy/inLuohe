import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    TouchableOpacity,
    FlatList
} from 'react-native';
import GreenGardenItem from "../component/GreenGardenItem"

import {LoadingView} from '../component/Loading';
import {ErrorView} from '../component/ErrorView';
import {fetchRequest} from "../utils/FetchUtil";


// class ResultItem extends React.Component{
//     render(){
//
//     }
// }

export default class GreenGarden extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            //网络请求状态
            error: false,
            errorInfo: "",
            data: [], //列表数据
            isRefreshing: false,//下拉控制,

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
            lsprefix:'粤',
            lsnum:'AXW725',
            engineno:'84280902',
            frameno:'107899|'
        };
        fetchRequest('peccancy/detail', 'POST', params).then((res) => {
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
     * 生成主界面
     */
    renderData(){
        return (
            <SafeAreaView style={styles.container}>
                <FlatList
                    data={this.state.data.list}
                    extraData={this.state}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={this.renderItem.bind(this)}
                    ListEmptyComponent={()=>{
                        return (
                            <View style={{flex:1,alignItems:'center',marginTop:'50%'}}>
                                <Text style={{textAlign:'center'}}>没有违章</Text>
                            </View>
                        )
                    }}
                    ListHeaderComponent={
                        <View style={styles.title}>
                            <Text>违章数据来自第三方</Text>
                        </View>
                    }
                />
            </SafeAreaView>
        );
    }


    renderItem(item){
        return (
            <View style={styles.ResultItem}>
                <View style={styles.ResultHead}>
                    <Text style={[styles.ResultHead_text,{flex:1}]}></Text>
                    <Text style={styles.ResultHead_text}>{item.item.time}</Text>
                </View>

                <View style={styles.ResultCont}>
                    <View style={{flex:6}}>
                        <Text numberOfLines={2} style={styles.violationDetails}>{item.item.content}</Text>
                        <Text style={styles.violationPlace}>{item.item.address}</Text>
                    </View>
                    <View style={{flex:1,alignItems:'center'}}>
                        <Text>{item.item.score}</Text>
                        <Text style={styles.ResultOther_text}>扣分</Text>
                    </View>
                    <View style={{flex:1,alignItems:'center'}}>
                        <Text>{item.item.price}</Text>
                        <Text style={styles.ResultOther_text}>罚款</Text>
                    </View>
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8',
    },
    title:{
        height:45,
        alignItems:'center',
        justifyContent:'center'

    },


    ResultItem:{
        marginBottom:10,
        paddingHorizontal:15,
        backgroundColor:'#fff'
    },
    ResultHead:{
        height:40,
        flexDirection:'row',
        alignItems:'center',
    },
    ResultHead_text:{
        color:'#999'
    },
    ResultCont:{
        paddingVertical:10,
        flexDirection:'row',
        borderTopWidth:1,
        borderStyle:'solid',
        borderColor:'#eee'
    },
    violationDetails:{
        fontSize:14,
        lineHeight:20,
        color:'#000'
    },
    violationPlace:{
        fontSize:12,
        lineHeight:20,
        color:'#999'
    },
    ResultOther_text:{
        fontSize:14,
        lineHeight:20,
        color:'#666'
    }
});

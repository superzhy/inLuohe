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
    FlatList, AsyncStorage
} from 'react-native';


import Icon from "react-native-vector-icons/Ionicons"
import BBSItem from '../component/BBSItem'


import {fetchRequest} from "../utils/FetchUtil";
import {LoadingView} from '../component/Loading';
import {ErrorView} from '../component/ErrorView';


export default class Home extends Component {
    static navigationOptions = ({navigation, screenProps}) => {
        return ({
            title: navigation.getParam('title', 'BBS分类'),

        })
    };


    constructor(props) {
        super(props);
        this.id = '';
        this.state = {
            isLoading: true,
            //网络请求状态
            error: false,
            errorInfo: "",
            dataArray: [],
            showFoot: 0, // 控制foot， 0：隐藏footer  1：已加载完成,没有更多数据   2 ：显示加载中
            isRefreshing: false,//下拉控制
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
    fetchData(_id) {
        this.setState({
            isRefreshing: true,
        })
        const params = {
            category_id: _id
        };
        fetchRequest('forum/content/listing', 'POST', params).then((res) => {
            console.log(res);
            console.log(res.code)
            if (res.code == 1) {
                this.setState({
                    dataArray: res.results,
                    isLoading: false,
                    isRefreshing: false
                });
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
     *@desc渲染主界面
     */
    renderData() {
        return <SafeAreaView style={styles.container}>
            <FlatList
                onRefresh={() => {
                    this.fetchData(this.id)
                }}
                refreshing={this.state.isRefreshing}
                keyExtractor={(item, index) => index.toString()}
                data={this.state.dataArray}
                renderItem={this._renderItemView.bind(this)}
                ListFooterComponent={this._renderFooter.bind(this)}
                ListEmptyComponent={<Text style={{marginTop: '50%', textAlign: 'center'}}>无数据</Text>}
                // onEndReached={this._onEndReached.bind(this)}
                onEndReachedThreshold={1}
                numColumns={1}
            />

            <TouchableOpacity style={styles.release} onPress={() => {
                this._release()
            }}>
                <Icon name='md-create' size={25} color='#fff'/>
            </TouchableOpacity>
        </SafeAreaView>
    }


    /**
     *@desc生成每一项
     */
    _renderItemView(_item) {
        return <View style={{paddingHorizontal: 15}}>
            <BBSItem data={_item.item} goDetails={(id) => {
                this._goDetails(id)
            }}/>
        </View>
    }


    /**
     *@desc生成底部组件
     */
    _renderFooter() {
        if (this.state.showFoot === 1) {
            return (
                <View style={{height: 30, alignItems: 'center', justifyContent: 'flex-start',}}>
                    <Text style={{color: '#999999', fontSize: 14, marginTop: 5, marginBottom: 5,}}>
                        没有更多数据了
                    </Text>
                </View>
            );
        } else if (this.state.showFoot === 2) {
            return (
                <View style={styles.footer}>
                    <ActivityIndicator/>
                    <Text>正在加载更多数据...</Text>
                </View>
            );
        } else if (this.state.showFoot === 0) {
            return (
                <View style={styles.footer}>
                    <Text></Text>
                </View>
            );
        }
    }


    /**
     *@desc 跳转详情
     */
    _goDetails(_id) {
        this.props.navigation.navigate('BBSDetails', {id: _id})
    }

    _release() {
        AsyncStorage.getItem('userInfo', (error, result) => {
            if (!error) {
                console.log(result);
                if(result){
                    this.props.navigation.navigate('BBSRelease', {
                        id: this.id, refirsh: () => {
                            this.fetchData(this.id)
                        }
                    })
                }else{
                    this.props.navigation.navigate('LoginModal')
                }
            }
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
        position: 'relative',
        backgroundColor: '#fff'
    },
    release: {
        position: 'absolute',
        right: 30,
        bottom: 50,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        backgroundColor: '#ff5155'
    }
});

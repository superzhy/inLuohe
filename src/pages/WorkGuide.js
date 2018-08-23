import React, {Component} from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    LayoutAnimation,
    ImageBackground,
    Linking,
} from 'react-native';
import EvilIcons from "react-native-vector-icons/EvilIcons"
import {fetchRequest} from "../utils/FetchUtil";
import {ErrorView} from '../component/ErrorView';
import {LoadingView} from '../component/Loading';

export default class WorkGuide extends Component {
    static navigationOptions = ({navigation}) => {
        //课程详情
        return {
            headerTitle: '政府办事指南'
        };
    };


    constructor(props) {
        super(props);
        // 记录点击
        this.state = {
            isLoading: true,
            //网络请求状态
            error: false,
            errorInfo: "",
            dataArray: [],
        }
    }


    componentDidMount() {
        this.fetchData()
    }


    /**
     * 获取数据
     */
    fetchData() {

        let that = this;
        fetchRequest('guide/category/listing', 'GET').then((res) => {
            console.log(res);
            console.log(res.code)
            if (res.code == 1) {
                this.setState({
                    dataArray: res.results,
                    isLoading: false,
                })
            }
        }).catch((err) => {
            console.log(err);
            //请求失败
            that.setState({
                error: true,
                errorInfo: ''
            });
        })
    }


    /**
     * 生成主界面
     * @returns {*}
     */
    renderData() {
        // 数据
        return (
            <View style={styles.bgView}>
                <FlatList
                    style={styles.flatList}
                    ref={(flatList) => (this.flatList = flatList)}
                    keyExtractor={(item, index) => index.toString()}
                    data={this.state.dataArray}
                    renderItem={this.renderItem}
                />
            </View>
        );
    }


    // 渲染FlatList的item
    renderItem = (item) => {
        return (
            <TouchableOpacity style={{marginTop: 10}} activeOpacity={0.6}  onPress={()=>{this.props.navigation.navigate('WorkGuideList',{id:item.item.id})}}>
                <ImageBackground source={{uri: item.item.icon}} style={styles.img}>
                    <Text style={{fontSize: 18, color: '#fff'}}>{item.item.name}</Text>
                </ImageBackground>
            </TouchableOpacity>
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
        flex: 1,
        paddingHorizontal: 15,
    },
    img: {
        width: width - 30,
        height: (width - 30) / 1.815,
        alignItems: 'center',
        justifyContent: 'center'
    }
});
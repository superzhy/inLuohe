import React, {Component} from 'react';
import {
    View,
    Text,
    SafeAreaView,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    LayoutAnimation,
    Image,
    ScrollView,
    WebView
} from 'react-native';
import EvilIcons from "react-native-vector-icons/EvilIcons"
import {fetchRequest} from "../utils/FetchUtil";
import {ErrorView} from '../component/ErrorView';
import {LoadingView} from '../component/Loading';
import WebCont from '../component/WebCont';

export default class FoldList extends Component {
    static navigationOptions = ({navigation}) => {
        return {
            headerTitle: navigation.getParam('title', '办事详情'),
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
            stepArr: [{id: 1}, {id: 2}, {id: 3}, {id: 4},],
            dataArray: [],
            content: ''
        }
    }


    componentDidMount() {
        let id = this.props.navigation.state.params.id;
        this.fetchData(id);
    }


    /**
     * 获取数据
     */
    fetchData(_id) {
        let params = {
            items_id: _id
        };
        fetchRequest('guide/items/detail', 'POST', params).then((res) => {
            console.log(res);
            console.log(res.code)
            if (res.code == 1) {
                this.setState({
                    dataArray: res.results,
                    content:res.results[0].content,
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
     *渲染主界面
     */
    renderData() {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.step}>
                    <ScrollView style={{flex: 1}}>
                        {
                            this._renderStep()
                        }
                    </ScrollView>
                </View>
                <View style={styles.cont}>
                    <View style={styles.contTitle}>
                        <Text style={styles.contTitle_text}>步骤详情</Text>
                    </View>
                    <ScrollView style={{flex: 1, paddingHorizontal: 15, paddingTop: 20}}>
                        {/*<Text style={styles.cont_text}>申请领取《独身子女证》，需携带户口簿、结婚证原件。</Text>*/}
                        {/*<View style={{marginTop: 10, height: 200, backgroundColor: '#ddd'}}/>*/}

                        <WebView bounces={false}
                                 scalesPageToFit={true}
                                 source={{
                                     html: `<!DOCTYPE html> <html><head><style>img{width:100%;height:auto;display: block;margin: 0 auto;}</style></head><body>${this.state.content} <script>window.onload=function() {
                                                 window.location.hash =1;document.title = document.body.clientHeight;
                                                 document.getElementsByTagName('')
                                            }</script> </body></html>`,
                                     baseUrl: ''
                                 }}

                                 onNavigationStateChange={(title) => {
                                     if (title.title != undefined) {
                                         this.setState({
                                             height_webview: (parseInt(title.title) + 20)
                                         })
                                     }

                                     console.log(title)
                                 }}


                                 style={{width: '100%',height:this.state.height_webview}}
                        />

                        {/*<WebCont content={this.state.content}/>*/}
                    </ScrollView>
                </View>
            </SafeAreaView>
        )
    }

    /**
     *@desc 生成Step
     */
    _renderStep() {
        const {dataArray} = this.state;

        return dataArray.map((item, index) => {
            return (
                <TouchableOpacity key={index} style={[styles.stepItem, item.select && {
                    backgroundColor: "#fff",
                    borderRightColor: '#fff'
                }]} onPress={() => {
                    this._selectStep(dataArray, item, index)
                }}>
                    <View style={styles.stepItemIndex}><Text
                        style={{fontSize: 22 / 2, color: '#fff'}}>{index}</Text></View>
                    <Text>第{index + 1}步</Text>
                </TouchableOpacity>
            )
        })
    }

    _selectStep(array, item, index) {
        let i = index;
        array.map((item, index) => {
                item.select = false;
                if (index == i) {
                    item.select = true;
                }
            }
        );

        this.setState({
            dataArray:array,
            content:array[index].content
        })
    }


    render() {
        // //第一次加载等待的view
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
    container: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#fff'
    },
    step: {
        width: 170 / 2,
        // backgroundColor:'red'
    },
    stepItem: {
        flex: 1,
        height: 45,
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderRightWidth: 1,
        borderColor: '#eee',
        backgroundColor: '#f8f8f8'
    },
    stepItemIndex: {
        marginRight: 5,
        backgroundColor: 'red',
        borderRadius: 7,
        width: 14,
        height: 14,
        justifyContent: 'center',
        alignItems: 'center'
    },
    cont: {
        flex: 1,
    },
    contTitle: {
        height: 30,
        paddingHorizontal: 15,
        justifyContent: 'center',
        backgroundColor: '#f8f8f8'
    },
    contTitle_text: {
        fontSize: 24 / 2,
        color: '#666'
    },
    cont_text: {
        fontSize: 28 / 2,
        lineHeight: 40 / 2
    }
});
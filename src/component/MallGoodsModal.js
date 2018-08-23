import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Image,
    TextInput,
    TouchableOpacity,
    Dimensions,
    ScrollView
} from 'react-native';

import Icon from "react-native-vector-icons/Ionicons"
import EvilIcons from "react-native-vector-icons/EvilIcons"
import List from '../List'
import Toast from '../component/Toast'

import SetNumber from '../component/SetNumber';

let idArray = [];
let specArray = []

export default class GoodsComment extends Component {

    componentDidMount() {
        idArray = [];
        specArray = [];
        this.setState({
            selectNum: this.state.defaultNum,
        });

        console.log(this.props.data.specs_name)
        console.log(this.props.data)
    }

    componentWillUnmount() {
        let array = this.state.specs_name;
        for (let j = 0; j < array.length; j++) {
            for (let i = 0; i < array[j].specs.length; i++) {
                let item = array[j].specs[i];
                item.select = false;
            }
        }
        this.setState({
            specs_name: array,
        });
    }

    constructor(props) {
        super(props);
        this.state = {
            data: this.props.data,
            specs_name: this.props.data.specs_name,
            specStr: '规格',
            gooddObj: {},
            defaultNum: 1,
            selectNum: '',
            active: false,
            goodsImg:this.props.data.product.cover
        }
    }


    /**
     *选中商品类型
     **/
    active(itemIndex, index) {
        console.log(index);
        console.log(itemIndex);
        let specs_value = this.state.data.specs_value;
        let array = this.state.specs_name;
        for (let i = 0; i < array[index].specs.length; i++) {
            let item = array[index].specs[i];
            item.select = false;
            if (i == itemIndex) {
                item.select = true;
                idArray[index] = item.item_id;
                specArray[index] = array[index].name + ':' + item.item_name
            }
        }
        console.log(idArray);
        console.log(specArray);


        let idStr = idArray.join(';');
        let specStr = specArray.join(' ');

        console.log(idStr);
        console.log(specStr);


        this.setState({
            specs_name: array,
            specStr
        });
        // if(idArray.length==array.length){
        //     let gooddObj = specs_value[idStr];
        //     console.log(gooddObj);
        //     this.setState({
        //         gooddObj:gooddObj
        //     })
        // }

        //判断是否选中完商品
        if (specs_value[idStr]) {
            let gooddObj = specs_value[idStr];
            this.setState({
                gooddObj: gooddObj
            })
        }
    }

    /**
     *数量加
     */
    addNumber() {
        const stock = this.state.gooddObj.stock;
        let selectNum = this.state.selectNum;
        if (!this.state.gooddObj.stock) {
            this.refs.toast.show('请选择好商品', 3000);
        } else {
            if ((++selectNum) > stock) {
                this.refs.toast.show(`商品最多选择${stock}件商品`, 3000);
            } else {
                // ++selectNum;
                this.setState({
                    selectNum: selectNum
                })
            }
        }
    }


    /**
     * 数量减
     */
    reduceNumber() {
        const {defaultNum} = this.state;
        let selectNum = this.state.selectNum;
        if (!this.state.gooddObj.stock) {
            this.refs.toast.show('请选择好商品', 3000);
        } else {
            if ((--selectNum) < defaultNum) {
                this.refs.toast.show(`商品最少选择${defaultNum}件商品`, 3000);
            } else {
                this.setState({
                    selectNum: selectNum
                })
            }
        }
    }


    /**
     *点击确定按钮
     */
    submit() {
        if (!this.state.gooddObj.stock) {
            this.refs.toast.show('请选择好商品', 3000);
        } else {
            let goodsInfo = this.state.gooddObj;
            goodsInfo.goodsImg = this.state.goodsImg;
            goodsInfo.goodsSpec = specArray;
            goodsInfo.goodsName = this.state.data.product.name;
            goodsInfo.goodsNum = this.state.selectNum;
            goodsInfo.goodsId = this.state.data.product.id;
            console.log(goodsInfo);
            this.props.close();
            this.props.goPay(goodsInfo);
        }
    }


    render() {
        const {data, specs_name} = this.state;
        const {close} = this.props;
        return (
            <View style={styles.container}>
                <View style={styles.wrap}>
                    {/*关闭按钮*/}
                    <View style={{alignItems: 'flex-end', paddingTop: 15}}>
                        <TouchableOpacity style={{width: 17, height: 17}} onPress={() => {
                            close()
                        }}>
                            <Image source={require('../images/icon/close.png')} style={{width: 17, height: 17}}/>
                        </TouchableOpacity>
                    </View>

                    {/*商品信息*/}
                    <View style={styles.goods}>
                        <Image source={{uri:this.state.goodsImg}} style={styles.goodsImg}/>
                        <View style={{flex: 1, justifyContent: 'flex-end', marginLeft: 10}}>
                            <Text style={styles.goodsPrice}>¥{this.state.gooddObj.price}</Text>
                            <Text style={styles.goodsStock}>库存{this.state.gooddObj.stock}件</Text>
                            <Text style={styles.goodsSpec}>{this.state.specStr}</Text>
                        </View>
                    </View>


                    {/*商品规格*/}
                    {
                        specs_name.map((key, index) => {
                            return (
                                <View key={index} style={{paddingVertical: 10, borderTopWidth: 1, borderColor: '#eee'}}>
                                    <Text style={{fontSize: 15, lineHeight: 21, color: '#333'}}>{key.name}</Text>
                                    <View style={{flexDirection: 'row', marginTop: 25 / 2}}>
                                        {
                                            key.specs.map((item, itemIndex) => {
                                                return (
                                                    <TouchableOpacity
                                                        key={itemIndex}
                                                        style={[styles.attr_value, item.select && styles.attr_value_active]}
                                                        activeOpacity={.6}
                                                        onPress={() => {
                                                            this.active(itemIndex, index)
                                                        }}
                                                    >
                                                        <Text
                                                            style={[item.select && {color: '#fff'}]}>{item.item_name}</Text>
                                                    </TouchableOpacity>
                                                )
                                            })

                                        }

                                    </View>
                                </View>
                            )
                        })
                    }

                    {/*数量*/}
                    <View style={styles.number}>
                        <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
                            <Text style={{fontSize: 15, lineHeight: 21}}>购买数量</Text>
                            {/*<Text style={{fontSize: 12, lineHeight: 21, color: '#3f3f3f'}}>(每人限购2份)</Text>*/}
                        </View>

                        <SetNumber add={this.addNumber.bind(this)} reduce={this.reduceNumber.bind(this)}
                                   selectNum={this.state.selectNum}/>
                    </View>

                    <TouchableOpacity style={styles.okBtn} onPress={() => {
                        this.submit()
                    }}>
                        <Text style={{color: '#fff'}}>确定</Text>
                    </TouchableOpacity>
                </View>

                <Toast ref="toast"/>
            </View>
        );
    }
}

const ScreenWidht = Dimensions.get('window').width;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,.3)',
    },
    wrap: {
        paddingHorizontal: 15,
        // minHeight: 500 / 2,
        height:500,
        backgroundColor: '#fff',

        position:'relative',
        zIndex:9999
    },

    //商品
    goods: {
        flexDirection: 'row',
        marginBottom: 10,
    },

    goodsImg: {
        width: 100,
        height: 100,
    },

    goodsPrice: {
        fontSize: 28 / 2,
        lineHeight: 40 / 2,
        color: '#ff5c6c',
    },
    goodsStock: {
        fontSize: 20 / 2,
        lineHeight: 28 / 2,
        color: '#999'
    },
    goodsSpec: {
        fontSize: 24 / 2,
        lineHeight: 33 / 2,
        color: 'black'
    },


    //分类
    classify: {
        height: 171 / 2,
        justifyContent: 'center',
        borderTopWidth: 1,
        borderColor: '#eee'
    },

    number: {
        paddingVertical: 34 / 2,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        borderColor: '#eee'
    },
    okBtn: {
        marginTop: 50,
        // marginBottom: 20,
        height: 45,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        backgroundColor: '#FF5C60'
    },

    //属性
    attr_value: {
        marginLeft: 10, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 3, backgroundColor: '#f5f5f5'
    },
    attr_value_active: {
        backgroundColor: '#FF5C60'
    }


});
import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    TouchableOpacity,
    TextInput,
    Image
} from 'react-native';
import GreenGardenItem from "../component/GreenGardenItem"
import Toast from "../component/Toast";

export default class GreenGarden extends Component {
    constructor(props) {
        super(props);
        this.state = {
            plate:'',
            Engine:'',
            Frame:''
        }
    }

    /**
     *@desc 跳转查询结果
     */
    _goResult(){
        const {plate,Engine,Frame}= this.state
        if(plate&&Engine&&Frame){
            this.props.navigation.navigate('ViolationQueryDetails',{plate:this.state.plate,Engine:this.state.Engine,Frame:this.state.Frame})
        }else {
            this.refs.toast.show('填写数据完整',3000);
        }

    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.wrap}>
                    <View style={styles.inputGroup}>
                        <Image source={require('../images/icon/icon_wz_chepaihao.png')} style={{width:32,height:18}}/>
                        <View style={{width:1,height:18,backgroundColor:'#FF5C60',marginHorizontal:7,}}/>
                        <View style={styles.province}>
                            <Text style={{fontSize:12}}>豫</Text>
                        </View>
                        <TextInput
                            editable={true}
                            maxLength={40}
                            style={{flex: 1,paddingHorizontal:10}}
                            placeholder='请输入车牌号'
                            underlineColorAndroid='transparent' //设置下划线背景色透明 达到去掉下划线的效果
                            onChangeText={(text)=>{
                                this.setState({
                                    plate:text
                                })
                            }}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Image source={require('../images/icon/icon_wz_fadongji.png')} style={{width:32,height:18}}/>
                        <View style={{width:1,height:18,backgroundColor:'#FF5C60',marginHorizontal:7,}}/>
                        <TextInput
                            editable={true}
                            maxLength={40}
                            style={{flex: 1,paddingHorizontal:10}}
                            placeholder='请输入发动机号'
                            underlineColorAndroid='transparent' //设置下划线背景色透明 达到去掉下划线的效果
                            onChangeText={(text)=>{
                                this.setState({
                                    Engine:text
                                })
                            }}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Image source={require('../images/icon/icon_wz_chejia.png')} style={{width:32,height:18}}/>
                        <View style={{width:1,height:18,backgroundColor:'#FF5C60',marginHorizontal:7,}}/>
                        <TextInput
                            editable={true}
                            maxLength={40}
                            style={{flex: 1,paddingHorizontal:10}}
                            placeholder='请输入车架号'
                            underlineColorAndroid='transparent' //设置下划线背景色透明 达到去掉下划线的效果
                            onChangeText={(text)=>{
                                this.setState({
                                    Frame:text
                                })
                            }}
                        />
                    </View>


                    <TouchableOpacity style={styles.queryBtn} activeOpacity={.7} onPress={this._goResult.bind(this)}>
                        <Text style={{color:'#fff'}}>立即查询</Text>
                    </TouchableOpacity>
                    <Text style={styles.tips}>
                        点击查询，即表示您同意
                        <Text style={{color:"#FF5C60"}}>《在漯河用户使用协议》</Text>
                    </Text>
                </View>
                <Toast ref="toast"/>

            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8',
    },
    wrap:{
        marginTop:10,
        paddingHorizontal:15,
        flex:1,
        backgroundColor:'#fff'
    },

    inputGroup:{
        height:50,

        flexDirection:'row',
        alignItems:'center',

        borderBottomWidth:1,
        borderStyle:"solid",
        borderColor:'#eee',
    },
    province:{
        width:45,
        height:18,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#e3e3e3'
    },
    queryBtn:{
        marginTop:120,
        height:45,
        justifyContent:'center',
        alignItems:'center',
        borderRadius:4,
        backgroundColor:'#FF5C60',
    },
    tips:{
        marginTop:15,
        fontSize:12,
        lineHeight:33/2,
        textAlign:'center',
        color:'#999'
    }
});

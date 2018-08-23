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
    ScrollView, AsyncStorage,

} from 'react-native';

import Icon from "react-native-vector-icons/Ionicons"
import Picker from 'react-native-picker'
import Toast from "../component/Toast";
import {fetchRequest, setToken} from "../utils/FetchUtil";


//城市精选item
export default class ReserveModal extends Component {

    state = {
        secureTextEntry: true,
        countDown: true,
        count: 60,
        likesActive:this.props.likesActive,
        language:'',
        date:['00','00','00'],
        time:['1小时'],
        name:'',
        phone:'',
    };


    /**
     * 显示城市选择器
     */
    showPicker = () => {
        // let data = [
        //     {
        //         "北京": [
        //             {
        //                 '北京': [
        //                     "东城区",
        //                     "西城区",
        //                     "崇文区",
        //                     "宣武区",
        //                     "朝阳区",
        //                     "丰台区",
        //                     "石景山区",
        //                     "海淀区",
        //                     "门头沟区",
        //                     "房山区",
        //                     "通州区",
        //                     "顺义区",
        //                     "昌平区",
        //                     "大兴区",
        //                     "平谷区",
        //                     "怀柔区",
        //                     "密云县",
        //                     "延庆县",
        //                     "其他"
        //                 ]
        //             }
        //         ]
        //     }
        // ];

        let hours = [],
            minutes = [],
            time=[],
            date=new Date();
        console.log(date);
        // let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '月';
        // console.log(M);

        //日期
        for(let i=0;i<3;i++){
            date.setDate(date.getDate()+i);
            let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '月';
            let D = date.getDate() + '号';
            time.push(M+D)
        }
        console.log(time)
        //时
        for(let i=9;i<18;i++){
            hours.push(i + '点');
        }
        //分
        for(let i=0;i<60;i++){
            minutes.push(i + '分');
        }

        // let obj = {},
        //     data={};
        // for(let i=0;i<hours.length;i++){
        //     obj[hours[i]] = minutes
        // }
        // for(let i=0;i<time.length;i++){
        //     data[time[i]] = obj
        // }
        // console.log(obj);
        // console.log(data);
        //
        // let item,
        //     pickerData=[];
        // for(item in data){
        //     pickerData.push({[item]:data[item]})
        // }
        // console.log(pickerData)

        let pickerData = [time,hours,minutes]


        Picker.init({
            pickerData: pickerData,
            selectedValue: [0,0,0,],
            pickerCancelBtnText: '关闭',
            pickerConfirmBtnText: '确定',
            pickerTitleText: '日期选择',
            onPickerConfirm: data => {
                console.log(data);
                this.setState({
                    date:data
                })
            },
            onPickerCancel: data => {
                console.log(data);
            },
            onPickerSelect: data => {
                console.log(data);
            }
        });


        Picker.show();
        //
        // console.log(Picker.init())


    };


    showTime(){
        let time=['1小时','1.5小时','2小时','2.5小时'];
        Picker.init({
            pickerData: time,
            selectedValue: [0],
            pickerCancelBtnText: '关闭',
            pickerConfirmBtnText: '确定',
            pickerTitleText: '时间选择',
            onPickerConfirm: data => {
                console.log(data);
                this.setState({
                    time:data
                })
            },
            onPickerCancel: data => {
                console.log(data);
            },
            onPickerSelect: data => {
                console.log(data);
            }
        });


        Picker.show();
    }


    _submit(){
        const {name,phone,time,date} = this.state;
        const   boutique_id=this.props.id;
        const {close} = this.props;
        console.log(name);
        console.log(phone);
        console.log(boutique_id)
        if(name&&phone&&date[0]!='00'){
            let params = {
                boutique_id:boutique_id,
                name:name,
                phone:phone,
                duration:time[0],
                time:date[0]+date[1]+date[2]
            };
            fetchRequest('city_boutique/subscribe','POST',params).then((res)=>{
                console.log(res);
                console.log(res.code)
                if(res.code===1){
                    this.refs.toast.show(res.message,3000);
                    setTimeout(()=>{
                        close()
                    },1000)
                }else if(res.code===-1){
                    this.refs.toast.show(res.message,3000);
                }else if(res.code===-2){
                    this.refs.toast.show(res.message[0],3000);
                }
            }).catch((err)=>{
                console.log(err);
                //请求失败
                this.setState({
                    error: true,
                    errorInfo:''
                });
            })
        }else{
            this.refs.toast.show('填写信息完整',3000);
        }
    }

    render() {
        const {close} = this.props;
        const {date,time} = this.state;
        return (
            <View style={styles.container}>
                <View style={styles.title}>
                    <TouchableOpacity style={styles.closeBtn} onPress={()=>close()}>
                        <Icon name='ios-close' size={40} color='#222'/>
                    </TouchableOpacity>
                    <Text style={styles.title_text}>预约</Text>
                </View>

                <View style={styles.content}>
                    <View style={styles.inputGroup}>
                        <Text>姓名</Text>
                        <TextInput
                            style={styles.input}
                            placeholder='请输入姓名'
                            placeholderTextColor='#999999'
                            underlineColorAndroid='transparent' //设置下划线背景色透明 达到去掉下划线的效果
                            onChangeText={(text)=>{
                                this.setState({
                                    name:text
                                })
                            }}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text>电话</Text>
                        <TextInput
                            style={styles.input}
                            placeholder='请输入联系电话'
                            placeholderTextColor='#999999'
                            underlineColorAndroid='transparent' //设置下划线背景色透明 达到去掉下划线的效果
                            onChangeText={(text)=>{
                                this.setState({
                                    phone:text
                                })
                            }}
                        />
                    </View>

                    <Text style={styles.timeTitle}>预约开始时间</Text>
                    <TouchableOpacity style={styles.dataSelect} onPress={()=>{
                        this.showPicker();
                    }}>
                        <Text style={styles.dataItem}>{date[0]}</Text>
                        <Text style={styles.dataItem}>{date[1]}</Text>
                        <Text style={styles.dataItem}>{date[2]}</Text>
                    </TouchableOpacity>
                    <Text style={styles.timeTitle}>预约时长</Text>
                    <TouchableOpacity style={styles.dataSelect} onPress={()=>{
                        this.showTime();
                    }}>
                        <Text style={styles.dataItem}>{time[0]}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.submitBtn} activeOpacity={0.8} onPress={()=>{
                        this._submit();
                    }}>
                        <Text style={{color:'white'}}>确定</Text>
                    </TouchableOpacity>
                </View>
                <Toast ref="toast"/>

            </View>
        );
    }
}

const {height, width} = Dimensions.get('window');
const styles = StyleSheet.create({
    container: {
        height:467.5,
        backgroundColor:'#fff',
    },
    title:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        paddingHorizontal:15,
        height:50,
        borderBottomWidth:1,
        borderStyle:'solid',
        borderColor:'#e2e2e2'
    },
    title_text:{
        fontSize:17,
        lineHeight:24,
    },
    closeBtn:{
        position:'absolute',
        width:50,
        left:15,
        right:0,
    },
    content:{
        paddingHorizontal:15,
    },
    inputGroup:{
        flexDirection:'row',
        height:50,
        alignItems:'center',
        borderBottomWidth:1,
        borderStyle:'solid',
        borderColor:'#eee'
    },
    input:{
        flex:1,
        textAlign:'right'
    },

    timeTitle:{
        textAlign:'center',
        marginTop:20,
        fontSize:15,
        lineHeight:21,
    },
    dataSelect:{
        flexDirection:'row',
        justifyContent:'space-between',
        marginTop:18.5
    },
    dataItem:{
        flex:1,
        textAlign:'center',
        fontSize:18,
        lineHeight:25,
    },
    submitBtn:{
        marginTop:22.5,
        justifyContent:"center",
        alignItems:'center',
        height:45,
        backgroundColor:'#FF5C60',
        borderRadius:4
    },

    Picker:{
        height:50,
        width:100,
        borderWidth:0
    }
});
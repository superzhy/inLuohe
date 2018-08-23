import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    ScrollView,
    SafeAreaView,
    TouchableOpacity,
    FlatList, Dimensions, StatusBar, AsyncStorage, BackHandler
} from 'react-native';
import ToastUtil from "../component/Toast";

export default class Order extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    componentDidMount() {
        this._navListener = this.props.navigation.addListener('didFocus', () => {
            StatusBar.setBarStyle('dark-content');
            // (Platform.OS === 'android') && StatusBar.setTranslucent(true);
            (Platform.OS === 'android') && StatusBar.setBackgroundColor('#fff');
        });
    }


    componentWillUnmount() {
        this._navListener.remove();
        let refirsh=this.props.navigation.getParam('refirsh','');
        if(refirsh){
            refirsh();
        }
    }



    /**
     * 退出登录
     */
    exit(){
        AsyncStorage.removeItem('userInfo',(error, result) => {
            console.log(error);
            if (!error) {
                // console.log(result);
                // this.setState({
                //     userInfo:JSON.parse(result)
                // })
                this.props.navigation.goBack()
            }
        });
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <TouchableOpacity style={styles.item} onPress={()=>{
                    this.exit()
                }}>
                    <Text style={{textAlign:'center'}}>退出登录</Text>
                </TouchableOpacity>
            </SafeAreaView>
        )
    }

}

const ScreenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'#fff'
    },

    item:{
        paddingHorizontal:15,
      height:40,
        justifyContent:'center',
      borderBottomWidth:1,
      borderColor:"#eee"
    },
    navBar: {
        height: 40,
        backgroundColor: '#f7f7f7'
    }
});

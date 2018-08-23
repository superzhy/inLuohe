import React, { Component } from 'react';
import {
    StyleSheet,
    Animated,
    Easing,
    View,
    Text,
    Dimensions,
    ScrollView,
    SafeAreaView, StatusBar, Platform,
} from 'react-native';
// import Dimensions from 'Dimensions';
import Carousel from 'react-native-snap-carousel';
import Swiper from 'react-native-swiper'


export default class extends Component {
    constructor(props) {
        super(props);
        this.state = {
            translateY: new Animated.Value(0),
        };
    }



    componentDidMount() {
        // this.showHeadBar(0, 5);         //从第0条开始，轮播5条数据
        this._navListener = this.props.navigation.addListener('didFocus', () => {
            StatusBar.setBarStyle('dark-content');
            (Platform.OS === 'android') && StatusBar.setTranslucent(false);
            (Platform.OS === 'android') && StatusBar.setBackgroundColor('#fff');
        });
    }

    componentWillUnmount() {
        this._navListener.remove();
    }

    //
    // showHeadBar(index, count) {console.log('start')
    //     index++;
    //     Animated.timing(this.state.translateY, {
    //         toValue: -40 * index,             //40为文本View的高度
    //         duration: 300,                        //动画时间
    //         Easing: Easing.linear,
    //         delay: 3000                            //文字停留时间
    //     }).start(() => {                          //每一个动画结束后的回调
    //         if(index >= count) {
    //             index = 0;
    //             this.state.translateY.setValue(0);
    //         }
    //         this.showHeadBar(index, count);  //循环动画
    //     })
    // }
    //
    //
    // _renderNewsItem({item,index}){
    //     return (
    //         <Text style={{height:40}}>{index}</Text>
    //     )
    // }




    render() {
        return(
            <SafeAreaView style={{flex:1}}>
                {/*<View style={styles.container}>*/}
                    {/*<Animated.View*/}
                        {/*style={[styles.wrapper, {*/}
                            {/*transform: [{*/}
                                {/*translateY: this.state.translateY*/}
                            {/*}]*/}
                        {/*}*/}
                        {/*]}*/}
                    {/*>*/}
                        {/*<View style={styles.bar}>*/}
                            {/*<Text style={styles.barText}>1111</Text>*/}
                        {/*</View>*/}
                        {/*<View style={styles.bar}>*/}
                            {/*<Text style={styles.barText}>2222</Text>*/}
                        {/*</View>*/}
                        {/*<View style={styles.bar}>*/}
                            {/*<Text style={styles.barText}>3333</Text>*/}
                        {/*</View>*/}
                        {/*<View style={styles.bar}>*/}
                            {/*<Text style={styles.barText}>4444</Text>*/}
                        {/*</View>*/}
                        {/*<View style={styles.bar}>*/}
                            {/*<Text style={styles.barText}>5555</Text>*/}
                        {/*</View>*/}
                        {/*<View style={styles.bar}>*/}
                            {/*<Text style={styles.barText}>1111</Text>*/}
                        {/*</View>*/}
                    {/*</Animated.View>*/}
                {/*</View>*/}

                {/*<View style={{height:40}}>*/}
                    {/*<Swiper*/}
                        {/*horizontal={false}*/}
                        {/*height={40}*/}
                        {/*loop={true}*/}
                        {/*autoplay={true}*/}
                        {/*showsPagination={false}*/}
                    {/*>*/}
                        {/*<Text>1111</Text>*/}
                        {/*<Text>222</Text>*/}
                        {/*<Text>3333</Text>*/}
                    {/*</Swiper>*/}
                {/*</View>*/}
            </SafeAreaView>

        );
    }
}
const styles = StyleSheet.create({
    container: {
        marginTop: 5,
        height: 40,
        overflow: 'hidden',


        backgroundColor: '#fff6ca',
        borderRadius: 14,
    },
    wrapper: {
        marginHorizontal: 5,
    },


    bar: {
        height: 40,
        justifyContent: 'center',
    },


    barText: {
        width: Dimensions.get('window').width - 30 - 16,
        marginLeft: 5,
        color: '#ff7e00',
        fontSize: 14,
    },
});
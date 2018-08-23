import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Image,
    TextInput,
    TouchableOpacity,
    Dimensions, Animated
} from 'react-native';
import Carousel from 'react-native-snap-carousel';
import Icon from "react-native-vector-icons/Ionicons"


//本地资讯item
export default class ImageSlider extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeSlide:1
        };
    }



    /**
     *@desc 生成商品图
     */
    _sliderItem({item, index}) {
        const {width,height} = this.props;
        return (
            <Image style={[{backgroundColor: '#ccc', height: height, width: width}]}
                   source={{uri:item}}>
            </Image>
        );
    }

    render() {
        const {width,height,data=['http://in-luohe-dev.oss-cn-hangzhou.aliyuncs.com/boutique/20180730/1532918210_58856.png']} = this.props;
        const bannerList= data;
        return (
            <View style={[styles.container,{width:width,height:height}]}>
                <Carousel
                    ref={() => {
                    }}
                    data={bannerList}
                    renderItem={this._sliderItem.bind(this)}
                    sliderWidth={width}
                    layout={'default'}
                    itemWidth={width}
                    loop={true}
                    inactiveSlideScale={1}
                    inactiveSlideOpacity={0.8}
                    // autoplay={true}
                    onSnapToItem={(index) => {
                        this.setState({activeSlide: index + 1})
                    }}
                />
                <View style={styles.Pagination}>
                    <Text style={{
                        fontSize: 12,
                        lineHeight: 33 / 2,
                        color: '#fff'
                    }}>{this.state.activeSlide > 9 ? this.state.activeSlide : '0' + this.state.activeSlide}/{bannerList.length > 9 ? bannerList.length : '0' + bannerList.length}</Text>
                </View>
            </View>
        );
    }
}

const windowW = Dimensions.get('window').width;
const styles = StyleSheet.create({
    container:{
        width:windowW,
        position:'relative',
        // backgroundColor:'red'
    },
    Pagination:{
        position: 'absolute',
        right: 20,
        bottom: 10,
        width: 53,
        height: 18,
        backgroundColor: 'rgba(0,0,0,.6)',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 9
    }

});
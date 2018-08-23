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
    FlatList,
    ImageBackground
} from 'react-native';

import Icon from "react-native-vector-icons/Ionicons"
import EvilIcons from "react-native-vector-icons/EvilIcons"


class HeaderCont extends React.Component {
    _renderItemView(item){
        return <TouchableOpacity style={styles.headerItem} activeOpacity={0.8} onPress={()=>{
            console.log(item.item.id)
            this.props.goClassify(item.index,item.item.name,item.item.id);
        }}>
            <ImageBackground source={{uri:item.item.icon}} style={styles.headerItemImage}>
                {/*<Text style={{color:'#fff'}}>{item.item.name}</Text>*/}
            </ImageBackground>
        </TouchableOpacity>
    }


    render() {
        return (
            <FlatList
                style={{marginTop:27/2}}
                horizontal={true}
                keyExtractor={(item,index) => index.toString()}
                data={this.props.listData}
                renderItem={this._renderItemView.bind(this)}
                onEndReachedThreshold={1}
                numColumns={1}
            />
        );
    }
}


//本地资讯item
export default class BBSHeader extends Component {


    render() {
        const {data,goClassify} = this.props;
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>主题分类</Text>
                    <HeaderCont listData={data} goClassify={goClassify}/>
                </View>

                <View style={styles.hot}>
                    <Text style={styles.title}>热门评论</Text>
                </View>
            </View>
        );
    }
}

const ScreenWidht = Dimensions.get('window').width;
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingVertical: 24 / 2,
        backgroundColor: '#fff'
    },
    headerItem:{
        marginLeft:10,
        width:100,
        height:56,
        borderRadius:5,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#ddd',
        overflow:'hidden'
    },
    headerItemImage:{
        width:'100%',
        height:'100%',
    },
    title: {
        paddingHorizontal:15,
        fontSize: 26 / 2,
        lineHeight: 37 / 2,
    },
    hot:{
        height:44,
        justifyContent:'center',
        backgroundColor:'#f8f8f8'
    }
});
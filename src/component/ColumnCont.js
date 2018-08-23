import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Image,
    TextInput,
    TouchableOpacity,
    ScrollView,
    ImageBackground
} from 'react-native';

import EvilIcons from "react-native-vector-icons/EvilIcons"

const ColumnCont = (props) => {
    const {data,goDetails} = props;
    return (
       <View style={styles.container}>
           <ScrollView
               style={styles.columnList}
               horizontal={true}
               showsHorizontalScrollIndicator={false}
           >
               {
                   data.map((item,index)=>{
                       return (
                           <TouchableOpacity key={index} style={{marginRight:10,overflow:'hidden',borderRadius:4,backgroundColor:'#f8f8f8',width:161}} onPress={()=>{goDetails(item.id)}}>
                               <ImageBackground source={{uri:item.cover}} style={{width:161,height:98,backgroundColor:'#ddd'}}/>
                               <View style={styles.bottom}>
                                   <Text numberOfLines={1} style={{flex:1}}>{item.name}</Text>
                                   <View style={{flexDirection:'row',alignItems:'center',minWidth:50,justifyContent:"flex-end"}}>
                                       <EvilIcons name='eye' size={20} color="#333"/>
                                       <Text style={{fontSize:12}}>{item.visit_num}</Text>
                                   </View>
                               </View>
                           </TouchableOpacity>
                       )
                   })
               }
               <View style={{width:20}}/>
           </ScrollView>
       </View>
    )
};

const styles = StyleSheet.create({
    container:{
      flex:1
    },
    columnList:{
        // flex:1,
        minHeight:142,
        backgroundColor:'#fff',
        paddingHorizontal:15,
    },
    bottom:{
        paddingTop:12,
        paddingBottom:12,
        paddingHorizontal:5,
        flex:1,
        flexDirection:"row",
        alignItems:'center',
        justifyContent:'space-between'
    },
});


export default  ColumnCont;



import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Image,
    TextInput,
    TouchableOpacity
} from 'react-native';
// import Toast from 'react-native-root-toast';
import Toast from '../component/Toast'

class SetNumber extends React.Component {
    render() {
        const {add,reduce,selectNum} = this.props;
        return (
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity
                    style={styles.btn}
                    onPress={()=>{
                        reduce();
                    }}
                >
                    <Text style={{color: '#cbcbcb'}}>-</Text>
                </TouchableOpacity>
                <View style={{
                    paddingHorizontal: 10,
                    height: 25,
                    backgroundColor: '#f5f5f5',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginHorizontal: 3
                }}>
                    <Text style={{color: '#333'}}>{selectNum}</Text>
                </View>
                <TouchableOpacity
                    style={styles.btn}
                    onPress={()=>{
                        add();
                    }}
                >
                    <Text style={{color: '#cbcbcb'}}>+</Text>
                </TouchableOpacity>


            </View>
        );
    }
}

const styles = StyleSheet.create({
    btn: {
        width: 30,
        height: 25,
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default SetNumber;



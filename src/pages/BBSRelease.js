import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    ScrollView,
    TextInput,
    Dimensions,
    Image,
    SafeAreaView,
    StatusBar,
    ImageBackground,
    TouchableOpacity
} from 'react-native';


import Icon from "react-native-vector-icons/Ionicons"
import EvilIcons from "react-native-vector-icons/EvilIcons"
import Toast from "../component/Toast";
import {fetchRequest} from '../utils/FetchUtil'
import {upImage} from '../utils/FetchUtil'
import ImagePicker from "react-native-image-picker";


export default class BBSRelease extends Component {
    static navigationOptions = ({navigation, screenProps}) => {
        return ({
            title: '发帖',
            headerBackImage: () => {
                return <Text style={{color: '#888'}}>取消</Text>
            },
            headerRight: <TouchableOpacity
                onPress={navigation.getParam('submit')}
            >
                <Text style={{color: '#FF5C60'}}>发布</Text>
            </TouchableOpacity>,
            headerStyle: {
                paddingHorizontal: 15,
                backgroundColor: '#FFF',
                elevation: 0,
                borderBottomWidth: 0,
            },
        })
    };

    componentDidMount() {
        this.props.navigation.setParams({submit: this._submit.bind(this)});
        let id = this.props.navigation.state.params.id;
        this.id = id;
    }

    componentWillUnmount() {
        let refirsh=this.props.navigation.getParam('refirsh','');
        if(refirsh){
            refirsh();
        }
    }

    constructor(props) {
        super(props);
        this.id = '';
        this.imgArr = [];
        this.state = {
            title: '',
            cont: '',
            imgList: [1, 2, 3, 4],
            ImgUrl: []
        }
    }

    /**
     * 选择图片
     */
    choosePicker = () => {

        ImagePicker.showImagePicker(photoOptions, (response) => {
            console.log('Response = ', response);


            if (response.didCancel) {
                console.log('User cancelled image picker');
            }
            else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            }
            else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            }
            else {
                // let source = { uri: response.uri };
                // // You can also display the image using data:
                // // let source = { uri: 'data:image/jpeg;base64,' + response.data };
                // this.setState({
                //     avatarSource: source
                // });
                this.imgArr.push(response.uri);
                this.setState({
                    show: true,
                    ImgUrl: this.imgArr
                });
                // console.log(arr);
            }
        });
    };


    /**
     *@desc发布
     */
    _submit() {
        // alert(this.state.title)
        const {title, cont, ImgUrl} = this.state;
        if (title, cont) {

            // let params={
            //     category_id:this.id,
            //     title:title,
            //     content:cont
            // };
            // fetchRequest('forum/content/create','POST',params).then((res)=>{
            //     console.log(res);
            //     if(res.code===1){
            //         this.refs.toast.show(res.message,3000);
            //     }
            // }).catch((err)=>{
            //     console.log(err);
            //     //请求失败
            //     this.setState({
            //         error: true,
            //         errorInfo:''
            //     });
            // })

            let formData = new FormData();
            let fileArr = [];
            if (ImgUrl.length > 0) {
                for (let i = 0; i < ImgUrl.length; i++) {
                    let uri = ImgUrl[i];
                    let index = uri.lastIndexOf("\/");
                    let name = uri.substring(index + 1, uri.length);
                    let file = {uri: uri, type: 'multipart/form-data', name: name};
                    formData.append('imgs[]', file);
                }
            }
            // formData.append('imgs:[]',fileArr);
            formData.append('content', cont);
            formData.append('title', title);
            formData.append('category_id', this.id);

            console.log(formData);
            upImage('forum/content/create', formData).then((res) => {
                console.log(res)
                if (res.code === 1) {
                    this.refs.toast.show(res.message, 3000);
                }
                setTimeout(() => {
                    this.props.navigation.goBack();
                }, 1000)
            }).catch((err) => {
                console.log(err)
            })
        } else {
            this.refs.toast.show('填写信息完整', 3000);
        }
    };

    render() {
        return (
            <SafeAreaView style={styles.container}>
                {/*标题*/}
                <View style={styles.title}>
                    <TextInput
                        placeholder='标题'
                        placeholderTextColor='#999999'
                        underlineColorAndroid='transparent' //设置下划线背景色透明 达到去掉下划线的效果
                        onChangeText={(text) => {
                            this.setState({
                                title: text
                            })
                        }}
                    />
                </View>

                {/*内容*/}
                <View style={styles.cont}>
                    <TextInput
                        style={styles.contInput}
                        multiline={true}
                        placeholder='填写内容'
                        placeholderTextColor='#999999'
                        underlineColorAndroid='transparent' //设置下划线背景色透明 达到去掉下划线的效果
                        onChangeText={(text) => {
                            this.setState({
                                cont: text
                            })
                        }}
                    />


                    <View style={styles.imgList}>
                        {
                            this.state.ImgUrl.map((item, index) => {
                                return (
                                    <ImageBackground key={index} source={{uri: item}}
                                                     style={[styles.addImg, (index + 1) % 3 === 0 ? '' : {marginRight: 5,}]}>
                                        <TouchableOpacity style={styles.imgClose} onPress={() => {
                                            // alert(1);
                                            this.imgArr.splice(index, 1);
                                            this.setState({
                                                ImgUrl: this.imgArr
                                            })
                                        }}>
                                            <Text>X</Text>
                                        </TouchableOpacity>
                                    </ImageBackground>
                                )
                            })
                        }
                        {
                            this.state.ImgUrl.length < 3 && <TouchableOpacity style={styles.addImg} onPress={() => {
                                this.choosePicker()
                            }}>
                                <Text style={{fontSize: 40, color: '#bbb'}}>+</Text>
                            </TouchableOpacity>
                        }
                    </View>
                </View>
                <Toast ref="toast"/>
            </SafeAreaView>
        )
    }
}


const arr = [];
const photoOptions = {
    title: '请选择',
    quality: 0.8,
    cancelButtonTitle: '取消',
    takePhotoButtonTitle: '拍照',
    chooseFromLibraryButtonTitle: '选择相册',
    allowsEditing: true,
    noData: false,
    storageOptions: {
        skipBackup: true,
        path: 'images'
    }
};
const {height, width} = Dimensions.get('window');
const imgWidht = (width - 30 - 10) / 3;
const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 15,
        flex: 1,
        backgroundColor: '#fff'
    },
    title: {
        height: 78 / 2,
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderColor: '#eee'
    },
    contInput: {
        height: 100,
        borderBottomWidth: 1,
        borderColor: '#eee'
    },

    imgList: {
        marginTop: 10,
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    addImg: {
        position: 'relative',
        marginBottom: 5,
        width: imgWidht,
        height: imgWidht,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#eee'
    },

    imgClose: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: '#ddd',
        width: 15,
        height: 15,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50
    }

});

import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Image,
    WebView,Dimensions
} from 'react-native';

import EvilIcons from "react-native-vector-icons/EvilIcons"

export default class WebCont extends Component {
    constructor(props) {
        super(props);
        // this.content = "<p>测试</p><p>测试</p><p>  内蒙古自治区政府副主席白向群涉嫌严重违纪违法，目前正接受中央纪委国家监委纪律审查和监察调查。</p><p><br></p><p>    白向群简历</p><p>    白向群，男，蒙古族，1962年9月生，辽宁北票人，1984年1月加入中国共产党，1984年7月参加工作，中国人民大学经济学院政治经济学专业毕业，经济学博士学位。</p><p> 1980.09--1984.07 内蒙古民族师范学院物理系物理专业学习</p><p>  1984.07--1986.03 内蒙古自治区赤峰市教育局干部</p><p>  1986.03--1993.02 内蒙古自治区赤峰市教育局团委书记、党办主任、成人招生办公室主任、秘书科科长（其间：1988.05--1989.10挂职任内蒙古自治区巴林右旗羊场乡党委副书记）</p><p> 1993.02--1994.06 共青团内蒙古自治区赤峰市委副书记</p><p>    1994.06--1996.08 共青团内蒙古自治区赤峰市委书记</p><p> 1996.08--2000.09 共青团内蒙古自治区委副书记、党组成员（其间：1996.12--1998.11中国社会科学院研究生院经济系市场经济专业在职研究生学习）</p><p>  2000.09--2003.03 共青团内蒙古自治区委书记、党组书记</p><p>   2003.03--2008.02 内蒙古自治区乌海市委副书记、市长（其间：2003.09--2006.07中国人民大学经济学院政治经济学专业在职研究生学习，获经济学博士学位；2006.05--2007.04挂职任三峡总公司长江三峡旅游发展有限责任公司副总经理）</p><p>   2008.02--2011.02 内蒙古自治区乌海市委书记</p><p>    2011.02--2012.05 内蒙古自治区锡林郭勒盟盟委书记</p><p> 2012.05--2013.02 内蒙古自治区副主席、党组成员</p><p>  2013.02--&nbsp;内蒙古自治区副主席、党组成员</p><p>附件4+图片</p>"
        this.content = this.props.content;
        this.BaseScript =
            `
            (function () {
                var height;
                function changeHeight() {
                  if (document.body.scrollHeight != height) {
                    height = document.body.scrollHeight;
                    if (window.postMessage) {
                      window.postMessage(JSON.stringify({
                        type: 'setHeight',
                        height: height,
                      }))
                    }
                  }
                }
                setInterval(changeHeight, 100);
            } ())
            `;
        this.state={
            height: 500
        }
    }


    onMessage (event) {
        console.log(event.nativeEvent.data);

        console.log(JSON.parse(event.nativeEvent.data))
        try {
            const action = JSON.parse(event.nativeEvent.data)
            if (action.type === 'setHeight' && action.height > 0) {
                this.setState({ height: action.height })
                // alert(action.height);
            }
        } catch (error) {
            // pass
            // alert('action.height');
        }
    }

    render() {
        return (
            <WebView
                style={{
                    width: SCREEN_WIDTH,
                    height: this.state.height
                }}
                injectedJavaScript={this.BaseScript}
                scalesPageToFit={true}
                javaScriptEnabled={true}
                decelerationRate='normal'
                startInLoadingState={true}
                source={{html: `<!DOCTYPE html> <html><head><meta charset="utf-8"><style>img{width:100%;height:auto;display: block;margin: 0 auto;}</style></head><body>${this.content}</body></html>`,
                    baseUrl: ''}}
                bounces={false}
                scrollEnabled={false}
                automaticallyAdjustContentInsets={true}
                contentInset={{top: 0, left: 0}}
                onMessage={this.onMessage.bind(this)}
            >
            </WebView>
        )
    }
}
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    columnList: {
        // flex:1,
        minHeight: 142,
        backgroundColor: '#fff',
        paddingHorizontal: 15,
    },
    bottom: {
        paddingTop: 12,
        paddingBottom: 12,
        paddingHorizontal: 5,
        flex: 1,
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: 'space-between'
    },
});



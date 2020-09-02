import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Container, Content, Item, Input, Text } from 'native-base';
import { normalize, fonts, margin } from '../../assets/styles';
import {Actions} from 'react-native-router-flux';
import Colors from '../../constants/Colors';
import { RegularText, BoldText } from '../../components/StyledText';
TouchableOpacity.defaultProps = { activeOpacity: 0.8 };

export default class ReportTrouble extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            
        };
    }
    componentDidMount(){
    }
    nextScreen(){
        
    }
    render(){
        return (
            <Container>
                <Content contentContainerStyle={[styles.contentBg , styles.contentPD, {
                    flexGrow: 1,
                    flexDirection: 'column',
                    justifyContent: 'center'
                }]}>
                    
                    <View style={{flex: 1}}>
                        <View style={{flex: 1, justifyContent: 'flex-end'}}>
                            <RegularText style={[fonts.size32, margin.mb4]}>コードが見つからない場合</RegularText>
                            <RegularText>メールが見つからない場合は、迷惑メールのフォルダを確認するか、メールを再送信してください。{'\n'}問題が解消されない場合はサポートにお問い合わせください。</RegularText>
                        </View>
                        <View style={{flex: 1, justifyContent: 'flex-end'}}>
                            <View style={{justifyContent: 'center', alignItems: 'center', width: '100%', marginBottom: 15}}>
                                <TouchableOpacity onPress={() => Actions.pop()} style={{borderRadius: 12, width: '100%',backgroundColor: 'white', borderColor: Colors.mainColor, borderWidth: 1 }}>
                                    <RegularText style={[styles.btnText , fonts.size15, {color:Colors.mainColor}]}>キャンセル</RegularText>
                                </TouchableOpacity>
                            </View>
                            <View style={{justifyContent: 'center', alignItems: 'center', width: '100%', marginBottom: 15 }}>
                                <TouchableOpacity onPress={() => Actions.pop()} style={{borderRadius: 12, width: '100%',backgroundColor: Colors.mainColor }}>
                                    <RegularText style={[styles.btnText , fonts.size15]}>メールを再送する</RegularText>
                                </TouchableOpacity>
                            </View>
                            <View style={{justifyContent: 'center', alignItems: 'center', width: '100%', marginBottom: 15 }}>
                                <TouchableOpacity onPress={() => this.nextScreen()} style={{borderRadius: 12, width: '100%',backgroundColor: '#CE082E' }}>
                                    <RegularText style={[styles.btnText , fonts.size15]}>サポートに問い合わせる</RegularText>
                                </TouchableOpacity>
                            </View>
                        </View>     
                    </View>
                </Content>
            </Container>
        );
    }
}
ReportTrouble.navigationOptions = {
    header: null
}
const styles = StyleSheet.create({
    contentBg: {
        flex: 1
    },
    contentPD: {
        paddingHorizontal: normalize(20),
    },
    btnText: {
        padding: 18,
        width: "100%",
        color: '#fff',
        textAlign: 'center',
    },
    error: {
        borderColor: '#CE082E',
        borderBottomWidth: 1,
        borderTopWidth: 1,
        borderLeftWidth: 1,
        borderRightWidth: 1,
    },
    goDliever: {
        flexDirection: 'row', 
        alignItems: 'center', 
        marginTop: normalize(15), 
        width: '100%'
    },
    error: {
        borderColor: '#CE082E',
        borderBottomWidth: 1,
        borderTopWidth: 1,
        borderLeftWidth: 1,
        borderRightWidth: 1,
    }
});

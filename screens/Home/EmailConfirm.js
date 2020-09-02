import React from 'react';
import { StyleSheet, TouchableWithoutFeedback, Keyboard, Image, View, TouchableOpacity, KeyboardAvoidingView,Alert } from 'react-native';
import { Container, Content, Item, Input, Text } from 'native-base';
import { normalize, fonts, margin, form} from '../../assets/styles';
import {Actions} from 'react-native-router-flux';
import Spinner_bar from 'react-native-loading-spinner-overlay';
import Colors from '../../constants/Colors';
import { FontAwesome5 } from '@expo/vector-icons'; 
import CodeInput from 'react-native-confirmation-code-input';
import { RegularText, BoldText } from '../../components/StyledText';
TouchableOpacity.defaultProps = { activeOpacity: 0.8 };

export default class EmailConfirm extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            phone: '',
            code: '',
            phoneError: false,
            codeError: false,
            loaded: true,
            codeCnt: [6],
            phoneCode: ""
        };
    }
    componentDidMount(){
    }

    confirmCode(){
        Actions.push("accountinfo");
    }
    resendCode(){
        Actions.push("resendcode", {phone: this.state.phone})
    }
    _onFinishCheckingCode1(valid){
        Alert.alert(
            '認証されました',
            '', // <- this part is optional, you can pass an empty string
            [
              {text: 'OK', onPress: () => Actions.popTo("editaccount")},
            ],
            {cancelable: false},
        );
    }
    render(){
        return (
            <Container>
                <Content contentContainerStyle={[styles.contentBg , styles.contentPD, {
                    flexGrow: 1,
                    flexDirection: 'column',
                    justifyContent: 'center'
                }]}>
                    <KeyboardAvoidingView behavior={"padding"} style={{flex: 1}} keyboardVerticalOffset={20}>
                        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                            <View style={{flex: 1}}>
                                <View style={{flex: 1, justifyContent: 'center'}}>
                                    <RegularText style={fonts.size32}>確認コードを入力</RegularText>
                                    <RegularText>{this.props.email}に届いた4桁のコードを入力してください</RegularText>
                                    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                        <CodeInput
                                            ref="codeInputRef2"
                                            keyboardType="numeric"
                                            activeColor='black'
                                            autoFocus={true}
                                            ignoreCase={true}
                                            inputPosition='center'
                                            codeLength={4}
                                            onFulfill={(isValid) => this._onFinishCheckingCode1(isValid)}
                                            containerStyle={{marginBottom: 20}}
                                            codeInputStyle={[fonts.size20, styles.codeInput]}
                                        />
                                    </View>
                                    <TouchableOpacity style={styles.goDliever} onPress={() => Actions.push("reporttrouble")}>
                                        <FontAwesome5 name="chevron-circle-right" size={24} color={Colors.mainColor} />
                                        <BoldText style={styles.noRegister}>トラブルを報告する</BoldText>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </KeyboardAvoidingView>
                </Content>
                
                <Spinner_bar color={'#27cccd'} visible={!this.state.loaded} textContent={""} overlayColor={"rgba(0, 0, 0, 0.5)"} />
            </Container>
        );
    }
}
EmailConfirm.navigationOptions = {
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
        marginTop: 40
    },
    noRegister:{
        color: Colors.mainColor, 
        marginLeft: 5
    },
    codeInput:{
        borderWidth: 0, 
        backgroundColor: '#F2F2F2',
        borderRadius: 10,
        width: '15%', 
        height: 60
    },
    btnSection: {
        justifyContent: 'center', 
        alignItems: 'center', 
        width: '100%', 
        bottom: 30
    },
    nextBtn:{
        borderRadius: 12, 
        width: '100%',
        backgroundColor: Colors.mainColor
    }
});

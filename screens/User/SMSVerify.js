import React from 'react';
import { StyleSheet, TouchableWithoutFeedback, Keyboard, Platform, View, TouchableOpacity, KeyboardAvoidingView, SafeAreaView } from 'react-native';
import { Container, Content, Item, Input, Text } from 'native-base';
import { normalize, fonts, margin, form, shared} from '../../assets/styles';
import { verifyCode } from '../../api';
import { showToast } from '../../shared/global';
import { connect } from "react-redux";
import { setUser } from '../../actions';
import {Actions} from 'react-native-router-flux';
import Spinner_bar from 'react-native-loading-spinner-overlay';
import Colors from '../../constants/Colors';
import { Ionicons } from '@expo/vector-icons'; 
import CodeInput from 'react-native-confirmation-code-input';
import { RegularText, BoldText } from '../../components/StyledText';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Constants from 'expo-constants';
TouchableOpacity.defaultProps = { activeOpacity: 0.8 };

class SMSVerify extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            phoneCode: '',
            codeError: false,
            loaded: true,
        };
    }
    componentDidMount(){
    }

    confirmCode(){
        if(this.state.phoneCode && this.state.phoneCode.length == 6){
            this.setState({codeError: false})
            this.verifyCode(this.props.phone, this.state.phoneCode)
        }else{
            this.setState({codeError: true})
        }
    }
    resendCode(){
        Actions.push("resendcode", {phone: this.props.phone})
    }
    _onFinishCheckingCode(valid){
        if(valid){
            this.setState({codeError: false})
            this.setState({phoneCode: valid})
            this.verifyCode(this.props.phone, valid)
        }
    }
    async verifyCode(phone, code){
        this.setState({loaded: false})
        await verifyCode(phone, code)
        .then(async (response) => {
            this.setState({loaded: true});
            console.log(response)
            if(response.status == 1){
                Actions.push("accountinfo", {phone: phone});
            } else{
                showToast(response.message)
            }
        })
        .catch((error) => {
            this.setState({loaded: true});
            showToast();
        });
    }
    render(){
        return (
            <Container>
                <SafeAreaView style={[styles.contentBg]}>
                    <KeyboardAwareScrollView
                        resetScrollToCoords={{ x: 0, y: 0 }}
                        scrollEnabled={true}
                    >
                            <View style={[shared.container, {paddingHorizontal: normalize(20)}]}>
                                <View style={{flex: 3, justifyContent: 'center'}}>
                                    <BoldText style={fonts.size32}>確認コードを入力</BoldText>
                                    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                        <CodeInput
                                            ref="codeInputRef2"
                                            keyboardType="numeric"
                                            activeColor='black'
                                            autoFocus={true}
                                            ignoreCase={true}
                                            inputPosition='center'
                                            codeLength={6}
                                            onFulfill={(isValid, code) => this._onFinishCheckingCode(isValid, code)}
                                            codeInputStyle={this.state.codeError ? [fonts.size20, styles.codeInput, styles.error] : [fonts.size20, styles.codeInput]}
                                        />
                                    </View>
                                    <TouchableOpacity style={styles.goDliever} onPress={() => this.resendCode()}>
                                        <Ionicons name="ios-arrow-dropright-circle" size={24} color={Colors.secColor} />
                                        <BoldText style={[styles.noRegister, fonts.size14]}>コードが届かない場合はこちら</BoldText>
                                    </TouchableOpacity>
                                </View>
                                <View style={{flex: 1, justifyContent: 'flex-end'}}>
                                    <View style={styles.btnSection}>
                                        <TouchableOpacity onPress={() => this.confirmCode()} style={styles.nextBtn}>
                                            <BoldText style={[styles.btnText , fonts.size16]}>次へ </BoldText>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                    </KeyboardAwareScrollView>
                </SafeAreaView>
                
                <Spinner_bar color={'#27cccd'} visible={!this.state.loaded} textContent={""} overlayColor={"rgba(0, 0, 0, 0.5)"} />
            </Container>
        );
    }
}
const mapDispatchToProps = dispatch => {
    return {
        setUser : user => { dispatch(setUser(user)) }
    }
}

export default connect(null,mapDispatchToProps)(SMSVerify)

const styles = StyleSheet.create({
    contentBg: {
        flex: 1
    },
    contentPD: {
        paddingHorizontal: normalize(20),
    },
    btnText: {
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
        marginTop: 40, 
        width: '100%'
    },
    noRegister:{
        color: Colors.secColor, 
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
        backgroundColor: Colors.mainColor,
        paddingVertical: Platform.OS == 'ios' ? 17 : 12
    }
});

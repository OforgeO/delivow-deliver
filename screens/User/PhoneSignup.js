import React from 'react';
import { StyleSheet, View, TouchableOpacity, SafeAreaView, Platform, Alert } from 'react-native';
import { Container, Content, Item, Input, Text } from 'native-base';
import { normalize, fonts, margin, form, shared} from '../../assets/styles';
import { showToast } from '../../shared/global';
import { connect } from "react-redux";
import { setUser } from '../../actions';
import {Actions} from 'react-native-router-flux';
import Spinner_bar from 'react-native-loading-spinner-overlay';
import Colors from '../../constants/Colors';
import { registerSms, updatePhone, registerWithCustomer } from '../../api';
import { RegularText, BoldText } from '../../components/StyledText';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Constants from 'expo-constants';
import store from '../../store/configuteStore';
import OrderConfirm from '../../components/OrderConfirm';

TouchableOpacity.defaultProps = { activeOpacity: 0.8 };

class PhoneSignup extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            phone: '',
            phoneError: false,
            loaded: true
        };
    }
    componentDidMount(){
    }

    async sendCode(){
        if(this.state.phone == ''){
            this.setState({phoneError: true})
        }
        if(this.state.phone != ''){
            this.setState({phoneError: false})
            this.setState({loaded: false})
            if(this.props.type == 'update_phone') {
                await updatePhone(this.state.phone)
                .then(async (response) => {
                    this.setState({loaded: true});
                    if(response.status == 1){
                        let info = store.getState().user
                        info.phone = this.state.phone
                        this.props.setUser(info)

                        Actions.pop()
                        setTimeout(function() {
                            Actions.refresh();
                        }, 10)
                    } else{
                        showToast(response.message)
                    }
                })
                .catch((error) => {
                    this.setState({loaded: true});
                    showToast();
                });
            } else {
                await registerSms(this.state.phone)
                .then(async (response) => {
                    this.setState({loaded: true});
                    if(response.code == 400){
                        showToast(response.errors[0]['messages'][0])
                        return;
                    }else{
                        if(response.status == 1){
                            showToast(response.message, 'success')
                            Actions.push("smsverify", {phone: this.state.phone})
                        } else if(response.status == 2) {
                            var _self = this;
                            setTimeout(function() {
                                Alert.alert("この番号は、お客様アカウントとして登録済みです。\nアカウント情報をデリバー情報として登録しますか？", "氏名・生年月日・メールアドレス・パスワードの入力を省略できます。", 
                                    [
                                        {
                                            text: 'やめておく',
                                            onPress: () => Actions.pop()
                                        },
                                        {
                                            text: "登録する", onPress: () => {
                                                _self.registerWithCustomer(_self.state.phone)
                                            }
                                        }
                                    ],
                                    { cancelable: false }
                                );
                            }, 300);
                        } else{
                            showToast(response.message)
                        }
                    }
                })
                .catch((error) => {
                    this.setState({loaded: true});
                    showToast();
                });
            }
            
        }
    }
    async registerWithCustomer(phone) {
        this.setState({loaded: false});
        await registerWithCustomer(phone)
        .then(async (response) => {
            this.setState({loaded: true});
            Actions.push("avatarregister", {phone: phone})
        })
        .catch((error) => {
            this.setState({loaded: true});
            showToast();
        });
    }
    render(){
        return (
            <Container>
                {
                    this.props.type == 'update_phone' ?
                    <OrderConfirm />
                    :
                    null
                }
                
                <SafeAreaView style={[styles.contentBg]}>
                    <KeyboardAwareScrollView
                        resetScrollToCoords={{ x: 0, y: 0 }}
                        scrollEnabled={true}
                    >
                        <View style={[shared.container, {paddingHorizontal: normalize(20)}]}>
                            <View style={{flex: 1, justifyContent: 'flex-end'}}>
                                <BoldText style={[fonts.size32]}>携帯番号を入力</BoldText>
                                {
                                    this.props.type == "update_phone" ?
                                    null
                                    :
                                    <RegularText style={[fonts.size16, {paddingTop: 0}]}>SMSで認証コードが届きます</RegularText>
                                }
                                
                                <Item rounded style={ this.state.phoneError ?[form.item, styles.error , {position: 'relative', marginTop: 15}] : [form.item , {position: 'relative', marginTop: 15}] }>
                                    <Input
                                        placeholder = "携帯番号を入力…"
                                        value = { this.state.phone }
                                        style = { [form.input] }
                                        keyboardType="phone-pad"
                                        onChangeText = {(text) => this.setState({phone: text})}
                                        placeholderTextColor = '#9da8bf'
                                        onSubmitEditing={() => this.sendCode()}
                                    />
                                </Item>
                            </View>
                            <View style={{flex: 1, justifyContent: 'flex-end'}}>
                                <View style={{justifyContent: 'center', alignItems: 'center', width: '100%', bottom: 40}}>
                                    <TouchableOpacity onPress={() => this.sendCode()} style={{borderRadius: 12, width: '100%',backgroundColor: Colors.mainColor, paddingVertical: Platform.OS == 'ios' ? 17 : 12 }}>
                                        <BoldText style={[styles.btnText , fonts.size16]}>次へ</BoldText>
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

export default connect(null,mapDispatchToProps)(PhoneSignup)

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
    }
});
 
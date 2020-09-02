import React from 'react';
import { StyleSheet, View, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { Container, Content, Item, Input, Text } from 'native-base';
import { normalize, fonts, margin, form, shared} from '../../assets/styles';
import { showToast } from '../../shared/global';
import { connect } from "react-redux";
import { setUser } from '../../actions';
import {Actions} from 'react-native-router-flux';
import Spinner_bar from 'react-native-loading-spinner-overlay';
import Colors from '../../constants/Colors';
import { registerSms } from '../../api';
import { RegularText, BoldText } from '../../components/StyledText';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Constants from 'expo-constants';
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
            await registerSms(this.state.phone)
                .then(async (response) => {
                this.setState({loaded: true});
                console.log(response)
                if(response.code == 400){
                    showToast(response.errors[0]['messages'][0])
                    return;
                }else{
                    if(response.status == 1){
                        showToast(response.message, 'success')
                        Actions.push("smsverify", {phone: this.state.phone})
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
    render(){
        return (
            <Container>
                <SafeAreaView style={[styles.contentBg]}>
                    <KeyboardAwareScrollView
                        resetScrollToCoords={{ x: 0, y: 0 }}
                        scrollEnabled={true}
                    >
                        <View style={[shared.container, {paddingHorizontal: normalize(20)}]}>
                            <View style={{flex: 1, justifyContent: 'flex-end'}}>
                                <BoldText style={[fonts.size32]}>携帯番号を入力</BoldText>
                                <RegularText style={[fonts.size16, {paddingTop: 0}]}>SMSで認証コードが届きます</RegularText>
                                
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
 
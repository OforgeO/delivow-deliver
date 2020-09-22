import React from 'react';
import { StyleSheet, SafeAreaView, View, TouchableOpacity, Platform } from 'react-native';
import { Container, Content, Item, Input, Text } from 'native-base';
import { normalize, fonts, margin, form, shared} from '../../assets/styles';
import { login } from '../../api';
import { showToast } from '../../shared/global';
import { connect } from "react-redux";
import { setUser } from '../../actions';
import {Actions} from 'react-native-router-flux';
import Spinner_bar from 'react-native-loading-spinner-overlay';
import Colors from '../../constants/Colors';
import { FontAwesome } from '@expo/vector-icons'; 
import { RegularText, BoldText } from '../../components/StyledText';
import * as SecureStore from 'expo-secure-store';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import * as Notifications from 'expo-notifications';
TouchableOpacity.defaultProps = { activeOpacity: 0.8 };

class PhoneLogin extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            phone: '',
            password: '',
            phoneError: false,
            passwordError: false,
            loaded: true,
            token: ''
        };
    }
    async componentDidMount(){
        await this.registerForPushNotificationsAsync();
    }

    registerForPushNotificationsAsync = async () => {
        const { status: existingStatus } = await Permissions.getAsync(
          Permissions.NOTIFICATIONS
        );
        let finalStatus = existingStatus;
        
        if (existingStatus !== 'granted') {
          const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
          finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            
          return;
        }
        try {
          let token = await Notifications.getExpoPushTokenAsync({development : true, experienceId: '@johnpatch/delivow-deliver'});
          this.setState({token : token.data})
        } catch (error) {
          this.setState({token : ''})
        }
    };

    async login(){
        let valid = true
        if(this.state.phone == ''){
            this.setState({phoneError: true})
            valid = false
        } else{
            this.setState({phoneError: false})
        }
        if(this.state.password == ''){
            this.setState({passwordError: true})
            valid = false
        } else{
            this.setState({passwordError: false})
        }
        if(valid){
            this.setState({phoneError: false})
            this.setState({passwordError: false})
            await this.registerForPushNotificationsAsync();
            this.setState({loaded: false})
            await login(this.state.phone, this.state.password, this.state.token)
            .then(async (response) => {
                this.setState({loaded: true});
                if(response.status == 1){
                    await SecureStore.setItemAsync("token", response.accessToken)
                    this.props.setUser({
                        area: response.user.area,
                        birthday: response.user.birthday,
                        email: response.user.email,
                        first_name: response.user.first_name,
                        last_name: response.user.last_name,
                        phone: response.user.phone,
                        photo: response.user.photo,
                        uid: response.user.uid,
                        shift_hours: response.user.shift_hours,
                        shift_weekdays: response.user.shift_weekdays
                    })
                    Actions.reset("root");
                } else{
                    showToast(response.message)
                }
            })
            .catch((error) => {
                this.setState({loaded: true});
                showToast();
            });
        }
    }
    goForgot() {
        Actions.push("forgotemailinput")
    }
    
    render(){
        return (
            <Container>
                <SafeAreaView style={[styles.contentBg]}>
                    <KeyboardAwareScrollView
                        resetScrollToCoords={{ x: 0, y: 0 }}
                        scrollEnabled={true}
                        style={{marginTop: Platform.OS == 'ios' ? 0 : Constants.statusBarHeight}}
                    >
                            <View style={[shared.container, {paddingHorizontal: normalize(20)}]}>
                                <View style={{flex: 2, justifyContent: 'center'}}>
                                    <BoldText style={fonts.size32}>ログイン</BoldText>
                                    <Item rounded style={this.state.phoneError ? [form.item, styles.error ] : [form.item] }>
                                        <Input
                                            placeholder = "携帯電話番号を入力…"
                                            value = { this.state.phone }
                                            style = { [form.input] }
                                            keyboardType="phone-pad"
                                            onChangeText = {(text) => this.setState({phone: text})}
                                            placeholderTextColor = '#9da8bf'
                                            onSubmitEditing={() => this.password._root.focus()}
                                        />
                                    </Item>
                                    <Item rounded style={ this.state.passwordError ?  [form.item, styles.error ] : [form.item] }>
                                        <Input
                                            placeholder = "パスワードを入力…"
                                            value = { this.state.password }
                                            style = { [form.input] }
                                            secureTextEntry
                                            onChangeText = {(text) => this.setState({password: text})}
                                            placeholderTextColor = '#9da8bf'
                                            returnKeyType="go"
                                            ref={input => {this.password = input;}}
                                            onSubmitEditing={() => this.login()}
                                        />
                                    </Item>
                                    <TouchableOpacity style={styles.goDliever} onPress={() => this.goForgot()}>
                                        <FontAwesome name="chevron-circle-right" size={24} color={Colors.secColor} />
                                        <BoldText style={[fonts.size14,{color: Colors.secColor, marginLeft: 5}]}>パスワードを忘れました</BoldText>
                                    </TouchableOpacity>
                                </View>
                                <View style={{flex: 1, justifyContent: 'flex-end'}}>
                                    <View style={{justifyContent: 'center', alignItems: 'center', width: '100%', bottom: 40,}}>
                                        <TouchableOpacity onPress={() => this.login()} style={{borderRadius: 12, width: '100%',backgroundColor: Colors.mainColor, borderWidth: 1, borderColor: Colors.mainColor, paddingVertical: Platform.OS == 'ios' ? 17 : 12 }}>
                                            <BoldText style={[styles.btnText , fonts.size16]}>ログイン</BoldText>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{justifyContent: 'center', alignItems: 'center', width: '100%', bottom: 30,}}>
                                        <TouchableOpacity onPress={() => Actions.push("phonesignup")} style={{borderRadius: 12, width: '100%',backgroundColor: 'white', borderWidth: 1, borderColor: Colors.mainColor, paddingVertical: Platform.OS == 'ios' ? 17 : 12 }}>
                                            <BoldText style={[styles.btnText , fonts.size16, {color: Colors.mainColor}]}>新規登録</BoldText>
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

export default connect(null,mapDispatchToProps)(PhoneLogin)

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
        marginLeft: 3,
        width: '100%',
        marginTop: 10,
    }
});

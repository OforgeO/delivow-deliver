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
import { MaterialIcons } from '@expo/vector-icons';
import { RegularText, BoldText } from '../../components/StyledText';
import { resetPassword } from '../../api';
import Constants from 'expo-constants'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
TouchableOpacity.defaultProps = { activeOpacity: 0.8 };

class ForgotPwd extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            password: '',
            passwordConfirm: '',
            passwordError: false,
            loaded: true
        };
    }
    componentDidMount(){
    }

    async changePassword(){
        let validate = true;
        var pwd_letters = /^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/;
        
        if(this.state.password == '' || this.state.password != this.state.passwordConfirm || this.state.password.length < 8 || !this.state.password.match(pwd_letters)){
            this.setState({passwordError: true})
            validate = false;
        } else{
            this.setState({passwordError: false})
            this.setState({loaded: false})
            await resetPassword('3KzVq8LzSWeeVKdkJssM9iqyg4WtAegMAGdvSRw+', this.state.password)
            .then(async (response) => {
                this.setState({loaded: true});
                if(response.status == 1){
                    Actions.reset("login")
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
                                    <BoldText style={[fonts.size32, {paddingTop: 40}]}>新しいパスワード</BoldText>
                                    <RegularText style={{marginBottom: 20, marginTop: 10}}>※半角英語と半角数字の組み合わせ、8文字以上</RegularText>
                                    
                                    <Item rounded style={ this.state.passwordError ? [form.item, styles.error, {marginBottom: 0}] : [form.item, {marginBottom: 0}] }>
                                        <Input
                                            placeholder = "パスワードを入力"
                                            value = { this.state.password }
                                            style = {[form.input, fonts.size20, {lineHeight: normalize(23)}]}
                                            secureTextEntry
                                            clearTextOnFocus
                                            onChangeText = {(text) => this.setState({password: text})}
                                            placeholderTextColor = '#9da8bf'
                                            onSubmitEditing={() => this.passwordConfirm._root.focus()}
                                        />
                                    </Item>
                                    <Item rounded style={ this.state.passwordError ? [form.item, styles.error, {marginTop: normalize(12)}] : [form.item, {marginTop: normalize(12)}] }>
                                        <Input
                                            placeholder = "確認用パスワードを入力"
                                            clearTextOnFocus
                                            value = { this.state.passwordConfirm }
                                            style = {[form.input, fonts.size20, {lineHeight: normalize(23)}]}
                                            secureTextEntry
                                            onChangeText = {(text) => this.setState({passwordConfirm: text})}
                                            placeholderTextColor = '#9da8bf'
                                            returnKeyType="go"
                                            ref={input => {this.passwordConfirm = input;}}
                                            onSubmitEditing={() => this.changePassword()}
                                        />
                                    </Item>
                                    {
                                        this.state.passwordError ?
                                        <View style={{flexDirection: 'row', marginTop: 4}}>
                                            <MaterialIcons name="error" size={16} color='#CE082E' />
                                            <RegularText style={{color:'#CE082E'}}>パスワードが一致しません</RegularText>
                                        </View>
                                        :
                                        null
                                    }
                                    
                                </View>
                                <View style={{flex: 1, justifyContent: 'flex-end'}}>
                                    <View style={{justifyContent: 'center', alignItems: 'center', width: '100%', bottom: 30}}>
                                        <TouchableOpacity onPress={() => this.changePassword()} style={{borderRadius: 12, width: '100%',backgroundColor: Colors.mainColor, paddingVertical: Platform.OS == 'ios' ? 17 : 12 }}>
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

export default connect(null,mapDispatchToProps)(ForgotPwd)

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
    label: {
        marginBottom: 5,
        marginTop: 10
    }
});

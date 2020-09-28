import React from 'react';
import { StyleSheet, TouchableWithoutFeedback, Keyboard, Image, View, TouchableOpacity, KeyboardAvoidingView, ScrollView, StatusBar, SafeAreaView, Platform } from 'react-native';
import { Container, Content, Item, Input, Text } from 'native-base';
import { normalize, fonts, margin, form, shared} from '../../assets/styles';
import { _e } from '../../lang';
import { connect } from "react-redux";
import { setUser } from '../../actions';
import {Actions} from 'react-native-router-flux';
import Spinner_bar from 'react-native-loading-spinner-overlay';
import Colors from '../../constants/Colors';
import { MaterialIcons } from '@expo/vector-icons';
import Layout from '../../constants/Layout';
import { RegularText, BoldText } from '../../components/StyledText';
import Constants from 'expo-constants';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
TouchableOpacity.defaultProps = { activeOpacity: 0.8 };

class AccountInfo extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            firstName: '',
            lastName: '',
            birthYear: '',
            birthMonth: '',
            birthDay: '',
            email: '',
            emailConfirm: '',
            emailError: false,
            password: '',
            passwordConfirm: '',
            passwordError: false,
            loaded: true,
            firstNameError: false,
            lastNameError: false,
            address: ''
        };
    }
    componentDidMount(){
    }

    sendCode(){
        let validate = true;
        if(this.state.email == '' || !this.validateEmail(this.state.email) || this.state.email != this.state.emailConfirm){
            this.setState({emailError: true})
            validate = false;
        } else{
            this.setState({emailError: false})
        }
        if(this.state.firstName == ''){
            this.setState({firstNameError: true})
            validate = false;
        } else {
            this.setState({firstNameError: false})
        }
        if(this.state.lastName == ''){
            this.setState({lastNameError: true})
            validate = false;
        } else {
            this.setState({lastNameError: false})
        }
        if(validate){
            Actions.push("passwordregister", {phone: this.props.phone, firstName: this.state.firstName, lastName: this.state.lastName, birthDay: this.state.birthYear+'-'+this.state.birthMonth+'-'+this.state.birthDay, email: this.state.email, address: this.state.address});
        }
    }
    validateEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
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
                            <View style={{flex: 4, justifyContent: 'center'}}>
                                <BoldText style={[fonts.size32]}>アカウント情報を入力</BoldText>
                                <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 15}}>
                                    <View style={{width: '47%'}}>
                                        <RegularText style={styles.label}>姓</RegularText>
                                        <Item rounded style={this.state.firstNameError ? [form.item, styles.error] : [form.item] }>
                                            <Input
                                                placeholder = "姓"
                                                value = { this.state.firstName }
                                                style = { [form.input, fonts.size20, {lineHeight: normalize(23)}] }
                                                onChangeText = {(text) => this.setState({firstName: text})}
                                                placeholderTextColor = '#9da8bf'
                                                multiline={true}
                                                //onSubmitEditing={() => this.lastName._root.focus()}
                                            />
                                        </Item>
                                    </View>
                                    <View style={{width: '47%'}}>
                                        <RegularText style={styles.label}>名</RegularText>
                                        <Item rounded style={this.state.lastNameError ? [form.item, styles.error] : [form.item] }>
                                            <Input
                                                placeholder = "名"
                                                value = { this.state.lastName }
                                                style = { [form.input, fonts.size20, {lineHeight: normalize(23)}] }
                                                onChangeText = {(text) => this.setState({lastName: text})}
                                                placeholderTextColor = '#9da8bf'
                                                ref={input => {this.lastName = input;}}
                                                multiline={true}
                                                //onSubmitEditing={() => this.address._root.focus()}
                                            />
                                        </Item>
                                    </View>
                                </View>
                                <View>
                                    <RegularText style={styles.label}>住所</RegularText>
                                    <Item rounded style={[form.item, {marginBottom: 0}] }>
                                        <Input
                                            placeholder = "住所を入力"
                                            value = { this.state.address }
                                            style = {[form.input, fonts.size20, {lineHeight: normalize(23)}]}
                                            onChangeText = {(text) => this.setState({address: text})}
                                            placeholderTextColor = '#9da8bf'
                                            returnKeyType="next"
                                            multiline={true}
                                            ref={ref => {this.address = ref;}}
                                            onSubmitEditing={() => this.birthYear._root.focus()}
                                        />
                                    </Item>
                                </View>
                                <View style={{marginTop: 15}}>
                                    <RegularText style={styles.label}>生年月日</RegularText>
                                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                        <Item rounded style={ [form.item, {width: 90}] }>
                                            <Input
                                                placeholder = "1996"
                                                placeholderTextColor = '#9da8bf'
                                                keyboardType="number-pad"
                                                value = { this.state.birthYear }
                                                style = { [form.input, fonts.size20, {lineHeight: normalize(23)}] }
                                                returnKeyType="next"
                                                onChangeText = {(text) => {
                                                    if(text.length < 5){
                                                        this.setState({birthYear: text})
                                                        if(text.length == 4)
                                                            this.birthMonth._root.focus()
                                                    } else{
                                                        this.birthMonth._root.focus()
                                                    }
                                                }}
                                                ref={ref => {this.birthYear = ref;}}
                                                onSubmitEditing={() => this.birthMonth._root.focus()}
                                            />
                                        </Item>
                                        <RegularText style={{paddingHorizontal: 5,marginBottom: normalize(12)}}>年</RegularText>
                                        <Item rounded style={ [form.item, {width: 60}] }>
                                            <Input
                                                placeholder = "01"
                                                placeholderTextColor = '#9da8bf'
                                                keyboardType="number-pad"
                                                value = { this.state.birthMonth }
                                                style = { [form.input, fonts.size20, {lineHeight: normalize(23)}] }
                                                returnKeyType="next"
                                                onChangeText = {(text) => {
                                                    if(text.length < 3){
                                                        this.setState({birthMonth: text})
                                                        if(text.length == 2)
                                                            this.birthDay._root.focus()
                                                    } else{
                                                        this.birthDay._root.focus()
                                                    }
                                                }}
                                                ref={ref => {this.birthMonth = ref;}}
                                                onSubmitEditing={() => this.birthDay._root.focus()}
                                            />
                                        </Item>
                                        <RegularText style={{paddingHorizontal: 5,marginBottom: normalize(12)}}>月</RegularText>
                                        <Item rounded style={ [form.item, {width: 60}] }>
                                            <Input
                                                placeholder = "01"
                                                placeholderTextColor = '#9da8bf'
                                                keyboardType="number-pad"
                                                value = { this.state.birthDay }
                                                style = {[form.input, fonts.size20, {lineHeight: normalize(23)}]}
                                                returnKeyType="next"
                                                onChangeText = {(text) => {
                                                    if(text.length < 3){
                                                        this.setState({birthDay: text})
                                                        if(text.length == 2)
                                                            this.email._root.focus()
                                                    } else{
                                                        this.email._root.focus()
                                                    }
                                                }}
                                                ref={ref => {this.birthDay = ref;}}
                                                onSubmitEditing={() => this.email._root.focus()}
                                            />
                                        </Item>
                                        <RegularText style={{paddingHorizontal: 5,marginBottom: normalize(12)}}>日</RegularText>
                                    </View>
                                </View>
                                <View>
                                    <RegularText style={styles.label}>メールアドレス</RegularText>
                                    <Item rounded style={this.state.emailError ? [form.item, styles.error, {marginBottom: 0}] : [form.item, {marginBottom: 0}] }>
                                        <Input
                                            placeholder = "メールアドレスを入力…"
                                            value = { this.state.email }
                                            style = {[form.input, fonts.size20, {lineHeight: normalize(23)}]}
                                            keyboardType="email-address"
                                            onChangeText = {(text) => this.setState({email: text})}
                                            placeholderTextColor = '#9da8bf'
                                            returnKeyType="next"
                                            ref={ref => {this.email = ref;}}
                                            onSubmitEditing={() => this.emailConfirm._root.focus()}
                                        />
                                    </Item>
                                    <Item rounded style={this.state.emailError ? [form.item, styles.error, {marginTop: normalize(12)}] : [form.item, {marginTop: normalize(12)}] }>
                                        <Input
                                            placeholder = "確認用メールアドレスを入力…"
                                            value = { this.state.emailConfirm }
                                            style = {[form.input, fonts.size20, {lineHeight: normalize(23)}]}
                                            keyboardType="email-address"
                                            onChangeText = {(text) => this.setState({emailConfirm: text})}
                                            placeholderTextColor = '#9da8bf'
                                            returnKeyType="go"
                                            ref={ref => {this.emailConfirm = ref;}}
                                            onSubmitEditing={() => this.sendCode()}
                                        />
                                    </Item>
                                    {
                                        this.state.emailError ?
                                        <View style={{flexDirection: 'row', marginTop: 4}}>
                                            <MaterialIcons name="error" size={16} color='#CE082E' />
                                            <RegularText style={[{color:'#CE082E'}, margin.ml1]}>無効なメールアドレスです</RegularText>
                                        </View>
                                        :
                                        null
                                    }
                                </View>
                            </View>
                            <View style={{justifyContent: 'flex-end', bottom: 30, flex: 1}}>
                                <TouchableOpacity onPress={() => this.sendCode()} style={{borderRadius: 12, width: '100%',backgroundColor: Colors.mainColor, paddingVertical: Platform.OS == 'ios' ? 17 : 12 }}>
                                    <BoldText style={[styles.btnText , fonts.size16]}>次へ</BoldText>
                                </TouchableOpacity>
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

export default connect(null,mapDispatchToProps)(AccountInfo)

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
        paddingLeft: 3,
        paddingBottom: 4
    }
});

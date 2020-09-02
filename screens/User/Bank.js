import React from 'react';
import { StyleSheet, View, TouchableOpacity, SafeAreaView, Platform, ScrollView } from 'react-native';
import { Container, Content, Item, Input, Text } from 'native-base';
import { normalize, fonts, margin, form, shared} from '../../assets/styles';
import { registerBank, getUser, updateBankInfo, resendCode } from '../../api';
import { showToast } from '../../shared/global';
import { _e } from '../../lang';
import { connect } from "react-redux";
import { setUser } from '../../actions';
import {Actions} from 'react-native-router-flux';
import Spinner_bar from 'react-native-loading-spinner-overlay';
import Colors from '../../constants/Colors';
import Constants from 'expo-constants';
import { RegularText, BoldText } from '../../components/StyledText';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
TouchableOpacity.defaultProps = { activeOpacity: 0.8 };

class Bank extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            bankName: '',
            bankCode: '',
            branchCode: '',
            accountNo: '',
            accountName: '',
            accountNameKana: '',
            bankNameError: false,
            bankCodeError: false,
            branchCodeError: false,
            accountNameError: false,
            accountNoError: false,
            accountNameKanaError: false,
            loaded: true
        };
    }
    async componentDidMount(){
        this.setState({ loaded: false })
        await getUser()
        .then(async (response) => {
            if(response.status == 1) {
                this.setState({bankName: response.user.bank_name})
                this.setState({bankCode: response.user.bank_code})
                this.setState({branchCode: response.user.branch_code})
                this.setState({accountNo: response.user.account_number})
                this.setState({accountName: response.user.account_name})
                this.setState({accountNameKana: response.user.account_name_kana})
            } else {
                showToast(response.message)
            }
            this.setState({ loaded: true })
        })
        .catch((error) => {
            this.setState({ loaded: true })
            showToast();
        });
    }

    async nextScreen(){
        let valid = true
        if(this.state.bankName == ''){
            this.setState({bankNameError: true})
            valid = false
        } else {
            this.setState({bankNameError: false})
        }
        if(this.state.bankCode == ''){
            this.setState({bankCodeError: true})
            valid = false
        } else {
            this.setState({bankCodeError: false})
        }
        if(this.state.branchCode == ''){
            this.setState({branchCodeError: true})
            valid = false
        } else {
            this.setState({branchCodeError: false})
        }
        if(this.state.accountNo == ''){
            this.setState({accountNoError: true})
            valid = false
        } else {
            this.setState({accountNoError: false})
        }
        if(this.state.accountName == ''){
            this.setState({accountNameError: true})
            valid = false
        } else {
            this.setState({accountNameError: false})
        }
        if(this.state.accountNameKana == ''){
            this.setState({accountNameKanaError: true})
            valid = false
        } else {
            this.setState({accountNameKanaError: false})
        }
        if(valid){
            this.setState({loaded: false})
            if(this.props.type == 'update') {
                await updateBankInfo(this.state.bankName, this.state.bankCode, this.state.branchCode, this.state.accountNo, this.state.accountName, this.state.accountNameKana)
                .then(async (response) => {
                    this.setState({loaded: true});
                    if(response.status == 1){
                        Actions.pop();
                        setTimeout(function() {
                            Actions.refresh();
                        }, 10);
                    }
                    else
                        showToast(response.message)
                })
                .catch((error) => {
                    this.setState({loaded: true});
                    showToast();
                });
            } else {
                await registerBank(this.state.bankName, this.state.bankCode, this.state.branchCode, this.state.accountNo, this.state.accountName, this.state.accountNameKana, this.props.phone)
                .then(async (response) => {
                    this.setState({loaded: true});
                    console.log(response)
                    if(response.status == 1)
                        Actions.push("cardphoto", {phone: this.props.phone})
                    else
                        showToast(response.message)
                })
                .catch((error) => {
                    this.setState({loaded: true});
                    showToast();
                });
            }
            
        }
        
    }
    render(){
        return (
            <Container>
                <SafeAreaView style={[styles.contentBg]}>
                    <KeyboardAwareScrollView
                        resetScrollToCoords={{ x: 0, y: 0 }}
                        scrollEnabled={true}
                        style={{}}
                    >
                        <View style={[shared.conatiner, {paddingHorizontal: normalize(20)}]}>
                            
                                <View style={{flex: 1, justifyContent: 'center'}}>
                                    <BoldText style={[fonts.size32, {marginTop: 30}]}>{ this.props.type == 'update' ? '口座情報の変更' : '口座情報を入力'}</BoldText>
                                    <View style={{marginTop: 10}}>
                                        <RegularText style={[margin.mb1, margin.ml1]}>銀行名</RegularText>
                                        <Item rounded style={this.state.bankNameError ? [form.item, styles.error, {marginBottom: 0}] : [form.item, {marginBottom: 0}] }>
                                            <Input
                                                placeholder = "銀行名を入力…"
                                                value = { this.state.bankName }
                                                style = {[form.input, fonts.size20, {lineHeight: normalize(23)}]}
                                                onChangeText = {(text) => this.setState({bankName: text})}
                                                placeholderTextColor = '#9da8bf'
                                                ref={ref => {this.bankName = ref;}}
                                                onSubmitEditing={() => this.bankCode._root.focus()}
                                            />
                                        </Item>
                                    </View>
                                    <View style={{marginTop: 10}}>
                                        <RegularText style={[margin.mb1, margin.ml1]}>銀行コード</RegularText>
                                        <Item rounded style={this.state.bankCodeError? [form.item, styles.error, {marginBottom: 0}] : [form.item, {marginBottom: 0}] }>
                                            <Input
                                                placeholder = "銀行コードを入力…"
                                                value = { this.state.bankCode }
                                                style = {[form.input, fonts.size20, {lineHeight: normalize(23)}]}
                                                onChangeText = {(text) => this.setState({bankCode: text})}
                                                placeholderTextColor = '#9da8bf'
                                                ref={ref => {this.bankCode = ref;}}
                                                onSubmitEditing={() => this.branchCode._root.focus()}
                                            />
                                        </Item>
                                    </View>
                                    <View style={{marginTop: 10}}>
                                        <RegularText style={[margin.mb1, margin.ml1]}>支店コード</RegularText>
                                        <Item rounded style={this.state.branchCodeError? [form.item, styles.error, {marginBottom: 0}] : [form.item, {marginBottom: 0}] }>
                                            <Input
                                                placeholder = "銀行コードを入力…"
                                                value = { this.state.branchCode }
                                                style = {[form.input, fonts.size20, {lineHeight: normalize(23)}]}
                                                onChangeText = {(text) => this.setState({branchCode: text})}
                                                placeholderTextColor = '#9da8bf'
                                                ref={ref => {this.branchCode = ref;}}
                                                onSubmitEditing={() => this.accountNo._root.focus()}
                                            />
                                        </Item>
                                    </View>
                                    <View style={{marginTop: 10}}>
                                        <RegularText style={[margin.mb1, margin.ml1]}>口座番号</RegularText>
                                        <Item rounded style={this.state.accountNoError? [form.item, styles.error, {marginBottom: 0}] : [form.item, {marginBottom: 0}] }>
                                            <Input
                                                placeholder = "口座番号を入力…"
                                                value = { this.state.accountNo }
                                                style = {[form.input, fonts.size20, {lineHeight: normalize(23)}]}
                                                onChangeText = {(text) => this.setState({accountNo: text})}
                                                placeholderTextColor = '#9da8bf'
                                                ref={ref => {this.accountNo = ref;}}
                                                onSubmitEditing={() => this.accountName._root.focus()}
                                            />
                                        </Item>
                                    </View>
                                    <View style={{marginTop: 10}}>
                                        <RegularText style={[margin.mb1, margin.ml1]}>口座名義</RegularText>
                                        <Item rounded style={this.state.accountNameError? [form.item, styles.error, {marginBottom: 0}] : [form.item, {marginBottom: 0}] }>
                                            <Input
                                                placeholder = "口座名義を入力…"
                                                value = { this.state.accountName }
                                                style = {[form.input, fonts.size20, {lineHeight: normalize(23)}]}
                                                onChangeText = {(text) => this.setState({accountName: text})}
                                                placeholderTextColor = '#9da8bf'
                                                ref={ref => {this.accountName = ref;}}
                                                onSubmitEditing={() => this.accountNameKana._root.focus()}
                                            />
                                        </Item>
                                    </View>
                                    <View style={{marginTop: 10}}>
                                        <RegularText style={[margin.mb1, margin.ml1]}>口座名義(全角カナ)</RegularText>
                                        <Item rounded style={this.state.accountNameKanaError? [form.item, styles.error, {marginBottom: 0}] : [form.item, {marginBottom: 0}] }>
                                            <Input
                                                placeholder = "口座名義(全角カナ)を入力…"
                                                value = { this.state.accountNameKana }
                                                style = {[form.input, fonts.size20, {lineHeight: normalize(23)}]}
                                                onChangeText = {(text) => this.setState({accountNameKana: text})}
                                                placeholderTextColor = '#9da8bf'
                                                ref={ref => {this.accountNameKana = ref;}}
                                                onSubmitEditing={() => this.nextScreen()}
                                                returnKeyType="go"
                                            />
                                        </Item>
                                    </View>
                                    
                                </View>
                                <View style={{justifyContent: 'center', alignItems: 'center', width: '100%',flex: 1, marginVertical: 30}}>
                                    <TouchableOpacity onPress={() => this.nextScreen()} style={{borderRadius: 12, width: '100%',backgroundColor: Colors.mainColor, paddingVertical: Platform.OS == 'ios' ? 17 : 12 }}>
                                        <BoldText style={[styles.btnText , fonts.size16]}>{this.props.type == 'update' ? '変更' : '次へ'}</BoldText>
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

export default connect(null,mapDispatchToProps)(Bank)

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
        marginTop: 10,
        paddingLeft: 3
    }
});

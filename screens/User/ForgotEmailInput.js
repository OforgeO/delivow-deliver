import React from 'react';
import { StyleSheet, View, TouchableOpacity, Platform, Alert, SafeAreaView } from 'react-native';
import { Container, Content, Item, Input, Text } from 'native-base';
import { normalize, fonts, margin, form, shared} from '../../assets/styles';
import { connect } from "react-redux";
import { setUser } from '../../actions';
import {Actions} from 'react-native-router-flux';
import Spinner_bar from 'react-native-loading-spinner-overlay';
import Colors from '../../constants/Colors';
import { RegularText, BoldText } from '../../components/StyledText';
import Constants from 'expo-constants';
import { forgot } from '../../api';
import { showToast } from '../../shared/global';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
TouchableOpacity.defaultProps = { activeOpacity: 0.8 };

class ForgotEmailInput extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            email: '',
            emailError: false,
            loaded: true
        };
    }
    componentDidMount(){
    }

    async nextScreen(){
        if(!this.validateEmail(this.state.email)){
            this.setState({emailError: true})
        }else{
            this.setState({emailError: false})
            //this.setState({loaded: false})
            await forgot(this.state.email)
            .then(async (response) => {
                //this.setState({loaded: true});
                if(response.status == 1){
                    Actions.push("forgotemailreceive", {email: this.state.email});
                } else{
                    Alert.alert("登録されていないメールアドレスです")
                }
            })
            .catch((error) => {
                //this.setState({loaded: true});
                showToast();
            });
            
        }
    }
    validateEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }
    render(){
        return (
            <Container>
                <SafeAreaView contentContainerStyle={[styles.contentBg]}>
                    <KeyboardAwareScrollView
                        resetScrollToCoords={{ x: 0, y: 0 }}
                        scrollEnabled={true}
                    >
                        <View style={[shared.container, {paddingHorizontal: normalize(20)}]}>
                            <View style={{flex: 3, justifyContent: 'center'}}>
                                <BoldText style={fonts.size32}>登録したメールアドレスを入力</BoldText>
                                <Item rounded style={ this.state.emailError ? [form.item , styles.error, margin.mt6] : [form.item, margin.mt6] }>
                                    <Input
                                        placeholder = "メールアドレスを入力"
                                        value = { this.state.email }
                                        style = { [form.input] }
                                        keyboardType="email-address"
                                        onChangeText = {(text) => this.setState({email: text})}
                                        placeholderTextColor = '#9da8bf'
                                        onSubmitEditing={() => this.nextScreen()}
                                    />
                                </Item>
                            </View>
                            <View style={{flex: 1, justifyContent: 'flex-end'}}>
                                <View style={{justifyContent: 'center', alignItems: 'center', width: '100%', bottom: 30,}}>
                                    <TouchableOpacity onPress={() => this.nextScreen()} style={{borderRadius: 12, width: '100%',backgroundColor: Colors.mainColor, paddingVertical: Platform.OS == 'ios' ? 17 : 12 }}>
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

export default connect(null,mapDispatchToProps)(ForgotEmailInput)

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

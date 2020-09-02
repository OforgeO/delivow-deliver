import React from 'react';
import { StyleSheet, SafeAreaView, View, TouchableOpacity, Alert } from 'react-native';
import { Container, Content, Item, Input, Text } from 'native-base';
import { normalize, fonts, margin, form, shared} from '../../assets/styles';
import {Actions} from 'react-native-router-flux';
import Spinner_bar from 'react-native-loading-spinner-overlay';
import Colors from '../../constants/Colors';
import { RegularText, BoldText } from '../../components/StyledText';
import { FontAwesome } from '@expo/vector-icons';
import { updatePassword } from '../../api';
import { showToast } from '../../shared/global';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
TouchableOpacity.defaultProps = { activeOpacity: 0.8 };

export default class UpdatePassword extends React.Component {
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

    async nextScreen(){
        let validate = true;
        var pwd_letters = /^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/;
        if(this.state.password == '' || this.state.password != this.state.passwordConfirm || this.state.password.length < 8 || !this.state.password.match(pwd_letters)){
            this.setState({passwordError: true})
            validate = false;
        } else{
            this.setState({passwordError: false})
        }
        if(validate){
            this.setState({ loaded: false });
            await updatePassword(this.state.password)
            .then(async (response) => {
                console.log(response)
                this.setState({ loaded: true });
                if(response.status == 1) {
                    setTimeout(function() {
                        Alert.alert("パスワードを変更しました", "", [
                            {text: 'OK', onPress: () => { Actions.pop(); setTimeout(function(){Actions.refresh()}, 10) }},
                        ]);
                    }, 500)
                } else {
                    showToast(response.message)
                }
            })
            .catch((error) => {
                this.setState({ loaded: true });
                showToast();
            });
        }
    }
    
    render(){
        return (
            <Container>
                <SafeAreaView style={[styles.contentBg , styles.contentPD ]}>
                    <KeyboardAwareScrollView
                        resetScrollToCoords={{ x: 0, y: 0 }}
                        scrollEnabled={true}
                    >
                        <View style={[shared.bodyContainer,{paddingHorizontal: normalize(20)}]}>
                            <View style={{flex: 1, justifyContent: 'flex-end'}}>
                                <BoldText style={[fonts.size32]}>パスワードの変更</BoldText >
                                <RegularText style={margin.mb4}>※半角英語と半角数字の組み合わせ、8文字以上</RegularText>
                                <Item rounded style={ this.state.passwordError ? [form.item , styles.error] : [form.item] }>
                                    <Input
                                        placeholder = "新しいパスワードを入力…"
                                        value = { this.state.password }
                                        style = { [form.input] }
                                        secureTextEntry
                                        onChangeText = {(text) => this.setState({password: text})}
                                        placeholderTextColor = '#9da8bf'
                                        onSubmitEditing={() => this.passwordConfirm._root.focus()}
                                    />
                                </Item>
                                <Item rounded style={ this.state.passwordError ? [form.item , styles.error] : [form.item] }>
                                    <Input
                                        placeholder = "確認用パスワードを入力…"
                                        value = { this.state.passwordConfirm }
                                        style = { [form.input] }
                                        secureTextEntry
                                        onChangeText = {(text) => this.setState({passwordConfirm: text})}
                                        placeholderTextColor = '#9da8bf'
                                        ref={ref => {this.passwordConfirm = ref;}}
                                        returnKeyType="go"
                                        onSubmitEditing={() => this.nextScreen()}
                                    />
                                </Item>
                                {
                                    this.state.passwordError ?
                                    <View style={[{flexDirection: 'row'}, margin.ml1]}>
                                        <FontAwesome name="exclamation-circle" size={16} color='#CE082E' />
                                        <RegularText style={[{color:'#CE082E'}, margin.ml1]}>パスワードが一致しません</RegularText>
                                    </View>
                                    :
                                    null
                                }
                            </View>
                            <View style={{flex: 1, justifyContent: 'flex-end'}}>
                                <View style={{justifyContent: 'center', alignItems: 'center', width: '100%', bottom: 30,}}>
                                    <TouchableOpacity onPress={() => this.nextScreen()} style={{borderRadius: 12, width: '100%',backgroundColor: Colors.mainColor }}>
                                        <RegularText style={[styles.btnText , fonts.size15]}>変更</RegularText>
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
UpdatePassword.navigationOptions = {
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
    }
});

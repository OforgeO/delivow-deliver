import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Container, Content, Item, Input, Text } from 'native-base';
import { normalize, fonts, margin, form} from '../../assets/styles';
import { resetPassword } from '../../api';
import { showToast } from '../../shared/global';
import Spinner_bar from 'react-native-loading-spinner-overlay';
import {Actions} from 'react-native-router-flux';
import { RegularText, BoldText } from '../../components/StyledText';
TouchableOpacity.defaultProps = { activeOpacity: 0.8 };

export default class ResetPwd extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            confirmPwd: '',
            password: '',
            pwdError: false,
            loaded: true
        };
    }

    resetPassword(){
        if(this.state.password != '' && this.state.password == this.state.confirmPwd){
            this.setState({loaded: false});
            resetPassword(this.props.phone, this.props.code, this.state.password)
            .then((response) => {
                this.setState({loaded: true});
                if(response.status) {
                    Actions.reset("login")
                }
                else {
                    showToast(response.msg);
                }
            })
            .catch((error) => {
                this.setState({loaded: true});
                showToast();
            })
        }else{
            showToast(_e.wrongPassword)
        }
    }
    
    render(){
        return (
            <Container>
                <Content contentContainerStyle={[styles.contentBg , styles.contentPD, {
                    flexGrow: 1,
                    flexDirection: 'column',
                    justifyContent: 'center'
                }]}>
                    <View style={{paddingBottom: 20}}>
                        <Item rounded style={ [form.item , {position: 'relative'}] }>
                            <Input
                                secureTextEntry={true}
                                placeholder = "新規パスワード"
                                value = { this.state.password }
                                style = { [form.input] }
                                onChangeText = {(text) => this.setState({password: text})}
                                placeholderTextColor = '#9da8bf'
                            />
                        </Item>
                        
                        <Item rounded style={ [form.item , {position: 'relative'}] }>
                            <Input
                                secureTextEntry={true}
                                placeholder = "パスワード確認"
                                value = { this.state.confirmPwd }
                                style = { [form.input, {width: '50%'}] }
                                onChangeText = {(text) => this.setState({confirmPwd: text})}
                                placeholderTextColor = '#9da8bf'
                            />
                        </Item>
                        
                        <View style={{justifyContent: 'center', alignItems: 'center', marginTop: 8}}>
                            <TouchableOpacity onPress={() => this.resetPassword()} style={{borderRadius: 12, width: '100%',backgroundColor:'#353a50' }}>
                                <RegularText style={[styles.btnText , fonts.size15]}>パスワードリセット</RegularText>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Content>
                <Spinner_bar color={'#27cccd'} visible={!this.state.loaded} textContent={""} overlayColor={"rgba(0, 0, 0, 0.5)"} />
            </Container>
        );
    }
}
const styles = StyleSheet.create({
    contentBg: {
        backgroundColor: '#3acce1'
    },
    logoImage: {
        width: normalize(81.6),
        height: normalize(81)
    },
    logoText1: {
        color: 'white'
    },
    logoBgImage: {
        width: normalize(282.8),
        height: normalize(190.2)
    },
    contentPD: {
        paddingLeft: normalize(20),
        paddingRight: normalize(22)
    },
    btnText: {
        padding: 18,
        width: "100%",
        color: '#fff',
        textAlign: 'center',
    }
});

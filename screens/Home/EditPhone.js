import React from 'react';
import { StyleSheet, SafeAreaView, View, TouchableOpacity, Alert } from 'react-native';
import { Container, Content, Item, Input, Text } from 'native-base';
import { normalize, fonts, margin, form, shared} from '../../assets/styles';
import {Actions} from 'react-native-router-flux';
import Spinner_bar from 'react-native-loading-spinner-overlay';
import Colors from '../../constants/Colors';
import { RegularText, BoldText } from '../../components/StyledText';
import { FontAwesome } from '@expo/vector-icons';
import { updateEmail } from '../../api';
import { showToast } from '../../shared/global';
import { connect } from "react-redux";
import { setUser } from '../../actions';
import store from '../../store/configuteStore';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
TouchableOpacity.defaultProps = { activeOpacity: 0.8 };

class EmailChange extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            email: '',
            emailError: false,
            newEmail: '',
            loaded: true
        };
    }
    componentDidMount(){
    }

    async nextScreen(){
        if(!this.validateEmail(this.state.email) || this.state.email != this.state.newEmail){
            this.setState({emailError: true})
        }else{
            this.setState({emailError: false})
            this.setState({ loaded: false });
            await updateEmail(this.state.email)
            .then(async (response) => {
                this.setState({ loaded: true });
                if(response.status == 1) {
                    let info = store.getState().user
                    info.email = this.state.email
                    this.props.setUser(info)
                    setTimeout(function() {
                        Alert.alert("メールアドレスを変更しました。", "", [
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
    validateEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }
    
    render(){
        return (
            <Container>
                <SafeAreaView style={[styles.contentBg , styles.contentPD]}>
                    <KeyboardAwareScrollView
                        resetScrollToCoords={{ x: 0, y: 0 }}
                        scrollEnabled={true}
                    >
                        <View style={[shared.bodyContainer, {paddingHorizontal: normalize(20)}]}>
                            <View style={{flex: 1, justifyContent: 'flex-end'}}>
                                <BoldText style={[fonts.size32, margin.mb4]}>メールアドレスを変更</BoldText>
                                
                                <Item rounded style={ this.state.emailError ? [form.item , styles.error]  : [form.item] }>
                                    <Input
                                        placeholder = "メールアドレスを入力"
                                        value = { this.state.email }
                                        style = { [form.input] }
                                        keyboardType="email-address"
                                        onChangeText = {(text) => this.setState({email: text})}
                                        placeholderTextColor = '#9da8bf'
                                        onSubmitEditing={() => this.newEmail._root.focus()}
                                    />
                                </Item>
                                <Item rounded style={ this.state.emailError ? [form.item , styles.error] : [form.item] }>
                                    <Input
                                        placeholder = "確認用メールアドレスを入力"
                                        value = { this.state.newEmail }
                                        style = { [form.input] }
                                        keyboardType="email-address"
                                        onChangeText = {(text) => this.setState({newEmail: text})}
                                        placeholderTextColor = '#9da8bf'
                                        ref={ref => {this.newEmail = ref;}}
                                        returnKeyType="go"
                                        onSubmitEditing={() => this.nextScreen()}
                                    />
                                </Item>
                                {
                                    this.state.emailError ?
                                    <View style={[{flexDirection: 'row'}, margin.ml1]}>
                                        <FontAwesome name="exclamation-circle" size={16} color='#CE082E' />
                                        <RegularText style={[{color:'#CE082E'}, margin.ml1]}>無効なメールアドレスです</RegularText>
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
EmailChange.navigationOptions = {
    header: null
}
const mapDispatchToProps = dispatch => {
    return {
        setUser: user => { dispatch(setUser(user)) }
    }
}
export default connect(null, mapDispatchToProps)(EmailChange)
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
    },
    error: {
        borderColor: '#CE082E',
        borderBottomWidth: 1,
        borderTopWidth: 1,
        borderLeftWidth: 1,
        borderRightWidth: 1,
    }
});

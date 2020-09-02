import React from 'react';
import { StyleSheet, TouchableWithoutFeedback, Keyboard, View, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { Container, Content, Item, Input, Text } from 'native-base';
import { normalize, fonts, margin, form} from '../../assets/styles';
import { connect } from "react-redux";
import { setUser } from '../../actions';
import {Actions} from 'react-native-router-flux';
import Spinner_bar from 'react-native-loading-spinner-overlay';
import Colors from '../../constants/Colors';
import { RegularText, BoldText } from '../../components/StyledText';
TouchableOpacity.defaultProps = { activeOpacity: 0.8 };

class TermsScreen extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            phone: '',
            code: '',
            phoneError: false,
            codeError: false,
            loaded: true
        };
    }
    componentDidMount(){
    }

    sendCode(){
        
    }
    render(){
        return (
            <Container>
                <Content contentContainerStyle={[styles.contentBg , styles.contentPD, {
                    flexGrow: 1,
                    flexDirection: 'column',
                    justifyContent: 'center'
                }]}>
                    <KeyboardAvoidingView behavior={"padding"} style={{flex: 1}} keyboardVerticalOffset={40}>
                        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                            <View style={{flex: 1}}>
                                <View style={{flex: 1, justifyContent: 'flex-end'}}>
                                    <BoldText style={fonts.size32}>利用規約を確認</BoldText>
                                    <RegularText style={[fonts.size16, margin.pt2]}>続行することにより</RegularText>
                                    <View style={{flexDirection: 'row'}}>
                                        <TouchableOpacity onPress={() => Actions.push("terms", {type: "terms"})}>
                                            <BoldText style={[fonts.size16, {color: Colors.mainColor, lineHeight: 20}]}>利用規約</BoldText>
                                        </TouchableOpacity>
                                        <RegularText style={[fonts.size16, { lineHeight: 20}]}>および</RegularText>
                                        <TouchableOpacity onPress={() => Actions.push("terms", {type: "policy"})}>
                                            <BoldText style={[fonts.size16, {color: Colors.mainColor, lineHeight: 20}]}>個人情報保護方針</BoldText>
                                        </TouchableOpacity>
                                        <RegularText style={[fonts.size16, {lineHeight: 20}]}>に</RegularText>
                                    </View>
                                    <RegularText style={[fonts.size16, { lineHeight: 20}]}>同意したものとみなされます。</RegularText>
                                </View>
                                <View style={{flex: 1, justifyContent: 'flex-end'}}>
                                    <View style={{justifyContent: 'center', alignItems: 'center', width: '100%', bottom: 30,}}>
                                        <TouchableOpacity onPress={() => Actions.push("bank", {phone: this.props.phone})} style={{borderRadius: 12, width: '100%',backgroundColor: Colors.mainColor, paddingVertical: Platform.OS == 'ios' ? 17 : 12 }}>
                                            <BoldText style={[styles.btnText , fonts.size16]}>次へ </BoldText>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </KeyboardAvoidingView>
                </Content>
                
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

export default connect(null,mapDispatchToProps)(TermsScreen)

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

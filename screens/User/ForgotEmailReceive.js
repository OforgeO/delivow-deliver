import React from 'react';
import { StyleSheet, View, TouchableOpacity, Alert } from 'react-native';
import { Container, Content, Item, Input, Text } from 'native-base';
import { normalize, fonts, margin, form} from '../../assets/styles';
import { showToast } from '../../shared/global';
import { connect } from "react-redux";
import { setUser } from '../../actions';
import {Actions} from 'react-native-router-flux';
import Spinner_bar from 'react-native-loading-spinner-overlay';
import Colors from '../../constants/Colors';
import { Ionicons } from '@expo/vector-icons'; 
import { forgot } from '../../api';
import { RegularText, BoldText } from '../../components/StyledText';
TouchableOpacity.defaultProps = { activeOpacity: 0.8 };

class ForgotEmailReceive extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            loaded: true
        };
    }
    componentDidMount(){
        
    }

    async resendEmail(){
        //this.setState({loaded: false})
        await forgot(this.props.email)
        .then(async (response) => {
            //console.log(response)
            //this.setState({loaded: true});
            if(response.status == 0){
                showToast(response.message)
            } else{
                Alert.alert("パスワード再設定用のメールを再送信しました")
            }
        })
        .catch((error) => {
            //this.setState({loaded: true});
            showToast();
        });
    }
    render(){
        return (
            <Container>
                <Content contentContainerStyle={[styles.contentBg , styles.contentPD, {
                    flexGrow: 1,
                    flexDirection: 'column',
                    justifyContent: 'center'
                }]}>
                    <View style={{flex: 1, justifyContent: 'center'}}>
                        <BoldText style={fonts.size32}>デリボから送られたメールを確認</BoldText>
                        <RegularText style={[fonts.siz16, margin.mt2]}>本文に添付されているリンクから、パスワードの再設定をしてください。</RegularText>
                        <TouchableOpacity style={styles.goDliever} onPress={() => this.resendEmail()}>
                            <Ionicons name="ios-arrow-dropright-circle" size={24} color={Colors.secColor} />
                            <BoldText style={[fonts.size14, {color: Colors.secColor, marginLeft: 5}]}>届かないのでメールを再送する</BoldText>
                        </TouchableOpacity>
                    </View>
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

export default connect(null,mapDispatchToProps)(ForgotEmailReceive)

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
});

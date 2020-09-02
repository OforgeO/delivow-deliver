import React from 'react';
import { StyleSheet, View, TouchableOpacity, Platform } from 'react-native';
import { Container, Content,  Text } from 'native-base';
import { normalize, fonts, margin, form} from '../../assets/styles';
import { resendCode } from '../../api';
import { showToast } from '../../shared/global';
import { connect } from "react-redux";
import { setUser } from '../../actions';
import {Actions} from 'react-native-router-flux';
import Spinner_bar from 'react-native-loading-spinner-overlay';
import Colors from '../../constants/Colors';
import { RegularText, BoldText } from '../../components/StyledText';
TouchableOpacity.defaultProps = { activeOpacity: 0.8 };

class ResendCode extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            loaded: true,
        };
    }
    componentDidMount(){
    }

    async sendCode(){
        this.setState({loaded: false})
        await resendCode(this.props.phone)
        .then(async (response) => {
            this.setState({loaded: true});
            Actions.pop()
        })
        .catch((error) => {
            this.setState({loaded: true});
            showToast();
        });
    }
    cancel(){
        Actions.pop()
    }
    render(){
        return (
            <Container>
                <Content contentContainerStyle={[styles.contentBg , styles.contentPD, { 
                    flexGrow: 1,
                    flexDirection: 'column',
                    justifyContent: 'center'
                }]}>
                    
                    <View style={{flex: 1}}>
                        <View style={{flex: 1, justifyContent: 'flex-end', marginBottom: 40}}>
                            <BoldText style={fonts.size32}>{this.props.phone}に確認コードを再送信します</BoldText>
                        </View>
                        <View style={{flex: 1, justifyContent: 'flex-end'}}>
                            <View style={styles.btnSection}>
                                <TouchableOpacity onPress={() => this.cancel()} style={[styles.nextBtn, {backgroundColor: 'white', borderWidth: 1, borderColor: Colors.mainColor}]}>
                                    <BoldText style={[styles.btnText , fonts.size16, {color: Colors.mainColor}]}>キャンセル</BoldText>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.btnSection}>
                                <TouchableOpacity onPress={() => this.sendCode()} style={styles.nextBtn}>
                                    <BoldText style={[styles.btnText , fonts.size16]}>SMSでコードを再送信</BoldText>
                                </TouchableOpacity>
                            </View>
                        </View>
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

export default connect(null,mapDispatchToProps)(ResendCode)

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
    btnSection: {
        justifyContent: 'center', 
        alignItems: 'center', 
        width: '100%', 
        bottom: 30,
        marginTop: 10
    },
    nextBtn:{
        borderRadius: 12, 
        width: '100%',
        backgroundColor: Colors.mainColor,
        paddingVertical: Platform.OS == 'ios' ? 17 : 12
    }
});

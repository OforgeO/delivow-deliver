import React from 'react';
import { StyleSheet, SafeAreaView, View, TouchableOpacity, Alert } from 'react-native';
import { Container, Content, Item, Input, Text } from 'native-base';
import { normalize, fonts, margin, form, shared} from '../../assets/styles';
import {Actions} from 'react-native-router-flux';
import Spinner_bar from 'react-native-loading-spinner-overlay';
import Colors from '../../constants/Colors';
import { RegularText, BoldText } from '../../components/StyledText';
import { FontAwesome } from '@expo/vector-icons';
import { updateAddress } from '../../api';
import { showToast } from '../../shared/global';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import OrderConfirm from '../../components/OrderConfirm';
import { connect } from "react-redux";
import { setUser } from '../../actions';
import store from '../../store/configuteStore';

TouchableOpacity.defaultProps = { activeOpacity: 0.8 };

class UpdateAddress extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            address: this.props.address,
            addressError: false,
            loaded: true
        };
    }
    componentDidMount(){
    }

    async nextScreen(){
        let validate = true;
        
        if(this.state.address == ''){
            this.setState({addressError: true})
            validate = false;
        } else{
            this.setState({addressError: false})
        }
        if(validate){
            this.setState({ loaded: false });
            await updateAddress(this.state.address)
            .then(async (response) => {
                this.setState({ loaded: true });
                if(response.status == 1) {
                    let info = store.getState().user
                    info.address = this.state.address
                    this.props.setUser(info)

                    Actions.pop(); 
                    setTimeout(function(){
                        Actions.refresh()
                    }, 10)
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
                <OrderConfirm />
                <SafeAreaView style={[styles.contentBg , styles.contentPD ]}>
                    <KeyboardAwareScrollView
                        resetScrollToCoords={{ x: 0, y: 0 }}
                        scrollEnabled={true}
                    >
                        <View style={[shared.bodyContainer,{paddingHorizontal: normalize(20)}]}>
                            <View style={{flex: 1, justifyContent: 'flex-end'}}>
                                <BoldText style={[fonts.size32]}>住所</BoldText >
                                <Item rounded style={ this.state.addressError ? [form.item , styles.error] : [form.item] }>
                                    <Input
                                        placeholder = ""
                                        value = { this.state.address }
                                        style = { [form.input] }
                                        onChangeText = {(text) => this.setState({address: text})}
                                        placeholderTextColor = '#9da8bf'
                                        multiline={true}
                                    />
                                </Item>
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
UpdateAddress.navigationOptions = {
    header: null
}
const mapDispatchToProps = dispatch => {
    return {
        setUser: user => { dispatch(setUser(user)) }
    }
}
export default connect(null, mapDispatchToProps)(UpdateAddress)
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

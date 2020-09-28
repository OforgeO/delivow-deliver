import React from 'react';
import { StyleSheet, SafeAreaView, View, TouchableOpacity } from 'react-native';
import { Container, Content, Item, Input, Text } from 'native-base';
import { normalize, fonts, margin, form, shared} from '../../assets/styles';
import {Actions} from 'react-native-router-flux';
import Spinner_bar from 'react-native-loading-spinner-overlay';
import Colors from '../../constants/Colors';
import { RegularText, BoldText } from '../../components/StyledText';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Constants from 'expo-constants';
import { connect } from "react-redux";
import { setUser } from '../../actions';
import { updateName } from '../../api';
import { showToast } from '../../shared/global';
import store from '../../store/configuteStore';
import OrderConfirm from '../../components/OrderConfirm';
TouchableOpacity.defaultProps = { activeOpacity: 0.8 };

class EditName extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            loaded: true,
            firstName: '',
            lastName: '',
            firstNameError: false,
            lastNameError: false
        };
    }
    componentDidMount(){
    }

    async nextScreen(){
        let valid = true
        if(this.state.firstName == '') {
            this.setState({firstNameError: true})
            valid = false
        } else {
            this.setState({firstNameError: false})
        }
        if(this.state.lastName == '') {
            this.setState({lastNameError: true})
            valid = false
        } else {
            this.setState({lastNameError: false})
        }
        if(valid) {
            this.setState({ loaded: false });
            await updateName(this.state.firstName, this.state.lastName)
            .then(async (response) => {
                if(response.status == 1) {
                    let myInfo = store.getState().user
                    myInfo.first_name = this.state.firstName
                    myInfo.last_name = this.state.lastName
                    this.props.setUser(myInfo)
                    Actions.push("vehicleregister", {type: 'update'})
                } else {
                    showToast(response.message)
                }
                this.setState({ loaded: true });
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
                <SafeAreaView style={[styles.contentBg ,{marginTop: Platform.OS == 'ios' ? Constants.statusBarHeight : 0}]}>
                    <KeyboardAwareScrollView
                        resetScrollToCoords={{ x: 0, y: 0 }}
                        scrollEnabled={true}
                    >
                        <View style={[shared.bodyContainer, {paddingHorizontal: normalize(20)}]}>
                            <View style={{flex: 3, justifyContent: 'center'}}>
                                <BoldText style={[fonts.size32, margin.mb4]}>名前の修正</BoldText>
                                <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                                    <View style={{width: '47%'}}>
                                        <RegularText style={[margin.pl1, margin.pb1]}>姓</RegularText>
                                        <Item rounded style={ this.state.firstNameError ? [form.item , styles.error] : [form.item] }>
                                            <Input
                                                placeholder = "姓"
                                                value = { this.state.firstName }
                                                style = { [form.input] }
                                                onChangeText = {(text) => this.setState({firstName: text})}
                                                placeholderTextColor = '#9da8bf'
                                                multiline={true}
                                                //onSubmitEditing={() => this.lastName._root.focus()}
                                            />
                                        </Item>
                                    </View>
                                    <View style={{width: '47%'}}>
                                        <RegularText style={[margin.pl1, margin.pb1]}>名</RegularText>
                                        <Item rounded style={ this.state.lastNameError ? [form.item , styles.error] : [form.item] }>
                                            <Input
                                                placeholder = "名"
                                                value = { this.state.lastName }
                                                style = { [form.input] }
                                                onChangeText = {(text) => this.setState({lastName: text})}
                                                placeholderTextColor = '#9da8bf'
                                                returnKeyType="go"
                                                ref={ref => {this.lastName = ref;}}
                                                multiline={true}
                                                //onSubmitEditing={() => this.nextScreen()}
                                            />
                                        </Item>
                                    </View>
                                </View>
                                <View style={margin.mt4}>
                                    <RegularText style={[fonts.size14, {lineHeight: 20}]}>※ 名前は「免許証 または 身分証明書」</RegularText>
                                    <RegularText style={[fonts.size14, {lineHeight: 20}]}>「各種保険証書」と一致している必要があります。</RegularText>
                                    <RegularText style={[fonts.size14, {lineHeight: 20}]}>引き続き登録・修正をしてください。</RegularText>
                                </View>
                            </View>
                            <View style={{flex: 1, justifyContent: 'flex-end'}}>
                                <View style={{justifyContent: 'center', alignItems: 'center', width: '100%', bottom: 30,}}>
                                    <TouchableOpacity onPress={() => this.nextScreen()} style={{borderRadius: 12, width: '100%',backgroundColor: Colors.mainColor }}>
                                        <RegularText style={[styles.btnText , fonts.size16]}>修正して次へ</RegularText>
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
EditName.navigationOptions = {
    header: null
}
const mapDispatchToProps = dispatch => {
    return {
        setUser: user => { dispatch(setUser(user)) }
    }
}
export default connect(null, mapDispatchToProps)(EditName)
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

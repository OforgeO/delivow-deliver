import React from 'react';
import { StyleSheet, SafeAreaView, View, TouchableOpacity, Alert, Linking } from 'react-native';
import { Container, Content, Item, Input, Text } from 'native-base';
import { normalize, fonts, margin, form, shared} from '../../assets/styles';
import {Actions} from 'react-native-router-flux';
import Spinner_bar from 'react-native-loading-spinner-overlay';
import Colors from '../../constants/Colors';
import { RegularText, BoldText } from '../../components/StyledText';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import OrderConfirm from '../../components/OrderConfirm';
import Back from '../../components/Back';
import store from '../../store/configuteStore';
TouchableOpacity.defaultProps = { activeOpacity: 0.8 };
export default class AllowNotification extends React.Component {
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
    async componentDidMount(){
        const { status: existingStatus } = await Permissions.getAsync(
            Permissions.NOTIFICATIONS
        );
        if (existingStatus !== 'granted') {
            await Permissions.askAsync(Permissions.NOTIFICATIONS);
        }
    }

    async nextScreen() {
        Linking.openURL('app-settings:');
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
                        <View style={[shared.bodyContainer]}>
                            <View style={{paddingTop: store.getState().showDeliver.showDeliver ? 50 : 0}}>
                                <Back color="#d3d3d3" />
                            </View>
                            <View style={{paddingHorizontal: normalize(20), flex: 1}}>
                                <View style={{flex: 3, justifyContent: 'center'}}>
                                    <BoldText style={[fonts.size32, margin.mb4]}>プッシュ通知の設定</BoldText>
                                    <View style={margin.mt4}>
                                        <RegularText style={fonts.size16}>待機中・配達中は「 ON」の設定が必須です。{'\n'}</RegularText>
                                        <RegularText style={fonts.size16}>通知は、配達依頼・お客様や飲食店からの連絡などをお知らせするために使用されます。</RegularText>
                                    </View>
                                </View>
                                <View style={{flex: 1, justifyContent: 'flex-end'}}>
                                    <View style={{justifyContent: 'center', alignItems: 'center', width: '100%', bottom: 30,}}>
                                        <TouchableOpacity onPress={() => this.nextScreen()} style={{borderRadius: 12, width: '100%',backgroundColor: Colors.secColor }}>
                                            <RegularText style={[styles.btnText , fonts.size16]}>通知設定を変更</RegularText>
                                        </TouchableOpacity>
                                    </View>
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
AllowNotification.navigationOptions = {
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
    },
});

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
    componentDidMount(){
    }

    async nextScreen() {
        
        Actions.pop()
        setTimeout(function() {
            Actions.refresh()
        }, 10)
    }
    
    render(){
        return (
            <Container>
                <SafeAreaView style={[styles.contentBg ,{marginTop: Platform.OS == 'ios' ? Constants.statusBarHeight : 0}]}>
                    <KeyboardAwareScrollView
                        resetScrollToCoords={{ x: 0, y: 0 }}
                        scrollEnabled={true}
                    >
                        <View style={[shared.bodyContainer, {paddingHorizontal: normalize(20)}]}>
                            <View style={{flex: 3, justifyContent: 'center'}}>
                                <BoldText style={[fonts.size32, margin.mb4]}>プッシュ通知の設定</BoldText>
                                <View style={margin.mt4}>
                                    <RegularText style={fonts.size16}>待機中・配達中は「 ON」の設定が必須です。{'\n'}</RegularText>
                                    <RegularText style={fonts.size16}>通知は、配達依頼・お客様や飲食店からの連絡などをお知らせするために使用されます。</RegularText>
                                </View>
                            </View>
                            <View style={{flex: 1, justifyContent: 'flex-end'}}>
                                <View style={{justifyContent: 'center', alignItems: 'center', width: '100%', bottom: 30,marginBottom: 30}}>
                                    <TouchableOpacity onPress={() => this.nextScreen("on")} style={{borderRadius: 12, width: '100%',backgroundColor: Colors.secColor }}>
                                        <RegularText style={[styles.btnText , fonts.size16]}>プッシュ通知をONにする</RegularText>
                                    </TouchableOpacity>
                                </View>

                                <View style={{justifyContent: 'center', alignItems: 'center', width: '100%', bottom: 30,}}>
                                    <TouchableOpacity onPress={() => this.nextScreen("off")} style={{borderRadius: 12, width: '100%',backgroundColor: Colors.secColor }}>
                                        <RegularText style={[styles.btnText , fonts.size16]}>プッシュ通知をOFFにする</RegularText>
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

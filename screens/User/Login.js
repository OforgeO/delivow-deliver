import React from 'react';
import { StyleSheet, Image, View, TouchableOpacity, Text, StatusBar, Platform, Linking } from 'react-native';
import Images from "../../assets/Images";
import { normalize, fonts, margin, form} from '../../assets/styles';
import { connect } from "react-redux";
import { setUser, setTerms, setNotify } from '../../actions';
import Spinner_bar from 'react-native-loading-spinner-overlay';
import {Actions} from 'react-native-router-flux';
import store from '../../store/configuteStore';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '../../constants/Colors';
import WhiteLogo from '../../assets/images/white_logo.svg';
import { RegularText, BoldText } from '../../components/StyledText';
import * as Linking1 from 'expo-linking'
import * as SecureStore from 'expo-secure-store';
import * as Notifications from 'expo-notifications';
TouchableOpacity.defaultProps = { activeOpacity: 0.8 };


class Login extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            username: '',
            password: '',
            usernameError: false,
            pwdError: false,
            loaded: false
        };
    }
    async componentDidMount(){
        const receiveNoti = Notifications.addNotificationReceivedListener(notification => {
            let notify_data = notification.request.content.data
            this.handleNotification(notify_data, 'fore')
        });
        let clickNoti = Notifications.addNotificationResponseReceivedListener(response => {
            let notify_data = response.notification.request.content.data
            this.handleNotification(notify_data, 'back')
        });

        if (Platform.OS === 'android') {
            Linking.getInitialURL().then(url => {
                this.navigate(url);
            });
        }
        Linking.addEventListener('url', this.handleOpenURL);
        //SecureStore.deleteItemAsync("token")
        let token = await SecureStore.getItemAsync("token")
        if(token) {
            Actions.reset("root")
        }
        this.setState({loaded: true})
    }
    handleNotification(notify_data, type) {
        console.log(notify_data)
        if(notify_data.body.type == "terms" || notify_data.body.type == "commercial" || notify_data.body.type == "personal") {
            let termsInfo = store.getState().terms
            if(notify_data.body.type == "terms")
                termsInfo.terms = true
            else if(notify_data.body.type == "commercial")
                termsInfo.commercial = true
            else if(notify_data.body.type == "personal")
                termsInfo.personal = true
            this.props.setTerms(termsInfo)
        } else if(notify_data.body.type == "delivery_before_attend" || notify_data.body.type == "delivery_order_request" || notify_data.body.type == "delivery_order_car" || notify_data.body.type == "delivery_order_serveral" || notify_data.body.type == "delivery_request_attend" || notify_data.body.type == "delivery_order_cancel") {
            let notify = store.getState().notify
            notify.title = notify_data.aps.alert.title
            notify.subtitle = notify_data.aps.alert.body
            if(notify_data.body.type == "delivery_before_attend")
                notify.delivery_before_attend = true
            else if(notify_data.body.type == "delivery_order_request")
            {
                notify.delivery_order_request = true
                notify.request_order_uid = notify_data.body.order_uid
            }
            else if(notify_data.body.type == "delivery_order_car"){
                notify.delivery_order_car = true
                notify.request_order_uid = notify_data.body.order_uid
            }
            else if(notify_data.body.type == "delivery_order_serveral"){
                notify.delivery_order_serveral = true
                notify.request_order_uid = notify_data.body.order_uid
            }
            else if(notify_data.body.type == "delivery_request_attend")
                notify.delivery_request_attend = true
            else if(notify_data.body.type == "delivery_order_cancel")
                notify.delivery_order_cancel = true
            this.props.setNotify(notify)
        } else if(notify_data.body.type == "delivery_decide" || notify_data.body.type == "delivery_no_entry") {
            let notify = store.getState().notify
            notify.title = notify_data.body.title
            notify.subtitle = notify_data.body.body
            if(notify_data.body.type == "delivery_decide"){
                notify.delivery_decide = true
                notify.order_uid = notify_data.body.order_uid
            }
            else if(notify_data.body.type == "delivery_no_entry")
                notify.delivery_no_entry = true
            this.props.setNotify(notify)
        } else if(notify_data.body.type == "cancel_delivering") {
            let notify = store.getState().notify
            notify.cancel_delivering = true
            notify.title = notify_data.body.title
            notify.subtitle = notify_data.body.body
            this.props.setNotify(notify)
        } else if(notify_data.body.type == 'chat') {
            if(Actions.currentScene != 'chat' && Actions.currentScene != 'chatlist'){
                Actions.push("chatlist", { order_uid: notify_data.body.order_uid, author: store.getState().user, store_name: notify_data.body.store_name })
            }
            else
                Actions.refresh();
        }
        if(notify_data.body.type == "delivery_order_request" || notify_data.body.type == "delivery_order_car" || notify_data.body.type == "delivery_order_serveral") {
            Notifications.scheduleNotificationAsync({
                content: {
                    title: "エントリーボタンが押されずに3分が経ちました。",
                    body: '配達依頼の通知を受けたら、必ず「エントリーボタン」を押すことがデリバーのルールです。\n次回からは「エントリー」を忘れずにお願いします。',
                    data: {
                        body: {
                            "type": "delivery_no_entry",
                            "title": "エントリーボタンが押されずに3分が経ちました。",
                            "body": '配達依頼の通知を受けたら、必ず「エントリーボタン」を押すことがデリバーのルールです。\n次回からは「エントリー」を忘れずにお願いします。',
                        }
                    }
                },
                trigger: {
                    seconds: 190,
                    repeats: false
                },
            });
        }
    }
    handleOpenURL = (event) => { // D
        this.navigate(event.url);
    }

    navigate(url) {
        if (!url) return;
        let { queryParams } = Linking1.parse(url);
        if(queryParams && queryParams.token) {
            Actions.push("forgotpwd", {token: queryParams.token})
        }
    }
    UNSAFE_componentWillMount() {
        Linking.removeEventListener('url', this.handleOpenURL);
    }
    render(){
        return (
            <View style={styles.contentBg}>
                <StatusBar backgroundColor="transparent" barStyle="dark-content" translucent={true}/>
                <LinearGradient
                    colors={['rgba(192,229,250, 0.9)', 'rgba(170,220,250,1)', 'rgba(170,220,250,1)', 'rgba(170,220,250, 0.4)', 'rgba(255,255,255,0)']}
                    style={[styles.linearGradient, {top: 0, justifyContent: 'center'}]}
                >
                    <WhiteLogo />
                </LinearGradient>
                <LinearGradient
                    colors={['rgba(255,255,255,0)', 'rgba(210, 224, 217, 0.2)', 'rgb(210, 224, 217)', 'rgb(210, 224, 217)', 'rgb(210,223,215)']}
                    style={[styles.linearGradient, {bottom: 0,paddingHorizontal: 20}]}
                >
                    <TouchableOpacity style={[styles.loginBtn, {backgroundColor: Colors.secColor, position: 'absolute', bottom: 50, paddingVertical: Platform.OS == 'ios' ? 17 : 12}]} onPress={() => Actions.push("signup")}>
                        <BoldText style={[fonts.size16, {color: 'white'}]}>お客様のログイン</BoldText>
                    </TouchableOpacity>
                    
                </LinearGradient>
                <View style={{flex: 1}}>
                </View>
                <View style={{flex: 5}}>
                    <Image source={Images.login_bg_img} style={{height: '100%', width: '100%'}} resizeMode="stretch"/>
                </View>
                <View style={{flex: 1, backgroundColor: 'rgb(210,223,215)'}}>
                </View>
                <Spinner_bar color={'#27cccd'} visible={!this.state.loaded} textContent={""} overlayColor={"rgba(0, 0, 0, 0.5)"} />
            </View>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setUser : user => { dispatch(setUser(user)) },
        setTerms : terms => { dispatch(setTerms(terms))},
        setNotify : notify => { dispatch(setNotify(notify)) }
    }
}

export default connect(null,mapDispatchToProps)(Login)

const styles = StyleSheet.create({
    contentBg: {
        flex: 1,
        backgroundColor: 'rgb(210,223,215)'
    },
    loginBtn: {
        paddingVertical: Platform.OS == 'ios' ? 17 : 12,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: normalize(20),
        width: '100%',
    },
    linearGradient: {
        position: 'absolute',
        left: 0,
        right: 0,
        height: '30%',
        zIndex: 99,
        alignItems: 'center',
    },
    goDliever: {
        flexDirection: 'row', 
        alignItems: 'center', 
        marginTop: normalize(15), 
        width: '100%'
    },
    signupBtn: {
        borderColor: Colors.mainColor, 
        borderWidth: 1, 
        backgroundColor: '#ecfaf3'
    }
});


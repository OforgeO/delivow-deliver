import React from 'react';
import { StyleSheet, Image, View, TouchableOpacity, Text, Platform, Linking, AsyncStorage } from 'react-native';
import Images from "../../assets/Images";
import { normalize, fonts,margin } from '../../assets/styles';
import { connect } from "react-redux";
import { setUser, setTerms, setNotify, setShowDeliver } from '../../actions';
import {Actions} from 'react-native-router-flux';
import store from '../../store/configuteStore';
import Colors from '../../constants/Colors';
import Logo from '../../assets/images/logo.svg';
import { RegularText, BoldText } from '../../components/StyledText';
import * as Linking1 from 'expo-linking'
import * as SecureStore from 'expo-secure-store';
import * as Notifications from 'expo-notifications';
import { updatePushToken } from '../../api';
TouchableOpacity.defaultProps = { activeOpacity: 0.8 };

class Signup extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            is_login: true
        };
    }
    async componentDidMount(){
        await this.registerForPushNotificationsAsync();
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
        } else {
            Linking.addEventListener('url', this.handleOpenURL);
        }
        //SecureStore.deleteItemAsync("token")
        let token = await SecureStore.getItemAsync("token")
        if(token && store.getState().user && store.getState().user.uid) {
            this.setState({is_login: true})
            Actions.reset("root")
        } else {
            this.setState({is_login: false})
        }
    }

    registerForPushNotificationsAsync = async () => {
        try {
          let token = await Notifications.getExpoPushTokenAsync();
          this.updateToken(token.data)
        } catch (error) {
            this.updateToken('')
        }
    };

    async updateToken(token) {
        await updatePushToken(token)
        .then(async (response) => {
        })
        .catch((error) => {
        });
    }

    handleNotification(notify_data, type) {
        console.log(notify_data)
        if(notify_data.type == "terms" || notify_data.type == "commercial" || notify_data.type == "personal") {
            let termsInfo = store.getState().terms
            if(notify_data.type == "terms")
                termsInfo.terms = true
            else if(notify_data.type == "commercial")
                termsInfo.commercial = true
            else if(notify_data.type == "personal")
                termsInfo.personal = true
            this.props.setTerms(termsInfo)
        } else if(notify_data.type == "chat") {
            if(Actions.currentScene != "chat" && Actions.currentScene != 'chatlist'){
                Actions.push("chatlist", { order_uid: notify_data.order_uid, author: store.getState().user, store_name: notify_data.store_name })
            }
            else
                Actions.refresh();
        } else if(notify_data.type == "delivery_before_attend" || notify_data.type == "delivery_order_request" || notify_data.type == "delivery_order_car" || notify_data.type == "delivery_request_attend" || notify_data.type == "delivery_order_cancel") {
            let notify = store.getState().notify
            if(notify_data.aps) {
                notify.title = notify_data.aps.alert.title
                notify.subtitle = notify_data.aps.alert.body
            }
            if(notify_data.type == "delivery_before_attend"){
                notify.delivery_before_attend = true
            }
            else if(notify_data.type == "delivery_order_request")
            {
                notify.delivery_order_request = true
                notify.request_order_uid = notify_data.order_uid
            }
            else if(notify_data.type == "delivery_order_car"){
                notify.delivery_order_car = true
                notify.request_order_uid = notify_data.order_uid
            }
            else if(notify_data.type == "delivery_request_attend"){
                notify.delivery_request_attend = true
            }
            else if(notify_data.type == "delivery_order_cancel"){
                notify.delivery_order_cancel = true
            }
            this.props.setNotify(notify)
        } else if(notify_data.type == "cancel_delivering") {
            let notify = store.getState().notify
            notify.cancel_delivering = true
            notify.title = notify_data.aps.alert.title
            notify.subtitle = '';
            this.props.setNotify(notify)
            
            let orderUid = store.getState().showDeliver.orderUid
            let orderBookUid = store.getState().showDeliver.orderBookUid
            
            if(orderBookUid.length > 0) {
                for(var i = 0;i<orderBookUid.length;i++) {
                    if(orderBookUid[i] == notify_data.order_uid){
                        orderBookUid.splice(i, 1)
                        break;
                    }
                }
            }
            if(orderUid.length > 0) {
                for(var i = 0;i<orderUid.length;i++) {
                    if(orderUid[i] == notify_data.order_uid){
                        orderUid.splice(i, 1)
                        break;
                    }
                }
            }

            this.props.setShowDeliver({
                showDeliver: orderUid.length > 0 ? true : false,
                showBookDeliver: orderBookUid.length > 0 ? true : false,
                orderUid: orderUid,
                orderBookUid: orderBookUid
            })
        } else if(notify_data.body  && (notify_data.body.type == "delivery_decide" || notify_data.body.type == "delivery_no_entry")) {
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
        }
        if(notify_data.type == "delivery_order_request" || notify_data.type == "delivery_order_car") {
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
                {
                    !this.state.is_login ?
                    <View style={{flex: 1}}>
                        <View style={{flex: 1, justifyContent: 'flex-end',marginBottom: 50, alignItems: 'center'}}>
                            <Logo />
                        </View>
                        <View style={{flex: 1, paddingHorizontal: normalize(20),marginTop: 40, zIndex: 99}}>
                            
                            <TouchableOpacity style={[styles.loginBtn, {backgroundColor: Colors.mainColor, marginTop: normalize(30), borderColor: Colors.mainColor, borderWidth: 1}]} onPress={() => Actions.push("phonelogin")}>
                                <BoldText style={[fonts.size16, {color: 'white'}]}>デリバーのログイン</BoldText>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.loginBtn, styles.fbLogin, { borderColor: Colors.mainColor}]} onPress={() => Actions.push("phonesignup")}>
                                <BoldText style={[fonts.size16, {color: Colors.mainColor}]}>デリバーの新規登録 </BoldText>
                            </TouchableOpacity>
                            
                            <BoldText style={[margin.mt4]}>※新規登録をされる方へ</BoldText>
                            <RegularText style={{paddingTop: 0, lineHeight: 18}}>登録作業はできますが、<RegularText style={[{color: Colors.redColor}]}>本登録には面接が必要</RegularText>です。ご登録後、本部よりご連絡します。</RegularText>
                            
                        </View>
                        <Image source={Images.right_cloud} style={{position: 'absolute', right: -70, top: -20}} />
                        <Image source={Images.left_cloud} style={{position: 'absolute', bottom: -50, left: -50}} />
                    </View>
                    :
                    null
                }
                
            </View>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setUser : user => { dispatch(setUser(user)) },
        setTerms : terms => { dispatch(setTerms(terms))},
        setNotify : notify => { dispatch(setNotify(notify)) },
        setShowDeliver : showDeliver => { dispatch(setShowDeliver(showDeliver))}
    }
}

export default connect(null,mapDispatchToProps)(Signup)

const styles = StyleSheet.create({
    contentBg: {
        flex: 1,
        justifyContent: "space-between"
    },
    loginBtn: {
        paddingVertical: Platform.OS == 'ios' ? 17 : 12,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%'
    },
    goDliever: {
        flexDirection: 'row', 
        alignItems: 'center', 
        marginTop: normalize(20), 
        width: '100%'
    },
    fbLogin: {
        borderColor: Colors.mainColor, 
        borderWidth: 1, 
        marginTop: normalize(10)
    }
});

import * as React from 'react';
import { View, Platform, StyleSheet,TouchableOpacity } from "react-native";
import Colors from '../constants/Colors';
import { shared, fonts, margin, normalize } from './../assets/styles';
import { Actions } from 'react-native-router-flux';
import { RegularText, BoldText } from './StyledText';
import Modal from 'react-native-modal';
import { connect } from "react-redux";
import { setNotify, setShowDeliver } from '../actions';
import store from '../store/configuteStore';
import { FontAwesome, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';
import { confirmOrder } from '../api';
class AlertModal extends React.Component {

    constructor(props){
        super(props);
        this.state = {
        };
    }
    componentDidMount() {
    }
    confirmBtn(type) {
        if(type != 'delivery_decide')
            this.disable(type)
        if(type == "delivery_before_attend" || type == "delivery_request_attend") {
            if(Actions.currentScene != "todayshift")
                Actions.push("todayshift")
        } else if(type == "delivery_order_request") {
            confirmOrder(store.getState().notify.request_order_uid)
            .then(async (response) => {
                if(response.status == 1) {
                    Notifications.scheduleNotificationAsync({
                        content: {
                            title: response.info.store_name,
                            body: response.info.store_name+'\n・調理目安時間：約'+response.info.cooking_time+'分\n・町名：'+response.info.store_address,
                            data: {
                                body: {
                                    "type": "delivery_decide",
                                    "title": "あなたがこの注文のデリバーに決まりました！",
                                    "body": response.info.store_name+'\n・調理目安時間：約'+response.info.cooking_time+'分\n・町名：'+response.info.store_address,
                                    "order_uid" : store.getState().notify.request_order_uid
                                }
                            }
                        },
                        trigger: {
                            seconds: 5,
                            repeats: false
                        },
                    });
                }
                let notify = store.getState().notify
                notify.request_order_uid = ''
                notify.store_name = response.info.store_name
                this.props.setNotify(notify)
            })
            .catch((error) => {
                let notify = store.getState().notify
                notify.request_order_uid = ''
                this.props.setNotify(notify)
            });
        } else if(type == "delivery_decide") {
            let notify = store.getState().notify
            notify.delivery_decide = false
            this.props.setNotify(notify)
            Actions.push("checkmap", {order_uid: store.getState().notify.order_uid, type: 'show_modal', mapType: 'deliver_store', store_name: notify.store_name})
        }
    }
    cancelBtn(type) {
        if(type == "delivery_decide"){
            let notify = store.getState().notify
            let orderUid = store.getState().showDeliver.orderUid
            if(orderUid.length > 0) {
                exist = 0;
                for(var i = 0;i< orderUid.length;i++) {
                    if(orderUid[i] == notify.order_uid) {
                        exist = 1;
                        break;
                    }
                }
                if(exist == 0)
                    orderUid.push(notify.order_uid)
            } else 
                orderUid.push(notify.order_uid)

            this.props.setShowDeliver({
                showDeliver: true,
                showBookDeliver: store.getState().showDeliver.showBookDeliver,
                orderUid: orderUid,
                orderBookUid: store.getState().showDeliver.orderBookUid
            })
        }
        this.disable(type)
    }
    async disable(type) {
        let notify = store.getState().notify
        if(type == "delivery_before_attend")
            notify.delivery_before_attend = false
        else if(type == "delivery_order_request"){
            notify.delivery_order_request = false
            notify.delivery_order_car = false
            notify.delivery_order_serveral = false
            await Notifications.cancelAllScheduledNotificationsAsync();
        }
        else if(type == "delivery_decide"){
            notify.delivery_decide = false
            notify.order_uid = ''
        }
        else if(type == "delivery_no_entry"){
            notify.delivery_no_entry = false
            await Notifications.cancelAllScheduledNotificationsAsync();
        }
        else if(type == "delivery_request_attend")
            notify.delivery_request_attend = false
        else if(type == "delivery_order_cancel")
            notify.delivery_order_cancel = false
        else if(type == "cancel_delivering"){
            notify.cancel_delivering = false
            setTimeout(function() {
                Actions.reset("root")
            }, 200)
        }
        this.props.setNotify(notify)
    }
    render() {
        return (
            <Modal
                isVisible={store.getState().notify.delivery_before_attend || store.getState().notify.delivery_order_request || store.getState().notify.delivery_decide || store.getState().notify.delivery_no_entry || store.getState().notify.delivery_order_car || store.getState().notify.delivery_order_serveral || store.getState().notify.delivery_request_attend || store.getState().notify.delivery_order_cancel || store.getState().notify.cancel_delivering}
                onBackdropPress={() => this.setState({visible: false})}
                style={styles.modal}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.container}>
                        {
                            store.getState().notify.delivery_before_attend || store.getState().notify.delivery_decide || store.getState().notify.delivery_no_entry || store.getState().notify.delivery_request_attend || store.getState().notify.delivery_order_cancel || store.getState().notify.cancel_delivering ?
                            null
                            :
                            store.getState().notify.delivery_order_request || store.getState().notify.delivery_order_car || store.getState().notify.delivery_order_serveral ?
                            <View style={[shared.flexCenter, {justifyContent: 'center'}]}>
                                <MaterialCommunityIcons name={"clock"} size={20} color={"#CE082E"} />
                                <BoldText style={[margin.ml1, fonts.size18, {color: '#CE082E', paddingTop: 0}]}>あと3：00</BoldText>
                            </View>
                            :
                            null
                        }
                        <View style={styles.header}>
                            <BoldText style={[fonts.size18, {textAlign: 'center', lineHeight: 20, color: store.getState().notify.delivery_no_entry || store.getState().notify.delivery_order_cancel || store.getState().notify.cancel_delivering ? '#CE082E' : 'black'}]}>{store.getState().notify.title}</BoldText>
                        </View>
                        {
                            store.getState().notify.subtitle ?
                            <View style={styles.body}>
                                <RegularText style={[fonts.size14, {textAlign: 'center', lineHeight: 18}]}>{store.getState().notify.subtitle}</RegularText>
                            </View>
                            :
                            null
                        }
                        
                        {
                            store.getState().notify.delivery_before_attend || store.getState().notify.delivery_order_request || store.getState().notify.delivery_no_entry || store.getState().notify.delivery_order_car || store.getState().notify.delivery_order_serveral || store.getState().notify.delivery_request_attend || store.getState().notify.delivery_order_cancel || store.getState().notify.cancel_delivering ?
                            null
                            :
                            store.getState().notify.delivery_decide ?
                            <View style={[margin.mt2, {alignItems: 'center'}]}>
                                <RegularText style={{color: '#CE082E'}}>※3分以内に押さない場合、</RegularText>
                                <RegularText style={{color: '#CE082E'}}>飲食店から確認の連絡が入ります。</RegularText>
                            </View>
                            :
                            null
                        }
                    </View>
                    {
                        store.getState().notify.delivery_no_entry ?
                        <TouchableOpacity style={styles.button} onPress={() => this.confirmBtn("delivery_no_entry")}>
                            <RegularText style={[fonts.size18, {color: Colors.secColor, textAlign: 'center'}]}>OK</RegularText>
                        </TouchableOpacity>
                        :
                        store.getState().notify.delivery_before_attend ?
                        <View>
                            <TouchableOpacity style={[styles.doubleBtn, styles.topBtn]} onPress={() => this.cancelBtn("delivery_before_attend")}>
                                <RegularText style={[fonts.size18, {color: Colors.secColor, textAlign: 'center'}]}>はい、頑張ります！</RegularText>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.doubleBtn} onPress={() => this.confirmBtn("delivery_before_attend")}>
                                <RegularText style={[fonts.size18, {color: Colors.secColor, textAlign: 'center'}]}>シフトを変更</RegularText>
                            </TouchableOpacity>
                        </View>
                        :
                        store.getState().notify.delivery_order_request || store.getState().notify.delivery_order_car || store.getState().notify.delivery_order_serveral ?
                        <TouchableOpacity style={styles.button} onPress={() => this.confirmBtn("delivery_order_request")}>
                            <RegularText style={[fonts.size18, {color: Colors.secColor, textAlign: 'center'}]}>エントリー</RegularText>
                        </TouchableOpacity>
                        :
                        store.getState().notify.delivery_decide ?
                        <View>
                            <TouchableOpacity style={[styles.doubleBtn, styles.topBtn]} onPress={() => this.cancelBtn("delivery_decide")}>
                                <RegularText style={[fonts.size18, {color: Colors.secColor, textAlign: 'center'}]}>今すぐお店へ向かう</RegularText>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.doubleBtn} onPress={() => this.confirmBtn("delivery_decide")}>
                                <RegularText style={[fonts.size18, {color: Colors.secColor, textAlign: 'center'}]}>MAPを見る</RegularText>
                            </TouchableOpacity>
                        </View>
                        :
                        store.getState().notify.delivery_request_attend ?
                        <View style={shared.flexCenter}>
                            <TouchableOpacity style={[styles.doubleBtn, styles.firstBtn, {flex: 1}]} onPress={() => this.cancelBtn("delivery_request_attend")}>
                                <RegularText style={[fonts.size18, {color: '#848484', textAlign: 'center'}]}>やめておく</RegularText>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.doubleBtn, {flex: 1}]} onPress={() => this.confirmBtn("delivery_request_attend")}>
                                <BoldText style={[fonts.size18, {color: Colors.secColor, textAlign: 'center'}]}>助けます！</BoldText>
                            </TouchableOpacity>
                        </View>
                        :
                        store.getState().notify.delivery_order_cancel ?
                        <TouchableOpacity style={styles.button} onPress={() => this.confirmBtn("delivery_order_cancel")}>
                            <RegularText style={[fonts.size18, {color: Colors.secColor, textAlign: 'center'}]}>閉じる</RegularText>
                        </TouchableOpacity>
                        :
                        store.getState().notify.cancel_delivering ?
                        <TouchableOpacity style={styles.button} onPress={() => this.confirmBtn("cancel_delivering")}>
                            <RegularText style={[fonts.size18, {color: Colors.secColor, textAlign: 'center'}]}>閉じる</RegularText>
                        </TouchableOpacity>
                        :
                        null
                    }
                </View>
            </Modal>
        );
    }
}
const mapDispatchToProps = dispatch => {
    return {
        setNotify : notify => { dispatch(setNotify(notify)) },
        setShowDeliver : showDeliver => { dispatch(setShowDeliver(showDeliver))}
    }
}
const mapStateToProps = (state) => {
    return {
        notify : state.notify,
        showDeliver: state.showDeliver
    }
}
export default connect(mapStateToProps,mapDispatchToProps)(AlertModal)

const styles = StyleSheet.create({
    modal: {
        alignItems: 'center'
    },
    modalContainer: {
        backgroundColor: '#F2F2F2', width: '80%', borderRadius: 11
    },
    container: {
        padding: normalize(15),
        borderBottomWidth: 1,
        borderBottomColor: '#b0b0b1'
    },
    header: {
        marginTop: 10
    },
    body: {
        paddingTop: 10
    },
    button: {
        paddingVertical: 15
    },
    doubleBtn: {
        paddingVertical: 15,
    },
    firstBtn: {
        borderRightColor: '#b0b0b1',
        borderRightWidth: 1
    },
    topBtn: {
        borderBottomWidth: 1,
        borderBottomColor: '#b0b0b1',
        alignItems: 'center'
    }
});
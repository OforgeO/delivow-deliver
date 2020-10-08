import React from 'react';
import { StyleSheet, View, Platform, Text, Linking, TouchableOpacity, StatusBar, SafeAreaView, Alert } from 'react-native';
import { shared, fonts, margin, normalize } from '../../assets/styles';
import { ScrollView } from 'react-native-gesture-handler';
import { Actions } from 'react-native-router-flux';
import { FontAwesome, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { Container, Content, Col } from 'native-base';
import Colors from '../../constants/Colors';
import List from '../../components/List';
import Constants from "expo-constants";
import Tag from '../../components/Tag';
import { RegularText, BoldText } from '../../components/StyledText';
import Spinner_bar from 'react-native-loading-spinner-overlay';
import { showToast } from '../../shared/global';
import { getOrderDetails, calcDistance, departStore, completeDelivery, setDeliveryStatus, getUser } from '../../api';
import moment from 'moment';
import Back from '../../components/Back';
import { _e } from '../../lang';
import { connect } from "react-redux";
import store from '../../store/configuteStore';
import { setShowDeliver, setNotify } from '../../actions';
import firebase from '../../Fire';
export const usersRef = firebase.database().ref('Users')
export const chatsRef = firebase.database().ref('Chats')
export const messagesRef = firebase.database().ref('chatMessages')
export const userChatsRef = firebase.database().ref('userChats')
export const serverTimestamp = firebase.database.ServerValue.TIMESTAMP
class BookRequestDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tabType: 1,
            orderList: null,
            orderStauts: 1, //1: selected, 2: checkall, 3:,
            loaded: true,
            customerInfo: null,
            orderInfo: null,
            arriveStore: null,
            arriveTarget: null,
            is_cutlery: true,
            cutleryCheck: false,
            admin_phone: null,
            is_attend: false
        }
    }
    async componentDidMount() {
        this.refresh()

    }
    UNSAFE_componentWillReceiveProps() {
        this.refresh();
    }
    async refresh() {
        this.setState({ loaded: false })
        await getUser()
        .then(async (response) => {

            if(response.status == 1) {
                this.setState({is_attend: response.user.is_attend})
            }
        })
        .catch((error) => {
        });

        await getOrderDetails(this.props.order_uid)
        .then(async (response) => {
            console.log(response)
            if (response.status == 1) {
                this.setState({ orderInfo: response.info })
                if(response.info.status == 'cancelling' || response.info.status == 'cancel')
                    Actions.reset("mypage")
                if(response.info.status == 'delivering')
                    this.setState({orderStauts: 4})
                if(!response.info.is_cutlery){
                    this.setState({is_cutlery: false})
                    this.setState({cutleryCheck: true})
                }
                this.setState({ customerInfo: response.customer })
                this.getAddress(response.my_location, response.customer.location, response.info.store_location)
                this.setState({ orderList: response.info.products })
                this.setState({ admin_phone: response.admin_phone })
            } else {
                showToast(response.message)
                this.setState({ loaded: true });
            }
        })
        .catch((error) => {
            this.setState({ loaded: true });
        });
    }
    async departStore () {
        this.setState({ loaded: false })
        await departStore(this.props.order_uid)
        .then(async (response) => {
            console.log(response)
            if (response.status == 1) {
                this.setState({ orderStauts: 4 })
                let status = store.getState().showDeliver
                let orderUid = status.orderUid
                let orderBookUid = status.orderBookUid
                if(orderUid.length > 0) {
                    let exist = 0;
                    for(var i = 0;i< orderUid.length;i++) {
                        if(orderUid[i] == this.props.order_uid) {
                            exist = 1;
                            break;
                        }
                    }
                    if(exist == 0)
                        orderUid.push(this.props.order_uid)
                } else {
                    orderUid.push(this.props.order_uid)
                }
                if(orderBookUid.length > 0) {
                    for(var i = 0;i<orderBookUid.length;i++) {
                        if(orderBookUid[i] == this.props.order_uid){
                            orderBookUid.splice(i, 1)
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

            } else {
                if(response.refresh && response.refresh == 1) {
                    let notify = store.getState().notify
                    notify.cancel_delivering = true
                    notify.title = "配達中の商品が飲食店の承認により\n\nキャンセル処理されました。"
                    notify.subtitle = '';
                    this.props.setNotify(notify)
                } else {
                    showToast(response.message)
                }
            }
            this.setState({ loaded: true });
        })
        .catch((error) => {
            this.setState({ loaded: true });
            showToast();
        });
    }
    async getAddress(my_location, customer_location, store_location) {
        await calcDistance(store_location[0], store_location[1], customer_location[0], customer_location[1])
        .then(async (result) => {
            if (result.status == "OK" && result.rows[0].elements[0].duration.value) {
                let time = result.rows[0].elements[0].duration.value
                this.setState({ arriveTarget: time })
                this.setState({ loaded: true });
            } else {
                this.setState({ loaded: true });
            }
        })
        .catch((error) => {
            this.setState({ loaded: true });
        });
                
    }
    checkOption(id) {
        if (this.state.orderStauts <= 2 || this.state.orderInfo.status == 'accepted') {
            if (this.state.orderStauts == 0)
                this.setState({ orderStauts: 1 })
            let temp = this.state.orderList
            let checkAll = 1
            for (var i = 0; i < temp.length; i++) {
                if (temp[i].product_uid == id) {
                    temp[i].selected = !temp[i].selected
                }
                if (!temp[i].selected)
                    checkAll = 0;
                if(temp[i].options && temp[i].options.length > 0) {
                    temp[i].options.map((option, j) => {
                        if(option.list && option.list.length > 0) {
                            option.list.map((list, index) => {
                                if(!list.selected)
                                    checkAll = 0;
                            })
                        }
                    })
                }
            }
            if(checkAll == 1 && this.state.cutleryCheck) 
                this.setState({orderStauts: 2})
            else
                this.setState({orderStauts: 1})
            this.setState({ orderList: temp })
        }
    }
    checkCultleryOption() {
        if (this.state.orderStauts <= 2 || this.state.orderInfo.status == 'accepted') {
            this.setState({cutleryCheck : !this.state.cutleryCheck})
            let temp = this.state.orderList
            let checkAll = 1
            for (var i = 0; i < temp.length; i++) {
                if (!temp[i].selected)
                    checkAll = 0;
                if(temp[i].options && temp[i].options.length > 0) {
                    temp[i].options.map((option, j) => {
                        if(option.list && option.list.length > 0) {
                            option.list.map((list, index) => {
                                if(!list.selected)
                                    checkAll = 0;
                            })
                        }
                    })
                }
            }
            
            if(checkAll == 1 && !this.state.cutleryCheck) {
                this.setState({orderStauts: 2})
            } else {
                this.setState({orderStauts: 1})
            }
        }
    }
    nextStep() {
        let my_id = store.getState().user.uid
        if(my_id != this.state.orderInfo.deliver_uid) {
            Actions.pop();
        } else {
            if (this.state.orderStauts < 3) {
                let temp = this.state.orderList
                let checkAll = 1
                for (var i = 0; i < temp.length; i++) {
                    if (!temp[i].selected)
                        checkAll = 0;
                    if(temp[i].options && temp[i].options.length > 0) {
                        temp[i].options.map((option, j) => {
                            if(option.list && option.list.length > 0) {
                                option.list.map((list, index) => {
                                    if(!list.selected)
                                        checkAll = 0;
                                })
                            }
                        })
                    }
                }
                if (checkAll == 1){
                    
                    Alert.alert(
                        "飲食店を出発しましたか？",
                        "お客様に出発の通知が送られます。",
                        [
                            {
                                text: 'いいえ',
                                onPress: () => console.log("Cancel Pressed"),
                                style: "cancel"
                            },
                            {
                                text: "はい", onPress: () => {
                                    this.setState({ orderStauts: 3 })
                                    this.departStore()
                                }
                            }
                        ],
                        { cancelable: false }
                    );
                }
                else {
                    Alert.alert("全てのメニューにチェックを入れてください")
                }
            }
            else if (this.state.orderStauts == 3) {
                Alert.alert(
                    "飲食店を出発しましたか？",
                    "お客様に出発の通知が送られます。",
                    [
                        {
                            text: 'いいえ',
                            onPress: () => console.log("Cancel Pressed"),
                            style: "cancel"
                        },
                        {
                            text: "はい", onPress: () => {
                                this.departStore()
                            }
                        }
                    ],
                    { cancelable: false }
                );
            } else if (this.state.orderStauts == 4) {
                Alert.alert(
                    "お届け完了後は、お客様・飲食店に連絡ができなくなります。お届け完了で間違いないですか？",
                    "",
                    [
                        {
                            text: "はい、お届け完了です！",
                            onPress: () => this.endComplete()
                        },
                        {
                            text: "いいえ、まだ配達中です",
                            onPress: () => console.log("Cancel Pressed"),
                            style: "cancel"
                        },
                        { text: "お客様または飲食店に連絡", onPress: () => this.chat("both") },
                    ],
                    { cancelable: false }
                );
            }
        }
        
    }
    renderOrderList(products) {
        return products.map((product, index) => {
            return <View key={index+"-"+product.product_uid}>
                <TouchableOpacity  onPress={() => this.checkOption(product.product_uid)}>
                    <View key={product.product_uid} style={[shared.flexCenter, { justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: '#f2f2f2', paddingVertical: 13 }]}>
                    <View style={[shared.flexCenter, { flex: 1, alignItems: 'flex-start' }]}>
                        <FontAwesome name={"check-circle"} size={20} color={product.selected || (this.state.orderInfo && this.state.orderInfo.status == 'delivering') ? Colors.secColor : '#848484'} />
                        <BoldText style={[fonts.size14, margin.ml1, { color: product.selected || (this.state.orderInfo && this.state.orderInfo.status == 'delivering') ? 'black' : '#848484' }]}>{product.product_name}</BoldText>
                    </View>
                    <RegularText style={[fonts.size14, { color: product.selected || (this.state.orderInfo && this.state.orderInfo.status == 'delivering') ? 'black' : '#848484', width: 120, textAlign: 'right' }]}>数量 {product.quantity}</RegularText>
                    
                </View>
            </TouchableOpacity>
            {
                product.options && product.options.length > 0 ?
                this.renderOption(product.product_uid, product.options)
                :
                null
            }
            </View>
        })
    }
    renderOption(product_id, options) {
        return options.map((option) => {
            if(option.list && option.list.length > 0) {
                return option.list.map((list, index) => {
                    return <View key={product_id+"-"+option.category_id+"-"+index} style={[shared.flexCenter, { justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: '#f2f2f2', paddingVertical: 13 }]}>
                        <TouchableOpacity style={[shared.flexCenter, { flex: 1, alignItems: 'flex-start' }]} onPress={() => this.checkDetailOption(product_id, option.category_id, index)}>
                            <FontAwesome name={"check-circle"} size={20} color={list.selected || (this.state.orderInfo && this.state.orderInfo.status == 'delivering') ? Colors.secColor : '#848484'} />
                            <BoldText style={[fonts.size14, margin.ml1, { color: list.selected || (this.state.orderInfo && this.state.orderInfo.status == 'delivering') ? 'black' : '#848484' }]}>{list.option_name}</BoldText>
                        </TouchableOpacity>
                        <RegularText style={[fonts.size14, { color: list.selected || (this.state.orderInfo && this.state.orderInfo.status == 'delivering') ? 'black' : '#848484', width: 120, textAlign: 'right' }]}>数量 {list.quantity}</RegularText>
                    </View>
                })
            }
        })
    }
    checkDetailOption(product_id, category_id, option_index) {
        
        if ((!this.props.confirm && this.state.orderStauts <= 2) || this.state.orderInfo.status == 'accepted') {
            if (this.state.orderStauts == 0)
                this.setState({ orderStauts: 1 })
            let temp = this.state.orderList
            let checkAll = 1
            for(var i = 0;i<temp.length;i++) {
                if(!temp[i].selected){
                    checkAll = 0;
                }
                if(temp[i].options && temp[i].options.length > 0) {
                    temp[i].options.map((option, j) => {
                        if(option.list && option.list.length > 0) {
                            option.list.map((list, index) => {
                                if(option_index == index && product_id == temp[i].product_uid && category_id == option.category_id) {
                                    temp[i].options[j].list[index].selected = !temp[i].options[j].list[index].selected
                                }
                                if(!temp[i].options[j].list[index].selected)
                                    checkAll = 0;
                            })
                        }
                    })
                }
            }
            if(checkAll == 1 && this.state.cutleryCheck) 
                this.setState({orderStauts: 2})
            else
                this.setState({orderStauts: 1})
            this.setState({ orderList: temp })
        }
    }
    async sendMessage(params ) {
        const author = params.author
        const target = params.target
        const roomId = (author.uid < target.uid) ? author.uid + target.uid : target.uid + author.uid
        
        const authroom = await userChatsRef.child(author.uid).once('value')
        let roomList = authroom.val()
        if (roomList === null) {
            roomList = [roomId]
        } else if (!roomList.includes(roomId)) {
            roomList.push(roomId)
        }
        await userChatsRef.child(author.uid).set(roomList)
        const targetRoom = await userChatsRef.child(target.uid).once('value')
        let targetRoomList = targetRoom.val()
        if (targetRoomList === null) {
            targetRoomList = [roomId]
        } else if (Object.values(targetRoomList).indexOf(roomId) <= -1) {
            targetRoomList.push(roomId)
        }
        await userChatsRef.child(target.uid).set(targetRoomList)
        await chatsRef.child(roomId).set({
            lastMessageSent: '',
            lastMessageTimestamp: serverTimestamp,
            members: [author.uid, target.uid],
            senderPhone: author.phone,
            receiverPhone: target.phone,
            senderName: author.name,
            senderAvatar: author.avatar,
            receiverName: target.name,
            receiverAvatar: target.avatar,
            senderRole: author.role,
            receiverRole: target.role,
            senderUID: author.uid,
            receiverUID: target.uid
        })
    }
    async chat(type) {
        let myInfo = store.getState().user
        if(type == 'both') {
            this.setState({loaded: false})
            await this.toStoreChat()
            await this.toCustomerChat()
            this.setState({loaded: true})
            Actions.push("chatlist", { store_name: this.state.orderInfo.store_name, author: myInfo, order_uid: this.props.order_uid})
        } else {
            this.setState({loaded: false})
            if(type== 'store'){
                await this.toStoreChat()
            } else if(type == 'customer') {
                await this.toCustomerChat()
            }
            this.setState({loaded: true})
            Actions.push("chatlist", {store_name: this.state.orderInfo.store_name, author: myInfo, order_uid: this.props.order_uid})
        }
        
    }
    async toStoreChat() {
        let myInfo = store.getState().user
        await this.sendMessage({
            author: {
                uid: myInfo.uid,
                name: myInfo.first_name + ' ' + myInfo.last_name,
                avatar: myInfo.photo,
                phone: myInfo.phone,
                role: 'deliver'
            },
            target: {
                uid: this.state.orderInfo.store.uid,
                name: this.state.orderInfo.store.name,
                avatar: this.state.orderInfo.store.photo,
                phone: this.state.orderInfo.store.phone,
                role: 'store'
            },
            message: "Hi, there!"
        })
    }
    async toCustomerChat() {
        let myInfo = store.getState().user
        await this.sendMessage({
            author: {
                uid: myInfo.uid,
                name: myInfo.first_name + ' ' + myInfo.last_name,
                avatar: myInfo.photo,
                phone: myInfo.phone,
                role: 'deliver'
            },
            target: {
                uid: this.state.customerInfo.uid,
                name: this.state.customerInfo.name,
                avatar: this.state.customerInfo.photo,
                phone: this.state.customerInfo.phone,
                role: 'customer'
            },
            message: "Hi, there!"
        })
    }
    phoneCall(phone) {
        if(phone)
            Linking.openURL("tel:"+phone)
        else
            Alert.alert(_e.noPhone)
    }
    endShift() {
        Alert.alert(
            "この配達でシフトを終了しますか？",
            "",
            [
                {
                    text: "いいえ",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                { text: "はい", onPress: () => this.endToday() }
            ],
            { cancelable: false }
        );
    }
    async endToday() {
        this.setState({ loaded: false })
        await setDeliveryStatus('pause', '' , '')
        .then(async (response) => {
            if(response.status == 1) {
                Actions.refresh();
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
    removeFromFB(store_uid, customer_uid, deliver_uid) {
        var _self = this;
        userChatsRef.once('value', function(snapshot) {
            let userChats = snapshot.val()
            for(const property in userChats) {
                if(property == store_uid) {
                    userChatsRef.child(store_uid).once('value', function(snap) {
                        snap.forEach(function(s){
                            if(s.val() == store_uid < customer_uid ? store_uid+customer_uid : customer_uid+store_uid || s.val() == store_uid < deliver_uid ? store_uid+deliver_uid : deliver_uid+store_uid) {
                                userChatsRef.child(store_uid).child(s.key).remove();
                                _self.removeChat(s.val())
                            }
                        });
                    });
                } else if(property == customer_uid) {
                    userChatsRef.child(customer_uid).once('value', function(snap) {
                        snap.forEach(function(s){
                            if(s.val() == customer_uid < store_uid ? customer_uid+store_uid : store_uid+customer_uid || s.val() == customer_uid < deliver_uid ? customer_uid+deliver_uid : deliver_uid+customer_uid) {
                                userChatsRef.child(customer_uid).child(s.key).remove();
                                _self.removeChat(s.val())
                            }
                        });
                        
                    });
                } else if(property == deliver_uid) {
                    userChatsRef.child(deliver_uid).once('value', function(snap) {
                        snap.forEach(function(s){
                            if(s.val() == deliver_uid < store_uid ? deliver_uid+store_uid : store_uid+deliver_uid || s.val() == deliver_uid < customer_uid ? deliver_uid+customer_uid : customer_uid+deliver_uid) {
                                userChatsRef.child(deliver_uid).child(s.key).remove();
                                _self.removeChat(s.val())
                            }
                        })
                    });
                }
            } 
        })
    }
    removeChat(id) {
        chatsRef.child(id).remove();
        messagesRef.child(id).remove();
    }
    async endComplete() {
        this.setState({ loaded: false })
        await completeDelivery(this.props.order_uid)
        .then(async (response) => {
            console.log(response)
            this.setState({ loaded: true });
            if (response.status == 1) {
                this.removeFromFB(response.store_uid, response.customer_uid, response.deliver_uid)
                var _self = this;
                setTimeout(function() {
                    Alert.alert("MISSION COMPLETE!配達、お疲れ様でした。", "次の配達依頼もエントリーをお願いします！", [
                        {text: "OK", onPress : () => {
                            _self.props.setShowDeliver({
                                showDeliver: false,
                                showBookDeliver: store.getState().showDeliver.showBookDeliver,
                                orderUid: [],
                                orderBookUid: store.getState().showDeliver.orderBookUid
                            })
                            Actions.reset("root")
                        } }
                    ]);
                }, 500)
            } else {
                if(response.refresh == 1) {
                    let notify = store.getState().notify
                    notify.cancel_delivering = true
                    notify.title = "配達中の商品が飲食店の承認により\n\nキャンセル処理されました。"
                    notify.subtitle = '';
                    this.props.setNotify(notify)
                } else {
                    showToast(response.message)
                }
            }
        })
        .catch((error) => {
            this.setState({ loaded: true });
            showToast();
        });
        
    }

    showMap(order_uid, type, store_name) {
        Actions.push("checkmap", { order_uid: order_uid, mapType: type, store_name: store_name })
    }
    render() {
        return (
            <Container style={[shared.mainContainer]}>
                {Platform.OS === 'ios' && <StatusBar barStyle="dark-content" backgroundColor="white" />}
                <SafeAreaView style={{ flex: 1, backgroundColor: '#f2f2f2', marginTop: Constants.statusBarHeight }}>
                    <ScrollView ref={ref => this.scrollRef = ref} >
                        <View style={{ flex: 1, backgroundColor: 'white' }}>
                            <Back color="#d3d3d3" />
                            <View style={[styles.header]}>
                                <BoldText style={[fonts.size32]}>依頼内容を確認</BoldText>
                            </View>
                            {
                                this.props.type == "confirm" ?
                                    <View style={styles.section}>
                                        <View style={shared.flexCenter}>
                                            <View style={{ flex: 1 }}>
                                                <View style={shared.flexCenter}>
                                                    <MaterialCommunityIcons color={Colors.secColor} size={14} name={"clock"} />
                                                    <RegularText style={[margin.ml1, fonts.size14, { color: '#848484' }]}>店着時間</RegularText>
                                                </View>
                                                <RegularText style={fonts.size50}>{this.state.orderInfo && this.state.orderInfo.book_date ? moment(this.state.orderInfo.book_date).subtract(this.state.arriveTarget ? this.state.arriveTarget : 0, 'seconds').format("HH:mm") : null }</RegularText>
                                                <Tag name={"cutlery"} text={this.state.orderInfo ? this.state.orderInfo.store_name : ''} font5={false} />
                                            </View>
                                            <View style={{ flex: 1 }}>
                                                <View style={shared.flexCenter}>
                                                    <MaterialCommunityIcons color={Colors.secColor} size={14} name={"clock"} />
                                                    <RegularText style={[margin.ml1, fonts.size14, { color: '#848484' }]}>お届け時間</RegularText>
                                                </View>
                                                <RegularText style={fonts.size50}>{this.state.orderInfo && this.state.orderInfo.book_date ? moment(this.state.orderInfo.book_date).format("HH:mm") : null }</RegularText>
                                                <RegularText>※前後15分以上ずれ込む場合は、必ずお客様に連絡</RegularText>
                                            </View>
                                        </View>
                                    </View>
                                    :
                                    <View style={styles.section}>
                                        <View style={shared.flexCenter}>
                                            <MaterialCommunityIcons size={14} name={"clock"} color={Colors.secColor} />
                                            <RegularText style={[{ color: '#848484' }, fonts.size14, margin.ml1]}>あなたが配達担当に決まった時間</RegularText>
                                        </View>
                                        <View style={[shared.flexCenter, { justifyContent: 'space-between', paddingVertical: 15 }]}>
                                            <TouchableOpacity onPress={() => Actions.push("todayshifttime")}>
                                                <RegularText style={fonts.size50}>{this.state.orderInfo ? moment(this.state.orderInfo.accepted_time).format("HH:mm") : null}</RegularText>
                                            </TouchableOpacity>
                                            {
                                                this.state.is_attend ?
                                                <TouchableOpacity style={[styles.endShift]} onPress={() => this.endShift()}>
                                                    <RegularText style={[{ color: Colors.secColor }]}>この配達でシフトを終了</RegularText>
                                                </TouchableOpacity>
                                                :
                                                null
                                            }
                                            
                                        </View>
                                        <View style={[shared.flexCenter, { flexWrap: 'wrap' }]}>
                                            <Tag name={"cutlery"} text={this.state.orderInfo ? this.state.orderInfo.store_name : null} font5={false} />
                                            {
                                                this.state.orderInfo && this.state.orderInfo.cooking_time ?
                                                    <Tag name={"clock"} text={"調理目安時間：" + this.state.orderInfo.cooking_time + "分"} font5={true} />
                                                    :
                                                    null
                                            }
                                        </View>
                                        {
                                            this.state.orderInfo ?
                                            <TouchableOpacity style={[shared.flexCenter, margin.mt2]} onPress={() => this.showMap(this.state.orderInfo.order_uid, 'deliver_store', this.state.orderInfo.store_name)}>
                                                <FontAwesome5 name={"map-marker-alt"} color={Colors.secColor} size={14} />
                                                <BoldText style={[fonts.size14, {color:Colors.secColor}]}>飲食店までをMAPで確認</BoldText>
                                            </TouchableOpacity>
                                            :
                                            null
                                        }
                                        
                                    </View>
                            }

                            <View style={[styles.section, { backgroundColor: '#f2f2f2' }]}>
                                <BoldText style={[fonts.size14]}>注文内容</BoldText>
                                <RegularText style={[{ lineHeight: 20, marginTop: 10, color: '#CE082E' }]}>確認したら必ずチェックをタップして、「注文内容を確認した」ボタンを押してください。</RegularText>
                            </View>
                            <View style={[styles.section, { paddingBottom: 0 }]}>
                                <View style={[shared.flexCenter, { justifyContent: 'space-between', paddingBottom: 10 }]}>
                                    <View style={shared.flexCenter}>
                                        <FontAwesome5 name={"info-circle"} size={14} color={Colors.secColor} />
                                        <BoldText style={[fonts.size14, margin.ml1]}>注文管理ナンバー</BoldText>
                                    </View>
                                    {
                                        this.state.orderInfo && this.state.orderInfo.order_uid ?
                                            <RegularText style={fonts.size14}>{this.state.orderInfo.order_uid}</RegularText>
                                            :
                                            null
                                    }

                                </View>
                                {
                                    this.state.orderInfo && this.state.orderInfo.products.length > 0 ?
                                        this.renderOrderList(this.state.orderInfo.products)
                                        :
                                        null
                                }
                                {
                                    this.state.is_cutlery ?
                                    <TouchableOpacity style={[shared.flexCenter, { justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: '#f2f2f2', paddingVertical: 13 }]} onPress={() => this.checkCultleryOption()}>
                                        <View style={[shared.flexCenter, { flex: 1, alignItems: 'flex-start' }]}>
                                            <FontAwesome name={"check-circle"} size={20} color={this.state.cutleryCheck || (this.state.orderInfo && this.state.orderInfo.status == 'delivering') ? Colors.secColor : '#848484'} />
                                            <BoldText style={[fonts.size14, margin.ml1, { color: this.state.cutleryCheck || (this.state.orderInfo && this.state.orderInfo.status == 'delivering') ? 'black' : '#848484', paddingTop: 2 }]}>カトラリー</BoldText>
                                        </View>
                                        <RegularText style={[fonts.size14, { color: this.state.cutleryCheck || (this.state.orderInfo && this.state.orderInfo.status == 'delivering') ? 'black' : '#848484', width: 120, textAlign: 'right' }]}>{this.state.orderInfo && this.state.orderInfo.is_cutlery ? 'あり' : 'いいえ'}</RegularText>
                                    </TouchableOpacity>
                                    :
                                    null
                                }
                                
                            </View>
                            <View style={[styles.section, { backgroundColor: '#f2f2f2' }]}>
                                <BoldText style={[fonts.size14]}>住所と受け取り方法</BoldText>
                            </View>
                            <View style={[styles.section, { padding: 0 }]}>
                                <View style={[shared.flexCenter, styles.method]}>
                                    <View style={shared.flexCenter}>
                                        <FontAwesome name={"user-circle"} size={14} color={Colors.secColor} />
                                        <BoldText style={[fonts.size14, margin.ml1]}>お客様氏名</BoldText>
                                    </View>
                                    {
                                        this.state.customerInfo && this.state.customerInfo.name ?
                                            <RegularText style={[fonts.size14]}>{this.state.customerInfo.name}</RegularText>
                                            :
                                            null
                                    }

                                </View>
                                <View style={[shared.flexCenter, styles.method]}>
                                    <View style={shared.flexCenter}>
                                        <FontAwesome5 name={"map-marker-alt"} size={14} color={Colors.secColor} />
                                        <BoldText style={[fonts.size14, margin.ml1]}>お届け先住所</BoldText>
                                    </View>
                                    <View style={{flex: 1, paddingLeft: 4}}>
                                        {
                                            this.state.customerInfo && this.state.customerInfo.postcode ?
                                                <RegularText style={[fonts.size14, { textAlign: 'right' }]}>〒{this.state.customerInfo.postcode}</RegularText>
                                                :
                                                null
                                        }
                                        {
                                            this.state.customerInfo && this.state.customerInfo.address ?
                                                <RegularText style={[fonts.size14, { textAlign: 'right' }]}>{this.state.customerInfo.address}</RegularText>
                                                :
                                                null
                                        }
                                        {
                                            this.state.customerInfo && this.state.customerInfo.building_name ?
                                                <RegularText style={[fonts.size14, { textAlign: 'right' }]}>{this.state.customerInfo.building_name}{this.state.customerInfo.room_name}</RegularText>
                                                :
                                                null
                                        }
                                        {
                                            this.state.orderInfo && this.state.orderInfo.order_uid ?
                                                <TouchableOpacity style={[shared.flexCenter, margin.mt3, { justifyContent: 'flex-end' }]} onPress={() => this.showMap(this.state.orderInfo.order_uid, this.props.type == "confirm" ? 'store_customer' : 'deliver_customer', this.state.orderInfo.store_name)}>
                                                    <FontAwesome5 name={"map-marker-alt"} size={14} color={Colors.secColor} />
                                                    <BoldText style={[fonts.size14, { color: Colors.secColor}]}>{this.props.type == "confirm" ? "MAPで見る" : "お届け先までをMAPで確認"}</BoldText>
                                                </TouchableOpacity>
                                                :
                                                null
                                        }

                                    </View>
                                </View>
                                <View style={[shared.flexCenter, styles.method]}>
                                    <View style={[shared.flexCenter, { width: 170 }]}>
                                        <FontAwesome5 name={"pen-alt"} size={14} color={Colors.secColor} />
                                        <BoldText style={[fonts.size14, margin.ml1]}>お客様からのメモ</BoldText>
                                    </View>
                                    {
                                        this.state.customerInfo && this.state.customerInfo.address_note ?
                                            <View style={{flex: 1, paddingLeft: 4}}>
                                                <RegularText style={[fonts.size14, { textAlign: 'right', flex: 1, flexWrap: 'wrap' }]}>{this.state.customerInfo.address_note}</RegularText>
                                            </View>
                                            :
                                            null
                                    }

                                </View>
                                {
                                    this.props.type == "delivering" ?
                                        <View style={[styles.method]}>
                                            <View style={[shared.flexCenter]}>
                                                <MaterialCommunityIcons name={"clock"} size={14} color={Colors.secColor} />
                                                <BoldText style={[fonts.size14, margin.ml1]}>お届け時間</BoldText>
                                            </View>
                                            <View style={[shared.flexCenter, { flex: 1 }]}>
                                                <View style={{ flex: 1 }}>
                                                    <RegularText style={fonts.size50}>{this.state.orderInfo && this.state.orderInfo.arrive_predict_time ? moment(this.state.orderInfo.arrive_predict_time).format("HH:mm") : null}</RegularText>
                                                </View>
                                                <View style={{ flex: 1 }}>
                                                    <RegularText style={fonts.size14}>※15分以上遅れる場合は、必ずお客様に連絡をしてください。</RegularText>
                                                </View>
                                            </View>
                                        </View>
                                        :
                                        null
                                }
                                <View style={[shared.flexCenter, styles.method, { borderBottomWidth: 0, paddingBottom: 0 }]}>
                                    <View style={shared.flexCenter}>
                                        <FontAwesome5 name={"box-open"} size={14} color={Colors.secColor} />
                                        <BoldText style={[fonts.size14, margin.ml1]}>受け取り方法</BoldText>
                                    </View>
                                    {
                                        this.state.customerInfo && this.state.customerInfo.method ?
                                            <RegularText style={[fonts.size14]}>{this.state.customerInfo.method}</RegularText>
                                            :
                                            null
                                    }

                                </View>
                            </View>
                            <View style={[styles.section, { backgroundColor: '#f2f2f2' }]}>
                                <BoldText style={[fonts.size14]}>連絡</BoldText>
                            </View>
                            <View>
                                
                                <List icon="comment" font5={false} title="飲食店とチャット" chat={'store'} clickEvent={this.chat.bind(this)} />
                                <List icon="phone" phone={this.state.orderInfo ? this.state.orderInfo.mobile_phone : null} font5={true} title="飲食店と電話" clickEvent={this.phoneCall.bind(this)} />
                                {
                                    this.props.type == 'confirm' && this.state.orderInfo && this.state.orderInfo.deliver_uid != store.getState().user.uid ?
                                    null
                                    :
                                    <View>
                                        <List icon="comment" font5={false} title="お客様とチャット" chat={'customer'} clickEvent={this.chat.bind(this)} />
                                        <List icon="phone" phone={this.state.customerInfo ? this.state.customerInfo.phone : null} font5={true} title="お客様と電話" clickEvent={this.phoneCall.bind(this)} />
                                    </View>
                                }
                                <List icon="phone" font5={true} color={"#CE082E"} title="本部に緊急連絡" phone={this.state.admin_phone} clickEvent={this.phoneCall.bind(this)} />
                            </View>
                            {
                                this.state.orderStauts == 0 ?
                                    null
                                    :
                                    <View style={{ height: 100 }}></View>
                            }
                        </View>
                    </ScrollView>
                    {
                        this.state.orderStauts == 0 ?
                            null
                            :
                            <View style={styles.btn}>
                                <TouchableOpacity onPress={() => this.nextStep()} style={[shared.flexCenter, styles.btnText, { backgroundColor: this.state.orderStauts == 1 ? '#D3D3D3' : Colors.mainColor, justifyContent: 'center' }]}>
                                    <FontAwesome name="check-circle" color="white" size={14} />
                                    <RegularText style={[fonts.size14, margin.ml1, { color: 'white' }]}>
                                        {
                                            (this.props.type == 'confirm' && this.props.confirm)|| this.state.orderStauts == 1 || this.state.orderStauts == 2 ?
                                            '注文内容を確認した'
                                            :
                                            this.state.orderStauts == 3 ?
                                            '飲食店を出発'
                                            :
                                            'お届け完了'
                                        }
                                    </RegularText>
                                </TouchableOpacity>
                            </View>
                    }
                    <Spinner_bar color={'#27cccd'} visible={!this.state.loaded} textContent={""} overlayColor={"rgba(0, 0, 0, 0.5)"} />
                </SafeAreaView>
            </Container>
        );
    }
}
BookRequestDetail.navigationOptions = {
    header: null
}
const mapDispatchToProps = dispatch => {
    return {
        setShowDeliver : showDeliver => { dispatch(setShowDeliver(showDeliver))},
        setNotify : notify => { dispatch(setNotify(notify)) }
    }
}
const mapStateToProps = (state) => {
    return {
        showDeliver : state.showDeliver
    }
}

export default connect(mapStateToProps , mapDispatchToProps)(BookRequestDetail);
const styles = StyleSheet.create({
    header: {
        borderBottomColor: '#f2f2f2', borderBottomWidth: 1, paddingHorizontal: normalize(20), paddingBottom: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    section: {
        paddingHorizontal: normalize(20),
        borderBottomColor: '#f2f2f2',
        borderBottomWidth: 1,
        paddingTop: 20,
        paddingBottom: 20,
    },
    back: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: normalize(20),
        width: '100%',
        paddingTop: 10,
        backgroundColor: 'white'
    },
    goBack: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center'
    },
    btnText: {
        padding: 18,
        width: "100%",
        borderRadius: 20
    },
    nextBtn: {

    },
    method: {
        justifyContent: 'space-between', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#f2f2f2',
        alignItems: 'flex-start'
    },
    endShift: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderColor: Colors.secColor,
        borderRadius: 15,
        borderWidth: 1
    },
    btn: {
        width: '100%',
        paddingHorizontal: normalize(20),
        bottom: 30,
        position: 'absolute',
    },
});
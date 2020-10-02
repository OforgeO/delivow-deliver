import React from 'react';
import { StyleSheet, View, Platform, Image, TouchableOpacity, StatusBar, SafeAreaView, Alert } from 'react-native';
import { shared, fonts, margin, normalize } from '../../assets/styles';
import { ScrollView } from 'react-native-gesture-handler';
import { Actions } from 'react-native-router-flux';
import { FontAwesome, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import { Container, Content } from 'native-base';
import Images from '../../assets/Images';
import List from '../../components/List';
import moment from 'moment';
import { RegularText, BoldText } from '../../components/StyledText';
import { getDeliveryInfos, getReservationList, getCurrentOrders, getUser, setDeliveryStatus, makeVoice } from '../../api';
import Spinner_bar from 'react-native-loading-spinner-overlay';
import * as Location from 'expo-location';
import store from '../../store/configuteStore';
import { dayNamesShort } from '../../constants/Global';
import * as Permissions from 'expo-permissions';
import { connect } from "react-redux";
import { showToast } from '../../shared/global';
import { setUser,setShowDeliver } from '../../actions';
import * as SecureStore from 'expo-secure-store';
import OrderConfirm from '../../components/OrderConfirm';
import io from 'socket.io-client';
import { SOCKET_URL } from '../../constants/Global';
import firebase from '../../Fire';
const userChatsRef = firebase.database().ref('userChats')
const deliverRef = firebase.database().ref('deliver_location')

let socket = io.connect(SOCKET_URL, {
    transports: ['websocket'],
    reconnectionAttempts: 15 //Nombre de fois qu'il doit réessayer de se connecter
});
const LOCATION_TASK_NAME = 'background-location-task';
var curTimeInterval = null;
class MyPage extends React.Component {
    

    constructor(props) {
        super(props);
        this.state = {
            todayInfo: null,
            loaded: true,
            currentTime: moment().format("HH:mm"),
            pushSetting: '',
            userInfo: null,
            shift_hours: null, 
            noDeliverCnt: 0
        }
    }
    async componentDidMount() {
        if(!store.getState().user.uid) {
            Actions.reset("signup")
        }
        const { status } = await Location.requestPermissionsAsync();
        if (status === 'granted') {
            /*await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
                accuracy: 6,
                showsBackgroundLocationIndicator : false,
                timeInterval: 60000,
                deferredUpdatesInterval : 60000,
                deferredUpdatesDistance : 3
            });*/
            Location.watchPositionAsync({
                accuracy: 6,
                timeInterval: 1500,
                distanceInterval : 5
            }, (result) => {
                if(result && result.coords){
                    this.sendMessage(result.coords.latitude, result.coords.longitude)
                }
            })
        }
        this.onConnectSocket();
        this.setState({ loaded: false })
        this.setState({ userInfo: store.getState().user })
        await getDeliveryInfos()
        .then(async (response) => {
            this.setState({ loaded: true });
            if(response.status == 1){
                this.setState({ todayInfo: response.info })
                let shift_hours = response.info.shift_hours
                shift_hours = JSON.parse(shift_hours)
                this.setState({shift_hours})
            }
            else 
                showToast(response.message)
        })
        .catch((error) => {
            Actions.reset("signup")
        });
        

        await getCurrentOrders()
        .then(async (response) => {
            if(response.status == 1) {
                let orderUid = []
                let orderBookUid = []
                response.orders.map((order) => {
                    if(order.status == "accepted" && order.deliver_type == 'book') 
                        orderBookUid.push(order.uid)
                    else if(order.status == 'delivering' || ((order.status == 'accepted' || order.status == 'cooking') && order.deliver_type == 'order'))
                        orderUid.push(order.uid)
                })
                this.props.setShowDeliver({
                    showDeliver: orderUid.length > 0 ? true : false,
                    showBookDeliver: orderBookUid.length > 0 ? true : false,
                    orderUid: orderUid,
                    orderBookUid: orderBookUid
                })
                
            }
        })
        .catch((error) => {
        });

        var _self = this;
        _self.getReservation()
        curTimeInterval = setInterval(function () {
            _self.setState({ currentTime: moment().format("HH:mm") })
        }, 5000)
        await this.registerForPushNotificationsAsync();
        
    }
    UNSAFE_componentWillReceiveProps() {
        this.refresh()
    }
    onConnectSocket = () => {
        if(socket) {
            socket.on('connect', () => {
                socket.on('handle_reserve', data => {
                    this.setState({noDeliverCnt : data.count})
                })
            });
        }
    }

    async sendMessage(latitude, longitude) {
        let uid = store.getState().user.uid
        if(uid){
            await deliverRef.child(uid).set({latitude: latitude, longitude: longitude})
        }
    }
    
    async refresh() {
        await this.registerForPushNotificationsAsync();
        this.setState({ userInfo: store.getState().user })
        await getDeliveryInfos()
        .then(async (response) => {
            if(response.status == 1){
                this.setState({ todayInfo: response.info })
                let shift_hours = response.info.shift_hours
                shift_hours = JSON.parse(shift_hours)
                this.setState({shift_hours})
            }
            else 
                showToast(response.message)
        })
        .catch((error) => {
            showToast();
        });
        
    }
    async getReservation() {
        await getReservationList()
        .then(async (response) => {
            if(response.status == 1) {
                let noDeliverCnt = 0
                response.list.map((order) => {
                    if(!order.deliver_uid && (order.status == 'accepted' || order.status == 'verified')) {
                        noDeliverCnt++;
                    }
                })
                this.setState({noDeliverCnt: noDeliverCnt})
            }
        })
        .catch((error) => {
        });
    }
    registerForPushNotificationsAsync = async () => {

        const { status: existingStatus } = await Permissions.getAsync(
            Permissions.NOTIFICATIONS
        );
        let finalStatus = existingStatus;
        
        if (finalStatus !== 'granted') {
            this.setState({ pushSetting: 'off' })
        } else {
            this.setState({ pushSetting: 'on' })
        }
    };

    bookrequest() {
        Actions.push("bookrequest")
    }
    editaccount() {
        Actions.push("editaccount")
    }
    goTodayShift() {
        Actions.push("todayshift", { shift_hours : this.state.shift_hours})
    }
    notify() {
        Actions.push("allownotification")
    }
    deliverHistory() {
        Actions.push("deliverhistory")
    }
    async deliverNow() {
        let todayTime = this.state.shift_hours[moment().format('d')]
        this.setState({ loaded: false});
        await setDeliveryStatus('now', todayTime[0], todayTime[1])
        .then(async (response) => {
            if(response.status == 1) {
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

    render() {
        return (
            <Container style={[shared.mainContainer, {backgroundColor: 'white'}]}>
                {Platform.OS === 'ios' && <StatusBar barStyle="dark-content" backgroundColor="white" />}
                <OrderConfirm />
                <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
                    <ScrollView ref={ref => this.scrollRef = ref} contentContainerStyle={{backgroundColor: '#f2f2f2',flex: 1, paddingTop: store.getState().showDeliver.showDeliver && store.getState().showDeliver.showBookDeliver ? 100 : (store.getState().showDeliver.showDeliver || store.getState().showDeliver.showBookDeliver) ? 50 : 0}} >
                        <View style={{backgroundColor: 'white'}}>
                            <View style={[styles.avatarSection]}>
                                <Image source={this.state.userInfo && this.state.userInfo.photo ? { uri: this.state.userInfo.photo, cache: 'force-cache' } : Images.avatar} style={{ width: 58, height: 58, borderRadius: 29 }} />
                                <View style={[margin.ml2]}>
                                    <View style={[shared.flexCenter]}>
                                        <BoldText style={[fonts.size14]}>
                                            {
                                                moment().format('M月D日') + '(' + dayNamesShort[moment().format('d')] + ') ' + this.state.currentTime
                                            }
                                        </BoldText>
                                        {
                                            !this.state.todayInfo?
                                            null
                                            :
                                            this.state.todayInfo && this.state.todayInfo.weather == "sunny" ?
                                            <Image source={require("../../assets/images/sun.png")} style={[margin.ml1, { width: 18, height: 18 }]} resizeMode="contain" />
                                            :
                                            <View style={[shared.flexCenter, margin.ml1, {padding: 5, backgroundColor: '#9D931F', borderRadius: 10}]}>
                                                <FontAwesome5 name={"umbrella"} size={13} color={"white"} style={margin.ml1} />
                                                <BoldText style={[margin.ml1,{color: 'white', fontSize: 11}]}>悪天候ボーナス発動中</BoldText>
                                            </View>
                                        }
                                        
                                    </View>
                                    {
                                        this.state.userInfo ?
                                            <RegularText style={[fonts.size14,margin.mt1, margin.mb1]}>{this.state.userInfo.first_name + ' ' + this.state.userInfo.last_name}さん、おはようございます。</RegularText>
                                            :
                                            null
                                    }

                                    <View style={shared.flexCenter}>
                                        <FontAwesome color={"#AFA100"} name={"star"} size={14} />
                                        <RegularText style={[{ color: '#AFA100', paddingTop: 1 }, fonts.size14, margin.ml1]}>
                                            {
                                                this.state.todayInfo ?
                                                    this.state.todayInfo.rating
                                                    :
                                                    0
                                            }
                                        </RegularText>
                                        <RegularText style={[fonts.size14, { color: Colors.mainColor, paddingTop: 1 }, margin.ml1]}>
                                            {
                                                this.state.todayInfo ?
                                                    '(' + this.state.todayInfo.rating_count + ')'
                                                    :
                                                    '(0)'
                                            }
                                        </RegularText>
                                    </View>
                                </View>
                            </View>
                            <View style={styles.timeSection}>
                                <View style={[shared.flexCenter, styles.detail]}>
                                    <MaterialCommunityIcons name={"clock"} color={Colors.secColor} size={20} />
                                    <RegularText style={[fonts.size14, margin.ml1, { paddingTop: 1 }]}>本日のシフト</RegularText>
                                </View>
                                <TouchableOpacity style={[styles.detail, { paddingVertical: 10 }]} onPress={() => this.goTodayShift()}>
                                    <BoldText style={[fonts.size40, { color: Colors.secColor, paddingTop: 0 }]}>
                                        {
                                            this.state.shift_hours && this.state.shift_hours.length > 0 && this.state.shift_hours[moment().format('d')].length > 0 ?
                                            this.state.shift_hours[moment().format('d')][0] + " - " + this.state.shift_hours[moment().format('d')][1]
                                            :
                                            '登録なし'
                                        }
                                    </BoldText>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.timeSection}>
                                <View style={[styles.detail, shared.flexCenter, { justifyContent: 'space-between', marginVertical: 15 }]}>
                                    <TouchableOpacity style={styles.btn} onPress={() => Actions.push("shiftregister")}>
                                        <BoldText style={[fonts.size14, { color: Colors.secColor }]}>シフトを編集</BoldText>
                                    </TouchableOpacity>
                                    {
                                        this.state.shift_hours && this.state.shift_hours.length > 0 && this.state.shift_hours[moment().format('d')].length > 0 ?
                                        <TouchableOpacity style={styles.btn} onPress={() => this.deliverNow()}>
                                            <BoldText style={[fonts.size14, { color: Colors.secColor }]}>今すぐ配達</BoldText>
                                        </TouchableOpacity>
                                        :
                                        null
                                    }
                                    
                                </View>
                            </View>
                            <List icon="car-side" font5={true} title="予約の配達依頼を見る" size={14} clickEvent={this.bookrequest.bind(this)} requestCnt={this.state.noDeliverCnt} />
                            <List icon="user-circle" font5={false} title="アカウントを編集" size={14} clickEvent={this.editaccount.bind(this)} />
                            <List icon="bell" setting={this.state.pushSetting} font5={false} title="通知設定" size={14} clickEvent={this.notify.bind(this)} warn={true} />
                            <List icon="video-camera" font5={false} title="今月の配達履歴" size={14} clickEvent={this.deliverHistory.bind(this)} borderBottom={false} />
                        </View>
                    </ScrollView>
                    <Spinner_bar color={'#27cccd'} visible={!this.state.loaded} textContent={""} overlayColor={"rgba(0, 0, 0, 0.5)"} />
                </SafeAreaView>
            </Container>
        );
    }
}
MyPage.navigationOptions = {
    header: null
}
const mapDispatchToProps = dispatch => {
    return {
        setUser : user => { dispatch(setUser(user)) },
        setShowDeliver : showDeliver => { dispatch(setShowDeliver(showDeliver)) }
    }
}
const mapStateToProps = (state) => {
    return {
        user : state.user
    }
}
export default connect(mapStateToProps,mapDispatchToProps)(MyPage)
const styles = StyleSheet.create({
    avatarSection: {
        padding: normalize(20),
        flexDirection: 'row',
        alignItems: 'center',
    },
    timeSection: {
        borderBottomColor: '#f2f2f2',
        borderBottomWidth: 1,
    },
    detail: {
        paddingHorizontal: normalize(20)
    },
    btn: {
        paddingVertical: 15,
        borderWidth: 1,
        borderColor: Colors.secColor,
        alignItems: 'center',
        borderRadius: 20,
        width: '48%'
    }
});

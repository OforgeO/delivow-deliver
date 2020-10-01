import React from 'react';
import { StyleSheet, View, Platform, KeyboardAvoidingView, Image, TouchableOpacity, StatusBar, SafeAreaView, Keyboard, Linking } from 'react-native';
import { shared, fonts, margin, normalize, form } from '../../assets/styles';
import { ScrollView } from 'react-native-gesture-handler';
import { Actions } from 'react-native-router-flux';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import { Container, Content, Item, Input } from 'native-base';
import Images from '../../assets/Images';
import { RegularText, BoldText } from '../../components/StyledText';
import { sendNotification } from '../../api';
import Spinner_bar from 'react-native-loading-spinner-overlay';
import firebase from '../../Fire';
import moment from 'moment';
import Layout from '../../constants/Layout';
import store from '../../store/configuteStore';
export const usersRef = firebase.database().ref('Users')
export const chatsRef = firebase.database().ref('Chats')
export const messagesRef = firebase.database().ref('chatMessages')
export const userChatsRef = firebase.database().ref('userChats')
export const serverTimestamp = firebase.database.ServerValue.TIMESTAMP
let chat = null
export default class Chat extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: true,
            chatList: [],
            chat: '',
        }
        this._keyboardDidShow = (e) => {
            this.scrollView.scrollToEnd()
        }
        this._keyboardDidHide = (e) => {
            this.scrollView.scrollToEnd()
        }
    }
    async componentDidMount() {
        this.setState({ loaded: false })
        chat = firebase.app().database().ref().child('chatMessages/' + this.props.room);
        let chatList = []
        var _self = this;
        let my_id = store.getState().user.uid
        if (chat != null) {
            chat.on("child_added", function (snapshot) {
                let chatInfo = snapshot.val()
                chatList.push(chatInfo)
                _self.setState({ chatList })
                if (chatInfo.status == 'unread' && chatInfo.senderUID != my_id) {
                    chatInfo.status = 'read';
                    if (chat != null)
                        chat.child(snapshot.key).update(chatInfo)
                }
            })
        }


        setTimeout(function () {
            _self.setState({ chatList })
            _self.setState({ loaded: true })
        }, 1000)
        
    }

    UNSAFE_componentWillMount() {
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
    }
    
    componentWillUnmount() {
        chat = null;
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }


    renderChat() {
        if (this.state.chatList && this.state.chatList.length > 0)
            return this.state.chatList.map((chat, index) => {
                return <View key={index} style={styles.chatSection}>
                    {
                        chat.senderUID != this.props.author.uid ?
                            <View style={[shared.flexCenter, { flex: 1, alignItems: 'flex-end' }]}>
                                <View>
                                    <Image source={chat.senderAvatar ? { uri: chat.senderAvatar, cache: 'force-cache' } : Images.avatar} style={{ width: 36, height: 36, borderRadius: 18 }} />
                                </View>

                                <View style={styles.chatText}>
                                    <RegularText style={[fonts.size14]}>{chat.message}</RegularText>
                                </View>
                                <RegularText style={[fonts.size14, margin.ml3, { color: '#B5B5B5' }]}>
                                    {moment(chat.timestamp).format("YYYY/M/D") == moment().format("YYYY/M/D") ? moment(chat.timestamp).format("H:mm") : moment(chat.timestamp).format("M/D H:mm")}
                                </RegularText>

                            </View>
                            :
                            <View style={[shared.flexCenter, { flex: 1, alignItems: 'flex-end', justifyContent: 'flex-end' }]}>
                                <RegularText style={[fonts.size14, margin.ml3, { color: '#B5B5B5' }]}>
                                    {moment(chat.timestamp).format("YYYY/M/D") == moment().format("YYYY/M/D") ? moment(chat.timestamp).format("H:mm") : moment(chat.timestamp).format("M/D H:mm")}
                                </RegularText>
                                <View style={[styles.chatText, { backgroundColor: '#0D7684', marginRight: 10 }]}>
                                    <RegularText style={[fonts.size14, { color: 'white' }]}>{chat.message}</RegularText>
                                </View>

                                <View>
                                    <Image source={chat.senderAvatar ? { uri: chat.senderAvatar, cache: 'force-cache' } : Images.avatar} style={{ width: 36, height: 36, borderRadius: 18 }} />
                                </View>
                            </View>
                    }

                </View>
            })
    }

    async sendMessage(params) {
        if(params.message){
            const author = params.author
            const target = params.target
            const roomId = (author.uid < target.uid) ? author.uid + target.uid : target.uid + author.uid
            const chat = await messagesRef.child(roomId).push({
                senderName: author.name,
                senderAvatar: author.avatar,
                senderUID: author.uid,
                message: params.message,
                timestamp: serverTimestamp,
                status: 'unread'
            })
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
            } else if (!targetRoomList.includes(roomId)) {
                targetRoomList.push(roomId)
            }
            await userChatsRef.child(target.uid).set(targetRoomList)
            let order_uid = this.props.order_uid
            await chatsRef.child(roomId).set({
                lastMessageSent: params.message,
                lastMessageTimestamp: serverTimestamp,
                members: [author.uid, target.uid],
                senderPhone: author.phone,
                receiverPhone: target.phone,
                senderName: author.name,
                senderAvatar: author.avatar ? author.avatar : '',
                receiverName: target.name,
                receiverAvatar: target.avatar ? target.avatar : '',
                senderRole: author.role,
                receiverRole: target.role,
                senderUID: author.uid,
                receiverUID: target.uid,
                order_uid: order_uid
            })
            sendNotification(params.author, params.target, params.message, order_uid)
                .then(async (response) => {
                })
                .catch((error) => {
                });
        }
        
    }

    sendChat() {
        if(this.state.chat) {
            this.sendMessage({
                message: this.state.chat,
                author: this.props.author,
                target: this.props.target
            })
            this.setState({ chat: '' })
        }
    }

    render() {
        return (
            <Container style={[shared.mainContainer]}>
                {Platform.OS === 'ios' && <StatusBar barStyle="dark-content" backgroundColor="white" />}
                <SafeAreaView style={{ flex: 1 }}>
                    <KeyboardAvoidingView behavior={Platform.OS == 'ios' ? 'padding' : "height"} style={{ flex: 1 }} keyboardVerticalOffset={Platform.OS == 'ios' ? 0 : 40}>
                        <View style={{ flex: 1, backgroundColor: 'white' }}>
                            <View style={[shared.flexCenter, { justifyContent: 'space-between' }]}>
                                <TouchableOpacity style={[styles.goBack, { width: 60 }]} onPress={() => {
                                    Actions.pop({ refresh: {} }); setTimeout(function () {
                                        Actions.refresh()
                                    }, 10)
                                }}>
                                    <FontAwesome name={"chevron-left"} color={'#d3d3d3'} size={14} />
                                    <BoldText style={[{ color: '#d3d3d3' }, margin.ml1, fonts.size14]}>戻る</BoldText>
                                </TouchableOpacity>
                                <View style={[margin.pb3, margin.pt3, { flex: 1, alignItems: 'center' }]}>
                                    <BoldText style={[fonts.size14, { textAlign: 'center' }]}>{this.props.title}</BoldText>
                                    {
                                        this.props.subtitle ?
                                            <RegularText style={[fonts.size14, margin.mt1, { color: '#848484' }]}>{this.props.subtitle}</RegularText>
                                            :
                                            null
                                    }
                                </View>
                                <TouchableOpacity style={{ width: 60, alignItems: 'flex-end' }} onPress={() => Linking.openURL("tel:" + this.props.target.phone)}>
                                    <FontAwesome5 color={Colors.secColor} name={"phone"} size={30} style={{ paddingRight: 15 }} />
                                </TouchableOpacity>
                            </View>

                            <ScrollView style={{ flex: 1, backgroundColor: '#f2f2f2' }}
                                ref={ref => this.scrollView = ref}
                                onContentSizeChange={(contentWidth, contentHeight) => {
                                    this.scrollView.scrollToEnd({ animated: true })
                                }}
                                contentContainerStyle={{ paddingBottom: 20 }}
                            >
                                {
                                    this.renderChat()
                                }
                            </ScrollView>
                            <View style={[shared.flexCenter, { paddingHorizontal: normalize(20), backgroundColor: 'white', justifyContent: 'center' }]}>
                                <Item rounded style={[form.item, { marginVertical: 10, flex: 1 }]}>
                                    <Input
                                        value={this.state.chat}
                                        placeholder="メッセージを入力…"
                                        style={[styles.input, fonts.size18]}
                                        multiline
                                        onChangeText={(text) => this.setState({ chat: text })}
                                        placeholderTextColor='#9da8bf'
                                    />
                                </Item>
                                <TouchableOpacity onPress={() => this.sendChat()}>
                                    <FontAwesome name={"paper-plane"} size={25} color={"#0D7684"} style={[margin.ml3]} />
                                </TouchableOpacity>
                            </View>

                        </View>
                    </KeyboardAvoidingView>
                    <Spinner_bar color={'#27cccd'} visible={!this.state.loaded} textContent={""} overlayColor={"rgba(0, 0, 0, 0.5)"} />
                </SafeAreaView>
            </Container>
        );
    }
}
Chat.navigationOptions = {
    header: null
}
const styles = StyleSheet.create({
    chatSection: {
        borderBottomColor: '#f2f2f2',
        borderBottomWidth: 1,
        paddingTop: normalize(15),
        marginLeft: normalize(20),
        paddingRight: normalize(20),
        flexDirection: 'row',
        alignItems: 'center',
    },
    goBack: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        paddingLeft: 15
    },
    input: {
        lineHeight: normalize(24),
        textAlignVertical: 'top',
        justifyContent: 'center',
        height: Platform.OS == 'ios' ? 40 : 30
    },
    chatText: {
        maxWidth: Layout.window.width - 160, backgroundColor: 'white', borderRadius: 10, paddingVertical: 10,
        paddingHorizontal: 15,
        marginLeft: 10
    }
});
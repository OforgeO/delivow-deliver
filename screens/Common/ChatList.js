import React from 'react';
import { StyleSheet, View, Platform, Text, Image, TouchableOpacity, StatusBar, SafeAreaView } from 'react-native';
import { shared, fonts, margin, normalize, form } from '../../assets/styles';
import { ScrollView } from 'react-native-gesture-handler';
import { Actions } from 'react-native-router-flux';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import { Container, Content, Item, Input } from 'native-base';
import Images from '../../assets/Images';
import { RegularText, BoldText } from '../../components/StyledText';
import { updateName, updateAvatar } from '../../api';
import Spinner_bar from 'react-native-loading-spinner-overlay';
import Back from '../../components/Back';
import firebase from '../../Fire';
import store from '../../store/configuteStore';
import moment from 'moment';
import OrderConfirm from '../../components/OrderConfirm';
const fbChat = firebase.database().ref();
export default class ChatList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: true,
            chatList: null,
            myInfo : store.getState().user
        }
    }
    componentDidMount() {
        this.refresh();
    }

    UNSAFE_componentWillReceiveProps() {
        this.refresh();
    }

    async refresh() {
        this.setState({loaded: false})
        const myChats = fbChat.child('userChats/'+this.state.myInfo.uid);
        let chatList = [];
        var _self = this;
        myChats.on("child_added", function (snapshot) {
            fbChat.child('Chats').on("child_added", function(snap) {
                if(snap.key == snapshot.val()) {
                    let content = snap.val()
                    content['room'] = snapshot.val()
                    const chat = fbChat.child('chatMessages/'+snapshot.val());
                    let unreadCount = 0;
                    chat.on("child_added", function (snapshot) {
                        if(snapshot.val().status == 'unread' && snapshot.val().senderUID != _self.state.myInfo.uid)
                            unreadCount++;
                    })
                    content['unread_count'] = unreadCount;
                    chatList.push(content)
                }
            })
        })
        setTimeout(function() {
            _self.setState({chatList})
            _self.setState({loaded: true})
        }, 1000)
    }

    gotoChat(chat) {
        let room = chat.room
        let title = chat.receiverRole == 'deliver' ? chat.senderName : chat.receiverName
        let subtitle =  chat.receiverRole == 'customer' || chat.senderRole == 'customer' ? this.props.store_name : null
        let author = {
            uid: this.props.author.uid,
            name: this.props.author.first_name + ' ' + this.props.author.last_name,
            avatar: this.props.author.photo,
            phone: this.props.author.phone,
            role: 'deliver'
        }
        let target = {
            uid: chat.senderRole == 'deliver' ? chat.receiverUID : chat.senderUID,
            name: chat.senderRole == 'deliver' ? chat.receiverName : chat.senderName,
            avatar: chat.senderRole == 'deliver' ? chat.receiverAvatar : chat.senderAvatar,
            phone: chat.senderRole == 'deliver' ? chat.receiverPhone : chat.senderPhone,
            role: chat.senderRole == 'deliver' ? chat.receiverRole : chat.senderRole
        }
        Actions.push("chat", {room : room, author: author, target: target, title: title, subtitle: subtitle, order_uid: this.props.order_uid})
    }

    renderChat() {
        return this.state.chatList.map((chat, index) => {
            return <TouchableOpacity key={index} style={styles.chatSection} onPress={() => this.gotoChat(chat)}>
                <View style={{ alignItems: 'center' }}>
                    <Image source={
                        chat.receiverRole == 'customer' && chat.receiverAvatar ? {uri: chat.receiverAvatar, cache: 'force-cache'} :
                        chat.senderRole == 'customer' && chat.senderAvatar ? {uri: chat.senderAvatar, cache: 'force-cache'} : 
                        chat.receiverRole == 'store' && chat.receiverAvatar ? {uri: chat.receiverAvatar, cache: 'force-cache'} : 
                        chat.senderRole == 'store' && chat.senderAvatar ? {uri: chat.senderAvatar, cache: 'force-cache'} : Images.avatar} 
                        style={{ width: 50, height: 50, borderRadius: 25 }} />
                </View>
                <View style={[margin.ml4, shared.flexCenter, { justifyContent: 'space-between', alignItems: 'flex-start', flex: 1 }]}>
                    <View>
                        <RegularText style={[fonts.size14, margin.mb1]}>
                            {
                                chat.receiverRole == 'deliver' ? chat.senderName :
                                chat.senderRole == 'deliver' ? chat.receiverName : null
                            }
                        </RegularText>
                        <RegularText style={[fonts.size14, { color: '#848484' }]}>{chat.lastMessageSent}</RegularText>
                    </View>
                    {
                        chat.unread_count > 0 ?
                        <View style={[styles.unread]}>
                            <BoldText style={[fonts.size14, {color: 'white', paddingTop:0, textAlign: 'center'}]}>{chat.unread_count}</BoldText>
                        </View>
                        :
                        <RegularText style={[fonts.size14, { color: '#B5B5B5' }]}>{moment(chat.lastMessageTimestamp).format("H:mm")}</RegularText>
                    }
                </View>
            </TouchableOpacity>
        })
    }

    render() {
        return (
            <Container style={[shared.mainContainer]}>
                {Platform.OS === 'ios' && <StatusBar barStyle="dark-content" backgroundColor="white" />}
                
                <SafeAreaView style={{ flex: 1 }}>
                    <ScrollView ref={ref => this.scrollRef = ref} style={{ flex: 1, backgroundColor: '#f2f2f2' }} >
                        <View style={{ flex: 1, backgroundColor: 'white' }}>
                            <Back color="#d3d3d3" />
                            <View style={[margin.pb3, { borderBottomWidth: 1, borderBottomColor: '#f2f2f2' }]}>
                                <BoldText style={[fonts.size32, { paddingHorizontal: normalize(20) }]}>連絡</BoldText>
                            </View>
                            {
                                this.state.chatList ?
                                    this.renderChat()
                                    :
                                    null
                            }
                        </View>
                        <Spinner_bar color={'#27cccd'} visible={!this.state.loaded} textContent={""} overlayColor={"rgba(0, 0, 0, 0.5)"} />
                    </ScrollView>

                </SafeAreaView>
            </Container>
        );
    }
}
ChatList.navigationOptions = {
    header: null
}
const styles = StyleSheet.create({
    chatSection: {
        borderBottomColor: '#f2f2f2',
        borderBottomWidth: 1,
        paddingVertical: normalize(15),
        marginLeft: normalize(20),
        paddingRight: normalize(20),
        flexDirection: 'row',
        alignItems: 'center',
    },
    unread: {
        alignItems: 'center', justifyContent: 'center', backgroundColor: '#F50909', width: 30, height: 30, borderRadius: 15,
        marginLeft: 10
    }
});
import React from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView,SafeAreaView, Platform, StatusBar, Alert } from 'react-native';
import { Container, Content, Item, Input, Text } from 'native-base';
import { normalize, fonts, margin, form, shared} from '../../assets/styles';
import {Actions} from 'react-native-router-flux';
import Colors from '../../constants/Colors';
import { FontAwesome } from '@expo/vector-icons';
import { RegularText, BoldText } from '../../components/StyledText';
import { getDeliveryInfos } from '../../api';
import Spinner_bar from 'react-native-loading-spinner-overlay';
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';
import { getReservationList, confirmOrder } from '../../api';
import { showToast } from '../../shared/global';
import { dayNamesShort } from '../../constants/Global';
import moment from 'moment';
import Back from '../../components/Back';
import store from '../../store/configuteStore';
import { connect } from "react-redux";
import { setShowDeliver } from '../../actions';
import OrderConfirm from '../../components/OrderConfirm';
import { _e } from '../../lang';
TouchableOpacity.defaultProps = { activeOpacity: 0.8 };

class BookRequest extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            bookList: [
            ],
            noDeliverCnt: 0,
            loaded: true,
        };
    }
    async componentDidMount(){
        this.refresh();
        
        const { status: existingStatus } = await Permissions.getAsync(
            Permissions.NOTIFICATIONS
        );
        if (existingStatus !== 'granted') {
            await Permissions.askAsync(Permissions.NOTIFICATIONS);
        }
    }
    async refresh() {
        this.setState({loaded: false})
        await getReservationList()
        .then(async (response) => {
            if(response.status == 1) {
                this.setState({bookList: response.list})
                let noDeliverCnt = 0
                response.list.map((order) => {
                    if(!order.deliver_uid && (order.status == 'accepted' || order.status == 'verified')) {
                        noDeliverCnt++;
                    }
                })
                this.setState({noDeliverCnt: noDeliverCnt})
            } else {
                showToast(response.message)
            }
            this.setState({loaded: true});
        })
        .catch((error) => {
            this.setState({loaded: true});
            showToast();
        });
    }
    goBookRequestDetail(order_uid, deliver_uid) {
        Actions.push("bookrequestdetail", {order_uid: order_uid, type: 'confirm', confirm: deliver_uid ? true : false })
    }
    clickDeliver(order_uid, store_name, area, cooking_time) {
        Alert.alert("この予約注文の配達を担当しますか？", "", [
            { text: "いいえ"},
            { text: "はい", onPress: () => {
                var _self = this
                setTimeout(function() {
                    _self.confirm(order_uid, store_name, area, cooking_time)
                }, 200)
                
            }}
        ])
        
    }
    async confirm(order_uid, store_name, area, cooking_time) {
        this.setState({loaded: false})
        await confirmOrder(order_uid)
        .then(async (response) => {
            if(response.status == 1) {
                Alert.alert("ありがとうございます！\nあなたがこの注文の配達担当者となりました。", "");
                let status = store.getState().showDeliver
                status.orderBookUid.push(order_uid)
                this.props.setShowDeliver({
                    showDeliver: status.showDeliver,
                    showBookDeliver: true,
                    orderUid: status.order_uid,
                    orderBookUid: status.orderBookUid
                })
                this.refresh();
            } else {
                showToast(response.message)
            }
            this.setState({loaded: true});
        })
        .catch((error) => {
            this.setState({loaded: true});
            showToast();
        });
    }
    renderbookList() {
        if(this.state.bookList && this.state.bookList.length > 0 ) {
            return this.state.bookList.map((deliver) => {
                return <View key={deliver.order_uid}>
                    <View style={styles.space}>
                    </View>
                    <View style={[styles.section, { borderColor: Colors.secColor, borderWidth: deliver.deliver_uid ? 0 : 2}]}>
                        <View style={[shared.flexCenter, {justifyContent: 'space-between'}]}>
                            <View style={shared.flexCenter}>
                                <BoldText style={[{width: 80,paddingTop: 0}, fonts.size14]}>{deliver.book_date ? moment(deliver.book_date).format("M/D")+"("+dayNamesShort[moment(deliver.book_date).format("d")]+"）" : ''}</BoldText>
                                <BoldText style={[{color: Colors.secColor,paddingTop: 0}, fonts.size14]}>{deliver.book_date ? moment(deliver.book_date).format("HH:mm") : null}</BoldText>
                            </View>
                            <RegularText style={{color: Colors.secColor}}>にお客様にお届けするご予約です</RegularText>
                        </View>
                        <View style={[shared.flexCenter, {justifyContent: 'space-between'}, margin.mt2]}>
                            <BoldText style={fonts.size14}>注文管理ナンバー</BoldText>
                            <RegularText style={fonts.size14}>{deliver.order_uid}</RegularText>
                        </View>
                        <View style={[shared.flexCenter, margin.mt2]}>
                            <View style={[shared.flexCenter, {width: 180}]}>
                                <BoldText style={[fonts.size14, {width: 80}]}>エリア</BoldText>
                                <RegularText style={{color: '#848484'}}>{deliver.area}</RegularText>
                            </View>
                            <View style={[shared.flexCenter, margin.ml4]}>
                                <BoldText style={fonts.size14}>配達距離</BoldText>
                                <RegularText style={[{color: '#848484'}, margin.ml2]}>{parseFloat(deliver.delivery_distance.distance/1000).toFixed(1)}km</RegularText>
                            </View>
                        </View>
                        <View style={[shared.flexCenter, margin.mt2]}>
                            <BoldText style={[fonts.size14, {width: 80}]}>店舗名</BoldText>
                            <RegularText numberOfLines={1} style={[fonts.size14, {color: '#848484'}]}>{deliver.store_name}</RegularText>
                        </View>
                        <View style={[shared.flexCenter, margin.mt2]}>
                            <BoldText style={[fonts.size14, {width: 80}]}>お届け先</BoldText>
                            <RegularText numberOfLines={1} style={[fonts.size14, {color: '#848484'}]}>{deliver.customer_address.address}</RegularText>
                        </View>
                        <View style={[shared.flexCenter, margin.mt4, {justifyContent: 'space-between', alignItems: 'flex-end'}]}>
                            {
                                store.getState().user.uid == deliver.deliver_uid ?
                                <TouchableOpacity style={[styles.deliverBtn, {backgroundColor: '#ED0E0E'}]}>
                                    <BoldText style={[fonts.size16, {color: 'white'}]}>店着時間　{deliver.book_date && deliver.delivery_distance ? moment(deliver.book_date).subtract(deliver.delivery_distance.duration, 'seconds').format("HH:mm") : moment(deliver.book_date).format("HH:mm")}</BoldText>
                                </TouchableOpacity>
                                :
                                deliver.deliver_uid ?
                                <View style={[styles.deliverBtn, {backgroundColor: '#F2F2F2'}]}>
                                    <BoldText style={[fonts.size16, {color: 'black'}]}>デリバー確定済み</BoldText>
                                </View>
                                :
                                <TouchableOpacity style={[styles.deliverBtn, {backgroundColor: '#ED0E0E'}]} onPress={() => this.clickDeliver(deliver.order_uid, deliver.store_name, deliver.customer_address.address, deliver.store_cooking_time)}>
                                    <BoldText style={[fonts.size16, {color: 'white'}]}>私が配達します！</BoldText>
                                </TouchableOpacity>
                            }
                            
                            <View>
                                {
                                    deliver.car ?
                                    <View style={styles.carBtn}>
                                        <RegularText style={[fonts.size14, {paddingTop: 1}]}>車限定</RegularText>
                                    </View>
                                    :
                                    null
                                }
                                <TouchableOpacity onPress={() => this.goBookRequestDetail(deliver.order_uid, deliver.deliver_uid, deliver.delivery_distance)}>
                                    <BoldText style={[fonts.size14, {color: '#155CCE'}]}>注文内容を見る</BoldText>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            })
        } else {
            return (
                <View style={[shared.flexCenter,margin.pt4, margin.pb4,{width: '100%', justifyContent: 'center'}]}>
                    <RegularText style={fonts.size16}>{_e.noBookRequest}</RegularText>
                </View>
            )
        }
    }
    render(){
        return (
            <Container>
                {Platform.OS === 'ios' && <StatusBar barStyle="dark-content" backgroundColor="white" />}
                <OrderConfirm page="bookrequest" />
                <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
                    <ScrollView style={{flex: 1, backgroundColor: '#f2f2f2'}} contentContainerStyle={{paddingTop: store.getState().showDeliver.showDeliver ? 50 : 0}}>
                        <View style={{flex: 1}}>
                            <Back color={"#d3d3d3"} />
                            <View style={[styles.whiteSection, {paddingTop: 0}]}>
                                <BoldText style={[fonts.size32, {paddingBottom: 15}]}>予約の配達依頼 一覧</BoldText>
                            </View>
                            {
                                this.state.noDeliverCnt > 0 ?
                                <View style={[styles.whiteSection, shared.flexCenter, {paddingBottom: 10, justifyContent: 'flex-end'}]}>
                                    <BoldText style={[{color: '#B5B5B5', paddingTop: 0}]}>デリバー未定の予約</BoldText>
                                    <View style={styles.undeliverSection}>
                                        <BoldText style={[fonts.size16, {color: 'white', paddingTop:0}]}>{this.state.noDeliverCnt}</BoldText>
                                    </View>
                                </View>
                                :
                                null
                            }
                            {
                                this.renderbookList()
                            }
                        </View>
                    </ScrollView>
                </SafeAreaView>
                <Spinner_bar color={'#27cccd'} visible={!this.state.loaded} textContent={""} overlayColor={"rgba(0, 0, 0, 0.5)"} />
            </Container>
        );
    }
}
const mapDispatchToProps = dispatch => {
    return {
        setShowDeliver : showDeliver => { dispatch(setShowDeliver(showDeliver))}
    }
}
const mapStateToProps = (state) => {
    return {
        showDeliver: state.showDeliver
    }
}
export default connect(mapStateToProps,mapDispatchToProps)(BookRequest)
const styles = StyleSheet.create({
    whiteSection: {
        backgroundColor: 'white',
        paddingHorizontal: normalize(20),
        paddingTop: 10,
        borderBottomColor: '#f2f2f2',
        borderBottomWidth: 1,
        paddingBottom: 0
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
    undeliverSection: {
        alignItems: 'center', justifyContent: 'center', backgroundColor: '#F50909', width: 26, height: 26, borderRadius: 15,
        marginLeft: 10
    },
    space: {
        backgroundColor: '#f2f2f2',
        height: 15
    },
    section: {
        padding: normalize(20),
        backgroundColor: 'white'
    },
    deliverBtn: {
        paddingVertical: Platform.OS == 'ios' ? 17 : 10, 
        borderRadius: 30, paddingHorizontal: 30
    },
    carBtn: {
        backgroundColor: '#F2F2F2',
        borderColor: '#CE092E',
        borderWidth: 1,
        paddingHorizontal: 15,
        paddingVertical: Platform.OS == 'ios' ? 7 : 3,
        borderRadius: 8,
        alignItems: 'center',
    }
});

import React from 'react';
import { StyleSheet, View, Platform, Text, Image, TouchableOpacity, StatusBar, SafeAreaView, Alert } from 'react-native';
import { shared, fonts, margin, normalize } from '../../assets/styles';
import { ScrollView } from 'react-native-gesture-handler';
import { Actions } from 'react-native-router-flux';
import Layout from '../../constants/Layout';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import { Container, Content } from 'native-base';
import { RegularText, BoldText } from '../../components/StyledText';
import Spinner_bar from 'react-native-loading-spinner-overlay';
import { _e } from '../../lang';
import { getThisMonthHistory } from '../../api';
import { showToast } from '../../shared/global';
import Back from '../../components/Back';
import Constants from 'expo-constants';
import moment from 'moment';
import OrderConfirm from '../../components/OrderConfirm';
import store from '../../store/configuteStore';
export default class DeliverHistory extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            listViewData : [
            ],
            loaded: true
        }
    }
    async componentDidMount() {
        this.setState({loaded: false})
        await getThisMonthHistory()
        .then(async (response) => {
            if(response.status == 1) {
                this.setState({listViewData: response.list})
            } else {
                showToast(response.message)
            }
            this.setState({loaded: true})
        })
        .catch((error) => {
            this.setState({loaded: true})
            showToast()
        });
    }
    renderList(){
        if(this.state.listViewData.length > 0) {
            return this.state.listViewData.map((list) => {
                return <TouchableOpacity key={list.uid} style={styles.rowFrontSection}>
                    <View style={styles.rowFront}>
                        <View style={{width: (Layout.window.width - 40)*0.3, borderRadius: 10, overflow: 'hidden'}}>
                            <Image source={{uri: list.store_photo ? list.store_photo : '', cache: 'force-cache'}} style={{width: (Layout.window.width - 40)*0.3, height: (Layout.window.width - 40)*0.3}} resizeMode="stretch" />
                        </View>
                        <View style={[shared.flexCenter, {justifyContent: 'space-between', width: (Layout.window.width - 40)*0.7}]}>
                            <View style={[margin.pl3, {justifyContent: 'space-between', height: (Layout.window.width - 40)*0.3, paddingVertical: 10}]}>
                                <RegularText style={{color: '#b5b5b5'}}>{moment(list.order_time).format("YYYY/MM/DD")}にご利用</RegularText>
                                <BoldText style={[fonts.size16, margin.pt1, margin.pb1]}>{list.store_name}</BoldText>
                                <View style={shared.flexCenter}>
                                    <RegularText style={fonts.size14}>配達距離</RegularText>
                                    <RegularText style={[fonts.size14, margin.pl8]}>{(parseInt(list.distance)/1000).toFixed(1)}km</RegularText>
                                </View>
                                <View style={shared.flexCenter}>
                                    <RegularText style={fonts.size14}>配達状況</RegularText>
                                    {
                                        list.status == 'complete' ?
                                        <RegularText style={[fonts.size14, margin.pl8]}>完了</RegularText>
                                        :
                                        list.status == 'cancel' ?
                                        <RegularText style={[fonts.size14, margin.pl8, {color: '#CE082E'}]}>キャンセル</RegularText>
                                        :
                                        null
                                    }
                                </View>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            })
        } else {
            return <View style={[shared.flexCenter,margin.pt4, margin.pb4,{width: '100%', justifyContent: 'center'}]}>
                <RegularText style={fonts.size16}>{_e.noDeliverHistory}</RegularText>
            </View>
        }
    }

    render(){
      return (
        <Container style={[shared.mainContainer]}>
            {Platform.OS === 'ios' && <StatusBar barStyle="dark-content" backgroundColor="white" />}
            <OrderConfirm />
            <SafeAreaView style={{ flex:1}}>
                <ScrollView ref={ref => this.scrollRef = ref} contentContainerStyle={{paddingTop: store.getState().showDeliver.showDeliver && store.getState().showDeliver.showBookDeliver ? 100 : (store.getState().showDeliver.showDeliver || store.getState().showDeliver.showBookDeliver) ? 50 : 0}}>
                    <Back color="#d3d3d3" />
                    <View style={styles.header}>
                        <BoldText style={[fonts.size32]}>今月の配達履歴</BoldText>
                    </View>
                    {
                        this.state.listViewData.length == 0 ?
                        <View style={[shared.flexCenter,margin.pt4, margin.pb4,{width: '100%', justifyContent: 'center'}]}>
                            <RegularText style={fonts.size16}>{_e.noDeliverHistory}</RegularText>
                        </View>
                        :
                        this.renderList()
                    }
                </ScrollView>
            </SafeAreaView>
            <Spinner_bar color={'#27cccd'} visible={!this.state.loaded} textContent={""} overlayColor={"rgba(0, 0, 0, 0.5)"} />
        </Container>
      );
    }
}
DeliverHistory.navigationOptions = {
  header: null
}
const styles = StyleSheet.create({
    back: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: normalize(20),
        paddingVertical: 10,
        width: '100%'
    },
    goBack: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center'
    },
    edit: {
        paddingVertical: 15,
        paddingHorizontal: 15,
        backgroundColor: Colors.mainColor,
        alignSelf: 'flex-start',
        borderRadius: 10
    },
    header: {
        borderBottomColor: '#f2f2f2', borderBottomWidth: 1, paddingHorizontal: normalize(20), paddingBottom: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    backTextWhite: {
        color: '#FFF',
    },
    rowFront: {
        flexDirection: 'row',
        paddingVertical: 15,
        
    },
    rowFrontSection: {
        paddingHorizontal: normalize(20),
        backgroundColor: 'white',
        borderBottomColor: '#f2f2f2',
        borderBottomWidth: 1
    },
    rowBack: {
        alignItems: 'center',
        backgroundColor: '#DDD',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 15,
    },
    backRightBtn: {
        alignItems: 'center',
        bottom: 0,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        width: (Layout.window.width-40)*0.3+30,
    },
    backRightBtnRight: {
        backgroundColor: '#CE082E',
        right: 0,
    },
    btnText: {
        padding: 18,
        width: "100%",
        color: '#fff',
        textAlign: 'center',
    },
});
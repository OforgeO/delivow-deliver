import React from 'react';
import { StyleSheet, View, Platform, Text, Image, TouchableOpacity, StatusBar, SafeAreaView, Alert} from 'react-native';
import { shared, fonts, margin, normalize } from '../../assets/styles';
import { ScrollView } from 'react-native-gesture-handler';
import { Actions } from 'react-native-router-flux';
import Layout from '../../constants/Layout';
import { FontAwesome, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { Container, Content, Col } from 'native-base';
import Colors from '../../constants/Colors';
import Constants from "expo-constants";
import { RegularText, BoldText } from '../../components/StyledText';
import Back from '../../components/Back';
import moment from 'moment';
import { setDeliveryStatus } from '../../api';
import { _e } from '../../lang';
import OrderConfirm from '../../components/OrderConfirm';
import store from '../../store/configuteStore';
export default class TodayShift extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tabType: 1,
            shift_hours: this.props.shift_hours,
            today_time: null
        }
    }
    componentDidMount() {
        this.refresh()
    }
    UNSAFE_componentWillReceiveProps() {
        this.refresh()
    }
    refresh() {
        let today_time = this.props.shift_hours[moment().format("d")]
        this.setState({today_time : today_time})
    }
    nextScreen() {
        Actions.pop();
        setTimeout(function() {
            Actions.refresh();
        }, 10)
    }
    async changeStatus(type) {
        this.setState({ loaded: false })
        if(type == 'now' || type == 'finish'|| (type == 'pause' && this.state.today_time && moment().format("HH:mm") >= this.state.today_time[0])) {
            if(type == 'now' && !this.state.today_time) {
                Alert.alert(_e.noWorkTime)
            } else {
                await setDeliveryStatus(type, this.state.today_time && this.state.today_time[0] ? this.state.today_time[0] : '', this.state.today_time && this.state.today_time[1] ? this.state.today_time[1] : '')
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
        }
    }

    render(){
      return (
        <Container style={[shared.mainContainer]}>
            {Platform.OS === 'ios' && <StatusBar barStyle="dark-content" backgroundColor="white" />}
            <OrderConfirm />
            <SafeAreaView style={{ flex:1, backgroundColor: '#f2f2f2', marginTop: Constants.statusBarHeight}}>
                <ScrollView ref={ref => this.scrollRef = ref} contentContainerStyle={{paddingTop: store.getState().showDeliver.showDeliver && store.getState().showDeliver.showBookDeliver ? 100 : (store.getState().showDeliver.showDeliver || store.getState().showDeliver.showBookDeliver) ? 50 : 0}}>
                    <View style={{flex: 1, backgroundColor: 'white'}}>
                        <Back color={"#d3d3d3"} />
                        <View style={[styles.header]}>
                            <BoldText style={[fonts.size32]}>本日のシフト登録</BoldText>
                        </View>
                        <View style={styles.section}>
                            <View style={shared.flexCenter}>
                                <MaterialCommunityIcons size={14} name={"clock"} color={Colors.secColor} />
                                <RegularText style={[{color: '#848484'}, fonts.size14, margin.ml1]}>本日のシフト</RegularText>
                            </View>

                            <TouchableOpacity onPress={() => Actions.push("todayshifttime", {shift_hours: this.props.shift_hours})}>
                                <RegularText style={[margin.mt2, {color: Colors.secColor, fontSize: 50}]}>{this.state.today_time && this.state.today_time.length > 0 ? this.state.today_time[0]+"-"+this.state.today_time[1] : '登録なし'}</RegularText>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.section}>
                            <View style={shared.flexCenter}>
                                <FontAwesome size={14} name={"check-circle"} color={Colors.secColor} />
                                <RegularText style={[{color: '#848484'}, fonts.size14, margin.ml1]}>デリバーのルール</RegularText>
                            </View>
                            <RegularText style={{fontSize: 14, lineHeight: 20, marginTop: 10}}>配達依頼が入りましたら、3分以内にエントリーをしてください。</RegularText>
                        </View>
                        <View style={styles.section}>
                            <TouchableOpacity onPress={() => this.changeStatus('now')} style={[styles.btn, {borderColor: Colors.secColor, borderWidth: 1}]}>
                                <BoldText style={[fonts.size14, {color: Colors.secColor}]}>今から配達可能</BoldText>
                            </TouchableOpacity>
                            <View style={[shared.flexCenter, margin.mt4, {justifyContent: 'space-between'}]}>
                                <TouchableOpacity onPress={() => this.changeStatus('pause')} style={this.state.today_time && moment().format("HH:mm") >= this.state.today_time[0] ? [styles.btn, {borderColor: Colors.secColor, borderWidth: 1, width: '48%'}] : [styles.btn, {borderColor: '#B5B5B5', borderWidth: 1, width: '48%'}]}>
                                    <BoldText style={[fonts.size14, {color: this.state.today_time && moment().format("HH:mm") >= this.state.today_time[0] ? Colors.secColor : '#B5B5B5'}]}>本日のシフトを終了</BoldText>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => this.changeStatus('finish')} style={[styles.btn, {borderColor: '#CE092E', borderWidth: 1, width: '48%'}]}>
                                    <BoldText style={[fonts.size14, {color: '#CE092E'}]}>本日は配送できません</BoldText>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </ScrollView>
                <View style={{justifyContent: 'center', alignItems: 'center', width: '100%', paddingHorizontal: normalize(20), bottom: 30, position: 'absolute'}}>
                    <TouchableOpacity onPress={() => this.nextScreen()} style={[styles.nextBtn]}>
                        <RegularText style={[styles.btnText , fonts.size15]}>登録完了</RegularText>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </Container>
      );
    }
}
TodayShift.navigationOptions = {
  header: null
}
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
        marginTop: 15,
        paddingBottom: 10,
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
    btn: {
        paddingVertical: 15,
        alignItems: 'center', 
        borderRadius: 20
    },
    btnText: {
        padding: 18,
        width: "100%",
        color: '#fff',
        textAlign: 'center',
    },
    nextBtn: {
        borderRadius: 12, width: '100%',backgroundColor: Colors.mainColor 
    },
});
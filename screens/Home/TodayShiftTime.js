import React from 'react';
import { StyleSheet, View, Platform, Text, Image, TouchableOpacity, StatusBar, SafeAreaView } from 'react-native';
import { shared, fonts, margin, normalize } from '../../assets/styles';
import { ScrollView } from 'react-native-gesture-handler';
import { Actions } from 'react-native-router-flux';
import { FontAwesome, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { Container, Content, Col } from 'native-base';
import Colors from '../../constants/Colors';
import Constants from "expo-constants";
import moment from 'moment';
import { RegularText, BoldText } from '../../components/StyledText';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Back from '../../components/Back';
import Spinner_bar from 'react-native-loading-spinner-overlay';
import { showToast } from '../../shared/global';
import { updateShift } from '../../api';
export default class TodayShiftTime extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            timeShow: false,
            startTime: '00:00',
            endTime: '00:00',
            timeType: 0,
            loaded: true
        }
    }
    componentDidMount() {
        let todayTime = this.props.shift_hours[moment().format('d')]
        if (todayTime && todayTime.length > 0) {
            this.setState({ startTime: todayTime[0] })
            this.setState({ endTime: todayTime[1] })
        }
    }
    hideDatePicker = () => {
        this.setState({ timeShow: false })
        this.setState({ timeType: 0 })
    };

    handleConfirm = (date) => {
        let time = moment(date).format("HH:mm")
        if (this.state.timeType == 1)
            this.setState({ startTime: time })
        else if (this.state.timeType == 2)
            this.setState({ endTime: time })
        this.hideDatePicker();
    };
    chooseTime(type) {
        this.setState({ timeShow: true })
        this.setState({ timeType: type })
    }

    async nextScreen() {
        let shift = this.props.shift_hours
        shift[moment().format('d')] = [this.state.startTime, this.state.endTime]
        console.log(shift);
        this.setState({ loaded: false })
        await updateShift(shift)
            .then(async (response) => {
                if (response.status == 1) {
                    Actions.pop()
                    setTimeout(function () {
                        Actions.refresh()
                    }, 10);
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
            <Container style={[shared.mainContainer]}>
                {Platform.OS === 'ios' && <StatusBar barStyle="dark-content" backgroundColor="white" />}
                <SafeAreaView style={{ flex: 1, backgroundColor: '#f2f2f2', marginTop: Constants.statusBarHeight }}>
                    <ScrollView ref={ref => this.scrollRef = ref} >
                        <View style={{ flex: 1, backgroundColor: 'white' }}>
                            <Back color="#d3d3d3" />
                            <View style={[styles.header]}>
                                <BoldText style={[fonts.size32]}>今すぐ配達</BoldText>
                            </View>
                            <View style={[styles.section, shared.flexCenter, { borderBottomWidth: 0 }]}>
                                <View style={[shared.flexCenter, { flex: 1 }]}>
                                    <MaterialCommunityIcons size={14} name={"clock"} color={Colors.secColor} />
                                    <RegularText style={[{ color: '#848484' }, fonts.size14, margin.ml1]}>開始時間</RegularText>
                                </View>
                                <View style={[shared.flexCenter, { flex: 1 }]}>
                                    <MaterialCommunityIcons size={14} name={"clock"} color={Colors.secColor} />
                                    <RegularText style={[{ color: '#848484' }, fonts.size14, margin.ml1]}>終了時間</RegularText>
                                </View>
                            </View>
                            <View style={[styles.section, shared.flexCenter, { marginTop: 0 }]}>
                                <View style={[shared.flexCenter, { flex: 1, justifyContent: 'space-between' }]}>
                                    <TouchableOpacity onPress={() => this.chooseTime(1)}>
                                        <RegularText style={[{ color: Colors.secColor }, fonts.size50]}>{this.state.startTime}</RegularText>
                                    </TouchableOpacity>
                                    <RegularText style={[{ color: Colors.secColor }, fonts.size50, margin.mr1]}>-</RegularText>
                                </View>
                                <View style={[shared.flexCenter, { flex: 1 }]}>
                                    <TouchableOpacity onPress={() => this.chooseTime(2)}>
                                        <RegularText style={[{ color: Colors.secColor }, fonts.size50]}>{this.state.endTime}</RegularText>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                    <View style={{ justifyContent: 'center', alignItems: 'center', width: '100%', paddingHorizontal: normalize(20), bottom: 30, position: 'absolute' }}>
                        <TouchableOpacity onPress={() => this.nextScreen()} style={[styles.nextBtn]}>
                            <RegularText style={[styles.btnText, fonts.size15]}>登録完了</RegularText>
                        </TouchableOpacity>
                    </View>
                    <DateTimePickerModal
                        isVisible={this.state.timeShow}
                        mode="time"
                        onConfirm={this.handleConfirm}
                        onCancel={this.hideDatePicker}
                        cancelTextIOS="キャンセル"
                        confirmTextIOS="完了"
                        headerTextIOS="時間設定"
                        isDarkModeEnabled={false}
                    />
                </SafeAreaView>
                <Spinner_bar color={'#27cccd'} visible={!this.state.loaded} textContent={""} overlayColor={"rgba(0, 0, 0, 0.5)"} />
            </Container>
        );
    }
}
TodayShiftTime.navigationOptions = {
    header: null
}
const styles = StyleSheet.create({
    header: {
        borderBottomColor: '#f2f2f2', borderBottomWidth: 1, paddingHorizontal: normalize(20), paddingBottom: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10
    },
    section: {
        paddingHorizontal: normalize(20),
        borderBottomColor: '#f2f2f2',
        borderBottomWidth: 1,
        marginTop: 20,
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
        borderRadius: 12, width: '100%', backgroundColor: Colors.mainColor
    },
});
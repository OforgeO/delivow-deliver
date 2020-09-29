import React from 'react';
import { StyleSheet, View, TouchableOpacity, KeyboardAvoidingView, ScrollView,SafeAreaView, Platform, StatusBar } from 'react-native';
import { Container, Content, Item, Input, Text } from 'native-base';
import { normalize, fonts, margin, form, shared} from '../../assets/styles';
import {Actions} from 'react-native-router-flux';
import Colors from '../../constants/Colors';
import { FontAwesome } from '@expo/vector-icons';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from 'moment';
import Constants from "expo-constants";
import { RegularText, BoldText } from '../../components/StyledText';
import { getShift, updateShift } from '../../api';
import Spinner_bar from 'react-native-loading-spinner-overlay';
import { showToast } from '../../shared/global';
import { dayNamesLong } from '../../constants/Global'
import Back from '../../components/Back';
import OrderConfirm from '../../components/OrderConfirm';
import store from '../../store/configuteStore';
TouchableOpacity.defaultProps = { activeOpacity: 0.8 };

export default class ShiftRegister extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            dateList: [
            ],
            timeShow: false,
            timeIndex: 0,
            timeType: 0,
            loaded: true
        };
    }
    async componentDidMount(){
        this.setState({ loaded: false })
        await getShift()
        .then(async (response) => {
            if(response.status == 1) {
                let shift = response.shift
                shift = JSON.parse(shift)
                if(shift && shift.length > 0) {
                    let shift_list = []
                    shift.map((shift_hour, index) => {
                        let temp = { id: index, date: dayNamesLong[index], selected: shift_hour.length == 2 ? true : false, time1: shift_hour[0] ? shift_hour[0] : "00:00", time2: shift_hour[1] ? shift_hour[1] : "00:00"}
                        shift_list.push(temp)
                    })
                    this.setState({dateList : shift_list})
                }
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

    async nextScreen(){
        let shift = []
        for(var i = 0;i<this.state.dateList.length;i++){
            if(this.state.dateList[i].selected){
                shift.push([this.state.dateList[i].time1, this.state.dateList[i].time2])
            } else {
                shift.push([])
            }
        }

        this.setState({ loaded: false })
        await updateShift(shift)
        .then(async (response) => {
            if(response.status == 1) {
                Actions.pop()
                setTimeout(function() {
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

    checkDate(id) {
        let temp = this.state.dateList
        for(var i = 0;i<temp.length;i++){
            if(temp[i].id == id){
                temp[i].selected = !temp[i].selected
            }
        }
        this.setState({dateList: temp})
    }

    chooseTime(id, type) {
        this.setState({timeIndex: id})
        this.setState({timeType: type})
        this.setState({timeShow: true})
    }

    renderDateList() {
        return this.state.dateList.map((option, index) => {
            return <View key={index} style={[shared.flexCenter, {justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: '#f2f2f2', paddingVertical: 10}]}>
                    <TouchableOpacity style={[shared.flexCenter]} onPress={() => this.checkDate(option.id)}>
                    <FontAwesome name="check-circle" size={20} color={option.selected ? Colors.secColor : '#D3D3D3'} />
                    <RegularText style={option.selected ? [fonts.size18, margin.ml1] : [fonts.size18, margin.ml1, {color: '#d3d3d3'}]}>{option.date}</RegularText>
                </TouchableOpacity>
                {
                    option.selected ?
                    <View style={shared.flexCenter}>
                        <TouchableOpacity onPress={() => this.chooseTime(option.id, 1)}>
                            <BoldText style={[fonts.size18, {color: Colors.secColor}]}>{option.time1 ? option.time1 : '00:00'}</BoldText>
                        </TouchableOpacity>
                        <BoldText style={{color: 'black'}}>-</BoldText>
                        <TouchableOpacity onPress={() => this.chooseTime(option.id, 2)}>
                            <BoldText style={[fonts.size18, {color: Colors.secColor}]}>{option.time2 ? option.time2 : '00:00'}</BoldText>
                        </TouchableOpacity>
                    </View>
                    :
                    <View style={shared.flexCenter}>
                        <BoldText style={[fonts.size18, {color: '#d3d3d3'}]}>{option.time1 ? option.time1 : '00:00'}-{option.time2 ? option.time2 : '00:00'}</BoldText>
                    </View>
                }
            </View>
        })
    }
    hideDatePicker = () => {
        this.setState({timeShow: false})
        this.setState({timeType: 0})
        this.setState({timeIndex: 0})
    };
     
    handleConfirm = (date) => {
        let time = moment(date).format("HH:mm")
        let temp = this.state.dateList
        for(var i = 0;i<temp.length;i++){
            if(temp[i].id == this.state.timeIndex){
                if(this.state.timeType == 1)
                    temp[i].time1 = time
                else if(this.state.timeType == 2)
                    temp[i].time2 = time
            }
        }
        this.setState({dateList: temp})
        this.hideDatePicker();
    };
    
    render(){
        return (
            <Container>
                {Platform.OS === 'ios' && <StatusBar barStyle="dark-content" backgroundColor="white" />}
                <OrderConfirm />
                <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
                    <ScrollView style={{backgroundColor: '#f2f2f2'}}>
                        <View style={{flex: 1, paddingTop: store.getState().showDeliver.showDeliver && store.getState().showDeliver.showBookDeliver ? 100 : (store.getState().showDeliver.showDeliver || store.getState().showDeliver.showBookDeliver) ? 50 : 0}}>
                            <Back color={"#d3d3d3"} />
                            <View style={[styles.whiteSection, {paddingBottom: 15}]}>
                                <RegularText style={[fonts.size32]}>シフトを編集</RegularText>
                            </View>
                            <View style={[styles.greySection, {height: 10, paddingTop: 0}]}>
                            </View>
                            <View style={styles.whiteSection}>
                            {
                                this.renderDateList()
                            }
                            </View>
                            <View style={{padding: normalize(20)}}>
                                <RegularText style={[fonts.size14, {lineHeight: 20}]}>※当日に急遽配達ができなくなった場合は、</RegularText>
                                <RegularText style={[fonts.size14, {lineHeight: 20}]}>  シフトの時間を変更してください。</RegularText>
                            </View>
                            <View style={[styles.greySection, {paddingBottom: 20}]}>
                                <View style={{justifyContent: 'center', alignItems: 'center', width: '100%'}}>
                                    <TouchableOpacity onPress={() => this.nextScreen()} style={[styles.nextBtn]}>
                                        <RegularText style={[styles.btnText , fonts.size16]}>登録</RegularText>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </ScrollView>
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

const styles = StyleSheet.create({
    contentBg: {
        flex: 1
    },
    btnText: {
        padding: 18,
        width: "100%",
        color: '#fff',
        textAlign: 'center',
    },
    label: {
        marginBottom: 5,
        marginTop: 10,
        paddingLeft: 3
    },
    nextBtn: {
        borderRadius: 12, width: '100%',backgroundColor: Colors.mainColor 
    },
    whiteSection: {
        backgroundColor: 'white',
        paddingHorizontal: normalize(20),
    },
    greySection: {
        backgroundColor: '#f2f2f2',
        paddingHorizontal: normalize(20),
        paddingTop: normalize(20),
        paddingBottom: 5
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
});

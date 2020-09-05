import React from 'react';
import { StyleSheet, View, TouchableOpacity,ScrollView, Platform, SafeAreaView } from 'react-native';
import { Container, Content, Item, Input, Text } from 'native-base';
import { normalize, fonts, margin, form, shared} from '../../assets/styles';
import { connect } from "react-redux";
import { setUser } from '../../actions';
import {Actions} from 'react-native-router-flux';
import Colors from '../../constants/Colors';
import { FontAwesome } from '@expo/vector-icons';
import Layout from '../../constants/Layout';
import Modal from 'react-native-modal';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from 'moment';
import { registerAreaShift } from '../../api';
import { RegularText, BoldText } from '../../components/StyledText';
import { showToast } from '../../shared/global';
import Spinner_bar from 'react-native-loading-spinner-overlay';
import Constants from 'expo-constants';
import { dayNamesShort } from '../../constants/Global';
TouchableOpacity.defaultProps = { activeOpacity: 0.8 };
class AreaShift extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            deliverOptions: [
                {id: 1, selected: false, text: '全域'},
                {id: 2, selected: false, text: '豊橋駅周辺エリア'},
                {id: 3, selected: false, text: '藤沢周辺エリア'},
                {id: 4, selected: false, text: '大清水周辺エリア'},
                {id: 5, selected: false, text: '岩田・牛川周辺エリア'},
                {id: 6, selected: false, text: '向山・佐藤・三ノ輪周辺エリア'},
                {id: 7, selected: false, text: '曙・高師・三本木周辺エリア'},
                {id: 8, selected: false, text: '二川周辺エリア'}
            ],
            dateList: [
                {id: 1, selected: false, date: '', time1: '11:00', time2: '16:00', weekDay: 0},
                {id: 2, selected: false, date: '', time1: '11:00', time2: '16:00', weekDay: 0},
                {id: 3, selected: false, date: '', time1: '11:00', time2: '16:00', weekDay: 0},
                {id: 4, selected: false, date: '', time1: '11:00', time2: '16:00', weekDay: 0},
                {id: 5, selected: false, date: '', time1: '11:00', time2: '16:00', weekDay: 0},
                {id: 6, selected: false, date: '', time1: '11:00', time2: '16:00', weekDay: 0},
                {id: 7, selected: false, date: '', time1: '11:00', time2: '16:00', weekDay: 0},
            ],
            timeShow: false,
            timeIndex: 0,
            timeType: 0,
            loaded: true,
            deliverAddress: []
        };
    }
    componentDidMount(){
        let list = this.state.dateList;
        list.map((date, index) => {
            date.date = moment().add('days', index).format('M/D') + '('+ dayNamesShort[moment().add('days', index).format('d')]+')'
            date.weekDay = moment().add('days', index).format('d')
        })
        this.setState({dateList: list})
    }

    async nextScreen(){
        let temp = this.state.dateList
        temp.sort(function(a, b) {
            return a.weekDay - b.weekDay
        })
        let shift = [];
        temp.map((date, index) =>{
            if(date.selected){
                shift.push([date.time1, date.time2])
            } else{
                shift.push([])
            }
        })
        
        this.setState({loaded: false})
        await registerAreaShift(this.state.deliverAddress, this.props.phone, shift)
            .then(async (response) => {
            this.setState({loaded: true});
            if(response.status == 1)
                Actions.push("termsscreen", {phone: this.props.phone})
            else
                showToast(response.message)
        })
        .catch((error) => {
            this.setState({loaded: true});
            showToast();
        });
        
    }
    checkOption(id){
        let temp = this.state.deliverOptions
        let addr = [];
        for(var i = 0;i<temp.length;i++){
            if(temp[i].id == id){
                temp[i].selected = !temp[i].selected
            }
            if(temp[i].selected){
                addr.push(temp[i].id)
            }
        }
        this.setState({deliverAddress: addr})
        this.setState({deliverOptions: temp})
    }
    renderDeliverOptions() {
        return this.state.deliverOptions.map((option) => {
            return <TouchableOpacity onPress={() => this.checkOption(option.id)} style={margin.mb2}>
                    <View style={[shared.flexCenter]}>
                    <FontAwesome name="check-circle" size={20} color={option.selected ? Colors.secColor : '#D3D3D3'} />
                    <View>
                        <RegularText style={option.selected ? [fonts.size14, margin.ml1] : [fonts.size14, margin.ml1, {color: '#d3d3d3'}]}>{option.text}</RegularText>
                    </View>
                </View>
            </TouchableOpacity>
        })
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
        return this.state.dateList.map((option) => {
            return <View style={[shared.flexCenter, {justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: '#f2f2f2', paddingVertical: 10}]}>
                    <TouchableOpacity style={[shared.flexCenter]} onPress={() => this.checkDate(option.id)}>
                    <FontAwesome name="check-circle" size={20} color={option.selected ? Colors.secColor : '#D3D3D3'} />
                    <BoldText style={option.selected ? [fonts.size14, margin.ml1] : [fonts.size14, margin.ml1, {color: '#d3d3d3'}]}>{option.date}</BoldText>
                </TouchableOpacity>
                {
                    option.selected ?
                    <View style={shared.flexCenter}>
                        <TouchableOpacity onPress={() => this.chooseTime(option.id, 1)}>
                            <BoldText style={[fonts.size14,{color: Colors.secColor}]}>{option.time1}</BoldText>
                        </TouchableOpacity>
                        <BoldText style={{color: 'black'}}> - </BoldText>
                        <TouchableOpacity onPress={() => this.chooseTime(option.id, 2)}>
                            <BoldText style={[fonts.size14,{color: Colors.secColor}]}>{option.time2}</BoldText>
                        </TouchableOpacity>
                    </View>
                    :
                    <View>
                        <BoldText style={[fonts.size14, {color: '#d3d3d3'}]}>{option.time1 + ' - ' + option.time2}</BoldText>
                    </View>
                }
            </View>
        })
    }
    hideDatePicker = () => {
        this.setState({timeIndex: 0})
        this.setState({timeType: 0})
        this.setState({timeShow: false})
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
                <SafeAreaView style={[styles.contentBg, {}]}>
                    <ScrollView>
                        <View style={{flex: 1}}>
                            <View style={[styles.whiteSection, {paddingBottom: 10}]}>
                                <BoldText style={[fonts.size32]}>エリアとシフト</BoldText>
                            </View>
                            <View style={styles.greySection}>
                                <BoldText style={[fonts.size14]}>配達希望エリア(複数選択可)</BoldText>
                                <RegularText style={{paddingTop: 0}}>※希望外からの配達依頼もあります。</RegularText>
                            </View>
                            <View style={styles.whiteSection}>
                            {
                                this.renderDeliverOptions()
                            }
                            </View>
                            <View style={styles.greySection}>
                                <BoldText style={[fonts.size14]}>希望シフト</BoldText>
                                <RegularText style={{paddingTop: 0}}>シフトはマーページでいつでも変更が可能です。</RegularText>
                            </View>
                            <View style={styles.whiteSection}>
                            {
                                this.renderDateList()
                            }
                            </View>
                            <View style={[styles.greySection, {paddingBottom: 20}]}>
                                <View style={{justifyContent: 'center', alignItems: 'center', width: '100%'}}>
                                    <TouchableOpacity onPress={() => this.nextScreen()} style={[styles.nextBtn]}>
                                        <BoldText style={[styles.btnText , fonts.size16]}>次へ </BoldText>
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
                        isDarkModeEnabled={false}
                        headerTextIOS="時間設定"
                    />
                    <Spinner_bar color={'#27cccd'} visible={!this.state.loaded} textContent={""} overlayColor={"rgba(0, 0, 0, 0.5)"} />
                </SafeAreaView>
            </Container>
        );
    }
}
const mapDispatchToProps = dispatch => {
    return {
        setUser : user => { dispatch(setUser(user)) }
    }
}

export default connect(null,mapDispatchToProps)(AreaShift)

const styles = StyleSheet.create({
    contentBg: {
        flex: 1
    },
    btnText: {
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
        borderRadius: 12, width: '100%',backgroundColor: Colors.mainColor,
        paddingVertical: Platform.OS == 'ios' ? 17 : 12
    },
    whiteSection: {
        backgroundColor: 'white',
        paddingHorizontal: normalize(20),
        paddingVertical: normalize(10)
    },
    greySection: {
        backgroundColor: '#f2f2f2',
        paddingHorizontal: normalize(20),
        paddingTop: normalize(20),
        paddingBottom: 5
    }
});

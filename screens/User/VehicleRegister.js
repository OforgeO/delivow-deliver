import React from 'react';
import { StyleSheet, Platform, View, TouchableOpacity, ScrollView, SafeAreaView, Alert } from 'react-native';
import { Container, Content, Item, Input, Text } from 'native-base';
import { normalize, fonts, margin, form, shared} from '../../assets/styles';
import { connect } from "react-redux";
import { setUser } from '../../actions';
import {Actions} from 'react-native-router-flux';
import Colors from '../../constants/Colors';
import { FontAwesome } from '@expo/vector-icons';
import Layout from '../../constants/Layout';
import Spinner_bar from 'react-native-loading-spinner-overlay';
import Constants from 'expo-constants';
import { RegularText, BoldText } from '../../components/StyledText';
import { registerVehicleType, getUser, updateVehicleType } from '../../api';
import { showToast } from '../../shared/global';
import { _e } from '../../lang';
TouchableOpacity.defaultProps = { activeOpacity: 0.8 };

export default class VehicleRegister extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            deliverOptions: [
                {id: 1, selected: false, text: '二輪バイク(125㏄以下)', note:'', input: false, type: 'motor'},
                {id: 2, selected: false, text: '自転車', note:'', input: false, type: 'bike'},
                {id: 3, selected: false, text: '自動車(事業用限定)', note: '※事業用自動車は、緑地に白色文字(通称：緑ナンバー)または黒地に黄色文字(通称：黒ナンバー)のどちらかです', input: false, type: 'car'},
                {id: 4, selected: false, text: 'その他', note: '', input: true, type: ''},
            ],
            deliverType: '',
            other: '',
            optionList: [
                {id: 1, title: '免許証 または 身分証明書', desc: '免許証 または 身分証明書を登録'},
                {id: 2, title: '車両ナンバー(自転車の方は不要)', desc: '車両ナンバーを登録'},
                {id: 3, title: '保険証書', desc: '保険証書をアップロード'}
            ],
            loaded: true,
        };
    }
    async componentDidMount(){
        if(this.props.type == 'update'){
            this.setState({ loaded: false })
            await getUser()
            .then(async (response) => {
                if(response.status == 1) {
                    let options = this.state.deliverOptions
                    if(response.user.vehicle_type == 'motor'){
                        this.setState({deliverType : response.user.vehicle_type})
                        options[0]['selected'] = true
                    }
                    else if(response.user.vehicle_type == 'bike'){
                        options[1]['selected'] = true
                        this.setState({deliverType : response.user.vehicle_type})
                    }
                    else if(response.user.vehicle_type == 'car'){
                        options[2]['selected'] = true
                        this.setState({deliverType : response.user.vehicle_type})
                    }
                    else{
                        options[3]['selected'] = true
                        this.setState({other: response.user.vehicle_type})
                        this.setState({deliverType : response.user.vehicle_type})
                    }
                    this.setState({deliverOptions: options})
                    
                } else {
                    showToast(response.message)
                }
                this.setState({ loaded: true })
            })
            .catch((error) => {
                this.setState({ loaded: true })
                showToast();
            });
        }
        
    }

    async nextScreen(){
        if(this.state.deliverType != ''){
            if(this.props.type == 'update') {
                this.setState({loaded: false})
                await updateVehicleType(this.state.deliverType)
                    .then(async (response) => {
                    this.setState({loaded: true});
                    if(response.status == 1){
                        Actions.popTo("editaccount")
                        setTimeout(function() {
                            Actions.refresh()
                        }, 10)
                    }
                    else
                        showToast(response.message)
                })
                .catch((error) => {
                    this.setState({loaded: true});
                    showToast();
                });
                
            } else {
                this.setState({loaded: false})
                await registerVehicleType(this.props.phone, this.state.deliverType)
                    .then(async (response) => {
                    this.setState({loaded: true});
                    if(response.status == 1){
                        Actions.push("areashift", {phone: this.props.phone})
                    }
                    else
                        showToast(response.message)
                })
                .catch((error) => {
                    this.setState({loaded: true});
                    showToast();
                });
            }
        } else {
            Alert.alert(_e.noSelectDelivery)
        }
    }
    checkOption(id){
        let temp = this.state.deliverOptions
        for(var i = 0;i<temp.length;i++){
            if(temp[i].id == id){
                temp[i].selected = true
                if(id != 4)
                    this.setState({deliverType : temp[i].type})
                else
                    this.setState({deliverType : this.state.other})
            }else{
                temp[i].selected = false
            }
        }
        this.setState({deliverOptions: temp})
    }
    renderDeliverOptions() {
        return this.state.deliverOptions.map((option) => {
            return <TouchableOpacity key={option.id} onPress={() => this.checkOption(option.id)}>
                <View style={option.note ? [shared.flexCenter] : [shared.flexCenter, margin.mb2]}>
                    <FontAwesome name="check-circle" size={20} color={option.selected ? Colors.secColor : '#D3D3D3'} />
                    <View>
                        <RegularText style={option.selected ? [fonts.size14, margin.ml1, {color: 'black'}] : [fonts.size14, margin.ml1, {color: '#d3d3d3'}]}>{option.text}</RegularText>
                    </View>
                    {
                        option.input ?
                        <Item rounded style={ [form.item, { width: '100%', flex: 1, marginBottom: 0 }, margin.ml2, margin.mt2 ] }>
                            <Input
                                placeholder = "配達手段入力…"
                                value = { this.state.other }
                                disabled={!option.selected}
                                style = { [form.input] }
                                onChangeText = {(text) => {this.setOther(text)}}
                                placeholderTextColor = '#9da8bf'
                            />
                        </Item>
                        :
                        null
                    }
                </View>
            {
                option.note ?
                <RegularText style={option.selected ? {marginLeft: 30,paddingTop: 0, color: 'black' } : {marginLeft: 30,paddingTop: 0, color: '#d3d3d3'}}>{option.note}</RegularText>
                :
                null
            }
            </TouchableOpacity>
        })
    }
    setOther(text) {
        this.setState({other: text})
        this.setState({deliverType: text})
    }
    choose(id) {
        if(id == 1){
            Actions.push("licenseregister", {phone: this.props.phone, type: this.props.type})
        } else if(id == 2) {
            Actions.push("vehiclenoregister", {phone: this.props.phone, type: this.props.type})
        } else if(id == 3) {
            Actions.push("insuranceregister", {phone: this.props.phone, type: this.props.type})
        }
    }
    renderOptionList() {
        return this.state.optionList.map((option) => {
            return <View key={option.id}>
                <View style={styles.greySection}>
                    <BoldText style={[fonts.size14]}>{option.title}</BoldText>
                </View>
                <TouchableOpacity style={[styles.whiteSection, shared.flexCenter]} onPress={() => this.choose(option.id)}>
                    <FontAwesome name="chevron-circle-right" size={20} color={Colors.secColor} />
                    <BoldText style={[fonts.size14, margin.ml1, {color: Colors.secColor}]}>{option.desc}</BoldText>
                </TouchableOpacity>
            </View>
        })
    }
    
    render(){
        return (
            <Container style={[shared.mainContainer]}>
                <SafeAreaView style={[styles.contentBg]}>
                    <ScrollView style={{backgroundColor: '#f2f2f2'}}>
                        
                            <View style={[styles.whiteSection, {paddingTop: 20}]}>
                                <BoldText style={[fonts.size32]}>
                                    {
                                        this.props.type == 'update' ?
                                        '車両情報の変更'
                                        :
                                        '配達手段と車両情報'
                                    }
                                </BoldText>
                            </View>
                            <View style={styles.greySection}>
                                <BoldText style={[fonts.size14]}>配達手段</BoldText>
                            </View>
                            <View style={styles.whiteSection}>
                            {
                                this.renderDeliverOptions()
                            }
                            </View>
                            {
                                this.renderOptionList()
                            }
                            <View style={[styles.greySection, {paddingTop: 30, paddingBottom: 30}]}>
                                <View style={{justifyContent: 'center', alignItems: 'center', width: '100%'}}>
                                    <TouchableOpacity onPress={() => this.nextScreen()} style={[styles.nextBtn]}>
                                        <BoldText style={[styles.btnText , fonts.size14]}>{this.props.type == 'update' ? '変更' : '次へ'}</BoldText>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        
                        <Spinner_bar color={'#27cccd'} visible={!this.state.loaded} textContent={""} overlayColor={"rgba(0, 0, 0, 0.5)"} />
                    </ScrollView>
                </SafeAreaView>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    contentBg: {
        flex: 1,
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
        paddingVertical: 13
    },
    greySection: {
        backgroundColor: '#f2f2f2',
        paddingHorizontal: normalize(20),
        paddingTop: normalize(10),
        paddingBottom: 5
    }
});

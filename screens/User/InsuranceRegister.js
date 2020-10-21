import React from 'react';
import { StyleSheet, Image, View, TouchableOpacity, Platform, ScrollView, SafeAreaView } from 'react-native';
import { Container, Content, Item, Input, Text } from 'native-base';
import { normalize, fonts, margin, form, shared} from '../../assets/styles';
import { connect } from "react-redux";
import { setUser } from '../../actions';
import {Actions} from 'react-native-router-flux';
import Colors from '../../constants/Colors';
import { FontAwesome } from '@expo/vector-icons';
import Layout from '../../constants/Layout';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import Modal from 'react-native-modal';
import Spinner_bar from 'react-native-loading-spinner-overlay';
import Constants from 'expo-constants';
import { RegularText, BoldText } from '../../components/StyledText';
import { registerInsurance, getUser, updateInsurance } from '../../api';
import { showToast } from '../../shared/global';
import { _e } from '../../lang';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import moment from 'moment';
TouchableOpacity.defaultProps = { activeOpacity: 0.8 };

class InsuranceRegister extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            insuranceYear: '',
            insuranceMonth: '',
            insuranceDay: '',
            anyYear: '',
            anyMonth: '',
            anyDay: '',
            insuranceImage: '',
            anyImage: '',
            insuranceSelect: false,
            anySelect: false,
            imageModal: false,
            loaded: true,
            insuranceYearError: false,
            insuranceMonthError: false,
            insuranceDayError: false,
            anyYearError: false,
            anyMonthError: false,
            anyDayError: false,
            insuranceImageError: false,
            anyImageError: false
        };
    }
    async componentDidMount(){
        if(this.props.type == 'update') {
            this.setState({ loaded: false })
            await getUser()
            .then(async (response) => {
                if(response.status == 1) {
                    this.setState({insuranceImage: response.user.insurance_image})
                    this.setState({anyImage: response.user.voluntary_image})
                    if(response.user.insurance_valid_date && moment(response.user.insurance_valid_date).isValid()) {
                        this.setState({insuranceYear: response.user.insurance_valid_date ? moment(response.user.insurance_valid_date).format("YYYY") : ''})
                        this.setState({insuranceMonth: response.user.insurance_valid_date ? moment(response.user.insurance_valid_date).format("MM") : ''})
                        this.setState({insuranceDay: response.user.insurance_valid_date ? moment(response.user.insurance_valid_date).format("DD") : ''})
                    }
                    if(response.user.voluntary_expire_date && moment(response.user.voluntary_expire_date).isValid()) {
                        this.setState({anyYear: response.user.voluntary_expire_date ? moment(response.user.voluntary_expire_date).format("YYYY") : ''})
                        this.setState({anyMonth: response.user.voluntary_expire_date ? moment(response.user.voluntary_expire_date).format("MM") : ''})
                        this.setState({anyDay: response.user.voluntary_expire_date ? moment(response.user.voluntary_expire_date).format("DD") : ''})
                    }
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
        let valid = true
        if(this.state.insuranceYear == ''){
            this.setState({insuranceYearError : true})
            valid = false
        } else{
            this.setState({insuranceYearError : false})
        }
        if(this.state.insuranceMonth == ''){
            this.setState({insuranceMonthError : true})
            valid = false
        } else{
            this.setState({insuranceMonthError : false})
        }
        if(this.state.insuranceDay == ''){
            this.setState({insuranceDayError : true})
            valid = false
        } else{
            this.setState({insuranceDayError : false})
        }
        if(this.state.anyYear == ''){
            this.setState({anyYearError : true})
            valid = false
        } else{
            this.setState({anyYearError : false})
        }
        if(this.state.anyMonth == ''){
            this.setState({anyMonthError : true})
            valid = false
        } else{
            this.setState({anyMonthError : false})
        }
        if(this.state.anyDay == ''){
            this.setState({anyDayError : true})
            valid = false
        } else{
            this.setState({anyDayError : false})
        }
        if(this.state.insuranceImage == ''){
            this.setState({insuranceImageError : true})
            valid = false
        } else{
            this.setState({insuranceImageError : false})
        }
        if(this.state.anyImage == ''){
            this.setState({anyImageError : true})
            valid = false
        } else{
            this.setState({anyImageError : false})
        }
        if(valid){
            this.setState({loaded: false})
            if(this.props.type == 'update') {
                await updateInsurance(this.state.insuranceImage && this.state.insuranceImage.includes("file://") ? this.state.insuranceImage : null, this.state.anyImage && this.state.anyImage.includes("file://") ? this.state.anyImage : null, this.state.insuranceYear+'-'+this.state.insuranceMonth+'-'+this.state.insuranceDay, this.state.anyYear+'-'+this.state.anyMonth+'-'+this.state.anyDay)
                .then(async (response) => {
                    this.setState({loaded: true});
                    if(response.status == 1){
                        Actions.pop()
                        showToast(response.message, 'success')
                    } else{
                        showToast(response.message)
                    }
                })
                .catch((error) => {
                    this.setState({loaded: true});
                    showToast();
                });
            } else {
                await registerInsurance(this.state.insuranceImage, this.state.anyImage, this.state.insuranceYear+'-'+this.state.insuranceMonth+'-'+this.state.insuranceDay, this.state.anyYear+'-'+this.state.anyMonth+'-'+this.state.anyDay,this.props.phone)
                .then(async (response) => {
                    this.setState({loaded: true});
                    if(response.status == 1){
                        Actions.pop()
                        showToast(response.message, 'success')
                    } else{
                        showToast(response.message)
                    }
                })
                .catch((error) => {
                    this.setState({loaded: true});
                    showToast();
                });
            }
            
        }
    }
    
    chooseImage(type) {
        if(type == 1){
            this.setState({insuranceSelect: true})
            this.setState({anySelect: false})
        } else if(type == 2){
            this.setState({insuranceSelect: false})
            this.setState({anySelect: true})
        }
        this.setState({imageModal: true})
    }
    _pickImage = async () => {
        const {
            status: cameraRollPerm
        } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    
        // only if user allows permission to camera roll
        if (cameraRollPerm === 'granted') {
            let pickerResult = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                aspect: [3, 2],
                quality: 0.1
            });
        
            this._handleImagePicked(pickerResult);
        }
        this.setState({imageModal: false})
    }

    _takePhoto = async () => {
        const {
            status: cameraPerm
        } = await Permissions.askAsync(Permissions.CAMERA);
    
        const {
            status: cameraRollPerm
        } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    
        // only if user allows permission to camera AND camera roll
        if (cameraPerm === 'granted' && cameraRollPerm === 'granted') {
            let pickerResult = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                aspect: [3, 2],
                quality: 0.1
            });
        
            this._handleImagePicked(pickerResult);
        }
        this.setState({imageModal: false})
    };

    _handleImagePicked = async pickerResult => {
        try {
            if(this.state.insuranceSelect && pickerResult.uri)
                this.setState({insuranceImage: pickerResult.uri})
            else if(this.state.anySelect && pickerResult.uri)
                this.setState({anyImage: pickerResult.uri})
        } catch (e) {
        }
    };

    _renderModalContent = () => (
        <View style={styles.modal}>
            <View style={styles.option}>
                <TouchableOpacity style={styles.optionHeader} onPress={this._takePhoto}>
                    <RegularText style={[fonts.size18, {color: Colors.secColor}]}>写真を撮る</RegularText>
                </TouchableOpacity>
                <TouchableOpacity style={{ paddingVertical: Platform.OS == 'ios' ? 17 : 12, width: '100%', alignItems: 'center'}} onPress={this._pickImage}>
                    <RegularText style={[fonts.size18, {color: Colors.secColor}]}>ライブラリから選択</RegularText>
                </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={() => this.setState({imageModal: false})} style={styles.cancel}>
                <BoldText style={[fonts.size18, {color: Colors.secColor, fontWeight:'bold'}]}>キャンセル</BoldText>
            </TouchableOpacity>
        </View>
    );
    render(){
        return (
            <Container>
                <SafeAreaView style={[styles.contentBg ]}>
                        <KeyboardAwareScrollView
                            resetScrollToCoords={{ x: 0, y: 0 }}
                            scrollEnabled={true}
                        >
                            <View style={{flex: 1, paddingHorizontal: normalize(20)}}>
                                <View>
                                    <BoldText style={[fonts.size32, {marginTop: 30, lineHeight: 36}]}>保険証書をアップロード</BoldText>
                                    <View style={margin.mt3}>
                                        <RegularText style={styles.label}>自賠責保険の有効期限</RegularText>
                                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                            <Item rounded style={this.state.insuranceYearError ? [form.item, styles.error, {width: 90}] : [form.item, {width: 90}] }>
                                                <Input
                                                    placeholder = "2000"
                                                    placeholderTextColor = '#9da8bf'
                                                    keyboardType="number-pad"
                                                    value = { this.state.insuranceYear }
                                                    style = { [form.input, fonts.size20, {lineHeight: normalize(23)}] }
                                                    onChangeText = {(text) => {
                                                        if(text.length < 5){
                                                            this.setState({insuranceYear: text})
                                                            if(text.length == 4)
                                                                this.insuranceMonth._root.focus()
                                                        } else{
                                                            this.insuranceMonth._root.focus()
                                                        }
                                                    }}
                                                    onSubmitEditing={() => this.insuranceMonth._root.focus()}
                                                />
                                            </Item>
                                            <RegularText style={{paddingHorizontal: 5,marginBottom: normalize(12)}}>年</RegularText>
                                            <Item rounded style={this.state.insuranceMonthError ? [form.item, styles.error, {width: 60}] : [form.item, {width: 60}] }>
                                                <Input
                                                    placeholder = "01"
                                                    placeholderTextColor = '#9da8bf'
                                                    keyboardType="number-pad"
                                                    value = { this.state.insuranceMonth }
                                                    style = { [form.input, fonts.size20, {lineHeight: normalize(23)}] }
                                                    onChangeText = {(text) => {
                                                        if(text.length < 3){
                                                            this.setState({insuranceMonth: text})
                                                            if(text.length == 2)
                                                                this.insuranceDay._root.focus()
                                                        } else{
                                                            this.insuranceDay._root.focus()
                                                        }
                                                    }}
                                                    ref={ref => {this.insuranceMonth = ref;}}
                                                    onSubmitEditing={() => this.insuranceDay._root.focus()}
                                                />
                                            </Item>
                                            <RegularText style={{paddingHorizontal: 5,marginBottom: normalize(12)}}>月</RegularText>
                                            <Item rounded style={this.state.insuranceDayError ? [form.item, styles.error, {width: 60}] : [form.item, {width: 60}] }>
                                                <Input
                                                    placeholder = "01"
                                                    placeholderTextColor = '#9da8bf'
                                                    keyboardType="number-pad"
                                                    value = { this.state.insuranceDay }
                                                    style = {[form.input, fonts.size20, {lineHeight: normalize(23)}]}
                                                    onChangeText = {(text) => {
                                                        if(text.length < 3){
                                                            this.setState({insuranceDay: text})
                                                        } 
                                                    }}
                                                    ref={ref => {this.insuranceDay = ref;}}
                                                />
                                            </Item>
                                            <RegularText style={{paddingHorizontal: 5,marginBottom: normalize(12)}}>日</RegularText>
                                        </View>
                                    </View>
                                    <RegularText style={margin.mb1}>自賠責保険の写真</RegularText>
                                    <TouchableOpacity onPress={() => this.chooseImage(1)} style={this.state.insuranceImageError ? [styles.licenseImg, styles.error] : styles.licenseImg}>
                                        {
                                            this.state.insuranceImage ?
                                            <Image source={{uri: this.state.insuranceImage, cache: 'force-cache'}} style={{width: '100%', height: '100%'}} resizeMode="contain" />
                                            :
                                            <View style={{width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center'}}>
                                                <FontAwesome name={"upload"} color={Colors.secColor} size={40} />
                                                <BoldText style={[fonts.size14, margin.mt2, {color: Colors.secColor}]}>自賠責保険の写真</BoldText>
                                            </View>
                                        }
                                    </TouchableOpacity>
                                    <View style={margin.mt4}>
                                        <RegularText style={styles.label}>任意保険の有効期限</RegularText>
                                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                            <Item rounded style={this.state.anyYearError ? [form.item, styles.error, {width: 90}] : [form.item, {width: 90}] }>
                                                <Input
                                                    placeholder = "2000"
                                                    placeholderTextColor = '#9da8bf'
                                                    keyboardType="number-pad"
                                                    value = { this.state.anyYear }
                                                    style = { [form.input, fonts.size20, {lineHeight: normalize(23)}] }
                                                    onChangeText = {(text) => {
                                                        if(text.length < 5){
                                                            this.setState({anyYear: text})
                                                            if(text.length == 4)
                                                                this.anyMonth._root.focus()
                                                        } else{
                                                            this.anyMonth._root.focus()
                                                        }
                                                    }}
                                                    onSubmitEditing={() => this.anyMonth._root.focus()}
                                                />
                                            </Item>
                                            <RegularText style={{paddingHorizontal: 5,marginBottom: normalize(12)}}>年</RegularText>
                                            <Item rounded style={this.state.anyMonthError ? [form.item, styles.error, {width: 60}] : [form.item, {width: 60}] }>
                                                <Input
                                                    placeholder = "01"
                                                    placeholderTextColor = '#9da8bf'
                                                    keyboardType="number-pad"
                                                    value = { this.state.anyMonth }
                                                    style = { [form.input, fonts.size20, {lineHeight: normalize(23)}] }
                                                    onChangeText = {(text) => {
                                                        if(text.length < 3){
                                                            this.setState({anyMonth: text})
                                                            if(text.length == 2)
                                                                this.anyDay._root.focus()
                                                        } else{
                                                            this.anyDay._root.focus()
                                                        }
                                                    }}
                                                    ref={ref => {this.anyMonth = ref;}}
                                                    onSubmitEditing={() => this.anyDay._root.focus()}
                                                />
                                            </Item>
                                            <RegularText style={{paddingHorizontal: 5,marginBottom: normalize(12)}}>月</RegularText>
                                            <Item rounded style={this.state.anyDayError ? [form.item, styles.error, {width: 60}] : [form.item, {width: 60}] }>
                                                <Input
                                                    placeholder = "01"
                                                    placeholderTextColor = '#9da8bf'
                                                    keyboardType="number-pad"
                                                    value = { this.state.anyDay }
                                                    style = {[form.input, fonts.size20, {lineHeight: normalize(23)}]}
                                                    onChangeText = {(text) => this.setState({anyDay: text})}
                                                    onChangeText = {(text) => {
                                                        if(text.length < 3){
                                                            this.setState({anyDay: text})
                                                        }
                                                    }}
                                                    ref={ref => {this.anyDay = ref;}}
                                            />
                                        </Item>
                                        <RegularText style={{paddingHorizontal: 5,marginBottom: normalize(12)}}>日</RegularText>
                                    </View>
                                </View>
                                <RegularText style={[margin.mb1]}>任意保険の写真</RegularText>
                                <TouchableOpacity onPress={() => this.chooseImage(2)} style={this.state.anyImageError ? [styles.licenseImg, styles.error] : styles.licenseImg}>
                                    {
                                        this.state.anyImage ?
                                        <Image source={{uri: this.state.anyImage, cache: 'force-cache'}} style={{width: '100%', height: '100%'}} resizeMode="contain" />
                                        :
                                        <View style={{width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center'}}>
                                            <FontAwesome name={"upload"} color={Colors.secColor} size={40} />
                                            <BoldText style={[fonts.size14, margin.mt2, {color: Colors.secColor}]}>任意保険の写真</BoldText>
                                        </View>
                                    }
                                </TouchableOpacity>
                            </View>
                            <View style={{justifyContent: 'center', alignItems: 'center', width: '100%',flex: 1, marginVertical: 30}}>
                                <TouchableOpacity onPress={() => this.nextScreen()} style={[styles.nextBtn]}>
                                    <BoldText style={[styles.btnText , fonts.size16]}>登録 </BoldText>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </KeyboardAwareScrollView>
                    
                    <Modal
                        isVisible={this.state.imageModal}
                        onBackdropPress={() => this.setState({imageModal: false})}
                        style={styles.bottomModal}>
                        {this._renderModalContent()}
                    </Modal>
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

export default connect(null,mapDispatchToProps)(InsuranceRegister)

const styles = StyleSheet.create({
    contentBg: {
        flex: 1
    },
    contentPD: {
        paddingHorizontal: 20,
    },
    btnText: {
        width: "100%",
        color: '#fff',
        textAlign: 'center',
    },
    error: {
        borderColor: '#CE082E',
        borderBottomWidth: 1,
        borderTopWidth: 1,
        borderLeftWidth: 1,
        borderRightWidth: 1,
    },
    label: {
        paddingLeft: 3,
        paddingBottom: 4
    },
    nextBtn: {
        borderRadius: 12, width: '100%',backgroundColor: Colors.mainColor,
        paddingVertical: Platform.OS == 'ios' ? 17 : 12
    },
    avatarSection: {
        width: 250,
        height: 250,
        backgroundColor: '#F2F2F2',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 20,
        borderRadius: 5,
        overflow: 'hidden'
    },
    bottomModal: {
        justifyContent: 'flex-end',
        margin: 0,
    },
    modal: {
        marginBottom: 40, paddingHorizontal: 10
    },
    cancel: {
        backgroundColor: 'white', paddingVertical: Platform.OS == 'ios' ? 17 : 12, alignItems: 'center', borderRadius: 20
    },
    option: {
        backgroundColor: '#d7d7d7', marginBottom: 15, alignItems: 'center', borderRadius: 20
    },
    optionHeader: {
        paddingVertical: Platform.OS == 'ios' ? 17 : 12, borderBottomColor: '#b6b6b6', borderBottomWidth: 1, width: '100%', alignItems: 'center'
    },
    licenseImg: {
        width: Layout.window.width - 40,
        backgroundColor: '#f2f2f2',
        height: (Layout.window.width - 40)*2/3,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        overflow:'hidden'
    }
});

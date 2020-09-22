import React from 'react';
import { StyleSheet, SafeAreaView, Image, View, TouchableOpacity, ScrollView, Platform } from 'react-native';
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
import { RegularText, BoldText } from '../../components/StyledText';
import Spinner_bar from 'react-native-loading-spinner-overlay';
import Constants from 'expo-constants';
import { registerLicense, getUser, updateLicense } from '../../api';
import { showToast } from '../../shared/global';
import { _e } from '../../lang';
import moment from 'moment';
TouchableOpacity.defaultProps = { activeOpacity: 0.8 };

class LicenseRegister extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            licenseModalF: false,
            licenseModalB: false,
            imageFront: '',
            imageBack: '',
            licenseNo: '',
            licenseExpireYear: '',
            licenseExpireMonth: '',
            licenseExpireDay: '',
            imageModal: false,
            loaded: true,
            licenseNoError: false,
            licenseExpireYearError: false,
            licenseExpireMonthError: false,
            licenseExpireDayError: false,
            imageFrontError: false,
            imageBackError: false,
        };
    }
    async componentDidMount(){
        if(this.props.type == 'update') {
            this.setState({ loaded: false })
            await getUser()
            .then(async (response) => {
                if(response.status == 1) {
                    this.setState({licenseNo: response.user.license_number})
                    this.setState({imageFront: response.user.license_image_front})
                    this.setState({imageBack: response.user.license_image_back})
                    this.setState({licenseExpireYear: response.user.license_expire_date ? moment(response.user.license_expire_date).format("YYYY") : ''})
                    this.setState({licenseExpireMonth: response.user.license_expire_date ? moment(response.user.license_expire_date).format("MM") : ''})
                    this.setState({licenseExpireDay: response.user.license_expire_date ? moment(response.user.license_expire_date).format("DD") : ''})
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
        if(this.state.licenseNo == ''){
            this.setState({licenseNoError: true})
            valid = false
        } else{
            this.setState({licenseNoError: false})
        }
        if(this.state.licenseExpireYear == ''){
            this.setState({licenseExpireYearError: true})
            valid = false
        } else{
            this.setState({licenseExpireYearError: false})
        }
        if(this.state.licenseExpireMonth == ''){
            this.setState({licenseExpireMonthError: true})
            valid = false
        } else{
            this.setState({licenseExpireMonthError: false})
        }
        if(this.state.licenseExpireDay == ''){
            this.setState({licenseExpireDayError: true})
            valid = false
        } else{
            this.setState({licenseExpireDayError: false})
        }
        if(this.state.imageFront == ''){
            this.setState({imageFrontError: true})
            valid = false
        } else{
            this.setState({imageFrontError: false})
        }
        if(this.state.imageBack == ''){
            this.setState({imageBackError: true})
            valid = false
        } else{
            this.setState({imageBackError: false})
        }
        if(valid){
            this.setState({loaded: false})
            if(this.props.type == 'update') {
                await updateLicense(this.state.imageFront, this.state.imageBack, this.state.licenseNo, this.state.licenseExpireYear+'-'+this.state.licenseExpireMonth+'-'+this.state.licenseExpireDay)
                .then(async (response) => {
                    this.setState({loaded: true});
                    if(response.status == 1){
                        Actions.pop() 
                        showToast(response.message, 'success')
                    }
                    else
                        showToast(response.message)
                })
                .catch((error) => {
                    this.setState({loaded: true});
                    showToast();
                });
            } else {
                await registerLicense(this.state.imageFront, this.state.imageBack, this.state.licenseNo, this.state.licenseExpireYear+'-'+this.state.licenseExpireMonth+'-'+this.state.licenseExpireDay, this.props.phone)
                .then(async (response) => {
                    this.setState({loaded: true});
                    if(response.status == 1){
                        Actions.pop() 
                        showToast(response.message, 'success')
                    }
                    else
                        showToast(response.message)
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
            this.setState({licenseModalF: true})
            this.setState({licenseModalB: false})
        }
        else if(type == 2){
            this.setState({licenseModalB: true})
            this.setState({licenseModalF: false})
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
            if(this.state.licenseModalF)
                this.setState({imageFront: pickerResult.uri})
            else if(this.state.licenseModalB)
                this.setState({imageBack: pickerResult.uri})
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
                <BoldText style={[fonts.size18, {color: Colors.secColor}]}>キャンセル</BoldText>
            </TouchableOpacity>
        </View>
    );
    render(){
        return (
            <Container>
                <SafeAreaView style={[styles.contentBg]}>
                    {
                        <ScrollView>
                            <View style={{flex: 1, paddingHorizontal: normalize(20)}}>
                                <View>
                                    <BoldText style={[fonts.size32, {marginVertical: 20}]}>免許証 または 身分証明書 を登録</BoldText>
                                    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                        <View style={{width: '47%'}}>
                                            <RegularText style={styles.label}>免許証番号</RegularText>
                                            <Item rounded style={this.state.licenseNoError ? [form.item, styles.error] : [form.item] }>
                                                <Input
                                                    placeholder = "000000000"
                                                    keyboardType="number-pad"
                                                    value = { this.state.licenseNo }
                                                    style = { [form.input, fonts.size20, {lineHeight: normalize(23)}] }
                                                    onChangeText = {(text) => this.setState({licenseNo: text})}
                                                    placeholderTextColor = '#9da8bf'
                                                    returnKeyType="next"
                                                    onSubmitEditing={() => this.licenseExpireYear._root.focus()}
                                                />
                                            </Item>
                                        </View>
                                    </View>
                                    <View>
                                        <RegularText style={styles.label}>免許証の有効期限</RegularText>
                                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                            <Item rounded style={this.state.licenseExpireYearError ? [form.item, styles.error, {width: 90}] : [form.item, {width: 90}] }>
                                                <Input
                                                    placeholder = "2000"
                                                    placeholderTextColor = '#9da8bf'
                                                    keyboardType="number-pad"
                                                    value = { this.state.licenseExpireYear }
                                                    style = { [form.input, fonts.size20, {lineHeight: normalize(23)}] }
                                                    onChangeText = {(text) => {
                                                        if(text.length < 5){
                                                            this.setState({licenseExpireYear: text})
                                                            if(text.length == 4)
                                                                this.licenseExpireMonth._root.focus()
                                                        } else{
                                                            this.licenseExpireMonth._root.focus()
                                                        }
                                                    }}
                                                    ref={ref => {this.licenseExpireYear = ref;}}
                                                    onSubmitEditing={() => this.licenseExpireMonth._root.focus()}
                                                />
                                            </Item>
                                            <RegularText style={{paddingHorizontal: 5,marginBottom: normalize(12)}}>年</RegularText>
                                            <Item rounded style={this.state.licenseExpireMonthError ? [form.item, styles.error, {width: 60}] : [form.item, {width: 60}] }>
                                                <Input
                                                    placeholder = "01"
                                                    placeholderTextColor = '#9da8bf'
                                                    keyboardType="number-pad"
                                                    value = { this.state.licenseExpireMonth }
                                                    style = { [form.input, fonts.size20, {lineHeight: normalize(23)}] }
                                                    onChangeText = {(text) => {
                                                        if(text.length < 3){
                                                            this.setState({licenseExpireMonth: text})
                                                            if(text.length == 2)
                                                                this.licenseExpireDay._root.focus()
                                                        } else{
                                                            this.licenseExpireDay._root.focus()
                                                        }
                                                    }}
                                                    ref={ref => {this.licenseExpireMonth = ref;}}
                                                    onSubmitEditing={() => this.licenseExpireDay._root.focus()}
                                                />
                                            </Item>
                                            <RegularText style={{paddingHorizontal: 5,marginBottom: normalize(12)}}>月</RegularText>
                                            <Item rounded style={this.state.licenseExpireDayError ? [form.item, styles.error, {width: 60}] : [form.item, {width: 60}] }>
                                                <Input
                                                    placeholder = "01"
                                                    placeholderTextColor = '#9da8bf'
                                                    keyboardType="number-pad"
                                                    value = { this.state.licenseExpireDay }
                                                    style = {[form.input, fonts.size20, {lineHeight: normalize(23)}]}
                                                    onChangeText = {(text) => this.setState({licenseExpireDay: text})}
                                                    onChangeText = {(text) => {
                                                        if(text.length < 3){
                                                            this.setState({licenseExpireDay: text})
                                                        }
                                                    }}
                                                    ref={ref => {this.licenseExpireDay = ref;}}
                                                />
                                            </Item>
                                            <RegularText style={{paddingHorizontal: 5,marginBottom: normalize(12)}}>日</RegularText>
                                        </View>
                                    </View>
                                    <RegularText style={margin.mb1}>免許証(表) または 身分証明書の写真　※顔写真のあるもの</RegularText>
                                    <View style={this.state.imageFrontError ? [styles.licenseImg, styles.error] : styles.licenseImg}>
                                        {
                                            this.state.imageFront ?
                                            <Image source={{uri: this.state.imageFront, cache: 'force-cache'}} style={{width: '100%', height: '100%'}} resizeMode="stretch" />
                                            :
                                            <TouchableOpacity onPress={() => this.chooseImage(1)} style={{width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center'}}>
                                                <FontAwesome name={"upload"} color={Colors.secColor} size={40} />
                                                <BoldText style={[fonts.size14, margin.mt2, {color: Colors.secColor}]}>免許証の写真(表)</BoldText>
                                            </TouchableOpacity>
                                        }
                                    </View>
                                    <RegularText style={[margin.mb1, margin.mt3]}>免許証(裏)の写真　※免許証で登録の場合　</RegularText>
                                    <View style={this.state.imageBackError ? [styles.licenseImg, styles.error] : styles.licenseImg}>
                                        {
                                            this.state.imageBack ?
                                            <Image source={{uri: this.state.imageBack, cache: 'force-cache'}} style={{width: '100%', height: '100%'}} resizeMode="stretch" />
                                            :
                                            <TouchableOpacity onPress={() => this.chooseImage(2)} style={{width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center'}}>
                                                <FontAwesome name={"upload"} color={Colors.secColor} size={40} />
                                                <BoldText style={[fonts.size14, margin.mt2, {color: Colors.secColor}]}>免許証の写真(裏)</BoldText>
                                            </TouchableOpacity>
                                        }
                                    </View>
                                </View>
                                <View style={{justifyContent: 'center', alignItems: 'center', width: '100%',flex: 1, marginVertical: 30}}>
                                    <TouchableOpacity onPress={() => this.nextScreen()} style={[styles.nextBtn]}>
                                        <BoldText style={[styles.btnText , fonts.size16]}>登録 </BoldText>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </ScrollView>
                    }
                    
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

export default connect(null,mapDispatchToProps)(LicenseRegister)

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
        backgroundColor: 'white', paddingVertical: Platform.OS == 'ios' ? 17 : 12, alignItems: 'center', borderRadius: 20,
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

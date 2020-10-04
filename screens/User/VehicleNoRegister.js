import React from 'react';
import { StyleSheet, TouchableWithoutFeedback, Keyboard, Image, View, TouchableOpacity, SafeAreaView, ScrollView, Platform } from 'react-native';
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
import { registerVehicleImage, getUser, updateVehicleImage } from '../../api';
import { showToast } from '../../shared/global';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { _e } from '../../lang';
TouchableOpacity.defaultProps = { activeOpacity: 0.8 };

class VehicleNoRegister extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            vehicleNo: '',
            vehicleNoError: false,
            vehicleNoImage: '',
            vehicleNoImageError: false,
            imageModal: false,
            loaded: true
        };
    }
    async componentDidMount(){
        if(this.props.type == 'update') {
            this.setState({ loaded: false })
            await getUser()
            .then(async (response) => {
                if(response.status == 1) {
                    this.setState({vehicleNo: response.user.vehicle_number})
                    this.setState({vehicleNoImage: response.user.vehicle_number_image})
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
        if(this.state.vehicleNo == ''){
            this.setState({vehicleNoError: true})
            valid = false
        } else{
            this.setState({vehicleNoError: false})
        }
        if(this.state.vehicleNoImage == ''){
            this.setState({vehicleNoImageError: true})
            valid = false
        } else{
            this.setState({vehicleNoImageError: false})
        }
        if(valid){
            this.setState({loaded: false})
            if(this.props.type == 'update') {
                await updateVehicleImage(this.state.vehicleNoImage && this.state.vehicleNoImage.includes("file://") ? this.state.vehicleNoImage : null, this.state.vehicleNo)
                .then(async (response) => {
                    this.setState({loaded: true});
                    if(response.status == 1){
                        Actions.pop() 
                        showToast(response.message, 'success')
                    } else {
                        showToast(response.message)
                    }
                })
                .catch((error) => {
                    console.log(error)
                    this.setState({loaded: true});
                    showToast();
                });
            } else{
                await registerVehicleImage(this.state.vehicleNoImage, this.state.vehicleNo, this.props.phone)
                .then(async (response) => {
                    this.setState({loaded: true});
                    if(response.status == 1){
                        Actions.pop() 
                        showToast(response.message, 'success')
                    } else {
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
    
    chooseImage() {
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
            if(pickerResult.uri)
                this.setState({vehicleNoImage: pickerResult.uri})
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
                        <KeyboardAwareScrollView
                            resetScrollToCoords={{ x: 0, y: 0 }}
                            scrollEnabled={true}
                        >
                            <View style={[shared.container, {paddingHorizontal: normalize(20)}]}>
                                <View style={{flex: 1}}>
                                    <BoldText style={[fonts.size32, {marginTop: 40}]}>車両ナンバーを入力</BoldText>
                                    <View style={[margin.mt3, {flexDirection: 'row', justifyContent: 'space-between'}]}>
                                        <View style={[{width: '100%'}]}>
                                            <RegularText style={styles.label}>車両ナンバー</RegularText>
                                            <Item rounded style={ this.state.vehicleNoError ? [form.item, styles.error] : [form.item] }>
                                                <Input
                                                    placeholder = "豊橋000　み　0000"
                                                    value = { this.state.vehicleNo }
                                                    style = { [form.input, fonts.size20, {lineHeight: normalize(23)}] }
                                                    onChangeText = {(text) => this.setState({vehicleNo: text})}
                                                    placeholderTextColor = '#9da8bf'
                                                />
                                            </Item>
                                        </View>
                                    </View>
                                    
                                    <RegularText style={[styles.label]}>ナンバープレートの写真</RegularText>
                                    <TouchableOpacity onPress={() => this.chooseImage(1)} style={this.state.vehicleNoImageError ? [styles.licenseImg, styles.error] : styles.licenseImg}>
                                        {
                                            this.state.vehicleNoImage ?
                                            <Image source={{uri: this.state.vehicleNoImage, cache: 'force-cache'}} style={{width: '100%', height: '100%'}} resizeMode="contain" />
                                            :
                                            <View style={{width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center'}}>
                                                <FontAwesome name={"upload"} color={Colors.secColor} size={40} />
                                                <BoldText style={[fonts.size14, margin.mt2, {color: Colors.secColor}]}>ナンバープレートの写真</BoldText>
                                            </View>
                                        }
                                    </TouchableOpacity>
                                </View>
                                <View style={{justifyContent: 'center', alignItems: 'center', width: '100%',bottom :30}}>
                                    <TouchableOpacity onPress={() => this.nextScreen()} style={[styles.nextBtn]}>
                                        <BoldText style={[styles.btnText , fonts.size16]}>登録 </BoldText>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            
                        </KeyboardAwareScrollView>
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

export default connect(null,mapDispatchToProps)(VehicleNoRegister)

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

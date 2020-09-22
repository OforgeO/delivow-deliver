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
import { RegularText, BoldText } from '../../components/StyledText';
import { registerBankPhoto } from '../../api';
import Spinner_bar from 'react-native-loading-spinner-overlay';
import { showToast } from '../../shared/global';
import Constants from 'expo-constants';
TouchableOpacity.defaultProps = { activeOpacity: 0.8 };

class CardPhoto extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            insuranceImage: '',
            anyImage: '',
            insuranceSelect: false,
            anySelect: false,
            imageModal: false,
            loaded: true
        };
    }
    componentDidMount(){
    }

    async nextScreen(){
        if(this.state.insuranceImage && this.state.anyImage){
            this.setState({loaded: false})
            await registerBankPhoto(this.state.insuranceImage, this.state.anyImage, this.props.phone)
                .then(async (response) => {
                this.setState({loaded: true});
                if(response.status == 1)
                    Actions.push("registercomplete", {phone: this.props.phone})
                else
                    showToast(response.message)
            })
            .catch((error) => {
                this.setState({loaded: true});
                showToast();
            });
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
            if(this.state.insuranceSelect)
                this.setState({insuranceImage: pickerResult.uri})
            else if(this.state.anySelect)
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
                <SafeAreaView style={[styles.contentBg, {}]}>
                    <ScrollView>
                        <View style={{flex: 1, paddingHorizontal: normalize(20)}}>
                            <View>
                                <BoldText style={[fonts.size32, {marginTop: 20}]}>通帳またはキャッシュカードの写真</BoldText>
                                <RegularText style={[margin.mb1, {paddingTop: 10}]}>通帳の表紙またはキャッシュカードの表の写真</RegularText>
                                <View style={[styles.licenseImg, margin.mb1]}>
                                    {
                                        this.state.insuranceImage ?
                                        <Image source={{uri: this.state.insuranceImage, cache: 'force-cache'}} style={{width: '100%', height: '100%'}} resizeMode="stretch" />
                                        :
                                        <TouchableOpacity onPress={() => this.chooseImage(1)} style={{width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center'}}>
                                            <FontAwesome name={"upload"} color={Colors.secColor} size={40} />
                                            <BoldText style={[fonts.size14, margin.mt2, {color: Colors.secColor}]}>アップロード</BoldText>
                                        </TouchableOpacity>
                                    }
                                </View>
                                <RegularText style={[margin.mb1, {paddingTop: 10}]}>通帳の見開き1ページ目またはキャッシュカードの裏の写真</RegularText>
                                <View style={styles.licenseImg}>
                                    {
                                        this.state.anyImage ?
                                        <Image source={{uri: this.state.anyImage, cache: 'force-cache'}} style={{width: '100%', height: '100%'}} resizeMode="stretch" />
                                        :
                                        <TouchableOpacity onPress={() => this.chooseImage(2)} style={{width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center'}}>
                                            <FontAwesome name={"upload"} color={Colors.secColor} size={40} />
                                            <BoldText style={[fonts.size14, margin.mt2, {color: Colors.secColor}]}>アップロード</BoldText>
                                        </TouchableOpacity>
                                    }
                                </View>
                            </View>
                            <View style={{justifyContent: 'center', alignItems: 'center', width: '100%',flex: 1, marginVertical: 30}}>
                                <TouchableOpacity onPress={() => this.nextScreen()} style={this.state.insuranceImage && this.state.anyImage ? [styles.nextBtn] : [styles.nextBtn, {backgroundColor: '#D3D3D3'}]}>
                                    <BoldText style={[styles.btnText , fonts.size16]}>次へ</BoldText>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
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

export default connect(null,mapDispatchToProps)(CardPhoto)

const styles = StyleSheet.create({
    contentBg: {
        flex: 1
    },
    contentPD: {
        paddingHorizontal: normalize(20),
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
        marginBottom: 5,
        marginTop: 10,
        paddingLeft: 3
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

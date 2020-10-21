import React from 'react';
import { StyleSheet, TouchableWithoutFeedback, Keyboard, Image, View, TouchableOpacity, KeyboardAvoidingView, ScrollView, SafeAreaView, Platform } from 'react-native';
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
import { registerFace } from '../../api';
import { RegularText, BoldText } from '../../components/StyledText';
import { showToast } from '../../shared/global';
import Spinner_bar from 'react-native-loading-spinner-overlay';
import Constants from 'expo-constants';
TouchableOpacity.defaultProps = { activeOpacity: 0.8 };

class AvatarRegister extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            require: false,
            imagePath: '',
            required: [
                {id: 1, selected: false, text: '顔全体＋肩までが写っています'},
                {id: 2, selected: false, text: '画質は鮮明です'},
                {id: 3, selected: false, text: 'サングラスはかけていません'},
                {id: 4, selected: false, text: '帽子はかぶっていません'},
                {id: 5, selected: false, text: '画像の修正、補正はしていません'},
            ],
            imageModal: false,
            loaded: true
        };
    }
    componentDidMount(){
    }

    async nextScreen(){
        if(this.state.imagePath != '' && this.state.require){
            this.setState({loaded: false})
            await registerFace(this.state.imagePath, this.props.phone, 'face')
                .then(async (response) => {
                this.setState({loaded: true});
                if(response.status == 1)
                    Actions.push("vehicleregister", {phone: this.props.phone, type: 'register'})
                else
                    showToast(response.message)
            })
            .catch((error) => {
                this.setState({loaded: true});
                showToast();
            });
        }
    }
    checkRequire(id){
        let temp = this.state.required
        let checkedCnt = 0
        for(var i = 0;i<temp.length;i++){
            if(temp[i].id == id){
                temp[i].selected = !temp[i].selected
            }
            if(temp[i].selected)
                checkedCnt ++;
        }
        if(checkedCnt == temp.length && this.state.imagePath)
            this.setState({require: true})
        else
            this.setState({require: false})
        this.setState({required: temp})
    }
    renderRequire() {
        return this.state.required.map((require) => {
            return <TouchableOpacity key={require.id} onPress={() => this.checkRequire(require.id)} style={[shared.flexCenter, margin.mb1]}>
                <FontAwesome name="check-circle" size={30} color={require.selected ? Colors.secColor : '#D3D3D3'} />
                <RegularText style={[fonts.size14, margin.ml1]}>{require.text}</RegularText>
            </TouchableOpacity>
        })
    }
    chooseAvatar() {
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
                aspect: [3, 3],
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
                aspect: [3, 3],
                quality: 0.1
            });
        
            this._handleImagePicked(pickerResult);
        }
        this.setState({imageModal: false})
    };

    _handleImagePicked = async pickerResult => {
        try {
            if(pickerResult.uri)
                this.setState({imagePath: pickerResult.uri})
            let temp = this.state.required
            let checkedCnt = 0
            for(var i = 0;i<temp.length;i++){
                if(temp[i].selected)
                    checkedCnt ++;
            }
            if(checkedCnt == temp.length && pickerResult.uri)
                this.setState({require: true})
            else
                this.setState({require: false})
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
                    <ScrollView contentContainerStyle={{flex: 1, paddingHorizontal: normalize(20)}}>
                        <KeyboardAvoidingView behavior={"height"} style={{flex: 1}} keyboardVerticalOffset={10}>
                            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                                <View style={{flex: 1}}>
                                    <View style={{flex: 6, justifyContent: 'center'}}>
                                        <BoldText style={[fonts.size32,margin.mt4, margin.mb2]}>顔写真を登録</BoldText>
                                        <View style={shared.flexCenter}>
                                            <TouchableOpacity style={styles.avatarSection} onPress={() => this.chooseAvatar()}>
                                                {
                                                    this.state.imagePath ?
                                                    <Image source={{uri: this.state.imagePath, cache: 'force-cache'}} resizeMode="contain" style={{width: '100%', height: '100%'}} />
                                                    :
                                                    <View style={shared.flexCenter}>
                                                        <FontAwesome name={"upload"} color={Colors.secColor} size={18} />
                                                        <BoldText style={[fonts.size14, margin.ml1, {color: Colors.secColor}]}>顔写真をアップロード</BoldText>
                                                    </View>
                                                }
                                            </TouchableOpacity>
                                            {
                                                this.state.imagePath ?
                                                <TouchableOpacity style={[{paddingLeft: 10, flexWrap: 'wrap', flex: 1, alignItems: 'center',justifyContent: 'center'}]} onPress={() => this.chooseAvatar()}>
                                                    <FontAwesome name={"upload"} color={Colors.secColor} size={18} />
                                                    <BoldText style={[fonts.size14, margin.mt2, {color: Colors.secColor, textAlign: 'center', lineHeight: 17}]}>画像を変更</BoldText>
                                                </TouchableOpacity>
                                                :
                                                null
                                            }
                                        </View>
                                        <BoldText style={[fonts.size14, margin.mb1]}>必須確認事項</BoldText>
                                        {
                                            this.renderRequire()
                                        }
                                    </View>
                                    <View style={{justifyContent: 'center', alignItems: 'center',flex: 1, bottom: 10}}>
                                        <TouchableOpacity onPress={() => this.nextScreen()} style={this.state.require? [styles.nextBtn] : [styles.nextBtn, {backgroundColor: '#d3d3d3'}]}>
                                            <BoldText style={[styles.btnText , fonts.size16]}>次へ </BoldText>
                                        </TouchableOpacity>
                                    </View>
                                    
                                    
                                </View>
                            </TouchableWithoutFeedback>
                        </KeyboardAvoidingView>
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

export default connect(null,mapDispatchToProps)(AvatarRegister)

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
        marginBottom: 20,
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
});

import React from 'react';
import { StyleSheet, View, Platform, Text, Image, TouchableOpacity, StatusBar, SafeAreaView, Alert } from 'react-native';
import { shared, fonts, margin, normalize, form } from '../../assets/styles';
import { ScrollView } from 'react-native-gesture-handler';
import { Actions } from 'react-native-router-flux';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import { Container, Content, Item, Input } from 'native-base';
import Images from '../../assets/Images';
import Modal from 'react-native-modal';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import { RegularText, BoldText } from '../../components/StyledText';
import store from '../../store/configuteStore';
import { connect } from "react-redux";
import { setUser, setShowDeliver } from '../../actions';
import { updateAvatar, getUser } from '../../api';
import Spinner_bar from 'react-native-loading-spinner-overlay';
import { showToast } from '../../shared/global';
import * as SecureStore from 'expo-secure-store';
import Back from '../../components/Back';
import OrderConfirm from '../../components/OrderConfirm';
class EditAccount extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            avatarSource: '',
            imageModal: false,
            nameModal: false,
            firstName: '',
            lastName: '',
            name: '',
            userInfo: null,
            loaded: true,
            myInfo : null
        }
    }
    componentDidMount() {
        this.refresh()
    }
    UNSAFE_componentWillReceiveProps() {
        this.refresh()
    }
    async refresh() {
        this.setState({userInfo: store.getState().user})
        this.setState({ loaded: false })
        await getUser()
        .then(async (response) => {
            if(response.status == 1) {
                this.setState({myInfo: response.user})
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
    goDetail() {

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
                quality: 0.08
            });
            this.setState({ imageModal: false })
            this._handleImagePicked(pickerResult);
        } else {
            this.setState({ imageModal: false })
        }
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
                quality: 0.08
            });
            this.setState({ imageModal: false })
            this._handleImagePicked(pickerResult);
        } else {
            this.setState({ imageModal: false })
        }
    };

    _handleImagePicked = async pickerResult => {
        try {
            if (pickerResult.uri) {
                var _self = this;
                setTimeout(async function () {
                    _self.setState({ loaded: false })
                    await updateAvatar(pickerResult.uri)
                        .then(async (response) => {
                            if (response.status == 1) {
                                let info = store.getState().user
                                info.photo = response.avatar_link
                                _self.props.setUser(info)
                            } else {
                                showToast(response.message)
                            }
                            _self.setState({ loaded: true });
                        })
                        .catch((error) => {
                            _self.setState({ loaded: true });
                            showToast();
                        });
                }, 500);
            }
            //this.setState({avatarSource: pickerResult.uri})
        } catch (e) {

        }
    };

    _renderModalContent = () => (
        <View style={styles.modal}>
            <View style={styles.option}>
                <TouchableOpacity style={styles.optionHeader} onPress={this._takePhoto}>
                    <RegularText style={[fonts.size20, { color: Colors.secColor }]}>写真を撮る</RegularText>
                </TouchableOpacity>
                <TouchableOpacity style={{ paddingVertical: Platform.OS == 'ios' ? 17 : 12, width: '100%', alignItems: 'center' }} onPress={this._pickImage}>
                    <RegularText style={[fonts.size20, { color: Colors.secColor }]}>ライブラリから選択</RegularText>
                </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={() => this.setState({ imageModal: false })} style={styles.cancel}>
                <BoldText style={[fonts.size20, { color: Colors.secColor }]}>キャンセル</BoldText>
            </TouchableOpacity>
        </View>
    );

    openImage() {
        this.setState({ imageModal: true })
    }

    changeName() {
        this.setState({ nameModal: false })
        this.setState({ name: this.state.firstName + ' ' + this.state.lastName })
    }

    logout() {
        Alert.alert(
            "サインアウトしますか？",
            "",
            [
              {
                text: "キャンセル",
                style: "cancel"
              },
              { text: "サインアウト", onPress: () => this.log_out() }
            ],
            { cancelable: false }
        );
    }
    async log_out() {
        this.props.setShowDeliver({
            showDeliver: false,
            showBookDeliver: false,
            orderUid: [],
            orderBookUid: []
        })
        await SecureStore.deleteItemAsync("token")
        Actions.reset("login")
    }

    render() {
        return (
            <Container style={[shared.mainContainer]}>
                {Platform.OS === 'ios' && <StatusBar barStyle="dark-content" backgroundColor="white" />}
                <OrderConfirm />
                <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
                    <ScrollView ref={ref => this.scrollRef = ref} contentContainerStyle={{backgroundColor: '#f2f2f2', paddingTop: store.getState().showDeliver.showDeliver && store.getState().showDeliver.showBookDeliver ? 100 : (store.getState().showDeliver.showDeliver || store.getState().showDeliver.showBookDeliver) ? 50 : 0}}>
                        <View style={{backgroundColor: 'white'}}>
                            <Back color={"#d3d3d3"} />
                            <View style={{ paddingHorizontal: normalize(20), paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#f2f2f2' }}>
                                <BoldText style={[fonts.size32]}>アカウントを編集</BoldText>
                            </View>
                            <View style={styles.avatarSection}>
                                <View style={{ alignItems: 'center' }}>
                                    <Image source={this.state.userInfo && this.state.userInfo.photo ? { uri: this.state.userInfo.photo } : Images.avatar} style={{ width: 48, height: 48, borderRadius: 24 }} />
                                    <TouchableOpacity onPress={() => this.openImage()}>
                                        <RegularText style={[fonts.size14, { color: Colors.secColor }, margin.mt2]}>変更</RegularText>
                                    </TouchableOpacity>
                                </View>
                                <View style={[margin.ml4, shared.flexCenter, { justifyContent: 'space-between', flex: 1, marginBottom: 18 }]}>
                                    <RegularText style={[fonts.size18]}>{this.state.userInfo && this.state.userInfo.first_name && this.state.userInfo.last_name ? this.state.userInfo.first_name + ' ' + this.state.userInfo.last_name : '名前が入ります'}</RegularText>
                                    <TouchableOpacity onPress={() => { Actions.push("editname") }}>
                                        <RegularText style={[fonts.size14, { color: Colors.secColor }]}>修正</RegularText>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={styles.container}>
                                <View style={[styles.detail, shared.flexCenter, { justifyContent: 'space-between', alignItems: 'flex-start' }]}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <FontAwesome size={14} color={Colors.secColor} name={"envelope"} />
                                        <View style={margin.ml2}>
                                            <BoldText style={[fonts.size14, margin.mb2]}>メールアドレス</BoldText>
                                            <RegularText style={[fonts.size14]}>{this.state.userInfo && this.state.userInfo.email ? this.state.userInfo.email : null}</RegularText>
                                        </View>
                                    </View>
                                    <TouchableOpacity onPress={() => Actions.push("emailchange")}>
                                        <RegularText style={[fonts.size14, { color: Colors.secColor }]}>変更</RegularText>
                                    </TouchableOpacity>
                                </View>
                                <View style={[styles.detail, shared.flexCenter, { justifyContent: 'space-between', alignItems: 'flex-start' }]}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <FontAwesome5 size={14} color={Colors.secColor} name={"phone"} />
                                        <View style={margin.ml2}>
                                            <BoldText style={[fonts.size14, margin.mb2]}>携帯電話番号</BoldText>
                                            <RegularText style={[fonts.size14]}>{this.state.userInfo && this.state.userInfo.phone ? this.state.userInfo.phone : null}</RegularText>
                                        </View>
                                    </View>
                                    <TouchableOpacity onPress={() => Actions.push("phonesignup", { type: 'update_phone' })}>
                                        <RegularText style={[fonts.size14, { color: Colors.secColor }]}>変更</RegularText>
                                    </TouchableOpacity>
                                </View>
                                <View style={[styles.detail, shared.flexCenter, { justifyContent: 'space-between', alignItems: 'flex-start' }]}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <FontAwesome5 size={14} color={Colors.secColor} name={"unlock-alt"} />
                                        <View style={margin.ml2}>
                                            <BoldText style={[fonts.size14, margin.mb2]}>パスワード</BoldText>
                                            <RegularText style={[fonts.size14]}>XXXXXXXXXXXX</RegularText>
                                        </View>
                                    </View>
                                    <TouchableOpacity onPress={() => Actions.push("updatepassword")}>
                                        <RegularText style={[fonts.size14, { color: Colors.secColor }]}>変更</RegularText>
                                    </TouchableOpacity>
                                </View>
                                <View style={[styles.detail, shared.flexCenter, { justifyContent: 'space-between', alignItems: 'flex-start' }]}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <FontAwesome5 size={14} color={Colors.secColor} name={"car-side"} />
                                        <View style={margin.ml2}>
                                            <BoldText style={[fonts.size14, margin.mb2]}>車両情報</BoldText>
                                            <RegularText style={[fonts.size14]}>{this.state.myInfo ? this.state.myInfo.vehicle_type == 'motor' ? '二輪バイク(125㏄以下)' : this.state.myInfo.vehicle_type == 'bike' ? '自転車' : this.state.myInfo.vehicle_type == 'car' ? '自動車(事業用限定)' : this.state.myInfo.vehicle_type: null}</RegularText>
                                        </View>
                                    </View>
                                    <TouchableOpacity onPress={() => Actions.push("vehicleregister", {type: 'update'})}>
                                        <RegularText style={[fonts.size14, { color: Colors.secColor }]}>変更</RegularText>
                                    </TouchableOpacity>
                                </View>
                                <View style={[styles.detail, shared.flexCenter, { justifyContent: 'space-between', alignItems: 'flex-start' }]}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <FontAwesome5 size={14} color={Colors.secColor} name={"piggy-bank"} />
                                        <View style={margin.ml2}>
                                            <BoldText style={[fonts.size14, margin.mb2]}>振込口座</BoldText>
                                            <RegularText style={[fonts.size14]}>{this.state.myInfo ? this.state.myInfo.bank_name + " " + this.state.myInfo.account_number : null}</RegularText>
                                        </View>
                                    </View>
                                    <TouchableOpacity onPress={() => Actions.push("bank", {type:'update'})}>
                                        <RegularText style={[fonts.size14, { color: Colors.secColor }]}>変更</RegularText>
                                    </TouchableOpacity>
                                </View>
                                <TouchableOpacity onPress={() => this.logout()} style={[styles.detail, shared.flexCenter, { justifyContent: 'space-between', alignItems: 'flex-start', borderBottomWidth: 0 }]}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <FontAwesome size={14} color={Colors.secColor} name={"sign-out"} />
                                        <View style={margin.ml2}>
                                            <BoldText style={[fonts.size14, margin.mb2]}>サインアウト</BoldText>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <Modal
                            isVisible={this.state.imageModal}
                            onBackdropPress={() => this.setState({ imageModal: false })}
                            style={styles.bottomModal}>
                            {this._renderModalContent()}
                        </Modal>
                    </ScrollView>
                </SafeAreaView>
                <Spinner_bar color={'#27cccd'} visible={!this.state.loaded} textContent={""} overlayColor={"rgba(0, 0, 0, 0.5)"} />
            </Container>
        );
    }
}
EditAccount.navigationOptions = {
    header: null
}
const mapDispatchToProps = dispatch => {
    return {
        setUser: user => { dispatch(setUser(user)) },
        setShowDeliver: showDeliver => { dispatch(setShowDeliver(showDeliver)) },
    }
}
const mapStateToProps = (state) => {
    return {
        user: state.user
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(EditAccount)
const styles = StyleSheet.create({
    avatarSection: {
        borderBottomColor: '#f2f2f2',
        borderBottomWidth: 1,
        padding: normalize(20),
        flexDirection: 'row',
        alignItems: 'center'
    },
    back: {
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: normalize(20),
        width: '100%'
    },
    goBack: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center'
    },
    container: {
        paddingHorizontal: normalize(20)
    },
    detail: {
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2'
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
    nameModal: {
        borderRadius: 20,
        backgroundColor: '#d4d4d4',
        alignItems: 'center',
        justifyContent: 'center',

    },
    nameDesc: {
        width: '100%',
        alignItems: 'center',
        borderBottomWidth: 1, borderBottomColor: '#b6b6b8',
        padding: 20,
        paddingBottom: 10
    },
    btn: {
        width: '100%',
    },
    cancel1: {
        width: '50%', alignItems: 'center', borderRightColor: '#b6b6b8', borderRightWidth: 1, paddingVertical: 15
    }
});
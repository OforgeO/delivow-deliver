import React from 'react';
import { StyleSheet, View, TouchableOpacity,ScrollView, Platform, SafeAreaView } from 'react-native';
import { Container, Content, Item, Input, Text } from 'native-base';
import { normalize, fonts, margin, form, shared} from '../../assets/styles';
import { connect } from "react-redux";
import { setUser } from '../../actions';
import {Actions} from 'react-native-router-flux';
import Colors from '../../constants/Colors';
import { FontAwesome } from '@expo/vector-icons';
import { updateArea } from '../../api';
import { RegularText, BoldText } from '../../components/StyledText';
import { showToast } from '../../shared/global';
import store from '../../store/configuteStore';
import Spinner_bar from 'react-native-loading-spinner-overlay';
TouchableOpacity.defaultProps = { activeOpacity: 0.8 };
class UpdateArea extends React.Component {
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
            loaded: true,
            deliverAddress: []
        };
    }
    componentDidMount(){
        if(this.props.data && this.props.data.length > 0) {
            let tempArea = this.state.deliverOptions
            this.props.data.map((area) => {
                tempArea[area-1].selected = true
            })
            this.setState({deliverOptions: tempArea})
        }
    }

    async nextScreen(){
        
        this.setState({loaded: false})
        await updateArea(this.state.deliverAddress).then(async (response) => {
            this.setState({loaded: true});
            if(response.status == 1) {
                let info = store.getState().user
                info.area = this.state.deliverAddress
                this.props.setUser(info)
                Actions.pop(); 
                setTimeout(function(){
                    Actions.refresh()
                }, 10)
            }else {
                showToast(response.message)
            }
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
    
    render(){
        return (
            <Container>
                <SafeAreaView style={[styles.contentBg, {justifyContent: 'center', flex: 1}]}>
                    <View >
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
                        <View style={[styles.greySection, {paddingBottom: 20}]}>
                            <View style={{justifyContent: 'center', alignItems: 'center', width: '100%'}}>
                                <TouchableOpacity onPress={() => this.nextScreen()} style={[styles.nextBtn]}>
                                    <BoldText style={[styles.btnText , fonts.size16]}>変更</BoldText>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
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

export default connect(null,mapDispatchToProps)(UpdateArea)

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
        backgroundColor: 'white',
        paddingHorizontal: normalize(20),
        paddingTop: normalize(20),
        paddingBottom: 5
    }
});

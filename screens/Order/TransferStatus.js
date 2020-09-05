import React from 'react';
import { StyleSheet, SafeAreaView, View, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { Container, Content, Item, Input, Text } from 'native-base';
import { normalize, fonts, margin, form, shared} from '../../assets/styles';
import {Actions} from 'react-native-router-flux';
import Colors from '../../constants/Colors';
import { FontAwesome } from '@expo/vector-icons';
import { getWeeklyData } from '../../api';
import Spinner_bar from 'react-native-loading-spinner-overlay';
import { RegularText, BoldText} from '../../components/StyledText';
import { _e } from '../../lang'
import moment from 'moment'
import Back from '../../components/Back';
TouchableOpacity.defaultProps = { activeOpacity: 0.8 };

export default class TransferStatus extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            dateList: [
            ],
            timeShow: false,
            loaded: true
        };
    }
    async componentDidMount(){
        this.setState({loaded: false})
        await getWeeklyData()
        .then(async (response) => {
            if(response.status  == 1)
                this.setState({dateList: response.list})
            this.setState({loaded: true})
        })
        .catch((error) => {
            this.setState({loaded: true})
            showToast()
        });
    }

    nextScreen(){
        Actions.pop()
    }

    renderDateList() {
        return this.state.dateList.map((option, index) => {
            return <View key={index} style={[shared.flexCenter, {paddingVertical: 15, backgroundColor: index % 2 == 0 ? 'white' : '#F2F2F2', paddingHorizontal: normalize(20)}]}>
                <View style={[shared.flexCenter, {justifyContent: 'space-between', flex: 1}]}>
                    <RegularText style={fonts.size14}>{moment(option.start_date).format("M/D")+"～"+moment(option.end_date).format("M/D")}</RegularText>
                    <BoldText style={[fonts.size14, {color: Colors.secColor}]}>{'¥'+option.sum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</BoldText>
                </View>
            </View>
        })
    }
    
    render(){
        return (
            <Container>
                {Platform.OS === 'ios' && <StatusBar barStyle="dark-content" backgroundColor="white" />}
                <SafeAreaView>
                    <ScrollView>
                        <View style={{flex: 1}}>
                            <Back color={"#d3d3d3"} />
                            <View style={[styles.whiteSection, {paddingBottom: 10, borderBottomColor: '#f2f2f2', borderBottomWidth: 1}]}>
                                <RegularText style={[fonts.size32]}>週別実績を確認</RegularText>
                            </View>

                            <View style={{backgroundColor: 'white'}}>
                                <View style={[shared.flexCenter, styles.detailHeader]}>
                                    <View style={[shared.flexCenter, {justifyContent: 'space-between', flex: 1}]}>
                                        <BoldText style={{color: '#B5B5B5'}}>日付（週）</BoldText>
                                        <BoldText style={{color: '#B5B5B5'}}>実績</BoldText>
                                    </View>
                                </View>
                                {
                                    this.state.dateList.length > 0 ?
                                    this.renderDateList()
                                    :
                                    <View style={[margin.pt3, { justifyContent: 'center', alignItems:'center'}]}>
                                        <RegularText>{_e.noTranfer}</RegularText>
                                    </View>
                                }
                            </View>
                            {
                                this.state.dateList.length > 0 ?
                                <View style={[styles.greySection, {paddingBottom: 20, backgroundColor: 'white'}]}>
                                    <View style={{justifyContent: 'center', alignItems: 'center', width: '100%'}}>
                                        <TouchableOpacity onPress={() => this.nextScreen()} style={[styles.nextBtn]}>
                                            <RegularText style={[styles.btnText , fonts.size16]}>印刷</RegularText>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                :
                                null
                            }
                            
                        </View>
                    </ScrollView>
                    <Spinner_bar color={'#27cccd'} visible={!this.state.loaded} textContent={""} overlayColor={"rgba(0, 0, 0, 0.5)"} />
                </SafeAreaView>
            </Container>
        );
    }
}
const styles = StyleSheet.create({
    contentBg: {
        flex: 1,
        backgroundColor: '#f2f2f2'
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
    detailHeader: {
        paddingVertical: 15, backgroundColor:'white', paddingHorizontal: normalize(20),
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
    }
});

import React from 'react';
import { StyleSheet, View, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { Container } from 'native-base';
import { normalize, fonts, margin, form, shared} from '../../assets/styles';
import {Actions} from 'react-native-router-flux';
import Colors from '../../constants/Colors';
import { RegularText, BoldText } from '../../components/StyledText';
import List from '../../components/List';
import Back from '../../components/Back';
import store from '../../store/configuteStore';
import OrderConfirm from '../../components/OrderConfirm';
TouchableOpacity.defaultProps = { activeOpacity: 0.8 };

export default class DeliverFee extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            dateList: [
                {id: 1, year: '2020'},
                {id: 2, year: '2021'},
                {id: 3, year: '2022'}
            ],
            timeShow: false
        };
    }
    componentDidMount(){
    }
    detail() {
        Actions.push("deliverfeedetail")
    }
    renderFee() {
        return this.state.dateList.map((date) => {
            return <List key={date.id} icon="file-text" font5={false} title={date.year + '年度'} size={18} clickEvent={this.detail.bind(this)}/>
        })
    }

    render(){
        return (
            <Container>
                <OrderConfirm />
                <SafeAreaView>
                    <ScrollView style={{paddingTop: store.getState().showDeliver.showDeliver && store.getState().showDeliver.showBookDeliver ? 100 : (store.getState().showDeliver.showDeliver || store.getState().showDeliver.showBookDeliver) ? 50 : 0}}>
                        <View style={{flex: 1}}>
                            <Back color={"#d3d3d3"} />
                            <View style={[styles.whiteSection, {paddingBottom: 10, paddingTop: 0, borderBottomColor: '#f2f2f2', borderBottomWidth: 1}]}>
                                <RegularText style={[fonts.size32]}>配達報酬明細表(年度)</RegularText>
                            </View>

                            <View style={[styles.whiteSection, {padding: 0}]}>
                                {
                                    //this.renderFee()
                                }
                            </View>
                        </View>
                    </ScrollView>
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
        padding : normalize(20),
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

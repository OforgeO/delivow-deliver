import React from 'react';
import { StyleSheet, View, TouchableOpacity, SafeAreaView, ScrollView, Share } from 'react-native';
import { Container, Content, Item, Input, Text } from 'native-base';
import { normalize, fonts, margin, form, shared} from '../../assets/styles';
import {Actions} from 'react-native-router-flux';
import Colors from '../../constants/Colors';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import { RegularText, BoldText } from '../../components/StyledText';
import Back from '../../components/Back';
import store from '../../store/configuteStore';
import OrderConfirm from '../../components/OrderConfirm';
TouchableOpacity.defaultProps = { activeOpacity: 0.8 };

export default class DeliverFeeDetail extends React.Component {
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
    async share() {
        try {
            const result = await Share.share({
                message: '配達報酬明細表',
                url: 'http://google.com'
            });
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                // shared with activity type of result.activityType
                } else {
                // shared
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (error) {
            alert(error.message);
        }
    }

    render(){
        return (
            <Container>
                <OrderConfirm />
                <SafeAreaView>
                    <ScrollView contentContainerStyle={{height: '100%', paddingTop: store.getState().showDeliver.showDeliver && store.getState().showDeliver.showBookDeliver ? 100 : (store.getState().showDeliver.showDeliver || store.getState().showDeliver.showBookDeliver) ? 50 : 0}}>
                        <View style={{flex: 1}}>
                            <Back color={"#d3d3d3"} />
                            <View style={[styles.whiteSection, {paddingBottom: 10, paddingTop: 0, borderBottomColor: '#f2f2f2', borderBottomWidth: 1}]}>
                                <RegularText style={[fonts.size32]}>配達報酬明細表(年度)</RegularText>
                            </View>
                            <View style={[shared.flexCenter, {position:'absolute', bottom: 20, right: 20}]}>
                                <TouchableOpacity style={styles.btn}>
                                    <FontAwesome name="print" size={24} color={"white"} />
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.btn, margin.ml4]} onPress={() => this.share()}>
                                    <FontAwesome name="share-square-o" size={24} color={"white"} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        
                    </ScrollView>
                    
                </SafeAreaView>
            </Container>
        );
    }
}
const styles = StyleSheet.create({
    whiteSection: {
        backgroundColor: 'white',
        padding: normalize(20),
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
    btn: {
        backgroundColor: Colors.mainColor,
        width: 50,
        height: 50,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center'
    }
});

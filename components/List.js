import * as React from 'react';
import { Text, View, Image, StyleSheet, TouchableOpacity } from "react-native";
import { FontAwesome, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import Layout from '../constants/Layout';
import Tag from './Tag';
import { shared, fonts, margin, normalize } from './../assets/styles';
import { Actions } from 'react-native-router-flux';
import { RegularText, BoldText } from './StyledText';
export default class List extends React.Component {

    actionMethod(phone) {
        this.props.clickEvent(phone)
    }
    chat(type) {
        this.props.clickEvent(type)
    }
    render() {

        return (
            <TouchableOpacity style={{ paddingHorizontal: normalize(20) }} onPress={() => { this.props.chat ? this.chat(this.props.chat) :
                this.actionMethod(this.props.phone)
            }}>
                <View style={[styles.detail, this.props.borderBottom == false ? { borderBottomWidth: 0 } : {}]}>
                    <View style={[styles.detailSection, shared.flexCenter, { alignItems: 'center', width: Layout.window.width - 80, justifyContent: 'space-between' }]}>
                        <View style={[shared.flexCenter]}>
                            {
                                this.props.font5 ?
                                    <FontAwesome5 name={this.props.icon} size={this.props.size ? this.props.size : 20} color={this.props.color ? this.props.color : Colors.secColor} />
                                    :
                                    <FontAwesome name={this.props.icon} size={this.props.size ? this.props.size : 20} color={this.props.color ? this.props.color : Colors.secColor} />
                            }
                            <RegularText style={[fonts.size14, margin.ml2, { color: this.props.color ? this.props.color : 'black' }]}>{this.props.title}</RegularText>
                            {
                                this.props.requestCnt > 0 ?
                                    <View style={[styles.undeliverSection, margin.ml8]}>
                                        <BoldText style={[fonts.size16, {color: 'white', paddingTop:0}]}>{this.props.requestCnt}</BoldText>
                                    </View>
                                    :
                                    null
                            }
                        </View>
                        {
                            this.props.warn && this.props.setting == 'off' ?
                                <View style={[shared.flexCenter,]}>
                                    <FontAwesome5 name={"info-circle"} size={14} color={Colors.redColor} />
                                    <RegularText style={[fonts.size14, { color: Colors.redColor, paddingTop: 1 }, margin.ml1]}>オフになっています</RegularText>
                                </View>
                                :
                                null
                        }
                    </View>
                    <FontAwesome name={"chevron-right"} size={14} color={"#D3D3D3"} />
                </View>
            </TouchableOpacity>
        );
    }
}
const styles = StyleSheet.create({
    detail: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomColor: '#f2f2f2',
        borderBottomWidth: 1,
    },
    detailSection: {
        paddingVertical: 15,
        flexDirection: 'row'
    },
    undeliverSection: {
        alignItems: 'center', justifyContent: 'center', backgroundColor: '#F50909', width: 26, height: 26, borderRadius: 15,
        marginLeft: 10
    },
});
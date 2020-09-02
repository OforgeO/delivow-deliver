import * as React from 'react';
import {  StyleSheet, TouchableOpacity, View } from "react-native";
import { shared, fonts, margin, normalize,form } from './../assets/styles';
import { BoldText } from './StyledText'
import { Actions } from 'react-native-router-flux';
import { FontAwesome } from '@expo/vector-icons';
import Constants from 'expo-constants';
export default class Back extends React.Component {

    render() {
        return (
            <View style={this.props.absolute ? styles.back : styles.back1}>
                <TouchableOpacity style={styles.goBack} onPress={() => {Actions.pop({refresh: {}}); setTimeout(function(){
                    Actions.refresh()
                }, 10)}}>
                    <FontAwesome name={"chevron-left"} color={this.props.color ? this.props.color : 'white'} size={14} />
                    <BoldText style={[{color: this.props.color ? this.props.color : 'white'}, margin.ml1, fonts.size14]}>戻る</BoldText>
                </TouchableOpacity>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    goBack: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center'
    },
    back: {
        position:'absolute',
        top: Constants.statusBarHeight+10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: normalize(20),
        width: '100%',
        zIndex: 99999,
        backgroundColor: 'white'
    },
    back1: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: normalize(20),
        paddingVertical: 10,
        width: '100%',
        paddingBottom: 15,
        backgroundColor: 'white'
    },
});
import * as React from 'react';
import { Text, View, Image, StyleSheet,TouchableOpacity } from "react-native";
import Colors from '../constants/Colors';
import Layout from '../constants/Layout';
import Tag from './Tag';
import { shared, fonts, margin, normalize } from './../assets/styles';
import { Actions } from 'react-native-router-flux';
import { RegularText , BoldText } from './StyledText';
export default class CartBtn extends React.Component {

  render() {
    return (
        <View style={styles.cartSection}>
            <TouchableOpacity style={styles.cart} onPress={() => Actions.push("cart")}>
                <RegularText style={[fonts.size20,{color: 'white'}]}>カートを見る</RegularText>
                <RegularText style={[styles.cost, fonts.size18]}>¥980</RegularText>
            </TouchableOpacity>
        </View>
    );
  }
}
const styles = StyleSheet.create({
    cartSection: {
        bottom: 30,
        position: 'absolute',
        width: '100%'
    },
    cart: {
        paddingVertical: 20,
        backgroundColor: Colors.mainColor,
        marginHorizontal: normalize(26),
        alignItems: 'center',
        borderRadius: 15
    },
    cost: {
        color: 'white',
        position: 'absolute', 
        right: 20,
        top: 20,
    }
});
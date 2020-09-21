import * as React from 'react';
import { Text, View, Image, StyleSheet } from "react-native";
import { FontAwesome, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import Layout from '../constants/Layout';
import { RegularText , BoldText } from './StyledText';
export default class Tag extends React.Component {

  render() {
    return (
        <View style={styles.cardDescription}>
            {
                this.props.font5 ?
                <FontAwesome5 name={this.props.name} color={Colors.secColor} size={16} />
                :
                <FontAwesome name={this.props.name} color={Colors.secColor} size={18} />
            }
            {
                this.props.discount ?
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <RegularText numberOfLines={1} style={[styles.cardDescText, {textDecorationLine: 'line-through'}]}>{this.props.text}</RegularText>
                    <FontAwesome name={"long-arrow-right"} color={"#CE082E"} />
                    <RegularText numberOfLines={1} style={[styles.cardDescText, {color: '#CE082E'}]}>{this.props.discountCost}</RegularText>
                </View>
                :
                <RegularText numberOfLines={1} style={styles.cardDescText}>{this.props.text}</RegularText>
            }
        </View>
    );
  }
}
const styles = StyleSheet.create({
    cardDescription: {
        marginTop: 5, 
        flexDirection: 'row', 
        padding: 5, 
        alignItems: 'center', 
        backgroundColor: '#f2f2f2', 
        borderRadius: 5, 
        alignSelf: 'flex-start',
        marginRight: 5,
        height: 30
    },
    cardDescText: {
        color: '#848484',
        marginLeft: 5
    }
});
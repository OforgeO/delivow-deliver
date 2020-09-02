import * as React from 'react';
import { Text, View, Image, StyleSheet, TouchableOpacity } from "react-native";
import { FontAwesome, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import Layout from '../constants/Layout';
import { shared, fonts, margin, normalize,form } from './../assets/styles';
import { RegularText , BoldText } from './StyledText';
export default class CartTag extends React.Component {

  actionMethod(id) {
      this.props.clickEvent(id)
  }

  render() {
    return (
        <TouchableOpacity  style={this.props.selected ? [styles.cardDescription, {backgroundColor: Colors.mainColor}] : [styles.cardDescription]} onPress={ () => this.actionMethod(this.props.id) }>
            <RegularText style={[fonts.size18, {color: 'white'}]}>{this.props.text}</RegularText>
        </TouchableOpacity>
    );
  }
}
const styles = StyleSheet.create({
    cardDescription: {
        backgroundColor: '#D3D3D3',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        marginRight: 10
    }
});
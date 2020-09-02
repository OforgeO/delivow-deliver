import * as React from 'react';
import { Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import { normalize, fonts, margin, form} from './../assets/styles';
import { RegularText , BoldText } from './StyledText';
export default class GoTop extends React.Component {

  render() {
    return (
        <TouchableOpacity style={styles.container} {...this.props}>
            <Ionicons name="ios-arrow-round-up" size={24} color="white" />
            <BoldText style={[{color:'white'}, fonts.size18]}>TOP</BoldText>
        </TouchableOpacity>
    );
  }
}
const styles = StyleSheet.create({
    container: {
        borderRadius: 5,
        backgroundColor: Colors.mainColor,
        alignSelf: 'flex-start',
        alignItems: 'center',
        position: 'absolute',
        bottom: 15,
        right: 10,
        paddingVertical: 7,
        paddingHorizontal: 13
    }
});
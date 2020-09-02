import * as React from 'react';
import { Text, View, Image, StyleSheet, TouchableOpacity } from "react-native";
import { FontAwesome, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import { shared, fonts, margin, normalize } from './../assets/styles';
import { RegularText , BoldText } from './StyledText';
export default class Coupon extends React.Component {

  render() {
    return (
        <TouchableOpacity style={this.props.selected ? [styles.coupon, {borderWidth: 2, borderColor: Colors.mainColor}] : [styles.coupon]}>
            <View style={styles.couponSection}>
                <View>
                    <View style={styles.resName}>
                        <RegularText style={{color: Colors.mainColor}}>{this.props.title}</RegularText>
                    </View>
                    <View style={styles.flex}>
                        <FontAwesome name="tag" size={20} color={Colors.mainColor}/>
                        <BoldText style={[fonts.size20, margin.ml1, margin.mt2, margin.mb2]}>{this.props.tag}</BoldText>
                    </View>
                    <View style={styles.flex}>
                        <RegularText style={styles.title}>利用条件</RegularText>
                        <RegularText style={styles.desc}>{this.props.con}</RegularText>
                    </View>
                    <View style={styles.flex}>
                        <RegularText style={[styles.title, {lineHeight: 25}]}>利用可能枚数</RegularText>
                        <RegularText style={[styles.desc, {lineHeight: 25}]}>{this.props.count}枚</RegularText>
                    </View>
                    <View style={styles.flex}>
                        <RegularText style={styles.title}>系列店利用</RegularText>
                        <RegularText style={styles.desc}>{this.props.use}</RegularText>
                    </View>
                </View>
                <FontAwesome name="check-circle" size={30} color={this.props.selected ? Colors.mainColor : "#f2f2f2"} />
            </View>
        </TouchableOpacity>
    );
  }
}
const styles = StyleSheet.create({
    coupon: {
        paddingHorizontal: normalize(20),
        
    },
    couponSection: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#f2f2f2',paddingVertical: 15,
    },
    resName: {
        padding: 5, 
        backgroundColor: '#f2f2f2', 
        alignSelf: 'flex-start', 
        borderRadius: 5
    },
    flex: {flexDirection: 'row', alignItems: 'center'},
    title: {
        color: '#848484', flex: 2
    },
    desc: {
        color: '#848484', flex: 3
    }
});
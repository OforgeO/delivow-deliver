import * as React from 'react';
import { Text, View, Image, StyleSheet, TouchableOpacity } from "react-native";
import { FontAwesome, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import Layout from '../constants/Layout';
import Tag from './Tag';
import { shared, fonts, margin, normalize } from './../assets/styles';
import { Actions } from 'react-native-router-flux';
import { RegularText , BoldText } from './StyledText';
export default class Menu extends React.Component {

  render() {
    return (
        <TouchableOpacity style={styles.menu} onPress={() => Actions.push("product", {discount: this.props.discount})}>
            <View style={styles.menuImage}>
                <Image source={require("../assets/images/food.png")} style={styles.image} resizeMode="stretch" />
            </View>
            <View style={{width: '70%', paddingHorizontal: 10}}>
                <RegularText numberOfLines={1} style={fonts.size20}>メニュー名が入りますメニュー名</RegularText>
                <RegularText numberOfLines={1} style={[fonts.size16, {color: '#707070'}]}>簡単な説明が入ります簡単な説明が入ります簡</RegularText>
                {
                    this.props.discount ?
                    <View style={styles.discount}>
                        <Tag name={"coins"} text={"¥980"} discountCost={"¥780"} font5={true} discount={true} />
                        <View style={styles.discountDesc}>
                            <RegularText style={{color: 'white'}}>期間限定値引き商品</RegularText>
                        </View>
                    </View>
                    :
                    <Tag name={"coins"} text={"¥980"} font5={true} />
                }
                
            </View>
        </TouchableOpacity>
    );
  }
}
const styles = StyleSheet.create({
    menu: {
        flexDirection: 'row', 
        justifyContent:'space-between', 
        alignItems: 'center', 
        borderBottomWidth: 1, 
        borderBottomColor: '#f2f2f2', 
        paddingVertical: 20
    },
    menuImage: {
        width: '30%', borderRadius: 15, overflow: 'hidden'
    },
    image: {
        width: (Layout.window.width - 40) * 0.3, height: (Layout.window.width - 40) * 0.25
    },
    discount: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    discountDesc: {
        backgroundColor: '#CE082E',
        borderColor: 'white',
        borderWidth: 1,
        borderStyle: "dashed",
        padding: 5
    }
});
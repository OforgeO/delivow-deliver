import * as React from 'react';
import { Text, View, Image, StyleSheet } from "react-native";
import Layout from '../constants/Layout';
import { fonts } from '../assets/styles';
import { FontAwesome, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import Tag from '../components/Tag';
export default class HandleMenu extends React.Component {

  render() {
    return (
        <View>
          <View style={styles.cardSection}>
            <Image
              source={require("../assets/images/food.png")}
              style={styles.cardImage}
              resizeMode={"stretch"}
            />
          </View>
        </View>
    );
  }
}
const styles = StyleSheet.create({
    cardImage: {
        height: Layout.window.width/5,
        width: Layout.window.width/4
    },
    cardSection: {
        backgroundColor: "white", 
        borderRadius: 5, 
        overflow: "hidden", 
        width: Layout.window.width/4, 
        marginRight: 4
    },
});
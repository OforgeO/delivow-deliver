import * as React from 'react';
import { Text, View, Image, StyleSheet } from "react-native";
import Layout from '../constants/Layout';
import { fonts } from '../assets/styles';
import { FontAwesome, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import Tag from '../components/Tag';
import { RegularText , BoldText } from './StyledText';
export default class CardInfo extends React.Component {

  render() {
    return (
        <View style={[styles.cardSection, this.props.type == "detail" ? {width: "100%"} : {}]}>
          <View>
            <Image
              source={require("../assets/images/food.png")}
              style={[styles.cardImage, this.props.type == "detail" ? {width: "100%"} : {}]}
            />
            {
              this.props.banner ?
              <View style={styles.banner}>
                <RegularText style={{color: 'white'}}>100円OFFクーポン配布中！</RegularText>
              </View>
              :
              null
            }
          </View>
          <View style={this.props.type == "detail" ? { padding: 10, width: "100%" } : { padding: 10, width: Layout.window.width/3*2 }}>
            <RegularText numberOfLines={1} style={fonts.size18}>{this.props.title}</RegularText>
            <View style={{flexDirection: 'row'}}>
              {
                this.props.map ?
                <Tag name={"map-marker"} text={this.props.mapText} font5={false} />
                :
                null
              }
              {
                this.props.time ?
                <Tag name={"clock"} text={this.props.timeText} font5={true} />
                :
                null
              }
              {
                this.props.food ?
                <Tag name={"cutlery"} text={this.props.foodText} font5={false} />
                :
                null
              }
              {
                this.props.money ?
                <Tag name={"coins"} text={this.props.moneyText} font5={true} />
                :
                null
              }
            </View>
          </View>
        </View>
    );
  }
}
const styles = StyleSheet.create({
    cardImage: {
        height: Layout.window.width*0.41,
        width: Layout.window.width/3*2
    },
    cardDescription: {
        marginTop: 5, 
        flexDirection: 'row', 
        padding: 5, 
        alignItems: 'center', 
        backgroundColor: '#f2f2f2', 
        borderRadius: 5, 
        alignSelf: 'flex-start',
        marginRight: 5,
    },
    cardSection: {
        backgroundColor: "white", 
        borderRadius: 10, 
        overflow: "hidden", 
        width: Layout.window.width/3*2, 
        marginRight: 10
    },
    cardDescText: {
        color: '#848484',
        marginLeft: 5
    },
    banner: {
      position: 'absolute',
      bottom: 15,
      backgroundColor: '#9D931F',
      padding: 7,
      borderTopRightRadius: 5,
      borderBottomRightRadius: 5,
      borderColor: 'white',
      borderWidth: 1,
      borderStyle: "dashed"
    }
});
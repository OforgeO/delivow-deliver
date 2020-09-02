import * as React from 'react';
import { Text, View, SafeAreaView, Image, StyleSheet } from 'react-native';
import Carousel from "react-native-carousel-control";
import Layout from '../constants/Layout';
export default class MultiBanner extends React.Component {
 
    constructor(props){
        super(props);
        this.state = {}
    }


    render() {
        return (
          <SafeAreaView style={styles.bannerSection}>
            <Carousel pageStyle={ styles.pageStyle } sneak={2}>
                <Image source={require("../assets/images/food.png")} style={styles.banner}/>
                <Image source={require("../assets/images/food.png")} style={styles.banner}/>
                <Image source={require("../assets/images/food.png")} style={styles.banner}/>
                <Image source={require("../assets/images/food.png")} style={styles.banner}/>
            </Carousel>
          </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    bannerSection: {
        flex: 1, backgroundColor:'white', paddingVertical: 15
    },
    pageStyle: {
        backgroundColor: "white", 
        width: Layout.window.width/3, 
        height: Layout.window.width/6,
    },
    banner: {
        width: Layout.window.width/3, 
        height: Layout.window.width/6
    }
})
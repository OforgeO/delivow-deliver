import React from 'react';
import { StyleSheet, View} from 'react-native';
import { SliderBox } from 'react-native-image-slider-box';
import Spinner_bar from 'react-native-loading-spinner-overlay';
import { showToast } from '../constants/Global';
import Layout from '../constants/Layout';

export default class Banner extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            images: [
                "https://images.unsplash.com/photo-1557799322-35c32f75a0b4?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=768&ixid=eyJhcHBfaWQiOjF9&ixlib=rb-1.2.1&q=80&w=1024",
                "https://source.unsplash.com/1024x768/?water",
                "https://source.unsplash.com/1024x768/?girl",
                "https://source.unsplash.com/1024x768/?tree"
            ],
            loaded : true
        }
    }

    async componentDidMount(){
    }
    
    render(){
        return (
            <View style={styles.container}>
                <SliderBox
                    images = {this.state.images}
                    autoplay = {true}
                    sliderBoxHeight = {Layout.window.width/2}
                    circleLoop
                    paginationBoxStyle={{display:'none'}}
                    ImageComponentStyle={{width: '100%'}}
                    resizeMode={'stretch'}
                    parentWidth={Layout.window.width}
                />
                <Spinner_bar color={'#27cccd'} visible={!this.state.loaded} textContent={""} overlayColor={"rgba(0, 0, 0, 0.5)"} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
      
      backgroundColor: '#fff',
    },
});
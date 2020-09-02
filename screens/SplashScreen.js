import React from 'react';
import { StatusBar, View, Linking, Platform } from 'react-native';
import { Container , Spinner, Text } from 'native-base';
import { Actions } from 'react-native-router-flux';
import { connect } from "react-redux";
import { splash } from './../assets/styles';
import store from './../store/configuteStore';
import { RegularText, BoldText } from '../components/StyledText';
class SplashScreen extends React.Component {
    constructor(props){
        super(props);
        this.CheckUserLogin = this.CheckUserLogin.bind(this);
        this.moveAnotherPage = this.moveAnotherPage.bind(this);
    }
    handleOpenURL = (event) => { // D
        this.navigate(event.url);
    }
    componentDidMount() {
        if (Platform.OS === 'android') {
            Linking.getInitialURL().then(url => {
                this.navigate(url);
            });
        }else{
            Linking.addEventListener('url', this.handleOpenURL);
        }

        let _self = this
        let _timer = setInterval(function() {
            if(_self.CheckUserLogin()) {
                clearInterval(_timer)
                Actions.reset('root')
            }
            else {
                clearInterval(_timer)
                Actions.reset('login')
            }
        }, 1000)
    }
    navigate( url) {
        if (!url) return;
        console.log('deep link----', url)
    }
    componentWillUnmount() {
        Linking.removeEventListener('url', this.handleOpenURL);
    }
    CheckUserLogin() {
        try {
            let token = this.props.user.token;
            console.log('token--', token)
            return token === null || token === ''
                ? false
                : true;
        } catch(error) {
            console.log(error)
        }
    }
    moveAnotherPage(pageName) {
        Actions.reset(pageName)
    }
    render() {
        if( this.props.rehydrated === true ) {
            if( !(this.props.user.token === null || this.props.user.token === '') ) {
                this.moveAnotherPage('root')
            }
            else {
                this.moveAnotherPage('login')
            }
        }
        return (
            <Container style={splash.splashContainer}>
                <StatusBar backgroundColor="white" barStyle="dark-content"/>
                <RegularText style={splash.splashText}>少々お待ちください</RegularText>
                <Spinner color={'white'} />
            </Container>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        user : state.user,
        rehydrated : state.rehydrated
    }
}
export default connect(mapStateToProps , null)(SplashScreen);
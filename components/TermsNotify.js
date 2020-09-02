import * as React from 'react';
import { View, StyleSheet, TouchableOpacity, AsyncStorage, Image } from "react-native";
import Colors from '../constants/Colors';
import { normalize, fonts, margin, form, shared } from './../assets/styles';
import Constants from 'expo-constants'
import { Actions } from 'react-native-router-flux';
import { RegularText, BoldText } from './StyledText';
import { FontAwesome } from '@expo/vector-icons';
import store from '../store/configuteStore';
import { connect } from "react-redux";
import { setTerms } from '../actions';
class TermsNotify extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    componentDidMount(){
    }
    async hideContactInfo(info) {
        let curStatus = store.getState().terms
        if(curStatus.terms)
            curStatus.terms = false;
        else if(curStatus.commercial)
            curStatus.commercial = false;
        else if(curStatus.personal)
            curStatus.personal = false;
        this.props.setTerms(curStatus)
        if(info == 'terms')
            await AsyncStorage.setItem("terms" , "true")
        else if(info == 'commercial')
            await AsyncStorage.setItem("commercial" , "true")
        else if(info == 'personal')
            await AsyncStorage.setItem("personal" , "true")
        Actions.push("terms", {type: info})
    }
    render() {
        return (
            <View style={store.getState().terms.terms || store.getState().terms.commercial || store.getState().terms.personal ? styles.container : {height: 0}}>
                <View style={{borderBottomWidth: 1, borderBottomColor: '#f2f2f2', width: '100%', paddingHorizontal: normalize(20)}}>
                    {
                        store.getState().terms.terms ?
                        <BoldText style={fonts.size16}>利用規約に改定がありました。</BoldText>
                        :
                        store.getState().terms.commercial ?
                        <BoldText style={fonts.size16}>特定商取引法に改定がありました。</BoldText>
                        :
                        store.getState().terms.personal  ?
                        <BoldText style={fonts.size16}>個人情報保護法に改定がありました。</BoldText>
                        :
                        null
                    }
                    <RegularText style={[margin.mt4,margin.mb3]}>お手数ですが、ご確認と同意をお願いします。</RegularText>
                </View>
                <TouchableOpacity style={{paddingVertical: normalize(15), width: '100%', alignItems: 'center'}} onPress={() => this.hideContactInfo(store.getState().terms.terms ? 'terms' : store.getState().terms.commercial ? 'commercial' : store.getState().terms.personal ? 'personal' : null)}>
                    <BoldText style={{color: Colors.secColor}}>確認する</BoldText>
                </TouchableOpacity>
            </View>
        );
    }
}
const mapDispatchToProps = dispatch => {
    return {
        setTerms : terms => { dispatch(setTerms(terms))}
    }
}
const mapStateToProps = (state) => {
    return {
        terms : state.terms
    }
}
export default connect(mapStateToProps , mapDispatchToProps)(TermsNotify);
const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        alignSelf: 'flex-start',
        alignItems: 'center',
        position: 'absolute',
        width: '100%',
        zIndex: 9999999999,
        paddingTop: 15,
        top: Constants.statusBarHeight,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    }
});
import React from 'react';
import { StyleSheet, Image, View, TouchableOpacity, Text, Platform } from 'react-native';
import Images from "../../assets/Images";
import { normalize, fonts,margin } from '../../assets/styles';
import { connect } from "react-redux";
import { setUser } from '../../actions';
import {Actions} from 'react-native-router-flux';
import { showToast } from '../../shared/global';
import store from '../../store/configuteStore';
import Colors from '../../constants/Colors';
import Logo from '../../assets/images/logo.svg';
import { RegularText, BoldText } from '../../components/StyledText';
TouchableOpacity.defaultProps = { activeOpacity: 0.8 };

class Signup extends React.Component {
    constructor(props){
        super(props);
        this.state = {
        };
    }
    componentDidMount(){
        
    }
    render(){
        return (
            <View style={styles.contentBg}>
                <View style={{flex: 1, justifyContent: 'flex-end',marginBottom: 50, alignItems: 'center'}}>
                    <Logo />
                </View>
                <View style={{flex: 1, paddingHorizontal: normalize(20),marginTop: 40, zIndex: 99}}>
                    
                    <TouchableOpacity style={[styles.loginBtn, {backgroundColor: Colors.mainColor, marginTop: normalize(30), borderColor: Colors.mainColor, borderWidth: 1}]} onPress={() => Actions.push("phonelogin")}>
                        <BoldText style={[fonts.size16, {color: 'white'}]}>デリバーのログイン</BoldText>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.loginBtn, styles.fbLogin, { borderColor: Colors.mainColor}]} onPress={() => Actions.push("phonesignup")}>
                        <BoldText style={[fonts.size16, {color: Colors.mainColor}]}>デリバーの新規登録 </BoldText>
                    </TouchableOpacity>
                    
                    <BoldText style={[margin.mt4]}>※新規登録をされる方へ</BoldText>
                    <RegularText style={{paddingTop: 0, lineHeight: 18}}>登録作業はできますが、<RegularText style={[{color: Colors.redColor}]}>本登録には面接が必要</RegularText>です。ご登録後、本部よりご連絡します。</RegularText>
                    
                </View>
                <Image source={Images.right_cloud} style={{position: 'absolute', right: -70, top: -20}} />
                <Image source={Images.left_cloud} style={{position: 'absolute', bottom: -50, left: -50}} />
            </View>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setUser : user => { dispatch(setUser(user)) }
    }
}

export default connect(null,mapDispatchToProps)(Signup)

const styles = StyleSheet.create({
    contentBg: {
        flex: 1,
        justifyContent: "space-between"
    },
    loginBtn: {
        paddingVertical: Platform.OS == 'ios' ? 17 : 12,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%'
    },
    goDliever: {
        flexDirection: 'row', 
        alignItems: 'center', 
        marginTop: normalize(20), 
        width: '100%'
    },
    fbLogin: {
        borderColor: Colors.mainColor, 
        borderWidth: 1, 
        marginTop: normalize(10)
    }
});

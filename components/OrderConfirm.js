import * as React from 'react';
import { View, StyleSheet, TouchableOpacity, Platform } from "react-native";
import Colors from '../constants/Colors';
import { normalize, fonts, margin, form } from './../assets/styles';
import { BoldText } from './StyledText';
import Constants from 'expo-constants'
import { Actions } from 'react-native-router-flux';
import { connect } from "react-redux";
import store from '../store/configuteStore';
import { setShowDeliver } from '../actions';
class OrderConfirm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            status: null,
            token: null
        }
    }
    async componentDidMount(){
        //this.props.setShowDeliver({showDeliver: false})
    }
    async confirmStatus(type) {
        console.log(type)
        let status = store.getState().showDeliver
        if(status.orderBookUid && status.orderBookUid.length > 1 && type == 'book')
            Actions.push("bookrequest")
        else if(status.orderUid && status.orderUid.length > 0)
            Actions.push("bookrequestdetail", { order_uid: status.orderUid[0], type: type, confirm: 'false'})       
        else if(status.orderBookUid && status.orderBookUid.length == 1)
            Actions.push("bookrequestdetail", { order_uid: status.orderBookUid[0], type: type, confirm: 'false'})       
    }
    render() {
        return (
            <View style={{flex: 1, position: 'absolute', zIndex: 999, width: '100%', backgroundColor: 'white'}}>
                <TouchableOpacity style={store.getState().showDeliver.showDeliver ? styles.container: {height: 0}} onPress={() => this.confirmStatus('delivering')}>
                    <View>
                        <BoldText style={[{ color: 'white' }, fonts.size14]}>現在の依頼内容を確認 »</BoldText>
                    </View>
                </TouchableOpacity>
                {
                    this.props.page != 'bookrequest' ?
                    <TouchableOpacity style={store.getState().showDeliver.showBookDeliver ? [styles.container, {backgroundColor: '#D93DCD', marginTop: store.getState().showDeliver.showDeliver ? 2 : 0}]: {height: 0}} onPress={() => this.confirmStatus('book')}>
                        <View>
                            <BoldText style={[{ color: 'white' }, fonts.size14]}>予約の依頼内容を確認 »</BoldText>
                        </View>
                    </TouchableOpacity>
                    :
                    null
                }
            </View>
        );
    }
}
const mapDispatchToProps = dispatch => {
    return {
        setShowDeliver : showDeliver => { dispatch(setShowDeliver(showDeliver))}
    }
}
const mapStateToProps = (state) => {
    return {
        showDeliver : state.showDeliver
    }
}
export default connect(mapStateToProps , mapDispatchToProps)(OrderConfirm);

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.secColor,
        alignSelf: 'flex-start',
        alignItems: 'center',
        width: '100%',
        zIndex: 9999991,
        paddingVertical: 15,
        paddingHorizontal: 13,
        top: Platform.OS == 'ios' ? Constants.statusBarHeight : 0
    }
});
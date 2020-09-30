import React from 'react';
import { StyleSheet, View, Platform, TouchableOpacity, StatusBar, ScrollView, AsyncStorage, SafeAreaView } from 'react-native';
import { shared, fonts, margin, normalize } from '../../assets/styles';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import { Container, Content } from 'native-base';
import { RegularText, BoldText } from '../../components/StyledText';
import Back from '../../components/Back';
import Colors from '../../constants/Colors';
import { getPolicy, getHelpContent } from '../../api';
import Spinner_bar from 'react-native-loading-spinner-overlay';
import { showToast } from '../../shared/global';
import OrderConfirm from '../../components/OrderConfirm';
import store from '../../store/configuteStore';
export default class Terms extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            status: '',
            content: '',
            loaded: true
        }
    }
    async componentDidMount() {
        let status = ''
        if(this.props.type == 'terms') 
            status = await AsyncStorage.getItem("terms")
        else if(this.props.type == 'commercial') 
            status = await AsyncStorage.getItem("commercial")
        else if(this.props.type == 'personal') 
            status = await AsyncStorage.getItem("personal")
        this.setState({status: status})
        this.setState({loaded: false})
        await getPolicy(this.props.type)
        .then(async (response) => {
            this.setState({loaded: true});
            if(response.status == 1){
                this.setState({content: response.content})
            } else{
                showToast(response.message)
            }
        })
        .catch((error) => {
            this.setState({loaded: true});
            showToast();
        });
    }

    async accept() {
        if(this.state.status == 'true') {
            if(this.props.type == 'terms') 
                await AsyncStorage.setItem("terms", "")
            else if(this.props.type == 'personal') 
                await AsyncStorage.setItem("personal", "")
            else if(this.props.type == 'commercial') 
                await AsyncStorage.setItem("commercial", "")
            this.setState({status: ''})    
            //Actions.pop();
        }
    }

    render(){
      return (
        <Container style={[shared.mainContainer]}>
            {Platform.OS === 'ios' && <StatusBar barStyle="dark-content"/>}
            <OrderConfirm />
            <SafeAreaView style={{flex: 1}}>
                <View style={{paddingTop: store.getState().showDeliver.showDeliver && store.getState().showDeliver.showBookDeliver ? 80 : (store.getState().showDeliver.showDeliver || store.getState().showDeliver.showBookDeliver) ? 40 : 0}}>
                    <View style={[{width: '100%',justifyContent: 'flex-end'}]}>
                        <Back color={"#d3d3d3"} />
                    </View>
                    <View style={[shared.flexCenter, {paddingHorizontal: normalize(20), paddingBottom: normalize(15), justifyContent: 'space-between'}]}>
                        <View style={[shared.flexCenter, {flexWrap: 'wrap'}]}>
                            {
                                this.props.title ?
                                null
                                :
                                <FontAwesome5 color={Colors.secColor} name={"unlock-alt"} size={35} />
                            }
                            <BoldText style={[fonts.size32, margin.ml2]}>
                                {
                                    this.props.type == 'terms' ? 
                                    '利用規約'
                                    :
                                    this.props.type == 'commercial' ? 
                                    '特定商取引法'
                                    :
                                    this.props.type == 'personal' ? 
                                    '個人情報保護方針'
                                    :
                                    this.props.title
                                }
                            </BoldText>
                        </View>
                        {
                            this.state.status == 'true' ?
                            <TouchableOpacity style={{backgroundColor: Colors.secColor, padding: 15, borderRadius: 10}} onPress={() => this.accept()}>
                                <BoldText style={[fonts.size14, {color: 'white'}]}>同意</BoldText>
                            </TouchableOpacity>
                            :
                            null
                        }
                    </View>
                    <ScrollView ref={ref => this.scrollRef = ref} style={{flex: 1}} style={{borderTopColor: '#f2f2f2', borderTopWidth: 1, paddingTop: 15}}>
                        <View style={{paddingHorizontal: normalize(20), paddingBottom: 30}}>
                            <RegularText style={[fonts.size16, {lineHeight: 20}]}>{this.state.content}</RegularText>
                        </View>
                        <Spinner_bar color={'#27cccd'} visible={!this.state.loaded} textContent={""} overlayColor={"rgba(0, 0, 0, 0.5)"} />
                    </ScrollView>
                </View>
            </SafeAreaView>
        </Container>
      );
    }
}
Terms.navigationOptions = {
  header: null
}
const styles = StyleSheet.create({
});
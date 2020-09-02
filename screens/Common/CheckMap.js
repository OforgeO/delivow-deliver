import React from 'react';
import { StyleSheet, View, Platform, AsyncStorage, TouchableOpacity, StatusBar, Alert } from 'react-native';
import { shared, fonts, margin, normalize, form } from '../../assets/styles';
import { Actions } from 'react-native-router-flux';
import Layout from '../../constants/Layout';
import { FontAwesome, FontAwesome5, Entypo, MaterialIcons } from '@expo/vector-icons';
import { Container, Content, Item, Input, Col } from 'native-base';
import MapView, { Marker } from 'react-native-maps';
import { RegularText, BoldText } from '../../components/StyledText';
import { getOrderLocations, calcDistance } from '../../api';
import Spinner_bar from 'react-native-loading-spinner-overlay';
import MapViewDirections from 'react-native-maps-directions';
import { GoogleMapKey } from '../../constants/Global'
import Colors from '../../constants/Colors';
import { showToast } from '../../shared/global';
import { connect } from "react-redux";
import { setNotify } from '../../actions';
import store from '../../store/configuteStore';
import Constants from 'expo-constants';
class CheckMap extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            region: null,
            orgMarker: null,
            targetMarker: null,
            loaded: true,
            orderInfo: null,
            distance: null,
            driveTime: null,
            motorTime: null,
            bycicleTime: null
        }
    }
    async componentDidMount() {
        console.log(this.props.store_name)
        this.setState({loaded: false})
        await getOrderLocations(this.props.order_uid)
        .then(async (response) => {
            if(response.status == 1) {
                if(response.info.delivery_location && response.info.delivery_location.length > 0)
                    this.setState({orgMarker: {
                        latitude: response.info.delivery_location[0],
                        longitude: response.info.delivery_location[1]
                    }})
                
                if(this.props.mapType == 'deliver_store') {
                    if(response.info.store_location && response.info.store_location.length > 0)
                        this.setState({targetMarker: {
                            latitude: response.info.store_location[0],
                            longitude: response.info.store_location[1]
                        }})
                    if(response.info.delivery_location.length > 0 && response.info.store_location.length > 0) {
                        await this.calcDistance(response.info.delivery_location[0], response.info.delivery_location[1], response.info.store_location[0], response.info.store_location[1], 'driving')
                        await this.calcDistance(response.info.delivery_location[0], response.info.delivery_location[1], response.info.store_location[0], response.info.store_location[1], 'bicycling')
                        this.setState({loaded: true});
                        let region = {
                            latitude: (parseFloat(response.info.delivery_location[0]) + parseFloat(response.info.store_location[0]))/2,
                            longitude: (parseFloat(response.info.delivery_location[1]) + parseFloat(response.info.store_location[1]))/2,
                            latitudeDelta: Math.abs(parseFloat(response.info.delivery_location[0]) - parseFloat(response.info.store_location[0])) + 0.01,
                            longitudeDelta: Math.abs(parseFloat(response.info.delivery_location[1]) - parseFloat(response.info.store_location[1])) + 0.01
                        }
                        this.setState({region: region})
                    }
                } else if(this.props.mapType == 'deliver_customer') {
                    if(response.info.customer_location && response.info.customer_location.length > 0)
                        this.setState({targetMarker: {
                            latitude: response.info.customer_location[0],
                            longitude: response.info.customer_location[1]
                        }})
                    if(response.info.delivery_location.length > 0 && response.info.customer_location.length > 0) {
                        await this.calcDistance(response.info.delivery_location[0], response.info.delivery_location[1], response.info.customer_location[0], response.info.customer_location[1], 'driving')
                        await this.calcDistance(response.info.delivery_location[0], response.info.delivery_location[1], response.info.customer_location[0], response.info.customer_location[1], 'bicycling')
                        this.setState({loaded: true});
                        let region = {
                            latitude: (parseFloat(response.info.delivery_location[0]) + parseFloat(response.info.customer_location[0]))/2,
                            longitude: (parseFloat(response.info.delivery_location[1]) + parseFloat(response.info.customer_location[1]))/2,
                            latitudeDelta: Math.abs(parseFloat(response.info.delivery_location[0]) - parseFloat(response.info.customer_location[0])) + 0.01,
                            longitudeDelta: Math.abs(parseFloat(response.info.delivery_location[1]) - parseFloat(response.info.customer_location[1])) + 0.01
                        }
                        this.setState({region: region})
                    }
                }
                
            } else {
                showToast(response.message)
                this.setState({loaded: true});
            }
        })
        .catch((error) => {
            this.setState({loaded: true});
            showToast();
        });
    }

    async calcDistance(orgLat, orgLng, targetLat, targetLng, type) {
        await calcDistance(orgLat, orgLng, targetLat, targetLng, type)
        .then(async (result) => {
            if(result.status == "OK" && result.rows[0].elements[0].distance.text) {
                if(type == 'driving') {
                    this.setState({distance: result.rows[0].elements[0].distance.text})
                    this.setState({driveTime: result.rows[0].elements[0].duration.value})
                } else if(type == 'bicycling')
                    this.setState({bycicleTime: result1.rows[0].elements[0].duration.value})
            } else {
                //showToast();
            }
        })
        .catch((error) => {
            this.setState({loaded: true});
            //showToast();
        });
    }

    goBack() {
        if(this.props.type && this.props.type == 'show_modal') {
            let notify = store.getState().notify
            notify.delivery_decide = true
            this.props.setNotify(notify)
            Actions.pop();
        } else {
            Actions.pop();
        }
    }
    
    render() {
        return (
            <Container style={[shared.mainContainer]}>
                {Platform.OS === 'ios' && <StatusBar barStyle="dark-content" backgroundColor="white" />}
                <Content contentContainerStyle={{ flex: 1, backgroundColor: 'white'}}>
                    <View style={{ height: Constants.statusBarHeight + 80, alignItems: 'flex-start', justifyContent: 'flex-end', bottom: 10, paddingHorizontal: normalize(20) }}>
                        <View style={[shared.flexCenter, {justifyContent: 'space-between', width: '100%'}]}>
                            <BoldText style={[fonts.size32]}>MAPを確認</BoldText>
                            <RegularText style={[fonts.size32, {color: Colors.secColor}]}>{this.state.distance}</RegularText>
                        </View>
                    </View>
                    <View style={[shared.flexCenter, {height: 60, borderTopColor: '#f2f2f2', borderTopWidth: 1}]}>
                        <View style={[shared.flexCenter, {flex: 1, justifyContent:'center'}]}>
                            <MaterialIcons color={Colors.mainColor} size={28} name={"directions-bike"} />
                            <View style={margin.ml2}>
                                <RegularText>バイク</RegularText>
                                <BoldText style={fonts.size14}>{parseInt(this.state.driveTime/60)}分</BoldText>
                            </View>
                        </View>
                        <View style={[shared.flexCenter, {flex: 1, justifyContent:'center'}]}>
                            <FontAwesome5 color={Colors.mainColor} size={28} name={"car-side"} />
                            <View style={margin.ml2}>
                                <RegularText>自動車</RegularText>
                                <BoldText style={fonts.size14}>{parseInt(this.state.driveTime/60)}分</BoldText>
                            </View>
                        </View>
                        <View style={[shared.flexCenter, {flex: 1, justifyContent:'center'}]}>
                            <FontAwesome5 color={Colors.mainColor} size={28} name={"bicycle"} />
                            <View style={margin.ml2}>
                                <RegularText>自転車</RegularText>
                                <BoldText style={fonts.size14}>{parseInt(this.state.bycicleTime/60)}分</BoldText>
                            </View>
                        </View>
                    </View>
                    <View>
                        {
                            this.state.region ?
                            <MapView style={styles.map}
                            initialRegion={this.state.region}>
                                <Marker
                                    coordinate={this.state.orgMarker}
                                >
                                    <FontAwesome5 name={"map-marker-alt"} size={30} color={'#0E1D3B'} />
                                </Marker>
                                <Marker
                                    coordinate={this.state.targetMarker}
                                >
                                    <View style={styles.marker}>
                                        <FontAwesome color="white" name="cutlery" size={18} />
                                        <RegularText style={[{ color: 'white', marginLeft: 10 }, fonts.size16]}>{this.props.store_name}</RegularText>
                                    </View>
                                    <View style={{ alignItems: 'center' }}>
                                        <Entypo name="triangle-down" color="#0E1D3B" size={30} style={{ position: 'absolute', top: -10 }} />
                                    </View>
                                </Marker>
                                <MapViewDirections
                                    origin={this.state.orgMarker}
                                    destination={this.state.targetMarker}
                                    apikey={GoogleMapKey}
                                    language="ja"
                                    strokeWidth={3}
                                    strokeColor={Colors.mainColor}
                                />
                            </MapView>
                            :
                            null
                        }
                        
                        <View style={{width: '100%', paddingHorizontal: normalize(20), bottom : 40}}>
                            <TouchableOpacity onPress={() => this.goBack()} style={styles.closeBtn}>
                                <BoldText style={[fonts.size16, {color: 'white'}]}>MAPを閉じる</BoldText>
                            </TouchableOpacity>
                        </View>
                    </View>
                    
                </Content>
                <Spinner_bar color={'#27cccd'} visible={!this.state.loaded} textContent={""} overlayColor={"rgba(0, 0, 0, 0.5)"} />
            </Container>
        );
    }
}
CheckMap.navigationOptions = {
    header: null
}
const mapDispatchToProps = dispatch => {
    return {
        setNotify : notify => { dispatch(setNotify(notify)) }
    }
}
const mapStateToProps = (state) => {
    return {
        notify : state.notify
    }
}
export default connect(mapStateToProps,mapDispatchToProps)(CheckMap)
const styles = StyleSheet.create({
    map: {
        width: Layout.window.width,
        height: '100%'
    },
    marker: {
        backgroundColor: '#0E1D3B', borderRadius: 10, padding: 10, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'
    },
    closeBtn: {
        width: '100%', paddingVertical: 15, borderRadius: 15, backgroundColor: Colors.mainColor, position: 'absolute', bottom: 150, flex: 1, zIndex: 9999, alignItems: 'center', marginLeft: normalize(20)
    }
});
import React from 'react';
import { StyleSheet, View, Platform, SafeAreaView, TouchableOpacity, StatusBar, Alert } from 'react-native';
import { shared, fonts, margin, normalize, form } from '../../assets/styles';
import { Actions } from 'react-native-router-flux';
import Layout from '../../constants/Layout';
import { FontAwesome, FontAwesome5, Entypo, MaterialIcons } from '@expo/vector-icons';
import { Container, Content, Item, Input, Col } from 'native-base';
import MapView, { Marker, Polyline } from 'react-native-maps';
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
import firebase from '../../Fire';
const deliverRef = firebase.database().ref('deliver_location')

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
            bycicleTime: null,
            deliver_uid: null,
            deliverAddr: null,
            vehicle_type : "DRIVING"
        }
    }
    async componentDidMount() {
        var _self = this;
        this.setState({loaded: false})
        await getOrderLocations(this.props.order_uid)
        .then(async (response) => {
            if(response.status == 1) {
                this.setState({orderInfo: response.info})
                if(response.info.vehicle_type == 'bike')
                    this.setState({vehicle_type: "BICYCLING"})
                if(response.info.customer_address)
                    this.setState({deliverAddr: response.info.customer_address})
                if(response.info.deliver_uid)
                    this.setState({deliver_uid: response.info.deliver_uid})
                if(response.info.delivery_location && response.info.delivery_location.length > 0)
                    this.setState({orgMarker: {
                        latitude: response.info.delivery_location[0],
                        longitude: response.info.delivery_location[1]
                    }})
                this.getLocation()
                
            } else {
                showToast(response.message)
                this.setState({loaded: true});
            }
        })
        .catch((error) => {
            this.setState({loaded: true});
            showToast();
        });

        if(this.props.mapType != 'store_customer') {
            let uid = store.getState().user.uid
            
            deliverRef.on("child_changed", function (snapshot) {
                if(snapshot.key == uid && snapshot.val()){
                    if(_self.props.mapType != 'store_customer')
                        _self.getLocation()
                    _self.setState({orgMarker: {
                        latitude: snapshot.val().latitude,
                        longitude: snapshot.val().longitude
                    }})
                }
            })
            
        }
    }

    componentWillUnmount() {
        //deliverRef = null
    }

    async getLocation() {
        if(this.props.mapType == 'deliver_store') {
            if(this.state.orderInfo.store_location && this.state.orderInfo.store_location.length > 0)
                this.setState({targetMarker: {
                    latitude: this.state.orderInfo.store_location[0],
                    longitude: this.state.orderInfo.store_location[1]
                }})
            
            if(this.state.orgMarker && this.state.orderInfo.store_location) {
                if(this.state.distance != 0 && this.state.driveTime != 0)
                    await this.calcDistance(this.state.orgMarker.latitude, this.state.orgMarker.longitude, this.state.orderInfo.store_location[0], this.state.orderInfo.store_location[1], 'driving')
                if(this.state.bycicleTime != 0)
                    await this.calcDistance(this.state.orgMarker.latitude, this.state.orgMarker.longitude, this.state.orderInfo.store_location[0], this.state.orderInfo.store_location[1], 'bicycling')
                this.setState({loaded: true});
                let region = {
                    latitude: (parseFloat(this.state.orgMarker.latitude) + parseFloat(this.state.orderInfo.store_location[0]))/2,
                    longitude: (parseFloat(this.state.orgMarker.longitude) + parseFloat(this.state.orderInfo.store_location[1]))/2,
                    latitudeDelta: Math.abs(parseFloat(this.state.orgMarker.latitude) - parseFloat(this.state.orderInfo.store_location[0])) + 2,
                    longitudeDelta: Math.abs(parseFloat(this.state.orgMarker.longitude) - parseFloat(this.state.orderInfo.store_location[1])) + 1
                }
                this.setState({region: region})
            } else {
                this.setState({region: {
                    latitude: 35.6804,
                    longitude: 139.769,
                    latitudeDelta: 0.4,
                    longitudeDelta: 0.4
                }})
            }
        } else if(this.props.mapType == 'deliver_customer') {
            if(this.state.orderInfo.customer_location && this.state.orderInfo.customer_location.length > 0)
                this.setState({targetMarker: {
                    latitude: this.state.orderInfo.customer_location[0],
                    longitude: this.state.orderInfo.customer_location[1]
                }})
            if(this.state.orderInfo.delivery_location.length > 0 && this.state.orderInfo.customer_location.length > 0) {
                if(this.state.distance != 0 && this.state.driveTime != 0)
                    await this.calcDistance(this.state.orgMarker.latitude, this.state.orgMarker.longitude, this.state.orderInfo.customer_location[0], this.state.orderInfo.customer_location[1], 'driving')
                if(this.state.bycicleTime != 0)
                    await this.calcDistance(this.state.orgMarker.latitude, this.state.orgMarker.longitude, this.state.orderInfo.customer_location[0], this.state.orderInfo.customer_location[1], 'bicycling')
                this.setState({loaded: true});
                let region = {
                    latitude: (parseFloat(this.state.orgMarker.latitude) + parseFloat(this.state.orderInfo.customer_location[0]))/2,
                    longitude: (parseFloat(this.state.orgMarker.longitude) + parseFloat(this.state.orderInfo.customer_location[1]))/2,
                    latitudeDelta: Math.abs(parseFloat(this.state.orgMarker.latitude) - parseFloat(this.state.orderInfo.customer_location[0])) + 2,
                    longitudeDelta: Math.abs(parseFloat(this.state.orgMarker.longitude) - parseFloat(this.state.orderInfo.customer_location[1])) + 1
                }
                this.setState({region: region})
            } else {
                this.setState({region: {
                    latitude: 35.6804,
                    longitude: 139.769,
                    latitudeDelta: 0.4,
                    longitudeDelta: 0.4
                }})
            }
        } else if(this.props.mapType == 'store_customer') {
            if(this.state.orderInfo.store_location && this.state.orderInfo.store_location.length > 0)
                this.setState({orgMarker: {
                    latitude: this.state.orderInfo.store_location[0],
                    longitude: this.state.orderInfo.store_location[1]
                }})
            if(this.state.orderInfo.customer_location && this.state.orderInfo.customer_location.length > 0)
                this.setState({targetMarker: {
                    latitude: this.state.orderInfo.customer_location[0],
                    longitude: this.state.orderInfo.customer_location[1]
                }})
            if(this.state.orderInfo.store_location.length > 0 && this.state.orderInfo.customer_location.length > 0) {
                if(this.state.distance != 0 && this.state.driveTime != 0)
                    await this.calcDistance(this.state.orderInfo.store_location[0], this.state.orderInfo.store_location[1], this.state.orderInfo.customer_location[0], this.state.orderInfo.customer_location[1], 'driving')
                if(this.state.bycicleTime != 0)
                    await this.calcDistance(this.state.orderInfo.store_location[0], this.state.orderInfo.store_location[1], this.state.orderInfo.customer_location[0], this.state.orderInfo.customer_location[1], 'bicycling')
                this.setState({loaded: true});
                let region = {
                    latitude: (parseFloat(this.state.orderInfo.store_location[0]) + parseFloat(this.state.orderInfo.customer_location[0]))/2,
                    longitude: (parseFloat(this.state.orderInfo.store_location[1]) + parseFloat(this.state.orderInfo.customer_location[1]))/2,
                    latitudeDelta: Math.abs(parseFloat(this.state.orderInfo.store_location[0]) - parseFloat(this.state.orderInfo.customer_location[0])) + 2,
                    longitudeDelta: Math.abs(parseFloat(this.state.orderInfo.store_location[1]) - parseFloat(this.state.orderInfo.customer_location[1])) + 1
                }
                this.setState({region: region})
            } else {
                this.setState({region: {
                    latitude: 35.6804,
                    longitude: 139.769,
                    latitudeDelta: 0.4,
                    longitudeDelta: 0.4
                }})
            }
        }
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
                if(type == 'driving') {
                    this.setState({distance: 0})
                    this.setState({driveTime: 0})
                } else if(type == 'bicycling')
                    this.setState({bycicleTime: 0})
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
                <SafeAreaView style={{ flex: 1, backgroundColor: 'white'}}>
                    <View style={{ height: Constants.statusBarHeight + 40, alignItems: 'flex-start', justifyContent: 'flex-end', bottom: 10, paddingHorizontal: normalize(20) }}>
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
                                <BoldText style={fonts.size14}>{this.state.bycicleTime > 0 ? parseInt(this.state.bycicleTime/60) : '-'}分</BoldText>
                            </View>
                        </View>
                        <View style={[shared.flexCenter, {flex: 1, justifyContent:'center'}]}>
                            <FontAwesome5 color={Colors.mainColor} size={28} name={"car-side"} />
                            <View style={margin.ml2}>
                                <RegularText>自動車</RegularText>
                                <BoldText style={fonts.size14}>{this.state.driveTime > 0 ? parseInt(this.state.driveTime/60) : '-'}分</BoldText>
                            </View>
                        </View>
                        <View style={[shared.flexCenter, {flex: 1, justifyContent:'center'}]}>
                            <FontAwesome5 color={Colors.mainColor} size={28} name={"bicycle"} />
                            <View style={margin.ml2}>
                                <RegularText>自転車</RegularText>
                                <BoldText style={fonts.size14}>{this.state.driveTime > 0 ? parseInt(this.state.driveTime/60) : '-'}分</BoldText>
                            </View>
                        </View>
                    </View>
                    <View>
                        {
                            this.state.region ?
                            <MapView style={styles.map}
                            initialRegion={this.state.region}>
                                <Marker.Animated
                                    coordinate={this.state.orgMarker}
                                >
                                    <FontAwesome5 name={"map-marker-alt"} size={30} color={'#0E1D3B'} />
                                </Marker.Animated>
                                <Marker
                                    coordinate={this.state.targetMarker}
                                >
                                    <View style={styles.marker}>
                                        <FontAwesome color="white" name="cutlery" size={18} />
                                        <RegularText style={[{ color: 'white', marginLeft: 10 }, fonts.size16]}>{this.props.mapType == 'deliver_customer' ? this.state.deliverAddr: this.props.store_name}</RegularText>
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
                                    resetOnChange={false}
                                    mode={this.state.vehicle_type}
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
                    
                </SafeAreaView>
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
import React from 'react';
import { StyleSheet, View, Platform, Text, Image, TouchableOpacity, StatusBar, SafeAreaView} from 'react-native';
import { shared, fonts, margin, normalize } from '../../assets/styles';
import { ScrollView } from 'react-native-gesture-handler';
import { Actions } from 'react-native-router-flux';
import Layout from '../../constants/Layout';
import { FontAwesome, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { Container, Content, Col } from 'native-base';
import Colors from '../../constants/Colors';
import { LineChart, Grid, YAxis, XAxis } from 'react-native-svg-charts'
import List from '../../components/List';
import { getSalesData } from '../../api';
import Spinner_bar from 'react-native-loading-spinner-overlay';
import { dayNamesShort } from '../../constants/Global';
import moment from 'moment';
import { _e } from '../../lang';
import { RegularText, BoldText} from '../../components/StyledText';
import OrderConfirm from '../../components/OrderConfirm';
import store from '../../store/configuteStore';
const contentInset = { top: 20, bottom: 20 }
export default class Sales extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tabType: 1,
            salesCountData: [],
            loaded: true,
            total_delivery_time: 0,
            total_delivery: 0,
            total: 0,
            salesTimeData: [],
            startDate: '',
            lastDate: '',
            total_price: 0,
            xData: []
        }
    }
    async componentDidMount() {
        this.setState({loaded: false})
        await getSalesData()
        .then(async (response) => {
            if(response.status == 1) {
                if(response.total_delivery_time)
                    this.setState({total_delivery_time: response.total_delivery_time})
                if(response.past_delivery)
                    this.setState({total_delivery: response.past_delivery})
                this.setState({total_price: response.total_price})
                if(response.chart.length > 0) {
                    let salesData = []
                    let timeData = []
                    let xData = []
                    response.chart.map((chart, index) => {
                        if(index == 0)
                            this.setState({startDate: chart.date})
                        if(index == response.chart.length - 1)
                            this.setState({lastDate: chart.date})
                        salesData.push(chart.count)
                        timeData.push(chart.time)
                        xData.push(moment(chart.date).format('X'))
                    })
                    this.setState({salesCountData: salesData})
                    this.setState({salesTimeData: timeData})
                    this.setState({xData: xData})
                }
            }
            this.setState({loaded: true})
        })
        .catch((error) => {
            this.setState({loaded: true})
            showToast()
        });
    }
    deliverfee() {
        Actions.push("deliverfee")
    }
    transfer() {
        Actions.push("transferstatus")
    }
    tabChoose(type) {
        this.setState({tabType: type})
    }

    render(){
      return (
        <Container style={[shared.mainContainer]}>
            {Platform.OS === 'ios' && <StatusBar barStyle="dark-content" backgroundColor="white" />}
            <OrderConfirm />
            <SafeAreaView contentContainerStyle={{ flex:1}}>
                <ScrollView ref={ref => this.scrollRef = ref} contentContainerStyle={{paddingTop: store.getState().showDeliver.showDeliver && store.getState().showDeliver.showBookDeliver ? 80 : (store.getState().showDeliver.showDeliver || store.getState().showDeliver.showBookDeliver) ? 40 : 0}}>
                    <View style={[styles.header, {marginTop: 40}]}>
                        <BoldText style={[fonts.size32]}>売上管理</BoldText>
                    </View>
                    <View style={styles.section}>
                        <View style={shared.flexCenter}>
                            <FontAwesome5 size={14} name={"calendar-week"} color={Colors.secColor} />
                            <RegularText style={[{color: '#848484'}, fonts.size14, margin.ml1]}>
                                {
                                    this.state.startDate != '' ?
                                    moment(this.state.startDate).format("YYYY/MM/DD") + '('+dayNamesShort[moment(this.state.startDate).format('d')]+')'
                                    :
                                    null
                                }
                                {
                                    this.state.startDate != '' ?
                                    '~'
                                    :
                                    null
                                }
                                {
                                    this.state.lastDate != '' ?
                                    moment(this.state.lastDate).format("YYYY/MM/DD") + '('+dayNamesShort[moment(this.state.lastDate).format('d')]+')'
                                    :
                                    null
                                }
                            </RegularText>
                        </View>
                        <RegularText style={{color: Colors.secColor, fontSize: 50, marginTop: 15}}>¥{this.state.total_price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</RegularText>
                    </View>
                    <View style={[styles.tabSection, shared.flexCenter, {alignItems: 'flex-start'}]}>
                        <TouchableOpacity style={this.state.tabType == 1 ? styles.tabSelectedText : null} onPress={() => this.tabChoose(1)}>
                            <BoldText style={[fonts.size12, {color: this.state.tabType == 1 ? Colors.secColor: '#b5b5b5'}]}>配達回数(回)</BoldText>
                        </TouchableOpacity>
                        <TouchableOpacity style={[this.state.tabType == 2 ? styles.tabSelectedText : null, margin.ml3]} onPress={() => this.tabChoose(2)}>
                            <BoldText style={[fonts.size12, {color: this.state.tabType == 2 ? Colors.secColor: '#b5b5b5'}]}>移動時間(h)</BoldText>
                        </TouchableOpacity>
                    </View>
                    {
                        this.state.salesCountData.length > 0 && this.state.tabType == 1 ?
                        <View style={[styles.section, { height: 200, flexDirection: 'row', paddingHorizontal: normalize(20) }]}>
                            <YAxis
                                data={this.state.salesCountData}
                                contentInset={contentInset}
                                svg={{
                                    fill: 'grey',
                                    fontSize: 12,
                                }}
                                numberOfTicks={10}
                                formatLabel={(value) => value}
                            />
                            <View style={{ flex: 1, marginLeft: 16 }}>
                                <LineChart
                                    style={{ flex: 1 }}
                                    data={this.state.salesCountData}
                                    svg={{ stroke: Colors.secColor }}
                                    contentInset={contentInset}
                                    animate={true}
                                    numberOfTicks={10}
                                >
                                    <Grid />
                                </LineChart>
                                <XAxis
                                    style={{ marginHorizontal: -10 }}
                                    data={this.state.xData}
                                    xAccessor={({ item, index }) => item}
                                    formatLabel={(value, index) => moment.unix(value).format("M/D")}
                                    contentInset={{ left: 15, right: 15 }}
                                    svg={{ fontSize: 12, fill: 'grey' }}
                                />
                            </View>
                        </View>
                        :
                        this.state.salesTimeData.length > 0 && this.state.tabType == 2 ?
                        <View style={[styles.section, { height: 200, flexDirection: 'row', paddingHorizontal: normalize(20) }]}>
                            <YAxis
                                data={this.state.salesTimeData}
                                contentInset={contentInset}
                                svg={{
                                    fill: 'grey',
                                    fontSize: 12,
                                }}
                                numberOfTicks={10}
                                formatLabel={(value) => value}
                            />
                            <View style={{ flex: 1, marginLeft: 16 }}>
                                <LineChart
                                    style={{ flex: 1 }}
                                    data={this.state.salesTimeData}
                                    svg={{ stroke: Colors.secColor }}
                                    contentInset={contentInset}
                                    animate={true}
                                >
                                    <Grid />
                                </LineChart>
                                <XAxis
                                    style={{ marginHorizontal: -10 }}
                                    data={this.state.xData}
                                    xAccessor={({ item, index }) => item}
                                    formatLabel={(value, index) => moment.unix(value).format("M/D")}
                                    contentInset={{ left: 15, right: 15 }}
                                    svg={{ fontSize: 12, fill: 'grey' }}
                                />
                            </View>
                        </View>
                        :
                        <View style={[styles.section, { height: 200, flexDirection: 'row', paddingHorizontal: normalize(20), alignItems: 'center', justifyContent: 'center' }]}>
                            <RegularText>{_e.noDeliverData}</RegularText>
                        </View>
                    }
                    
                    <View style={[shared.flexCenter, styles.totalSection]}>
                        <View style={[styles.detailSection, {borderRightWidth: 1, borderRightColor: '#f2f2f2'}]}>
                            <RegularText style={[{color: Colors.secColor}, fonts.size40]}>{this.state.total_delivery.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</RegularText>
                            <View style={shared.flexCenter}>
                                <FontAwesome5 color={Colors.secColor} name={"car-side"} size={12}/>
                                <RegularText style={[{color: '#848484'}, margin.ml1]}>過去の総配達回数(回)</RegularText>
                            </View>
                        </View>
                        <View style={styles.detailSection}>
                            <RegularText style={[{color: Colors.secColor}, fonts.size40]}>{this.state.total_delivery_time && this.state.total_delivery_time.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</RegularText>
                            <View style={shared.flexCenter}>
                                <MaterialCommunityIcons color={Colors.secColor} name={"clock"} size={12}/>
                                <RegularText style={[{color: '#848484'}, margin.ml1]}>過去の総配達時間(h)</RegularText>
                            </View>
                        </View>
                    </View>
                    <List icon="coins" font5={true} title="振込状況を確認" size={14} clickEvent={this.transfer.bind(this)}/>
                    <List icon="file-text" font5={false} title="配達報酬明細表(年度)" size={14} clickEvent={this.deliverfee.bind(this)}/>
                </ScrollView>
                <Spinner_bar color={'#27cccd'} visible={!this.state.loaded} textContent={""} overlayColor={"rgba(0, 0, 0, 0.5)"} />
            </SafeAreaView>
        </Container>
      );
    }
}
Sales.navigationOptions = {
  header: null
}
const styles = StyleSheet.create({
    header: {
        borderBottomColor: '#f2f2f2', borderBottomWidth: 1, paddingHorizontal: normalize(20), paddingBottom: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10
    },
    section: {
        paddingHorizontal: normalize(20),
        borderBottomColor: '#f2f2f2',
        borderBottomWidth: 1,
        marginTop: 20,
        paddingBottom: 20,
    },
    tabSection: {
        paddingHorizontal: normalize(20),
        paddingTop: 20
    },
    tabSelectedText: {
        paddingBottom: 3, 
        borderBottomWidth: 2,
        borderBottomColor: Colors.secColor
    },
    totalSection: {
        borderBottomColor: '#f2f2f2',
        borderBottomWidth: 1,
    },
    detailSection: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 20
    }
});
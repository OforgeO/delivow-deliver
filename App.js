import * as React from 'react';
import { Platform, StatusBar, StyleSheet, Linking } from 'react-native';
import { Root } from 'native-base';
import useCachedResources from './hooks/useCachedResources';
import EStyleSheet from 'react-native-extended-stylesheet';
import store from './store/configuteStore';
import { connect, Provider } from 'react-redux';
import { Router, Scene, Actions } from 'react-native-router-flux'
import TabBarIcon from './components/TabBarIcon';
import * as TaskManager from 'expo-task-manager';
import { updateLocation } from './api';
import moment from 'moment';
//Splash
import SplashScreen from './screens/SplashScreen'
//User
import Login from './screens/User/Login';
import Signup from './screens/User/Singup';
import PhoneSignup from './screens/User/PhoneSignup';
import ForgotEmailInput from './screens/User/ForgotEmailInput';
import ForgotEmailReceive from './screens/User/ForgotEmailReceive';
import ForgotPwd from './screens/User/ForgotPwd';
import AccountInfo from './screens/User/AccountInfo';
import SMSVerify from './screens/User/SMSVerify';
import ResendCode from './screens/User/ResendCode';
import PasswordRegister from './screens/User/PasswordRegister';
import AvatarRegister from './screens/User/AvatarRegister';
import VehicleRegister from './screens/User/VehicleRegister';
import LicenseRegister from './screens/User/LicenseRegister';
import VehicleNoRegister from './screens/User/VehicleNoRegister';
import InsuranceRegister from './screens/User/InsuranceRegister';
import AreaShift from './screens/User/AreaShift';
import Bank from './screens/User/Bank';
import CardPhoto from './screens/User/CardPhoto';
import RegisterComplete from './screens/User/RegisterComplete';
import PhoneLogin from './screens/User/PhoneLogin';
import TermsScreen from './screens/User/TermsScreen';
//Home
import MyPage from './screens/Home/MyPage';
import EditAccount from './screens/Home/EditAccount';
import EmailConfirm from './screens/Home/EmailConfirm';
import EmailChange from './screens/Home/EmailChange';
import ReportTrouble from './screens/Home/ReportTrouble';
import BookRequest from './screens/Home/BookRequest';
import TodayShift from './screens/Home/TodayShift';
import TodayShiftTime from './screens/Home/TodayShiftTime';
import BookRequestDetail from './screens/Home/BookRequestDetail';
import DeliverHistory from './screens/Home/DeliverHistory';
//Order
import Sales from './screens/Order/Sales';
import TransferStatus from './screens/Order/TransferStatus';
import DeliverFee from './screens/Order/DeliverFee';
import DeliverFeeDetail from './screens/Order/DeliverFeeDetail';
//Shift
import ShiftRegister from './screens/Shift/ShiftRegister';
//Common
import Terms from './screens/Common/Terms';
import CheckMap from './screens/Common/CheckMap';
import ChatList from './screens/Common/ChatList';
import Chat from './screens/Common/Chat';
//Components
import TermsNotify from './components/TermsNotify';
import EditName from './screens/Home/EditName';
import UpdatePassword from './screens/Home/UpdatePassword';
import AllowNotification from './screens/Home/AllowNotification';
import AlertModal from './components/AlertModal';
import OrderConfirm from './components/OrderConfirm';

// define variable
EStyleSheet.build({
    $primaryColor: '#3497FD',
    $secondaryColor: '#3ACCE1',
    $thirdColor: '#FF9057',
    $successColor: '#62BC56',
    $darkColor: '#353a50',
    $smallTextColor: '#78849E',
    $bigTextColor: '#454F63'
});

console.disableYellowBox = true;
const LOCATION_TASK_NAME = 'background-location-task';
// const Stack = createStackNavigator();
export default function App(props) {
    const isLoadingComplete = useCachedResources();

    if (!isLoadingComplete) {
        return null;
    } else {

        const RouterWithRedux = connect()(Router);
        return (
            <Root>
                <StatusBar backgroundColor="white" barStyle="dark-content" />
                <Provider store={store}>
                    <TermsNotify />
                    <AlertModal />
                    <RouterWithRedux>
                        <Scene hideNavBar key="hidenav">
                            <Scene key="root" hideNavBar showLabel={false} >
                                <Scene
                                    key="tabbar"
                                    tabs
                                    wrap={false}
                                    tabBarStyle={styles.tabBarStyle}>
                                    <Scene key="home" title="ホーム" type="FontAwesome5" reset="mypage" name="home" icon={TabBarIcon} hideNavBar={true}  >
                                        <Scene key="mypage" component={MyPage} hideNavBar={true}  />
                                        <Scene key="editaccount" component={EditAccount} hideNavBar={true} />
                                        <Scene key="emailconfirm" component={EmailConfirm} hideNavBar={true} />
                                        <Scene key="emailchange" component={EmailChange} hideNavBar={true} />
                                        <Scene key="reporttrouble" component={ReportTrouble} hideNavBar={true} />
                                        <Scene key="bookrequest" component={BookRequest} />
                                        <Scene key="todayshift" component={TodayShift} />
                                        <Scene key="todayshifttime" component={TodayShiftTime} />
                                        <Scene key="bookrequestdetail" component={BookRequestDetail} />
                                        <Scene key="editname" component={EditName} />
                                        <Scene key="updatepassword" component={UpdatePassword} />
                                        <Scene key="vehicleregister" component={VehicleRegister} />
                                        <Scene key="deliverhistory" component={DeliverHistory} />
                                    </Scene>
                                    <Scene key="order" title="売上管理" type="FontAwesome5" reset="sales" name="coins" icon={TabBarIcon} hideNavBar={true} >
                                        <Scene key="sales" component={Sales} hideNavBar={true} initial />
                                        <Scene key="transferstatus" component={TransferStatus} hideNavBar={true} />
                                        <Scene key="deliverfee" component={DeliverFee} hideNavBar={true} />
                                        <Scene key="deliverfeedetail" component={DeliverFeeDetail} hideNavBar={true} />
                                    </Scene>
                                    <Scene key="shift" title="シフト登録" type="FontAwesome5" reset="shiftregister" name="calendar-week" icon={TabBarIcon} hideNavBar={true} >
                                        <Scene key="shiftregister" component={ShiftRegister} initial />
                                    </Scene>
                                </Scene>
                                <Scene key="checkmap" component={CheckMap}/>
                                <Scene key="chatlist" component={ChatList} />
                                <Scene key="chat" component={Chat} />
                                <Scene key="allownotification" component={AllowNotification} />
                            </Scene>
                            <Scene key="terms" component={Terms}/>

                            <Scene key="login" component={Login} initial />
                            <Scene key="signup" component={Signup} />
                            <Scene key="phonelogin" component={PhoneLogin} />
                            <Scene key="forgotemailinput" component={ForgotEmailInput} />
                            <Scene key="forgotemailreceive" component={ForgotEmailReceive} />
                            <Scene key="phonesignup" component={PhoneSignup} />
                            <Scene key="forgotpwd" component={ForgotPwd} />
                            <Scene key="smsverify" component={SMSVerify} />
                            <Scene key="resendcode" component={ResendCode} />
                            <Scene key="accountinfo" component={AccountInfo} />
                            <Scene key="splash" component={SplashScreen} />
                            <Scene key="passwordregister" component={PasswordRegister} />
                            <Scene key="avatarregister" component={AvatarRegister} />
                            <Scene key="vehicleregister" component={VehicleRegister} />
                            <Scene key="licenseregister" component={LicenseRegister} />
                            <Scene key="vehiclenoregister" component={VehicleNoRegister} />
                            <Scene key="insuranceregister" component={InsuranceRegister} />
                            <Scene key="areashift" component={AreaShift} />
                            <Scene key="bank" component={Bank} />
                            <Scene key="cardphoto" component={CardPhoto} />
                            <Scene key="registercomplete" component={RegisterComplete} />
                            <Scene key="termsscreen" component={TermsScreen} />
                        </Scene>
                    </RouterWithRedux>
                </Provider>
            </Root>
        );
    }
}

const styles = StyleSheet.create({
    tabBarStyle: {
        backgroundColor: 'white',
        height: Platform.OS == 'ios' ? 60 : 60,
        paddingBottom: 8
    }
});


TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
    if (error) {
        console.log(error)
        return;
    }
    if (data) {
        const { locations } = data;
        if (locations) {
            await updateLocation(locations[0].coords.latitude, locations[0].coords.longitude)
            .then(async (response) => {
            })
            .catch((error) => {
            });
        }
    }
});
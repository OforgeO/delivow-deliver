import React from 'react';
import { StyleSheet, View, Platform, Text, TouchableOpacity, StatusBar, SafeAreaView} from 'react-native';
import { shared, fonts, margin, normalize } from '../../assets/styles';
import { ScrollView } from 'react-native-gesture-handler';
import { Actions } from 'react-native-router-flux';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import { Container, Content } from 'native-base';
import Register from '../../assets/images/Register.svg';
import { RegularText, BoldText } from '../../components/StyledText';
export default class RegisterComplete extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    componentDidMount() {
    }

    render(){
      return (
        <Container style={[shared.mainContainer]}>
            {Platform.OS === 'ios' && <StatusBar barStyle="dark-content" backgroundColor="white" />}
            <SafeAreaView style={{ flex:1}}>
                <ScrollView contentContainerStyle={{flex: 1}} ref={ref => this.scrollRef = ref} >
                    <View style={{flex: 1, justifyContent: 'center', height: '100%'}}>
                        <View style={styles.pageTitle}>
                            <RegularText style={[fonts.size32, {fontWeight: 'bold'}]}>登録完了です！{'\n'}お疲れ様でした。</RegularText>
                        </View>

                        <View style={styles.container}>
                            <Register />
                            <RegularText style={[fonts.size16, margin.mt6, {lineHeight: 23}]}>運営本部より登録完了メールが届きます。{'\n'}
    本登録についてのとても重要なメールです。{'\n'}
    必ずご確認ください。</RegularText>
                        </View>
                    </View>
                </ScrollView>
                <View style={{justifyContent: 'flex-end', paddingHorizontal: normalize(20)}}>
                    <View style={{justifyContent: 'center', alignItems: 'center', width: '100%', bottom: 30}}>
                        <TouchableOpacity onPress={() => Actions.reset("signup")} style={{borderRadius: 12, width: '100%',backgroundColor: Colors.mainColor, paddingVertical: Platform.OS == 'ios' ? 17 : 12 }}>
                            <RegularText style={[styles.btnText , fonts.size16]}>ログイン画面へ</RegularText>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
          
        </Container>
      );
    }
}
RegisterComplete.navigationOptions = {
  header: null
}
const styles = StyleSheet.create({
    back: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: normalize(20),
        paddingVertical: 10,
        width: '100%'
    },
    goBack: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center'
    },
    pageTitle: {
        paddingHorizontal: normalize(20), paddingBottom: 30
    },
    container: {
        padding: normalize(20),
        alignItems: 'center'
    },
    btnText: {
        width: "100%",
        color: '#fff',
        textAlign: 'center',
    },
});
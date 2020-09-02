import EStyleSheet from 'react-native-extended-stylesheet';
import {Dimensions, Platform, PixelRatio, StyleSheet} from 'react-native';
import Constants from "expo-constants";
const {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT
} = Dimensions.get('window');
const scale =  SCREEN_WIDTH / 360;
let size_scale = scale;
if (scale > 2) {
    size_scale = scale * 0.666;
}
export function normalize(size) {
    if (Platform.OS === 'ios') {
      return Math.round(PixelRatio.roundToNearestPixel(size_scale * size));
    } else {
      return Math.round(PixelRatio.roundToNearestPixel(size_scale * size))
    }
}

export function getTabHeight() {
    if (Platform.OS === 'ios') {
        return 110;
      } else {
        return 70;
      }
}

export function getScreenHeight() {
    return SCREEN_HEIGHT - normalize(60);
}

export function getScreenWidth() {
    return SCREEN_WIDTH;
}

export const fonts = EStyleSheet.create({
    size10: { fontSize: normalize(10)},
    size11: { fontSize: normalize(11)},
    size12: { fontSize: normalize(12)},
    size13: { fontSize: normalize(13)},
    size14: { fontSize: normalize(14)},
    size15: { fontSize: normalize(15)},
    size16: { fontSize: normalize(16)},
    size18: { fontSize: normalize(18)},
    size20: { fontSize: normalize(20)},
    size32: { fontSize: normalize(32) },
    size40: { fontSize: normalize(40) },
    size50: { fontSize: normalize(50) }
});

export const margin = EStyleSheet.create({
    ml1: { marginLeft: normalize(4) }, ml2: { marginLeft: normalize(8) },
    ml3: { marginLeft: normalize(12) }, ml4: { marginLeft: normalize(16) },
    ml5: { marginLeft: normalize(20) }, ml6: { marginLeft: normalize(24) },
    ml7: { marginLeft: normalize(28) }, ml8: { marginLeft: normalize(32) },
    ml9: { marginLeft: normalize(36) }, ml10: { marginLeft: normalize(40) },
    mt1: { marginTop: normalize(4) }, mt2: { marginTop: normalize(8) },
    mt3: { marginTop: normalize(12) }, mt4: { marginTop: normalize(16) },
    mt5: { marginTop: normalize(20) }, mt6: { marginTop: normalize(24) },
    mt7: { marginTop: normalize(28) }, mt8: { marginTop: normalize(32) },
    mt9: { marginTop: normalize(36) }, mt10: { marginTop: normalize(40) },
    mt16: { marginTop: normalize(64) },
    mt24: { marginTop: normalize(96) },
    mr1: { marginRight: normalize(4) }, mr2: { marginRight: normalize(8) },
    mr3: { marginRight: normalize(12) }, mr4: { marginRight: normalize(16) },
    mr5: { marginRight: normalize(20) }, mr6: { marginRight: normalize(24) },
    mr7: { marginRight: normalize(28) }, mr8: { marginRight: normalize(32) },
    mr9: { marginRight: normalize(36) }, mr10: { marginRight: normalize(40) },
    mr12: { marginRight: normalize(48) },
    mb1: {marginBottom: normalize(4)}, mb2: {marginBottom: normalize(8)},
    mb3: {marginBottom: normalize(12)}, mb4: {marginBottom: normalize(16)},
    mb5: {marginBottom: normalize(20)}, mb6: {marginBottom: normalize(24)},
    mb7: {marginBottom: normalize(28)}, mb8: {marginBottom: normalize(32)},
    mb9: {marginBottom: normalize(20)}, mb10: {marginBottom: normalize(40)},
    mx4: {
        marginLeft: normalize(16),
        marginRight: normalize(16)
    },

    pl1: { paddingLeft: normalize(4) }, pl2: { paddingLeft: normalize(8) },
    pl3: { paddingLeft: normalize(12) }, pl4: { paddingLeft: normalize(16) },
    pl5: { paddingLeft: normalize(20) }, pl6: { paddingLeft: normalize(24) },
    pl7: { paddingLeft: normalize(28) }, pl8: { paddingLeft: normalize(32) },
    pl9: { paddingLeft: normalize(36) }, pl10: { paddingLeft: normalize(40) },
    pl15: {paddingLeft: normalize(60)},

    pr1: { paddingRight: normalize(4) }, pr2: { paddingRight: normalize(8) },
    pr3: { paddingRight: normalize(12) }, pr4: { paddingRight: normalize(16) },
    pr5: { paddingRight: normalize(20) }, pr6: { paddingRight: normalize(24) },
    pr7: { paddingRight: normalize(28) }, pr8: { paddingRight: normalize(32) },
    pr9: { paddingRight: normalize(36) }, pr10: { paddingRight: normalize(40) },
    pr15: {paddingRight: normalize(60)},

    px1: { paddingHorizontal: normalize(4) }, px2: { paddingHorizontal: normalize(8) },
    px3: { paddingHorizontal: normalize(12) }, px4: { paddingHorizontal: normalize(16)},
    px5: { paddingHorizontal: normalize(20) }, px6: { paddingHorizontal: normalize(24)},
    px7: { paddingHorizontal: normalize(28) }, px8: { paddingHorizontal: normalize(32)},
    px9: { paddingHorizontal: normalize(36) }, px10: { paddingHorizontal: normalize(40)},

    py1: { paddingVertical: normalize(4) }, py2: { paddingVertical: normalize(8) },
    py3: { paddingVertical: normalize(12) }, py4: { paddingVertical: normalize(16) },
    py5: { paddingVertical: normalize(20) }, py6: { paddingVertical: normalize(24) },
    py7: { paddingVertical: normalize(28) }, py8: { paddingVertical: normalize(32) },
    py9: { paddingVertical: normalize(36) }, py10: { paddingVertical: normalize(40) },

    pt1: {paddingTop: normalize(4)}, pt2: {paddingTop: normalize(8)},
    pt3: {paddingTop: normalize(12)}, pt4: {paddingTop: normalize(16)},
    pt5: {paddingTop: normalize(20)}, pt6: {paddingTop: normalize(24)},
    pt7: {paddingTop: normalize(28)}, pt8: {paddingTop: normalize(32)},
    pt9: {paddingTop: normalize(36)}, pt10: {paddingTop: normalize(40)},

    pb1: {paddingBottom: normalize(4)}, pb2: {paddingBottom: normalize(8)},
    pb3: {paddingBottom: normalize(12)}, pb4: {paddingBottom: normalize(16)},
    pb5: {paddingBottom: normalize(20)}, pb6: {paddingBottom: normalize(24)},
    pb7: {paddingBottom: normalize(28)}, pb8: {paddingBottom: normalize(32)},
    pb9: {paddingBottom: normalize(36)}, pb10: {paddingBottom: normalize(40)},
    px5: {
        paddingHorizontal: normalize(20)
    },
    px6: {
        paddingHorizontal: normalize(24)
    },
    px8: {
        paddingLeft: normalize(32),
        paddingRight: normalize(32)
    },
    p5: {
        padding: normalize(20)
    }
});

export const tab = EStyleSheet.create({
    tabBar: {
        height: getTabHeight(),
        paddingTop: 0
    }
});

export const form = EStyleSheet.create({
    input: {
        fontSize: normalize(14),
        lineHeight: normalize(14),
        textAlignVertical: 'center',
    },
    item : {
        display: 'flex' ,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        borderRadius : normalize(10),
        marginBottom: normalize(12),
        paddingRight: normalize(5),
        paddingLeft: normalize(7),
        height: normalize(45),
        borderBottomWidth: 0,
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        backgroundColor: '#F2F2F2'
    },
    submitButton : {
        borderRadius : normalize(12),
        backgroundColor: '$darkColor'
    }
});

export const shared = EStyleSheet.create({
    header: {
        height:60,
        zIndex:10001,
        position: 'relative',

    },
    userHeaderText: {
        color: 'black',
        fontSize:normalize(17)
    },
    container: {
        height: Constants.statusBarHeight > 20 && Platform.OS == 'ios' ? SCREEN_HEIGHT - Constants.statusBarHeight - 25 : SCREEN_HEIGHT - Constants.statusBarHeight
    },
    bodyContainer: {
        height: Constants.statusBarHeight > 20 && Platform.OS == 'ios' ? SCREEN_HEIGHT - Constants.statusBarHeight - 95 : SCREEN_HEIGHT - Constants.statusBarHeight - 60
    },
    mainContainer: {
        flex: 1,
        backgroundColor: '#fff',
        //marginTop: Platform.OS == 'ios' ? Constants.statusBarHeight : Constants.statusBarHeight
    },
    flexCenter: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    statusBar: {
        marginTop: Constants.statusBarHeight
    }
});

export const splash = EStyleSheet.create({
    splashContainer : {
        flex: 1 ,
        justifyContent: 'center' ,
        alignItems: 'center' ,
        backgroundColor : '#0D7684'
    },
    splashText : {
        color : 'white',
        fontSize : normalize(18)
    }
});
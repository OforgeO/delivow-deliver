import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import * as React from 'react';
import { StyleSheet , View , TouchableOpacity, Platform } from 'react-native';
import Colors from '../constants/Colors';
import { RegularText , BoldText } from './StyledText';
import { Actions } from 'react-native-router-flux';
export default function TabBarIcon(props) {
  if(props.type == 'FontAwesome')
    return (
      <TouchableOpacity style={styles.tab_item} onPress={() => Actions.reset(props.reset)}>
        <FontAwesome
          name={props.name}
          size={props.size ? props.size : 20}
          style={{ marginBottom: 0, marginTop: 8 }}
          color={props.focused ? Colors.tabIconSelected : Colors.tabIconDefault}
        />
        <RegularText style={{color: props.focused ? Colors.tabIconSelected : Colors.tabIconDefault , marginTop: 4}}>{props.title}</RegularText>
      </TouchableOpacity>
    );
  else if(props.type == 'FontAwesome5')
    return (
      <TouchableOpacity style={styles.tab_item} onPress={() => Actions.reset(props.reset)}>
        <FontAwesome5
          name={props.name}
          size={Platform.OS == 'ios' ? 20 : 20}
          style={{ marginBottom: 0, marginTop: 8 }}
          color={props.focused ? Colors.tabIconSelected : Colors.tabIconDefault}
        />
        <RegularText style={{color: props.focused ? Colors.tabIconSelected : Colors.tabIconDefault , marginTop: 4}}>{props.title}</RegularText>
      </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
  tab_item: {
    display:'flex',
    alignItems: 'center'
  }
});
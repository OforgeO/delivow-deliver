import * as React from 'react';
import { Platform, Text } from 'react-native';


export function RegularText(props) {
  return <Text {...props} style={Platform.OS == 'ios' ? [props.style] : [{fontFamily: 'sf-pro'}, props.style]} />;
}
export function BoldText(props) {
  return <Text {...props} style={Platform.OS == 'ios' ? [{ fontWeight: 'bold'},props.style] : [{ fontFamily: 'sf-pro-bold'},props.style]} />
}
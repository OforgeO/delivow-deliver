import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as React from 'react';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import BusinessCateScreen from '../screens/BusinessCateScreen';
import BusinessLocationDScreen from '../screens/BusinessLocationDScreen';
import BusinessEditScreen from '../screens/BusinessEditScreen';
import { tab } from './../assets/styles';
import ShowAllClient from '../screens/ShowAllClient';
const BottomTab = createBottomTabNavigator();
const INITIAL_ROUTE_NAME = 'Home';

export default function BottomTabNavigator({ navigation, route }) {
  // Set the header title on the parent stack navigator depending on the
  // currently active tab. Learn more in the documentation:
  // https://reactnavigation.org/docs/en/screen-options-resolution.html

  return (
    <BottomTab.Navigator initialRouteName={INITIAL_ROUTE_NAME} tabBarOptions={{ style: tab.tabBar, tabStyle: {}, labelStyle: {marginTop: 5, marginBottom: 12} }}>
      <BottomTab.Screen
        name="BusinessEdit"
        component={BusinessEditScreen}
        options={{
          title: 'ルート',
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="location-pin" type="SimpleLineIcons" />,
        }}
      />
      <BottomTab.Screen
        name="BusinessCateScreen"
        component={BusinessCateScreen}
        options={{
          title: '企業検索',
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="search" type="Feather" />,
        }}
      />
      <BottomTab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'メッセージ',
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="home" type="SimpleLineIcons" />,
        }}
      />
      <BottomTab.Screen
        name="Message"
        component={BusinessLocationDScreen}
        options={{
          title: 'ホーム',
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="message1" type="AntDesign" />,
        }}
      />
      <BottomTab.Screen
        name="Clip"
        component={ShowAllClient}
        options={{
          title: 'お気に入り',
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="favorite-border" type="MaterialIcons" />,
        }}
      />
    </BottomTab.Navigator>
  );
}

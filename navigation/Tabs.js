import React from "react";
import { createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {DISABLED, BOLD} from '../font/constants';
import DaySelect from "../screens/DaySelect";
import UserAdmin from "../screens/UserAdmin";
import Profile from "../screens/Profile";


const Tabs = createMaterialBottomTabNavigator();

export default ({route}) => (
  <Tabs.Navigator
    activeColor={BOLD}
    inactiveColor={DISABLED}
    barStyle={{
      backgroundColor: '#FFFFFF',
      borderTopColor: BOLD,
      borderTopWidth: 0.8
    }}
  >
    <Tabs.Screen 
      name="rManage" 
      component={DaySelect}
      options={{
        tabBarLabel: '예약관리',
        tabBarIcon: ({ color }) => (
          <MaterialCommunityIcons name="calendar" color={color} size={26} />
        ),
      }}
    />
    <Tabs.Screen 
      name="rAdmin" 
      component={UserAdmin}
      options={{
        tabBarLabel: '사용자관리',
        tabBarIcon: ({ color }) => (
          <MaterialCommunityIcons name="account-star" color={color} size={26} />
        ),
      }}
    />
    <Tabs.Screen 
      name="profile" 
      component={Profile}
      options={{
        tabBarLabel: '프로필',
        tabBarIcon: ({ color }) => (
          <MaterialCommunityIcons name="account" color={color} size={26} />
        ),
      }}
    />
  </Tabs.Navigator>
)
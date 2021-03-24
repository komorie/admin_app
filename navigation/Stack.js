import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { Image, View} from 'react-native';
import Tabs from './Tabs';
import { normalize } from "../font/constants";
import BranchSelect from "../screens/BranchSelect";
import UserList from "../screens/UserList";
import TimeSelect from "../screens/TimeSelect";
import { vw } from "react-native-viewport-units";
import Login from "../screens/Login";
import AdminManage from "../screens/AdminManage";


const Stack = createStackNavigator();

const mainStack = ({temp, isLoggedIn, branches}) => (
    <Stack.Navigator 
        screenOptions={{
            headerTitle: () => (
                <Image
                    style={{width:vw*39.4, height:vw*8.9}}
                    source={require('../image/내비게이션.png')}
                />
            ),
            headerTitleAlign: 'center'
        }}   
        headerMode="float"
    >   
        <Stack.Screen name="Login" options={{headerShown:null}} component={Login}/>
        <Stack.Screen name="BranchSelect" options={{headerBackTitleVisible: false}} component={BranchSelect}/>
        <Stack.Screen name="Tabs" component={Tabs}/>
        <Stack.Screen name="TimeSelect" component={TimeSelect}/>
        <Stack.Screen name="UserList" component={UserList}/>
        <Stack.Screen name="AdminManage" component={AdminManage}/>
    </Stack.Navigator>
);

export default mainStack;
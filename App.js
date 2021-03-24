import React, { useEffect, useState} from 'react';
import { Image, StatusBar } from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import Stack from "./navigation/Stack";
import { authService } from './fbase';


export default function App() {

  return (
    <>
      <StatusBar barStyle='dark-content' backgroundColor='white'/>
      <NavigationContainer>
        <Stack/>
      </NavigationContainer>
    </>)
}


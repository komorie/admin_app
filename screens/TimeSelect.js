import AsyncStorage from '@react-native-community/async-storage';
import React from 'react';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { dbService } from '../fbase';
import {ENABLED, DISABLED, BOLD, BIG, MARGIN, VERYBIG} from '../font/constants';

const TimeSelect = ({route, navigation}) => {
  const [selected, setSelected] = useState(false);
  const [selectedTime, setSelectedTime] = useState(null);
  const [rNumbers, setRNumbers] = useState({});
  const allTimes = [
    ["10:00", "10:30"],
    ["11:00", "11:30"],
    ["12:00", "12:30"],
    ["13:00", "13:30"],
    ["14:00", "14:30"],
    ["15:00", "15:30"],
    ["16:00", "16:30"],
    ["17:00", "17:30"],
    ["18:00", "18:30"],
    ["19:00", "19:30"],
    ["20:00", "20:30"],
    ["21:00", "21:30"],
    ["22:00", "22:30"],
    ["23:00", "23:30"]
  ]
  const selectedDay = route.params.selectedDay;

  useEffect(() => {
    const ref = dbService.ref(`/rNumber/${'영등포1호점'}/${selectedDay}`)
    ref.on('value', async (snapshot) => {
      let tempMark = {};
      await snapshot.forEach((snap) => {
        tempMark[snap.key] = snap.val();
      })
      setRNumbers(tempMark);
    }, ref.off());
  },[]);

  return(
    <View style={styles.container}>
      <View style={[styles.topBar]}>
        <Text style={styles.topBarText}>시간대 선택</Text>
      </View>
      <View style={styles.times}>
        <ScrollView style={styles.times}>
          {allTimes.map( (data) => {
            return (
              <View style={styles.timeLine}>
                {data.map( (nestData) => {
                  return (
                    <TouchableOpacity 
                      style={[styles.timeItems, {backgroundColor: selectedTime === nestData ? BOLD : 'white'}]}
                      onPress={()=>{
                          setSelected(true);
                          setSelectedTime(nestData);
                      }}
                      activeOpacity={1}
                    >
                      <Text style={[styles.timeText, {color: selectedTime === nestData ? 'white' : BOLD}]}>{nestData}</Text>
                      <Text style={[styles.peopleText, {color: selectedTime === nestData ? 'white' : 'gray'}]}>
                        {rNumbers[nestData] === undefined ? 0 : rNumbers[nestData]}
                      </Text>
                    </TouchableOpacity>
                  )
                })}
              </View>
            )
          })}
        </ScrollView>
      </View>
      <TouchableOpacity  
        style={[styles.selectButton, {backgroundColor: !selected ? DISABLED : ENABLED}]}
        disabled={!selected}
        onPress={() => {
          navigation.navigate("UserList", {selectedDay: selectedDay, selectedTime: selectedTime});
        }}
      >
        <Text style={styles.selectButtonText}>선택하기</Text>
      </TouchableOpacity>
    </View>
  )
}

export default TimeSelect;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0F0'
  },
  topBar: {
    flex: 0.09,
    backgroundColor: ENABLED,
    justifyContent:'center',
    alignItems:'center'
  },
  topBarText: {
    color: 'white',
    fontSize: BIG,
    fontWeight:'bold'
  },
  times: {
    flex: 0.77,
    marginVertical: 5,
    marginHorizontal: 5,
    backgroundColor: '#F0F0F0'
  },
  timeLine: {
    flex: 0.5,
    marginHorizontal: 5,
    marginVertical: 10,
    flexDirection: "row",
    backgroundColor: "#F0F0F0"
  },
  timeItems: {
    backgroundColor: '#FFFFFF',
    flexDirection: "row",
    flex: 0.5,
    padding: MARGIN,
    borderRadius: 5,
    borderColor: BOLD,
    marginHorizontal: 10,
    elevation: 3
  },
  timeText: {
    color: BOLD,
    fontSize:  BIG,
    fontWeight:'bold',
    flex: 0.8,
    textAlign:"center"
  },
  peopleText: {
    color: BOLD,
    fontSize:  BIG,
    fontWeight:'bold',
    flex: 0.2,
    textAlign:"right"
  },
  selectButton: {
    flex: 0.14,
    justifyContent:'center',
    alignItems:'center'
  },
  selectButtonText:{
    color: 'white',
    fontSize: VERYBIG,
    fontWeight:'bold'
  }
});
import React from 'react';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { dbService } from '../fbase';
import {ENABLED, DISABLED, BOLD, BIG, MARGIN, VERYBIG} from '../font/constants';
import AsyncStorage from '@react-native-community/async-storage';

const UserList = ({route, navigation}) => {
  const [selected, setSelected] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [rUsers, setRUsers] = useState([]);
  const selectedDay = route.params.selectedDay;
  const selectedTime = route.params.selectedTime;

  useEffect(()=>{
    AsyncStorage.getItem('user',(error, result) => {
      const tempInfo = JSON.parse(result);
      dbService.ref(`/rUsers/${tempInfo.branchName}/${selectedDay}/${selectedTime}`).once('value', async (snapshot) => {
        let tempMark = [];
        await snapshot.forEach((snap) => {
          tempMark = [...tempMark, snap.val()];
        });
        setRUsers(tempMark);
      });
    });
  },[]);

  return(
    <View style={styles.container}>
      <View style={[styles.topBar]}>
        <Text style={styles.topBarText}>{selectedTime}</Text>
      </View>
      <ScrollView style={styles.lists}>
        {rUsers.map( (data) => {
          return (
            <TouchableOpacity 
              style={[styles.listItems, {backgroundColor: selectedUser === data ? BOLD : 'white'}]}
              onPress={()=>{
                setSelected(true);
                setSelectedUser(data);
              }}
              activeOpacity={1}
            >
              <Text style={[styles.listText, {color: selectedUser === data ? 'white' : BOLD}]}>
                {data.name}  |  {data.phoneNumber}  |  {data.count}
              </Text>
            </TouchableOpacity>
          )
        })}
      </ScrollView>
    </View>
  )
}

export default UserList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0F0'
  },
  topBar: {
    flex: 0.115,
    backgroundColor: ENABLED,
    justifyContent:'center',
    alignItems:'center'
  },
  topBarText: {
    color: 'white',
    fontSize: BIG,
    fontWeight:'bold'
  },
  lists: {
    flex: 0.875,
    marginHorizontal: 5,
    marginVertical: MARGIN,
    backgroundColor: '#F0F0F0'
  },
  listItems: {
    backgroundColor: '#FFFFFF',
    padding: MARGIN*1.2,
    justifyContent: 'center',
    borderRadius: 10,
    borderColor: BOLD,
    marginBottom: MARGIN,
    marginHorizontal: MARGIN,
    elevation: 3
  },
  listText: {
    color: BOLD,
    fontWeight: 'bold',
    fontSize: BIG
  }
});
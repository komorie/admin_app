import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import {Calendar, LocaleConfig} from 'react-native-calendars';
import moment from 'moment';
import {ENABLED, DISABLED, BOLD, NORMAL, MARGIN, VERYBIG} from '../font/constants';
import { ScrollView } from 'react-native-gesture-handler';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-community/async-storage';

LocaleConfig.locales['kr'] = {
  monthNames: ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'],
  monthNamesShort: ['Janv.','Févr.','Mars','Avril','Mai','Juin','Juil.','Août','Sept.','Oct.','Nov.','Déc.'],
  dayNames: ['일요일','월요일','화요일','수요일','목요일','금요일','토요일'],
  dayNamesShort: ['일','월','화','수','목','금','토']
};

LocaleConfig.defaultLocale = 'kr';


const DaySelect = ({navigation, route}) => {
  const [selected, setSelected] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [userInfo, setUserInfo] = useState({});
  const [today, setToday] = useState(moment().format('YYYY-MM-DD'));
  const [maxDate, setMaxDate] = useState(moment().add(3,'months').format('YYYY-MM-DD'));
  const [mark, setMark] = useState({});

  useEffect(()=>{
    setToday(moment().format('YYYY-MM-DD'));
    setMaxDate(moment().add(1,'months').format('YYYY-MM-DD'));
    AsyncStorage.getItem('user', (error, result) => {
      const tempInfo =JSON.parse(result);
      setUserInfo(tempInfo);
    })
  },[]);

  return (
    <View style={styles.container}>
      <View style={[styles.topBar]}>
        <Text style={styles.topBarText}>{userInfo.branchName} 예약관리</Text>
      </View>
      <ScrollView style={styles.calendarView}>       
        <Calendar 
          // Initially visible month. Default = Date()
          style={{borderRadius:10}}
          theme={{
            todayTextColor: '#19b5fe',
            textMonthFontWeight: 'bold',
            textMonthFontSize: NORMAL,
            textDayHeaderFontSize: NORMAL,
            textDayHeaderFontWeight: 'bold',
            textDayFontSize: NORMAL,
            textDayFontWeight: 'bold',
            textDayStyle: {
              color: 'gray'
            },
            textSectionTitleColor: BOLD,
            selectedDayBackgroundColor: BOLD          
          }}
          current={today}
          minDate={today}
          maxDate={maxDate}
          onDayPress={async (day) => {
              setMark({
                [day.dateString]: {selected: true}
              });
              setSelected(true);
              setSelectedDay(day.dateString);
          }}
          
          monthFormat={'yyyy. MM'}
          markingType={'custom'}
          markedDates={mark}
          hideArrows={false}
          renderArrow={(direction) => {
            if(direction === 'left'){
              return <Text>{"<"}</Text>
            }
            if(direction === 'right'){
              return <Text>{">"}</Text>
            }
          }}
          hideExtraDays={true}
          disableMonthChange={true}
          // If firstDay=1 week starts from Monday. Note that dayNames and dayNamesShort should still start from Sunday.
          firstDay={0}
          // Hide day names. Default = false
          hideDayNames={false}
          // Show week numbers to the left. Default = false
          showWeekNumbers={false}
          // Handler which gets executed when press arrow icon left. It receive a callback can go back month
          onPressArrowLeft={subtractMonth => subtractMonth()}
          // Handler which gets executed when press arrow icon right. It receive a callback can go next month
          onPressArrowRight={addMonth => addMonth()}
          // Disable left arrow. Default = false
          disableArrowLeft={false}
          // Disable right arrow. Default = false
          disableArrowRight={false}
          // Disable all touch events for disabled days. can be override with disableTouchEvent in markedDates
          disableAllTouchEventsForDisabledDays={true}
          // Replace default month and year title with custom one. the function receive a date as parameter.
          // Enable the option to swipe between months. Default = false
          enableSwipeMonths={false}
        />
      </ScrollView>
      <TouchableOpacity  
        style={[styles.selectButton, {backgroundColor: !selected ? DISABLED : ENABLED}]}
        disabled={!selected}
        onPress={() => {
            navigation.navigate("TimeSelect", {selectedDay: selectedDay});
        }}
      >
        <Text style={styles.selectButtonText}>선택하기</Text>
      </TouchableOpacity>
    </View>
  )
}

export default DaySelect;

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
    fontSize: NORMAL,
    fontWeight:'bold'
  },  
  calendarView: {
    flex: 0.725,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    margin:MARGIN,
    elevation:5,
    overflow:'scroll'
  },
  selectButton: {
    flex: 0.18,
    justifyContent:'center',
    alignItems:'center'
  },
  selectButtonText:{
      color: 'white',
      fontSize: VERYBIG,
      fontWeight:'bold'
  }
})


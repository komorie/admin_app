import React from 'react';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert} from 'react-native';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import Modal from 'react-native-modal';
import { authService, dbService } from '../fbase';
import { vw, vh } from 'react-native-viewport-units';
import {ENABLED, DISABLED, BOLD, BIG, MARGIN, VERYBIG, SMALL} from '../font/constants';
import AsyncStorage from '@react-native-community/async-storage';

const UserAdmin = ({route, navigation}) => {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [userInfo, setUserInfo] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [modalText, setModalText] = useState("");
  const Menu = [
    "유저등록", "유저삭제", "관리자등록/삭제", "로그아웃"
  ];

  useEffect(()=>{
    AsyncStorage.getItem('user',(error, result) => {
      const tempInfo = JSON.parse(result);
      setUserInfo(tempInfo);
    });
  },[]);

  const userIn = (name, phoneNumber) => {
    dbService.ref(`/Users/${userInfo.branchName}/${name}-${phoneNumber}`).set({
      name: name,
      phoneNumber: phoneNumber
    }).then((result) => {
      setModalVisible(false);
      Alert.alert("등록이 완료되었습니다.", "", [{text: "확인"}]);
    }).catch((error) => {
      setModalVisible(false);
      Alert.alert("오류가 발생했습니다. 다시 시도해 주세요.", "", [{text: "확인",
        onPress: () => {navigation.navigate("Tabs");}
      }]);
    });
  };

  const userOut = (name, phoneNumber) => {
    dbService.ref(`/Users/${userInfo.branchName}/${name}-${phoneNumber}`).set(null).then((result) => {
      setModalVisible(false);
      Alert.alert("삭제가 완료되었습니다.", "", [{text: "확인"}]);
    }).catch((error) => {
      setModalVisible(false);
      Alert.alert("오류가 발생했습니다. 다시 시도해 주세요.", "", [{text: "확인",
        onPress: () => {navigation.navigate("Tabs");}
      }]);
    });
  }

  const finalAlert = () => {
    Alert.alert(`${name}, ${phoneNumber} 이 정보가 맞습니까?`, "", [
      {text: '아니오',
        onPress: () => {
          setName("");
          setPhoneNumber("");
          setModalVisible(false);
        }
      },
      {text: '예', 
        onPress: () => {
          setName("");
          setPhoneNumber("");
          if(modalText === "등록할 회원의 이름과 전화번호를 입력해주세요"){
            userIn(name, phoneNumber);
          }
          else {
            userOut(name, phoneNumber);
          }
        }   
      }
    ]);
  }

  return(
    <View style={styles.container}>
      <Modal
        isVisible={modalVisible}
        style={{flex:1}}
      >
        <View style={styles.modal}>
          <View style={styles.modalHead}>
            <Text style={styles.modalText}>{modalText}</Text>
          </View>
          <View style={styles.modalMiddle}>
          <View style={styles.textView}>
        <Text style={styles.textViewText}>이름</Text>
        <TextInput
          style={styles.textViewInput}
          value={name}
          onChangeText={(text) => setName(text)}
          placeholder="이름을 입력해주세요"
        />
      </View>
      <View style={styles.textView}>
        <Text style={styles.textViewText}>전화번호</Text>
        <TextInput
          style={styles.textViewInput}
          value={phoneNumber}
          onChangeText={(text) => setPhoneNumber(text)}
          placeholder="'-' 없이 번호만 입력"
        />
      </View>
          </View>
          <View style={styles.modalBottom}>
            <TouchableOpacity 
              style={styles.bottomButton}
              onPress={()=>{
                setName("");
                setPhoneNumber("");
                setModalVisible(false);
              }}
            >
              <Text style={styles.bottomText}>취소</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.bottomButton}
              disabled={!(name && phoneNumber)}
              onPress={()=>{                
                finalAlert();
              }}
            >
              <Text style={styles.bottomText}>확인</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <View style={[styles.topBar]}>
        <Text style={styles.topBarText}>사용자 관리</Text>
      </View>
      <View style={styles.lists}>
        <ScrollView style={styles.lists}>
          {Menu.map( (data) => {
            return (
              <TouchableOpacity 
                style={styles.listItems}
                onPress={()=> {
                  if(data === "유저등록") {
                    setModalText("등록할 회원의 이름과 전화번호를 입력해주세요");
                    setModalVisible(true);
                  }
                  else if(data === "유저삭제") {
                    setModalText("삭제할 회원의 이름과 전화번호를 입력해주세요");
                    setModalVisible(true);
                  }
                  else if(data === "로그아웃"){
                    authService.signOut();
                    navigation.reset({
                      index:0,
                      routes: [{name: 'Login'}],
                    });
                  }
                  else {
                    navigation.navigate("AdminManage");
                  }
                }}
              >
                <Text style={styles.listText}>{data}</Text>
              </TouchableOpacity>
            )
          })}
        </ScrollView>
      </View>
    </View>
  )
}

export default UserAdmin;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0F0'
  },
  modal: {
    height: vh*60,
    width: vw*90,
    backgroundColor: '#F0F0F0',
    borderRadius: 2,
    padding: MARGIN*1.5
  },
  modalHead:{
    flex: 0.3
  },
  modalText:{
    color: 'black',
    fontSize: VERYBIG
  },
  modalMiddle:{
    flex: 0.5,
    paddingBottom: MARGIN
  },
  textView: {
    borderColor: DISABLED,
    marginHorizontal: MARGIN/2,
    flexDirection: "row",
    borderBottomWidth: 1,
    borderRadius: 5,
    marginBottom: MARGIN
  },
  textViewText: {
    color: "#6c6c6c",
    flex: 0.3,
    textAlignVertical: "center",
    fontSize: SMALL,
  },
  textViewInput: {
    color: "#6c6c6c",
    flex: 0.7,
    fontSize: SMALL,
    paddingVertical: vw*2.1,
    textAlignVertical: "center"
  },
  modalBottom:{
    flex: 0.2,
    flexDirection:'row',
    justifyContent: 'flex-end',
    alignItems:'center'
  },
  bottomButton: {
    flex: 0.5,
    alignItems:'center',
    justifyContent: 'center'
  },
  bottomText: {
    fontSize: SMALL,
    fontWeight: 'bold',
    color: BOLD,
    alignItems:'center'
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
  lists: {
    flex: 0.81,
    marginVertical: 10,
    marginHorizontal: 5,
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
    fontSize:  BIG,
    fontWeight:'bold',
    textAlign:"center"
  }
});
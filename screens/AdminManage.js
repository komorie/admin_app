import AsyncStorage from '@react-native-community/async-storage';
import React from 'react';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert} from 'react-native';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import { authService, dbService } from '../fbase';
import {ENABLED, DISABLED, BOLD, BIG, MARGIN, VERYBIG, SMALL, NORMAL} from '../font/constants';
import { vw, vh } from 'react-native-viewport-units';
import Modal from "react-native-modal";
import { auth } from 'firebase';

const AdminManage = ({route, navigation}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [userInfo, setUserInfo] = useState({});
  const [radmins, setRAdmins] = useState({});
  const [madmins, setMAdmins] = useState([]);
  const [vadmins, setVAdmins] = useState([]);
  const [selected, setSelected] = useState(false);
  const [morv, setMorv] = useState("");
  const [modalText, setModalText] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedA, setSelectedA] = useState(null);
  const [refresh, setRefresh] = useState(0);


  const adminIn = async (what) => {
    let newRef;
    if(what === "M"){
      if(authService.currentUser.email === radmins.email && madmins.length < 1){
        newRef = await dbService.ref(`/mAdmin/${userInfo.branchName}`);
      }
      else{
        Alert.alert("권한이 없거나 관리자 수가 너무 많습니다.", "", [{text: "확인"}]);
        return;
      }
    }
    else {
      if(authService.currentUser.email === madmins[0]?.email || authService.currentUser.email === radmins.email){
        newRef = await dbService.ref(`/vAdmin/${userInfo.branchName}`).push();
      }
      else{
        Alert.alert("권한이 없습니다.", "", [{text: "확인"}]);
        return;
      }
    }
    newRef.set({
      name: name,
      email: email,
      key: newRef.key
    }).then((result) => {
      setModalVisible(false);
      setSelected(false);
      setRefresh(refresh+1);
      Alert.alert("등록이 완료되었습니다.", "", [{text: "확인"}]);
    }).catch((error) => {
      setModalVisible(false);
      setSelected(false);
      setRefresh(refresh+1);
      Alert.alert("권한이 없습니다.", "", [{text: "확인"}]);
    });

  };


  const adminOut = () => {
    if(morv === "M") {
      console.log(authService.currentUser)
      if(authService.currentUser.email === radmins.email){
        console.log('dsd')
        Alert.alert("정말로 삭제하시겠습니까?","", [{text:"아니오"}, {text: 
          "예",
          onPress: async () => {
            let ref = await dbService.ref(`/mAdmin/${userInfo.branchName}`);
            ref.remove().then((result) => {
              setModalVisible(false);
              setSelected(false);
              console.log('dsds');
              Alert.alert("삭제가 완료되었습니다.", "", [{text: "확인", onPress: setRefresh(refresh+1)}]);
            }).catch((error) => {
              setModalVisible(false);
              setSelected(false);
              Alert.alert("권한이 없습니다.", "", [{text: "확인", onPress: setRefresh(refresh+1)}]);
            });
          }    
        }]);
      }
      else{
        Alert.alert("권한이 없습니다.", "", [{text: "확인"}]);
      }
    }
    else{
      if(authService.currentUser.email === madmins[0]?.email || authService.currentUser.email === radmins.email){
        Alert.alert("정말로 삭제하시겠습니까?","", [{text:"아니오"}, {text: 
          "예",
          onPress: async () => {
            let ref = await dbService.ref(`/vAdmin/${userInfo.branchName}/${selectedA.key}`);
            ref.remove().then((result) => {
              setModalVisible(false);
              setSelected(false);
              Alert.alert("삭제가 완료되었습니다.", "", [{text: "확인", onPress: setRefresh(refresh+1)}]);
            }).catch((error) => {
              setModalVisible(false);
              setSelected(false);
              Alert.alert("오류가 발생했습니다. 다시 시도해 주세요.", "", [{text: "확인", onPress: setRefresh(refresh+1)}]);
            });
          }    
        }]);
      }
      else{
        Alert.alert("권한이 없습니다.", "", [{text: "확인"}]);
      }
    }
  }

  const finalAlert = () => {
    if(modalText === '주관리자') {
      Alert.alert(`${name}, ${email} 를 ${modalText}로 등록하시겠습니까?`, "", [
        {text: '아니오'},
        {text: '예', 
          onPress: () => {
            setName("");
            setEmail("");
            adminIn('M');
          }   
        }
      ]);
    }
    else if (modalText === "부관리자"){
      Alert.alert(`${name}, ${email} 를 ${modalText}로 등록하시겠습니까?`, "", [
        {text: '아니오'},
        {text: '예', 
          onPress: () => {
            setName("");
            setEmail("");
            adminIn('V');
          }   
        }
      ]);
    }
    setModalText("");
  }

  useEffect(() => {
    AsyncStorage.getItem('user',(error, result) => {
      const tempInfo = JSON.parse(result);
      setUserInfo(tempInfo);
      dbService.ref(`/rAdmin`).once('value').then(async (snapshot) => {
        const data = snapshot.toJSON();
        setRAdmins(data);
      });
      dbService.ref(`/mAdmin/${tempInfo.branchName}`).once('value').then(async (snapshot) => {
        let tempMark = [];
        if(snapshot.val() !== null){
          tempMark.push(snapshot.val());
        }
        setMAdmins(tempMark);
      });
      dbService.ref(`/vAdmin/${tempInfo.branchName}`).once('value').then(async (snapshot) => {
        let tempMark = [];
        await snapshot.forEach((snap) => {
          tempMark.push(snap.val());
        })
        setVAdmins(tempMark);
      });
    });
  },[refresh]);

  return(
    <View style={styles.container}>
      <Modal
        isVisible={modalVisible}
        style={{flex:1}}
      >
        <View style={styles.modal}>
          <View style={styles.modalHead}>
            <Text style={styles.modalText}>등록할 관리자명과 이메일을 입력해주세요.</Text>
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
              <Text style={styles.textViewText}>이메일</Text>
              <TextInput
                style={styles.textViewInput}
                value={email}
                onChangeText={(text) => setEmail(text)}
                placeholder="이메일을 입력해주세요"
              />
            </View>
            <View style={styles.middleButtons}>
              <TouchableOpacity 
                style={[styles.bottomButton, {backgroundColor: modalText === "주관리자" ? ENABLED : null}]}
                disabled={!(name && email)}
                onPress={()=>{      
                  setModalText("주관리자");
                }}
              >
                <Text style={styles.bottomText}>주관리자</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.bottomButton, {backgroundColor: modalText === "부관리자" ? ENABLED : null}]}
                disabled={!(name && email)}
                onPress={()=>{                 
                  setModalText("부관리자");
                }}
              >
                <Text style={styles.bottomText}>부관리자</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.modalBottom}>
            <TouchableOpacity 
              style={styles.bottomButton}
              onPress={()=>{
                setName("");
                setEmail("");
                setModalText("");
                setModalVisible(false);
              }}
            >
              <Text style={styles.bottomText}>취소</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.bottomButton}
              disabled={modalText === ""}
              onPress={()=>{
                setName("");
                setEmail("");
                finalAlert();
              }}
            >
              <Text style={styles.bottomText}>확인</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <View style={[styles.topBar]}>
        <Text style={styles.topBarText}>관리자 명단</Text>
      </View>
      <View style={styles.admins}>
        <ScrollView style={styles.admins}>
          {madmins.map( (data) => {
            return (
              <TouchableOpacity 
                style={[styles.adminItems, {backgroundColor: selectedA === data ? BOLD : 'white'}]}
                onPress={()=>{
                    setSelected(true);
                    setSelectedA(data);
                    setMorv("M");
                }}
                activeOpacity={1}
              >
                <Text style={[styles.nameText, {color: selectedA === data ? 'white' : BOLD}]}>{data.name} (주관리자)</Text>
                <Text style={[styles.emailText, {color: selectedA === data ? 'white' : 'gray'}]}>
                  {data.email}
                </Text>
              </TouchableOpacity>
            )
          })}
          {vadmins.map( (data) => {
            return (
              <TouchableOpacity 
                style={[styles.adminItems, {backgroundColor: selectedA === data ? BOLD : 'white'}]}
                onPress={()=>{
                    setSelected(true);
                    setSelectedA(data);
                    setMorv("V");
                }}
                activeOpacity={1}
              >
                <Text style={[styles.nameText, {color: selectedA === data ? 'white' : BOLD}]}>{data.name}</Text>
                <Text style={[styles.emailText, {color: selectedA === data ? 'white' : 'gray'}]}>
                  {data.email}
                </Text>
              </TouchableOpacity>
            )
          })}
        </ScrollView>
      </View>
      <View style={styles.selectView}>
        <TouchableOpacity  
          style={[styles.selectButton, {backgroundColor: ENABLED}]}
          onPress={() => {
            setModalVisible(true);
          }}
        >
          <Text style={styles.selectButtonText}>등록하기</Text>
        </TouchableOpacity>
        <TouchableOpacity  
          style={[styles.selectButton, {backgroundColor: selected ? ENABLED : DISABLED}]}
          disabled={!selected}
          onPress={() => {
            adminOut();
          }}
        >
          <Text style={styles.selectButtonText}>삭제하기</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default AdminManage;

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
  middleButtons: {
    flexDirection:'row',
    justifyContent:'center',
    alignContent:'center'
  },
  morv: {
    borderColor: DISABLED,
    marginHorizontal: MARGIN/2,
    flexDirection: "row",
    marginVertical: MARGIN
  },
  morvButton: {
    flex: 0.5,
    justifyContent:'center',
    alignItems:'center'
  },
  morvButtonText: {
    fontSize: SMALL
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
    padding: vw,
    borderRadius: 5
  },
  bottomText: {
    fontSize: BIG,
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
  admins: {
    flex: 0.77,
    marginVertical: 5,
    marginHorizontal: 5,
    backgroundColor: '#F0F0F0'
  },
  adminItems: {
    backgroundColor: '#FFFFFF',
    flex: 0.5,
    padding: MARGIN,
    marginBottom: MARGIN,
    borderRadius: 5,
    borderColor: BOLD,
    marginHorizontal: 10,
    elevation: 3
  },
  nameText: {
    color: BOLD,
    fontSize:  BIG,
    fontWeight:'bold',
    flex: 0.5
  },
  emailText: {
    color: BOLD,
    fontSize:  BIG,
    fontWeight:'bold',
    flex: 0.5
  },
  selectView: {
    flex: 0.14,
    flexDirection:'row'
  },
  selectButton: {
    flex: 0.5,
    justifyContent:'center',
    alignItems:'center'
  },
  selectButtonText:{
    color: 'white',
    fontSize: VERYBIG,
    fontWeight:'bold'
  }
});
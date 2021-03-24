import React, { useEffect, useState} from 'react';
import { StyleSheet, Text, TextInput, View, Image, TouchableOpacity, Alert } from 'react-native';
import { ENABLED, DISABLED, NORMAL, VERYBIG, MARGIN, SMALL, BOLD } from '../font/constants';
import AsyncStorage from '@react-native-community/async-storage';
import { vh, vw } from 'react-native-viewport-units';
import {authService, firebaseInstance} from "../fbase";


const Login = ({navigation}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passCon, setPassCon] = useState("");
  const [register, setRegister] = useState(false);


  const buttonStyle = (style, state) => {
    return [style, state ? { backgroundColor: DISABLED } : { backgroundColor: ENABLED }]
  }


  const reset = () => {
    setEmail("");
    setPassword("");
    setPassCon("");
  }

  const LogIn = async () => {
    reset();
    try {
      authService.signOut();
    }
    catch{

    }
    try {
      await authService.signInWithEmailAndPassword(
        email.trim(), password
      );
    }
    catch(error) {
      Alert.alert("이메일이나 비밀번호가 일치하지 않습니다.","",[{text:'확인'}]);
    }
  };

  const Sign = async () => {
    reset();
    if(password === passCon){
      try {
        await authService.createUserWithEmailAndPassword(
          email.trim(), password
        );
        Alert.alert("회원가입에 성공하였습니다.","",[{text:'확인'}]);
      }
      catch(error) {
        Alert.alert(`${error}`,"",[{text:'확인'}]);
      }
    }
    else {
      Alert.alert("비밀번호를 다시 확인해주세요.","",[{text:'확인'}]);
    }
  };
  
  
  useEffect(()=> {
    authService.onAuthStateChanged((user) => {
      if (user) {
        navigation.navigate({name: 'BranchSelect'});
      }
    });
  }, []);


  return (
    <View style={styles.container}>
      <Image style={styles.logo} source={require("../image/메인.png")}></Image>
      <Image style={styles.logoText} source={require("../image/로고글자.png")}></Image>
      <View style={styles.loginSelect}>
        <TouchableOpacity
          onPress={() => {
            reset();
            setRegister(false);
          }}
        >
          <Text style={[styles.loginSelectText, {color: BOLD}]}>로그인</Text>
        </TouchableOpacity>
        <Text style={[styles.loginSelectText, {color: BOLD}]}> / </Text>
        <TouchableOpacity
          onPress={() => {
            reset();
            setRegister(true);
          }}
        >
          <Text style={[styles.loginSelectText, {color: ENABLED}]}>회원가입</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.textView}>
        <Text style={styles.textViewText}>이메일</Text>
        <TextInput
          style={styles.textViewInput}
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
      </View>
      <View style={styles.textView}>
        <Text style={styles.textViewText}>비밀번호</Text>
        <TextInput
          style={styles.textViewInput}
          value={password}
          secureTextEntry={true}
          onChangeText={(text) => setPassword(text)}
        />
      </View>
      {register ? 
      <View style={styles.textView}>
        <Text style={[styles.textViewText, {flex: 0.4}]}>비밀번호 확인</Text>
        <TextInput
          style={styles.textViewInput}
          value={passCon}
          secureTextEntry={true}
          onChangeText={(text) => setPassCon(text)}
        />
      </View> : <></>}
      <TouchableOpacity
        style={buttonStyle(styles.loginButton, !(email && password))}
        disabled={!(email && password)}
        onPress={register ? () => Sign() : () => LogIn()}
      >
        <Text style={styles.loginText}>{register ? "회원가입" : "로그인"}</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  logo: {
    width: vw*33,
    height: vw*33
  },
  logoText: {
    width: vw*39,
    height: vw*7,
    marginTop: vh*2,
  },
  loginSelect: {
    flexDirection: 'row',
    marginVertical: vh*4
  },
  loginSelectText: {
    fontSize: VERYBIG*1.2,
    fontWeight: 'bold',
    color: 'black'
  },
  textView: {
    borderColor: DISABLED,
    marginHorizontal: MARGIN,
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: MARGIN
  },
  textViewText: {
    color: "#6c6c6c",
    flex: 0.3,
    textAlignVertical: "center",
    fontSize: SMALL,
    paddingHorizontal: vw*2
  },
  textViewInput: {
    color: "#6c6c6c",
    flex: 0.7,
    fontSize: SMALL,
    paddingVertical: vw*2.1,
    textAlignVertical: "center"
  },
  loginButton: {
    flexDirection: 'row',
    padding: VERYBIG,
    marginTop: vh*5
  },
  loginText: {
    flex: 1,
    textAlign: "center",
    fontSize: VERYBIG,
    fontWeight: "bold",
    color: "white"
  }
});

export default Login;


  // const [verificationId, setVerificationId] = useState(null);
  // const firebaseConfig = firebaseInstance.apps.length ? firebaseInstance.app().options : undefined;
  // const recaptchaVerifier = useRef(null);
  // const attemptInvisibleVerification = false;



  // const verify = async () => {
  //   try{
  //     console.log("11");
  //     const phoneProvider = new firebaseInstance.auth.PhoneAuthProvider();
  //     const verificationId = await phoneProvider.verifyPhoneNumber(
  //       `+82 ${phoneNumber}`,
  //       recaptchaVerifier.current
  //     );
  //     console.log("11");
  //     setVerificationId(verificationId);
  //     Alert.alert("인증번호가 발송되었습니다.");        
  //     setVeriSend(true);
  //   } 
  //   catch (error) {
  //     console.log(error);
  //     Alert.alert("오류가 발생했습니다.\n다시 시도해 주세요.");      
  //   }
  // }


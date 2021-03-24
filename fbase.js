import firebase from 'firebase';
import "firebase/auth";
import "firebase/firebase-database";

const firebaseConfig = {
  apiKey:"AIzaSyAh1bMs733sOoU1Xqf2cEFBeuM9lTBJxWM",
  authDomain: "reservationapp-40925.firebaseapp.com",
  databaseURL: "https://reservationapp-40925-default-rtdb.firebaseio.com",
  projectId: "reservationapp-40925",
  storageBucket: "reservationapp-40925.appspot.com",
  messagingSenderId: "90495692502",
  appId: "1:90495692502:web:7aca634dc03bf1e91d6377",
  measurementId: "G-964H01PXNH"
};

try {
  firebase.initializeApp(firebaseConfig);
}
catch (e) {
  
}

export const firebaseInstance = firebase;
export const authService = firebase.auth();
export const dbService = firebase.database();


import Firebase from 'firebase';  

// const firebaseConfig = {
//   apiKey: "AIzaSyBQyTWi-qNkZs9weSdSeJ4_hywGDf6m-X8",
//   authDomain: "bongomeals-afcd8.firebaseapp.com",
//   databaseURL: "https://bongomeals-afcd8-default-rtdb.firebaseio.com",
//   projectId: "bongomeals-afcd8",
//   storageBucket: "bongomeals-afcd8.appspot.com",
//   messagingSenderId: "1056868103431",
//   appId: "1:1056868103431:web:d3618520ec6ccb6c3041a2",
//   measurementId: "G-G8BG2GJT6B"
// };

const firebaseConfig = {
  apiKey: "AIzaSyA5FzfchQgIqRbt61ceXmusOXxjbuXbsmA",
  authDomain: "bongofood-dfce7.firebaseapp.com",
  databaseURL: "https://bongofood-dfce7-default-rtdb.firebaseio.com",
  projectId: "bongofood-dfce7",
  storageBucket: "bongofood-dfce7.appspot.com",
  messagingSenderId: "470706299814",
  appId: "1:470706299814:web:e2dce6ad9307b9ab286567"
};
  
let app = Firebase.initializeApp(firebaseConfig);  
export const fb = app.database(); 

const firebaseConfig = {
    apiKey: "AIzaSyB34CBmhBrt1hmueKsrROLGiJxiZgHMTBc",
    authDomain: "crowd-clip-todo-b946d.firebaseapp.com",
    databaseURL: "https://crowd-clip-todo-b946d-default-rtdb.firebaseio.com",
    projectId: "crowd-clip-todo-b946d",
    storageBucket: "crowd-clip-todo-b946d.appspot.com",
    messagingSenderId: "488883851193",
    appId: "1:488883851193:web:08eeea14be43bdfa953068"
  };

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();


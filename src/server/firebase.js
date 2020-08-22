import firebase from 'firebase';

import 'firebase/auth';
import 'firebase/storage';
import 'firebase/database';

var firebaseConfig = {
    apiKey: "AIzaSyDKe-5pwBhlvvd2HJKRp4DH18CRnzV5dFc",
    authDomain: "slack-react-clone-aeccf.firebaseapp.com",
    databaseURL: "https://slack-react-clone-aeccf.firebaseio.com",
    projectId: "slack-react-clone-aeccf",
    storageBucket: "slack-react-clone-aeccf.appspot.com",
    messagingSenderId: "1084354106642",
    appId: "1:1084354106642:web:d4c03a58560b18b777cfcb",
    measurementId: "G-1PY3HXZKQD"
  };

  firebase.initializeApp(firebaseConfig);
  firebase.analytics();

  export default firebase;
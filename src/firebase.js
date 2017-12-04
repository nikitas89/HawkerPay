import firebase from 'firebase'
var config = {
   apiKey: "AIzaSyCWoUJncY8nVo4nFvH2VUSeMXZCWGJk_YE",
   authDomain: "hawker-app-sg.firebaseapp.com",
   databaseURL: "https://hawker-app-sg.firebaseio.com",
   projectId: "hawker-app-sg",
   storageBucket: "hawker-app-sg.appspot.com",
   messagingSenderId: "33751670663"
 };
// var config = {
//    apiKey: "AIzaSyAyXEaQfr8GQ2wVc6xc5TTkiKw7qBJVfHk",
//    authDomain: "hawker-51e69.firebaseapp.com",
//    databaseURL: "https://hawker-51e69.firebaseio.com",
//    projectId: "hawker-51e69",
//    storageBucket: "hawker-51e69.appspot.com",
//    messagingSenderId: "609926828771"
//  }
 firebase.initializeApp(config);

export default firebase

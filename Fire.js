import * as firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyAINOEYNv_5BfP1WnpXnZkDCUc8TDvTM9k",
    authDomain: "delivow.firebaseapp.com",
    databaseURL: "https://delivow.firebaseio.com",
    projectId: "delivow",
    storageBucket: "delivow.appspot.com",
    messagingSenderId: "890985068857",
    appId: "1:890985068857:web:b6fcf7b3f17a0e2ddc90e8",
    measurementId: "G-RS6QLBY2YP"
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
export default firebase;

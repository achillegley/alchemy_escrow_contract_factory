import firebase from 'firebase/compat/app';
import 'firebase/compat/database';


// Initialize Firebase with your project's configuration
const firebaseConfig = {
    apiKey: "AIzaSyDHllv9xOOgaWOKsHmc3ZsIIaQjVx4WdSg",
    authDomain: "escrow-1c65f.firebaseapp.com",
    databaseURL: "https://escrow-1c65f-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "escrow-1c65f",
    storageBucket: "escrow-1c65f.appspot.com",
    messagingSenderId: "1046751468096",
    appId: "1:1046751468096:web:fc040ecf22907a9fbf1da5",
    measurementId: "G-PTV34QN0VH"
};
firebase.initializeApp(firebaseConfig);

// Access Firestore instance
export const db = firebase.database();

// Use db to perform database operations (e.g., CRUD operations on your Escrow collection)
// ...

// Render your React.js components
// ...

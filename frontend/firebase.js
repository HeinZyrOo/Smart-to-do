import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";//initializeApp → starts Firebase
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";//getFirestore → gets the database service

const firebaseConfig = {    //Connect to THIS specific Firebase project
  apiKey: "AIzaSyCUXMEmLQokJyTmJfB6EyQBJB3QCGv2h0",
  authDomain: "smart-to-do-7075a.firebaseapp.com",
  projectId: "smart-to-do-7075a",
  storageBucket: "smart-to-do-7075a.firebasestorage.app",
  messagingSenderId: "713207662398",
  appId: "1:713207662398:web:81e0e2fbf80972c09b4e6f"
};

const app = initializeApp(firebaseConfig);  //Starts Firebase using config,Creates a Firebase app instance
const db = getFirestore(app);  //Connects to Firestore (database)

export { db }; //allow other files to use it
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import {getAuth, onAuthStateChanged, signOut} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import{getFirestore, setDoc, doc, getDoc}  from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBNGdPWISw803XD8xVo0RyCGoGpNX8o_jM",
    authDomain: "dpointslogin.firebaseapp.com",
    projectId: "dpointslogin",
    storageBucket: "dpointslogin.firebasestorage.app",
    messagingSenderId: "486203348613",
    appId: "1:486203348613:web:a22083bc80b9326bc73bec"
  };
 
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  const auth = getAuth();
  const db = getFirestore();

  onAuthStateChanged(auth, (user) => {
    const loggedInUserId = localStorage.getItem('loggedInUserId');
    if (loggedInUserId) {
        console.log(user);
        const docRef = doc(db, "users", loggedInUserId);
        getDoc(docRef)
        .then((docSnap) => {
            if (docSnap.exists()) {
                const userData = docSnap.data();
                document.getElementById('loggedUserFName').innerText = userData.firstName;
                document.getElementById('loggedUserEmail').innerText = userData.email;
                document.getElementById('loggedUserLName').innerText = userData.lastName;
            } else {
                console.log("no document found matching id");
                // BEGIN: Add user data if document does not exist
                const newUserData = {
                    firstName: user.displayName.split(" ")[0],
                    lastName: user.displayName.split(" ")[1],
                    email: user.email
                };
                setDoc(docRef, newUserData)
                .then(() => {
                    console.log("User data saved successfully!");
                })
                .catch((error) => {
                    console.error("Error saving user data:", error);
                });
                // END: Add user data if document does not exist
            }
        })
        .catch((error) => {
            console.log("Error getting document");
        });
    } else {
        console.log("User Id not Found in Local storage");
    }
  });

  const logoutButton = document.getElementById('logout');

  logoutButton.addEventListener('click', () => {
    localStorage.removeItem('loggedInUserId');
    signOut(auth)
    .then(() => {
        window.location.href = 'index.html';
    })
    .catch((error) => {
        console.error('Error Signing out:', error);
    });
  });

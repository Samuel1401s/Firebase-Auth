import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js"; 

const firebaseConfig = {
  apiKey: "AIzaSyCvYfuv8odcXKLuPumUX3_5zOoEk8yzLVk",
  authDomain: "fir-auth-92831.firebaseapp.com",
  databaseURL: "https://fir-auth-92831-default-rtdb.firebaseio.com",
  projectId: "fir-auth-92831",
  storageBucket: "fir-auth-92831.firebasestorage.app",
  messagingSenderId: "842393929614",
  appId: "1:842393929614:web:7edf80a07007614ccd86df"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app); 
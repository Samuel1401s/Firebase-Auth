import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyCvYfuv8odcXKLuPumUX3_5zOoEk8yzLVk",
  authDomain: "fir-auth-92831.firebaseapp.com",
  
  projectId: "fir-auth-92831",
  storageBucket: "fir-auth-92831.appspot.com",
  messagingSenderId: "842393929614",
  appId: "1:842393929614:web:7edf80a07007614ccd86df"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };

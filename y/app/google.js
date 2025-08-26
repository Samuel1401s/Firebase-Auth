import { GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
import { showmsg } from "./mensajes.js";
import { auth, db } from "./firebase.js";  
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

const googlebut = document.querySelector("#googlelog");

googlebut.addEventListener("click", async () => {
    const provider = new GoogleAuthProvider();

    try {
        const googl = await signInWithPopup(auth, provider);
        const user = googl.user;
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        const modal = bootstrap.Modal.getInstance(document.querySelector("#sesionform"));
        if (userSnap.exists()) {
            await setDoc(userRef, {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName || null,
                photoURL: user.photoURL || null,
                lastLogin: new Date(),
                rol: "user"
            }, { merge: true });
        } else {
            await setDoc(userRef, {
                lastLogin: new Date()
            }, { merge: true });
        }
        modal.hide();
        showmsg("Bienvenido " + user.displayName, "bien");


    } catch (error) {
        console.log(error);
    }
});

import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";
import { showmsg } from "./mensajes.js";
import { auth, db } from "./firebase.js";

const sesionForm = document.querySelector("#sesionform");
const googlebut = document.querySelector("#googlelog");


sesionForm.addEventListener("submit", async e => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log(userCredential.user);

        const iniciomodal = document.querySelector('#iniciomodal');
        if (document.activeElement) document.activeElement.blur();
        requestAnimationFrame(() => {
            let modal = bootstrap.Modal.getInstance(iniciomodal);
            if (modal) {
                modal.hide();
                showmsg("Inicio de sesion exitoso. Bienvenido " + userCredential.user.email, 'bien');
            } else {
                const closeBtn = iniciomodal.querySelector('[data-bs-dismiss="modal"]');
                if (closeBtn) closeBtn.click();
            }

            const exitoModal = new bootstrap.Modal(document.getElementById('exitoModal'));
            exitoModal.show();
            document.getElementById('btnAceptarExito').onclick = () => {
                exitoModal.hide();
                window.location.href = "./app/pag2.html";
            };
        });
    } catch (error) {
        console.log(error.message);
        console.log(error.code);
        if (error.code === 'auth/user-not-found') {
            showmsg("El usuario no existe. Por favor, verifica tu correo.", 'a');
        } else if (error.code === 'auth/wrong-password') {
            showmsg("Contrasena incorrecta. Por favor, intenta nuevamente.", 'a');
        } else if (error.code === 'auth/invalid-email') {
            showmsg("El correo electronico ingresado no es valido. Por favor, verifica tu correo.", 'a');
        } else if (error.code === 'auth/invalid-credential') {
            showmsg("Credenciales invalidas. Por favor, verifica tu correo y contrasena.", 'a');
        } else {
            showmsg("Error de inicio de sesion: " + error.message, 'a');
        }
    }
});

googlebut.addEventListener("click", async () => {
    const provider = new GoogleAuthProvider();

    try {
        const googl = await signInWithPopup(auth, provider);
        console.log(googl);

        const user = googl.user;
        const userRef = doc(db, "users", user.uid);

        await setDoc(userRef, {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            lastLogin: new Date()
        }, { merge: true });

        const modal = bootstrap.Modal.getInstance(document.querySelector("#iniciomodal"));
        modal.hide();
        showmsg("Bienvenido " + user.displayName, "bien");
        window.location.href = "./app/pag2.html";

    } catch (error) {
        console.log(error);
        if (error.code === 'auth/popup-closed-by-user') {
            showmsg("Inicio de sesion con Google cancelado.", "a");
        } else if (error.code === 'auth/cancelled-popup-request') {
            showmsg("Ya hay una ventana de inicio de sesion abierta.", "a");
        } else if (error.code === 'auth/auth-domain-config-required') {
            showmsg("Error de configuracion de dominio en Firebase. Revisa los dominios autorizados.", "a");
        } else {
            showmsg("Error al iniciar sesion con Google: " + error.message, "a");
        }
    }
});
const olvidar =document.getElementById("olvidar")
olvidar.addEventListener("click", function(event){
event.preventDefault()
const email= document.getElementById("email").value;
sendPasswordResetEmail(auth, email)
.then(()=>{
    showmsg("email sent")
})
.catch((error)=>{
    const errorCode=error.code;
    const errorMessage =error.message;
    console.log (errorCode, errorMessage)
})


})





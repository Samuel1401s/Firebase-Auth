import { signOut } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
import { auth } from "./firebase.js";
const afuera = document.querySelector("#logout-link");
export {signOut}


afuera.addEventListener("click", async () => {
    await signOut(auth)
    console.log("Usuario desconectado");
    

});

import { GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
import { showmsg } from "./mensajes.js";
import { auth } from "./firebase";
const googlebut =document.querySelector("#googlelog")
googlebut.addEventListener("click", async ()  => {
   const provider =new GoogleAuthProvider()
   
   try {
    const googl= await signInWithPopup(auth, provider)
    console.log (googl)

    const modal =bootstrap.Modal.getInstance(document.querySelector("#sesionform"))
    modal.hide()
    showmsg("bienvenido"+googl.user.displayname, "bien"  )

   } catch (error) {
    console.log(error)
    
   }


})
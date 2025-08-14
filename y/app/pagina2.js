import { auth } from "./firebase.js";
import { sendEmailVerification } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
import { signOut } from "./afuera.js";
import { showmsg } from "./mensajes.js";

import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";

const verifyBtn = document.getElementById("verify");
const logoutLink = document.getElementById("logout-link");
const modalElement = document.getElementById('verifyEmailModal');
const encuestaForm = document.getElementById("encuestaForm");

let modal;
if (modalElement) {
  modal = new bootstrap.Modal(modalElement);
}

verifyBtn?.addEventListener("click", () => {
  if (modal) {
    modal.show();
  }
});

logoutLink?.addEventListener("click", () => {
  signOut();
});

document.getElementById("enviarCorreo")?.addEventListener("click", async () => {
  if (auth.currentUser) {
    try {
      await sendEmailVerification(auth.currentUser);
      showmsg("Correo de verificación enviado", "bien");
      if (modal) modal.hide();
    } catch (error) {
      showmsg(error.message, "mal");
    }
  }
});

encuestaForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  console.log("Usuario actual:", auth.currentUser);
console.log("Email:", auth.currentUser?.email);
console.log("¿Email verificado?", auth.currentUser?.emailVerified);

  try {
    if (!auth.currentUser) {
      showmsg("Usuario no autenticado", "mal");
      return;
    }

    const data = {
      nombre: document.getElementById("frnombre").value.trim(),
      apellidos: document.getElementById("frapellido").value.trim(),
      email: document.getElementById("frcorreo").value.trim(),
      telefono: document.getElementById("frtelefono").value.trim(),
      ciudad: document.getElementById("frciudad").value.trim(),
      uid: auth.currentUser.uid,
      fecha: new Date().toISOString()
    };

    const db = getDatabase();
    await set(ref(db, "usuarios/" + data.uid), data);
    await sendEmailVerification(auth.currentUser);
    showmsg("Encuesta enviada y correo de verificación enviado", "bien");

    encuestaForm.reset();

    if (modal) modal.hide();

  } catch (error) {
    showmsg(error.message, "mal");
  }
});


onAuthStateChanged(auth, (user) => {
  console.log("Estado de sesion: ", user);
  if (!user) {
    window.location.href = "../index.html";
  } else {
    document.body.style.display = "block";
    const headerEls = document.querySelector(".p2header-els");
    if (headerEls) {
      headerEls.textContent = `Hola, ${user.displayName || user.email.split('@')[0]}!`;
    }
  }
});

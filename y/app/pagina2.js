import { auth, db } from "./firebase.js";
import { doc, setDoc, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";
import { sendEmailVerification } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
import { signOut } from "./afuera.js";
import { showmsg } from "./mensajes.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
const timestamp = Date.now();
const verifyBtn = document.getElementById("verify");
const logoutLink = document.getElementById("logout-link");
const encuestaForm = document.getElementById("encuestaForm");
const dropdownButton = document.querySelector('.dropdown-button');
const dropdownContent = document.querySelector('.dropdown-content');
dropdownButton.addEventListener('click', () => {
  dropdownContent.classList.toggle('show');
});
window.addEventListener('click', (e) => {
  if (!dropdownButton.contains(e.target)) {
    dropdownContent.classList.remove('show');
  }
});
logoutLink?.addEventListener("click", () => {
  signOut();
  dropdownContent.classList.remove('show');
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
      fecha: serverTimestamp()
    };
    await setDoc(doc(db, "usuarios", data.uid), data);
    await sendEmailVerification(auth.currentUser);
    showmsg("Encuesta enviada y correo de verificación enviado", "bien");
    encuestaForm.reset();
    if (modal) modal.hide();
  } catch (error) {
    showmsg(error.message, "mal");
  }
});

onAuthStateChanged(auth, (user) => {
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

const fileInput = document.getElementById("fileInput");
const uploadBtn = document.getElementById("uploadBtn");
const uploadStatus = document.getElementById("uploadStatus");


uploadBtn.addEventListener("click", async () => {
  const file = fileInput?.files[0];
  if (!file) {
    uploadStatus.textContent = "Por favor selecciona una imagen.";
    return;
  }
  if (!auth.currentUser) {
    uploadStatus.textContent = "Debes iniciar sesión.";
    return;
  }
  const documentoID = `${auth.currentUser.uid}_${timestamp}`;
  const reader = new FileReader();
  reader.onload = async function (event) {
    const base64Url = event.target.result;
    try {
      await addDoc(collection(db, "imagenes"), {
        url: base64Url,
        uid: auth.currentUser.uid,
        fecha: serverTimestamp()
      });
      uploadStatus.textContent = "Imagen guardada correctamente.";
      fileInput.value = "";
    } catch (error) {
      uploadStatus.textContent = "Error al guardar la imagen: " + error.message;
    }
  };
  reader.readAsDataURL(file);
});

const apiKey = "cA5Kf8Pubz688MygClQPZMgQ1oN1brMshu4rJxbF";
const apodTitle = document.getElementById("apod-title");
const apodMediaContainer = document.getElementById("apod-media-container");
const apodExplanation = document.getElementById("apod-explanation");
const loadingSpinner = document.getElementById("loading-spinner");
const dateInput = document.getElementById("apod-date-input");
const randomButton = document.getElementById("apod-random-button");
dateInput.max = new Date().toISOString().split("T")[0];

async function fetchAPOD(date = null) {
  try {
    loadingSpinner.style.display = "block";
    apodMediaContainer.innerHTML = "";
    apodTitle.textContent = "";
    apodExplanation.textContent = "";
    let url = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}`;
    if (date) url += `&date=${date}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Error al obtener datos de la NASA");
    const data = await res.json();
    apodTitle.textContent = data.title || "Título no disponible";
    if (data.media_type === "image") {
      apodMediaContainer.innerHTML = `<img src="${data.url}" alt="${data.title}" />`;
    } else if (data.media_type === "video") {
      apodMediaContainer.innerHTML = `<iframe src="${data.url}" frameborder="0" allowfullscreen></iframe>`;
    } else {
      apodMediaContainer.textContent = "No soportado.";
    }
    apodExplanation.textContent = data.explanation || "";
  } catch (error) {
    apodTitle.textContent = "No se pudo cargar el dato curioso.";
    apodMediaContainer.textContent = "";
    apodExplanation.textContent = error.message;
    console.error(error);
  } finally {
    loadingSpinner.style.display = "none";
  }
}

dateInput.addEventListener("change", () => {
  if (dateInput.value) fetchAPOD(dateInput.value);
});

randomButton.addEventListener("click", () => {
  const start = new Date(1995, 5, 16).getTime();
  const end = new Date().getTime();
  const randomTime = new Date(start + Math.random() * (end - start));
  const randomDate = randomTime.toISOString().slice(0, 10);
  dateInput.value = randomDate;
});
fetchAPOD();
import { auth, db } from "./firebase.js";
import { doc, setDoc, serverTimestamp, getDoc } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";
import { sendEmailVerification } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
import { signOut } from "./afuera.js";
import { showmsg } from "./mensajes.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

const verifyBtn = document.getElementById("verify");
const logoutLink = document.getElementById("logout-link");
const modalElement = document.getElementById('encuestaModal');
const encuestaForm = document.getElementById("encuestaForm");
const adminbtn = document.getElementById("adminbtn");
onAuthStateChanged(auth, async (user) => {
    if (!user) {
        window.location.href = "../index.html";
    } else {
        document.body.style.display = "block";
        const headerEls = document.querySelector(".p2header-els");
        if (headerEls) {
            headerEls.textContent = `Hola, ${user.displayName || user.email.split('@')[0]}!`;
        }
        try {
            const userRef = doc(db, "users", user.uid);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists() && userSnap.data().rol === "admin") {
                if (adminbtn) {
                    adminbtn.style.display = "inline-block"; 
                }
            } else {
                if (adminbtn) {
                    adminbtn.style.display = "none"; 
                }
            }
        } catch (error) {
            console.error("Error al verificar el rol del usuario:", error);
            if (adminbtn) {
                adminbtn.style.display = "none";
            }
        }
    }
});

let modal;
if (modalElement) {
  modal = new bootstrap.Modal(modalElement);
}

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

verifyBtn?.addEventListener("click", () => {
  if (modal) {
    modal.show();
  }
  dropdownContent.classList.remove('show');
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
      timestamp: serverTimestamp()
    };
    await setDoc(doc(db, "users", data.uid), data);
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


  const ticketForm = document.getElementById("ticketForm");
const ticketStatus = document.getElementById("ticketStatus");

ticketForm?.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!auth.currentUser) {
    ticketStatus.textContent = "Debes iniciar sesión para enviar un ticket.";
    return;
  }

  const nombre = document.getElementById("ticketNombre").value.trim();
  const asunto = document.getElementById("ticketAsunto").value.trim();
  const descripcion = document.getElementById("ticketDescripcion").value.trim();

  const file = document.getElementById("ticketImage").files[0];
  let base64Image = null;

  if (file) {
    base64Image = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = err => reject(err);
      reader.readAsDataURL(file);
    });
  }

  const ticketData = {
    uid: auth.currentUser.uid,
    nombre,
    asunto,
    descripcion,
    imagen: base64Image,
    fecha: serverTimestamp()
  };

  try {
    const ticketId = auth.currentUser.uid + "_" + Date.now(); 
    await setDoc(doc(db, "tickets", ticketId), ticketData);
    ticketStatus.textContent = showmsg("Ticket enviado con éxito", "bien");
    ticketForm.reset();
  } catch (error) {
    ticketStatus.textContent = "Error al enviar ticket: " + error.message;
  }
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
      apodMediaContainer.textContent = "Tipo de medio no soportado.";
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
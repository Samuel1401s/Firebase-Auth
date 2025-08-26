import { getFirestore, doc, getDoc, collection, getDocs } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";
import { auth } from "./firebase.js";
import { showmsg } from "./mensajes.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
import { signOut } from "./afuera.js";

const db = getFirestore();
const ticketsList = document.getElementById('tickets-list');
const ticketsContainer = document.getElementById('tickets-container');
const logoutLink = document.getElementById('logout-link');

function displayTicket(ticket) {
    ticketsContainer.innerHTML = `
 <div class="card shadow-sm" style="background-color: #393E46; color: #EEEEEE;">
 <div class="card-header" style="background-color: #00ADB5; color: #222831;">
 <h5 class="mb-0">Ticket # ${ticket.id}</h5>
 </div>
 <div class="card-body">
 <h5 class="card-title">${ticket.data.asunto}</h5>
 <p class="card-text"><strong>Usuario:</strong> ${ticket.data.nombre}</p>
 <p class="card-text"><strong>Descripción:</strong> ${ticket.data.descripcion}</p>
 ${ticket.data.imagen ? `<img src="${ticket.data.imagen}" alt="Imagen del ticket" class="img-fluid mt-3 rounded-3" />` : ''}
 </div>
 </div>
 `;
}

async function loadTickets() {
    try {
        const querySnapshot = await getDocs(collection(db, "tickets"));

        ticketsList.innerHTML = '';

        if (querySnapshot.empty) {
            ticketsList.innerHTML = '<p class="text-muted">No hay tickets disponibles.</p>';
            return;
        }

        querySnapshot.forEach((doc) => {
            const ticketData = doc.data();
            const ticketId = doc.id;
            const timestamp = doc.data().fecha ? doc.data().fecha.toDate() : null;
            const formattedDate = timestamp ? timestamp.toLocaleDateString('es-CO') : 'Fecha no disponible';
            const ticketCard = document.createElement('div');
            ticketCard.className = 'card mb-3 shadow-sm';
            ticketCard.style.backgroundColor = '#393E46';
            ticketCard.style.color = '#EEEEEE';


            ticketCard.innerHTML = `
<div class="card-header d-flex justify-content-between align-items-center" style="background-color: #00ADB5; color: #222831;">
 <h6 class="mb-0"><strong>Usuario:</strong> ${ticketData.nombre} | <strong>Fecha:</strong> ${formattedDate}</h6>
 <button class="btn btn-primary btn-sm" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTicket-${ticketId}" aria-expanded="false" aria-controls="collapseTicket-${ticketId}">
 Ver
 </button>
 </div>
 <div class="collapse" id="collapseTicket-${ticketId}">
 <div class="card-body" style="background-color: #393E46;">
 <p class="card-text"><strong>Asunto:</strong> ${ticketData.asunto}</p>
 <p class="card-text"><strong>Descripción:</strong> ${ticketData.descripcion}</p>
 ${ticketData.imagen ? `<img src="${ticketData.imagen}" alt="Imagen del ticket" class="img-fluid mt-3 rounded-3" />` : ''}
</div>
</div>
 `;

            ticketsList.appendChild(ticketCard);
        });

    } catch (error) {
        console.error("Error al cargar los tickets: ", error);
        showmsg("Hubo un error al cargar los tickets.", "mal");
    }
}


onAuthStateChanged(auth, async (user) => {
    if (!user) {
        window.location.href = "../index.html";
    } else {
        try {
            const userRef = doc(db, "users", user.uid);
            const userSnap = await getDoc(userRef);

            if (userSnap.exists() && userSnap.data().rol === "admin") {
                document.body.style.display = "block";
                const headerEls = document.querySelector(".p2header-els");
                if (headerEls) {
                    headerEls.textContent = `Hola, ${user.displayName || user.email.split('@')[0]}!`;
                }
                loadTickets();
            } else {
                alert("Acceso denegado. No eres un administrador.");
                window.location.href = "../index.html";
            }
        } catch (error) {
            console.error("Error al verificar el rol de usuario:", error);
            alert("Acceso denegado. Ocurrió un error.");
            window.location.href = "../index.html";
        }
    }
});

if (logoutLink) {
    logoutLink.addEventListener('click', async (e) => {
        e.preventDefault();
        try {
            await signOut(auth);
            window.location.href = "../index.html";
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        }
    });
}
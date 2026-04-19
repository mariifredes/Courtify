import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-app.js";
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, updateDoc, doc, arrayUnion } 
from "https://www.gstatic.com/firebasejs/12.12.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-auth.js";
const firebaseConfig = {
  apiKey: "AIzaSyBpiIXpMGzSAP6LLrSdWdmVdKU9IFnQj14",
  authDomain: "courtify-61b99.firebaseapp.com",
  projectId: "courtify-61b99",
  appId: "1:796727690755:web:e701204c38cc85f2813036"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();

const saludo = document.getElementById("saludo");

if (saludo) {
  const user = auth.currentUser;

  if (user) {
    saludo.textContent = "Hola 👋 " + user.email;
  }
}
// ================= RESERVAR =================
async function reservar() {
  const nombre = document.getElementById("nombre").value;
  const cancha = document.getElementById("cancha").value;
  const fecha = document.getElementById("fecha").value;
  const hora = document.getElementById("hora").value;

  if (!nombre || !cancha || !fecha || !hora) {
    alert("Completa todos los campos");
    return;
  }

  await addDoc(collection(db, "reservas"), {
    nombre,
    cancha,
    fecha,
    hora
  });

  alert("✅ Reserva realizada con éxito");

  // 👉 REDIRECCIÓN
  window.location.href = "mis-reservas.html";
}

// ================= MOSTRAR EN RESERVAS (opcional) =================
async function mostrarReservas() {
  const lista = document.getElementById("lista");
  if (!lista) return;

  lista.innerHTML = "";

  const datos = await getDocs(collection(db, "reservas"));

  datos.forEach(doc => {
    const li = document.createElement("li");
    li.textContent = doc.data().nombre + " - " + doc.data().cancha;
    lista.appendChild(li);
  });
}

// ================= MIS RESERVAS (CLAVE 🔥) =================
async function cargarMisReservas() {
  const lista = document.getElementById("misReservas");
  if (!lista) return;

  lista.innerHTML = "<li>Cargando...</li>";

  const datos = await getDocs(collection(db, "reservas"));

  lista.innerHTML = "";

  if (datos.empty) {
    lista.innerHTML = "<li>No hay reservas</li>";
    return;
  }

  datos.forEach(doc => {
    const data = doc.data();

    const li = document.createElement("li");
    li.textContent =
      data.nombre + " | " +
      data.cancha + " | " +
      data.fecha + " | " +
      data.hora;

    lista.appendChild(li);
  });
}

// ================= PARTIDOS =================
async function crearPartido() {
  const jugador = document.getElementById("jugador").value;
  const cancha = document.getElementById("canchaPartido").value;

  await addDoc(collection(db, "partidos"), {
    cancha,
    jugadores: [jugador]
  });

  mostrarPartidos();
}

async function mostrarPartidos() {
  const lista = document.getElementById("listaPartidos");
  if (!lista) return;

  lista.innerHTML = "";

  const datos = await getDocs(collection(db, "partidos"));

  datos.forEach(docu => {
    const li = document.createElement("li");
    const data = docu.data();

    li.textContent = data.cancha + " - " + data.jugadores.join(", ");

    const btn = document.createElement("button");
    btn.textContent = "Unirme";

    btn.onclick = () => unirse(docu.id);

    li.appendChild(btn);
    lista.appendChild(li);
  });
}

async function unirse(id) {
  const nombre = prompt("Tu nombre");

  await updateDoc(doc(db, "partidos", id), {
    jugadores: arrayUnion(nombre)
  });

  mostrarPartidos();
}

// ================= NAVEGACIÓN =================
window.irPerfil = () => window.location.href = "perfil.html";
window.irMisReservas = () => window.location.href = "mis-reservas.html";
window.irPago = () => window.location.href = "pago.html";

// ================= LOGOUT =================
window.logout = async () => {
  const auth = getAuth();
  await signOut(auth);
  window.location.href = "login.html";
};

// ================= EXPORTAR =================
window.reservar = reservar;
window.crearPartido = crearPartido;

// ================= INICIO INTELIGENTE 🔥 =================
if (document.getElementById("lista")) {
  mostrarReservas();
}

if (document.getElementById("listaPartidos")) {
  mostrarPartidos();
}

if (document.getElementById("misReservas")) {
  cargarMisReservas();
}
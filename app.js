import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-app.js";
import {
  getAuth,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.12.0/firebase-auth.js";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  arrayUnion,
  query,
  where
} from "https://www.gstatic.com/firebasejs/12.12.0/firebase-firestore.js";

// 🔥 CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyBpiIXpMGzSAP6LLrSdWdmVdKU9IFnQj14",
  authDomain: "courtify-61b99.firebaseapp.com",
  projectId: "courtify-61b99",
  appId: "1:796727690755:web:e701204c38cc85f2813036"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const IMAGEN_DEFAULT = "img/cancha-1.jpeg";

// ================= 👤 USUARIO =================
onAuthStateChanged(auth, (user) => {
  const saludo = document.getElementById("saludo");

  if (saludo) {
    if (user) {
      saludo.textContent = "Hola, " + user.email + " 👋";
    } else {
      saludo.textContent = "Hola, usuario 👋";
    }
  }

  if (user && document.getElementById("misReservas")) {
    cargarMisReservas();
  }
});

// ================= 🏟️ CARGAR CANCHAS (HOME) =================
function loadCourts() {
  const container = document.getElementById("courts-container");
  if (!container || typeof courts === "undefined") return;

  container.innerHTML = "";

  courts.forEach((court) => {
    container.innerHTML += `
      <div class="cancha-card">
        <img src="${court.image}" class="court-img" alt="${court.name}">
        <div class="cancha-overlay">
          <h3>${court.name}</h3>
          <button onclick="abrirReserva('${court.name}', '${court.image}')">Reservar</button>
        </div>
      </div>
    `;
  });
}

// ================= 📍 ABRIR RESERVA DESDE UNA CANCHA =================
window.abrirReserva = (nombreCancha, imagenCancha = "") => {
  localStorage.setItem("canchaSeleccionada", nombreCancha || "");
  localStorage.setItem("imagenCanchaSeleccionada", imagenCancha || IMAGEN_DEFAULT);
  window.location.href = "agendar-reserva.html";
};

// Compatibilidad por si todavía usan onclick="seleccionarCancha(...)"
window.seleccionarCancha = (nombreCancha, imagenCancha = "") => {
  window.abrirReserva(nombreCancha, imagenCancha);
};

// ================= 📥 CARGAR CANCHA SELECCIONADA EN AGENDAR-RESERVA =================
window.cargarCanchaSeleccionada = () => {
  const cancha = localStorage.getItem("canchaSeleccionada") || "";
  const imagenGuardada = localStorage.getItem("imagenCanchaSeleccionada") || "";
  const imagen = imagenGuardada.trim() !== "" ? imagenGuardada : IMAGEN_DEFAULT;

  const inputCancha = document.getElementById("cancha");
  const titulo = document.getElementById("tituloCanchaSeleccionada");
  const imagenElemento = document.getElementById("imagenCanchaSeleccionada");

  if (inputCancha) {
    inputCancha.value = cancha;
  }

  if (titulo) {
    titulo.textContent = cancha || "Cancha seleccionada";
  }

  if (imagenElemento) {
    imagenElemento.src = imagen;
    imagenElemento.alt = cancha || "Cancha seleccionada";

    imagenElemento.onerror = () => {
      imagenElemento.src = IMAGEN_DEFAULT;
    };
  }
};

// ================= 🗓️ ACTUALIZAR RESUMEN FECHA/HORA =================
window.actualizarResumen = () => {
  const fecha = document.getElementById("fecha")?.value;
  const hora = document.getElementById("hora")?.value;
  const resumen = document.getElementById("resumenFechaHora");

  if (!resumen) return;

  if (fecha && hora) {
    resumen.textContent = `${fecha} a las ${hora} hrs.`;
  } else if (fecha) {
    resumen.textContent = fecha;
  } else {
    resumen.textContent = "Selecciona fecha y hora";
  }
};

// ================= 📅 RESERVAR =================
async function reservar() {
  const user = auth.currentUser;

  if (!user) {
    alert("Debes iniciar sesión");
    return;
  }

  const nombre = document.getElementById("nombre")?.value.trim() || "";
  const cancha = document.getElementById("cancha")?.value.trim();
  const fecha = document.getElementById("fecha")?.value;
  const hora = document.getElementById("hora")?.value;

  if (!cancha || !fecha || !hora) {
    alert("Completa todos los campos");
    return;
  }

  try {
    await addDoc(collection(db, "reservas"), {
      userId: user.uid,
      userEmail: user.email || "",
      nombre,
      cancha,
      fecha,
      hora,
      createdAt: new Date()
    });

    alert("✅ Reserva confirmada");
    window.location.href = "mis-reservas.html";
  } catch (error) {
    console.error(error);
    alert("Error al reservar");
  }
}

// ================= 📊 MIS RESERVAS =================
async function cargarMisReservas() {
  const lista = document.getElementById("misReservas");
  if (!lista) return;

  const user = auth.currentUser;
  if (!user) {
    lista.innerHTML = "<li>Debes iniciar sesión</li>";
    return;
  }

  lista.innerHTML = "<li>Cargando...</li>";

  try {
    const q = query(
      collection(db, "reservas"),
      where("userId", "==", user.uid)
    );

    const snapshot = await getDocs(q);

    lista.innerHTML = "";

    if (snapshot.empty) {
      lista.innerHTML = "<li>No tienes reservas</li>";
      return;
    }

    snapshot.forEach((docu) => {
      const data = docu.data();

      lista.innerHTML += `
        <li>
          ${data.cancha}<br>
          ${data.fecha} - ${data.hora}
        </li>
      `;
    });
  } catch (error) {
    console.error(error);
    lista.innerHTML = "<li>Error al cargar</li>";
  }
}

// ================= 🔥 PARTIDOS =================
async function crearPartido() {
  const jugador = document.getElementById("jugador")?.value.trim();
  const cancha = document.getElementById("canchaPartido")?.value.trim();

  if (!jugador || !cancha) {
    alert("Completa los datos del partido");
    return;
  }

  try {
    await addDoc(collection(db, "partidos"), {
      cancha,
      jugadores: [jugador]
    });

    const inputJugador = document.getElementById("jugador");
    const inputCancha = document.getElementById("canchaPartido");

    if (inputJugador) inputJugador.value = "";
    if (inputCancha) inputCancha.value = "";

    mostrarPartidos();
  } catch (error) {
    console.error(error);
    alert("No se pudo crear el partido");
  }
}

async function mostrarPartidos() {
  const lista = document.getElementById("listaPartidos");
  if (!lista) return;

  lista.innerHTML = "";

  try {
    const snapshot = await getDocs(collection(db, "partidos"));

    if (snapshot.empty) {
      lista.innerHTML = "<li>No hay partidos disponibles</li>";
      return;
    }

    snapshot.forEach((docu) => {
      const data = docu.data();

      lista.innerHTML += `
        <li>
          ${data.cancha} - ${data.jugadores.join(", ")}
          <button onclick="unirse('${docu.id}')">Unirme</button>
        </li>
      `;
    });
  } catch (error) {
    console.error(error);
    lista.innerHTML = "<li>Error al cargar partidos</li>";
  }
}

async function unirse(id) {
  const nombre = prompt("Tu nombre");

  if (!nombre) return;

  try {
    await updateDoc(doc(db, "partidos", id), {
      jugadores: arrayUnion(nombre)
    });

    mostrarPartidos();
  } catch (error) {
    console.error(error);
    alert("No se pudo unir al partido");
  }
}

// ================= 🚪 LOGOUT =================
window.logout = async () => {
  try {
    await signOut(auth);
    window.location.href = "login.html";
  } catch (error) {
    console.error(error);
    alert("No se pudo cerrar sesión");
  }
};

// ================= 🧭 NAVEGACIÓN =================
window.irHome = () => window.location.href = "home.html";
window.irReservar = () => window.location.href = "reserva.html";
window.irMisReservas = () => window.location.href = "mis-reservas.html";
window.irPerfil = () => window.location.href = "perfil.html";
window.irPartidos = () => window.location.href = "home.html#partidos";

// ================= 🚀 EXPORTAR =================
window.reservar = reservar;
window.unirse = unirse;
window.crearPartido = crearPartido;

// ================= 🚀 INICIO =================
loadCourts();

if (document.getElementById("listaPartidos")) {
  mostrarPartidos();
}

if (document.getElementById("imagenCanchaSeleccionada")) {
  window.cargarCanchaSeleccionada();
  window.actualizarResumen();
}
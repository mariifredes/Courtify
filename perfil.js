import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBpiIXpMGzSAP6LLrSdWdmVdKU9IFnQj14",
  authDomain: "courtify-61b99.firebaseapp.com",
  projectId: "courtify-61b99",
  appId: "1:796727690755:web:e701204c38cc85f2813036"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function cargarPerfil(user) {
  const usuarioSpan = document.getElementById("usuario");
  const nombrePerfil = document.getElementById("nombrePerfil");

  if (usuarioSpan) {
    usuarioSpan.textContent = user.email || "";
  }

  try {
    const ref = doc(db, "usuarios", user.uid);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      if (nombrePerfil) {
        nombrePerfil.textContent = "Usuario Courtify";
      }
      return;
    }

    const data = snap.data();

    const nombre = document.getElementById("nombre");
    const edad = document.getElementById("edad");
    const sexo = document.getElementById("sexo");
    const telefono = document.getElementById("telefono");
    const deporte = document.getElementById("deporte");
    const nivel = document.getElementById("nivel");

    if (nombre) nombre.value = data.nombre || "";
    if (edad) edad.value = data.edad || "";
    if (sexo) sexo.value = data.sexo || data.genero || "";
    if (telefono) telefono.value = data.telefono || "";
    if (deporte) deporte.value = data.deporte || "";
    if (nivel) nivel.value = data.nivel || "";

    if (nombrePerfil) {
      nombrePerfil.textContent = data.nombre || "Usuario Courtify";
    }
  } catch (error) {
    console.error("Error al cargar perfil:", error);
    alert("No se pudo cargar el perfil");
  }
}

async function guardarPerfil() {
  const user = auth.currentUser;

  if (!user) {
    alert("Debes iniciar sesión");
    window.location.href = "login.html";
    return;
  }

  const nombre = document.getElementById("nombre")?.value.trim() || "";
  const edad = document.getElementById("edad")?.value.trim() || "";
  const sexo = document.getElementById("sexo")?.value.trim() || "";
  const telefono = document.getElementById("telefono")?.value.trim() || "";
  const deporte = document.getElementById("deporte")?.value.trim() || "";
  const nivel = document.getElementById("nivel")?.value.trim() || "";

  try {
    await setDoc(
      doc(db, "usuarios", user.uid),
      {
        nombre,
        edad,
        sexo,
        telefono,
        deporte,
        nivel,
        email: user.email || ""
      },
      { merge: true }
    );

    const nombrePerfil = document.getElementById("nombrePerfil");
    if (nombrePerfil) {
      nombrePerfil.textContent = nombre || "Usuario Courtify";
    }

    alert("✅ Perfil guardado");
  } catch (error) {
    console.error("Error al guardar perfil:", error);
    alert("Ocurrió un error al guardar el perfil");
  }
}

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    alert("Debes iniciar sesión");
    window.location.href = "login.html";
    return;
  }

  await cargarPerfil(user);
});

window.guardarPerfil = guardarPerfil;
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/12.12.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBpiIXpMGzSAP6LLrSdWdmVdKU9IFnQj14",
  authDomain: "courtify-61b99.firebaseapp.com",
  projectId: "courtify-61b99",
  appId: "1:796727690755:web:e701204c38cc85f2813036"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

console.log("AUTH FUNCIONANDO");

// ================= LOGIN =================
async function login() {
  const email = document.getElementById("email")?.value.trim();
  const password = document.getElementById("password")?.value.trim();

  if (!email || !password) {
    alert("Completa los campos");
    return;
  }

  try {
    await signInWithEmailAndPassword(auth, email, password);
    alert("Bienvenido 🔥");
    window.location.href = "home.html";
  } catch (error) {
    alert("Error: " + error.message);
  }
}

// ================= RECUPERAR CONTRASEÑA =================
window.recuperarPassword = async () => {
  const email = document.getElementById("email")?.value.trim();

  if (!email) {
    alert("Ingresa tu correo primero");
    return;
  }

  try {
    await sendPasswordResetEmail(auth, email);
    alert("📩 Correo enviado para recuperar contraseña");
  } catch (error) {
    alert("Error: " + error.message);
  }
};

// ================= REGISTRO =================
async function registrar() {
  const btnRegistrar = document.getElementById("btnRegistrar");
  if (btnRegistrar) btnRegistrar.disabled = true;

  const nombre = document.getElementById("nombre")?.value.trim();
  const apellido = document.getElementById("apellido")?.value.trim();
  const email = document.getElementById("email")?.value.trim();
  const telefono = document.getElementById("telefono")?.value.trim();
  const rut = document.getElementById("rut")?.value.trim();
  const fechaNacimiento = document.getElementById("fechaNacimiento")?.value;
  const genero = document.getElementById("genero")?.value;
  const password = document.getElementById("password")?.value.trim();
  const repetirPassword = document.getElementById("repetirPassword")?.value.trim();
  const terminos = document.getElementById("terminos")?.checked;

  if (
    !nombre ||
    !apellido ||
    !email ||
    !telefono ||
    !rut ||
    !fechaNacimiento ||
    !password ||
    !repetirPassword
  ) {
    alert("Completa todos los campos obligatorios");
    if (btnRegistrar) btnRegistrar.disabled = false;
    return;
  }

  if (password !== repetirPassword) {
    alert("Las contraseñas no coinciden");
    if (btnRegistrar) btnRegistrar.disabled = false;
    return;
  }

  if (!terminos) {
    alert("Debes aceptar los términos y condiciones");
    if (btnRegistrar) btnRegistrar.disabled = false;
    return;
  }

  try {
    console.log("Intentando registrar usuario:", email);

    const credencial = await createUserWithEmailAndPassword(auth, email, password);
    const user = credencial.user;

    await setDoc(doc(db, "usuarios", user.uid), {
      nombre,
      apellido,
      email,
      telefono,
      rut,
      fechaNacimiento,
      genero: genero || "",
      terminosAceptados: true,
      creadoEn: serverTimestamp()
    });

    alert("✅ Usuario creado correctamente");
    window.location.href = "login.html";
  } catch (error) {
    console.error("ERROR REGISTRO:", error.code, error.message);

    if (error.code === "auth/email-already-in-use") {
      alert("Este correo ya fue registrado. Revisa en Firebase Authentication si se creó en el primer intento.");
    } else {
      alert("Error: " + error.message);
    }
  } finally {
    if (btnRegistrar) btnRegistrar.disabled = false;
  }
}
// ================= BOTONES =================
document.getElementById("btnLogin")?.addEventListener("click", login);

document.getElementById("btnIrRegistro")?.addEventListener("click", () => {
  window.location.href = "registro.html";
});

document.getElementById("btnRegistrar")?.addEventListener("click", registrar);

// ================= VOLVER AL LOGIN =================
window.volverLogin = () => {
  window.location.href = "login.html";
};
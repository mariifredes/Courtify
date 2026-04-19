import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } 
from "https://www.gstatic.com/firebasejs/12.12.0/firebase-auth.js";
import { sendPasswordResetEmail } 
from "https://www.gstatic.com/firebasejs/12.12.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBpiIXpMGzSAP6LLrSdWdmVdKU9IFnQj14",
  authDomain: "courtify-61b99.firebaseapp.com",
  projectId: "courtify-61b99",
  appId: "1:796727690755:web:e701204c38cc85f2813036"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// 👇 PARA SABER SI CARGA
console.log("AUTH FUNCIONANDO");

// ================= LOGIN =================
async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!email || !password) {
    alert("Completa los campos");
    return;
  }

  try {
    await signInWithEmailAndPassword(auth, email, password);
    alert("Bienvenido 🔥");
    window.location.href = "reservas.html";
  } catch (error) {
    alert("Error: " + error.message);
  }
}
window.recuperarPassword = async () => {
  const email = document.getElementById("email").value;

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
  const email = document.getElementById("email")?.value;
  const password = document.getElementById("password")?.value;

  if (!email || !password) return;

  try {
    await createUserWithEmailAndPassword(auth, email, password);
    alert("Usuario creado");
  } catch (error) {
    console.log(error);
  }
}

// ================= BOTONES =================

// LOGIN
document.getElementById("btnLogin")?.addEventListener("click", login);

// IR A REGISTRO
document.getElementById("btnIrRegistro")?.addEventListener("click", () => {
  window.location.href = "registro.html";
});
// Volver al login 
window.volverLogin = () => {
  window.location.href = "login.html";
};
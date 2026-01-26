import './styles/style.css'
import {routes} from "./constants/routes.js"
import { getUsers, getUsersById } from './services/users.js';

// Rutas públicas (sin login)
const publicRoutes = ["/login"];

// Función para verificar si está autenticado
function isAuthenticated() {
  const userData = localStorage.getItem("userData");
  return userData && JSON.parse(userData).isActive;
}

// Función para proteger rutas
function checkRouteAccess(pathname) {
  const isLoggedIn = isAuthenticated();

  // Si intenta acceder a login y ya está logueado, redirige a home
  if (pathname === "/login" && isLoggedIn) {
    return "/home";
  }

  // Si intenta acceder a rutas protegidas sin loguear, redirige a login
  if (!publicRoutes.includes(pathname) && !isLoggedIn) {
    return "/login";
  }

  return pathname;
}

document.body.addEventListener("click", (e) => {
  if (e.target.matches("[data-link]")) {
    e.preventDefault();
    const route = e.target.getAttribute("href");
    navigate(route);
  }
});

async function navigate(pathname) {
  // Verificar acceso a la ruta
  const allowedRoute = checkRouteAccess(pathname);

  const routeEnd = routes[allowedRoute];
  const resp = await fetch(routeEnd);
  const html = await resp.text();
  document.getElementById("app").innerHTML = html;

  // Ejecutar lógica específica de cada vista
  const viewHandlers = {
    "/login": initLogin,
    "/home": initHome,
    "/about": initAbout,
    "/contact": initContact,
  };

  if (viewHandlers[allowedRoute]) {
    viewHandlers[allowedRoute]();
  }
}

async function initLogin() {

  const result = await getUsers()
  console.log(result);

  const user3 = await getUsersById(3)
  console.log(user3);

  let userInput = document.getElementById("userInput");
  let passInput = document.getElementById("passInput");
  let buttonInput = document.getElementById("buttonLogin");

  let user;
  let pass;

  userInput.addEventListener("input", (e) => {
    user = e.target.value;
  });

  passInput.addEventListener("input", (e) => {
    pass = e.target.value;
  });

  buttonInput.addEventListener("click", () => {
    if (user === "david" && pass === "123456") {
      console.log("incio sesion");

      const userObjet = {
        userName: user,
        userPass: pass,
        isActive: true,
        role: "admin"
      };

      localStorage.setItem("userData", JSON.stringify(userObjet));
      sessionStorage.setItem("pass", pass);

      // Redirigir a home después de login
      navigate("/home");
    } else {
      console.log("no tiene acceso");
      alert("Usuario o contraseña incorrecta");
    }
  });
}

function initHome() {
  let name = document.getElementById("name");
  let pass = document.getElementById("pass");
  let buttonLogout = document.getElementById("logout");

  let stringUser = localStorage.getItem("userData") || "";
  let objetUser = JSON.parse(stringUser);

  let passUser = sessionStorage.getItem("pass") || "";

  name.textContent = objetUser.userName;
  pass.textContent = passUser;

  buttonLogout.addEventListener("click", () => {
    localStorage.removeItem("userData");
    sessionStorage.removeItem("pass");

    // Redirigir a login después de logout
    navigate("/login");
  });
}

function initAbout() {
  // Lógica específica para la vista about
  console.log("Vista About cargada");
}

function initContact() {
  // Lógica específica para la vista contact
  console.log("Vista Contact cargada");
}

// Inicializar la app al cargar
document.addEventListener("DOMContentLoaded", () => {
  const initialRoute = isAuthenticated() ? "/home" : "/login";
  navigate(initialRoute);
});
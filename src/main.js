import './styles/style.css'
import { routes } from "./constants/routes.js"
import { createUser, deleteUsersById, getUsers, getUsersById } from './services/users.js';
import {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  markTodoAsComplete,
} from "./services/todos.js";

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
    "/todolist": initTodoList,
    "/users": initUsers
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

  const inputUser = document.getElementById("inputName");
  const inputEmail = document.getElementById("inputEmail");
  const inputAge = document.getElementById("inputAge");
  const inputCity = document.getElementById("inputCity");
  const createUserBtn = document.getElementById("createUserBtn");

  let name;
  let email;
  let age;
  let city;

  inputUser.addEventListener("input", (e) => {
    name = e.target.value;
  });

  inputEmail.addEventListener("input", (e) => {
    email = e.target.value;
  });

  inputAge.addEventListener("input", (e) => {
    age = e.target.value;
  });

  inputCity.addEventListener("input", (e) => {
    city = e.target.value;
  });

  createUserBtn.addEventListener("click", async () => {

    const user = {
      name: name,
      email: email,
      age: age,
      city: city
    }

    const response = await createUser(user);

    if (response) {
      "Usuario creado con exito";
    } else {
      "Error al crear el usuario";
    }
  })

  console.log("Vista Contact cargada");
}

// Inicializar la app al cargar
document.addEventListener("DOMContentLoaded", () => {
  const initialRoute = isAuthenticated() ? "/home" : "/login";
  navigate(initialRoute);
});

async function initTodoList() {
  let todos = [];

  const todoInput = document.getElementById("todoInput");
  const addBtn = document.getElementById("addBtn");
  const todoList = document.getElementById("todoList");
  const emptyState = document.getElementById("emptyState");

  // Cargar todos al iniciar
  async function cargarTodos() {
    try {
      todos = await getTodos();
      renderizarTodos();
    } catch (error) {
      console.error("Error cargando todos:", error);
    }
  }

  // Agregar nuevo todo
  addBtn.addEventListener("click", agregarTodo);

  async function agregarTodo() {
    const titulo = todoInput.value.trim();

    if (!titulo) {
      alert("Por favor ingresa una tarea");
      return;
    }

    const nuevoTodo = {
      titulo: titulo,
      descripcion: "",
      completado: false,
      fechaCreacion: new Date().toISOString().split("T")[0],
    };

    try {
      const todoCreado = await createTodo(nuevoTodo);
      todos.push(todoCreado);
      todoInput.value = "";
      renderizarTodos();
    } catch (error) {
      console.error("Error creando todo:", error);
      alert("Error al crear la tarea");
    }
  }

  // Renderizar todos
  function renderizarTodos() {
    todoList.innerHTML = "";

    // if (todos.length === 0) {
    //   emptyState.style.display = "block";
    //   return;
    // }

    emptyState.style.display = "none";

    todos.forEach((todo) => {
      const li = document.createElement("li");
      li.className = `todo-item ${todo.completado ? "completed" : ""}`;
      li.innerHTML = `
        <div class="todo-content">
          <input 
            type="checkbox" 
            class="todo-checkbox" 
            ${todo.completado ? "checked" : ""} 
            data-id="${todo.id}"
          >
          <span class="todo-title">${todo.titulo}</span>
        </div>
        <div class="todo-actions">
          <button class="btn btn-edit" data-id="${todo.id}">Editar</button>
          <button class="btn btn-delete" data-id="${todo.id}">Eliminar</button>
        </div>
      `;

      // Event listeners para los botones
      const checkbox = li.querySelector(".todo-checkbox");
      checkbox.addEventListener("change", () => toggleCompletado(todo.id));

      const editBtn = li.querySelector(".btn-edit");
      editBtn.addEventListener("click", () => editarTodo(todo.id));

      const deleteBtn = li.querySelector(".btn-delete");
      deleteBtn.addEventListener("click", () => eliminarTodo(todo.id));

      todoList.appendChild(li);
    });
  }

  // Alternar estado completado
  async function toggleCompletado(id) {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;

    try {
      const nuevoEstado = !todo.completado;
      const todoActualizado = await markTodoAsComplete(id, nuevoEstado);
      Object.assign(todo, todoActualizado);
      renderizarTodos();
    } catch (error) {
      console.error("Error actualizando todo:", error);
      alert("Error al actualizar la tarea");
    }
  }

  // Editar todo
  async function editarTodo(id) {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;

    const nuevoTitulo = prompt("Editar tarea:", todo.titulo);

    if (nuevoTitulo === null) return; // El usuario canceló

    if (!nuevoTitulo.trim()) {
      alert("El título no puede estar vacío");
      return;
    }

    try {
      const todoActualizado = await updateTodo(id, {
        ...todo,
        titulo: nuevoTitulo.trim(),
      });
      Object.assign(todo, todoActualizado);
      renderizarTodos();
    } catch (error) {
      console.error("Error editando todo:", error);
      alert("Error al editar la tarea");
    }
  }

  // Eliminar todo
  async function eliminarTodo(id) {
    if (!confirm("¿Estás seguro de que deseas eliminar esta tarea?")) {
      return;
    }

    try {
      await deleteTodo(id);
      todos = todos.filter((todo) => todo.id !== id);
      renderizarTodos();
    } catch (error) {
      console.error("Error eliminando todo:", error);
      alert("Error al eliminar la tarea");
    }
  }

  // Cargar todos al iniciar la página
  cargarTodos();
}

async function initUsers() {
  let users = [];

  const inputUser = document.getElementById("inputUser");
  const inputEmail = document.getElementById("inputEmail");
  const inputAge = document.getElementById("inputAge");
  const inputCity = document.getElementById("inputCity");


  const addBtn = document.getElementById("addBtn");
  const userList = document.getElementById("userList");
  const emptyState = document.getElementById("emptyState");

  async function cargarUsers() {
    try {
      users = await getUsers();
      renderizarUsers();
    } catch (error) {
      console.error("Error cargando usuarios:", error);
    }
  }

  // Agregar nuevo todo
  addBtn.addEventListener("click", agregarUser);

  async function agregarUser() {
    const userName = inputUser.value.trim();
    const userEmail = inputEmail.value.trim();
    const userAge = inputAge.value.trim();
    const userCity = inputCity.value.trim();

    if (!userName && !userEmail && !userAge && !userCity) {
      alert("Por favor ingresa valores validos");
      return;
    }

    const user = {
      name: userName,
      email: userEmail,
      age: userAge,
      city: userCity
    }

    try {
      const usuarioCreado = await createUser(user);
      console.log(usuarioCreado);
      users.push(usuarioCreado);
      renderizarUsers();
    } catch (error) {
      console.error("Error creando todo:", error);
      alert("Error al crear la tarea");
    }
  }

  // Renderizar todos
  async function renderizarUsers() {
    userList.innerHTML = "";

    // if (todos.length === 0) {
    //   emptyState.style.display = "block";
    //   return;
    // }

    emptyState.style.display = "none";

    users.forEach((user) => {
      console.log(user);
      const li = document.createElement("li");
      li.className = `todo-item ${user.completado ? "completed" : ""}`;
      li.innerHTML = `
        <div class="todo-content">
        
          <input 
            type="checkbox" 
            class="todo-checkbox" 
            ${user.completado ? "checked" : ""} 
            data-id="${user.id}"
          >
          <span class="todo-title">${user.name}</span>
          <span class="todo-title">${user.email}</span>
          <span class="todo-title">${user.age}</span>
          <span class="todo-title">${user.city}</span>
        </div>
        <div class="todo-actions">
          <button class="btn btn-edit" data-id="${user.id}">Editar</button>
          <button class="btn btn-delete" data-id="${user.id}">Eliminar</button>
        </div>
      `;

      // Event listeners para los botones
      const checkbox = li.querySelector(".todo-checkbox");
      checkbox.addEventListener("change", () => toggleCompletado(user.id));

      const editBtn = li.querySelector(".btn-edit");
      editBtn.addEventListener("click", () => editarTodo(user.id));

      const deleteBtn = li.querySelector(".btn-delete");
      deleteBtn.addEventListener("click", () => eliminarUser(user.id));

      userList.appendChild(li);
    });
  }

  // Eliminar todo
  async function eliminarUser(id) {
    if (!confirm("¿Estás seguro de que deseas eliminar esta tarea?")) {
      return;
    }

    try {
      await deleteUsersById(id);
      users = users.filter((user) => user.id !== id);
      renderizarUsers();
    } catch (error) {
      console.error("Error eliminando todo:", error);
      alert("Error al eliminar la tarea");
    }
  }

  // Cargar todos al iniciar la página
  cargarUsers();
}

// Inicializar la app al cargar
document.addEventListener("DOMContentLoaded", () => {
  const initialRoute = isAuthenticated() ? "/home" : "/login";
  navigate(initialRoute);
});
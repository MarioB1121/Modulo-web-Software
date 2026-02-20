const usuarioEjemplo = { username: "admin", password: "1234" };

function login() {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;

    if (!username || !password) {
        alert("Completa todos los campos");
        return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const ok =
        (username === usuarioEjemplo.username && password === usuarioEjemplo.password) ||
        users.some(u => u.username === username && u.password === password);

    if (ok) {
        alert("Login exitoso");
        window.location.href = "./index.html";
    } else {
        alert("Usuario o contraseña incorrectos");
    }
}
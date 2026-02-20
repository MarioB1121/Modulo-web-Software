function register() {
    const username = document.getElementById("username").value.trim();
    const correo = document.getElementById("correo").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (!username || !correo || !password || !confirmPassword) {
        alert("Completa todos los campos");
        return;
    }

    if (password !== confirmPassword) {
        alert("Las contraseñas no coinciden");
        return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];

    if (users.some(u => u.username === username)) {
        alert("Ese usuario ya existe");
        return;
    }

    users.push({ username, correo, password });
    localStorage.setItem("users", JSON.stringify(users));

    alert("Usuario creado");
    window.location.href = "login.html";
}
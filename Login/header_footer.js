document.addEventListener("DOMContentLoaded", function () {

    const header = `
        <header class="main-header">
            <nav>
                <a href="index.html">Inicio</a>
                <a href="historia.html">Historia</a>
                <a href="fender.html">Comparativa</a>
                <a href="login.html">Login</a>
            </nav>
        </header>
    `;

    const footer = `
        <footer class="main-footer">
            <p>© 2026 Proyecto Web - Guitarras Gibson</p>
        </footer>
    `;

    document.getElementById("site-header").innerHTML = header;
    document.getElementById("site-footer").innerHTML = footer;

});
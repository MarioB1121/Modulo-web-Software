let pokemon1 = null;
let pokemon2 = null;
let batallaEnCurso = false;

async function cargarPokemon(numero) {
    const input = document.getElementById(`pokemon${numero}Input`).value.toLowerCase().trim();
    const card = document.getElementById(`card${numero}`);

    if (!input) {
        alert("Escribe el nombre o ID del Pokémon");
        return;
    }

    try {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${input}`);
        if (!res.ok) throw new Error("Pokémon no encontrado");

        const data = await res.json();

        const pokemon = {
            id: data.id,
            name: data.name,
            image: data.sprites.other["official-artwork"].front_default || data.sprites.front_default,
            types: data.types.map(t => t.type.name),
            attack: data.stats.find(s => s.stat.name === "attack").base_stat,
            defense: data.stats.find(s => s.stat.name === "defense").base_stat,
            hp: 100,
            turnos: 0,
            defensaEspecialActiva: false,
            moves: data.moves.slice(0, 8).map(m => m.move.name)
        };

        const tiposHTML = pokemon.types
            .map(t => `<span class="type ${t}">${t}</span>`)
            .join(" ");

        card.innerHTML = `
            <span class="poke-id">#${pokemon.id}</span>
            <img src="${pokemon.image}" alt="${pokemon.name}">
            <h2>${capitalizar(pokemon.name)}</h2>
            <p><strong>Tipo:</strong> ${tiposHTML}</p>
            <p><strong>Ataque:</strong> ${pokemon.attack}</p>
            <p><strong>Defensa:</strong> ${pokemon.defense}</p>
        `;

        if (numero === 1) {
            pokemon1 = pokemon;
            document.getElementById("name1").textContent = capitalizar(pokemon.name);
        } else {
            pokemon2 = pokemon;
            document.getElementById("name2").textContent = capitalizar(pokemon.name);
        }

        actualizarVida();

    } catch (error) {
        card.innerHTML = `<p>Error cargando Pokémon</p>`;
        console.error(error);
    }
}

function capitalizar(texto) {
    return texto.charAt(0).toUpperCase() + texto.slice(1);
}

function agregarLog(texto) {
    const log = document.getElementById("battleLog");
    const div = document.createElement("div");
    div.classList.add("log-entry");
    div.innerHTML = texto;
    log.appendChild(div);
    log.scrollTop = log.scrollHeight;
}

function actualizarVida() {
    const life1 = document.getElementById("life1");
    const life2 = document.getElementById("life2");

    if (pokemon1) {
        life1.style.width = `${pokemon1.hp}%`;
        life1.textContent = `${pokemon1.hp}%`;
    }

    if (pokemon2) {
        life2.style.width = `${pokemon2.hp}%`;
        life2.textContent = `${pokemon2.hp}%`;
    }
}

function esperar(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function calcularDanio(atacante, defensor, especial = false) {
    let base = especial ? atacante.attack * 0.6 + 20 : atacante.attack * 0.35;
    let reduccion = defensor.defense * 0.12;
    let danio = Math.round(base - reduccion);

    if (defensor.defensaEspecialActiva) {
        danio = Math.round(danio * 0.5);
        defensor.defensaEspecialActiva = false;
    }

    if (danio < 5) danio = 5;
    return danio;
}

function elegirAccion(pokemon) {
    let opciones = ["ataque"];

    if (pokemon.turnos >= 3) {
        opciones.push("especial");
    }

    if (pokemon.turnos >= 2) {
        opciones.push("defensa");
    }

    const indice = Math.floor(Math.random() * opciones.length);
    return opciones[indice];
}

async function ejecutarTurno(atacante, defensor) {
    atacante.turnos++;
    const accion = elegirAccion(atacante);

    agregarLog(`<strong>Turno de ${capitalizar(atacante.name)}</strong>`);

    if (accion === "ataque") {
        const falla = Math.random() < 0.2;

        if (falla) {
            agregarLog(`${capitalizar(atacante.name)} intentó atacar, pero falló.`);
            return;
        }

        const movimiento = atacante.moves[Math.floor(Math.random() * atacante.moves.length)] || "golpe";
        const danio = calcularDanio(atacante, defensor, false);
        defensor.hp -= danio;
        if (defensor.hp < 0) defensor.hp = 0;

        agregarLog(`${capitalizar(atacante.name)} usó <strong>${capitalizar(movimiento)}</strong>, hizo <strong>${danio}</strong> de daño y a ${capitalizar(defensor.name)} le queda <strong>${defensor.hp}%</strong> de vida.`);
    }

    else if (accion === "especial") {
        const falla = Math.random() < 0.25;

        if (falla) {
            agregarLog(`${capitalizar(atacante.name)} intentó su <strong>ataque especial</strong>, pero falló.`);
            return;
        }

        const danio = calcularDanio(atacante, defensor, true);
        defensor.hp -= danio;
        if (defensor.hp < 0) defensor.hp = 0;

        agregarLog(`${capitalizar(atacante.name)} usó su <strong>ataque especial</strong>, hizo <strong>${danio}</strong> de daño y a ${capitalizar(defensor.name)} le queda <strong>${defensor.hp}%</strong> de vida.`);
    }

    else if (accion === "defensa") {
        const falla = Math.random() < 0.2;

        if (falla) {
            agregarLog(`${capitalizar(atacante.name)} intentó usar <strong>defensa especial</strong>, pero falló.`);
            return;
        }

        atacante.defensaEspecialActiva = true;
        agregarLog(`${capitalizar(atacante.name)} activó su <strong>defensa especial</strong>. El próximo daño recibido será menor.`);
    }
}

async function iniciarBatalla() {
    if (!pokemon1 || !pokemon2) {
        alert("Debes cargar ambos Pokémon");
        return;
    }

    if (batallaEnCurso) return;

    batallaEnCurso = true;

    pokemon1.hp = 100;
    pokemon2.hp = 100;
    pokemon1.turnos = 0;
    pokemon2.turnos = 0;
    pokemon1.defensaEspecialActiva = false;
    pokemon2.defensaEspecialActiva = false;

    document.getElementById("battleLog").innerHTML = "";
    document.getElementById("winnerBox").style.display = "none";

    actualizarVida();

    agregarLog(`<strong>Comienza la batalla entre ${capitalizar(pokemon1.name)} y ${capitalizar(pokemon2.name)}</strong>`);

    let turnoPokemon1 = true;

    while (pokemon1.hp > 0 && pokemon2.hp > 0) {
        let atacante = turnoPokemon1 ? pokemon1 : pokemon2;
        let defensor = turnoPokemon1 ? pokemon2 : pokemon1;

        await ejecutarTurno(atacante, defensor);
        actualizarVida();

        if (defensor.hp <= 0) {
            mostrarGanador(atacante);
            batallaEnCurso = false;
            return;
        }

        turnoPokemon1 = !turnoPokemon1;
        await esperar(1500);
    }

    batallaEnCurso = false;
}

function mostrarGanador(ganador) {
    document.getElementById("winnerImg").src = ganador.image;
    document.getElementById("winnerName").textContent = capitalizar(ganador.name);
    document.getElementById("winnerBox").style.display = "block";

    agregarLog(`<strong>${capitalizar(ganador.name)} es el ganador.</strong>`);
}
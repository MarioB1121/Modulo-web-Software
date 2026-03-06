let listaPokemons = [];

async function cargarPokemons() {
    const container = document.getElementById("pokemonContainer");
    container.innerHTML = "";

    try {
        const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151");
        const data = await res.json();

        const promesas = data.results.map(async (pokemon) => {
            const resPokemon = await fetch(pokemon.url);
            return await resPokemon.json();
        });

        listaPokemons = await Promise.all(promesas);

        mostrarPokemons(listaPokemons);

    } catch (error) {
        container.innerHTML = "<p>Error cargando Pokémon</p>";
        console.error(error);
    }
}

function mostrarPokemons(pokemons) {
    const container = document.getElementById("pokemonContainer");
    container.innerHTML = "";

    pokemons.forEach((pokeData) => {
        const img = pokeData.sprites.front_default;

        const card = document.createElement("div");
        card.classList.add("poke-card");

        const types = pokeData.types
            .map(t => `<span class="type ${t.type.name}">${t.type.name}</span>`)
            .join(" ");

        card.innerHTML = `
            <span class="poke-id">#${pokeData.id}</span>
            <img src="${img}" alt="${pokeData.name}">
            <h2>${pokeData.name}</h2>
            <p><strong>Tipo:</strong> ${types}</p>
            <p><strong>Habilidades:</strong> ${pokeData.abilities.map(a => a.ability.name).join(", ")}</p>
            <p><strong>HP:</strong> ${pokeData.stats[0].base_stat}</p>
            <p><strong>Ataque:</strong> ${pokeData.stats[1].base_stat}</p>
        `;

        container.appendChild(card);
    });
}

function filtrarPokemons() {
    const nombre = document.getElementById("filtroNombre").value.toLowerCase();
    const id = document.getElementById("filtroId").value;
    const tipo = document.getElementById("filtroTipo").value.toLowerCase();

    const filtrados = listaPokemons.filter((pokemon) => {
        const coincideNombre = nombre === "" || pokemon.name.toLowerCase().includes(nombre);
        const coincideId = id === "" || pokemon.id == id;
        const coincideTipo = tipo === "" || pokemon.types.some(t => t.type.name.toLowerCase().includes(tipo));

        return coincideNombre && coincideId && coincideTipo;
    });

    mostrarPokemons(filtrados);
}

function mostrarTodos() {
    document.getElementById("filtroNombre").value = "";
    document.getElementById("filtroId").value = "";
    document.getElementById("filtroTipo").value = "";
    mostrarPokemons(listaPokemons);
}

cargarPokemons();
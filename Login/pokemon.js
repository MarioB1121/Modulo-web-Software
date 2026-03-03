async function cargarDitto() {
  try {
    const res = await fetch("https://pokeapi.co/api/v2/pokemon/ditto");
    const data = await res.json();

    const img =
      data.sprites.other["official-artwork"].front_default ||
      data.sprites.front_default;

    document.getElementById("pokeImg").src = img;
    document.getElementById("pokeName").textContent = data.name;
  } catch (error) {
    document.getElementById("pokeName").textContent = "Error al cargar Pokémon";
  }
}

cargarDitto();
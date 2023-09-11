const pokemonsContainer = document.querySelector("#caja");
const loader = document.querySelector(".pokeballs-container")

const appState = {
    currentURL: "https://pokeapi.co/api/v2/pokemon/?limit=8&offset=0",
    isFetching: false
}

const pokemonTemplate = (pokemon) => {
    return {
        id: pokemon.id,
        name: pokemon.name.toUpperCase(),
        image: pokemon.sprites.other.home.front_default,
        height: pokemon.height / 10,
        weight: pokemon.weight / 10,
        types: pokemon.types,
        experience: pokemon.base_experience
    }
}

const createTypeCards = (types) => {
    return types.map((tipo) => {
        return `<span class="${tipo.type.name}">${tipo.type.name}</span>`
    }).join("")
}

const createPokemonCard = (pokemon) => {

    const {id, name, image, height, weight, types, experience} = pokemonTemplate(pokemon)

    return `
    <div class="poke">
        <img  src="${image}"/>
        <h2>${name}</h2>
        <span class="exp">EXP: ${experience}</span>
        <div class="tipo-poke">
        ${createTypeCards(types)}
        </div>
        <p class="id-poke">#${id}</p>
        <p class="height">Height: ${height}m</p>
        <p class="weight">Weight: ${weight}Kg</p>
    </div>
  `
}

const renderPokemonList = (pokemonList) => {
    pokemonsContainer.innerHTML += pokemonList.map((pokemon) => createPokemonCard(pokemon)).join("")
}

const renderOnScroll = (pokemonList) => {
    loader.classList.toggle("show")
    setTimeout(() => {
        loader.classList.toggle("show");
        renderPokemonList(pokemonList);
        appState.isFetching = false;
    }, 1500)
}

const getPokemonData = async() => {
    const {next, results} = await fetchPokemons(appState.currentURL)

    appState.currentURL = next;

    const pokemonDataUrls = results.map((pokemon)=>pokemon.url)

    const pokemonsData = await Promise.all(pokemonDataUrls.map( async(url) => {
        const nextPokemonData = await fetch(url);
        return await nextPokemonData.json()
    }))
    return pokemonsData
}


const loadAndRenderPokemons = async(renderingFunction) => {
    const pokemonData = await getPokemonData();
    renderingFunction(pokemonData)
}

const isEndOfPage = () => {
    const {scrollTop, clientHeight, scrollHeight} = document.documentElement

    const bottom = scrollTop + clientHeight >= scrollHeight -1;

    return bottom
}

const loadNextPokemons = async() => {
    if (isEndOfPage() && !appState.isFetching) {
        appState.isFetching = true;
        loadAndRenderPokemons(renderOnScroll)
    }
}

const init = () => {
    window.addEventListener("DOMContentLoaded", async() => await loadAndRenderPokemons(renderPokemonList));
    window.addEventListener("scroll", async () => {await loadNextPokemons()})
}

init();
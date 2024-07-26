const params = new URLSearchParams(window.location.search);
const pokemon = params.get('pokemon');

let shiny = false;

const cores = {
    bug: 'greenyellow',
    grass: 'green',
    fairy: 'hotpink',
    normal: 'silver',
    dragon: 'mediumblue',
    psychic: 'lightcoral',
    ghost: 'blueviolet',
    ground: 'brown',
    steel: 'steelblue',
    fire: 'orange',
    flying: 'skyblue',
    ice: 'turquoise',
    electric: 'yellow',
    rock: 'tan',
    dark: 'dimgray',
    water: 'dodgerblue',
    fighting: 'crimson',
    poison: 'darkorchid' 
}
const IMG_URL = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/";

const renderAll = async (poke) => {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${poke}`);
    const poke_data = await response.json();

    renderAbilities(poke_data.abilities);
    renderMoves(poke_data.moves);
    renderStats(poke_data.stats);
    renderSprite(poke);
    renderNameNumber(poke_data.id, poke_data.name);
    renderTypes(poke_data.types);
    renderCry(poke_data.cries.latest);
    renderWeight(poke_data.weight);
}

const renderAbilities = (abilities) => {
    const habilidades = document.querySelector('.habilidades');
    habilidades.innerHTML = "";
    abilities.forEach((ability) => {
        const habilidade = document.createElement("div");
        habilidade.classList.add("habilidade");
        const nome = document.createElement("span");
        nome.classList.add("nome_habilidade");
        nome.innerText = ability["ability"]["name"].replace("-", " ");;
        const tipo = document.createElement("span");
        tipo.classList.add("tipo_habilidade");
        tipo.innerText = ability["is_hidden"] == true? "Hidden": "Normal";
        habilidade.appendChild(nome);
        habilidade.appendChild(tipo);
        habilidades.appendChild(habilidade);
    })
}

const renderMoves = (moves) => {
    const ataques = document.querySelector('.ataques');
    ataques.innerHTML = '';

    moves.forEach((move) => {
        const nome = document.createElement("span");
        nome.classList.add("nome_ataque");
        nome.innerText = move["move"]["name"].replace("-", " ");
        ataques.appendChild(nome);
    })
}

const renderStats = (stats) => {
    const nome_status = document.querySelectorAll(".nome_stat");
    nome_status.forEach((nome_stat, index) => {
        nome_stat.innerText += (": " + String(stats[index]["base_stat"]));
        const statbar = document.getElementById(stats[index]["stat"]["name"]);
        statbar.style.width = String((100*stats[index]["base_stat"])/255)+"%";
    })

}

const renderSprite = (poke) => {
    const gif1 = document.getElementById("poke-gif1");
    const gif2 = document.getElementById("poke-gif2");
    gif2.style.display = "none";
    gif1.src = IMG_URL+String(poke)+".gif";
    gif2.src = IMG_URL+"shiny/"+String(poke)+".gif";
    setInterval(function() {
        if (shiny == true){
            gif2.style.display = "none";
            gif1.style.display = "block";
            shiny = false;
        }
        else{
            gif2.style.display = "block";
            gif1.style.display = "none";
            shiny = true;
        }
    }, 4000)
}

const renderNameNumber = (id, name) => {
    const numero = document.querySelector(".numero");
    const nome = document.querySelector(".nome");

    numero.innerText = String(id);
    nome.innerText = name.replace("-", " ");

    document.querySelector(".textinfo").innerText = name.replace("-", " ");
}

const renderTypes = (types) => {
    const type1 = document.getElementById("type1");
    const type2 = document.getElementById("type2");

    type1.innerText = types[0]["type"]["name"];
    type1.style.backgroundImage = `url(../icons/${types[0]["type"]["name"]}.svg)`;
    type1.style.backgroundColor = cores[types[0]["type"]["name"]];

    if (types.length == 2){
        type2.style.display = "block";
        type2.innerText = types[1]["type"]["name"];
        type2.style.backgroundImage = `url(../icons/${types[1]["type"]["name"]}.svg)`;
        type2.style.backgroundColor = cores[types[1]["type"]["name"]];
    }
    else{
        type2.style.display = "none";
    }
}

const renderCry = (cry) => {
    const audio = new Audio(cry);
    const cry_button = document.querySelector(".cry");

    cry_button.addEventListener("click", (e)=>{
        e.preventDefault();
        audio.play();
    })
}

const renderWeight = (peso) => {
    const weight = document.querySelector(".weight");
    weight.innerText = String(peso/10);
}

renderAll(pokemon);

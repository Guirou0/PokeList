const listaI = document.getElementById('lista');
const listaC = document.querySelector('.lista');
const shiny_slider = document.querySelector('.slider');
const checkbox = document.getElementById('check');
const pagination_list = document.querySelector('.pagination');
let pagination = [1,2,3,4];
let page = 1;
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

const getPokemons = async (amount, start) => {
   const response = await fetch(`http://pokeapi.co/api/v2/pokemon/?limit=${amount}&offset=${start}`)

   const data = await response.json();
   return data;
}

const getTypes = (data) => {
   const types = data.types;
   const format_type = Object.keys(types).length == 1? `<div class="types"><button class="type1" id="type1" style="background-color: ${cores[types[0]["type"]["name"]]}">${types[0]["type"]["name"]}</button></div>`: `<div class="types"><button class="type1" id="type1" style="background-color: ${cores[types[0]["type"]["name"]]}">${types[0]["type"]["name"]}</button> <button class="type2" id="type2" style="background-color: ${cores[types[1]["type"]["name"]]}">${types[1]["type"]["name"]}</button></div>`;
   return format_type;
}

const renderPokemons = async (amount, start) => {
    listaC.innerHTML = "";

    const data = await getPokemons(amount, start);
    const pokemonList = data.results;
    
    let urls = [];
    pokemonList.forEach((pokemon)=>{
        urls.push(pokemon.url);
    });
    
    const fetchPromises = urls.map(url=>fetch(url));
    const responses = await Promise.all(fetchPromises);
    const jsonPromises = responses.map(response => response.json());
    const poke_data = await Promise.all(jsonPromises);
    
    const types = poke_data.map(getTypes);
    
    pokemonList.forEach((pokemon, index) => {
        const poke = document.createElement("div");
        poke.classList.add("pokemon");
        const pokeNumber =  start + 1 + index;
        const format_type = types[index];
        const pokeSprite = shiny == true? IMG_URL+"shiny/"+String(pokeNumber)+".gif" : IMG_URL+String(pokeNumber)+".gif";
        poke.innerHTML = `<div class="image"> <img src="${pokeSprite}" alt="pokemon" class="pokemon_image"> </div> <div class="poke-name">${String(pokeNumber)+" - "+pokemon.name}</div> ${format_type}`;
        listaI.appendChild(poke);
        poke.addEventListener("click", (e)=> {
            e.preventDefault();
            window.location.href = `redirect.html?pokemon=${pokeNumber}`;
        }) 
    });
}

const round_right = (pagination) => {
    if (pagination[0]>=62){
        return [1,2,3,4]
    }
    else {
        return pagination.slice(1).concat([pagination[3]+1])
    }
}

const round_left = (pagination) => {
    if (pagination[0]==1){
        return [62,63,64,65]
    }
    else {
        return [pagination[0]-1].concat(pagination.slice(0,3))
    }
}

const renderPagination = (first) => {
    pagination_list.innerHTML = '';
    pagination = [first, first+1, first+2, first+3];
    
    const prev = document.createElement("button");
    prev.classList.add("prev");
    prev.addEventListener("click", (event)=>{
        event.preventDefault();
        pagination = round_left(pagination);
        renderPagination(pagination[0]);
    })
    pagination_list.appendChild(prev);

    pagination.forEach((number)=>{
        const num = document.createElement("button");
        num.classList.add("number");
        num.innerHTML = String(number);
        num.addEventListener("click", function(e) {
            e.preventDefault();
            const num = Number(this.innerHTML);
            page = num;
            if (num>=62){
                renderPagination(62);
            }
            else{
                renderPagination(num);
            }
            num == 65? renderPokemons(9, 10*(num-1)) : renderPokemons(10,10*(num-1));
        })
        pagination_list.append(num);
    })

    const next = document.createElement("button");
    next.classList.add("next");
    next.addEventListener("click", (event)=>{
        event.preventDefault();
        pagination = round_right(pagination);
        renderPagination(pagination[0]);
    })
    pagination_list.appendChild(next);
}

shiny_slider.addEventListener("click", (e) => {
    e.preventDefault();
    shiny = !shiny;
    checkbox.checked = !checkbox.checked;
    console.log(page)
    page !=65? renderPokemons(10,10*(page-1)): renderPokemons(9, 10*(page-1));
})

console.log("Init \n");
renderPokemons(10,0);
renderPagination(1);
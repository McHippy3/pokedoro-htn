// Constants
const pokemonName = document.querySelector('#pokemon_name')
const image = document.querySelector('.pokemon_image')
const pokeButton = document.querySelector('#poke')
const greatButton = document.querySelector('#great')
const ultraButton = document.querySelector('#ultra')
const level = document.querySelector('span')
const myPokemon = document.querySelector('#pokeball')
const myPokemonButton = document.querySelector('#my_pokemon_button')
const time = document.querySelector('#countdown')
const timeButton = document.querySelector('#timer_button')
var running = false;

const FAIL_MESSAGES = [
    'Oh no! The Pokémon broke free!',
    'Aww! It appeared to be caught!',
    'Aargh! Almost had it!',
    'Shoot! It was so close, too!'
];

// Send message to background and retrieve a pokemon
chrome.runtime.sendMessage({ text: "Pokemon please!" }, showPokemon)

// Set pokemon name and image
function showPokemon(response) {
    pokemonName.innerText = 'A wild ' + response.name + ' appeared!'
    image.src = response.imageUrl
    level.innerText = 'Level ' + response.level
    catchPokemon(response)
}


function catchPokemon(response) {

    const url = 'http://167.71.101.168:8000/catch_pokemon'

    pokeButton.addEventListener('click', () => {
        console.log("CLICKED");
        let pokemonList = JSON.parse(localStorage.getItem('pokemonList')) || []
        const found = pokemonList.find(pokemon => pokemon.name == response.name && pokemon.level == response.level)

        if (!found) {
            pokemonList.push(response)
            localStorage.setItem('pokemonList', JSON.stringify(pokemonList))

            data = {
                "user_id": 1,
                "ball_type": 1,
                "level": response.level,
                "pokemon": response.name
            };

            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            }).then(response => response.json()).then(data => {
                if (data.status == 'failed') {
                    pokemonName.innerText = array[Math.floor(Math.random() * array.length)];
                } else {
                    pokemonName.innerText = 'Gotcha! You caught ' + response.name + '!';
                }
            });

        } else {
            pokemonName.innerText = 'You already caught this pokemon.'
        }

    })

    greatButton.addEventListener('click', () => {
        let pokemonList = JSON.parse(localStorage.getItem('pokemonList')) || []
        const found = pokemonList.find(pokemon => pokemon.name == response.name && pokemon.level == response.level)

        if (!found) {
            pokemonList.push(response)
            localStorage.setItem('pokemonList', JSON.stringify(pokemonList))

            data = {
                "user_id": 1,
                "ball_type": 2,
                "level": response.level,
                "pokemon": response.name
            };
            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            }).then(response => response.json()).then(data => {
                if (data.status == 'failed') {
                    pokemonName.innerText = array[Math.floor(Math.random() * array.length)];
                } else {
                    pokemonName.innerText = 'Gotcha! You caught ' + response.name + '!';
                }
            });

        } else {
            pokemonName.innerText = 'You already caught this pokemon.'
        }

    })

    ultraButton.addEventListener('click', () => {
        let pokemonList = JSON.parse(localStorage.getItem('pokemonList')) || []
        const found = pokemonList.find(pokemon => pokemon.name == response.name && pokemon.level == response.level)

        if (!found) {
            pokemonList.push(response)
            localStorage.setItem('pokemonList', JSON.stringify(pokemonList))

            data = {
                "user_id": 1,
                "ball_type": 3,
                "level": response.level,
                "pokemon": response.name
            };

            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            }).then(response => response.json()).then(data => {
                if (data.status == 'failed') {
                    pokemonName.innerText = array[Math.floor(Math.random() * array.length)];
                } else {
                    pokemonName.innerText = 'Gotcha! You caught ' + response.name + '!';
                }
            });

            /*$.post(url, data, (data, status) => {
                console.log(data);
                console.log(status);
                if (data.status == 'succeeded') {
                    pokemonName.innerText = 'Gotcha! You caught ' + response.name + '!';
                } else {
                    pokemonName.innerText = array[Math.floor(Math.random() * array.length)];
                }

            });*/

        } else {
            pokemonName.innerText = 'You already caught this pokemon.'
        }

    })

}



timeButton.addEventListener('click', () => {
    running = !running;
    chrome.runtime.sendMessage({ text: "Toggle" }, response => { return; });

    if (running) {
        timeButton.innerText = 'Pause Timer'
    } else {
        timeButton.innerText = 'Start Timer'
    }

})



// Send message to background and retrieve time
function foo() {
    chrome.runtime.sendMessage({ text: "Time please!" }, showTime);
}

foo()
setInterval(foo, 1000);

// Send message to background and retrieve time
function showTime(response) {
    time.innerText = response.minutes + ':' + response.seconds;

    if (!response.onBreak) {
        document.getElementById("catching_area").style.visibility = "hidden";
    } else {
        document.getElementById("catching_area").style.visibility = "";
    }

}



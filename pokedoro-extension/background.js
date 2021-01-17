console.log('background script running!')

const GOOD_TABS = [
  'https://learn.uwaterloo.ca/'
];

// Timer stuff
const startingMinutes = 0.3;
const breakingMinutes = 0.2;
let time = startingMinutes * 60;
let onBreak = false;
let run = false;

const POINTS_PER_SECOND = 2;
let points = 0;

setInterval(updateCountdown, 1000);

function updateCountdown() {
  if (run) {
    time--;
  }
}

chrome.runtime.onMessage.addListener(toggleTime)
function toggleTime(request, sender, sendResponse) {
  if (request.text === "Toggle") {
    run = !run;
    sendResponse(null);
  }
}

chrome.runtime.onMessage.addListener(sendBackTime)
function sendBackTime(request, sender, sendResponse) {
  if (request.text === "Time please!") {
    const minutes = Math.floor(time / 60);
    let seconds = time % 60;
    seconds = seconds < 10 ? '0' + seconds : seconds;

    if (time == 0 && !onBreak) {

      // Notification
      chrome.notifications.create('', {
        title: "Time to take a break!",
        message: "You've been working for " + startingMinutes + " minutes",
        iconUrl: 'ball.png',
        type: 'basic'
      });

      time = breakingMinutes * 60;
      onBreak = true
    } else if (time == 0 && onBreak) {

      // Notification
      chrome.notifications.create('', {
        title: "Break time over!",
        message: "You've taken a break for " + startingMinutes + " minutes",
        iconUrl: 'ball.png',
        type: 'basic'
      });

      time = startingMinutes * 60;
      onBreak = false;
    }

    sendResponse({ 'minutes': minutes, 'seconds': seconds, 'onBreak': onBreak });
    return true;
  }
}

// Current Pokemon object
let currentPokemon = {
  name: "",
  imageUrl: "",
  level: 0
}

setInterval(() => {
  console.log("called");
  chrome.tabs.query({
    active: true,
    lastFocusedWindow: true
  },
    tabs => {
      if (tabs.length > 0) {
        let activeTabURL = tabs[0].url;
        for (str of GOOD_TABS) {
          if (activeTabURL.startsWith(str)) {
            points += POINTS_PER_SECOND;
            return;
          }
        }
      }
    });
}, 10000);

// Fetch a new pokemon on new tab open
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {

  const pokemonID = Math.ceil(Math.random() * 151)
  fetch('https://pokeapi.co/api/v2/pokemon/' + pokemonID) // fetch the pokemon
    .then(response => response.json())
    .then(json => setAttributes(json))

  if (changeInfo["status"] === "complete") {
    chrome.tabs.query({
      active: true,
      lastFocusedWindow: true
    },
      tabs => {
        let activeTabURL = tabs[0].url;
        for (str of GOOD_TABS) {
          if (activeTabURL.startsWith(str)) {
            points
            return;
          } else {
            // do shit not on learn tab
          }
        }

        // use `url` here inside the callback because it's asynchronous!
      });
  }
});


// Set the current Pokemon's attributes
function setAttributes(json) {
  currentPokemon.name = json.forms[0].name
  currentPokemon.imageUrl = json.sprites.front_default
  currentPokemon.level = Math.ceil(Math.random() * 100)
}

// Send back a Pokemon upon request from the popup
chrome.runtime.onMessage.addListener(sendBackPoke)
function sendBackPoke(request, sender, sendResponse) {
  if (request.text === "Pokemon please!") {
    sendResponse(currentPokemon)
    return true;
  }
}

setInterval(() => {
  const url = 'http://167.71.101.168:8000/add_points';
  data = {
    "user_id": 1,
    "points": points
  };
  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
}, 60000);
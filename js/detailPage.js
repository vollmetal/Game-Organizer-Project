const API_KEY = '?key=c9c9bfee8c9142a39a386a9fdc2edd22';
const BASE_URL = 'https://api.rawg.io/api/';

const detailWindow = document.getElementById('detailWindow')
const gameTitle = document.getElementById('gameTitle')
const gameBackground = document.getElementById('gameBackground')

const detailTab = document.getElementById('details')
const imagesTab = document.getElementById('gameImages')
const reviewsTab = document.getElementById('gameReviews')
const newsTab = document.getElementById('gameNews')

let gameID = 3498;
let fetchPosition = 'games'

let finishedURL = '';

let currentTab = 'DETAILS'


finishedURL = `${BASE_URL}${fetchPosition}/${gameID}${API_KEY}`

function callAPI (apiURL, drawCall)
{
    fetch(apiURL)
.then(function (result) {
    return result.json()
})
.then (function (gameResult) {
    drawCall(gameResult)
})
.catch(function(error) {
    console.log(error)
})
}

function drawDetailTab (info) {
    let tabString = `<div id="detailHeader">
    <h2 id="ESRBRating">Rated: ${info.esrb_rating.name}</h2>
    <h2 id="releaseDate">Released: ${info.released}</h2>
  </div>
  <div id="detailBody">
    <p id="description">${info.description}</p>
  </div>`

  detailWindow.innerHTML = tabString
}

function drawTop (info) {
    gameTitle.innerHTML = info.name
    gameBackground.src = info.background_image
}

callAPI(finishedURL, drawTop)
callAPI(finishedURL, drawDetailTab)
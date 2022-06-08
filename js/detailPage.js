const API_KEY = '?key=c9c9bfee8c9142a39a386a9fdc2edd22';
const BASE_URL = 'https://api.rawg.io/api/';

const detailWindow = document.getElementById('detailWindow')
const gameTitle = document.getElementById('gameTitle')
const gameBackground = document.getElementById('gameBackground')

const detailTab = document.getElementById('details')
const imagesTab = document.getElementById('gameImages')
const reviewsTab = document.getElementById('gameReviews')
const newsTab = document.getElementById('gameNews')

const urlSearchParams = new URLSearchParams(window.location.search);
const params = Object.fromEntries(urlSearchParams.entries());

console.log(params)

let gameID = params.id;
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

var tabButtons=document.querySelectorAll(".tabs .tabs_bar button")
var tabPanels=document.querySelectorAll(".tabs .tabPanel ")

function showPanel(panelIndex, colorCode) {
    tabButtons.forEach(function(node){
        node.style.backgroundColor="";
        node.style.color="";
    });
    tabButtons[panelIndex].style.backgroundColor=colorCode;
    tabButtons[panelIndex].style.color="white";
    tabPanels.forEach(function(node) {
        node.style.display="none";
    });
    tabPanels[panelIndex].style.display="block"
    tabPanels[panelIndex].style.backgroundColor=colorCode;
}
function drawDetailTab (info) {
    let ratingElement = ''
    let descriptionElement = ''
    let releaseElement = ''
    if (info.esrb_rating == null)
    {
        ratingElement = `Not yet rated`
    }
    else {
        ratingElement = `<h2 id="ESRBRating">Rated: ${info.esrb_rating.name}</h2>`
    }
    if (info.description == null) {
        descriptionElement = `No Description`
    }
    else {
        descriptionElement = `
        <div id="detailBody">
          <p id="description">${info.description}</p>
        </div>`
    }
    if (info.released == null) {
        releaseElement = `No release date found`
    }
    else {
        releaseElement = `<h2 id="releaseDate">Released: ${info.released}</h2>`
    }
    let tabString = `<div id="detailHeader">
    ${ratingElement}
    ${releaseElement}
    </div>
    ${descriptionElement}`

  detailWindow.innerHTML = tabString
}

function drawTop (info) {
    gameTitle.innerHTML = info.name
    gameBackground.src = info.background_image
}

callAPI(finishedURL, drawTop)
callAPI(finishedURL, drawDetailTab)

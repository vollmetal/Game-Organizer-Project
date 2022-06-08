const API_KEY = '?key=c9c9bfee8c9142a39a386a9fdc2edd22';
const BASE_URL = 'https://api.rawg.io/api/';

const detailWindow = document.getElementById('detailWindow')
const gameTitle = document.getElementById('gameTitle')
const gameBackground = document.getElementById('gameBackground')

const detailTab = document.getElementById('details')
const imagesTab = document.getElementById('gameImages')
const reviewsTab = document.getElementById('reviewsTab')
const newsTab = document.getElementById('gameNews')

const reviewList = document.getElementById('reviewList')

const urlSearchParams = new URLSearchParams(window.location.search);
const params = Object.fromEntries(urlSearchParams.entries());

console.log(params)

let gameID = params.id;
let fetchPosition = 'games'

let finishedURL = '';
let searchOrder = '';

let selectedGameInfo = ''

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
    drawReviewsTab(gameResult.metacritic_platforms)
    selectedGameInfo = gameResult
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


let searchSortButton = document.getElementById('searchSortButton')
function selectSortItem (dropdownIndex) {
    let searchSort = searchSortButton.parentElement.querySelectorAll(".dropdown-item")
    searchSortButton.innerHTML = searchSort[dropdownIndex].innerHTML
    searchOrder = searchSort[dropdownIndex].innerHTML

}



function drawDetailTab (info) {
    let ratingElement = ''
    let descriptionElement = ''
    let releaseElement = ''
    if (info.esrb_rating == null)
    {
        ratingElement = `<h2 id="ESRBRating">NOT YET RATED</h2>`
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
        releaseElement = `<h2 id="releaseDate">NO RELEASE DATE FOUND</h2>`
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

function drawReviewsTab (info) {
    let ratings = info.map(function (rating) {
        return `<li class="reviewCard">
        <div class="card">
          <div class="cardBody">
            <h3 class="reviewRating">${rating.metascore}</h3>
            <p class="reviewPlatform">${rating.platform.name}</p>
            <a href="${rating.url}" class="reviewLink">Rerview Page</a>
          </div>
        </div>
      </li>`
    })
    reviewList.innerHTML = ratings

}

function drawTop (info) {
    gameTitle.innerHTML = info.name
    gameBackground.src = info.background_image
}

callAPI(finishedURL, drawTop)
callAPI(finishedURL, drawDetailTab)
showPanel(0, 'gray')

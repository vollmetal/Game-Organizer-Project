const API_KEY = '?key=c9c9bfee8c9142a39a386a9fdc2edd22';
const BASE_URL = 'https://api.rawg.io/api/';

const detailWindow = document.getElementById('detailWindow')
const gameTitle = document.getElementById('gameTitle')
const gameBackground = document.getElementById('gameBackground')

const TABS_PANEL = document.getElementById('pageTabs')

const platformList = document.getElementById('platformList')
const IMAGES_LIST = document.getElementById('gameImages')

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

function callAPI(apiURL, drawCall) {
    fetch(apiURL)
        .then(function (result) {
            return result.json()
        })
        .then(function (gameResult) {
            drawCall(gameResult)
            drawPlatformsTab(gameResult)
        })
        .catch(function (error) {
            console.log(error)
        })
}

function drawDetailTab(info) {

    let descriptionElement = ''
    let releaseElement = ''
    //Create the ESRB rating element to display
    let ratingElement = ''
    if (info.esrb_rating == null) {
        ratingElement = `<img id="ESRBRating" src="images/ESRB/rating pending.svg" alt="">`
    }
    else {
        if (info.esrb_rating.name == "Adults Only") {
            ratingElement = `<img id="ESRBRating" src="images/ESRB/adults-only.png" alt="">`
        }
        if (info.esrb_rating.name == "Mature") {
            ratingElement = `<img id="ESRBRating" src="images/ESRB/mature.png" alt="">`
        }
        if (info.esrb_rating.name == "Teen") {
            ratingElement = `<img id="ESRBRating" src="images/ESRB/teen.png" alt="">`
        }
        if (info.esrb_rating.name == "Everyone") {
            ratingElement = `<img id="ESRBRating" src="images/ESRB/everyone.png" alt="">`
        }

    }
    //check if description is available and create elements to display
    if (info.description == null) {
        descriptionElement = `No Description`
    }
    else {
        descriptionElement = `
        <div id="detailBody">
          <p id="description">${info.description}</p>
        </div>`
    }
    //check if release date is available and create elements to display
    if (info.released == null) {
        releaseElement = `<span id="releaseDate">NO RELEASE DATE FOUND</span>`
    }
    else {
        releaseElement = `<h2 id="releaseDate">Released: ${info.released}</h2>`
    }
    //combine all elements before inserting into main display
    let tabString = `<div id="detailHeader">
    ${ratingElement}
    ${releaseElement}
    </div>
    ${descriptionElement}`

    detailWindow.innerHTML = tabString
}

//makes the Platforms section
function drawPlatformsTab(info) {


    let platforms = info.platforms.map(function (platform) {
        let platformRequirements = ''
        let platformId = -1
        let platformRatingElement = ''
        //Set Requirements Section
        if (platform.requirements.minimum == null && platform.requirements.recommended == null) {

        }
        else {
            platformRequirements = `<div class="platformSpecs">
            <p class="minimumRequirements">${platform.requirements.minimum}</p>
            <p class="maximumRequirements">${platform.requirements.recommended}</p>
          </div>`
        }
        //Set Ratings Section
        if (info.metacritic_platforms.length > 0) {
            for (let index = 0; index < info.metacritic_platforms.length; index++) {
                const reviewPlatform = info.metacritic_platforms[index]
                if (reviewPlatform.platform.name == platform.platform.name) {
                    platformId = index
                    break
                }

            }
            console.log(platformId)
            if (platformId > -1) {
                platformRatingElement = `<div class="ratingSection">

            <h5 class="platformRating">Metascore = ${info.metacritic_platforms[platformId].metascore}/100</h5>
            <a href="${info.metacritic_platforms[platformId].url}" class="reviewLink">Metacritic Page</a>
          </div>`
            }

        }
        
        let platformReleaseDate = ''
        if (platform.released_at == null)
        {

        }
        else {
            platformReleaseDate = `<span>Released on: ${platform.released_at}</span>`
        }

        return `<li class="platformCard">
        <div class="card">
        <div class="cardBody">
                        
        <h3 class="platformName">${platform.platform.name}</h3>
        ${platformReleaseDate}
        ${platformRequirements}
        ${platformRatingElement}
        
      </div>
        </div>
      </li>`
    })
    platformList.innerHTML = platforms.join('')

}

function returnToMainPage () {
    window.history.back()
}
//creates the title and main image
function drawTop(info) {
    gameTitle.innerHTML = info.name
    gameBackground.src = info.background_image
}

callAPI(finishedURL, drawTop)
callAPI(finishedURL, drawDetailTab)
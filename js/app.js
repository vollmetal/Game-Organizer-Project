const API_KEY = 'key=c9c9bfee8c9142a39a386a9fdc2edd22';
const BASE_URL = 'https://api.rawg.io/api/';

const PLATFORM_FILTER_CLASS = 'platformFilter'
const GENRE_FILTER_CLASS = 'genreFilter'

const PLATFORM_FILTER_ELEMENT = document.getElementById('platformFilter')
const GENRE_FILTER_ELEMENT = document.getElementById('genreFilter')
const GAME_LIST_ELEMENT = document.getElementById('gameList')

const SEARCH_BUTTON = document.getElementById('searchButton')

let fetchPosition = 'games'

let filterPlatforms = []
let filterGenres = []

let finishedURL = '';

function lookAtPage (positions = '', keys = '') {
    return `${BASE_URL}${positions}?${keys}${API_KEY}`
}

function getFilterData (url, displayFunction, displayElement, filterClass, filterTracker) {
    fetch(lookAtPage(url))
    .then(function (results) {
        return results.json()
    })
    .then(function (resultData) {
        console.log(resultData)
        displayFunction(resultData.results, displayElement, filterClass, filterTracker)
    })
    .catch(function(error) {
        console.log(error)
    })
}

function displayFilters(info, element, elementName, filterTracker) {
    
    let tempString = info.map(function (filterElement) {
        return `<input type="checkbox" name="" class="${elementName}Item" id="${filterElement.id}">${filterElement.name}</input>`
    })
    element.innerHTML = tempString
    console.log(element.getElementsByClassName(`${elementName}Item`))
    let filters = element.getElementsByClassName(`${elementName}Item`)
    for (let index = 0; index < filters.length; index++) {
        const element = filters[index];
        element.addEventListener('change', function() {
            
            console.log(filters[index].id)
            if (filterTracker.includes(filters[index].id))
            {
                console.log(filterTracker.findIndex(function(index) {
                    return index == filters[index].id
                }))
                filterTracker.splice(filterTracker.findIndex(function(index) {
                    return index == filters[index].id
                }), 1)
            }
            else
            {
                filterTracker.push(filters[index].id)
            }
            console.log(filterTracker)
        })
        
    }
}

function getGameData (urlKeys, displayFunction) {
    fetch(lookAtPage('games', urlKeys))
    .then(function(results) {
        return results.json()
    })
    .then (function (gameResults) {
        console.log(gameResults)
        displayFunction(gameResults.results)
    })
    .catch(function (error) {
        console.log(error)
    })
}

function displayGame (info) {
    let tempString = info.map(function (game) {
        return `<li class="gameCard">
        <div class="card">
          <img src="${game.background_image}" alt="" class="gameImage" />
          <div class="cardBody">
            <h3 class="gameName">${game.name}</h3>
            <p class="gameShortDescription">test</p>
            <a href="gamedetails.html?${game.id}" class="gameDetails">More information</a>
          </div>
        </div>
      </li>`
    })
    GAME_LIST_ELEMENT.innerHTML = tempString.join('')
}

SEARCH_BUTTON.addEventListener('click', function () {
    let fullPlatformString = ''
    let fullGenreString = ''
    if (filterPlatforms.length > 0 && filterGenres.length > 0)
    {
        fullPlatformString = `platforms=${filterPlatforms.join(',')}`
        fullGenreString = `&genres=${filterGenres.join(',')}&`
    }
    else if(filterPlatforms.length > 0)
    {
        fullPlatformString = `platforms=${filterPlatforms.join(',')}&`
    }
    else if (filterGenres.length > 0)
    {
        fullGenreString = `genres=${filterGenres.join(',')}&`
    }
    
    getGameData(`${fullPlatformString}${fullGenreString}`, displayGame)
})

getFilterData('genres', displayFilters, GENRE_FILTER_ELEMENT, GENRE_FILTER_CLASS, filterGenres)
getFilterData('platforms', displayFilters, PLATFORM_FILTER_ELEMENT, PLATFORM_FILTER_CLASS, filterPlatforms)
getGameData(``, displayGame)
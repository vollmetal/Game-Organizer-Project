const API_KEY = 'key=c9c9bfee8c9142a39a386a9fdc2edd22';
const BASE_URL = 'https://api.rawg.io/api/';

const PLATFORM_FILTER_CLASS = 'platformFilter'
const GENRE_FILTER_CLASS = 'genreFilter'

const PLATFORM_FILTER_ELEMENT = document.getElementById('platformFilter')
const GENRE_FILTER_ELEMENT = document.getElementById('genreFilter')
const GAME_LIST_ELEMENT = document.getElementById('gameList')
const SEARCH_TEXT_BOX = document.getElementById('titleSearchBox')

const SEARCH_BUTTON = document.getElementById('searchButton')
const PAGE_NAVIGATOR = document.getElementById('pageNaviagtion')

const SORT_BUTTON = document.getElementById('searchSortButton')
const SORT_BY_POPULARITY = document.getElementById('searchSortPopularity')
const SORT_BY_AZ = document.getElementById('searchSortAlphaAscending')
const SORT_BY_ZA = document.getElementById('searchSortAlphaDescending')

let fetchPosition = 'games'

let filterPlatforms = []
let filterGenres = []

let currentPage = 1

let finishedURL = '';
let searchSort = ''
let pageSize = 50

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
    fetch(urlKeys)
    .then(function(results) {
        return results.json()
    })
    .then (function (gameResults) {
        console.log(gameResults)
        displayFunction(gameResults.results)
        displayPageNavigator(gameResults)
    })
    .catch(function (error) {
        console.log(error)
    })
}

function displayPageNavigator (info) {
    let nextPage = ``
    let previousPage = ``

    if (info.next == null)
    {
        nextPage = `<li class="page-item disabled"><span class="page-link">Next</span></li>`
    }
    else 
    {
        nextPage = `<li class="page-item"><button class="page-link" id="nextButton">Next</button></li>`
    }
    if (info.previous == null)
    {
        previousPage = `<li class="page-item disabled"><span class="page-link">Previous</span></li>`
    }
    else 
    {
        previousPage = `<li class="page-item"><button class="page-link" id="previousButton">Previous</button></li>`
    }
    PAGE_NAVIGATOR.innerHTML = `${previousPage}${nextPage}`
    let nextPageButton = document.getElementById('nextButton')
    let previousPageButton = document.getElementById('previousButton')
        nextPageButton.addEventListener('click', function () {
            currentPage++
            getGameData(info.next, displayGame)
        })
    
        previousPageButton.addEventListener('click', function () {
            currentPage--
            getGameData(info.previous, displayGame)
        })
    
}

function displayGame (info) {
    let tempString = info.map(function (game) {
        return `<li class="gameCard">
        <div class="card">
          <img src="${game.background_image}" alt="No Image Found" class="gameImage" />
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

function gameSearchSetup () {
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

    return `${fullPlatformString}${fullGenreString}`
}

SEARCH_BUTTON.addEventListener('click', function () {
    
    currentPage = 1
    getGameData(lookAtPage('games', `${gameSearchSetup()}search=${SEARCH_TEXT_BOX.value}&ordering=${searchSort}&page_size=${pageSize}&`), displayGame)
})

SORT_BY_POPULARITY.addEventListener('click', function() {
    searchSort = 'rating'
    SORT_BUTTON.innerHTML = "Highest Rated"
})

SORT_BY_AZ.addEventListener('click', function() {
    searchSort = 'name'
    SORT_BUTTON.innerHTML = "Alphabetical A-Z"
})

SORT_BY_ZA.addEventListener('click', function() {
    searchSort = '-name'
    SORT_BUTTON.innerHTML = "Alphabetical Z-A"
})

searchSort = 'rating'
SORT_BUTTON.innerHTML = "Highest Rated"
getFilterData('genres', displayFilters, GENRE_FILTER_ELEMENT, GENRE_FILTER_CLASS, filterGenres)
getFilterData('platforms', displayFilters, PLATFORM_FILTER_ELEMENT, PLATFORM_FILTER_CLASS, filterPlatforms)
getGameData(lookAtPage('games', `ordering=${searchSort}&page_size=${pageSize}&`), displayGame)
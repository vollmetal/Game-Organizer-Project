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
const SORT_TYPES = ['rating', 'name', '-name']

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
        return `<div class="filterBox">
        <input type="checkbox" name="" class="${elementName}Item" id="${filterElement.id}">
        <h4>${filterElement.name}</h4>
      </div>`
    })
    element.innerHTML = tempString.join('')
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
        <a href="gamedetails.html?id=${game.id}" class="card">
          <img src="${game.background_image}" alt="No Image Found" class="gameImage" />
          <div class="cardBody">
            <h3 class="gameName">${game.name}</h3>
            <p class="gameShortDescription">test</p>
          </div>
        </a>
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
    getGameData(lookAtPage('games', `${gameSearchSetup()}search=${SEARCH_TEXT_BOX.value}&search_precise=True&search_exact=True&ordering=${searchSort}&page_size=${pageSize}&`), displayGame)
})

function sortSetup(index) {
    let sortButton = document.getElementById('searchSortButton')
    let menuItems = SORT_BUTTON.parentElement.querySelectorAll('.dropdown-item')
    searchSort = SORT_TYPES[index]
    console.log(SORT_BUTTON.innerText)
    console.log(menuItems[index])
    sortButton.innerHTML = menuItems[index].innerHTML
}

searchSort = 'rating'
SORT_BUTTON.innerHTML = "Highest Rated"
getFilterData('genres', displayFilters, GENRE_FILTER_ELEMENT, GENRE_FILTER_CLASS, filterGenres)
getFilterData('platforms', displayFilters, PLATFORM_FILTER_ELEMENT, PLATFORM_FILTER_CLASS, filterPlatforms)
getGameData(lookAtPage('games', `ordering=${searchSort}&page_size=${pageSize}&`), displayGame)
const API_KEY = 'key=c9c9bfee8c9142a39a386a9fdc2edd22';
const BASE_URL = 'https://api.rawg.io/api/';

const SPECIFIC_FILTERS = 'specificFilters'
const FILTER_ACTIVE_COLOR = '#7446bd'
const FILTER_INACTIVE_COLOR = 'rgb(137, 137, 137)'

const PLATFORM_FILTER_ELEMENT = document.getElementById('platformFilter')
const GENRE_FILTER_ELEMENT = document.getElementById('genreFilter')
const TAG_FILTER_ELEMENT = document.getElementById('tagFilter')

const GAME_LIST_ELEMENT = document.getElementById('gameList')
const SEARCH_TEXT_BOX = document.getElementById('titleSearchBox')


const SEARCH_BUTTON = document.getElementById('searchButton')
const PAGE_NAVIGATOR = document.getElementById('pageNaviagtion')
const PAGE_DISPLAY = document.getElementById('pageDisplay')

const SORT_BUTTON = document.getElementById('searchSortButton')
const SORT_TYPES = ['-rating', 'rating', 'name', '-name']

const SEARCH_SIZE_BUTTON = document.getElementById('searchSizeButton')
const SEARCH_SIZES = [10, 20, 30, 40]

let fetchPosition = 'games'

let filterPlatforms = []
let filterGenres = []
let filterTags = []

let currentPage = 1
let totalPages = 1

let finishedURL = '';
let searchSort = ''
let pageSize = 50

function lookAtPage (positions = '', keys = '') {
    return `${BASE_URL}${positions}?${keys}${API_KEY}`
}

function getFilterData (url, displayFunction, displayElement, filterClass, filterTracker) {
    fetch(lookAtPage(url, 'page_size=40&'))
    .then(function (results) {
        return results.json()
    })
    .then(function (resultData) {
        displayFunction(resultData.results, displayElement, filterClass, filterTracker)
    })
    .catch(function(error) {
        console.log(error)
    })
}

//displays the switches to toggle game filters
function displayFilters(info, element, elementName, filterTracker) {
    
    let tempString = info.map(function (filterElement) {
        
        return `<div class="form-check form-switch">
        <input class="${elementName} form-check-input" type="checkbox" role="switch" onClick="toggleFilter(${filterTracker}, ${filterElement.id})" id="${filterTracker}-${filterElement.id}">
        <label class="form-check-label" for="${filterTracker}-${filterElement.id}">${filterElement.name}</label>
      </div>`
    })
    element.innerHTML = tempString.join('')
    
}

//toggles the game filters by type
function toggleFilter (filterType, itemID) {
    if (filterType.includes(itemID))
            {
                filterType.splice(filterType.findIndex(function(index) {
                    return index == itemID
                }), 1)
            }
            else
            {
                filterType.push(itemID)
            }
            currentPage = 1
    getGameData(lookAtPage('games', `${gameSearchSetup()}search=${SEARCH_TEXT_BOX.value}&search_precise=True&search_exact=True&ordering=${searchSort}&page_size=${pageSize}&`), displayGame)
}

function getGameData (urlKeys, displayFunction) {
    fetch(urlKeys)
    .then(function(results) {
        return results.json()
    })
    .then (function (gameResults) {
        displayFunction(gameResults.results)
        displayPageNavigator(gameResults)
        totalPages = (Math.ceil(gameResults.count/pageSize))
        PAGE_DISPLAY.innerHTML = `Page ${currentPage}/${totalPages}`
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
        nextPage = `<li class="page-item"><button class="page-link" onClick="changePage('${info.next}', 'next')" id="nextButton">Next</button></li>`
    }
    if (info.previous == null)
    {
        previousPage = `<li class="page-item disabled"><span class="page-link">Previous</span></li>`
    }
    else 
    {
        previousPage = `<li class="page-item"><button class="page-link" onClick="changePage('${info.previous}', 'previous')" id="previousButton">Previous</button></li>`
    }
    PAGE_NAVIGATOR.innerHTML = `${previousPage}${nextPage}`
    
    
}

function changePage(pageURL, modifier, pageNumber = -1) {
    getGameData(pageURL, displayGame)
    if (modifier == 'next')
    {
        currentPage++
    }
    if (modifier == 'previous')
    {
        currentPage--
    }
    if (modifier == 'change')
    {
        currentPage = pageNumber
    }
    PAGE_DISPLAY.innerHTML = `Page ${currentPage}/${totalPages}`
}
//creates game cards from 'info' object used
function displayGame (info) {
    let tempString = info.map(function (game) {
        let imageElement = '';
        let tempTagsString = ''
        if (game.background_image == null)
        {
            imageElement = `<img src="images/no-image-icon.png" alt="No Image Found" class="gameImage rounded img-thumbnail" />`
        }
        else
        {
            imageElement = `<img src="${game.background_image}" alt="No Image Found" class="gameImage rounded img-thumbnail" />`
        }

        tempTagsString = game.tags.map(function (tag) {
            return `<li class="rounded"><span>${tag.name}</span></li>`
        })

        return `<li class="gameCard">
        <a href="gamedetails.html?id=${game.id}" class="card">
          ${imageElement}
          <div class="cardBody">
          <span class="gameRating">${game.rating}/5</span>          
            <span class="gameName">${game.name}</span>
            <div class="tagDisplay">
                  <span>Tags:</span>
                  <ul class="tagText">
                    ${tempTagsString.join('')}
                  </ul>
                </div>
            
          </div>
        </a>
      </li>`
    })
    GAME_LIST_ELEMENT.innerHTML = tempString.join('')
}
//Creates the search filters
function gameSearchSetup () {
    let fullPlatformString = ''
    let fullGenreString = ''
    let fullTagString = ''
    if (filterPlatforms.length > 0 && filterGenres.length > 0 && filterTags.length > 0)
    {
        fullPlatformString = `platforms=${filterPlatforms.join(',')}`
        fullGenreString = `&genres=${filterGenres.join(',')}`
        fullTagString = `&tags=${filterTags.join(',')}&`
    }
    else if(filterPlatforms.length > 0)
    {
        fullPlatformString = `platforms=${filterPlatforms.join(',')}&`
    }
    else if (filterGenres.length > 0)
    {
        fullGenreString = `genres=${filterGenres.join(',')}&`
    }
    else if (filterTags.length > 0)
    {
        fullTagString = `tags=${filterTags.join(',')}&`
    }

    return `${fullPlatformString}${fullGenreString}${fullTagString}`
}

SEARCH_BUTTON.addEventListener('click', function () {
    
    currentPage = 1
    getGameData(lookAtPage('games', `${gameSearchSetup()}search=${SEARCH_TEXT_BOX.value}&search_precise=True&search_exact=True&ordering=${searchSort}&page_size=${pageSize}&`), displayGame)
})

//used by sort dropdown buttons to set up sort parameters
function sortSetup(index) {
    
    let menuItems = SORT_BUTTON.parentElement.querySelectorAll('.dropdown-item')
    searchSort = SORT_TYPES[index]
    SORT_BUTTON.innerHTML = menuItems[index].innerHTML
    currentPage = 1
    getGameData(lookAtPage('games', `${gameSearchSetup()}search=${SEARCH_TEXT_BOX.value}&search_precise=True&search_exact=True&ordering=${searchSort}&page_size=${pageSize}&`), displayGame)
}

function searchSizeChange (index) {
    pageSize = SEARCH_SIZES[index]
    SEARCH_SIZE_BUTTON.innerHTML = `${pageSize} items per page`
    currentPage = 1
    getGameData(lookAtPage('games', `${gameSearchSetup()}search=${SEARCH_TEXT_BOX.value}&search_precise=True&search_exact=True&ordering=${searchSort}&page_size=${pageSize}&`), displayGame)
}

searchSort = SORT_TYPES[0]
searchSizeChange(0)
SORT_BUTTON.innerHTML = "Highest Rated"
getFilterData('genres', displayFilters, GENRE_FILTER_ELEMENT, SPECIFIC_FILTERS, 'filterGenres')
getFilterData('platforms', displayFilters, PLATFORM_FILTER_ELEMENT, SPECIFIC_FILTERS, 'filterPlatforms')
getFilterData('tags', displayFilters, TAG_FILTER_ELEMENT, SPECIFIC_FILTERS, 'filterTags')
getGameData(lookAtPage('games', `ordering=${searchSort}&page_size=${pageSize}&`), displayGame)
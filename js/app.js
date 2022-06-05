const API_KEY = 'c9c9bfee8c9142a39a386a9fdc2edd22';
const BASE_URL = 'https://api.rawg.io/api/platforms?key=';
const API_URL = BASE_URL + '/discover/movie?sort_by=popularity.desc&'+API_KEY;

const genres

const main = document.getElementById('main');
const form =  document.getElementById('form');
const search = document.getElementById('search');
const tagsEl = document.getElementById('tags');

const prev = document.getElementById('prev')
const next = document.getElementById('next')
const current = document.getElementById('current')

var currentPage = 1;
var nextPage = 2;
var prevPage = 3;
var lastUrl = '';
var totalPages = 100;

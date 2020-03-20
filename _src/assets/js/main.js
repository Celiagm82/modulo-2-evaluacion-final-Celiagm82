'use strict';


const seriesInput = document.querySelector('#series-input');
const searchButton = document.querySelector('#search-button');
const seriesList = document.querySelector('.series-list');
const favList = document.querySelector('.fav-list');

let series = null;


function getApiInfo() {
    const urlBase = 'http://api.tvmaze.com/singlesearch/shows?q=' + seriesInput.value;
    fetch(urlBase)
    .then (response => response.json())
    .then (data => {
        series = data;
        console.log(series);
    });
    
}


searchButton.addEventListener('click', getApiInfo);
'use strict';


const seriesInput = document.querySelector('#series-input');
const searchButton = document.querySelector('#search-button');
const seriesList = document.querySelector('.series-list');
const favList = document.querySelector('.fav-list');

let series = null;

const imgAvatar = 'https://via.placeholder.com/210x295/';

// En esta constante guardamos las series que seleccionamos
const selectedSeries = readLocalStorage();


// Me traigo los datos de la API
function getApiInfo() {
    const urlBase = 'http://api.tvmaze.com/search/shows?q=' + seriesInput.value;
    fetch(urlBase)
    .then (response => response.json())
    .then (data => {
        series = data;
        console.log(series);
        renderSeries(series);
    });   
}

// Pinto las series que me traigo de la API con mi búsqueda
function renderSeries (seriesArr) {
    for (let item of seriesArr) {
        if (item.show.image !== null) {
        seriesList.innerHTML += `<li id=${item.show.id} class='list-elem'><div class='img-container'><p>${item.show.name}</p><img src=${item.show.image.medium} alt='portada serie' title='Image serie'></div></li>`
        } else {seriesList.innerHTML += `<li id=${item.show.id}><div class='img-container'><p>${item.show.name}</p><img src=${imgAvatar} alt='portada serie' title='Image default'></div></li>`;
        addLiListeners();
        }
    }   
}

// Añado listeners a las li de series que me devuelve mi búsqueda
function addLiListeners () {
    const liList = document.querySelectorAll('.list-elem');
    for(let li of liList) {
        li.addEventListener('click', selectSerie);
    }
}

// Seteo LocalStorage
function setLocalStorage () {
    localStorage.setItem('serieInfo', JSON.stringify(selectedSeries))
}

// Leo LocalStorage
// Esta función me devuelve un valor (un JSON o un array vacío), que será lo que vale la constante selectedSeries
function readLocalStorage () {
    //creo una variable que recogerá el valor de serieInfo si existe
    //en caso de que sí, me devolverá esos datos
    //si no un array vacío
    let localInfo = JSON.parse(localStorage.getItem('serieInfo'))
    if (localInfo !== null) {
        return localInfo
    } else {
        return localInfo = []
    }
}

function selectSerie () {
    
}


searchButton.addEventListener('click', getApiInfo);
'use strict';


const seriesInput = document.querySelector('#series-input');
const searchButton = document.querySelector('#search-button');
const seriesList = document.querySelector('.series-list');
const favList = document.querySelector('.fav-list');
const deleteAll = document.querySelector('.delete-all');

let series = null;

const imgAvatar = 'https://via.placeholder.com/210x295/';

// En esta constante guardamos las series que seleccionamos
let selectedSeries = readLocalStorage();


// Me traigo los datos de la API
function getApiInfo() {
    const urlBase = 'http://api.tvmaze.com/search/shows?q=' + seriesInput.value;
    fetch(urlBase)
    .then (response => response.json())
    .then (data => {
        series = data;
        renderSeries(series);
    })
}

// Pinto las series que me traigo de la API con mi búsqueda
function renderSeries (seriesArr) {
    seriesList.innerHTML = '';
    for (let item of seriesArr) {
        if (item.show.image !== null) {
        seriesList.innerHTML += `<li id=${item.show.id} class='list-elem'><div class='img-container'><p><a href="${item.show.url}" title="Ver ficha" aria-label="Ver ficha" target="_blank">${item.show.name}</a></p><img src=${item.show.image.medium} alt='portada serie' title='Image serie'></div></li>`
        } else {seriesList.innerHTML += `<li id=${item.show.id} class='list-elem'><div class='img-container'><p><a href="${item.show.url}" title="Ver ficha" aria-label="Ver ficha" target="_blank">${item.show.name}</a></p><img src=${imgAvatar} alt='portada serie' title='Image default'></div></li>`;
        }
    addLiListeners();  
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


// Me devuelve el objeto de LS que pertenece a ese identificador 
function getSerieObject (idSerie) {
    for(let serie of series) {
        if(serie.show.id === parseInt(idSerie)) {
          return serie;
        }
    }
}


// Con esta función guardamos en Local Storage la serie que seleccionamos haciendo click en ella
function selectSerie (evt) {
    let chosen = evt.currentTarget;
    chosen.classList.add('favourite');
    const selected = evt.currentTarget.id;
    const object = getSerieObject(selected);
    const findSerie = selectedSeries.find(serie => parseInt(serie.id) === parseInt(selected));
    if (findSerie === null || findSerie === undefined) {
        selectedSeries.push(object.show);
        setLocalStorage(selectedSeries);
        renderFav(selectedSeries);
    } else {
        alert('Esta serie ya está en favoritos')
    }
}


// Función para pintar lista de favoritos
function renderFav (selectedSeries) {
    favList.innerHTML = '';
    for(let fav of selectedSeries) {
        if(fav.image !== null) {
            favList.innerHTML += `<li id=${fav.id} class='list'><img src=${fav.image.medium}><p><a href="${fav.url}" title="Ver ficha" aria-label="Ver ficha" target="_blank">${fav.name}</a></p><button type='button' class='delete-btn'>x</button></li>`
        } else {
            favList.innerHTML += `<li id=${fav.id} class='list'><img src=${imgAvatar}><p><a href="${fav.url}" title="Ver ficha" aria-label="Ver ficha" target="_blank">${fav.name}</a></p><button type='button' class='delete-btn'>x</button></li>`
        }
    addFavouriteListeners();
    }
}

// Añadir listener a los botones de borrar favoritos
function addFavouriteListeners () {
    const deleteButton = document.querySelectorAll('.delete-btn');
    for(let button of deleteButton) {
        button.addEventListener('click', removeSerie);
    }
}

// Borrar serie seleccionada de favoritos
function removeSerie(evt){
    const elemId = evt.currentTarget.parentElement.id;
    const findElem = selectedSeries.find(serie => parseInt(serie.id) === parseInt(elemId));
    const favElem = selectedSeries.indexOf(findElem);
    selectedSeries.splice(favElem,1);
    //vulevo a setear localstorage
    setLocalStorage();
    //vuelvo a repintar favoritos
    renderFav(selectedSeries);
    const element = document.getElementById(elemId);
    element.classList.remove('favourite');
}

// Función para realizar la búsqueda con Enter
function searchEnter (event) {
    if(event.keyCode === 13) {
        getApiInfo();
    }
}

// Borra todos los favoritos a la vez
function removeAllFav () {
    const listElem = document.querySelectorAll('.list-elem');
    for (let item of listElem) {
        item.classList.remove('favourite');
    }
    localStorage.removeItem('serieInfo');
    favList.innerHTML = '';
    selectedSeries = [];
}


searchButton.addEventListener('click', getApiInfo);

renderFav(selectedSeries);

seriesInput.addEventListener('keyup', searchEnter);

deleteAll.addEventListener('click', removeAllFav);

let tabCountries = null;
let tabFavorites = null;

console.log("Ola Mundo!!");

let allCountries = [];
let favoritesCountries = [];

let countCountries = 0;
let countFavorites = 0;

let totalPopulationsList = 0;
let totalPopulationsFavorites = 0;

let numberFormat = null;

window.addEventListener('load', () => {
  tabCountries = document.querySelector('#tabCountries');
  tabFavorites = document.querySelector('#tabFavorites');
  countCountries = document.querySelector('#countCountries');
  countFavorites = document.querySelector('#countFavorites');
  totalPopulationsList = document.querySelector('#totalPopulationList');        
  totalPopulationsFavorites = document.querySelector('#totalPopulationFavorites');

  numberFormat = Intl.NumberFormat('pt-BR');

  fetchCountries();
});

async function fetchCountries() {
  const res = await fetch('https://restcountries.com/v3.1/all');
  const json = await res.json();
  allCountries = json.map(country => {
    const { name, population, flags, cca3 } = country;
    return {
      id: cca3,
      name: name.common,
      population: population,
      formattedPopulation: formatNumber(population),
      flag: flags.png
    };
  });
  render();
}


function render() {
  renderCountryList();
  renderFavorites();
  renderSummary();
  handleCountryButtons();
}

function renderCountryList() {
  let countriesHTML = '<div>';
  console.log(allCountries);
  allCountries.forEach(country =>{
    const {name, flag, id, population, formattedPopulation} = country;

    const countryHTML = `
      <div class='country'>
        <div>
          <a id="${id}" class="waves-effect waves-light btn">+</a>
        </div>
        <div>
          <img src="${flag}" alt="${name}">
        </div>
        <div>
          <ul>
            <li>${name}</li>
            <li>${formattedPopulation}</li>
          </ul>
        </div>
      </div>
    `;
    countriesHTML += countryHTML;

  });

  countriesHTML += '</div>';
  tabCountries.innerHTML = countriesHTML;
}

function renderFavorites() {
  let favoritesHTML ='<div>';
  
  favoritesCountries.forEach(country =>{
    const {name, flag, id, population, formattedPopulation} = country;

    const favoriteCountryHTML = `
      <div class='country'>
        <div>
          <a id="${id}" class="waves-effect waves-light btn red darken-4">-</a>
        </div>
        <div>
          <img src="${flag}" alt="${name}">
        </div>
        <div>
          <ul>
            <li>${name}</li>
            <li>${formattedPopulation}</li>
          </ul>
        </div>
      </div>
    `;

  favoritesHTML += favoriteCountryHTML;
});

favoritesHTML += '</div>';
tabFavorites.innerHTML = favoritesHTML;

}

function renderSummary() {
  countCountries.textContent= allCountries.length;
  countFavorites.textContent = favoritesCountries.length;

  const totalPopulation = allCountries.reduce((accumulator, current)=>{
    return accumulator + current.population;

  }, 0);

  const totalFavorites = favoritesCountries.reduce((accumulator, current)=>{
    return accumulator + current.population;

  }, 0);

  totalPopulationsList.textContent = formatNumber(totalPopulation) ;
  totalPopulationsFavorites.textContent = formatNumber(totalFavorites) ;

}

function handleCountryButtons() {
  const countryButtons = Array.from(tabCountries.querySelectorAll('.btn'));
  const favoriteButtons = Array.from(tabFavorites.querySelectorAll('.btn'));

  countryButtons.forEach(button =>{
    button.addEventListener('click', ()=>addToFavorites(button.id));
  });

  favoriteButtons.forEach(button =>{
    button.addEventListener('click', ()=>removeFromFavorites(button.id));
  });
}

function addToFavorites(id) {
  const countryToAdd = allCountries.find(country=> country.id === id);

  favoritesCountries = [...favoritesCountries, countryToAdd];

  favoritesCountries.sort((a, b) => {
    return a.name.localeCompare(b.name);

  });

  allCountries = allCountries.filter(country => country.id !== id);

  render();

}

function removeFromFavorites(id) {
  const countryToRemove = favoritesCountries.find(country=> country.id === id);

  allCountries = [...allCountries, countryToRemove];

  allCountries.sort((a, b) => {
    return a.name.localeCompare(b.name);

  });

  favoritesCountries = favoritesCountries.filter(country => country.id !== id);

  render();

}

function formatNumber(number) {
  return numberFormat.format(number);
}
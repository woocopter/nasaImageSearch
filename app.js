const API_KEY = '1KO9ZYNAv26aZ4ygbG4kApLmKot3gPQEzMhrEFLm';
const URL = 'https://images-api.nasa.gov/search?q=';
const version = 2;

const searchInput = document.querySelector('.search-input');
const searchBtn = document.querySelector('.search-btn');
const imageDiv = document.querySelector('.image');
const imageDescription = document.querySelector('.img-description');
const searchForm = document.querySelector('#search-form');
const prevSearchList = document.querySelector('#prev-searches');

let searchValue = null;
let response = null;
const previousSearches = JSON.parse(localStorage.getItem('previousSearches')) || [];

if (version === 2) {
  function displayMsg(message) {
    searchForm.insertAdjacentHTML(
      'beforebegin',
      `
     <div class="msg">
      <p>${message}</p>
     </div>
    `
    );

    setTimeout(() => document.querySelector('.msg').remove(), 3000);
  }

  function displayPrevSearches() {
    if (!previousSearches.length) {
      prevSearchList.innerHTML = `<li>No search history</li>`;
      return;
    }
    prevSearchList.innerHTML = previousSearches
      .map(search => {
        return `
    <li>${search}</li>
  `;
      })
      .join('');
  }

  function displayImage() {
    const randomIndex = Math.floor(Math.random() * response.length);
    const imgSrc = response[randomIndex].links[0].href;
    const { title, description } = response[randomIndex].data[0];
    const imgHTML = `<img class="random-img" src="${imgSrc}" alt="${title}">`;
    imageDescription.textContent = description;
    imageDescription.style.display = 'block';
    imageDiv.innerHTML = imgHTML;
  }

  function getData(endpoint) {
    fetch(endpoint)
      .then(res => {
        return res.json();
      })
      .then(data => {
        response = data.collection.items;
        displayImage();
      });
  }

  prevSearchList.addEventListener('click', e => {
    const searchValue = e.target.textContent;
    getData(`${URL}${searchValue}`);
  });

  searchForm.addEventListener('submit', e => {
    e.preventDefault();

    const searchValue = searchInput.value.trim();
    if (!searchValue) {
      displayMsg('Enter search criteria!');
    } else {
      // create endpoint
      const endpoint = `${URL}${searchValue}`;

      // add search to history if it doesn't already exist
      if (!previousSearches.includes(searchValue.toLowerCase())) {
        previousSearches.push(searchValue.toLowerCase());
      }
      displayPrevSearches();

      // fetch data
      getData(endpoint);

      searchForm.reset();
    }
  });
} else {
  /*
  displays a random image from the returned array
*/
  function displayImage() {
    const randomIndex = Math.floor(Math.random() * response.length);
    const imgSrc = response[randomIndex].links[0].href;
    const { title, description } = response[randomIndex].data[0];
    const imgHTML = `<img class="random-img" src="${imgSrc}" alt="${title}">`;
    imageDescription.textContent = description;
    imageDescription.style.display = 'block';
    imageDiv.innerHTML = imgHTML;
  }

  function setPrevSearches(prevList) {
    if (!prevList.length) {
      prevSearchList.innerHTML = `<li>No search history</li>`;
      return;
    }
    prevSearchList.innerHTML = prevList
      .map(search => {
        return `
      <li>${search}</li>
    `;
      })
      .join('');
  }

  function getData(e, test) {
    e.preventDefault();
    console.log(e, test);
    searchValue = searchInput.value;
    fetch(`${URL}${searchValue}`)
      .then(response => {
        if (response.status !== 200) {
          console.error(response.reason);
          return;
        }
        return response.json();
      })
      .then(data => {
        response = data.collection.items;
        displayImage();
      });

    previousSearches.push(searchValue);
    setPrevSearches(previousSearches);

    // set previous search in local storage
    localStorage.setItem('previousSearches', JSON.stringify(previousSearches));
    // reset input value
    searchForm.reset();
  }

  searchBtn.addEventListener('click', getData);

  imageDiv.addEventListener('mouseover', e => {
    console.log(e);
  });

  setPrevSearches(previousSearches);
}

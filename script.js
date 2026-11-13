const cardGrid = document.querySelector('#cardGrid');
const searchInput = document.querySelector('#searchInput');
const searchBtn = document.querySelector('#searchBtn');
const randomBtn = document.querySelector('#randomBtn');

const apiUrl = 'https://pokeapi.co/api/v2/pokemon/';

const getPokemon = (idOrName) => {
  return fetch(`${apiUrl}${idOrName}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Could not find "${idOrName}"`);
      }
      return response.json();
    });
};

const makeCard = ({ id, name, height, weight, types, sprites }) => {
  const card = document.createElement('div');
  card.className = 'card';

  const typeHtml = types.map((t) => `<span>${t.type.name}</span>`).join('');

  card.innerHTML = `
    <img src="${sprites.front_default}" alt="${name}">
    <h3>#${id} ${name}</h3>
    <div class="types">${typeHtml}</div>
    <p>Height: ${height / 10} m<br>Weight: ${weight / 10} kg</p>
  `;
  return card;
};

const animateCards = () => {
  anime({
    targets: '.card',
    opacity: [0, 1],
    translateY: [60, 0],
    scale: [0.5, 1],
    delay: anime.stagger(100),
    duration: 1200,
    easing: 'easeOutElastic(1, .6)'
  });
};

const showPokemon = (list = [1, 4, 7, 25, 39, 52, 133, 150]) => {
  const ids = [...list];
  cardGrid.innerHTML = '';

  Promise.all(ids.map((id) => getPokemon(id)))
    .then((pokemonList) => {
      pokemonList.forEach((pokemon) => cardGrid.appendChild(makeCard(pokemon)));
      animateCards();
    })
    .catch((error) => {
      cardGrid.innerHTML = `<p>${error.message}. Try another name.</p>`;
    });
};

searchBtn.addEventListener('click', () => {
  const query = searchInput.value.trim().toLowerCase();
  if (query !== '') {
    showPokemon([query]);
  }
});

randomBtn.addEventListener('click', () => {
  const ids = Array.from({ length: 8 }, () => Math.floor(Math.random() * 898) + 1);
  showPokemon(ids);
});

cardGrid.addEventListener('click', (event) => {
  const card = event.target.closest('.card');
  if (card === null) {
    return;
  }
  card.classList.toggle('selected');
});

showPokemon();

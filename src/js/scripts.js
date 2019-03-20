var pokemonRepository = (function () {
  var repository = [];
  var apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';

  function add(pokemon) {
    repository.push(pokemon);
  }

  function getAll() {
    return repository;
  }

  function addListItem(pokemon) {
    var $ul = $('ul');
    var $li = $('<li class="pokemonName"></li>');
    var $button = $('<button type="button">' + pokemon.name + '</button>');
    $ul.append($li);
    $li.append($button);
    $button.on('click', function (e) { modalWork.showModal(pokemon); });
  }

  // loading the main pokemon name and details url
  function loadList() {
    return $.ajax(apiUrl).then(function (response) {
      response.results.forEach(function (item) {
        var pokemon = {
          name: item.name,
          detailsUrl: item.url,
        };
        add(pokemon);
      });
    }).catch(function (e) {
      console.error(e);
    });
  }

  // loading the details into pokemon
  function loadDetails(item) {
    return $.ajax(item.detailsUrl).then(function (response) {
      item.imageUrl = response.sprites.front_default;
      item.height = response.height;
      item.types = response.types.map(function (item) {return ' ' + item.type.name;});

      item.ability = response.abilities.map(function (item) {return ' ' + item.ability.name;});
    }).catch(function (e) {
      console.error(e);
    });
  }

  return {
    loadList: loadList,
    loadDetails: loadDetails,
    addListItem: addListItem,
    getAll: getAll,
  };
})();

pokemonRepository.loadList().then(function () {
  pokemonRepository.getAll().forEach(function (pokemon) {
    pokemonRepository.addListItem(pokemon);
    pokemonRepository.loadDetails(pokemon);
  });
});

var modalWork = (function (item) {
  var $modalContainer = $('#modal-container');

  function createModal() {
    var $modal = $('<div class="modal"></div>');

    // close button inside modal
    var $closeButtonElement = $('<button>X</button>');
    $closeButtonElement.addClass('modal-close');
    $closeButtonElement.on('click', hideModal);

    var $titleElement = $('<h1 class="title"></h1>');
    var $contentElement = $('<div class="content"></div>');

    // attach info to modal
    $modal.append($closeButtonElement).append($titleElement).append($contentElement);
    $modalContainer.append($modal);
  }

  function showModal(pokemon) {
    // show modal only updates the specific markups
    $('.title').text(pokemon.name);

    // pokemon content inside div elements
    $('.content').html(
      '<br>' +
      'Pokemon Types: ' +
      pokemon.types +
      '<br>' +
      '<img src="' +
      pokemon.imageUrl +
      '">' +
      '<br>' +
      'Pokemon Height: ' +
      pokemon.height +
      '<br> <br>' +
      'Pokemon Abilities: ' +
      pokemon.ability
    );
    $modalContainer.addClass('is-visible');
  }

  // removes modal class
  function hideModal() {
    $modalContainer.removeClass('is-visible');
  }

  // closing window with escape key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && $modalContainer.hasClass('is-visible')) {
      hideModal();
    }
  });

  // clicking outside of the modal to close.
  $modalContainer.on('click', function (event) {
    if ($(event.target).is($modalContainer)) {
      hideModal();
    }
  });

  createModal();

  return {
    showModal: showModal,
    hideModal: hideModal,
    createModal: createModal,
  };
})();

$(document).ready(function () {
  $('#myInput').on('keydown', function () {
    var value = $(this).val().toLowerCase();
    $('.pokemonName').filter(function () {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
    });
  });
});

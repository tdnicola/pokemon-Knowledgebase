var pokemonRepository = (function () {
  var repository = []
  var apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';

  function add (pokemon) {
    repository.push(pokemon)
  }

  function getAll () {
    return repository;
  }

  function addListItem (pokemon) {
    var $ul = $('ul')
    var $li = $('<li class="pokemonName"></li>')
    var $button = $('<button type="button">' + pokemon.name + '</button>')
    $ul.append($li)
    $li.append($button)
    //modal not working
    $button.on('click', function (e) { modalWork.showModal(pokemon) })
  }

  function loadList () {
    return $.ajax(apiUrl).then(function (response) {
      response.results.forEach(function (item) {
        var pokemon = {
          name: item.name,
          detailsUrl: item.url
        }
        add(pokemon)
      })
    }).catch(function (e) {
      console.error(e)
    })
  }

  function loadDetails (item) {
    return $.ajax(item.detailsUrl).then(function (response) {

      item.imageUrl = response.sprites.front_default;
      item.height = response.height;
      item.types = response.types.map(function (item) { return item.type.name })
    }).catch(function (e) {
      console.error(e)
    })
  }

  return {
    loadList: loadList,
    loadDetails: loadDetails,
    addListItem: addListItem,
    getAll: getAll
  }
})()

// not a function?
pokemonRepository.loadList().then(function () {
  pokemonRepository.getAll().forEach(function (pokemon) {
    pokemonRepository.addListItem(pokemon);
    pokemonRepository.loadDetails(pokemon)
  });
});

var modalWork = (function () {
  var $modalContainer = $('#modal-container')

  function showModal (pokemon) {
    // Clear existing text
    $modalContainer.innerText = ''

    // creating div
    var $modal = $('<div class="modal"></div>')

    // creating close button inside box
    var $closeButtonElement = $('<button>X</button>')
    $closeButtonElement.addClass('modal-close')
    $closeButtonElement.on('click', hideModal)

    var $titleElement = $('<h1>' + pokemon.name + '</h1>');
    var $contentElement = $('main info');

    $modal.append($closeButtonElement).append($titleElement).append($contentElement)
    $modalContainer.append($modal)

    $modalContainer.addClass('is-visible')
  }

  function hideModal () {
    $modalContainer.removeClass('is-visible')
  }

  // closing window with escape key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && $modalContainer.hasClass('is-visible')) {
      hideModal();
    }
  });

  $modalContainer.on('click', function (event) {
    if ($(event.target).is($modalContainer)) {
      hideModal();
    }
  });

  return {
    showModal: showModal,
    hideModal: hideModal
  }
})()

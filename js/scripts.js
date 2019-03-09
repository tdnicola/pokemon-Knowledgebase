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
    var $li = $('<li class="pokemonName">test</li>')
    var $button = $('<button type="button">' + pokemon.name + '</button>')
    $ul.append($li)
    $li.append($button)

    // add modal to button. Not set up yet
    // $button.on('click'. function (event) {
    //   addmodal
    // })
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
      response.results.forEach(function (details) {
        item.imageUrl = details.sprites.front_default;
        item.height = details.height;
        item.types = details.types.map(function (item) {return item.type.name})
      })
    })
  }


  return {
    loadList: loadList,
    loadDetails: loadDetails,
    addListItem: addListItem,
    getAll: getAll
  }


})

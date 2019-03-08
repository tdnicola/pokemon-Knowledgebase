var pokemonRepository = (function () {
  var repository = []
  var apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';

  function add (pokemon) {
    repository.push(pokemon)
  }

  function getAll () {
    return repository;
  }

})

angular.module('MyApp')
  .factory('CharacterService', function($http) {
    return {
      updateCharacter: function(selectedCharacter) {
        return $http.post("/api/character/" + selectedCharacter._id, {character: selectedCharacter});
      },
      createCharacter: function(newCharacter){
      	return $http.post('/api/createCharacter', {newCharacter: newCharacter})
      },
      getCharacter: function(id){
      	return $http.get("/api/character/" + id);
      },
      deleteCharacter: function(id){
        return $http.get("/api/delete-character/" + id);
      },
      getAll: function(){
      	return $http.get("/api/characters");
      },
      search: function(data){
      	return $http.post("/api/characterSearch", data);
      }
    };
  });   
angular.module('MyApp')
  .controller('MainCtrl', function($scope, $routeParams, Upload, $rootScope, $location, $window, $auth, $http) {

	console.log("main controller loaded");
    $scope.filterSelected     = "contains";
    $scope.searchTypeSelected = "name";
    $scope.searchResults      = [];
    $scope.allCharacters      = [];
    $scope.selectedCharacter  = {};

    window.routeParams = $routeParams.id;
    $scope.selectedCharacterId = $routeParams.id;

    $scope.getCharacterById = function(selectedCharacterId){
       console.log("getCharacterById(), _id:", selectedCharacterId);
       $http.get("/api/character/" + selectedCharacterId, {})
        .then(function (response) {
            console.log("response", response);
            $scope.selectedCharacter = response.data.character;
        });
    }

    $scope.updateCharacter = function(selectedCharacter){
      console.log("updateCharacter(), characterObj:", selectedCharacter)
      $http.post("/api/character/" + selectedCharacter._id, {character: selectedCharacter})
      .then(function (response) {
          console.log("response", response);
          //
      });
    }

    $scope.uploadImage = function(file){ //function to call on form submit
        console.log("uploadImage - file:", file);
          console.log("valid file?", file);
          if(file != null && file !=undefined){

              Upload.upload({
                  url: '/api/uploadCharacterImage', //webAPI exposed to upload the file
                  data:{file:file} //pass file as data, should be user ng-model
              }).then(function (response) { //upload function returns a promise
   

                  console.log("upload response", response);
                  $scope.selectedCharacter.image = response.data.newFile;

              }, function (resp) { //catch error
                  console.log('Error status: ' + resp.status);
                  //$window.alert('Error status: ' + resp.status);
              }, function (evt) { 
                  console.log(evt);
                  var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                  console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
                  $scope.progress = 'progress: ' + progressPercentage + '% '; // capture upload progress
              });

          }
    }






    $scope.filterBy = function(filterBy){
      console.log("filterBy", filterBy);
      $scope.filterSelected = filterBy;
    }

    $scope.searchBy = function(searchBy){
      console.log("searchBy", searchBy);
      $scope.searchTypeSelected = searchBy;
    }

	$scope.search = function(query){
	  console.log("search - query", query);
      var field = $scope.searchTypeSelected;
      $http.post("/api/characterSearch", {field: field, query: query, filter: $scope.filterSelected})
        .then(function (response) {
            console.log("response", response);
            $scope.searchResults = response.data.characters;
        });
	}

  $scope.getAllCharacters = function(){
        
      $http.get("/api/characters", {})
        .then(function (response) {
            console.log("response", response);
            $scope.allCharacters = response.data.characters;
        });
  }

  $scope.isAuthenticated = function() {
    return $auth.isAuthenticated();
  };

  $scope.makeFavourite = function(characterId){
  	console.log("makeFavourite, character_id:", characterId);
  	//make favourite in localstorage.
  	if($rootScope.currentUser.favouriteCharacters.indexOf(characterId) == -1){

	  	$rootScope.currentUser.favouriteCharacters.push(characterId);
	  	$window.localStorage.user = JSON.stringify($rootScope.currentUser);
	    
	    $http.post("/account", $rootScope.currentUser)
	    .then(function (response) {
	        console.log("response", response);
	       
	    });

  	}
  	console.log('$rootScope.currentUser',$rootScope.currentUser);
  }

   $scope.unFavourite = function(characterId){
  	console.log("unFavourite, character_id:", characterId);
  	//remove from favourites
  	if($rootScope.currentUser.favouriteCharacters.indexOf(characterId) > -1){
        var idxOf = $rootScope.currentUser.favouriteCharacters.indexOf(characterId);
        $rootScope.currentUser.favouriteCharacters.splice(idxOf,1);

	  	$window.localStorage.user = JSON.stringify($rootScope.currentUser);
	    
	    $http.post("/account", $rootScope.currentUser)
	    .then(function (response) {
	        console.log("response", response);
	       
	    });

  	}
  	console.log('$rootScope.currentUser',$rootScope.currentUser);
  }



  });



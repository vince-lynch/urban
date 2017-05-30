angular.module('MyApp')
  .controller('MainCtrl', function($scope, $rootScope, $location, $window, $auth, $http) {

	console.log("main controller loaded");
    $scope.filterSelected     = "contains";
    $scope.searchTypeSelected = "name";
    $scope.searchResults      = [];

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



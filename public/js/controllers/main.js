angular.module('MyApp')
  .controller('MainCtrl', function($scope, $routeParams, Upload, $rootScope, $location, $window, $auth, $http, CharacterService) {

	console.log("main controller loaded");
    $scope.filterSelected     = "contains";
    $scope.searchTypeSelected = "name";
    $scope.searchResults      = [];
    $scope.allCharacters      = [];
    $scope.selectedCharacter  = {};

    // $scope.$watch('allCharacters', function(){
    //   if($scope.allCharacters != []){
    //     $window.localStorage.allCharacters = JSON.stringify($scope.allCharacters);
    //   }
    // })

    window.routeParams = $routeParams.id;
    $scope.selectedCharacterId = $routeParams.id;


    $scope.deleteCharacterById = function(selectedCharacterId){
        CharacterService.deleteCharacter(selectedCharacterId)
        .then(function(response) {
            console.log("response", response);
        })
    }

    $scope.getCharacterById = function(selectedCharacterId){
       console.log("getCharacterById(), _id:", selectedCharacterId);
       
       CharacterService.getCharacter(selectedCharacterId)
        .then(function(response) {
            console.log("response", response);
            $scope.selectedCharacter = response.data.character;
        })
    }

    $scope.updateCharacter = function(selectedCharacter){
      console.log("updateCharacter(), characterObj:", selectedCharacter);
      var i = 0;
      for(i in $scope.allCharacters){
        if($scope.allCharacters[i]._id == selectedCharacter._id){
          $scope.allCharacters[i] = selectedCharacter;
        }
      }

      CharacterService.updateCharacter(selectedCharacter)
        .then(function(response) {
            console.log("response", response);
        })
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
    $scope.searchResults = []; // clear last results;
    
	  console.log("search - query", query);
      var field = $scope.searchTypeSelected;
      if(!$window.localStorage.allCharacters || $window.localStorage.allCharacters == "[]" ){
        CharacterService.search({field: field, query: query, filter: $scope.filterSelected})
        .then(function(response) {
            console.log("response", response);
            $scope.searchResults = response.data.characters;
        })
      } else {
         var theCache =  JSON.parse($window.localStorage.allCharacters);
         var data = {}
         var filter = $scope.filterSelected;
         data[field] = query;
         if(query != undefined){
           switch(filter){
              case 'contains':
                console.log("reached contains");
                //data[field] = new RegExp(query, 'i');
                _.find(theCache, function(item){
                  console.log(item[field].indexOf(query))
                  if(item[field].indexOf(query) > -1){
                    $scope.searchResults.push(item);
                  }
                })
                break;
              case 'equalTo':
                console.log("reached equalTo");
                data[field] = query;
                $scope.searchResults = _.where(theCache, data)
                break;
              case 'greaterThan':
                console.log("reached greaterThan");
                _.filter(theCache,function(v){
                  if(v[field] > query){
                    $scope.searchResults.push(v);
                  }
                });
                break;
              case 'lessThan':
                console.log("reached lessThan");
                _.filter(theCache,function(v){
                  if(v[field] < query){
                    $scope.searchResults.push(v);
                  }
                });
                break;
            }
         } else {
            $scope.searchResults = theCache;
         }
         
      }

	}

  $scope.getAllCharacters = function(){   
    if(!$window.localStorage.allCharacters || $window.localStorage.allCharacters == "[]" ){
       CharacterService.getAll()
      .then(function(response) {
          console.log("response", response);
          $scope.allCharacters = response.data.characters;
          $window.localStorage.allCharacters = JSON.stringify($scope.allCharacters);
      })
    } else {
      $scope.allCharacters = JSON.parse($window.localStorage.allCharacters);
    }    
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



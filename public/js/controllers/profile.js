angular.module('MyApp')
  .controller('ProfileCtrl', function($scope, $rootScope, $location, $window, $auth, Account) {
    $scope.profile = $rootScope.currentUser;


  });
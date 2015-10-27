var app = angular.module('tinder.controllers.Main', []);

app.controller('MainCtrl', function($scope, $state, $mdSidenav, Auth){
  console.info('Loaded Main Controller');

  $scope.go = function (route) {
    $state.go(route);
  }

  $scope.toggleMenu = function (id) {
    $mdSidenav(id).toggle();
  }

  $scope.logout = function() {
    Auth.logout();
    $state.go('login');
  }
});

var app = angular.module('tinder.controllers.Recommendations', ['tinder.services.TinderAPI']);

app.controller('RecommendationsCtrl', function($scope, TinderAPI){
  console.info('In Recommendations Controller');

  TinderAPI
    .getRecommendations(10)
    .then(
      function(recommendations){
        console.log('success')
        console.log(arguments)
        $scope.recommendations = recommendations;
      },
      function(err) {
        console.log('error')
        console.log(arguments)
      }
    );

  $scope.getRandomPhoto = function(r) {
    var length = r.photos.length;
    var max = length - 1;
    var random = Math.floor(Math.random() * max);
    return r.photos[random].url;
  }

  $scope.getYearsOld = function(r) {
    //1992-10-26T00:00:00.000Z
    var birthdate = new Date(r.birth_date);
    var today = new Date();
    return today.getFullYear() - birthdate.getFullYear();
  }
});

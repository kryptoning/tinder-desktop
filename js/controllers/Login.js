var ipc = require('ipc');

angular.module('tinder.controllers.Login', ['tinder.services.Auth', 'tinder.services.TinderAPI'])

.controller('LoginCtrl', function($scope, $state, Auth, TinderAPI){
  console.info('In Login Controller');

  Auth
    .getUser()
    .then(function(user){
      if (user.hasOwnProperty('id') ) {
        console.log('authenticating with tinder..')
        TinderAPI.authorize(user, function(){
          console.log('authenticated?')
          console.log(arguments)
          $state.go('recommendations');
        });
      } else {
        ipc.sendSync('newUserToken', user.access_token);
        $state.go('recommendations');
      }
    });

  $scope.fbLogin = function () {
    console.log('Click Login');

    Auth.getUserToken(function(err, token){
      if (err || !token ) {
        ipc.sendSync('need-auth');
      }
      ipc.sendSync('newUserToken', token);
    });

    // $state.go('recommendations');
  }
});

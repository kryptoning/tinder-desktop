var tinder = require('tinderjs');

angular.module('tinder.services.TinderAPI', [])

.factory('TinderAPI', function($q){

  var client = new tinder.TinderClient();

  return {
    authorize: function(user, cb){
      client.authorize(user.access_token, user.id, cb);
    },
    getRecommendations: function(limit) {
      return $q(function(resolve, reject) {
        client.getRecommendations(limit, function(err, res) {
          console.log(res)
          if (res.status >= 400) {
            return reject(res.status);
          }
          if ( res.hasOwnProperty('message') ) {
            return reject(res.message)
          }
          return resolve(res.results);
        })
      });
    },
    getMessages: function() {
      return $q(function(resolve, reject){
        client.getHistory(function(err, data){
          console.log(data)
          resolve(data.matches);
        })
      });
    }
  }
});

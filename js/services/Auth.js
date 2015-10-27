var Datastore = require('nedb');
var auth = new Datastore({ filename: 'data/auths.db', autoload: true });

angular.module('tinder.services.Auth', [])

.factory('Auth', function($q){

  return {
    createUser: function (data) {
      return $q(function(resolve, reject) {
        auth.update({access_token: data.access_token}, data, {upsert: true}, function(err, doc){
          if (err) return reject(err);
          return resolve(doc);
        });
      });
    },
    getUserToken: function(cb){
      auth.find({}, function(err, docs){
        if (err) {
          return cb(err);
        } else if (docs && docs.length ) {
          return cb(null, docs[0].access_token);
        } else {
          return cb(null, null);
        }
      });
    },
    getUser: function() {
      return $q(function(resolve, reject) {
        auth.find({}, function(err, docs){
          if (err) {
            return reject(err);
          } else if (docs && docs.length ) {
            return resolve(docs[0]);
          } else {
            return reject(null, null);
          }
        });
      });
    },
    logout: function() {
      auth.remove({});
    }
  }
});

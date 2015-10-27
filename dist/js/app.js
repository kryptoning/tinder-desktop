var deps = [
  'tinder.controllers.Main',
  'tinder.controllers.Login',
  'tinder.controllers.Recommendations',
  'tinder.controllers.Messages',
  'tinder.controllers.Moments',
  'ui.router',
  'ngMaterial'
];

var app = angular.module('tinder', deps);

app.config(function($stateProvider, $urlRouterProvider) {
  //
  // For any unmatched url, redirect to /state1
  $urlRouterProvider.otherwise("/login");
  //
  // Now set up the states
  $stateProvider
    .state('login', {
      url: "/login",
      views: {
        'content': {
          templateUrl: "templates/login.html",
          controller: 'LoginCtrl'
        }
      }
    })
    .state('recommendations', {
      url: "/recommendations",
      views: {
        'toolbar': {
          templateUrl: "templates/toolbar.html",
        },
        'content': {
          templateUrl: "templates/recommendations.html",
          controller: 'RecommendationsCtrl',
        }
      }
    })
    .state('messages', {
      url: "/messages",
      views: {
        'toolbar': {
          templateUrl: "templates/toolbar.html",
        },
        'content': {
          templateUrl: "templates/messages.list.html",
          controller: 'MessagesCtrl',
        }
      }
    })
    .state('moments', {
      url: "/moments",
      views: {
        'toolbar': {
          templateUrl: "templates/toolbar.html",
        },
        'content': {
          templateUrl: "templates/moments.html",
          controller: 'MomentsCtrl',
        }
      }
    })
});
;var ipc = require('ipc');

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
;var app = angular.module('tinder.controllers.Main', []);

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
;var app = angular.module('tinder.controllers.Messages', ['tinder.services.Messages']);

app.controller('MessagesCtrl', function($scope, $state, Messages){
  console.info('In Messages Ctrl');

  $scope.me = '124';

  Messages
    .conversations()
    .then(function(conversations){
      console.log(conversations)
      $scope.conversations = conversations;
    });

  $scope.loadConversation = function (id) {
    $scope.conversationID = id;
    Messages
      .conversation(id)
      .then(function(messages){
        $scope.messages = messages;
      });
  }

  $scope.sendMessage = function () {
    var message = Messages.createMessage($scope.conversationID, $scope.textMessage);
    $scope.textMessage = '';
    $scope.messages.push(message);
    Messages.send(message);
  }

  $scope.getLastMessage = function(c) {
    var totalMessages = c.messages.length;
    var lastMsg = totalMessages > 0 ? c.messages[totalMessages-1].message : 'Sent a message!';
    return lastMsg;
  }

  $scope.isMe = function(m) {
    return m.from == "55aafe46019193d83c77cf17";
  }
});
;var app = angular.module('tinder.controllers.Moments', []);

app.controller('MomentsCtrl', function($scope, $state){
  console.info('In Moments Ctrl');
});
;var app = angular.module('tinder.controllers.Recommendations', ['tinder.services.TinderAPI']);

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
;var Datastore = require('nedb');
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
;var app = angular.module('tinder.services.Messages', ['tinder.services.TinderAPI']);

app.factory('Messages', function($q, TinderAPI){
  console.info('Loaded Messages Service');

  var conversations = [];

  var messages = [];

  return {
    conversations: function () {
      var promise = TinderAPI.getMessages();
      promise.then(function(cvts){
        conversations = cvts || [];
      })
      return promise;
    },
    conversation: function(id) {
      return $q(function(resolve, reject) {
        var filtered = conversations.filter(function(m){
          if (m._id == id)
            return m;
        });
        resolve(filtered[0].messages);
      });
    },
    send: function(msg) {
      return $q(function(resolve, reject) {
        setTimeout(function(){
          console.log('sended')
          messages.push(msg);
          resolve(msg);
        }, 1000)
      });
    },
    createMessage: function(cid, msg) {
      var total = messages.length;
      messages.push({from: '55aafe46019193d83c77cf17', user: 'Bruno Cascio', message: msg});
      return messages[total];
    }
  }
});
;var tinder = require('tinderjs');

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

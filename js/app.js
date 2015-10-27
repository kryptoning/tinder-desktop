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

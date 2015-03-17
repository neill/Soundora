'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'ngCookies',
  'myApp.playview',
  'myApp.services',
  'itcrowd.services',
  'myApp.signin',
  'myApp.version'
]).
run(function($rootScope) {
  $rootScope.client_id = '8a810189684f0d6deeac1e75cbeabed6',
  $rootScope.client_secret = '4418d9cea79b0804f69fa817d434bf72',
  $rootScope.redirect_uri = 'http://localhost:8000/app/callback.html'
}).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/sign-in'});
}]);

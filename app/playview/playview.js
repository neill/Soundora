'use strict';

angular.module('myApp.playview', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/play', {
    templateUrl: 'playview/playview.html',
    controller: 'PlayViewCtrl'
  });
}])

.controller('PlayViewCtrl', ['$scope', '$cookies', function($scope, $cookies) {

  SC.initialize({
    client_id: '8a810189684f0d6deeac1e75cbeabed6',
    client_secret: '4418d9cea79b0804f69fa817d434bf72',
    redirect_uri: 'http://localhost:8000/app/callback.html',
    access_token: $cookies['soundoraCookie'],
    scope: 'non-expiring'
  });

  console.log($cookies['soundoraCookie'])

  var user = {};

  SC.get('/me.json?oauth_token=1-119281-6909133-e8bc21e59fd8ec6', function(data) {
    console.log("Data:")
    console.log(data)
    user = data
  });

  console.log("User:")
  console.log(user);

  $scope.name = "Neill"
}]);


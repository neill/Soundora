'use strict';

angular.module('myApp.playview', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/play', {
    templateUrl: 'playview/playview.html',
    controller: 'PlayViewCtrl'
  });
}])

.controller('PlayViewCtrl', ['$scope', '$cookies', '$http', '$location', function($scope, $cookies, $http, $location) {

    $scope.disconnect = function() {
        delete $cookies["soundoraCookie"];
        $location.path("/sign-in");
    };

  var accessToken = $cookies['soundoraCookie']
  var clientId = '8a810189684f0d6deeac1e75cbeabed6'

  SC.initialize({
    client_id: clientId,
    client_secret: '4418d9cea79b0804f69fa817d434bf72',
    redirect_uri: 'http://localhost:8000/app/callback.html',
    access_token: accessToken,
    scope: 'non-expiring'
  });

  console.log(accessToken)

  function getUser() {
    $http({
        method: 'GET',
        url: 'https://api.soundcloud.com/me.json?oauth_token=' + accessToken
    }).
    success(function(data) {
        $scope.name = data.username
    });
  }

  function getTrack() {
    $http({
        method: 'GET',
        url: 'http://api.soundcloud.com/tracks/190984415.json?client_id=' + clientId
    }).
    success(function(data) {
        $scope.trackname = data.title;
        $scope.artist = data.user.username;
        $scope.artwork = data.artwork_url;
    })
  }

  getUser();
  getTrack();
  // var user = {};

  // SC.get('/me.json?oauth_token=' + accessToken, function(data) {
  //   user = data
  // });

  // $scope.name = "Neill"
}]);
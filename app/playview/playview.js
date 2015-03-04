'use strict';

angular.module('myApp.playview', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/play', {
    templateUrl: 'playview/playview.html',
    controller: 'PlayViewCtrl'
  });
}])

.controller('PlayViewCtrl', ['$scope', '$cookies', '$http', '$location', function($scope, $cookies, $http, $location) {

  var accessToken = $cookies['soundoraCookie']
  var clientId = '8a810189684f0d6deeac1e75cbeabed6'

  if (accessToken == null) {
    $location.path("/sign-in");
  };

  $scope.disconnect = function() {
    delete $cookies["soundoraCookie"];
    $location.path("/sign-in");
  };

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
        $scope.user_img = data.avatar_url
    });
  }

  function generateNext() {
    $http({
        method: 'GET',
        url: 'https://api.soundcloud.com/tracks?genres=' + $scope.genre + '&client_id=' + clientId
    }).
    success(function(data) {
        $scope.nextSong = data[Math.floor(Math.random()*data.length)];
    });

    setTimeout(function() {
        console.log($scope.nextSong.uri)
    }, 2000);
  }

  function getTrack(nextTrackUrl) {
    $http({
        method: 'GET',
        url: nextTrackUrl + '.json?client_id=' + clientId
    }).
    success(function(data) {
        $scope.trackUrl = data.uri;
        $scope.trackId = data.id;
        $scope.genre = data.genre;
        $scope.trackShareUrl = data.permalink_url;
        $scope.trackName = data.title;
        $scope.artist = data.user.username;
        $scope.artistUrl = data.user.permalink_url;
        $scope.artwork = data.artwork_url.replace("large", "t500x500");
        $scope.wave = data.waveform_url;
        $scope.stream = data.stream_url + '?client_id=' + clientId;
        $scope.song = new Audio();
        $scope.song.addEventListener('ended', function() { getTrack($scope.nextSong.uri) });
    });
    $scope.playing = false;
    $scope.play = function() {
        $scope.playing = !$scope.playing;
        if (!$scope.playing) {
            $scope.song.pause();
        } else {
            if ($scope.song.src == '') {
                $scope.song.src = $scope.stream;
            }
            $scope.song.play();
        }
    }

    setTimeout(function() {
        $scope.song.src = $scope.stream;
        $scope.song.play();
        console.log("Song loaded... Play!")
    }, 1000);

    $scope.skipSong = function() {
        if (!$scope.playing) {
            $scope.song.pause()
            $scope.playing = false;
            generateNext();
            getTrack($scope.nextSong.uri);
        };
    }

    function thumbsUp() {

    }

    function thumbsDown() {

    }
  }

  getUser();
  getTrack('http://api.soundcloud.com/tracks/190984415');
  generateNext();
  // SC.whenStreamingReady(function() {
  //   SC.stream("/tracks/190984415", function(sound) {
  //       sound.play();
  //   });
  // });

}]);
'use strict';

angular.module('myApp.playview', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/play', {
    templateUrl: 'playview/playview.html',
    controller: 'PlayViewCtrl'
  });
}])

.controller('PlayViewCtrl', ['$scope', '$cookies', '$http', '$location', 'userService', 'AsyncQueue', function($scope, $cookies, $http, $location, userService, AsyncQueue) {

  // Initialize app with data.
  var accessToken = $cookies.soundoraCookie;
  var clientId = '8a810189684f0d6deeac1e75cbeabed6';
  $scope.clientId = '8a810189684f0d6deeac1e75cbeabed6';

  console.log(accessToken);

  // Basic check if user logged in. If not, send to sign-in page.
  if (accessToken === null) {
    $location.path("/sign-in");
  }

  SC.initialize({
    client_id: clientId,
    client_secret: '4418d9cea79b0804f69fa817d434bf72',
    redirect_uri: 'http://localhost:8000/app/callback.html',
    access_token: accessToken,
    scope: 'non-expiring'
  });

  // Disconnect Button
  $scope.disconnect = function() {
    delete $cookies.soundoraCookie;
    $location.path("/sign-in");
  };

  // Logic for play/pause features.
  $scope.play = function() {
      $scope.playing = !$scope.playing;
      if (!$scope.playing) {
          $scope.song.pause();
      } else {
          if ($scope.song.src === '') {
              $scope.song.src = $scope.stream;
          }
          $scope.song.play();
      }
  };

  // Search for users. Thanks to (http://blog.itcrowd.pl/2014/04/queueing-service-for-angularjs.html) for asyncQueue.js!
  $scope.results = [];

  // jQuery hide() animates width. We don't want this so I'm using pure JavaScript.
  $scope.showRes = function() {
    document.getElementById("results-id").style.visibility = "visible";
  }

  function doRefresh() {
    return $http.get('https://api.soundcloud.com/users.json?client_id=' + clientId + '&q=' + $scope.searchQuery)
    .then(function(data) {
      $scope.results = data.data;
      console.log($scope.results)
    });
  };

  $scope.refresh = function () {
    AsyncQueue.add(doRefresh, {timeout: 1000});
  };

  // Get User from userService
  var getUser = function(accessToken) {
    userService.getUser(accessToken)
    .then(function(data) {
      $scope.name = data.username;
      $scope.user_img = data.avatar_url;
    }, function(error) {
      console.log("Error getting user.");
    });
  };

  // Get track from userService
  var getTrack = function(trackUrl, clientId) {
    userService.getTrack(trackUrl, clientId)
    .then(function(data) {
      console.log(data.genre);
      generateNext($scope.genre, clientId);
      $scope.playing = true;
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
      $scope.song.src = $scope.stream;
      $scope.song.autoplay = true;
      $scope.song.addEventListener('timeupdate', updateProgress, false);
      $scope.song.addEventListener('ended', function() { getTrack($scope.nextSong.uri, clientId); });
      console.log("Now playing " + $scope.trackName);
      generateNext($scope.genre, clientId);
      $scope.song.addEventListener("load", function() { $scope.song.play(); }, true);
    }, function(error) {
      console.log("Error getting track.");
    });
  };

  var setTrack = function(userId, clientId) {
    if ($scope.playing) {
      $scope.song.pause();
      $scope.playing = !$scope.playing;
    };
    userService.setTrack(userId, clientId)
    .then(function(data) {
      $scope.playing = true;
      $scope.trackUrl = data[0].uri;
      $scope.trackId = data[0].id;
      $scope.genre = data[0].genre;
      $scope.trackShareUrl = data[0].permalink_url;
      $scope.trackName = data[0].title;
      $scope.artist = data[0].user.username;
      $scope.artistUrl = data[0].user.permalink_url;
      $scope.artwork = data[0].artwork_url.replace("large", "t500x500");
      $scope.wave = data[0].waveform_url;
      $scope.stream = data[0].stream_url + '?client_id=' + clientId;
      $scope.song = new Audio();
      $scope.song.src = $scope.stream;
      $scope.song.autoplay = true;
      $scope.song.addEventListener('timeupdate', updateProgress, false);
      $scope.song.addEventListener('ended', function() { getTrack($scope.nextSong.uri, clientId); });
      console.log("Now playing " + $scope.trackName);
      generateNext($scope.genre, clientId);
      $scope.song.addEventListener("load", function() { $scope.song.play(); }, true);
    }, function(error) {
      console.log("Error getting track.");
    });
  };

  // Generate next track to play.
  var generateNext = function(genre, clientId) {
    userService.generateNext(genre, clientId)
    .then(function(data) {
      $scope.nextSong = data[Math.floor(Math.random()*data.length)];
      console.log($scope.nextSong.title + " is playing NEXT!")
      console.log("Next song's genre is: " + $scope.nextSong.genre)
    }, function(error) {
      console.log("Error generating next track.");
    });
  };

  // Song progress-bar.
  function updateProgress() {
    var progress = document.getElementById("progress");
    var value = 0;
    if ($scope.song.currentTime > 0) {
      value = Math.floor((100 / $scope.song.duration) * $scope.song.currentTime);
    }
    progress.style.width = value + "%";
  }

  // Skip to next song.
  $scope.skipSong = function() {
    if ($scope.playing) {
      $scope.song.pause();
      $scope.playing = !$scope.playing;
    }
    generateNext($scope.genre, clientId);
    setTimeout(function() { getTrack($scope.nextSong.uri, clientId); }, 500);
  };

  $scope.setStation = function(userId, clientId) {
    $("#getstarted-id").hide();
    document.getElementById("results-id").style.visibility = "hidden";
    document.getElementById("fullplayer-id").style.visibility = "visible";
    setTrack(userId, clientId);
  };

  function thumbsUp() {

  }

  function thumbsDown() {

  }

  getUser(accessToken);
  // getTrack('http://api.soundcloud.com/tracks/190984415', clientId);
}]);
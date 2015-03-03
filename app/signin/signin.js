'use strict';

angular.module('myApp.signin', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/sign-in', {
    templateUrl: 'signin/signin.html',
    controller: 'SignInCtrl'
  });
}])

.controller('SignInCtrl', ['$scope', '$location', function($scope, $location) {
    $scope.connect = function() {
        SC.initialize({
          client_id: '8a810189684f0d6deeac1e75cbeabed6',
          redirect_uri: 'http://localhost:8000/app/callback.html'
        });

        // initiate auth popup
        SC.connect(function() {
          // SC.get('/me', function(me) {
          //   //alert('Hello, ' + me.username);
          // });
            $scope.$apply(function() { $location.path("/play"); });
        });
    }
}]);
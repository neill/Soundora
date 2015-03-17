'use strict';

angular.module('myApp.signin', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/sign-in', {
    templateUrl: 'signin/signin.html',
    controller: 'SignInCtrl'
  });
}])

.controller('SignInCtrl', ['$scope', '$rootScope', '$cookies', '$cookieStore', '$location', function($scope, $rootScope, $cookies, $cookieStore, $location) {
    $scope.connect = function() {
        SC.initialize({
          client_id: $rootScope.client_id,
          redirect_uri: $rootScope.redirect_uri,
        });

        // initiate auth popup
        SC.connect(function() {
          var accessToken = SC.accessToken();
          $cookies.soundoraCookie = accessToken;
          // $cookieStore.put('soundoraCookie', accessToken);
          $scope.$apply(function() { $location.path("/play"); });
        });
    };
}]);
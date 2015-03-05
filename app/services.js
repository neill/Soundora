'use strict';

angular.module('myApp.services', [])
    .service('userService', function($http, $q) {
        return {
            getUser: function(accessToken) {
                return $http.get('https://api.soundcloud.com/me.json?oauth_token=' + accessToken)
                .then(function(response) {
                    if (typeof response.data === 'object') {
                        return response.data;
                    } else {
                        return $q.reject(response.data);
                    }
                }, function(response) {
                    return $q.reject(response.data);
                });
            }
        };
    });

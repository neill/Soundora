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
            },

            getTrack: function(trackUrl, clientId) {
                return $http.get(trackUrl + '.json?client_id=' + clientId)
                .then(function(response) {
                    if (typeof response.data === 'object') {
                        return response.data;
                    } else {
                        return $q.reject(response.data);
                    }
                }, function(response) {
                    return $q.reject(response.data);
                });
            },

            generateNext: function(genre, clientId) {
                return $http.get('https://api.soundcloud.com/tracks?genres=' + genre + '&client_id=' + clientId)
                .then(function(response) {
                    if (typeof response.data === 'object') {
                        return response.data;
                    } else {
                        return $q.reject(response.data);
                    }
                }, function(response) {
                    return $q.reject(response.data);
                });
            },

            searchUsers: function(searchQuery, clientId) {
                return $http.get('https://api.soundcloud.com/users.json?client_id=' + clientId + '&q=' + searchQuery)
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
        }
    });
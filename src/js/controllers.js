
'use strict';

angular.module('app.controllers', [])

.controller('CharacterCtrl', function($scope, $http) {
    
    $scope.character = {};

    $scope.create_character = function() {
    	$http.post('/api/v1/character/create/').then(function(data) {
    		console.log(data)
    	})
    }

    $scope.get_character = function(key) {
    	var key = 'agdkZXZ-ZG5kchYLEglDaGFyYWN0ZXIYgICAgICAgAkM';

    	$http.get('/api/v1/character/' + key).then(function(data) {
    		console.log(data)
    	})
    }
})


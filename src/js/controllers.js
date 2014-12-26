
'use strict';

angular.module('app.controllers', [])

.controller('CharacterCreateCtrl', function($scope, $http, $state) {
    
    $scope.character = {};

    $scope.create_character = function() {
    	$http.post('/api/v1/character/create/', $scope.character).then(function(response) {
    		console.log(response)
    		$state.go('character-detail', {character_key: response.data.key})
    	})
    }

})

.controller('CharacterDetailCtrl', function($scope, $http, $stateParams) {
    
    $scope.character = {};

    console.log($stateParams)

    var character_key = $stateParams.character_key;

    $scope.get_character = function() {
    	$http.get('/api/v1/character/' + character_key).then(function(response) {
    		console.log(response);
    		$scope.character = response.data.character;
    	})
    }

    $scope.save_character = function() {
    	$http.post('/api/v1/character/' + character_key + '/update/', $scope.character).then(function(response) {
    		console.log(response);
    	})
    }
    $scope.get_character();
})


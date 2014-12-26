
'use strict';

angular.module('app.controllers', [])

.controller('GroupsCtrl', function($scope, $http, $state) {
    
    $scope.groups = [];
    $scope.new_group = {};

    $scope.create_group = function() {
    	$http.post('/api/v1/groups/create/', $scope.new_group).then(function(response) {
    		console.log(response)
    		$state.go('group-detail', {group_key: response.data.key})
    	})
    }

    $scope.get_groups = function() {
    	$http.get('/api/v1/groups/list').then(function(response) {
    		console.log(response)
    		$scope.groups = response.data;
    	})
    }
    $scope.get_groups();
})

.controller('GroupDetailCtrl', function($scope, $http, $state, $stateParams) {
    
    $scope.group = {};
    $scope.characters = [];
    $scope.new_character = {};

    var group_key = $stateParams.group_key;
    
    $scope.get_group_detail = function() {
    	$http.get('/api/v1/groups/' + group_key).then(function(response) {
    		console.log(response)
    		$scope.group = response.data.group;
    		$scope.characters = response.data.players;
    	})
    }
    $scope.get_group_detail();

    $scope.new_character.group = group_key;

    $scope.create_character = function() {
    	$http.post('/api/v1/character/create/', $scope.new_character).then(function(response) {
    		console.log(response)
    		$state.go('character-detail', {character_key: response.data.key})
    	})
    }
})

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



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

.controller('CharacterDetailCtrl', function($scope, $http, $timeout, $stateParams) {
    
    $scope.character = {};
    $scope.ui = {};

    console.log($stateParams)

    var character_key = $stateParams.character_key;

    $scope.get_character = function() {
    	$http.get('/api/v1/character/' + character_key).then(function(response) {
    		console.log(response);
    		$scope.character = response.data.character;

            
    	})
    }

    $scope.$watch('character', function() {
        $scope.next_level = XP_LEVELS[$scope.get_level()];
    }, true)

    $scope.save_character = function() {
        $scope.ui.saving = true;
    	$http.post('/api/v1/character/' + character_key + '/update/', $scope.character).then(function(response) {
    		console.log(response);
            $timeout(function() {
                $scope.ui.saving = false;    
            }, 3000)
            
    	}, function(error) {
            console.log(error);
            $timeout(function() {
                $scope.ui.saving = false;    
            }, 3000)
        })
    }
    $scope.get_character();

    $scope.getAbilModifier = function(score) {
        return Math.floor((score - 10) / 2);
    }
    $scope.getHalfLevel = function() {
        return Math.floor($scope.character.level / 2)
    }
    $scope.roundDown = function(score) {
        return Math.floor(score)
    }
    $scope.getInitiativeTotal =function() {
        var total = parseInt($scope.character.dexterity);
        total += parseInt($scope.getHalfLevel());
        total += parseInt($scope.character.initiative_misc);
        return total;
    }
    $scope.getDefenseTotal = function(defense) {
        var total = 10 + parseInt($scope.getHalfLevel())
        total += parseInt($scope.character[defense + '_abil'])
        total += parseInt($scope.character[defense + '_char_class'])
        total += parseInt($scope.character[defense + '_feat'])
        total += parseInt($scope.character[defense + '_enh'])
        total += parseInt($scope.character[defense + '_misc1'])
        total += parseInt($scope.character[defense + '_misc2'])
        return total
    }
    $scope.get_level = function() {
        var level = 0;
        for (var i = 0; i < XP_LEVELS.length; i++) {
            if(XP_LEVELS[i] <= $scope.character.total_xp) {
                level += 1
            }
        };
        return level;
    }
})


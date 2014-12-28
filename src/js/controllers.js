
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

    $scope.$on('character-updated', function(event, args) {
        console.log(args)
        
        var updated_char = args.character;

        for (var i = 0; i < $scope.characters.length; i++) {
            if ($scope.characters[i].key === updated_char.key) {
                $scope.characters[i] = updated_char
                break;
            }
        };

        $scope.character = args.character;
        $scope.$apply();
    })

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

        var data = {
            'name': $scope.new_character.name,  
            'group_key': group_key, 
        }

        $http.post('/api/v1/character/create/', data).then(function(response) {
            console.log(response)
            $state.go('character-detail', {character_key: response.data.character.key})
        })
    }
})

.controller('CharacterDetailCtrl', function($scope, $rootScope, $http, $timeout, $stateParams) {
    
    $scope.character = {};
    $scope.ui = {};

    console.log($rootScope)

    var character_key = $stateParams.character_key;

    $scope.get_character = function() {
    	$http.get('/api/v1/character/' + character_key).then(function(response) {
    		console.log(response);
    		$scope.character = response.data.character;
        })
    }

    $scope.$on('character-updated', function(event, args) {
        console.log(args)
        $scope.character = args.character;
        $scope.$apply();
    })

    $scope.$watch('character', function() {
        $scope.next_level_xp = XP_LEVELS[$scope.get_level()];
        $scope.current_level_xp = XP_LEVELS[$scope.get_level() - 1];
        $scope.your_xp_in_this_level = $scope.character.total_xp - $scope.current_level_xp;
        $scope.xp_in_level = $scope.next_level_xp - $scope.current_level_xp
        $scope.xp_level_progress = Math.floor(($scope.your_xp_in_this_level / $scope.xp_in_level) * 100).toFixed(0);
    }, true)

    $scope.save_character = function() {
        var data = {
            'character': $scope.character,
            'channel_token': template_values.channel_token
        }

        $scope.ui.saving = true;
    	$http.post('/api/v1/character/' + character_key + '/update/', data).then(function(response) {
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

    $scope.get_bloodied = function(hp) {
        var bloodied = $scope.roundDown(hp / 2);
        $scope.character.hp_bloodied = bloodied;
        return bloodied;

    }

    $scope.getInitiativeTotal =function() {
        var total = parseInt($scope.character.dexterity);
        total += parseInt($scope.getHalfLevel());
        total += parseInt($scope.character.initiative_misc);
        $scope.character.initiative_score = total;
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
        $scope.character[defense + '_total'] = total;
        return total
    }
    $scope.get_level = function() {
        var level = 0;
        for (var i = 0; i < XP_LEVELS.length; i++) {
            if(XP_LEVELS[i] <= $scope.character.total_xp) {
                level += 1
            }
        };
        $scope.character.level = level;
        return level;
    }
    $scope.get_speed = function() {
        var speed = parseInt($scope.character.speed_base);
        speed += parseInt($scope.character.speed_armor)
        speed += parseInt($scope.character.speed_item)
        speed += parseInt($scope.character.speed_misc)
        $scope.character.speed_total = speed;
        return speed;
    }

    $scope.get_skill_total = function(skill, ability) {
        var total = 0;

        if($scope.character[skill + '_armor_penalty']) {
            total += parseInt($scope.character[skill + '_armor_penalty'])            
        }
        if($scope.character[skill + '_trained']) {
            total += 5;
        } 
        total += $scope.getAbilModifier($scope.character[ability]) + $scope.getHalfLevel()
        total += parseInt($scope.character[skill + '_misc'])
        $scope.character[skill + '_total'] = total;
        return total
    }
})


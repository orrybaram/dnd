
'use strict';

angular.module('app.controllers', [])
    .controller('GroupsCtrl', GroupsCtrl)
    .controller('GroupDetailCtrl', GroupDetailCtrl)
    .controller('GroupDetailDashboardCtrl', GroupDetailDashboardCtrl)
    .controller('GroupDetailEncounterCtrl', GroupDetailEncounterCtrl)
    .controller('GroupDetailStoryCtrl', GroupDetailStoryCtrl)
    .controller('GroupDetailAdminCtrl', GroupDetailAdminCtrl)
    .controller('CharacterDetailCtrl', CharacterDetailCtrl)
    .controller('CharacterDetailAdvancedCtrl', CharacterDetailAdvancedCtrl)
    .controller('CharacterDetailSimpleCtrl', CharacterDetailSimpleCtrl)
    .controller('ModalInstanceCtrl', ModalInstanceCtrl)
;

function GroupsCtrl($scope, $http, $state) {

    $scope.groups = [];
    $scope.new_group = {};

    $scope.create_group = function() {
        $http.post('/api/v1/groups/create/', $scope.new_group).then(function(response) {
            console.log(response);
            $state.go('group-detail.dashboard', {group_key: response.data.key});
        });
    };

    $scope.get_groups = function() {
        $http.get('/api/v1/groups/list').then(function(response) {
            console.log(response);
            $scope.groups = response.data;
            localStorage.setItem('encounter', angular.toJson([]));
        });
    };

    $scope.groups.forEach(function(group) {
        console.log(group);
    });

    $scope.get_groups();
})
function GroupDetailCtrl($scope, $http, $state, $stateParams, $modal) {
    $scope.ui = {};
    $scope.ui.loading = false;
    $scope.group = {};

    $scope.is_admin = template_values.is_admin;

    var group_key = $stateParams.group_key;

    console.log($scope);
    $scope.characters = angular.fromJson(localStorage.getItem('characters')) || [];

    $scope.get_group_detail = function() {
        $scope.ui.loading = true;
        $http.get('/api/v1/groups/' + group_key).then(function(response) {
            console.log(response);

            $scope.group = response.data.group;
            $scope.characters = response.data.players;
            $scope.graveyard = response.data.graveyard;
            $scope.hiatus = response.data.hiatus;

            console.log("group:");
            console.log($scope.group);

            $scope.ui.loading = false;

            var _cache = [];
            $scope.characters.forEach(function(character) {
                _cache.push(character);
            });
            localStorage.setItem('characters', angular.toJson(_cache));
        });
    };

    $scope.get_group_detail();
})
function GroupDetailDashboardCtrl($scope, $rootScope, $http, $state, $stateParams, $modal) {
    $rootScope.state = $state;
    $scope.new_character = {};

    console.log($state);

    $scope.ui = {};
    $scope.ui.loading = false;

    $scope.$on('character-updated', function(event, args) {
        console.log(args);

        var updated_char = args.character;

        for (var i = 0; i < $scope.characters.length; i++) {
            if ($scope.characters[i].key === updated_char.key) {
                $scope.characters[i] = updated_char;
                break;
            }
        }

        $scope.character = args.character;
        $scope.$apply();
    });

    var group_key = $stateParams.group_key;

    function getCharacter(key) {
        for (var i = 0; i < $scope.characters.length; i++) {
            if ($scope.characters[i].key === key) {
                return $scope.characters[i];
            }
        }
    }

    $scope.new_character.group = group_key;

    $scope.create_character = function() {

        var data = {
            'name': $scope.new_character.name,
            'group_key': group_key
        };

        $http.post('/api/v1/character/create/', data).then(function(response) {
            console.log(response);
            $state.go('character-detail.advanced', {character_key: response.data.character.key});
        }, function(err) {
            alert(err.data.error);
        });
    };

    // Power Modal
    $scope.open_power_modal = function(key, id) {

        var character = getCharacter(key);

        var index = _.findIndex(character.powers, {id: id});
        var power = character.powers[index];

        var modalInstance = $modal.open({
            templateUrl: 'partials/power-modal.html',
            controller: 'ModalInstanceCtrl',
            size: 'sm',
            resolve: {
                item: function () {
                    return power;
                }
            }
        });
    };
})

function GroupDetailEncounterCtrl($scope, $rootScope, $filter, $http, $state, $stateParams, $modal) {
    $rootScope.state = $state;

    var cached_encounter_characters = angular.fromJson(localStorage.getItem('encounter'));

    if (cached_encounter_characters && cached_encounter_characters.length) {
        $scope.encounter_characters = cached_encounter_characters;
    }
    else {
        $scope.encounter_characters = angular.copy($scope.characters);
    }

    $scope.dead_guys = [];

    $scope.encounter_characters.forEach(function(character) {
        character.encounter_initiative = 0;
    });

    $scope.$watch('encounter_characters', function() {
        var _cache = [];
        $scope.encounter_characters.forEach(function(character) {
            _cache.push(character);
        });
        localStorage.setItem('encounter', angular.toJson(_cache));
    }, true);

    $scope.new_enemy_class = {};

    $scope.sort_by_initiative = function() {
        console.log($scope.characters);
        console.log('gooo');
        $scope.encounter_characters = $filter('orderBy')($scope.encounter_characters, 'encounter_initiative', true);
    };

    $scope.reset_encounter = function() {

        localStorage.removeItem('encounter');
        $scope.encounter_characters = angular.copy($scope.characters);
        $scope.encounter_characters.forEach(function(character, i) {
            character.encounter_initiative = 0;
        });
        $scope.dead_guys = [];
    };

    $scope.add_enemy_class = function() {

        $scope.new_enemy_class.type = 'enemy';
        $scope.new_enemy_class.encounter_initiative = 0;
        $scope.encounter_characters.push($scope.new_enemy_class);
        $scope.new_enemy_class = {};
    };

    $scope.kill_character = function(idx) {

        $scope.dead_guys.push($scope.encounter_characters[idx]);
        $scope.encounter_characters.splice(idx, 1);
    };

    // Power Modal
    $scope.open_power_modal = function(char_key, id) {

        var charIdx = _.findIndex($scope.encounter_characters, {key: char_key});
        var character = $scope.encounter_characters[charIdx];

        var index = _.findIndex(character.powers, {id: id});
        var power = angular.copy(character.powers[index]);

        var modalInstance = $modal.open({
            templateUrl: 'partials/power-modal.html',
            controller: 'ModalInstanceCtrl',
            size: 'sm',
            resolve: {
                item: function () {
                    return power;
                }
            }
        });
    };
})

function GroupDetailStoryCtrl($scope, $rootScope, $state, $http, $timeout, $stateParams, $modal, $log) {
    console.log($scope);
    $scope.save_group = function() {
        $scope.ui.saving = true;
        $http.post('/api/v1/groups/' + $scope.group.key + '/update/', $scope.group).then(function(response) {
            $timeout(function() {
                $scope.ui.saving = false;
            }, 3000);
        });
    };
})

function GroupDetailAdminCtrl($scope, $rootScope, $state, $http, $timeout, $stateParams, $modal, $log) {
    //if (!template_values.is_admin) {
    //    $state.go('group-detail');
    //}
    // TODO: add security on group actions like add character, make DM etc.

    $scope.ui = {};
    $scope.ui.loading = false;
    $scope.userlist = {};

    $scope.set_dm = function(user_key) {
        console.log(user_key);

        $http.post('/api/v1/groups/' + $scope.group.key + '/dm', {'user_key': user_key}).then(function(response) {
            console.log(response);
            $scope.group.dm = response.data.dm;
        });
    };

    $scope.add_member = function() {
        var data = $scope.new_member;

        $http.post('/api/v1/groups/' + $scope.group.key + '/members/add/', data).then(function(response) {
            console.log(response);
            $scope.group.members.push(response.data);
            $scope.new_member = '';
        });
    };

    $scope.delete_member = function(id) {
        var index = _.findIndex($scope.group.members, {id: id});
        var member = $scope.group.members[index];

        $scope.group.members.splice(index, 1);

        $http.post('/api/v1/groups/' + $scope.group.key + '/members/' + member.key + '/delete/').then(function(response) {
            console.log(response);
        });
    };

    $scope.delete_character = function(key) {

        $http.post('/api/v1/character/' + key + '/delete/').then(function(response) {
            console.log(response);

            var index = _.findIndex($scope.characters, { 'key': key });
            $scope.characters.splice(index, 1);
        }, function(err) {
            alert(err.data.error);
        });
    };

    $scope.kill_character = function(key) {

        $http.post('/api/v1/character/' + key + '/kill/').then(function(response) {
            console.log(response);

            var index = _.findIndex($scope.characters, { 'key': key });
            var ghost = $scope.characters[index];

            $scope.characters.splice(index, 1);
            $scope.graveyard.push(ghost);
        });
    };

    $scope.resurrect_character = function(key) {

        $http.post('/api/v1/character/' + key + '/resurrect/').then(function(response) {
            console.log(response);

            var index = _.findIndex($scope.graveyard, { 'key': key });
            var ghost = $scope.graveyard[index];

            $scope.graveyard.splice(index, 1);
            $scope.characters.push(ghost);
        });
    };

    $scope.hiatus_character = function(key) {

        $http.post('/api/v1/character/' + key + '/hiatus/').then(function(response) {
            console.log(response);

            var index = _.findIndex($scope.characters, { 'key': key });
            var traveller = $scope.characters[index];

            $scope.characters.splice(index, 1);
            $scope.hiatus.push(traveller);
        });
    };

    $scope.return_character = function(key) {

        $http.post('/api/v1/character/' + key + '/return/').then(function(response) {
            console.log(response);

            var index = _.findIndex($scope.hiatus, { 'key': key });
            var traveller = $scope.hiatus[index];

            $scope.hiatus.splice(index, 1);
            $scope.characters.push(traveller);
        });
    };

    $scope.get_user_detail = function() {
        $scope.ui.loading = true;
        $http.get('/api/v1/users/list/').then(function(response) {
            console.log(response);

            $scope.userlist = response.data;
            $scope.ui.loading = false;
        });
    };

    $scope.save_group = function() {
        console.log("hallo!")
        $scope.ui.saving = true;
        $http.post('/api/v1/groups/' + $scope.group.key + '/update/', $scope.group).then(function(response) {
            console.log(response);
            $timeout(function() {
                $scope.ui.saving = false;
            }, 3000);
        });
    };

    $scope.get_user_detail();
})

function CharacterDetailCtrl($scope, $rootScope, $state, $http, $timeout, $stateParams, $modal, $log) {

    $scope.ui = {};
    $scope.powers = DND_POWERS;
    $scope.items = DND_ITEMS;
    $scope.state = $state;
    $scope.upload = {};

    var is_editting = false;
    var character_key = $stateParams.character_key;
    var _characters = angular.fromJson(localStorage.getItem('characters'));
    var _character = _.where(_characters, {key: character_key})[0] || {};

    $scope.character = _character;

    $scope.get_character = function() {
        $http.get('/api/v1/character/' + character_key).then(function(response) {
            console.log(response);
            $scope.character = response.data.character;

            var idx = _.findIndex(_characters, {key: character_key});
            _characters[idx] = $scope.character;
            localStorage.setItem('characters', angular.toJson(_characters));
        });
    };
    $scope.get_character();

    $scope.$on('character-updated', function(event, args) {
        if(!is_editting) {
            $scope.character = args.character;
            $scope.$apply();
        }
    });

    $scope.$watch('character', function() {
        $scope.next_level_xp = XP_LEVELS[$scope.get_level()];
        $scope.current_level_xp = XP_LEVELS[$scope.get_level() - 1];
        $scope.your_xp_in_this_level = $scope.character.total_xp - $scope.current_level_xp;
        $scope.xp_in_level = $scope.next_level_xp - $scope.current_level_xp;
        $scope.xp_level_progress = Math.floor(($scope.your_xp_in_this_level / $scope.xp_in_level) * 100).toFixed(0);
    }, true);

    $scope.delete_character = function() {
        $http.post('/api/v1/character/'+$scope.character.key+'/delete').then(function(response) {
            console.log(response);
            $state.go('group-detail.dashboard', {group_key: $scope.character.group_key });
        }, function(err) {
            alert(err.data.error);
        });
    };

    $scope.save_character = function() {
        is_editting = true;
        $scope.ui.saving = true;

        var data = {
            'character': $scope.character,
            'channel_token': template_values.channel_token
        };

        $http.post('/api/v1/character/' + character_key + '/update/', data).then(function(response) {
            console.log(response);
            $timeout(function() {
                $scope.ui.saving = false;
                is_editting = false;
            }, 3000);

            // var idx = _.findIndex(_characters, {key: character_key});
            // _characters[idx] = $scope.character;
            // localStorage.setItem('characters', angular.toJson(_characters));

        }, function(error) {
            console.log(error);
            $timeout(function() {
                $scope.ui.saving = false;
                is_editting = false;
            }, 3000);
        });
    };

    $scope.upload_avatar = function() {
        $http.post('/api/v1/character/' + character_key + '/avatar/?avatar=' + $scope.upload.avatar).then(function(data) {
            console.log(data);
        });
    };

    $scope.getAbilModifier = function(score) {
        return Math.floor((score - 10) / 2);
    };

    $scope.getHalfLevel = function() {
        return Math.floor($scope.character.level / 2);
    };

    $scope.roundDown = function(score) {
        return Math.floor(score);
    };

    $scope.get_bloodied = function(hp) {
        var bloodied = $scope.roundDown(hp / 2);
        $scope.character.hp_bloodied = bloodied;
        return bloodied;

    };

    $scope.getInitiativeTotal =function() {
        var total = parseInt($scope.getAbilModifier($scope.character.dexterity));
        total += parseInt($scope.getHalfLevel());
        total += parseInt($scope.character.initiative_misc);
        $scope.character.initiative_score = total;
        return total;
    };

    $scope.getTotalAbilityScore = function(ability) {
        return parseInt($scope.character[ability]) + parseInt($scope.character[ability + '_misc_mod']);
    }

    $scope.getDefenseTotal = function(defense) {
        var total = 10 + parseInt($scope.getHalfLevel());

        total += parseInt($scope.character[defense + '_abil']);
        total += parseInt($scope.character[defense + '_char_class']);
        total += parseInt($scope.character[defense + '_feat']);
        total += parseInt($scope.character[defense + '_enh']);
        total += parseInt($scope.character[defense + '_misc1']);
        total += parseInt($scope.character[defense + '_misc2']);

        $scope.character[defense + '_total'] = total;

        return total;
    };

    $scope.get_level = function() {
        var level = 0;

        for (var i = 0; i < XP_LEVELS.length; i++) {
            if(XP_LEVELS[i] <= $scope.character.total_xp) {
                level += 1;
            }
        }

        $scope.character.level = level;

        return level;
    };

    $scope.get_speed = function() {
        var speed = parseInt($scope.character.speed_base);
        speed += parseInt($scope.character.speed_armor);
        speed += parseInt($scope.character.speed_item);
        speed += parseInt($scope.character.speed_misc);
        $scope.character.speed_total = speed;
        return speed;
    };

    $scope.get_skill_total = function(skill, ability) {
        var total = 0;

        if($scope.character[skill + '_armor_penalty']) {
            total += parseInt($scope.character[skill + '_armor_penalty']);
        }
        if($scope.character[skill + '_trained']) {
            total += 5;
        }
        total += $scope.getAbilModifier($scope.character[ability]) + $scope.getHalfLevel();
        total += parseInt($scope.character[skill + '_misc']);
        $scope.character[skill + '_total'] = total;
        return total;
    };


    // Power Modal
    $scope.open_power_modal = function(id) {
        var index = _.findIndex($scope.character.powers, {id: id});
        var power = angular.copy($scope.character.powers[index]);

        var modalInstance = $modal.open({
            templateUrl: 'partials/power-modal.html',
            controller: 'ModalInstanceCtrl',
            size: 'sm',
            resolve: {
                item: function () {
                    return power;
                }
            }
        });
    };

    // Item Modal
    $scope.open_item_modal = function(id) {
        var index = _.findIndex($scope.character.items, {id: id});
        var item = angular.copy($scope.character.items[index]);

        var modalInstance = $modal.open({
            templateUrl: 'partials/item-modal.html',
            controller: 'ModalInstanceCtrl',
            size: 'sm',
            resolve: {
                item: function () {
                    return item;
                }
            }
        });
    };

    // Weapon Modal
    $scope.open_weapon_modal = function(id) {
        var index = _.findIndex($scope.character.weapons, {id: id});
        var weapon = angular.copy($scope.character.weapons[index]);

        var modalInstance = $modal.open({
            templateUrl: 'partials/item-modal.html',
            controller: 'ModalInstanceCtrl',
            size: 'sm',
            resolve: {
                item: function () {
                    return weapon;
                }
            }
        });
    };

    // Item Modal
    $scope.open_upload_modal = function(id) {
        var character = angular.copy($scope.character);

        var modalInstance = $modal.open({
            templateUrl: 'partials/upload-modal.html',
            controller: 'ModalInstanceCtrl',
            size: 'sm',
            resolve: {
                item: function () {
                    return character;
                }
            }
        });
    };
})

function CharacterDetailAdvancedCtrl($scope, $rootScope, $state, $http, $timeout, $stateParams, $modal, $log) {

    var character_key = $stateParams.character_key;

    $scope.add_power = function() {
        var data = $scope.new_power;

        $http.post('/api/v1/character/' + character_key + '/powers/add/', data).then(function(response) {
            $scope.character.powers.push(response.data);
            $scope.new_power = '';
        });
    };

    $scope.delete_power = function(id) {
        var index = _.findIndex($scope.character.powers, {id: id});
        var power = $scope.character.powers[index];

        $scope.character.powers.splice(index, 1);

        $http.post('/api/v1/character/' + character_key + '/powers/' + power.key + '/delete/').then(function(response) {
            console.log(response);
        });
    };

    $scope.add_item = function() {
        var data = $scope.new_item;
        $http.post('/api/v1/character/' + character_key + '/items/add/', data).then(function(response) {
            console.log(response);
            $scope.character.items.push(response.data);
            $scope.new_item = '';
        });
    };

    $scope.delete_item = function(id) {
        var index = _.findIndex($scope.character.items, {id: id});
        var item = $scope.character.items[index];

        $scope.character.items.splice(index, 1);

        $http.post('/api/v1/character/' + character_key + '/items/' + item.key + '/delete/').then(function(response) {
            console.log(response);
        });
    };

    $scope.add_weapon = function() {
        var data = $scope.new_weapon;
        $http.post('/api/v1/character/' + character_key + '/weapons/add/', data).then(function(response) {
            console.log(response);
            $scope.character.weapons.push(response.data);
            $scope.new_weapon = '';
        });
    };

    $scope.update_weapon = function(weapon_idx) {
        var weapon_data = $scope.$parent.character.weapons[weapon_idx];
        $http.post('/api/v1/character/' + character_key + '/weapons/' + weapon_data.key + '/update/', weapon_data).then(function(response) {
            console.log(response);
        });
    };

    $scope.delete_weapon = function(id) {
        var index = _.findIndex($scope.character.weapons, {id: id});
        var weapon = $scope.character.weapons[index];

        $scope.character.weapons.splice(index, 1);

        $http.post('/api/v1/character/' + character_key + '/weapons/' + item.key + '/delete/').then(function(response) {
            console.log(response);
        });
    };
})

function CharacterDetailSimpleCtrl($scope, $rootScope, $state, $http, $timeout, $stateParams, $modal, $log) {

})

function ModalInstanceCtrl ($scope, $modalInstance, item) {
    $scope.item = item;

    $scope.close = function () {
        $modalInstance.close();
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});


const {XP_LEVELS, RESERVED_POWER_TRAITS} = require("data/dnd-data");
const DND_POWERS = require("data/powers");
const DND_ITEMS = require("data/items");
const DND_FEATS = require("data/feats");

module.exports = CharacterDetailCtrl;

/** @ngInject */
function CharacterDetailCtrl($scope, $rootScope, $state, $http, $timeout, $stateParams, $uibModal, $log, Powers, Items, Feats) {

    $scope.ui = {};
    $scope.powers = Powers;
    $scope.items = Items;
    $scope.feats = Feats;
    $scope.state = $state;
    $scope.upload = {};

    var is_editting = false;
    var character_key = $stateParams.character_key;
    var _characters = angular.fromJson(localStorage.getItem('characters'));
    var _character = _characters.filter(function(x) {
        return x.key = character_key;
    });

    console.log(_character)

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
        if(!is_editting && $scope.character.key === args.character.key) {
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

        var modalInstance = $uibModal.open({
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

        var modalInstance = $uibModal.open({
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

        var modalInstance = $uibModal.open({
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

    // Feat Modal
    $scope.open_feat_modal = function(id) {
        var index = _.findIndex($scope.character.feats, {id: id});
        var feat = angular.copy($scope.character.feats[index]);

        var modalInstance = $uibModal.open({
            templateUrl: 'partials/item-modal.html',
            controller: 'ModalInstanceCtrl',
            size: 'sm',
            resolve: {
                item: function () {
                    return feat;
                }
            }
        });
    };

    // Upload Avatar Modal
    $scope.open_upload_modal = function(id) {
        var character = angular.copy($scope.character);

        var modalInstance = $uibModal.open({
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
}
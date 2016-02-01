const {XP_LEVELS, RESERVED_POWER_TRAITS} = require("data/dnd-data");

module.exports = CharacterDetailCtrl;

/** @ngInject */
function CharacterDetailCtrl($scope, $rootScope, $state, $http, $timeout, $stateParams, $uibModal, $log, Powers, Items, Feats) {

    $scope.ui = {};
    $scope.powers = Powers;
    $scope.items = Items;
    $scope.feats = [];
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

    $scope.get_character = get_character;
    $scope.delete_character = delete_character;
    $scope.save_character = save_character;
    $scope.upload_avatar = upload_avatar;
    $scope.getAbilModifier = getAbilModifier;
    $scope.getInitiativeTotal = getInitiativeTotal;
    $scope.getHalfLevel = getHalfLevel;
    $scope.roundDown = roundDown;
    $scope.get_bloodied = get_bloodied;
    $scope.getTotalAbilityScore = getTotalAbilityScore;
    $scope.getDefenseTotal = getDefenseTotal;
    $scope.get_level = get_level;
    $scope.get_speed = get_speed;
    $scope.get_skill_total = get_skill_total;
    $scope.open_power_modal = open_power_modal;
    $scope.open_item_modal = open_item_modal;
    $scope.open_weapon_modal = open_weapon_modal;
    $scope.open_feat_modal = open_feat_modal;
    $scope.open_upload_modal = open_upload_modal;
    $scope.open_create_feat_modal = open_create_feat_modal;

   
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


    Feats.get().then(function(feats) {
        $scope.feats = feats;
        console.log($scope.feats)
    });


    function get_character() {
        $http.get('/api/v1/character/' + character_key).then(function(response) {
            console.log(response);
            $scope.character = response.data.character;

            var idx = _.findIndex(_characters, {key: character_key});
            _characters[idx] = $scope.character;
            localStorage.setItem('characters', angular.toJson(_characters));
        });
    }

    function delete_character() {
        $http.post('/api/v1/character/'+$scope.character.key+'/delete').then(function(response) {
            console.log(response);
            $state.go('group-detail.dashboard', {group_key: $scope.character.group_key });
        }, function(err) {
            alert(err.data.error);
        });
    }

    function save_character() {
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
    }

    function upload_avatar() {
        $http.post('/api/v1/character/' + character_key + '/avatar/?avatar=' + $scope.upload.avatar).then(function(data) {
            console.log(data);
        });
    }

    function getAbilModifier(score) {
        return Math.floor((score - 10) / 2);
    }

    function getHalfLevel() {
        return Math.floor($scope.character.level / 2);
    }

    function roundDown(score) {
        return Math.floor(score);
    }

    function get_bloodied(hp) {
        var bloodied = $scope.roundDown(hp / 2);
        $scope.character.hp_bloodied = bloodied;
        return bloodied;

    }

    function getInitiativeTotal() {
        var total = parseInt($scope.getAbilModifier($scope.character.dexterity));
        total += parseInt($scope.getHalfLevel());
        total += parseInt($scope.character.initiative_misc);
        $scope.character.initiative_score = total;
        return total;
    }

    function getTotalAbilityScore(ability) {
        return parseInt($scope.character[ability]) + parseInt($scope.character[ability + '_misc_mod']);
    }

    function getDefenseTotal(defense) {
        var total = 10 + parseInt($scope.getHalfLevel());

        total += parseInt($scope.character[defense + '_abil']);
        total += parseInt($scope.character[defense + '_char_class']);
        total += parseInt($scope.character[defense + '_feat']);
        total += parseInt($scope.character[defense + '_enh']);
        total += parseInt($scope.character[defense + '_misc1']);
        total += parseInt($scope.character[defense + '_misc2']);

        $scope.character[defense + '_total'] = total;

        return total;
    }

    function get_level() {
        var level = 0;

        for (var i = 0; i < XP_LEVELS.length; i++) {
            if(XP_LEVELS[i] <= $scope.character.total_xp) {
                level += 1;
            }
        }

        $scope.character.level = level;

        return level;
    }

    function get_speed() {
        var speed = parseInt($scope.character.speed_base);
        speed += parseInt($scope.character.speed_armor);
        speed += parseInt($scope.character.speed_item);
        speed += parseInt($scope.character.speed_misc);
        $scope.character.speed_total = speed;
        return speed;
    }

    function get_skill_total(skill, ability) {
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
    }


    // Power Modal
    function open_power_modal(id) {
        var index = _.findIndex($scope.character.powers, {id: id});
        var power = angular.copy($scope.character.powers[index]);

        var modalInstance = $uibModal.open({
            templateUrl: 'components/modals/power-modal/index.html',
            controller: 'BaseModalCtrl',
            size: 'sm',
            resolve: {
                item: function () {
                    return power;
                }
            }
        });
    }

    // Item Modal
    function open_item_modal(id) {
        var index = _.findIndex($scope.character.items, {id: id});
        var item = angular.copy($scope.character.items[index]);

        var modalInstance = $uibModal.open({
            templateUrl: 'components/modals/item-modal/index.html',
            controller: 'BaseModalCtrl',
            size: 'sm',
            resolve: {
                item: function () {
                    return item;
                }
            }
        });
    }

    // Weapon Modal
    function open_weapon_modal(id) {
        var index = _.findIndex($scope.character.weapons, {id: id});
        var weapon = angular.copy($scope.character.weapons[index]);

        var modalInstance = $uibModal.open({
            templateUrl: 'components/modals/item-modal/index.html',
            controller: 'BaseModalCtrl',
            size: 'sm',
            resolve: {
                item: function () {
                    return weapon;
                }
            }
        });
    }

    // Feat Modal
    function open_feat_modal(id) {
        var index = _.findIndex($scope.character.feats, {id: id});
        var feat = angular.copy($scope.character.feats[index]);

        var modalInstance = $uibModal.open({
            templateUrl: 'components/modals/item-modal/index.html',
            controller: 'BaseModalCtrl',
            size: 'sm',
            resolve: {
                item: function () {
                    return feat;
                }
            }
        });
    }

    // Upload Avatar Modal
    function open_upload_modal(id) {
        var character = angular.copy($scope.character);

        var modalInstance = $uibModal.open({
            templateUrl: 'components/modals/upload-modal/index.html',
            controller: 'BaseModalCtrl',
            size: 'sm',
            resolve: {
                item: function () {
                    return character;
                }
            }
        });
    }

    // Upload Avatar Modal
    function open_create_feat_modal(id) {
        
        var modalInstance = $uibModal.open({
            templateUrl: 'components/modals/create-feat-modal/index.html',
            controller: 'CreateFeatModalCtrl',
            size: 'sm',
            resolve: {
                item: function () {
                    return {};
                }
            }
        });
    }
}
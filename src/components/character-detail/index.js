const {XP_LEVELS} = require("data/dnd-data");

module.exports = CharacterDetailCtrl;

/** @ngInject */
function CharacterDetailCtrl($scope, $rootScope, $state, $http, $timeout, $stateParams, $uibModal, $log, Character, Powers, Items, Feats) {

    $scope.ui = {};
    $scope.powers = Powers;
    $scope.items = Items.items;
    $scope.feats = [];
    $scope.state = $state;
    $scope.upload = {};
    $scope.featsLoading = true;

    var is_editting = false;
    var character_key = $stateParams.character_key;
    // var _characters = angular.fromJson(localStorage.getItem('characters'));
    // var _character = _characters.filter(function(x) {
    //     return x.key = character_key;
    // });

    $scope.character = {};

    $scope.delete_character = delete_character;
    $scope.save_character = save_character;
    
    $scope.getAbilModifier = Character.getAbilModifier;
    $scope.getInitiativeTotal = Character.getInitiativeTotal;
    $scope.getHalfLevel = Character.getHalfLevel;
    $scope.roundDown = Character.roundDown;
    $scope.getBloodied = Character.getBloodied;
    $scope.getTotalAbilityScore = Character.getTotalAbilityScore;
    $scope.getDefenseTotal = Character.getDefenseTotal;
    $scope.getLevel = Character.getLevel;
    $scope.getSpeed = Character.getSpeed;
    $scope.getSkillTotal = Character.getSkillTotal;
    
    $scope.open_power_modal = open_power_modal;
    $scope.open_item_modal = open_item_modal;
    $scope.open_weapon_modal = open_weapon_modal;
    $scope.open_feat_modal = open_feat_modal;
    $scope.open_upload_modal = open_upload_modal;
    $scope.open_create_feat_modal = open_create_feat_modal;

   
    $scope.$on('character-updated', function(event, args) {
        if(!is_editting && $scope.character.key === args.character.key) {
            $scope.character = args.character;
            $scope.$apply();
        }
    });

    $scope.$on('fetched-character', function(evt, data) {
        console.log('character loaded');
        $scope.character = data;
    });

    $scope.$on('fetched-feats', function(evt, data) {
        console.log('feats loaded');
        $scope.feats = data;
        $scope.featsLoading = false;
    });

    $scope.$watch('character', function() {
        $scope.next_level_xp = XP_LEVELS[$scope.getLevel()];
        $scope.current_level_xp = XP_LEVELS[$scope.getLevel() - 1];
        $scope.your_xp_in_this_level = $scope.character.total_xp - $scope.current_level_xp;
        $scope.xp_in_level = $scope.next_level_xp - $scope.current_level_xp;
        $scope.xp_level_progress = Math.floor(($scope.your_xp_in_this_level / $scope.xp_in_level) * 100).toFixed(0);
    }, true);

    Character.fetch(character_key).then(function(res) {
        $scope.character = res;
    });
    

    function delete_character(character_key) {
        Character.remove(character_key).then(function() {
            $state.go('group-detail.dashboard', {group_key: $scope.character.group_key });
        });
    }

    function save_character() {
        is_editting = true;
        $scope.ui.saving = true;

        var data = {
            'character': $scope.character,
            'channel_token': template_values.channel_token
        };

        Character.update(data).then(function(response) {
            $timeout(function() {
                $scope.ui.saving = false;
                is_editting = false;
            }, 3000);
        }, function(error) {
            $timeout(function() {
                $scope.ui.saving = false;
                is_editting = false;
            }, 3000);
        });
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
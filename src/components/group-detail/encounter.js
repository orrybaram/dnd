module.exports = GroupDetailEncounterCtrl;

/** @ngInject */
function GroupDetailEncounterCtrl($scope, $rootScope, $filter, $http, $state, $stateParams, $uibModal) {
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
}
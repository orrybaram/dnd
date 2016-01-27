module.exports = CharacterDetailAdvancedCtrl;

/** @ngInject */
function CharacterDetailAdvancedCtrl($scope, $rootScope, $state, $http, $timeout, $stateParams, $uibModal, $log) {

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

        $http.post('/api/v1/character/' + character_key + '/powers/' + power.key + '/delete/')
            .then(function(response) {
                console.log(response);
            })
        ;
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

        $http.post('/api/v1/character/' + character_key + '/weapons/' + weapon.key + '/delete/').then(function(response) {
            console.log(response);
        });
    };
}
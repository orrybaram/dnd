module.exports = CharacterDetailAdvancedCtrl;

/** @ngInject */
function CharacterDetailAdvancedCtrl($scope, $rootScope, $state, $http, $timeout, $stateParams, $uibModal, $log) {

    $rootScope.minimizeToolbar = false;
    
    var character_key = $stateParams.character_key;

    $scope.add_power = add_power;
    $scope.delete_power = delete_power;
    $scope.add_item = add_item;
    $scope.delete_item = delete_item;
    $scope.add_feat = add_feat;
    $scope.delete_feat = delete_feat;
    $scope.create_feat = create_feat;
    $scope.add_weapon = add_weapon;
    $scope.update_weapon = update_weapon;
    $scope.delete_weapon = delete_weapon;

    $scope.$watch("new_feat", function(newFeat) {
        console.log(newFeat);
        if(!newFeat) {
            $scope.noFeatResults = false;
        }
    });

    function add_power() {
        var data = $scope.new_power;

        $http.post('/api/v1/character/' + character_key + '/powers/add/', data).then(function(response) {
            $scope.character.powers.push(response.data);
            $scope.new_power = '';
        });
    }

    function delete_power(id) {
        var index = _.findIndex($scope.character.powers, {id: id});
        var power = $scope.character.powers[index];

        $scope.character.powers.splice(index, 1);

        $http.post('/api/v1/character/' + character_key + '/powers/' + power.key + '/delete/')
            .then(function(response) {
                console.log(response);
            })
        ;
    }

    function add_item() {
        var data = $scope.new_item;
        $http.post('/api/v1/character/' + character_key + '/items/add/', data).then(function(response) {
            console.log(response);
            $scope.character.items.push(response.data);
            $scope.new_item = '';
        });
    }

    function delete_item(id) {
        var index = _.findIndex($scope.character.items, {id: id});
        var item = $scope.character.items[index];

        $scope.character.items.splice(index, 1);

        $http.post('/api/v1/character/' + character_key + '/items/' + item.key + '/delete/').then(function(response) {
            console.log(response);
        });
    }

    function add_feat() {
        var data = $scope.new_feat;
        $http.post('/api/v1/character/' + character_key + '/feats/add/', data).then(function(response) {
            console.log(response);
            $scope.character.feats.push(response.data);
            $scope.new_feat = '';
        });
    }

    function delete_feat(id) {
        var index = _.findIndex($scope.character.feats, {id: id});
        var feat = $scope.character.feats[index];

        $scope.character.feats.splice(index, 1);

        $http.post('/api/v1/character/' + character_key + '/feats/' + feat.key + '/delete/').then(function(response) {
            console.log(response);
        });
    }

    function create_feat() {
        console.log("ehh wahassup!")
    }


    function add_weapon() {
        var data = $scope.new_weapon;
        $http.post('/api/v1/character/' + character_key + '/weapons/add/', data).then(function(response) {
            console.log(response);
            $scope.character.weapons.push(response.data);
            $scope.new_weapon = '';
        });
    }

    function update_weapon(weapon_idx) {
        var weapon_data = $scope.$parent.character.weapons[weapon_idx];
        $http.post('/api/v1/character/' + character_key + '/weapons/' + weapon_data.key + '/update/', weapon_data).then(function(response) {
            console.log(response);
        });
    }

    function delete_weapon(id) {
        var index = _.findIndex($scope.character.weapons, {id: id});
        var weapon = $scope.character.weapons[index];

        $scope.character.weapons.splice(index, 1);

        $http.post('/api/v1/character/' + character_key + '/weapons/' + weapon.key + '/delete/').then(function(response) {
            console.log(response);
        });
    }
}
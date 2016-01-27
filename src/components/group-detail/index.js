module.exports = GroupDetailCtrl;

/** @ngInject */
function GroupDetailCtrl($scope, $http, $state, $stateParams, $uibModal) {
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
}
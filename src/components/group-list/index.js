module.exports = GroupsCtrl;

/** @ngInject */
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
}
module.exports = GroupDetailStoryCtrl;

/** @ngInject */
function GroupDetailStoryCtrl($scope, $rootScope, $state, $http, $timeout, $stateParams, $uibModal, $log) {
    console.log($scope);
    $scope.save_group = function() {
        $scope.ui.saving = true;
        $http.post('/api/v1/groups/' + $scope.group.key + '/update/', $scope.group).then(function(response) {
            $timeout(function() {
                $scope.ui.saving = false;
            }, 3000);
        });
    };
}
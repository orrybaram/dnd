module.exports = GroupDetailAdminCtrl;

/** @ngInject */
function GroupDetailAdminCtrl($scope, $rootScope, $state, $http, $timeout, $stateParams, $uibModal, $log) {
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
}

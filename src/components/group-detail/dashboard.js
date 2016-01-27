module.exports = GroupDetailDashboardCtrl;

/** @ngInject */
function GroupDetailDashboardCtrl($scope, $rootScope, $http, $state, $stateParams, $uibModal) {
    $rootScope.state = $state;
    $scope.new_character = {};

    console.log($state);

    $scope.ui = {};
    $scope.ui.loading = false;

    $scope.$on('character-updated', function(event, args) {
        console.log(args);

        var updated_char = args.character;

        for (var i = 0; i < $scope.characters.length; i++) {
            if ($scope.characters[i].key === updated_char.key) {
                $scope.characters[i] = updated_char;
                break;
            }
        }

        $scope.character = args.character;
        $scope.$apply();
    });

    var group_key = $stateParams.group_key;

    function getCharacter(key) {
        for (var i = 0; i < $scope.characters.length; i++) {
            if ($scope.characters[i].key === key) {
                return $scope.characters[i];
            }
        }
    }

    $scope.new_character.group = group_key;

    $scope.create_character = function() {

        var data = {
            'name': $scope.new_character.name,
            'group_key': group_key
        };

        $http.post('/api/v1/character/create/', data).then(function(response) {
            console.log(response);
            $state.go('character-detail.advanced', {character_key: response.data.character.key});
        }, function(err) {
            alert(err.data.error);
        });
    };

    // Power Modal
    $scope.open_power_modal = function(key, id) {

        var character = getCharacter(key);

        var index = _.findIndex(character.powers, {id: id});
        var power = character.powers[index];

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
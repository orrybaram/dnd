const _ = require("lodash");

angular.module('app.controllers', [])
    .controller('GroupsCtrl', require("components/group-list"))
    .controller('GroupDetailCtrl', require("components/group-detail"))
    .controller('GroupDetailDashboardCtrl', require("components/group-detail/dashboard"))
    .controller('GroupDetailEncounterCtrl', require("components/group-detail/encounter"))
    .controller('GroupDetailStoryCtrl', require("components/group-detail/story"))
    .controller('GroupDetailAdminCtrl', require("components/group-detail/admin"))
    .controller('CharacterDetailCtrl', require("components/character-detail"))
    .controller('CharacterDetailAdvancedCtrl', require("components/character-detail/advanced"))
    .controller('CharacterDetailSimpleCtrl', require("components/character-detail/simple"))
    .controller('CharacterDetailPowersCtrl', require("components/character-detail/powers"))
    .controller('CharacterDetailNotesCtrl', require("components/character-detail/notes"))
    .controller('ModalInstanceCtrl', ModalInstanceCtrl)
;


/** @ngInject */
function ModalInstanceCtrl ($scope, $uibModalInstance, item) {
    $scope.item = item;

    $scope.close = function () {
        $uibModalInstance.close();
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}


module.exports = BaseModalCtrl;


/** @ngInject */
function BaseModalCtrl ($scope, $uibModalInstance, item) {
    $scope.item = item;

    $scope.close = function () {
        $uibModalInstance.close();
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}
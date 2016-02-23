module.exports = BaseModalCtrl;


/** @ngInject */
function BaseModalCtrl ($scope, $uibModalInstance, item) {
    $scope.item = item;

    console.log(item)

    $scope.close = function () {
        $uibModalInstance.close();
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}